"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/adminApi";
import { ENTITIES } from "@/lib/adminSchema";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const entries = await Promise.all(
        ENTITIES.map(async (e) => {
          try {
            const rows = (await adminApi.list(e.model)) as unknown[];
            return [e.model, rows.length] as const;
          } catch {
            return [e.model, 0] as const;
          }
        }),
      );
      if (alive) setCounts(Object.fromEntries(entries));
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-white">▦ Dashboard</h1>
      <p className="mb-6 text-sm text-[#9a9ab8]">Manage every section of your portfolio.</p>

      <Link
        href="/admin/profile"
        className="mb-4 flex items-center justify-between rounded-xl border border-[#b026ff]/30 bg-[#08070f] p-5 no-underline transition-colors hover:border-[#22d3ee]/50"
      >
        <div>
          <div className="text-lg font-semibold text-white">👤 Profile & Hero</div>
          <div className="text-sm text-[#9a9ab8]">Name, tagline, roles, XP, socials links live here.</div>
        </div>
        <span className="text-[#22d3ee]">Edit →</span>
      </Link>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ENTITIES.map((e) => (
          <Link
            key={e.model}
            href={`/admin/${e.model}`}
            className="rounded-xl border border-white/10 bg-[#08070f] p-4 no-underline transition-colors hover:border-[#22d3ee]/50"
          >
            <div className="text-2xl">{e.icon}</div>
            <div className="mt-2 font-semibold text-white">{e.label}</div>
            <div className="text-sm text-[#9a9ab8]">
              {counts[e.model] ?? "…"} item(s)
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
