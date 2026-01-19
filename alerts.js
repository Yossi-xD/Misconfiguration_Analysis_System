// src/alerts/alertService.js
const crypto = require("crypto");
const fs = require("fs");

function buildAlert(bucketName, findings, scoreObj) {
  return {
    id: crypto.randomUUID(),
    bucketName: bucketName,
    findings: findings,
    score: scoreObj,
    timestamp: new Date().toISOString()
  };
}

function saveAlerts(alerts) {
  const outputFile = "alerts_output.json";
  fs.writeFileSync(outputFile, JSON.stringify(alerts, null, 2));
  console.log(`[+] Alerts saved to ${outputFile}`);
}

module.exports = { buildAlert, saveAlerts };
