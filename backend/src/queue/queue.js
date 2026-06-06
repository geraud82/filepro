const Queue = require("bull");

const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
};

if (process.env.REDIS_PASSWORD) {
  redisConfig.password = process.env.REDIS_PASSWORD;
}

const queue = new Queue("filepro-jobs", { redis: redisConfig });

module.exports = queue;
