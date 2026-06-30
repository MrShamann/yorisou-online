import type { NextConfig } from "next";

const localTmpDistDir = "/tmp/yorisou-next/.next";
const repoPath = process.cwd();
const isLocalDocumentsWorkspace = repoPath.includes("/Documents/");

const nextConfig: NextConfig = {
  // On local machines the repo lives inside iCloud Drive (~/Documents), which
  // causes the build to hang as iCloud tries to sync every .next file written
  // by webpack. Redirect to /tmp for local Documents workspaces so builds
  // finish without requiring an env var. CI/Amplify stay on the default '.next'.
  ...(process.env.NEXT_DIST_DIR || isLocalDocumentsWorkspace
    ? { distDir: process.env.NEXT_DIST_DIR || localTmpDistDir }
    : {}),
};

export default nextConfig;
