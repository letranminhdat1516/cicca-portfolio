"use client";
import { useEffect, useRef, useState } from "react";
import type { SkillGroup } from "@portfolio/types";
import { RARITY } from "@/data/profile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionHeader } from "./SectionHeader";

function SkillBar({ lvl, color, glow }: { lvl: number; color: string; glow: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [w, setW] = useState(reduced ? lvl : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      setW(lvl);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setW(lvl);
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [lvl, reduced]);

  return (
    <div ref={ref} className="mt-2 h-[5px] w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div
        className="h-full"
        style={{
          width: `${w}%`,
          background: color,
          boxShadow: `0 0 8px ${glow}`,
          transition: "width 1.3s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}

export function Inventory({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section id="inventory" className="mx-auto max-w-[1180px] px-6 py-20">
      <SectionHeader index="03" label="SKILL INVENTORY" title="EQUIPPED LOADOUT" />
      <div className="mb-8 flex flex-wrap gap-4">
        {(Object.keys(RARITY) as (keyof typeof RARITY)[]).map((k) => (
          <span key={k} className="flex items-center gap-2 text-[10px] tracking-widest" style={{ fontFamily: "var(--font-mono), monospace", color: "#9a9ab8" }}>
            <span className="h-3 w-3" style={{ background: RARITY[k].color }} />
            {RARITY[k].label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-8">
        {skillGroups.map((group) => (
          <div key={group.name}>
            <div className="mb-3 text-[12px] tracking-[2px]" style={{ fontFamily: "var(--font-mono), monospace", color: "#22d3ee" }}>
              {group.name}
            </div>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))" }}>
              {group.items.map((s) => {
                const r = RARITY[s.r];
                const isGh = s.source === "github";
                const basisText = s.basis || s.tip;
                return (
                  <div
                    key={s.n}
                    title={basisText}
                    className="flex flex-col p-3 transition-transform hover:-translate-y-1"
                    style={{ background: "rgba(10,10,18,0.7)", border: `1px solid ${r.glow}` }}
                  >
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-[15px] font-bold" style={{ fontFamily: "var(--font-ui), sans-serif", color: "#fff" }}>
                        {s.n}
                      </span>
                      <span className="text-[9px] tracking-widest" style={{ fontFamily: "var(--font-mono), monospace", color: r.color }}>
                        {r.label}
                      </span>
                    </div>
                    <SkillBar lvl={s.lvl} color={r.color} glow={r.glow} />
                    {basisText && (
                      <div className="mt-2 flex items-start gap-1.5">
                        <span
                          className="mt-px shrink-0 px-1 text-[8px] font-bold tracking-wider"
                          title={isGh ? "Measured from public GitHub activity" : "Backed by shipped projects"}
                          style={{
                            fontFamily: "var(--font-mono), monospace",
                            color: isGh ? "#22d3ee" : "#b026ff",
                            border: `1px solid ${isGh ? "rgba(34,211,238,0.4)" : "rgba(176,38,255,0.4)"}`,
                          }}
                        >
                          {isGh ? "GH" : "✦"}
                        </span>
                        <span className="text-[9px] leading-[1.3]" style={{ fontFamily: "var(--font-mono), monospace", color: "#6b6b88" }}>
                          {basisText}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
