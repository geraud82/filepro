require("dotenv").config();

// Keep process alive if a dependency emits an unhandled error
process.on("uncaughtException",  (err) => console.error("[uncaughtException]",  err.message));
process.on("unhandledRejection", (err) => console.error("[unhandledRejection]", err));

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const config = require("./config/config");

const jobRoutes      = require("./routes/jobRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const stripeRoutes   = require("./routes/stripeRoutes");

const app = express();

// Trust Traefik / Dokploy reverse proxy so rate limiter uses real client IP
app.set("trust proxy", 1);

// ── CORS ──────────────────────────────────────────────────────────────────────
// ALLOWED_ORIGINS is a comma-separated list set in .env
// e.g. ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server (no Origin header) and configured origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Don't throw 500 — just omit CORS headers; browser handles it
      callback(null, false);
    }
  },
  methods: ["GET", "POST"],
  credentials: false
}));

// ── Rate limiting ──────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS  || "900000"),  // 15 min
  max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: "Too many requests, please try again later." }
});
app.use("/api/", limiter);

// ── Body parsing ───────────────────────────────────────────────────────────────
app.use(express.json());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use("/api/jobs",     jobRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/stripe",   stripeRoutes);

app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── Start server ───────────────────────────────────────────────────────────────
app.listen(config.server.port, () => {
  console.log(`Backend running on port ${config.server.port} [${config.nodeEnv}]`);
});

// Run queue worker and cleanup scheduler in the same process (all environments)
require("./workers/processor");
require("./workers/cleanup");
console.log("Queue worker + cleanup scheduler started");
