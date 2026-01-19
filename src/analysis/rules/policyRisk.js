// src/analysis/rules/policyRisk.js

function check(normalized) {
  const findings = [];
  
  if (!normalized) return findings;
  if (!normalized.policy) return findings;
  
  const policy = normalized.policy;
  const statements = Array.isArray(policy.Statement) 
    ? policy.Statement 
    : [policy.Statement];
  
  statements.forEach((stmt, index) => {
    if (stmt.Effect === "Allow") {
      // Check for wildcard actions
      if (stmt.Action === "*" || 
          (Array.isArray(stmt.Action) && stmt.Action.includes("*"))) {
        findings.push({
          rule: "WILDCARD_ACTION",
          severity: "CRITICAL",
          message: `Policy statement ${index} uses wildcard action (*)`,
          details: {
            statementIndex: index,
            action: stmt.Action,
            recommendation: "Use specific actions instead of wildcard"
          }
        });
      }
      
      // Check for wildcard resources
      if (stmt.Resource === "*" || 
          (Array.isArray(stmt.Resource) && stmt.Resource.includes("*"))) {
        findings.push({
          rule: "WILDCARD_RESOURCE",
          severity: "HIGH",
          message: `Policy statement ${index} uses wildcard resource (*)`,
          details: {
            statementIndex: index,
            resource: stmt.Resource,
            recommendation: "Use specific resource ARNs instead of wildcard"
          }
        });
      }
      
      // Check for dangerous actions
      const dangerousActions = [
        "s3:DeleteBucket",
        "s3:PutBucketPolicy",
        "s3:DeleteBucketPolicy",
        "s3:PutBucketAcl",
        "s3:PutBucketPublicAccessBlock"
      ];
      
      const actions = Array.isArray(stmt.Action) ? stmt.Action : [stmt.Action];
      
      dangerousActions.forEach(dangerousAction => {
        if (actions.includes(dangerousAction) || 
            actions.includes("s3:*") || 
            actions.includes("*")) {
          findings.push({
            rule: "DANGEROUS_ACTION",
            severity: "HIGH",
            message: `Policy statement ${index} allows dangerous action: ${dangerousAction}`,
            details: {
              statementIndex: index,
              dangerousAction: dangerousAction,
              recommendation: "Review if this action is necessary"
            }
          });
        }
      });
    }
  });
  
  return findings;
}

module.exports = { check };
