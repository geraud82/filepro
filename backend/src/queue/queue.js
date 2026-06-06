const Queue = require("bull");

const queue = new Queue("filepro-jobs", {
  redis: {
    host:     process.env.REDIS_HOST     || "127.0.0.1",
    port:     parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || "changeme_redis_password",
  },
});

module.exports = queue;
