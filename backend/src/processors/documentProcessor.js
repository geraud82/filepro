const { spawn, execFile } = require("child_process");
const { promisify } = require("util");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");
const os = require("os");
const { v4: uuidv4 } = require("uuid");

const pdfParse = require("pdf-parse");
const { Document, Packer, Paragraph } = require("docx");

const config = require("../config/config");
const logger = require("../utils/logger");

const execFileAsync = promisify(execFile);

// Windows executables
const SOFFICE_PATH = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";
const GHOSTSCRIPT_PATH = "C:\\Program Files\\gs\\gs10.06.0\\bin\\gswin64c.exe";

// OCR tools (set in .env)
const TESSERACT_PATH = process.env.TESSERACT_PATH || "tesseract";
const PDFTOPPM_PATH = process.env.PDFTOPPM_PATH || "pdftoppm";

/* ===================== helpers ===================== */

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function findNewestFile(dir, ext) {
  const files = await fsp.readdir(dir);
  let newest = null;
  for (const file of files) {
    if (!file.toLowerCase().endsWith(ext)) continue;
    const full = path.join(dir, file);
    const stat = await fsp.stat(full);
    if (!newest || stat.mtimeMs > newest.mtimeMs) newest = { full, mtimeMs: stat.mtimeMs };
  }
  return newest?.full || null;
}

async function listFiles(dir) {
  try { return await fsp.readdir(dir); } catch { return []; }
}

function spawnWithTimeout(cmd, args, timeoutMs = 180000) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { windowsHide: true });
    let stdout = "";
    let stderr = "";
    let killed = false;

    const timer = setTimeout(() => {
      killed = true;
      try { child.kill(); } catch {}
    }, timeoutMs);

    child.stdout?.on("data", d => (stdout += d.toString()));
    child.stderr?.on("data", d => (stderr += d.toString()));

    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, killed });
    });
  });
}

async function safeProgress(onProgress, pct) {
  if (typeof onProgress !== "function") return;
  const safe = Math.max(0, Math.min(100, Number(pct) || 0));
  await onProgress(safe);
}

/**
 * Detect “scanned” PDFs (heuristic):
 * - Extract text via pdf-parse
 * - If extracted text is tiny, treat as scanned/image-only
 */
async function isLikelyScannedPDF(pdfPath) {
  try {
    const dataBuffer = await fsp.readFile(pdfPath);
    const parsed = await pdfParse(dataBuffer);
    const text = (parsed.text || "").replace(/\s+/g, " ").trim();
    // threshold: tune as needed
    return text.length < 50;
  } catch (e) {
    // If parsing fails, treat as scanned/unsupported
    return true;
  }
}

/**
 * Simple fallback: extract whatever text exists in PDF -> DOCX
 */
async function simplePdfToDocx(pdfPath, outDocxPath, onProgress) {
  await safeProgress(onProgress, 30);
  
  try {
    const dataBuffer = await fsp.readFile(pdfPath);
    const data = await pdfParse(dataBuffer);
    const text = (data.text || "").trim();
    
    await safeProgress(onProgress, 60);
    
    // Create DOCX with extracted text
    const paragraphs = text
      .split(/\n+/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => new Paragraph(line));
    
    const doc = new Document({
      sections: [{ 
        properties: {}, 
        children: paragraphs.length ? paragraphs : [new Paragraph("No text could be extracted from this PDF.")] 
      }]
    });
    
    const buffer = await Packer.toBuffer(doc);
    await fsp.writeFile(outDocxPath, buffer);
    
    await safeProgress(onProgress, 95);
  } catch (err) {
    logger.error("Simple PDF extraction error:", err);
    // Create empty DOCX with error message
    const doc = new Document({
      sections: [{ 
        properties: {}, 
        children: [new Paragraph("Could not extract text from this PDF. The file may be image-based or corrupted.")]
      }]
    });
    
    const buffer = await Packer.toBuffer(doc);
    await fsp.writeFile(outDocxPath, buffer);
    await safeProgress(onProgress, 95);
  }
}

/**
 * OCR: PDF -> images (pdftoppm) -> tesseract each page -> build DOCX
 */
