// src/alerts/alertRepo.js
const fs = require("fs");
const path = require("path");

// Configuration
const OUTPUT_DIR = process.cwd();
const DEFAULT_FILENAME = "alerts_output.json";

// Save alerts to JSON file
function saveAlerts(alerts, filename = DEFAULT_FILENAME) {
  if (!alerts || !Array.isArray(alerts)) {
    throw new Error("Alerts must be an array");
  }

  const outputPath = path.join(OUTPUT_DIR, filename);
  
  try {
    // Create pretty-printed JSON
    const jsonData = JSON.stringify(alerts, null, 2);
    
    // Write to file
    fs.writeFileSync(outputPath, jsonData, "utf8");
    
    console.log(`[✓] Saved ${alerts.length} alerts to: ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`[X] Failed to save alerts: ${error.message}`);
    return false;
  }
}

// Load alerts from file
function loadAlerts(filename = DEFAULT_FILENAME) {
  const filePath = path.join(OUTPUT_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`[!] No alerts file found at: ${filePath}`);
    return [];
  }
  
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`[X] Failed to load alerts: ${error.message}`);
    return [];
  }
}

// Append alerts to existing file (instead of overwriting)
function appendAlerts(newAlerts, filename = DEFAULT_FILENAME) {
  const existingAlerts = loadAlerts(filename);
  const allAlerts = [...existingAlerts, ...newAlerts];
  return saveAlerts(allAlerts, filename);
}

// Get alert statistics
function getAlertStats(filename = DEFAULT_FILENAME) {
  const alerts = loadAlerts(filename);
  
  const stats = {
    total: alerts.length,
    bySeverity: {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
      INFO: 0
    },
    byBucket: {}
  };
  
  alerts.forEach(alert => {
    // Count by severity
    const severity = alert.severity?.toUpperCase() || "INFO";
    if (stats.bySeverity[severity] !== undefined) {
      stats.bySeverity[severity]++;
    }
    
    // Count by bucket
    const bucket = alert.bucketName || "unknown";
    stats.byBucket[bucket] = (stats.byBucket[bucket] || 0) + 1;
  });
  
  return stats;
}

// Print alert summary to console
function printAlertSummary(filename = DEFAULT_FILENAME) {
  const stats = getAlertStats(filename);
  const alerts = loadAlerts(filename);
  
  console.log("\n📊 ALERT SUMMARY");
  console.log("================");
  console.log(`Total alerts: ${stats.total}`);
  console.log("\nBy severity:");
  Object.entries(stats.bySeverity).forEach(([severity, count]) => {
    if (count > 0) {
      console.log(`  ${severity}: ${count}`);
    }
  });
  
  console.log("\nBy bucket:");
  Object.entries(stats.byBucket).forEach(([bucket, count]) => {
    console.log(`  ${bucket}: ${count}`);
  });
  
  // Show recent alerts
  if (alerts.length > 0) {
    console.log("\nRecent alerts:");
    const recent = alerts.slice(-3).reverse();
    recent.forEach(alert => {
      console.log(`  • ${alert.bucketName} - ${alert.severity} (${alert.score})`);
    });
  }
}

module.exports = {
  saveAlerts,
  loadAlerts,
  appendAlerts,
  getAlertStats,
  printAlertSummary
};
