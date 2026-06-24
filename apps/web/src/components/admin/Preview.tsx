"use client";
import { RARITY } from "@/lib/adminSchema";

const card = {
  background: "linear-gradient(135deg,rgba(22,16,40,0.6),rgba(10,8,20,0.5))",
  border: "1px solid rgba(176,38,255,0.25)",
  clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
} as const;
const mono = { fontFamily: "var(--font-mono), monospace" } as const;
const ui = { fontFamily: "var(--font-ui), sans-serif" } as const;

type V = Record<string, unknown>;
const s = (v: unknown) => String(v ?? "");

export function Preview({ kind, values }: { kind: string; values: V }) {
  return (
    <div className="sticky top-6">
      <div className="mb-2 flex items-center gap-2 text-[10px] tracking-[2px]" style={{ ...mono, color: "#9a9ab8" }}>
        <span className="h-2 w-2 rounded-full" style={{ background: "#4ade80", animation: "pulseGlow 1.6s infinite" }} />
        LIVE PREVIEW
      </div>
      <div className="p-5" style={card}>
        {kind === "profile" && <ProfilePrev v={values} />}
        {kind === "mission" && <MissionPrev v={values} />}
        {kind === "skill" && <SkillPrev v={values} />}
        {kind === "achievement" && <AchievementPrev v={values} />}
        {kind === "generic" && <GenericPrev v={values} />}
      </div>
    </div>
  );
}

function ProfilePrev({ v }: { v: V }) {
  const cur = Number(v.xpCurrent ?? 0);
  const max = Math.max(Number(v.xpMax ?? 1), 1);
  return (
    <div>
      <div className="text-[10px] tracking-[2px]" style={{ ...mono, color: "#22d3ee" }}>CLASS: [{s(v.classRole)}]</div>
      <div className="mt-2 font-black leading-tight" style={{ fontFamily: "var(--font-title), sans-serif", fontSize: 32, color: "#fff", textShadow: "0 0 18px rgba(176,38,255,0.45)" }}>
        {s(v.name) || "[YOUR NAME]"}
      </div>
      <p className="mt-2 text-[13px] leading-6" style={{ color: "#a8a8c2" }}>{s(v.tagline)}</p>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[10px]" style={{ ...mono, color: "#9a9ab8" }}>
          <span>XP</span><span>{cur.toLocaleString()} / {max.toLocaleString()}</span>
        </div>
        <div className="h-2 w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div className="h-full" style={{ width: `${Math.min((cur / max) * 100, 100)}%`, background: "linear-gradient(135deg,#22d3ee,#b026ff)" }} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="font-black" style={{ fontFamily: "var(--font-title), sans-serif", fontSize: 30, color: "#ffd23f" }}>{s(v.level)}</span>
        <span className="text-[11px] tracking-widest" style={{ ...mono, color: "#ffd23f" }}>RANK · {s(v.rank)}</span>
        <span className="text-[10px]" style={{ ...mono, color: "#6b6b88" }}>[{s(v.region)}]</span>
      </div>
    </div>
  );
}

function MissionPrev({ v }: { v: V }) {
  const loadout = (v.loadout as string[]) ?? [];
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] tracking-[2px]" style={{ ...mono, color: "#b026ff" }}>{s(v.code)}</span>
        <span className="flex items-center gap-1.5 text-[10px] tracking-widest" style={{ ...mono, color: s(v.statusColor) || "#4ade80" }}>
          <span className="h-2 w-2 rounded-full" style={{ background: s(v.statusColor) || "#4ade80" }} />{s(v.status)}
        </span>
      </div>
      <h3 className="mt-2 text-[20px] font-bold" style={{ ...ui, color: "#fff" }}>{s(v.title) || "Untitled"}</h3>
      <p className="mt-2 text-[13px] leading-6" style={{ color: "#a8a8c2" }}>{s(v.objective)}</p>
      <div className="mt-3 flex gap-6 text-[11px]" style={mono}>
        <span style={{ color: "#9a9ab8" }}>DIFF <span style={{ color: "#ffd23f" }}>{s(v.difficulty)}</span></span>
        <span style={{ color: "#9a9ab8" }}>IMPACT <span style={{ color: "#22d3ee" }}>{s(v.impact)}</span></span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {loadout.map((t, i) => <span key={i} className="px-2 py-1 text-[10px]" style={{ ...mono, color: "#9a9ab8", border: "1px solid rgba(34,211,238,0.2)" }}>{t}</span>)}
      </div>
    </div>
  );
}

