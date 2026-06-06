const queue = require("../queue/queue");
const logger = require("../utils/logger");
const documentProcessor = require("../processors/documentProcessor");
const imageProcessor = require("../processors/imageProcessor");
const videoProcessor = require("../processors/videoProcessor");

// Start the file cleanup scheduler alongside the worker
require("./cleanup");

queue.process(async (job) => {
  const { type } = job.data;

  logger.info(`🛠 Processing job ${job.id} (${type})`);

  if (type === "document-convert") {
    // Progress milestones
    await job.progress(5);

    const result = await documentProcessor.convert(
      job.data.inputPath,
      job.data.inputFormat,
      job.data.outputFormat,
      async (pct) => {
        // pct: 0-100
        const safe = Math.max(0, Math.min(100, Number(pct) || 0));
        await job.progress(safe);
      }
    );

    await job.progress(100);
    return result;
  }

  if (type === "image-compress") {
    await job.progress(10);
    const result = await imageProcessor.compress(
      job.data.inputPath,
      job.data.inputFormat,
      job.data.compressionLevel
    );
    await job.progress(100);
    return result;
  }

  if (type === "image-convert") {
    await job.progress(10);
    const result = await imageProcessor.convert(
      job.data.inputPath,
      job.data.inputFormat,
      job.data.outputFormat
    );
    await job.progress(100);
    return result;
  }

  if (type === "video-convert") {
    await job.progress(10);
    const result = await videoProcessor.convert(
      job.data.inputPath,
      job.data.inputFormat,
      job.data.outputFormat
    );
    await job.progress(100);
    return result;
  }

  if (type === "video-compress") {
    await job.progress(10);
    const result = await videoProcessor.compress(
      job.data.inputPath,
      job.data.inputFormat,
      job.data.compressionLevel,
      async (pct) => {
        const safe = Math.max(0, Math.min(100, Number(pct) || 0));
        await job.progress(safe);
      }
    );
    await job.progress(100);
    return result;
  }

  if (type === "document-compress") {
    await job.progress(10);
    const result = await documentProcessor.compress(
      job.data.inputPath,
      job.data.inputFormat,
      job.data.compressionLevel
    );
    await job.progress(100);
    return result;
  }

  throw new Error("Unknown job type: " + type);
});
