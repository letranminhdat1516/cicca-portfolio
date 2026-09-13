import type { Experience } from "@portfolio/types";
import { SectionHeader } from "./SectionHeader";
import { splitDescription } from "@/lib/llms";

const CHAMFER =
  "polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))";

export function Experiences({ experiences = [] }: { experiences?: Experience[] }) {
  if (experiences.length === 0) return null;
  return (
    <section id="experiences" className="mx-auto max-w-[1180px] px-6 py-20">
      <SectionHeader index="06" label="CAMPAIGN HISTORY" title="EXPERIENCE" />
      <div className="flex flex-col gap-4">
        {experiences.map((e) => (
          <div
            key={`${e.org}-${e.title}`}
            className="grid grid-cols-1 gap-2 p-5 [@media(min-width:700px)]:grid-cols-[200px_1fr]"
            style={{
              background: "rgba(10,10,18,0.7)",
              border: "1px solid rgba(34,211,238,0.18)",
              clipPath: CHAMFER,
            }}
          >
            <div>
              <div className="text-[11px] tracking-widest" style={{ fontFamily: "var(--font-mono), monospace", color: "#22d3ee" }}>
                {e.period}
              </div>
              <div className="mt-1 text-[13px]" style={{ color: "#9a9ab8" }}>
                {e.org}
              </div>
            </div>
            <div>
              <h3 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-ui), sans-serif", color: "#fff" }}>
                {e.title}
              </h3>
              <ExperienceBody description={e.description} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceBody({ description }: { description: string }) {
  const { lead, bullets } = splitDescription(description);
  return (
    <>
      {lead && (
        <p className="mt-1 text-[13px] leading-6" style={{ color: "#9a9ab8" }}>
          {lead}
        </p>
      )}
      {bullets.length > 0 && (
        <ul className="mt-2 flex list-none flex-col gap-1.5 p-0">
          {bullets.map((b) => (
            <li key={b} className="relative pl-4 text-[13.5px] leading-6" style={{ color: "#a8a8c2" }}>
              <span className="absolute left-0" style={{ color: "#22d3ee" }}>▸</span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
