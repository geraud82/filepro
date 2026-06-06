const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const config = require('../config/config');
const logger = require('../utils/logger');

class ImageProcessor {
  /**
   * Convert image between formats (JPG <-> PNG)
   */
  async convert(inputPath, inputFormat, outputFormat) {
    try {
      const outputFileName = `${uuidv4()}.${outputFormat}`;
      const outputPath = path.join(config.storage.outputDir, outputFileName);

      logger.info(`Converting image: ${inputFormat} -> ${outputFormat}`);

      let pipeline = sharp(inputPath);

      if (outputFormat === 'png') {
        pipeline = pipeline.png();
      } else if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
        pipeline = pipeline.jpeg({ quality: 90 });
      }

      await pipeline.toFile(outputPath);

      logger.info(`Image conversion completed: ${outputFileName}`);

      return {
        outputPath,
        outputFileName,
      };

    } catch (error) {
      logger.error('Image conversion error:', error);
      throw new Error(`Image conversion failed: ${error.message}`);
    }
  }

  /**
   * Compress image
   */
  async compress(inputPath, inputFormat, compressionLevel) {
    try {
      const outputFileName = `${uuidv4()}.${inputFormat}`;
      const outputPath = path.join(config.storage.outputDir, outputFileName);

      const levels = config.compressionLevels[compressionLevel] || config.compressionLevels.medium;
      const quality = levels.quality;

      logger.info(`Compressing image with ${compressionLevel} level (quality: ${quality})`);

      let pipeline = sharp(inputPath);

      if (inputFormat === 'jpg' || inputFormat === 'jpeg') {
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      } else if (inputFormat === 'png') {
        pipeline = pipeline.png({ 
          quality,
          compressionLevel: compressionLevel === 'high' ? 9 : compressionLevel === 'medium' ? 6 : 3,
        });
      }

      await pipeline.toFile(outputPath);

      // Get file sizes for comparison
      const inputSize = fs.statSync(inputPath).size;
      const outputSize = fs.statSync(outputPath).size;
      const savings = ((1 - outputSize / inputSize) * 100).toFixed(2);

      logger.info(`Image compression completed: ${outputFileName} (${savings}% smaller)`);

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
      logger.error('Image compression error:', error);
      throw new Error(`Image compression failed: ${error.message}`);
    }
  }
}

module.exports = new ImageProcessor();
