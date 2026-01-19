// src/analysis/rules/publicAccess.js

function check(normalized) {
  const findings = [];
  
  if (!normalized) return findings;
  
  // 1. Check for public ACL grants
  if (normalized.grants && Array.isArray(normalized.grants)) {
    const publicGrants = normalized.grants.filter(grant => {
      if (!grant.Grantee) return false;
      
      // Check for AllUsers group
      if (grant.Grantee.URI === "http://acs.amazonaws.com/groups/global/AllUsers") {
        return true;
      }
      
      // Check for AuthenticatedUsers group
      if (grant.Grantee.URI === "http://acs.amazonaws.com/groups/global/AuthenticatedUsers") {
        return true;
      }
      
      return false;
    });
    
    if (publicGrants.length > 0) {
      findings.push({
        rule: "PUBLIC_ACL_ACCESS",
        severity: "HIGH",
        message: `Bucket has ${publicGrants.length} public ACL grant(s)`,
        details: {
          grants: publicGrants,
          permissions: publicGrants.map(g => g.Permission)
        }
      });
    }
  }
  
  // 2. Check for public policy statements
  if (normalized.policy && normalized.policy.Statement) {
    const statements = Array.isArray(normalized.policy.Statement) 
      ? normalized.policy.Statement 
      : [normalized.policy.Statement];
    
    const publicStatements = statements.filter(stmt => {
      if (!stmt || stmt.Effect !== "Allow") return false;
      
      // Check if principal is public
      if (stmt.Principal === "*") return true;
      
      if (typeof stmt.Principal === "object") {
        if (stmt.Principal.AWS === "*") return true;
        if (stmt.Principal["*"] === "*") return true;
      }
      
      return false;
    });
    
    if (publicStatements.length > 0) {
      findings.push({
        rule: "PUBLIC_POLICY_ACCESS",
        severity: "CRITICAL",
        message: `Bucket policy allows public access with ${publicStatements.length} statement(s)`,
        details: {
          statements: publicStatements
        }
      });
    }
  }
  
  return findings;
}

module.exports = { check };
