import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";

// Per-post share card, used as og:image for posts that have no cover image.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (!post) return new Response("Not found", { status: 404 });

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
          background: "radial-gradient(circle at 20% 20%, #0a1530 0%, #05070f 55%, #04050b 100%)",
          color: "#e8f0ff",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: "#22d3ee" }}>
          LE TRAN MINH DAT · BLOG
        </div>
        <div
          style={{
            display: "flex",
            fontSize: post.title.length > 50 ? 56 : 68,
            fontWeight: 800,
            marginTop: 20,
            color: "#f0f6ff",
            textShadow: "0 0 40px rgba(34,211,238,0.55)",
          }}
        >
          {post.title}
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "#9fb3d1" }}>
          {post.tags.map((t) => `#${t}`).join("  ")}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            height: 8,
            width: 320,
            background: "linear-gradient(90deg,#22d3ee,#a855f7,#f43f5e)",
            borderRadius: 8,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
