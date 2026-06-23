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
      <h1 className="mb-1 text-[26px] font-semibold" style={{ color: "#23211c" }}>Dashboard</h1>
      <p className="mb-6 text-sm" style={{ color: "#9b9890" }}>Manage every section of your portfolio.</p>

      <Link
        href="/admin/profile"
        className="mb-4 flex items-center justify-between rounded-2xl p-5 no-underline transition-colors"
        style={{ background: "rgba(217,119,87,0.07)", border: "1px solid rgba(217,119,87,0.25)" }}
      >
        <div>
          <div className="text-[17px] font-semibold" style={{ color: "#23211c" }}>👤 Profile &amp; Hero</div>
          <div className="text-sm" style={{ color: "#80776e" }}>Name, tagline, roles, XP, social links live here.</div>
        </div>
        <span className="text-sm font-medium" style={{ color: "#c2613f" }}>Edit →</span>
      </Link>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ENTITIES.map((e) => (
          <Link
            key={e.model}
            href={`/admin/${e.model}`}
            className="rounded-2xl p-4 no-underline transition-all hover:-translate-y-0.5"
            style={{ background: "#ffffff", border: "1px solid #ece9e1", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="text-2xl">{e.icon}</div>
            <div className="mt-2 font-semibold" style={{ color: "#23211c" }}>{e.label}</div>
            <div className="text-sm" style={{ color: "#9b9890" }}>{counts[e.model] ?? "…"} item(s)</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
