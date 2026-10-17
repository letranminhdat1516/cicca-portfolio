import type { Experience as Exp } from "@portfolio/types";
import { ACCENT, EXPERIENCE_COPY } from "@/data/home";
import { splitDescription } from "@/lib/llms";
import { Eyebrow, H2, Highlight, MONO, PILL_OUTLINE } from "./ui";

/** One line for the timeline: the lead sentence, else the first bullet. */
export function experienceLine(description: string): string {
  const { lead, bullets } = splitDescription(description ?? "");
  return (lead ?? bullets[0] ?? "").replace(/\s+/g, " ").trim();
}

export const isCurrent = (period: string) => /present|now/i.test(period);

export function Experience({ experiences }: { experiences: Exp[] }) {
  return (
    <section
      id="experience"
      style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "100px 24px 40px", display: "flex", flexWrap: "wrap", gap: "40px 64px" }}
    >
      <div style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <Eyebrow>{EXPERIENCE_COPY.eyebrow}</Eyebrow>
        <h2 style={H2}>
          The <Highlight>path</Highlight> so far
        </h2>
        <p style={{ margin: 0, color: "#8C97B8" }}>{EXPERIENCE_COPY.lead}</p>
        <a href="/cv" style={{ ...PILL_OUTLINE, alignSelf: "flex-start", marginTop: 8 }}>
          Full résumé
        </a>
      </div>
      <ol style={{ flex: "999 1 600px", minWidth: 0, margin: 0, padding: 0, listStyle: "none" }}>
        {experiences.map((e) => (
          <li key={`${e.org}-${e.title}-${e.period}`} className="exp-li" style={{ display: "flex", gap: 22 }}>
            <span
              className="exp-period"
              style={{ ...MONO, flex: "0 0 120px", textAlign: "right", fontSize: 12, color: "#C9D4F2", paddingTop: 4 }}
            >
              {e.period}
            </span>
            <span aria-hidden="true" style={{ flex: "0 0 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: ACCENT, boxShadow: "0 0 12px rgba(47,123,255,0.9)", marginTop: 6 }} />
              <span style={{ flex: "1 1 auto", width: 2, background: "linear-gradient(180deg,rgba(47,123,255,0.8),rgba(47,123,255,0.15))" }} />
            </span>
            <div style={{ flex: "1 1 auto", minWidth: 0, paddingBottom: 30, display: "flex", flexDirection: "column", gap: 3 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 19,
                    background: "linear-gradient(90deg,#4FB2FF,#7A8BFF)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {e.title}
                </h3>
                {isCurrent(e.period) && (
                  <span
                    style={{
                      ...MONO,
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(61,220,151,0.15)",
                      color: "#3DDC97",
                      border: "1px solid rgba(61,220,151,0.4)",
                    }}
                  >
                    NOW
                  </span>
                )}
              </div>
              <span style={{ fontSize: 14, color: "#C9D4F2" }}>{e.org}</span>
              {experienceLine(e.description) && (
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "#8C97B8" }}>{experienceLine(e.description)}</p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
