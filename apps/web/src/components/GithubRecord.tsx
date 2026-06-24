import type { GithubStats } from "@portfolio/types";
import { SectionHeader } from "./SectionHeader";

const CHAMFER =
  "polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))";
const mono = { fontFamily: "var(--font-mono), monospace" } as const;
const ui = { fontFamily: "var(--font-ui), sans-serif" } as const;

// Colours for the language bar — cycle through the neon palette.
const LANG_COLORS = ["#22d3ee", "#b026ff", "#ff2d9b", "#ffd23f", "#4ade80", "#f97316"];

export function GithubRecord({ github }: { github: GithubStats | null }) {
  if (!github) return null;

  const stats: { label: string; value: string | number }[] = [
    { label: "PUBLIC REPOS", value: github.publicRepos },
    { label: "TOTAL STARS", value: github.totalStars },
    { label: "FOLLOWERS", value: github.followers },
    { label: "MEMBER SINCE", value: github.memberSince ?? "—" },
  ];

  const langs = github.topLanguages.slice(0, 6);
  const profileUrl = `https://github.com/${github.username}`;

  return (
    <section id="github" className="mx-auto max-w-[1180px] px-6 py-20">
      <SectionHeader index="04" label="OPEN SOURCE" title="GITHUB // FIELD RECORD" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] no-underline"
          style={{ ...mono, color: "#22d3ee" }}
        >
          @{github.username} ↗
        </a>
        <span className="text-[10px] tracking-widest" style={{ ...mono, color: "#6b6b88" }}>
          LIVE FROM GITHUB · UPDATED {github.fetchedAt.slice(0, 10)}
        </span>
      </div>

      {/* stat tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5"
            style={{ background: "rgba(10,10,18,0.7)", border: "1px solid rgba(176,38,255,0.2)", clipPath: CHAMFER }}
          >
            <div className="text-[28px] font-bold leading-none" style={{ ...ui, color: "#fff" }}>{s.value}</div>
            <div className="mt-2 text-[10px] tracking-widest" style={{ ...mono, color: "#9a9ab8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* language bar */}
      {langs.length > 0 && (
        <div className="mt-8">
          <div className="mb-3 text-[12px] tracking-[2px]" style={{ ...mono, color: "#22d3ee" }}>
            LANGUAGES BY REPOSITORY
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            {langs.map((l, i) => (
              <div
                key={l.name}
                title={`${l.name} — ${l.repos} repo(s)`}
                style={{ width: `${l.pct}%`, background: LANG_COLORS[i % LANG_COLORS.length] }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            {langs.map((l, i) => (
              <span key={l.name} className="flex items-center gap-2 text-[11px]" style={{ ...mono, color: "#a8a8c2" }}>
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: LANG_COLORS[i % LANG_COLORS.length] }} />
                {l.name} <span style={{ color: "#6b6b88" }}>{l.pct}%</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* top repos */}
      {github.topRepos.length > 0 && (
        <div className="mt-10">
          <div className="mb-3 text-[12px] tracking-[2px]" style={{ ...mono, color: "#22d3ee" }}>
            TOP REPOSITORIES
          </div>
          <div className="grid grid-cols-1 gap-5 [@media(min-width:700px)]:grid-cols-2 [@media(min-width:1000px)]:grid-cols-3">
            {github.topRepos.map((r) => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col p-5 no-underline transition-transform hover:-translate-y-1"
                style={{ background: "rgba(10,10,18,0.7)", border: "1px solid rgba(176,38,255,0.2)", clipPath: CHAMFER }}
              >
                <h3 className="truncate text-[15px] font-bold" style={{ ...ui, color: "#fff" }}>{r.name}</h3>
                <p className="mt-2 flex-1 text-[12px] leading-6" style={{ color: "#a8a8c2" }}>
                  {r.description ?? "No description."}
                </p>
                <div className="mt-4 flex items-center gap-4 text-[11px]" style={{ ...mono, color: "#9a9ab8" }}>
                  {r.language && <span style={{ color: "#22d3ee" }}>{r.language}</span>}
                  <span>★ {r.stars}</span>
                  <span>⑂ {r.forks}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
