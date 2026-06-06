const express = require("express");
const path = require("path");
const config = require("../config/config");

const router = express.Router();

router.get("/:filename", (req, res) => {
  const filePath = path.join(config.storage.outputDir, req.params.filename);
  res.download(filePath);
});

module.exports = router;
