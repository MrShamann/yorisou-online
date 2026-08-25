import type { NextConfig } from "next";

const localTmpDistDir = "/tmp/yorisou-next/.next";
const repoPath = process.cwd();
const isLocalDocumentsWorkspace = repoPath.includes("/Documents/");

const nextConfig: NextConfig = {
  // CORP-P4AR2 — enables `app/global-not-found.tsx`, the App Router convention that renders a 404
  // as its OWN document instead of inside the root layout. This is what structurally prevents the
  // consumer `AppShell` from wrapping the corporate 404: a layout cannot wrap what renders above it.
  // Supported but opt-in in Next.js 16.2.10. See app/global-not-found.tsx for the full rationale and
  // the rejected alternatives.
  experimental: { globalNotFound: true },
  // On local machines the repo lives inside iCloud Drive (~/Documents), which
  // causes the build to hang as iCloud tries to sync every .next file written
  // by webpack. Redirect to /tmp for local Documents workspaces so builds
  // finish without requiring an env var. CI/Amplify stay on the default '.next'.
  ...(process.env.NEXT_DIST_DIR || isLocalDocumentsWorkspace
    ? { distDir: process.env.NEXT_DIST_DIR || localTmpDistDir }
    : {}),
};

export default nextConfig;
