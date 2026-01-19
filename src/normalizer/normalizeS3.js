// src/normalizer/normalizeS3.js

function normalizeS3(raw) {
  if (!raw) {
    return {
      bucketName: "unknown",
      grants: [],
      policy: null,
      encryption: null,
      publicAccessBlock: null
    };
  }

  // Extract bucket name from different possible locations
  let bucketName = "unknown";
  if (raw.Name) bucketName = raw.Name;
  else if (raw.BucketName) bucketName = raw.BucketName;
  else if (raw.bucketName) bucketName = raw.bucketName;
  else if (raw.Bucket) bucketName = raw.Bucket;

  // Extract ACL grants
  const grants = raw.ACL?.Grants || 
                 raw.Acl?.Grants || 
                 raw.grants || 
                 [];

  // Extract policy
  const policy = raw.Policy || 
                 raw.BucketPolicy || 
                 raw.policy || 
                 null;

  // Extract encryption settings
  const encryption = raw.Encryption || 
                     raw.ServerSideEncryptionConfiguration || 
                     raw.encryption || 
                     null;

  // Extract public access block settings
  const publicAccessBlock = raw.PublicAccessBlockConfiguration || 
                           raw.BlockPublicAccess || 
                           raw.publicAccessBlock || 
                           null;

  return {
    bucketName,
    grants,
    policy,
    encryption,
    publicAccessBlock,
    raw: raw // Keep original for debugging
  };
}

module.exports = { normalizeS3 };
