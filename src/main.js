// src/main.js

// Import all required modules
const { scanBuckets } = require('./scanner/s3Scanner');
const { normalizeS3 } = require('./normalizer/normalizeS3');
const analyzer = require('./analysis/analyzer');
const { scoreFindings } = require('./scoring/score');
const { buildAlert } = require('./alerts/alertService');
const { saveAlerts, printAlertSummary } = require('./alerts/alertRepo');

async function main() {
  console.log("[*] Starting S3 security scan pipeline...");
  console.log("=" .repeat(50));

  // 1. Scan
  const rawConfigs = await scanBuckets();
  console.log(`[+] Scanned ${rawConfigs.length} bucket(s)`);

  const alerts = [];

  for (const raw of rawConfigs) {
    // 2. Normalize
    const normalized = normalizeS3(raw);

    // 3. Analyze
    const findings = analyzer(normalized);
    if (!findings || findings.length === 0) {
      console.log(`[!] No findings for bucket: ${normalized.bucketName}`);
      continue;
    }

    console.log(`[+] Found ${findings.length} issue(s) in ${normalized.bucketName}`);

    // 4. Score
    const scoreObj = scoreFindings(findings);
    console.log(`[+] Risk score: ${scoreObj.score} (${scoreObj.severity})`);

    // 5. Build alert
    const alert = buildAlert(
      normalized.bucketName,
      findings,
      scoreObj
    );

    alerts.push(alert);
  }

  // 6. Save
  if (alerts.length > 0) {
    saveAlerts(alerts);
  } else {
    console.log("[✓] No security alerts generated - all buckets are secure!");
  }

  // 7. Print summary
  printAlertSummary();

  console.log("\n[✓] Pipeline completed successfully");
  console.log("=" .repeat(50));
}

main().catch(err => {
  console.error("\n[X] Pipeline failed!");
  console.error("[X] Error:", err.message);
  console.error("[X] Stack:", err.stack);
  process.exit(1);
});
