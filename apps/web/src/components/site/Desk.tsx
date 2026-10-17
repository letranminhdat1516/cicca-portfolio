import { ACCENT, STACK_CHIPS, TOOLS } from "@/data/home";
import { RepoTree } from "./RepoTree";
import { SneakPeek } from "./SneakPeek";
import { Eyebrow, Highlight, PANEL } from "./ui";

const H3 = { margin: 0, fontWeight: 700, fontSize: 24 } as const;

function ToolIcon({ kind }: { kind: (typeof TOOLS)[number]["icon"] }) {
  if (kind === "monitor") {
    return (
      <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E8EEFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="13" rx="2" fill="#0B1233" />
        <path d="M8 21h8M12 17v4" />
        <path d="M6 11h3l1.5-3 3 6 1.5-3h3" stroke="#6FA8FF" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#E8EEFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H8l-3 3v-3a2 2 0 0 1-2-2z" fill="#0B1233" />
      <path d="M15 9h4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2v3l-3-3h-4a2 2 0 0 1-2-2v-1" />
      <path d="M6.5 6h5M9 6v4M16 17l2-5 2 5M16.7 15.5h2.6" stroke="#6FA8FF" />
    </svg>
  );
}

const TILE = {
  textDecoration: "none",
  aspectRatio: "1 / 1",
  borderRadius: 18,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  fontSize: 14,
} as const;

export function Desk() {
  return (
    <section id="desk" style={{ position: "relative" }}>
      <div className="glow-left" aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
      <div
        style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "100px 24px 40px", display: "flex", flexDirection: "column", gap: 40 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Eyebrow>02 · WORKBENCH</Eyebrow>
          <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, letterSpacing: "-0.03em" }}>
            On the <Highlight big>desk</Highlight>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 22, alignItems: "start" }}>
          {/* Repo tree */}
          <div style={{ ...PANEL, padding: "24px 0 10px" }}>
            <h3 style={{ ...H3, padding: "0 24px 14px", borderBottom: "1px solid rgba(111,168,255,0.18)" }}>Repos I&apos;m in</h3>
            <RepoTree />
          </div>

          {/* Sneak peek */}
          <div style={{ ...PANEL, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={H3}>Sneak peek</h3>
            <SneakPeek />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Tools */}
            <div style={{ ...PANEL, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={H3}>Tools I made</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
                {TOOLS.map((t) => (
                  <a
                    key={t.name}
                    href={t.href}
                    target="_blank"
                    rel="noopener"
                    style={{
                      ...TILE,
                      border: "1px solid rgba(111,168,255,0.6)",
                      background: "rgba(47,107,255,0.18)",
                      boxShadow: "0 0 24px -8px rgba(47,123,255,0.8)",
                      fontWeight: 600,
                    }}
                  >
                    <ToolIcon kind={t.icon} />
                    {t.name}
                  </a>
                ))}
                <div style={{ ...TILE, border: "1px dashed rgba(111,168,255,0.4)", color: "#8C97B8" }}>
                  <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8C97B8" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Soon
                </div>
              </div>
            </div>
            {/* Stack */}
            <div style={{ ...PANEL, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              <h3 style={H3}>Stack, stamped</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: "10px 8px" }}>
                {STACK_CHIPS.map((s) => (
                  <li
                    key={s.n}
                    style={{
                      fontSize: 14,
                      padding: "5px 14px",
                      borderRadius: 999,
                      border: s.hot ? `1px solid ${ACCENT}` : "1px dashed rgba(111,168,255,0.45)",
                      background: s.hot ? ACCENT : "rgba(10,16,52,0.8)",
                      color: "#E8EEFF",
                      transform: `rotate(${s.tilt})`,
                      boxShadow: s.hot ? "0 0 18px rgba(47,123,255,0.6)" : "none",
                    }}
                  >
                    {s.n}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
