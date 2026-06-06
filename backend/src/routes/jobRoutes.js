const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const queue = require("../queue/queue");
const config = require("../config/config");

const router = express.Router();

if (!fs.existsSync(config.storage.uploadDir)) fs.mkdirSync(config.storage.uploadDir, { recursive: true });
if (!fs.existsSync(config.storage.outputDir)) fs.mkdirSync(config.storage.outputDir, { recursive: true });

const upload = multer({ dest: config.storage.uploadDir });

/**
 * POST /api/jobs/convert
 * Body: file, inputFormat, outputFormat
 */
router.post("/convert", upload.single("file"), async (req, res) => {
  try {
    const { inputFormat, outputFormat } = req.body;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (!inputFormat || !outputFormat) {
      return res.status(400).json({ error: "inputFormat and outputFormat are required" });
    }

    const inputExt = inputFormat.toLowerCase();
    const outputExt = outputFormat.toLowerCase();
    
    // Determine job type based on file formats
    let jobType = "document-convert";
    
    if (['mp4'].includes(inputExt) || ['mp3'].includes(outputExt)) {
      jobType = "video-convert";
    } else if (['jpg', 'jpeg', 'png'].includes(inputExt)) {
      jobType = "image-convert";
    }

    const job = await queue.add(
      {
        type: jobType,
        inputPath: req.file.path,
        inputFormat: inputExt,
        outputFormat: outputExt
      },
      { attempts: 1 }
    );

    return res.json({ jobId: String(job.id), status: "queued" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to create job" });
  }
});

/**
 * POST /api/jobs/compress
 * Body: file, compressionLevel
 */
router.post("/compress", upload.single("file"), async (req, res) => {
  try {
    const { compressionLevel } = req.body;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    if (!compressionLevel) {
      return res.status(400).json({ error: "compressionLevel is required" });
    }

    const fileExt = path.extname(req.file.originalname).toLowerCase().slice(1);
    let jobType = "document-compress";

    // Determine job type based on file extension
    if (['jpg', 'jpeg', 'png'].includes(fileExt)) {
      jobType = "image-compress";
    } else if (['mp4'].includes(fileExt)) {
      jobType = "video-compress";
    } else if (['pdf'].includes(fileExt)) {
      jobType = "document-compress";
    }

    const job = await queue.add(
      {
        type: jobType,
        inputPath: req.file.path,
        inputFormat: fileExt,
        compressionLevel: compressionLevel.toLowerCase()
      },
      { attempts: 1 }
    );

    return res.json({ jobId: String(job.id), status: "queued" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to create job" });
  }
});

/**
 * GET /api/jobs/:jobId
 * Returns job status + progress + result
 */
router.get("/:jobId", async (req, res) => {
  try {
    const job = await queue.getJob(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const state = await job.getState(); // waiting, active, completed, failed, delayed
    const progress = typeof job._progress === "number" ? job._progress : (job.progress() || 0);

    // Bull stores return value on completion
    const result = job.returnvalue || null;

    const response = {
      jobId: String(job.id),
      status: state,
      progress: progress || 0,
      result: result,
      error: job.failedReason || null
    };

    // If completed and we have outputFileName, provide a downloadUrl
    if (state === "completed" && result?.outputFileName) {
      response.downloadUrl = `/api/download/${result.outputFileName}`;
      
      // Include compressionStats at top level if available
      if (result.compressionStats) {
        response.compressionStats = result.compressionStats;
      }
    }

    return res.json(response);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to fetch job" });
  }
});

module.exports = router;