async function ocrPdfToDocx(pdfPath, outDocxPath, workDir, onProgress) {
  ensureDir(workDir);

  await safeProgress(onProgress, 20);

  // 1) Render PDF pages to PNG images
  // Output files: page-1.png, page-2.png ...
  const prefix = path.join(workDir, "page");
  
  let render;
  try {
    render = await spawnWithTimeout(
      PDFTOPPM_PATH,
      ["-png", "-r", "200", pdfPath, prefix], // 200 DPI decent quality
      300000
    );
  } catch (err) {
    // If pdftoppm is not available, fall back to simple text extraction
    if (err.code === 'ENOENT') {
      logger.warn("pdftoppm not found, using simple text extraction fallback");
      return await simplePdfToDocx(pdfPath, outDocxPath, onProgress);
    }
    throw err;
  }

  if (render.killed) throw new Error("pdftoppm timed out");
  if (render.code !== 0) {
    throw new Error(`pdftoppm failed: ${render.stderr || render.stdout || "unknown error"}`);
  }

  const files = (await listFiles(workDir)).filter(f => f.toLowerCase().endsWith(".png"));
  files.sort((a, b) => a.localeCompare(b));

  if (files.length === 0) {
    throw new Error("OCR failed: no images generated from PDF (pdftoppm)");
  }

  // 2) OCR each page
  let fullText = "";
  for (let i = 0; i < files.length; i++) {
    const imgPath = path.join(workDir, files[i]);
    const txtOut = path.join(workDir, `ocr_${i + 1}`);

    // tesseract input outputBase -l eng
    const ocr = await spawnWithTimeout(
      TESSERACT_PATH,
      [imgPath, txtOut, "-l", "eng"],
      300000
    );

    if (ocr.killed) throw new Error("tesseract timed out");
    if (ocr.code !== 0) {
      throw new Error(`tesseract failed on page ${i + 1}: ${ocr.stderr || ocr.stdout || "unknown error"}`);
    }

    const txtFile = `${txtOut}.txt`;
    const pageText = (await fsp.readFile(txtFile, "utf8")).trim();
    fullText += (pageText ? pageText : "") + "\n\n";

    const pct = 20 + Math.round(((i + 1) / files.length) * 60);
    await safeProgress(onProgress, pct);
  }

  // 3) Create DOCX from OCR text (basic text doc)
  const paragraphs = fullText
    .split(/\n{2,}/)
    .map(block => block.trim())
    .filter(Boolean)
    .map(block => new Paragraph(block));

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs.length ? paragraphs : [new Paragraph("")] }]
  });

  const buffer = await Packer.toBuffer(doc);
  await fsp.writeFile(outDocxPath, buffer);

  await safeProgress(onProgress, 95);
}

/* ===================== processor ===================== */

