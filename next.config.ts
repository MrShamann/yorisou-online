import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // On local machines the repo lives inside iCloud Drive (~/Documents), which
  // causes the build to hang as iCloud tries to sync every .next file written
  // by webpack. Redirect to /tmp when NEXT_DIST_DIR is set so builds finish
  // locally. CI/Amplify leave this unset and get the default '.next' output.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
