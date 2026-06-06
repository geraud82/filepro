const path = require("path");

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",

  server: {
    // Docker sets PORT=5000; default matches frontend .env (NEXT_PUBLIC_API_BASE_URL=http://localhost:5000)
    port: process.env.PORT || 5000
  },

  storage: {
    uploadDir: path.join(__dirname, "../../uploads"),
    outputDir: path.join(__dirname, "../../outputs")
  },

  // Used by imageProcessor and videoProcessor
  compressionLevels: {
    low:    { quality: 80, crf: 23 },
    medium: { quality: 60, crf: 28 },
    high:   { quality: 40, crf: 35 }
  },

  stripe: {
    secretKey:     process.env.STRIPE_SECRET_KEY      || null,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET  || null
  },

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000"
};
