import path from "path";

function isProductionBuild() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function getInsightRuntimeDataDir() {
  if (process.env.YORISOU_INSIGHTS_DATA_DIR) {
    return process.env.YORISOU_INSIGHTS_DATA_DIR;
  }

  if (process.env.VERCEL && !isProductionBuild()) {
    return path.join("/tmp", "yorisou-online-data");
  }

  return path.join(process.cwd(), "data");
}
