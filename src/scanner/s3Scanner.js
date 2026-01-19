// src/scanner/s3Scanner.js
const fs = require("fs");
const path = require("path");

const SAMPLES_DIR = path.join(process.cwd(), "samples");

async function scanBuckets() {
  const files = fs.readdirSync(SAMPLES_DIR);

  const configs = files
    .filter(f => f.endsWith(".json"))
    .map(file => {
      const fullPath = path.join(SAMPLES_DIR, file);
      return JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    });

  return configs;
}

module.exports = { scanBuckets };
