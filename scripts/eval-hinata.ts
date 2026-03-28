import path from "path";

import {
  resolveHinataEvalProviderCoverageConfig,
  resolveHinataEvalThresholds,
  runHinataOfflineEval,
} from "../lib/ai/support/eval-runner";

async function main() {
  const thresholds = resolveHinataEvalThresholds();
  const providerCoverage = resolveHinataEvalProviderCoverageConfig();
  const report = await runHinataOfflineEval({ thresholds, providerCoverage });
  const reportPath = path.join(process.cwd(), "test-results", "hinata-eval-report.json");

  console.log("");
  console.log("Hinata Offline Eval");
  console.log("===================");
  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Cases: ${report.totals.cases}`);
  console.log(`Pass/Warn/Fail: ${report.totals.pass}/${report.totals.warn}/${report.totals.fail}`);
  console.log(`Providers: ${report.runtime.providersUsed.join(", ")}`);
  console.log(`Models: ${report.runtime.modelsUsed.join(", ")}`);
  console.log(`Fallback cases: ${report.runtime.fallbackCases}`);
  console.log(`Provider-backed cases: ${report.runtime.providerBackedCases}`);
  console.log("");
  console.log("Issue Summary");
  console.log("-------------");
  if (Object.keys(report.issueSummary).length === 0) {
    console.log("No reflection issues detected.");
  } else {
    for (const [tag, count] of Object.entries(report.issueSummary).sort((a, b) => b[1] - a[1])) {
      console.log(`${tag}: ${count}`);
    }
  }
  console.log("");
  console.log("Threshold Gate");
  console.log("--------------");
  for (const check of report.thresholds.checks) {
    console.log(
      `${check.passed ? "PASS" : "FAIL"} ${check.tag}: actual=${check.actual} threshold=${check.threshold}`,
    );
  }
  console.log(`Gate result: ${report.thresholds.passed ? "PASS" : "FAIL"}`);
  console.log("");
  console.log("Provider Coverage Gate");
  console.log("----------------------");
  console.log(
    `Config: requireProvider=${String(report.providerCoverage.config.requireProvider)} maxFallbackCases=${
      report.providerCoverage.config.maxFallbackCases === null ? "none" : report.providerCoverage.config.maxFallbackCases
    } minProviderCases=${
      report.providerCoverage.config.minProviderCases === null ? "none" : report.providerCoverage.config.minProviderCases
    }`,
  );
  console.log(
    `Actual: totalCases=${report.providerCoverage.actual.totalCases} fallbackCases=${report.providerCoverage.actual.fallbackCases} providerBackedCases=${report.providerCoverage.actual.providerBackedCases}`,
  );
  if (report.providerCoverage.checks.length === 0) {
    console.log("No provider coverage gate enabled.");
  } else {
    for (const check of report.providerCoverage.checks) {
      console.log(
        `${check.passed ? "PASS" : "FAIL"} ${check.kind}: actual=${check.actual} threshold=${check.threshold}`,
      );
    }
  }
  console.log(`Provider coverage result: ${report.providerCoverage.passed ? "PASS" : "FAIL"}`);
  console.log("");
  console.log("Per-case Results");
  console.log("----------------");
  for (const result of report.results) {
    const issues = result.issueTags.join(", ") || "none";
    console.log(`[${result.status.toUpperCase()}] ${result.id} ${result.language}/${result.scenario}`);
    console.log(`  provider=${result.provider} model=${result.model} fallback=${String(result.fallbackUsed)}`);
    console.log(`  issues=${issues}`);
    console.log(`  assistant=${result.assistantOutput.replace(/\s+/g, " ").trim()}`);
  }
  console.log("");
  console.log(`Saved report: ${reportPath}`);

  if (!report.thresholds.passed || !report.providerCoverage.passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("Hinata eval runner failed:", error);
  process.exitCode = 1;
});
