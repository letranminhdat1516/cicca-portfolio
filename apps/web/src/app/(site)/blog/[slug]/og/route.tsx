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
          backgroundColor: "#03061A",
          backgroundImage: "radial-gradient(circle at 85% 30%, rgba(47,123,255,0.45) 0%, rgba(91,75,230,0.18) 30%, rgba(3,6,26,0) 60%)",
          color: "#E8EEFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#6FA8FF" }}>
          LE TRAN MINH DAT · BLOG
        </div>
        <div
          style={{
            display: "flex",
            fontSize: post.title.length > 50 ? 56 : 68,
            fontWeight: 800,
            marginTop: 20,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: "#F2F5FF",
          }}
        >
          {post.title}
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "#9CC2FF" }}>
          {post.tags.map((t) => `#${t}`).join("  ")}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            height: 8,
            width: 320,
            background: "linear-gradient(90deg,#1C3FD6,#2F6BFF 45%,#5B4BE6)",
            borderRadius: 8,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" } },
  );
}
