"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Icon } from "./icons";

const mono = { fontFamily: "var(--font-mono), monospace" } as const;
const ui = { fontFamily: "var(--font-ui), sans-serif" } as const;
const chamfer =
  "polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))";
const card = {
  background: "rgba(10,8,20,0.6)",
  border: "1px solid rgba(176,38,255,0.2)",
  clipPath: chamfer,
} as const;

type Pair = { key: string; count: number };
type Summary = {
  rangeDays: number;
  totals: {
    views: number;
    visitors: number;
    viewsPerVisitor: number;
    todayViews: number;
    todayVisitors: number;
  };
  series: { date: string; views: number; visitors: number }[];
  topPages: Pair[];
  topReferrers: Pair[];
  devices: Pair[];
};
type SeoCheck = { id: string; label: string; pass: boolean; detail: string };
type SeoHealth = {
  score: number;
  passed: number;
  total: number;
  gscConnected: boolean;
  checks: SeoCheck[];
};

export function AnalyticsDashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [seo, setSeo] = useState<SeoHealth | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([adminApi.analyticsSummary("30d"), adminApi.seoHealth()])
      .then(([s, h]) => {
        if (!alive) return;
        setSummary(s as Summary);
        setSeo(h as SeoHealth);
      })
      .catch(() => alive && setError("Could not load analytics"));
    return () => {
      alive = false;
    };
  }, []);

  if (error)
    return (
      <p className="text-[12px]" style={{ ...mono, color: "#ff2d9b" }}>
        {error}
      </p>
    );
  if (!summary || !seo)
    return (
      <p className="text-[12px]" style={{ ...mono, color: "#6b6b88" }}>
        Loading analytics…
      </p>
    );

  const t = summary.totals;
  return (
    <div className="mb-8 flex flex-col gap-4">
      {/* stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="eye" label="Pageviews (30d)" value={t.views} accent="#22d3ee" sub={`${t.todayViews} today`} />
        <StatCard icon="users" label="Unique visitors" value={t.visitors} accent="#b026ff" sub={`${t.todayVisitors} today`} />
        <StatCard icon="chart" label="Views / visitor" value={t.viewsPerVisitor} accent="#4ade80" sub="engagement" />
        <StatCard icon="gauge" label="SEO health" value={`${seo.score}%`} accent={scoreColor(seo.score)} sub={`${seo.passed}/${seo.total} checks`} />
      </div>

      {/* traffic trend */}
      <div className="p-5" style={card}>
        <SectionTitle icon="chart" title="Traffic — last 30 days" />
        <TrendChart series={summary.series} />
      </div>

      {/* top lists */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ListCard icon="file" title="Top pages" rows={summary.topPages} empty="No views yet" />
        <ListCard icon="globe" title="Referrers" rows={summary.topReferrers} empty="Direct / none" />
        <ListCard icon="device" title="Devices" rows={summary.devices} empty="No data" />
      </div>

      {/* SEO health + Search Console */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_0.9fr]">
        <div className="p-5" style={card}>
          <SectionTitle icon="shield" title="SEO / GEO health" />
          <div className="mb-4 flex items-center gap-4">
            <ScoreRing score={seo.score} />
            <div>
              <div className="text-[13px]" style={{ ...ui, color: "#e8e8f0" }}>
                {seo.passed} of {seo.total} on-page checks passing
              </div>
              <div className="text-[11px]" style={{ ...mono, color: "#6b6b88" }}>
                Computed live from your content — works before deploy.
              </div>
            </div>
          </div>
          <ul className="flex flex-col gap-1.5">
            {seo.checks.map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-[12px]" style={ui}>
                <span
                  className="grid h-4 w-4 shrink-0 place-items-center rounded-full"
                  style={{
                    background: c.pass ? "rgba(74,222,128,0.16)" : "rgba(255,45,155,0.14)",
                    color: c.pass ? "#4ade80" : "#ff2d9b",
                  }}
                >
                  {c.pass ? <Icon name="check" size={11} /> : "!"}
                </span>
                <span style={{ color: c.pass ? "#c9c9dd" : "#ffb4d4" }}>{c.label}</span>
                <span className="ml-auto text-[10px]" style={{ ...mono, color: "#6b6b88" }}>{c.detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5" style={card}>
          <SectionTitle icon="search" title="Google Search Console" />
          {seo.gscConnected ? (
            <p className="text-[12px]" style={{ ...ui, color: "#4ade80" }}>
              Verification code set. Impression, click & keyword data will populate
              once the site is deployed and verified in Search Console.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[12px]" style={{ ...mono, color: "#ffd23f" }}>
                <span className="h-2 w-2 rounded-full" style={{ background: "#ffd23f" }} />
                CONNECT AFTER DEPLOY
              </div>
              <p className="text-[12px] leading-relaxed" style={{ ...ui, color: "#9a9ab8" }}>
                Search ranking, impressions, clicks and the actual keywords people
                search are only available for a deployed, verified domain. When you
                deploy, add your Search Console verification code in the{" "}
                <span style={{ color: "#22d3ee" }}>SEO</span> tab and this panel
                will light up.
              </p>
              <div className="grid grid-cols-3 gap-2 opacity-50">
                {["Impressions", "Clicks", "Avg position"].map((m) => (
                  <div key={m} className="px-2 py-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(176,38,255,0.25)" }}>
                    <div className="text-[16px] font-bold" style={{ ...mono, color: "#6b6b88" }}>—</div>
                    <div className="text-[9px] tracking-wider" style={{ ...mono, color: "#6b6b88" }}>{m.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function scoreColor(s: number) {
  return s >= 80 ? "#4ade80" : s >= 50 ? "#ffd23f" : "#ff2d9b";
}

function StatCard({ icon, label, value, accent, sub }: { icon: string; label: string; value: number | string; accent: string; sub: string }) {
  return (
    <div className="p-4" style={card}>
      <div className="flex items-center gap-2">
        <Icon name={icon} size={16} style={{ color: accent }} />
        <span className="text-[10px] tracking-wider" style={{ ...mono, color: "#9a9ab8" }}>{label.toUpperCase()}</span>
      </div>
      <div className="mt-2 text-[26px] font-bold leading-none" style={{ ...ui, color: "#fff" }}>{value}</div>
      <div className="mt-1 text-[10px]" style={{ ...mono, color: "#6b6b88" }}>{sub}</div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <Icon name={icon} size={15} style={{ color: "#22d3ee" }} />
      <h3 className="text-[13px] font-semibold tracking-wide" style={{ ...ui, color: "#e8e8f0" }}>{title}</h3>
    </div>
  );
}

function ListCard({ icon, title, rows, empty }: { icon: string; title: string; rows: Pair[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="p-5" style={card}>
      <SectionTitle icon={icon} title={title} />
      {rows.length === 0 ? (
        <p className="text-[11px]" style={{ ...mono, color: "#6b6b88" }}>{empty}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.key}>
              <div className="flex items-baseline justify-between text-[11px]">
                <span className="truncate pr-2" style={{ ...mono, color: "#c9c9dd" }}>{r.key}</span>
                <span style={{ ...mono, color: "#6b6b88" }}>{r.count}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${(r.count / max) * 100}%`, background: "linear-gradient(90deg,#22d3ee,#b026ff)" }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = scoreColor(score);
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="shrink-0">
      <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${dash} ${c}`} transform="rotate(-90 34 34)" />
      <text x="34" y="39" textAnchor="middle" fontSize="16" fontWeight="700" fill="#fff" fontFamily="var(--font-mono), monospace">{score}</text>
    </svg>
  );
}

function TrendChart({ series }: { series: { date: string; views: number; visitors: number }[] }) {
  const W = 720;
  const H = 160;
  const pad = 8;
  const max = Math.max(1, ...series.map((d) => d.views));
  const step = series.length > 1 ? (W - pad * 2) / (series.length - 1) : 0;
  const x = (i: number) => pad + i * step;
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const line = series.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.views).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1).toFixed(1)},${H - pad} L${x(0).toFixed(1)},${H - pad} Z`;
  const totalViews = series.reduce((s, d) => s + d.views, 0);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#trendFill)" />
        <path d={line} fill="none" stroke="#22d3ee" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between text-[9px]" style={{ ...mono, color: "#6b6b88" }}>
        <span>{series[0]?.date}</span>
        <span>{totalViews} views over {series.length} days</span>
        <span>{series[series.length - 1]?.date}</span>
      </div>
    </div>
  );
}
