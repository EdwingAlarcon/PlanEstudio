import type { NextConfig } from "next";

// When deploying to GitHub Pages the basePath must be /PlanEstudio.
// For local dev and E2E tests we leave it empty so the app lives at /.
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/PlanEstudio" : "",
  assetPrefix: isGitHubPages ? "/PlanEstudio/" : "",
  images: {
    unoptimized: true,
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default nextConfig;
