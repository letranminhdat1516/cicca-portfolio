import { ImageResponse } from "next/og";
import { getPortfolio } from "@/lib/portfolio";
import { seoOf } from "@/lib/seo";

export const alt = "PLAYER_01.sys — Developer Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded neon Open Graph card, generated from CMS content. Falls back to
// static text if the API is unreachable at build/runtime.
export default async function Image() {
  let siteName = "PLAYER_01.sys";
  let tagline = "Creative Developer Portfolio";
  let name = "";
  try {
    const data = await getPortfolio();
    const seo = seoOf(data);
    siteName = seo.siteName;
    tagline = data.profile?.tagline || data.profile?.classRole || tagline;
    name = data.profile?.name ?? "";
  } catch {
    // keep fallbacks
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(circle at 20% 20%, #0a1530 0%, #05070f 55%, #04050b 100%)",
          color: "#e8f0ff",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            letterSpacing: 6,
            color: "#22d3ee",
            textTransform: "uppercase",
          }}
        >
          {name || "Player One"}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 800,
            marginTop: 12,
            color: "#f0f6ff",
            textShadow: "0 0 40px rgba(34,211,238,0.55)",
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 38,
            marginTop: 24,
            color: "#9fb3d1",
            maxWidth: 900,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            height: 8,
            width: 320,
            background: "linear-gradient(90deg,#22d3ee,#a855f7,#f43f5e)",
            borderRadius: 8,
          }}
        />
      </div>
    ),
    size,
  );
}
