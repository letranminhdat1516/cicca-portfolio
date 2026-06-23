import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/design-tokens", "@portfolio/types"],
};

export default nextConfig;