class DocumentProcessor {
  /**
   * Convert documents
   * @param {string} inputPath
   * @param {string} inputFormat
   * @param {string} outputFormat
   * @param {(pct:number)=>Promise<void>} onProgress
   */
  async convert(inputPath, inputFormat, outputFormat, onProgress) {
    try {
      ensureDir(config.storage.outputDir);

      const jobId = uuidv4();
      const jobDir = path.join(config.storage.outputDir, `job_${jobId}`);
      ensureDir(jobDir);

      const outputFileName = `${jobId}.${outputFormat}`;
      const outputPath = path.join(config.storage.outputDir, outputFileName);

      logger.info(`Converting document: ${inputFormat} -> ${outputFormat}`);

      // --- PDF -> DOCX ---
      if (inputFormat === "pdf" && outputFormat === "docx") {
        const resolvedInput = path.resolve(inputPath);

        await safeProgress(onProgress, 5);

        // Detect scanned
        const scanned = await isLikelyScannedPDF(resolvedInput);
        logger.info(`PDF scanned detection: ${scanned}`);

        // If scanned => try OCR, but fall back to simple extraction if tools unavailable
        if (scanned) {
          logger.info("Low text detected in PDF, using text extraction...");
          try {
            const ocrDir = path.join(jobDir, "ocr_work");
            await ocrPdfToDocx(resolvedInput, outputPath, ocrDir, onProgress);
            await safeProgress(onProgress, 100);
            return { outputPath, outputFileName, method: "ocr" };
          } catch (err) {
            // If OCR tools not available, use simple extraction
            logger.warn("OCR failed, using simple text extraction:", err.message);
            await simplePdfToDocx(resolvedInput, outputPath, onProgress);
            await safeProgress(onProgress, 100);
            return { outputPath, outputFileName, method: "simple-extraction" };
          }
        }

        // Try LibreOffice 2-step: PDF -> ODT -> DOCX
        try {
          await safeProgress(onProgress, 15);

          const profileDir = path.join(jobDir, "lo_profile");
          ensureDir(profileDir);
          const profileUrl = `file:///${profileDir.replace(/\\/g, "/")}`;

          // STEP 1: PDF -> ODT
          const r1 = await spawnWithTimeout(SOFFICE_PATH, [
            "--headless",
            "--nologo",
            "--nofirststartwizard",
            "--norestore",
            `-env:UserInstallation=${profileUrl}`,
            "--convert-to",
            "odt",
            "--outdir",
            jobDir,
            resolvedInput
          ], 180000);

          if (r1.killed || r1.code !== 0) {
            throw new Error(`LibreOffice PDF->ODT failed: ${r1.stderr || r1.stdout || "unknown error"}`);
          }

          await safeProgress(onProgress, 45);

          const odtFile = await findNewestFile(jobDir, ".odt");
          if (!odtFile) {
            throw new Error(`LibreOffice did not produce ODT. Files: ${(await listFiles(jobDir)).join(", ")}`);
          }

          // STEP 2: ODT -> DOCX
          const r2 = await spawnWithTimeout(SOFFICE_PATH, [
            "--headless",
            "--nologo",
            "--nofirststartwizard",
            "--norestore",
            `-env:UserInstallation=${profileUrl}`,
            "--convert-to",
            'docx:"MS Word 2007 XML"',
            "--outdir",
            jobDir,
            odtFile
          ], 180000);

          if (r2.killed || r2.code !== 0) {
            throw new Error(`LibreOffice ODT->DOCX failed: ${r2.stderr || r2.stdout || "unknown error"}`);
          }

          await safeProgress(onProgress, 85);

          const docxFile = await findNewestFile(jobDir, ".docx");
          if (!docxFile) {
            throw new Error(`LibreOffice did not produce DOCX. Files: ${(await listFiles(jobDir)).join(", ")}`);
          }

          fs.renameSync(docxFile, outputPath);
          await safeProgress(onProgress, 100);

          return { outputPath, outputFileName, method: "libreoffice" };
        } catch (loErr) {
          // If LO fails, try OCR or simple extraction
          logger.error("LibreOffice conversion failed; trying text extraction:", loErr);

          try {
            const ocrDir = path.join(jobDir, "ocr_work");
            await ocrPdfToDocx(resolvedInput, outputPath, ocrDir, onProgress);
            await safeProgress(onProgress, 100);
            return { outputPath, outputFileName, method: "ocr-fallback" };
          } catch (ocrErr) {
            // Final fallback: simple text extraction
            logger.warn("OCR failed, using simple text extraction:", ocrErr.message);
            await simplePdfToDocx(resolvedInput, outputPath, onProgress);
            await safeProgress(onProgress, 100);
            return { outputPath, outputFileName, method: "simple-extraction" };
          }
        }
      }

      // --- DOCX -> PDF ---
      if (inputFormat === "docx" && outputFormat === "pdf") {
        await safeProgress(onProgress, 10);

        const jobDir2 = jobDir;
        const resolvedInput = path.resolve(inputPath);

        await execFileAsync(SOFFICE_PATH, [
          "--headless",
          "--convert-to",
          "pdf",
          "--outdir",
          jobDir2,
          resolvedInput
        ], { timeout: 120000 });

        await safeProgress(onProgress, 85);

        const pdfFile = await findNewestFile(jobDir2, ".pdf");
        if (!pdfFile) throw new Error("DOCX to PDF failed (no PDF produced)");

        fs.renameSync(pdfFile, outputPath);
        await safeProgress(onProgress, 100);

        return { outputPath, outputFileName, method: "libreoffice" };
      }

      throw new Error(`Unsupported conversion: ${inputFormat} -> ${outputFormat}`);
    } catch (error) {
      logger.error("Document conversion error:", error);
      throw new Error(`Document conversion failed: ${error.message}`);
    }
  }

  /**
   * Compress PDF
   */
  async compress(inputPath, inputFormat, compressionLevel = "medium") {
    try {
      if (inputFormat !== "pdf") throw new Error("Only PDF compression is supported");

      ensureDir(config.storage.outputDir);

      const outputFileName = `${uuidv4()}.pdf`;
      const outputPath = path.join(config.storage.outputDir, outputFileName);

      const settings = { low: "/printer", medium: "/ebook", high: "/screen" };
      const pdfSettings = settings[compressionLevel] || "/ebook";

      const args = [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        `-dPDFSETTINGS=${pdfSettings}`,
        "-dNOPAUSE",
        "-dBATCH",
        `-sOutputFile=${outputPath}`,
        path.resolve(inputPath)
      ];

      await execFileAsync(GHOSTSCRIPT_PATH, args, { timeout: 120000 });

      // Get file sizes for comparison
      const inputSize = fs.statSync(inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const savings = ((1 - outputSize / inputSize) * 100).toFixed(2);

      logger.info(`PDF compression completed: ${outputFileName} (${savings}% smaller)`);

      return {
        outputPath,
        outputFileName,
        compressionStats: {
          originalSize: inputSize,
          compressedSize: outputSize,
          savings: `${savings}%`,
        },
      };
    } catch (error) {
      logger.error("PDF compression error:", error);
      throw new Error(`PDF compression failed: ${error.message}`);
    }
  }
}

module.exports = new DocumentProcessor();
