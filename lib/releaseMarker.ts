import { readFileSync } from "fs";
import path from "path";

export function getReleaseMarker() {
  const commitSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.GIT_COMMIT_SHA;

  if (commitSha) {
    return `release:${commitSha.slice(0, 12)}`;
  }

  try {
    const filePath = path.join(process.cwd(), "deploy-trigger.txt");
    return readFileSync(filePath, "utf8").trim().replace(/\n/g, " | ");
  } catch {
    return "release:unknown";
  }
}
