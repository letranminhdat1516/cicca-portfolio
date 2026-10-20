import type { Achievement } from "@portfolio/types";
import Link from "next/link";
import { RECOGNITION_TILTS, awardHref } from "@/data/home";
import { Eyebrow, H2, MONO } from "./ui";

export function Recognition({ achievements }: { achievements: Achievement[] }) {
  if (!achievements.length) return null;
  return (
    <section
      aria-labelledby="rec"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px", display: "flex", flexDirection: "column", gap: 32 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Eyebrow>04 · RECOGNITION</Eyebrow>
        <h2 id="rec" style={H2}>
          Education &amp; awards
        </h2>
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
          gap: 16,
        }}
      >
        {achievements.map((a, i) => {
          const href = awardHref(a.title);
          const body = (
            <>
              {a.year && (
                <span
                  style={{
                    ...MONO,
                    alignSelf: "flex-start",
                    fontSize: 11,
                    padding: "3px 10px",
                    borderRadius: 999,
                    border: "1px dashed rgba(111,168,255,0.6)",
                    color: "#9CC2FF",
                  }}
                >
                  {a.year}
                </span>
              )}
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 18, lineHeight: 1.25 }}>{a.title}</h3>
              <span style={{ fontSize: 14, color: "#8C97B8" }}>{a.description}</span>
              {href && (
                <span style={{ ...MONO, marginTop: 6, fontSize: 12, color: "#6FA8FF" }}>
                  {href === "/cv" ? "View CV" : "Read the case study"} <span aria-hidden="true">→</span>
                </span>
              )}
            </>
          );
          const card = {
            borderRadius: 20,
            border: "1px solid rgba(111,168,255,0.3)",
            background: "rgba(10,16,52,0.7)",
            padding: 22,
            display: "flex",
            flexDirection: "column" as const,
            gap: 6,
            height: "100%",
            boxSizing: "border-box" as const,
          };
          return (
            <li key={a.title} style={{ transform: `rotate(${RECOGNITION_TILTS[i % RECOGNITION_TILTS.length]})` }}>
              {href ? (
                <Link href={href} className="card" style={{ ...card, textDecoration: "none", color: "inherit" }}>
                  {body}
                </Link>
              ) : (
                <div className="card" style={card}>
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
