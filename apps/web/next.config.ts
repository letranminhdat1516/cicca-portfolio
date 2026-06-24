import type { NextConfig } from "next";

// Internal API origin (same VPS). Used by SSR directly and as the rewrite target.
const API_INTERNAL = process.env.API_INTERNAL_URL ?? "http://localhost:3101";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/design-tokens", "@portfolio/types"],
  // Proxy same-origin /api/* to the internal NestJS API, so the browser only
  // ever talks to the web domain — one hostname, no CORS, no separate API host.
  // e.g. /api/content -> http://localhost:3101/content
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_INTERNAL}/:path*` }];
  },
};

export default nextConfig;
