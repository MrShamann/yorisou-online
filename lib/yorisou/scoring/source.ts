import fs from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();

export const INTERNAL_120Q_SOURCE_PATHS = {
  questionBankMarkdown: path.join(
    REPO_ROOT,
    "docs/yorisou/120q/01-yorisou_120q_full_batch_1_2_3_embedded.md",
  ),
  scoringMasterCsv: path.join(
    REPO_ROOT,
    "data/yorisou/yorisou_full_120q_numeric_assignment_targeted_correction_v0_1_table.csv",
  ),
  correctionPassMarkdown: path.join(
    REPO_ROOT,
    "docs/yorisou/120q/yorisou_full_120q_numeric_assignment_targeted_correction_pass_v0_1.md",
  ),
  nonNumericBatchA: path.join(
    REPO_ROOT,
    "docs/yorisou/120q/yorisou_batch_a_non_numeric_option_vectors_v0_1.md",
  ),
  nonNumericBatchB: path.join(
    REPO_ROOT,
    "docs/yorisou/120q/yorisou_batch_b_non_numeric_option_vectors_v0_1.md",
  ),
  nonNumericBatchC: path.join(
    REPO_ROOT,
    "docs/yorisou/120q/yorisou_batch_c_non_numeric_option_vectors_v0_1.md",
  ),
} as const;

export function readInternal120QSourceFile(sourcePath: string) {
  return fs.readFileSync(sourcePath, "utf8");
}

export function assertInternal120QSourceFilesExist() {
  const missing = Object.values(INTERNAL_120Q_SOURCE_PATHS).filter(
    (sourcePath) => !fs.existsSync(sourcePath),
  );

  if (missing.length > 0) {
    throw new Error(`Missing internal 120Q source files: ${missing.join(", ")}`);
  }

  return INTERNAL_120Q_SOURCE_PATHS;
}
