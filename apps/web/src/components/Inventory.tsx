import type { SkillGroup } from "@portfolio/types";
import { SectionHeader } from "./SectionHeader";

export function Inventory({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section id="inventory" className="mx-auto max-w-[1180px] px-6 py-20">
      <SectionHeader index="03" label="SKILL INVENTORY" title="EQUIPPED LOADOUT" />
      <div className="flex flex-col gap-8">
        {skillGroups.map((group) => (
          <div key={group.name}>
            <div className="mb-3 text-[12px] tracking-[2px]" style={{ fontFamily: "var(--font-mono), monospace", color: "#22d3ee" }}>
              {group.name}
            </div>
            <div className="flex flex-wrap gap-3">
              {group.items.map((s) => (
                <span
                  key={s.n}
                  title={s.tip}
                  className="px-4 py-2 text-[14px] font-bold transition-transform hover:-translate-y-0.5"
                  style={{
                    fontFamily: "var(--font-ui), sans-serif",
                    color: "#fff",
                    background: "rgba(10,10,18,0.7)",
                    border: "1px solid rgba(176,38,255,0.3)",
                  }}
                >
                  {s.n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
