const { execFile } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const logger = require('../utils/logger');

const execFileAsync = promisify(execFile);

class VideoProcessor {
  /**
   * Convert MP4 to MP3
   */
  async convert(inputPath, inputFormat, outputFormat) {
    try {
      if (inputFormat !== 'mp4' || outputFormat !== 'mp3') {
        throw new Error('Only MP4 to MP3 conversion is supported');
      }

      const outputFileName = `${uuidv4()}.${outputFormat}`;
      const outputPath = path.join(config.storage.outputDir, outputFileName);

      logger.info(`Converting video: ${inputFormat} -> ${outputFormat}`);

      // FFmpeg command: ffmpeg -i input.mp4 -vn -ab 192k output.mp3
      const args = [
        '-i', inputPath,
        '-vn', // No video
        '-ab', '192k', // Audio bitrate
        '-y', // Overwrite output file
        outputPath,
      ];

      await execFileAsync('ffmpeg', args);

      logger.info(`Video conversion completed: ${outputFileName}`);

      return {
        outputPath,
        outputFileName,
      };

    } catch (error) {
      logger.error('Video conversion error:', error);
      throw new Error(`Video conversion failed: ${error.message}`);
    }
  }

  /**
   * Compress video
   */
  async compress(inputPath, inputFormat, compressionLevel, onProgress) {
    try {
      const outputFileName = `${uuidv4()}.${inputFormat}`;
      const outputPath = path.join(config.storage.outputDir, outputFileName);

      const levels = config.compressionLevels[compressionLevel] || config.compressionLevels.medium;
      const crf = levels.crf;

      logger.info(`Compressing video with ${compressionLevel} level (CRF: ${crf})`);

      if (typeof onProgress === 'function') await onProgress(20);

      // FFmpeg command: ffmpeg -i input.mp4 -vcodec libx264 -crf 28 output.mp4
      const args = [
        '-i', inputPath,
        '-vcodec', 'libx264',
        '-crf', crf.toString(),
        '-preset', 'medium',
        '-y',
        outputPath,
      ];

      await execFileAsync('ffmpeg', args);
      if (typeof onProgress === 'function') await onProgress(90);

      // Get file sizes for comparison
      const inputSize = fs.statSync(inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const savings = ((1 - outputSize / inputSize) * 100).toFixed(2);

      logger.info(`Video compression completed: ${outputFileName} (${savings}% smaller)`);

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
      logger.error('Video compression error:', error);
      throw new Error(`Video compression failed: ${error.message}`);
    }
  }
}

module.exports = new VideoProcessor();
