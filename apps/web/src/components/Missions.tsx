"use client";
import type { Mission } from "@portfolio/types";
import { useTilt } from "@/hooks/useTilt";
import { SectionHeader } from "./SectionHeader";

const CHAMFER =
  "polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))";

function MissionCard({ m }: { m: Mission }) {
  const ref = useTilt<HTMLElement>();
  return (
    <article
      ref={ref}
      className="p-5"
      style={{
        background: "rgba(10,10,18,0.7)",
        border: "1px solid rgba(176,38,255,0.2)",
        clipPath: CHAMFER,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] tracking-[2px]"
          style={{ fontFamily: "var(--font-mono), monospace", color: "#b026ff" }}
        >
          {m.code}
        </span>
        <span className="flex items-center gap-1.5 text-[10px] tracking-widest" style={{ fontFamily: "var(--font-mono), monospace", color: m.statusColor }}>
          <span className="h-2 w-2 rounded-full" style={{ background: m.statusColor }} />
          {m.status}
        </span>
      </div>
      <h3 className="mt-2 text-[21px] font-bold" style={{ fontFamily: "var(--font-ui), sans-serif", color: "#fff" }}>
        {m.title}
      </h3>
      <p className="mt-2 text-[13.5px] leading-6" style={{ color: "#a8a8c2" }}>
        {m.objective}
      </p>
      <div className="mt-4 flex gap-6 text-[11px]" style={{ fontFamily: "var(--font-mono), monospace" }}>
        <span style={{ color: "#9a9ab8" }}>
          DIFFICULTY <span style={{ color: "#ffd23f" }}>{m.difficulty}</span>
        </span>
        <span style={{ color: "#9a9ab8" }}>
          IMPACT <span style={{ color: "#22d3ee" }}>{m.impact}</span>
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {m.loadout.map((t) => (
          <span
            key={t}
            className="px-2 py-1 text-[10px]"
            style={{
              fontFamily: "var(--font-mono), monospace",
              color: "#9a9ab8",
              border: "1px solid rgba(34,211,238,0.2)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}

export function Missions({ missions }: { missions: Mission[] }) {
  return (
    <section id="missions" className="mx-auto max-w-[1180px] px-6 py-20">
      <SectionHeader index="02" label="MISSION LOG" title="COMPLETED MISSIONS" />
      <div className="grid grid-cols-1 gap-5 [@media(min-width:900px)]:grid-cols-2">
        {missions.map((m) => (
          <MissionCard key={m.code} m={m} />
        ))}
      </div>
    </section>
  );
}
