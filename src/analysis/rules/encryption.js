// src/analysis/rules/encryption.js

function check(normalized) {
  const findings = [];
  
  if (!normalized) return findings;
  
  if (!normalized.encryption) {
    findings.push({
      rule: "NO_ENCRYPTION",
      severity: "HIGH",
      message: "Bucket has no server-side encryption configured",
      details: {
        recommendation: "Enable SSE-S3 or SSE-KMS encryption"
      }
    });
    return findings;
  }
  
  // Check encryption rules if encryption is configured
  const encryption = normalized.encryption;
  
  // Check for insecure encryption or specific issues
  if (encryption.type === "AES256") {
    // AES256 (SSE-S3) is actually fine, but we can note it
    findings.push({
      rule: "SSE_S3_ENCRYPTION",
      severity: "LOW",
      message: "Bucket uses SSE-S3 encryption (AES256)",
      details: {
        algorithm: "AES256",
        enabled: encryption.enabled,
        recommendation: encryption.enabled ? "Encryption is enabled (good)" : "Enable encryption"
      }
    });
  }
  
  // Check if encryption is disabled
  if (encryption.enabled === false) {
    findings.push({
      rule: "ENCRYPTION_DISABLED",
      severity: "CRITICAL",
      message: "Server-side encryption is disabled",
      details: {
        recommendation: "Enable server-side encryption immediately"
      }
    });
  }
  
  return findings;
}

module.exports = { check };
