// src/alerts/alertService.js
const crypto = require("crypto");

// Alert format contract
function buildAlert(bucketName, findings, scoreObj) {
  if (!bucketName || !scoreObj) {
    throw new Error("Missing required parameters for alert creation");
  }

  // Generate a unique ID
  const alertId = crypto.randomUUID();
  
  // Current timestamp
  const createdAt = new Date().toISOString();
  
  // Extract severity and score from scoreObj
  const severity = scoreObj.severity || "INFO";
  const score = scoreObj.score || 0;
  
  return {
    id: alertId,
    bucketName: bucketName,
    severity: severity,
    score: score,
    findings: findings || [],
    createdAt: createdAt,
    metadata: {
      findingsCount: findings?.length || 0,
      scoreBreakdown: scoreObj.breakdown || {}
    }
  };
}

// Optional: Helper function to format alerts for display
function formatAlertForDisplay(alert) {
  return {
    bucket: alert.bucketName,
    severity: alert.severity,
    score: alert.score,
    findings: alert.findings.length,
    time: alert.createdAt
  };
}

// Optional: Filter alerts by severity
function filterAlertsBySeverity(alerts, minSeverity = "MEDIUM") {
  const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"];
  const minIndex = severityOrder.indexOf(minSeverity.toUpperCase());
  
  if (minIndex === -1) return alerts;
  
  return alerts.filter(alert => {
    const alertIndex = severityOrder.indexOf(alert.severity.toUpperCase());
    return alertIndex <= minIndex;
  });
}

module.exports = { 
  buildAlert, 
  formatAlertForDisplay, 
  filterAlertsBySeverity 
};
