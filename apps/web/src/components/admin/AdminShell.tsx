"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, clearToken } from "@/lib/adminApi";
import { ENTITIES } from "@/lib/adminSchema";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▦" },
  { href: "/admin/profile", label: "Profile", icon: "👤" },
  ...ENTITIES.map((e) => ({ href: `/admin/${e.model}`, label: e.label, icon: e.icon })),
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin) return;
    if (!getToken()) router.replace("/admin/login");
    else setReady(true);
  }, [isLogin, router, pathname]);

  if (isLogin) return <>{children}</>;
  if (!ready) return null;

  return (
    <div className="flex min-h-screen bg-[#0a0a12] text-[#e8e8f0]">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-[#08070f] p-4 md:flex">
        <Link href="/admin" className="mb-6 block font-mono text-sm tracking-widest text-[#22d3ee] no-underline">
          PLAYER_01<span className="text-[#b026ff]">.sys</span>
          <div className="text-[10px] text-[#6b6b88]">CONTROL PANEL</div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm no-underline transition-colors"
                style={{
                  background: active ? "rgba(34,211,238,0.12)" : "transparent",
                  color: active ? "#22d3ee" : "#9a9ab8",
                }}
              >
                <span className="w-5 text-center">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
          <Link href="/" target="_blank" className="px-3 text-xs text-[#9a9ab8] no-underline hover:text-[#22d3ee]">
            ↗ View site
          </Link>
          <button
            onClick={() => {
              clearToken();
              router.replace("/admin/login");
            }}
            className="rounded-md border border-[#ff2d9b]/40 px-3 py-2 text-xs font-semibold text-[#ff2d9b]"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* mobile top bar */}
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 p-3 md:hidden">
          <span className="font-mono text-sm text-[#22d3ee]">CONTROL PANEL</span>
          <button
            onClick={() => {
              clearToken();
              router.replace("/admin/login");
            }}
            className="text-xs font-semibold text-[#ff2d9b]"
          >
            Log out
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b border-white/10 p-2 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="shrink-0 rounded px-3 py-1 text-xs no-underline"
              style={{ color: pathname === n.href ? "#22d3ee" : "#9a9ab8" }}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <main className="mx-auto w-full max-w-4xl flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
