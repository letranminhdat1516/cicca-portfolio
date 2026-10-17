import type { Profile } from "@portfolio/types";
import { ACCENT, HERO } from "@/data/home";
import { HeroArt } from "./HeroArt";
import { MONO } from "./ui";

/** "AI-Native Software Engineer" → ["AI-Native", "Software Engineer"]. */
export function splitRole(role: string | null | undefined): [string, string] {
  const r = (role ?? "").trim() || HERO.fallbackRole;
  const m = r.match(/^(\S+)\s+(.+)$/);
  return m ? [m[1], m[2]] : [r, ""];
}

export function Hero({ profile }: { profile: Profile }) {
  const [lead, rest] = splitRole(profile.classRole);
  return (
    <section id="top" className="grid-bg" style={{ position: "relative" }}>
      <div className="glow-right" aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
      <div
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "48px 24px 0",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div style={{ flex: "1 1 460px", minWidth: 0, display: "flex", flexDirection: "column", gap: 22, paddingBottom: 56 }}>
          <span
            style={{
              ...MONO,
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11.5,
              color: "#C9D4F2",
              border: "1px solid rgba(111,168,255,0.3)",
              background: "rgba(10,16,52,0.5)",
              padding: "5px 12px",
              borderRadius: 999,
            }}
          >
            <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#3DDC97", boxShadow: "0 0 10px #3DDC97" }} />
            {HERO.eyebrow}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span style={{ fontSize: 17, color: "#8C97B8" }}>
              Hi, I&apos;m <span style={{ color: "#E8EEFF", fontWeight: 600 }}>{profile.name}</span>
            </span>
            <h1
              className="hero-h1"
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "clamp(38px, 4.6vw, 58px)",
                lineHeight: 1.06,
                letterSpacing: "-0.035em",
                color: "#F2F5FF",
              }}
            >
              <span
                style={{
                  background: "linear-gradient(90deg,#5FC0FF,#3D6BFF 60%,#8A6BFF)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {lead}
              </span>
              {rest && (
                <>
                  <br />
                  {rest}
                </>
              )}
            </h1>
            <div style={{ ...MONO, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 12px", fontSize: 13, color: "#9CC2FF" }}>
              {HERO.subline.map((s, i) => (
                <span key={s} style={{ display: "contents" }}>
                  {i > 0 && <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: "#3D6BFF" }} />}
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>
          {profile.tagline && (
            <p style={{ margin: 0, maxWidth: 440, fontSize: 17, lineHeight: 1.65, color: "#A9B4D0" }}>{profile.tagline}</p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a
              href="#work"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: ACCENT,
                color: "#FFFFFF",
                padding: "10px 20px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 500,
                boxShadow: "0 8px 24px -8px rgba(47,123,255,0.7)",
              }}
            >
              See the work <span aria-hidden="true">›</span>
            </a>
            <a
              href="/cv"
              style={{
                textDecoration: "none",
                padding: "9px 20px",
                borderRadius: 999,
                border: "1px solid rgba(111,168,255,0.4)",
                background: "rgba(10,16,52,0.5)",
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Résumé
            </a>
          </div>
          <div className="m-only" style={{ ...MONO, flexWrap: "wrap", gap: 8, fontSize: 12, color: "#DCE4FF" }}>
            {HERO.chips.map((c) => (
              <span
                key={c.label}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(10,16,52,0.78)",
                  border: "1px solid rgba(111,168,255,0.32)",
                }}
              >
                <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot }} />
                {c.label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 520px", minWidth: 0, display: "flex", justifyContent: "center" }}>
          <HeroArt />
        </div>
      </div>
    </section>
  );
}
