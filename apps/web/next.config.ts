import path from "node:path";
import type { NextConfig } from "next";

// Internal API origin. Used by SSR directly and as the rewrite target. Rewrites
// are baked at build time, so the container build must pass the in-cluster URL.
const API_INTERNAL = process.env.API_INTERNAL_URL ?? "http://localhost:3101";

// Non-canonical hostnames that serve the same app get a 301 to the canonical
// site so search engines consolidate on one domain.
const SITE = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
const ALIAS_HOSTS = [
  `www.${SITE.hostname}`,
  ...(process.env.ALIAS_HOSTS ?? "").split(",").map((h) => h.trim()),
].filter(Boolean);

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
  async redirects() {
    if (SITE.hostname === "localhost") return [];
    return ALIAS_HOSTS.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: `${SITE.origin}/:path*`,
      permanent: true,
    }));
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
