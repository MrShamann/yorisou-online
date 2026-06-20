import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const registryPath = path.join(repoRoot, "lib/yorisou/persona-asset-registry.ts");
const source = fs.readFileSync(registryPath, "utf8");

const expectedPaths = new Set();
const regex = /["'`](\/assets\/yorisou\/[^"'`]+)["'`]/g;
let match;
while ((match = regex.exec(source))) {
  expectedPaths.add(match[1]);
}

const found = [];
const missing = [];

for (const expectedPath of [...expectedPaths].sort()) {
  const fsPath = path.join(repoRoot, "public", expectedPath.replace(/^\//, ""));
  if (fs.existsSync(fsPath)) {
    found.push(expectedPath);
  } else {
    missing.push(expectedPath);
  }
}

console.log("Yorisou persona asset storage check");
console.log(`Registry: ${registryPath}`);
console.log(`Expected assets: ${expectedPaths.size}`);
console.log(`Found assets: ${found.length}`);
console.log(`Missing assets: ${missing.length}`);

if (found.length > 0) {
  console.log("\nFound:");
  for (const item of found) {
    console.log(`- ${item}`);
  }
}

if (missing.length > 0) {
  console.log("\nMissing:");
  for (const item of missing) {
    console.log(`- ${item}`);
  }
}

process.exit(0);
