// src/analysis/rules/blockPublicAccess.js

function check(normalized) {
  const findings = [];
  
  if (!normalized) return findings;
  
  const blockConfig = normalized.publicAccessBlock;
  
  if (!blockConfig) {
    findings.push({
      rule: "NO_PUBLIC_ACCESS_BLOCK",
      severity: "MEDIUM",
      message: "Bucket has no PublicAccessBlock configuration",
      details: {
        recommendation: "Enable Block Public Access settings"
      }
    });
    return findings;
  }
  
  // Check each setting - look for false values
  const checks = [
    { key: "BlockPublicAcls", name: "Block Public ACLs", severity: "HIGH" },
    { key: "IgnorePublicAcls", name: "Ignore Public ACLs", severity: "HIGH" },
    { key: "BlockPublicPolicy", name: "Block Public Policy", severity: "HIGH" },
    { key: "RestrictPublicBuckets", name: "Restrict Public Buckets", severity: "MEDIUM" }
  ];
  
  checks.forEach(({ key, name, severity }) => {
    // Check if the key exists and is explicitly false
    if (blockConfig[key] === false) {
      findings.push({
        rule: `PUBLIC_ACCESS_${key.toUpperCase()}_DISABLED`,
        severity: severity,
        message: `${name} is disabled`,
        details: {
          setting: key,
          currentValue: false,
          recommendedValue: true
        }
      });
    }
  });
  
  return findings;
}

module.exports = { check };
