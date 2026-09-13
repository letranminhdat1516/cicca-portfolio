import path from "node:path";
import type { NextConfig } from "next";

// Internal API origin. Used by SSR directly and as the rewrite target. Rewrites
// are baked at build time, so the container build must pass the in-cluster URL.
const API_INTERNAL = process.env.API_INTERNAL_URL ?? "http://localhost:3101";

const nextConfig: NextConfig = {
  // Self-contained server for the container image (apps/web/Dockerfile).
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@portfolio/design-tokens", "@portfolio/types"],
  // Proxy same-origin /api/* to the internal NestJS API, so the browser only
  // ever talks to the web domain — one hostname, no CORS, no separate API host.
  // e.g. /api/content -> http://localhost:3101/content
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_INTERNAL}/:path*` }];
  },
  async headers() {
    return [
      {
        // The PDF carries a third party's contact details (the reference), so
        // search engines index the HTML résumé at /cv instead of the file.
        source: "/cv/letranminhdat-cv.pdf",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
