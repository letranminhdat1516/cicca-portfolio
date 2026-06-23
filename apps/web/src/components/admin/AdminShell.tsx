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

  const logout = () => {
    clearToken();
    router.replace("/admin/login");
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#faf9f5", color: "#23211c", fontFamily: "var(--font-body), Inter, system-ui, sans-serif" }}
    >
      <aside
        className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col p-5 md:flex"
        style={{ background: "#ffffff", borderRight: "1px solid #ece9e1" }}
      >
        <Link href="/admin" className="mb-8 flex items-center gap-2.5 no-underline">
          <span className="grid h-8 w-8 place-items-center rounded-lg text-sm font-bold text-white" style={{ background: "#d97757" }}>
            P1
          </span>
          <span>
            <span className="block text-[15px] font-semibold" style={{ color: "#23211c" }}>
              Portfolio CMS
            </span>
            <span className="block text-[11px]" style={{ color: "#9b9890" }}>
              Control panel
            </span>
          </span>
        </Link>
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] no-underline transition-colors"
                style={{
                  background: active ? "rgba(217,119,87,0.10)" : "transparent",
                  color: active ? "#c2613f" : "#56544d",
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span className="w-5 text-center text-[15px] opacity-90">{n.icon}</span>
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex flex-col gap-1 border-t pt-4" style={{ borderColor: "#ece9e1" }}>
          <Link href="/" target="_blank" className="rounded-lg px-3 py-2 text-[13px] no-underline transition-colors hover:bg-[#f3f1ea]" style={{ color: "#73726c" }}>
            ↗ View site
          </Link>
          <button onClick={logout} className="rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-[#f3f1ea]" style={{ color: "#b5503a" }}>
            Log out
          </button>
        </div>
      </aside>

      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3 md:hidden" style={{ borderColor: "#ece9e1", background: "#ffffff" }}>
          <span className="text-[15px] font-semibold" style={{ color: "#23211c" }}>Portfolio CMS</span>
          <button onClick={logout} className="text-[13px] font-medium" style={{ color: "#b5503a" }}>
            Log out
          </button>
        </div>
        <div className="flex gap-1 overflow-x-auto border-b px-3 py-2 md:hidden" style={{ borderColor: "#ece9e1", background: "#ffffff" }}>
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="shrink-0 rounded-lg px-3 py-1.5 text-[13px] no-underline"
              style={{
                color: pathname === n.href ? "#c2613f" : "#73726c",
                background: pathname === n.href ? "rgba(217,119,87,0.10)" : "transparent",
              }}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <main className="mx-auto w-full max-w-4xl flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
