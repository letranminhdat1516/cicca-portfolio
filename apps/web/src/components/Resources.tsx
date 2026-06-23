import type { Resource } from "@portfolio/types";
import { SectionHeader } from "./SectionHeader";

const CHAMFER =
  "polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))";

export function Resources({ resources = [] }: { resources?: Resource[] }) {
  if (resources.length === 0) return null;
  return (
    <section id="resources" className="mx-auto max-w-[1180px] px-6 py-20">
      <SectionHeader index="07" label="SUPPLY DROP" title="SHARED LOOT" />
      <div className="grid grid-cols-1 gap-5 [@media(min-width:700px)]:grid-cols-2 [@media(min-width:1000px)]:grid-cols-3">
        {resources.map((r) => (
          <div
            key={r.title}
            className="flex flex-col p-5"
            style={{
              background: "rgba(10,10,18,0.7)",
              border: "1px solid rgba(176,38,255,0.2)",
              clipPath: CHAMFER,
            }}
          >
            <h3 className="text-[17px] font-bold" style={{ fontFamily: "var(--font-ui), sans-serif", color: "#fff" }}>
              {r.title}
            </h3>
            <p className="mt-2 flex-1 text-[13px] leading-6" style={{ color: "#a8a8c2" }}>
              {r.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {r.tags.map((t) => (
                <span key={t} className="px-2 py-1 text-[10px]" style={{ fontFamily: "var(--font-mono), monospace", color: "#9a9ab8", border: "1px solid rgba(34,211,238,0.2)" }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-3 text-[11px]" style={{ fontFamily: "var(--font-mono), monospace" }}>
              {r.repoUrl && (
                <a href={r.repoUrl} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ color: "#22d3ee" }}>
                  ‹ SRC ›
                </a>
              )}
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ color: "#ff2d9b" }}>
                  LIVE ▸
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
