import type { Profile } from "@portfolio/types";
import { ABOUT, FOCUS, NOW } from "@/data/home";
import { IDENTITY } from "@/lib/identity";
import { MONO } from "./ui";

/** Bio paragraphs from the CMS; a short "Label:" lead-in is set in bold. */
export function bioParagraphs(bio: string | null | undefined): { label: string | null; text: string }[] {
  return (bio ?? "")
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(/^([^.:]{3,40}):\s+(.+)$/);
      return m ? { label: `${m[1]}:`, text: m[2] } : { label: null, text: p };
    });
}

const LABEL = { ...MONO, fontSize: 12, letterSpacing: "0.1em", color: "#8C97B8" } as const;

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" style={{ position: "relative", zIndex: 3, maxWidth: 1200, margin: "72px auto 0", padding: "0 24px" }}>
      <div
        style={{
          position: "relative",
          borderRadius: 28,
          border: "1px solid rgba(111,168,255,0.35)",
          background: "linear-gradient(180deg,rgba(40,60,190,0.55),rgba(10,16,52,0.9))",
          boxShadow: "0 -20px 80px -30px rgba(47,123,255,0.7)",
          padding: "clamp(28px, 5vw, 52px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "32px 48px",
        }}
      >
        <div style={{ flex: "999 1 480px", minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: "clamp(30px, 4vw, 44px)" }}>About me</h2>
          <span style={{ ...MONO, fontSize: 14, color: "#6FA8FF" }}>{ABOUT.command}</span>
          {bioParagraphs(profile.bio).map((p) => (
            <p key={p.text} style={{ margin: 0, color: "#C9D4F2" }}>
              {p.label && <strong style={{ color: "#FFFFFF" }}>{p.label} </strong>}
              {p.text}
            </p>
          ))}
          <div style={{ ...MONO, display: "flex", flexWrap: "wrap", gap: "8px 18px", fontSize: 13, color: "#A9B4D0" }}>
            <span>
              {`${profile.name || IDENTITY.name} · `}
              <span lang="vi">{IDENTITY.nativeName}</span>
              {` · ${IDENTITY.handle}`}
            </span>
            <span>{ABOUT.meta}</span>
            <span>
              status: <span style={{ color: "#6FA8FF" }}>{ABOUT.status}</span> ▸
            </span>
          </div>
          <h3 style={{ ...LABEL, margin: "8px 0 0", fontWeight: 400 }}>NEXT QUESTS</h3>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))",
              gap: 14,
            }}
          >
            {FOCUS.map((f) => (
              <li
                key={f.k}
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(111,168,255,0.4)",
                  background: "rgba(8,14,48,0.7)",
                  padding: "18px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  textAlign: "center",
                  boxShadow: "inset 0 0 30px rgba(47,123,255,0.18)",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 21,
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    background: "linear-gradient(90deg,#6FB8FF,#3D6BFF)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {f.k}
                </span>
                <span style={{ fontSize: 13, color: "#A9B4D0" }}>{f.l}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside aria-label="Currently" style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <span style={LABEL}>CURRENTLY</span>
            <a
              href="#contact"
              style={{
                ...MONO,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(61,220,151,0.14)",
                color: "#3DDC97",
                border: "1px solid rgba(61,220,151,0.4)",
              }}
            >
              <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#3DDC97", boxShadow: "0 0 8px #3DDC97" }} />
              {ABOUT.openToWork}
            </a>
          </div>
          {NOW.map((c) => (
            <div
              key={c.role}
              style={{
                borderRadius: 16,
                border: "1px solid rgba(111,168,255,0.25)",
                background: "rgba(8,14,48,0.6)",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <span style={{ fontWeight: 600 }}>{c.role}</span>
              <span style={{ fontSize: 14, color: "#8C97B8" }}>{c.where}</span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
