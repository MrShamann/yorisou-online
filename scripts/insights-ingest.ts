import { ingestConfiguredInsightSources } from "../lib/insights/service";
import { getInsightDraftStoragePath, readInsightDrafts } from "../lib/insights/storage";

async function main() {
  const result = await ingestConfiguredInsightSources();
  const drafts = await readInsightDrafts();

  console.log("Yorisou insights ingestion complete.");
  console.log(`Fetched: ${result.fetched}`);
  console.log(`Relevant: ${result.relevant}`);
  console.log(`Created drafts: ${result.created}`);
  console.log(`Skipped duplicates: ${result.skippedDuplicate}`);
  console.log(`Skipped irrelevant: ${result.skippedIrrelevant}`);
  console.log(`Draft storage: ${getInsightDraftStoragePath()}`);
  console.log(`Total stored drafts: ${drafts.length}`);
}

main().catch((error) => {
  console.error("Insights ingestion failed:", error);
  process.exit(1);
});
