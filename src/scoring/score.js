// src/scoring/score.js

const SEVERITY_LEVELS = {
  CRITICAL: 100,
  HIGH: 80,
  MEDIUM: 50,
  LOW: 20,
  INFO: 0
};

const SEVERITY_THRESHOLDS = {
  CRITICAL: 90,
  HIGH: 70,
  MEDIUM: 40,
  LOW: 10
};

// Calculate severity based on findings
function calculateSeverity(score) {
  if (score >= SEVERITY_THRESHOLDS.CRITICAL) return "CRITICAL";
  if (score >= SEVERITY_THRESHOLDS.HIGH) return "HIGH";
  if (score >= SEVERITY_THRESHOLDS.MEDIUM) return "MEDIUM";
  if (score >= SEVERITY_THRESHOLDS.LOW) return "LOW";
  return "INFO";
}

// Score individual findings based on their severity
function scoreFindings(findings) {
  if (!findings || findings.length === 0) {
    return {
      score: 0,
      severity: "INFO",
      findingsCount: 0
    };
  }

  let totalScore = 0;
  
  // Map finding severity to scores
  const severityMap = {
    "CRITICAL": SEVERITY_LEVELS.CRITICAL,
    "HIGH": SEVERITY_LEVELS.HIGH,
    "MEDIUM": SEVERITY_LEVELS.MEDIUM,
    "LOW": SEVERITY_LEVELS.LOW,
    "INFO": SEVERITY_LEVELS.INFO
  };

  // Calculate total score
  findings.forEach(finding => {
    const severity = finding.severity?.toUpperCase() || "INFO";
    totalScore += severityMap[severity] || SEVERITY_LEVELS.INFO;
  });

  // Cap the score at 100
  const cappedScore = Math.min(100, totalScore);
  const severity = calculateSeverity(cappedScore);

  return {
    score: cappedScore,
    severity: severity,
    findingsCount: findings.length,
    breakdown: {
      critical: findings.filter(f => f.severity === "CRITICAL").length,
      high: findings.filter(f => f.severity === "HIGH").length,
      medium: findings.filter(f => f.severity === "MEDIUM").length,
      low: findings.filter(f => f.severity === "LOW").length,
      info: findings.filter(f => f.severity === "INFO").length
    }
  };
}

module.exports = { scoreFindings, SEVERITY_LEVELS };
