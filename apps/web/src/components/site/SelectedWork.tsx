import Link from "next/link";
import type { Mission } from "@portfolio/types";
import { WORK_COPY } from "@/data/home";
import { selectWork, type WorkItem } from "@/data/projectVisuals";
import { Eyebrow, H2, Highlight, MONO, PlayIcon, Tag } from "./ui";

function Art({ w, large }: { w: WorkItem; large: boolean }) {
  const inset = large ? 16 : 12;
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "16 / 10",
        background: w.visual.art,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div className="grid-bg" aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
      <span
        aria-hidden="true"
        style={{
          ...MONO,
          position: "relative",
          fontWeight: 500,
          fontSize: large ? "clamp(40px, 5vw, 64px)" : 40,
          letterSpacing: large ? "-0.02em" : undefined,
          color: "rgba(255,255,255,0.92)",
          textShadow: `0 0 ${large ? 40 : 30}px rgba(255,255,255,0.35)`,
        }}
      >
        {w.visual.glyph}
      </span>
      <span
        style={{
          ...MONO,
          position: "absolute",
          left: inset,
          top: inset,
          fontSize: large ? 11 : 10,
          padding: large ? "4px 10px" : "3px 9px",
          borderRadius: 999,
          background: "rgba(3,6,26,0.7)",
          border: `1px solid ${w.status.color}`,
          color: w.status.color,
        }}
      >
        {w.status.label}
      </span>
      {large && (
        <span
          style={{
            ...MONO,
            position: "absolute",
            right: 16,
            bottom: 14,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 999,
            background: "rgba(3,6,26,0.6)",
            color: "#DCE4FF",
          }}
        >
          <PlayIcon />
          demo soon
        </span>
      )}
    </div>
  );
}

function LargeCard({ w }: { w: WorkItem }) {
  return (
    <Link
      id={w.mission.slug}
      href={`/projects/${w.mission.slug}`}
      className="card"
      style={{
        scrollMarginTop: 96,
        textDecoration: "none",
        color: "#E8EEFF",
        borderRadius: 26,
        border: "1px solid rgba(111,168,255,0.3)",
        background: "rgba(10,16,52,0.7)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Art w={w} large />
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ ...MONO, fontSize: 11, color: "#6FA8FF" }}>
          {w.visual.domain} · {w.visual.when}
        </span>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: 24, lineHeight: 1.2 }}>{w.visual.short}</h3>
        <p style={{ margin: 0, color: "#A9B4D0", fontSize: 15 }}>{w.visual.tagline}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, paddingTop: 6 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {w.visual.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#6FA8FF" }}>Read the story →</span>
        </div>
      </div>
    </Link>
  );
}

function SmallCard({ w }: { w: WorkItem }) {
  return (
    <li style={{ flex: "0 0 calc((100% - 60px) / 4)", minWidth: 230, display: "flex" }}>
      <Link
        id={w.mission.slug}
        href={`/projects/${w.mission.slug}`}
        className="card"
        style={{
          scrollMarginTop: 96,
          flex: "1 1 auto",
          textDecoration: "none",
          color: "#E8EEFF",
          borderRadius: 20,
          border: "1px solid rgba(111,168,255,0.25)",
          background: "rgba(10,16,52,0.7)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Art w={w} large={false} />
        <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ ...MONO, fontSize: 11, color: "#6FA8FF" }}>
            {w.visual.domain} · {w.visual.when}
          </span>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 18, lineHeight: 1.25 }}>{w.visual.short}</h3>
          <p style={{ margin: 0, color: "#A9B4D0", fontSize: 14 }}>{w.visual.tagline}</p>
        </div>
      </Link>
    </li>
  );
}

export function SelectedWork({ missions }: { missions: Mission[] }) {
  const { large, rest } = selectWork(missions);
  if (!large.length) return null;
  return (
    <section
      id="work"
      style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "96px 24px 40px", display: "flex", flexDirection: "column", gap: 40 }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Eyebrow>{WORK_COPY.eyebrow}</Eyebrow>
          <h2 style={H2}>
            Systems in <Highlight>production</Highlight>
          </h2>
        </div>
        <p style={{ margin: 0, maxWidth: 400, color: "#8C97B8" }}>{WORK_COPY.lead}</p>
      </div>
      {/* image-first cards: the picture does the talking, the story lives on the project page */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 20 }}>
        {large.map((w) => (
          <LargeCard key={w.mission.slug} w={w} />
        ))}
      </div>
      {rest.length > 0 && (
        // four fit the row; a fifth card onward makes the row swipeable (scroll-snap)
        <ul
          className="hscroll"
          aria-label="More projects"
          style={{ listStyle: "none", display: "flex", gap: 20, overflowX: "auto", padding: "4px 2px 14px", margin: "-4px -2px 0" }}
        >
          {rest.map((w) => (
            <SmallCard key={w.mission.slug} w={w} />
          ))}
        </ul>
      )}
    </section>
  );
}
