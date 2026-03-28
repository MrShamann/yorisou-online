import { promises as fs } from "fs";
import path from "path";

import {
  buildNeedsInsightAggregate,
  deriveNeedsFeedbackCandidates,
  readNeedsSignalArtifacts,
} from "../lib/server/openclawNeedsInsight";

async function main() {
  const artifacts = await readNeedsSignalArtifacts();
  const now = new Date();
  const reportPath = path.join(process.cwd(), "test-results", "hinata-needs-review.json");

  const aggregate = buildNeedsInsightAggregate({
    signals: artifacts.map((artifact) => artifact.signal),
    startAt: artifacts[artifacts.length - 1]?.createdAt || now.toISOString(),
    endAt: artifacts[0]?.createdAt || now.toISOString(),
    label: artifacts.length > 0 ? "all_recorded_signals" : "no_signals_yet",
  });
  const feedbackCandidates = deriveNeedsFeedbackCandidates({ aggregate });

  const report = {
    generatedAt: now.toISOString(),
    artifactCount: artifacts.length,
    aggregate,
    feedbackCandidates,
    recentArtifacts: artifacts.slice(0, 8),
  };

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log("");
  console.log("Hinata Needs Review");
  console.log("===================");
  console.log(`Generated: ${report.generatedAt}`);
  console.log(`Artifacts: ${report.artifactCount}`);
  console.log(`Window: ${aggregate.timeWindow.label}`);
  console.log("");
  console.log("Top Need Categories");
  console.log("-------------------");
  for (const [category, count] of Object.entries(aggregate.needCategoryCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)) {
    console.log(`${category}: ${count}`);
  }
  console.log("");
  console.log("Readiness To Solution");
  console.log("---------------------");
  for (const [label, count] of Object.entries(aggregate.readinessToSolutionDistribution).sort((a, b) => b[1] - a[1])) {
    console.log(`${label}: ${count}`);
  }
  console.log("");
  console.log("Speaker Types");
  console.log("-------------");
  if (Object.keys(aggregate.speakerTypeDistribution).length === 0) {
    console.log("none");
  } else {
    for (const [label, count] of Object.entries(aggregate.speakerTypeDistribution).sort((a, b) => b[1] - a[1])) {
      console.log(`${label}: ${count}`);
    }
  }
  console.log("");
  console.log("Top Practical Constraints");
  console.log("-------------------------");
  if (aggregate.topPracticalConstraints.length === 0) {
    console.log("none");
  } else {
    for (const entry of aggregate.topPracticalConstraints) {
      console.log(`${entry.constraint}: ${entry.count}`);
    }
  }
  console.log("");
  console.log("Feedback Candidates");
  console.log("-------------------");
  if (feedbackCandidates.length === 0) {
    console.log("No strong feedback candidates yet.");
  } else {
    for (const candidate of feedbackCandidates) {
      console.log(`${candidate.patternId} <- ${candidate.matchedBecause.join(", ")}`);
      console.log(`  service: ${candidate.serviceDesignImplications[0] || "none"}`);
      console.log(`  product: ${candidate.productSelectionImplications[0] || "none"}`);
      console.log(`  content: ${candidate.contentExplanationImplications[0] || "none"}`);
    }
  }
  console.log("");
  console.log("Recent Signals");
  console.log("--------------");
  if (report.recentArtifacts.length === 0) {
    console.log("none");
  } else {
    for (const artifact of report.recentArtifacts.slice(0, 5)) {
      console.log(
        `${artifact.createdAt} | ${artifact.signal.needCategory || "unclear"} | ${artifact.signal.readinessForSolutionDiscussion} | ${artifact.signal.speakerType}`,
      );
    }
  }
  console.log("");
  console.log(`Saved report: ${reportPath}`);
}

main().catch((error) => {
  console.error("Needs review failed:", error);
  process.exitCode = 1;
});
