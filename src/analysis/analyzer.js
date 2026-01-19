// src/analysis/analyzer.js
const rulePublicAccess = require("./rules/publicAccess");
const ruleBlockPublicAccess = require("./rules/blockPublicAccess");
const ruleEncryption = require("./rules/encryption");
const rulePolicyRisk = require("./rules/policyRisk");

function analyzer(normalized) {
  const findings = [];
  
  // Run all rules
  const ruleResults = [
    rulePublicAccess.check(normalized),
    ruleBlockPublicAccess.check(normalized),
    ruleEncryption.check(normalized),
    rulePolicyRisk.check(normalized)
  ];
  
  // Combine all findings
  ruleResults.forEach(ruleFindings => {
    if (Array.isArray(ruleFindings)) {
      findings.push(...ruleFindings);
    }
  });
  
  return findings;
}

module.exports = analyzer;
