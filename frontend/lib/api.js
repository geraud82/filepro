import axios from "axios";

/**
 * Backend base URL
 * - Next.js: NEXT_PUBLIC_API_BASE_URL
 * - CRA / Vite fallback: localhost
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

/**
 * Axios instance
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

/**
 * File-related API
 */
export const fileApi = {
  /**
   * Convert document (PDF ↔ DOCX)
   * Backend: POST /api/jobs/convert
   */
  async createConvertJob(file, inputFormat, outputFormat) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("inputFormat", inputFormat);
    formData.append("outputFormat", outputFormat);

    const response = await api.post(
      "/api/jobs/convert",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  },

  /**
   * Compress file (PDF, images, video)
   * Backend: POST /api/jobs/compress
   */
  async createCompressJob(file, compressionLevel) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("compressionLevel", compressionLevel);

    const response = await api.post(
      "/api/jobs/compress",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    return response.data;
  },

  /**
   * BACKWARD COMPATIBILITY
   * Allows existing UI to still call createJob(...)
   */
  async createJob(file, type, options = {}) {
    if (type === 'compress') {
      return this.createCompressJob(
        file,
        options.compressionLevel || "medium"
      );
    } else if (type === 'convert') {
      return this.createConvertJob(
        file,
        options.inputFormat || "pdf",
        options.outputFormat || "docx"
      );
    }
    
    // Default to convert for backward compatibility
    return this.createConvertJob(
      file,
      options.inputFormat || "pdf",
      options.outputFormat || "docx"
    );
  },

  /**
   * Get job status
   * Backend: GET /api/jobs/:jobId
   */
  async getJobStatus(jobId) {
    const response = await api.get(`/api/jobs/${jobId}`);
    return response.data;
  },

  /**
   * Download converted file
   * Backend: GET /api/download/:filename
   */
  getDownloadUrl(fileName) {
    return `${API_BASE_URL}/api/download/${fileName}`;
  }
};

/**
 * Stripe API (unchanged)
 */
export const stripeApi = {
  async createCheckoutSession(priceId) {
    const response = await api.post(
      "/api/stripe/create-checkout-session",
      { priceId }
    );
    return response.data;
  },

  async getConfig() {
    const response = await api.get("/api/stripe/config");
    return response.data;
  }
};

export default api;
