import { ImageResponse } from "next/og";
import { getPortfolio } from "@/lib/portfolio";
import { seoOf } from "@/lib/seo";

export const alt = "Le Tran Minh Dat — AI-Native Software Engineer";
export const revalidate = 3600;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dark-blue Open Graph card, generated from CMS content. Falls back to static
// text if the API is unreachable at build/runtime.
export default async function Image() {
  let name = "Le Tran Minh Dat";
  let role = "AI-Native Software Engineer";
  let tagline = "I build AI agents and the backend they run on, from the database to deployment.";
  try {
    const data = await getPortfolio();
    const seo = seoOf(data);
    name = data.profile?.name || seo.siteName || name;
    role = data.profile?.classRole || role;
    tagline = data.profile?.tagline || seo.defaultDescription || tagline;
  } catch {
    // keep fallbacks
  }
  const m = role.match(/^(\S+)\s+(.+)$/);
  const [lead, rest] = m ? [m[1], m[2]] : [role, ""];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px 80px",
          backgroundColor: "#03061A",
          backgroundImage: "radial-gradient(circle at 85% 30%, rgba(47,123,255,0.45) 0%, rgba(91,75,230,0.18) 30%, rgba(3,6,26,0) 60%)",
          color: "#E8EEFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: "#8C97B8" }}>
          Hi, I&apos;m <span style={{ marginLeft: 10, color: "#E8EEFF", fontWeight: 700 }}>{name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 18, fontSize: 92, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
          <span style={{ color: "#5FA8FF" }}>{lead}</span>
          {rest ? <span style={{ color: "#F2F5FF" }}>{rest}</span> : null}
        </div>
        <div style={{ display: "flex", fontSize: 32, marginTop: 28, color: "#A9B4D0", maxWidth: 900 }}>{tagline}</div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            height: 8,
            width: 320,
            background: "linear-gradient(90deg,#1C3FD6,#2F6BFF 45%,#5B4BE6)",
            borderRadius: 8,
          }}
        />
      </div>
    ),
    size,
  );
}
