import { readFileSync } from "fs";
import path from "path";

export function getReleaseMarker() {
  try {
    const filePath = path.join(process.cwd(), "deploy-trigger.txt");
    return readFileSync(filePath, "utf8").trim().replace(/\n/g, " | ");
  } catch {
    return "release:unknown";
  }
}
