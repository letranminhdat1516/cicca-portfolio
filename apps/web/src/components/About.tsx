import type { Profile, Stat, Counter } from "@portfolio/types";
import { SectionHeader } from "./SectionHeader";
import { RadarChart } from "./RadarChart";
import { Counters } from "./Counters";

const CHAMFER =
  "polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))";

export function About({
  profile,
  stats,
  counters,
}: {
  profile: Profile;
  stats: Stat[];
  counters: Counter[];
}) {
  return (
    <section id="about" className="mx-auto max-w-[1180px] px-6 py-20">
      <SectionHeader index="01" label="PROFILE" title="CHARACTER DOSSIER" />
      <div className="grid grid-cols-1 items-center gap-10 [@media(min-width:900px)]:grid-cols-[1.1fr_0.9fr]">
        <div
          className="p-5"
          style={{
            background: "rgba(10,10,18,0.7)",
            border: "1px solid rgba(34,211,238,0.2)",
            clipPath: CHAMFER,
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff2d9b" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ffd23f" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#4ade80" }} />
            <span className="ml-2 text-[11px]" style={{ color: "#6b6b88" }}>
              ~/profile/bio.log
            </span>
          </div>
          <div className="text-[13px] leading-6" style={{ color: "#22d3ee" }}>
            $ init profile --verbose
          </div>
          <p className="mt-2 text-[13.5px] leading-7" style={{ color: "#a8a8c2" }}>
            {profile.bio}
          </p>
          <div className="mt-3 text-[13px]" style={{ color: "#4ade80" }}>
            status: READY_TO_DEPLOY ▸
          </div>
        </div>
        <div>
          <RadarChart stats={stats} />
        </div>
      </div>
      <Counters counters={counters} />
    </section>
  );
}
