const fs   = require("fs");
const path = require("path");
const config = require("../config/config");
const logger = require("../utils/logger");

const EXPIRY_MS = (parseInt(process.env.FILE_EXPIRY_HOURS || "1")) * 60 * 60 * 1000;
const INTERVAL_MS = 30 * 60 * 1000; // run every 30 minutes

function deleteOldFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const now = Date.now();
  let deleted = 0;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Remove job temp dirs (e.g. job_<uuid>) older than expiry
      try {
        const stat = fs.statSync(fullPath);
        if (now - stat.mtimeMs > EXPIRY_MS) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          deleted++;
        }
      } catch { /* file already gone */ }
    } else {
      try {
        const stat = fs.statSync(fullPath);
        if (now - stat.mtimeMs > EXPIRY_MS) {
          fs.unlinkSync(fullPath);
          deleted++;
        }
      } catch { /* file already gone */ }
    }
  }

  if (deleted > 0) {
    logger.info(`Cleanup: removed ${deleted} expired file(s) from ${dir}`);
  }
}

function runCleanup() {
  try {
    deleteOldFiles(config.storage.uploadDir);
    deleteOldFiles(config.storage.outputDir);
  } catch (err) {
    logger.error("Cleanup error:", err);
  }
}

// Run once on startup, then every 30 minutes
runCleanup();
setInterval(runCleanup, INTERVAL_MS);

logger.info(`File cleanup scheduler started (expiry: ${EXPIRY_MS / 3600000}h, interval: 30min)`);

module.exports = { runCleanup };
