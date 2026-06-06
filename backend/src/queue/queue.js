const Queue = require("bull");

const queue = new Queue("filepro-jobs", {
  redis: {
    host:              process.env.REDIS_HOST     || "127.0.0.1",
    port:              parseInt(process.env.REDIS_PORT || "6379", 10),
    password:          process.env.REDIS_PASSWORD || "changeme_redis_password",
    maxRetriesPerRequest: null,
    enableReadyCheck:  false,
    retryStrategy:     (times) => Math.min(times * 500, 5000),
  },
});

// Prevent unhandled 'error' events from crashing the process
queue.on("error", (err) => {
  console.error("[Queue] Redis connection error:", err.message);
});

module.exports = queue;
