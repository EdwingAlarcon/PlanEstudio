import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/PlanEstudio",
  images: {
    unoptimized: true,
  },
  // MDX support
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default nextConfig;