function SkillPrev({ v }: { v: V }) {
  const color = RARITY[s(v.rarity)] ?? "#6b7280";
  return (
    <div>
      <div className="text-[11px] tracking-[2px]" style={{ ...mono, color: "#22d3ee" }}>{s(v.groupName)}</div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-[16px] font-bold" style={{ ...ui, color: "#fff" }}>{s(v.name) || "Skill"}</span>
        <span className="text-[9px] tracking-widest" style={{ ...mono, color }}>{s(v.rarity).toUpperCase()}</span>
      </div>
      <div className="mt-2 h-[6px] w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full" style={{ width: `${Math.min(Number(v.level ?? 0), 100)}%`, background: color, boxShadow: `0 0 8px ${color}` }} />
      </div>
      <p className="mt-2 text-[12px]" style={{ color: "#9a9ab8" }}>{s(v.tip)}</p>
    </div>
  );
}

function AchievementPrev({ v }: { v: V }) {
  const color = s(v.color) || "#22d3ee";
  return (
    <div className="relative pl-7">
      <span className="absolute left-0 top-1 h-[16px] w-[16px] rounded-full" style={{ border: `2px solid ${color}`, background: "#08070f", boxShadow: `0 0 12px ${s(v.glow) || color}` }} />
      <div className="flex items-baseline justify-between">
        <h3 className="text-[17px] font-bold" style={{ ...ui, color: "#fff" }}><span style={{ color }}>★ </span>{s(v.title) || "Achievement"}</h3>
        <span className="text-[11px] tracking-widest" style={{ ...mono, color: "#9a9ab8" }}>{s(v.year)}</span>
      </div>
      <p className="mt-1 text-[13px] leading-6" style={{ color: "#a8a8c2" }}>{s(v.description)}</p>
    </div>
  );
}

function GenericPrev({ v }: { v: V }) {
  const title = s(v.title) || s(v.name) || s(v.label) || "Item";
  const sub = s(v.org) || s(v.period) || s(v.suffix) || s(v.href) || s(v.groupName);
  const line = s(v.description) || s(v.tagline) || s(v.tip) || s(v.excerpt);
  const num = v.value != null && v.value !== "" ? Number(v.value) : null;
  const tags = (v.tags as string[]) ?? [];
  return (
    <div>
      <h3 className="text-[18px] font-bold" style={{ ...ui, color: "#fff" }}>{title}</h3>
      {sub && <div className="mt-1 text-[12px]" style={{ ...mono, color: "#22d3ee" }}>{sub}</div>}
      {num != null && (
        <div className="mt-3">
          <span className="font-black" style={{ fontFamily: "var(--font-title), sans-serif", fontSize: 30, color: s(v.color) || "#22d3ee" }}>{num.toLocaleString()}{s(v.suffix)}</span>
          {Number.isFinite(num) && num <= 100 && (
            <div className="mt-2 h-[6px] w-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full" style={{ width: `${Math.min(num, 100)}%`, background: s(v.color) || "linear-gradient(135deg,#22d3ee,#b026ff)" }} />
            </div>
          )}
        </div>
      )}
      {line && <p className="mt-2 text-[13px] leading-6" style={{ color: "#a8a8c2" }}>{line}</p>}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t, i) => <span key={i} className="px-2 py-1 text-[10px]" style={{ ...mono, color: "#9a9ab8", border: "1px solid rgba(34,211,238,0.2)" }}>{t}</span>)}
        </div>
      )}
    </div>
  );
}
