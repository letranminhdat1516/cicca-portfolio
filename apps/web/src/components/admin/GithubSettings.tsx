"use client";

import { useEffect, useState } from "react";
import { adminApi, fetchGithubSnapshot } from "@/lib/adminApi";
import { Icon } from "./icons";

const mono = { fontFamily: "var(--font-mono), monospace" } as const;
const ui = { fontFamily: "var(--font-ui), sans-serif" } as const;
const chamfer =
  "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))";
const card = {
  background: "rgba(10,8,20,0.6)",
  border: "1px solid rgba(176,38,255,0.25)",
  clipPath: chamfer,
} as const;
const btnPrimary = {
  background: "linear-gradient(135deg,#22d3ee,#b026ff)",
  color: "#08070f",
} as const;

type Snapshot = {
  username: string;
  publicRepos: number;
  totalStars: number;
  followers: number;
  memberSince: string | null;
  topLanguages: { name: string; repos: number; pct: number }[];
  fetchedAt: string;
} | null;

export function GithubSettings({ onFlash }: { onFlash: (m: string) => void }) {
  const [username, setUsername] = useState("");
  const [snapshot, setSnapshot] = useState<Snapshot>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .getSeo()
      .then((s) => setUsername((s as { githubUsername?: string })?.githubUsername ?? ""))
      .catch(() => {});
    fetchGithubSnapshot().then(setSnapshot).catch(() => {});
  }, []);

  async function saveUsername() {
    setSaving(true);
    try {
      await adminApi.updateSeo({ githubUsername: username.trim() });
      onFlash("GitHub username saved");
    } catch (e) {
      onFlash(`Error: ${e}`);
    } finally {
      setSaving(false);
    }
  }

  async function refresh() {
    setBusy(true);
    try {
      const s = (await adminApi.githubRefresh()) as Snapshot;
      setSnapshot(s);
      onFlash("Synced from GitHub — skill levels updated");
    } catch (e) {
      onFlash(`Refresh failed: ${e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 [@media(min-width:980px)]:grid-cols-2">
      {/* config */}
      <div className="p-5" style={card}>
        <h2 className="mb-1 flex items-center gap-2 text-[15px] font-semibold" style={{ ...ui, color: "#22d3ee" }}>
          <Icon name="github" size={16} /> GitHub Source
        </h2>
        <p className="mb-4 text-[12px] leading-relaxed" style={{ ...ui, color: "#9a9ab8" }}>
          Public, unauthenticated — cached 24h. Refreshing re-derives the level of any skill whose
          name matches a GitHub language (skills set to <span style={{ color: "#22d3ee" }}>source = self</span> are
          left untouched).
        </p>
        <label className="mb-1.5 block text-[10px] tracking-[2px]" style={{ ...mono, color: "#9a9ab8" }}>
          GITHUB USERNAME
        </label>
        <div className="flex gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your-handle"
            className="flex-1 rounded-md px-3 py-2 text-sm outline-none"
            style={{ background: "#0a0a12", border: "1px solid rgba(176,38,255,0.22)", color: "#e8e8f0" }}
          />
          <button onClick={saveUsername} disabled={saving} className="px-4 py-2 text-[12px] font-bold tracking-widest disabled:opacity-60" style={{ ...mono, border: "1px solid rgba(255,255,255,0.15)", color: "#9a9ab8" }}>
            {saving ? "…" : "SAVE"}
          </button>
        </div>
        <button
          onClick={refresh}
          disabled={busy || !username.trim()}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-[12px] font-bold tracking-widest disabled:opacity-60"
          style={{ ...mono, ...btnPrimary }}
        >
          <Icon name="refresh" size={14} /> {busy ? "SYNCING…" : "REFRESH FROM GITHUB"}
        </button>
      </div>

      {/* snapshot */}
      <div className="p-5" style={card}>
        <h2 className="mb-4 flex items-center gap-2 text-[15px] font-semibold" style={{ ...ui, color: "#22d3ee" }}>
          <Icon name="chart" size={16} /> Current Snapshot
        </h2>
        {!snapshot ? (
          <p className="text-[12px]" style={{ ...mono, color: "#6b6b88" }}>
            No snapshot yet — set a username and refresh.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "REPOS", v: snapshot.publicRepos },
                { l: "STARS", v: snapshot.totalStars },
                { l: "FOLLOWERS", v: snapshot.followers },
                { l: "SINCE", v: snapshot.memberSince ?? "—" },
              ].map((s) => (
                <div key={s.l} className="px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(176,38,255,0.15)" }}>
                  <div className="text-[20px] font-bold" style={{ ...ui, color: "#fff" }}>{s.v}</div>
                  <div className="text-[9px] tracking-widest" style={{ ...mono, color: "#6b6b88" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="mb-2 text-[10px] tracking-widest" style={{ ...mono, color: "#9a9ab8" }}>TOP LANGUAGES</div>
              <ul className="flex flex-col gap-1.5">
                {snapshot.topLanguages.slice(0, 6).map((l) => (
                  <li key={l.name} className="flex items-center justify-between text-[11px]" style={{ ...mono, color: "#c9c9dd" }}>
                    <span>{l.name}</span>
                    <span style={{ color: "#6b6b88" }}>{l.repos} repos · {l.pct}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-[9px]" style={{ ...mono, color: "#6b6b88" }}>
              Updated {snapshot.fetchedAt.slice(0, 16).replace("T", " ")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
