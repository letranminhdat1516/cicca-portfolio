import type { Achievement } from "@portfolio/types";
import { SectionHeader } from "./SectionHeader";

export function Trophies({ achievements }: { achievements: Achievement[] }) {
  return (
    <section id="trophies" className="mx-auto max-w-[1180px] px-6 py-20">
      <SectionHeader index="04" label="ACHIEVEMENTS" title="TROPHIES UNLOCKED" />
      <div className="relative pl-8">
        <div
          className="absolute left-[6px] top-1 bottom-1 w-px"
          style={{ background: "linear-gradient(180deg,#22d3ee,#b026ff,#ff2d9b)" }}
        />
        <div className="flex flex-col gap-8">
          {achievements.map((a) => (
            <div key={a.title} className="relative">
              <span
                className="absolute -left-[30px] top-1 h-[18px] w-[18px] rounded-full"
                style={{
                  border: `2px solid ${a.color}`,
                  background: "#08070f",
                  boxShadow: `0 0 12px ${a.glow}`,
                }}
              />
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-ui), sans-serif", color: "#fff" }}>
                  <span style={{ color: a.color }}>★ </span>
                  {a.title}
                </h3>
                <span className="text-[11px] tracking-widest" style={{ fontFamily: "var(--font-mono), monospace", color: "#9a9ab8" }}>
                  {a.year}
                </span>
              </div>
              <p className="mt-1 text-[13.5px] leading-6" style={{ color: "#a8a8c2" }}>
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
