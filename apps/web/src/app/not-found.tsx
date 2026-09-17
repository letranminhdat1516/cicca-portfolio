import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "404 — Page not found", robots: { index: false, follow: true } };

const LINKS = [
  { href: "/", label: "HOME — PORTFOLIO" },
  { href: "/cv", label: "RÉSUMÉ" },
  { href: "/blog", label: "BLOG" },
];

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[640px] flex-col items-center justify-center px-6 text-center">
      <p className="text-[12px] tracking-[4px]" style={{ fontFamily: "var(--font-mono), monospace", color: "#bf4dff" }}>
        [ERR_404] MAP TILE NOT FOUND
      </p>
      <h1
        className="mt-3 font-black"
        style={{ fontFamily: "var(--font-title), sans-serif", fontSize: "clamp(32px,6vw,56px)", color: "#fff" }}
      >
        Page not found
      </h1>
      <p className="mt-4 text-[15px] leading-7" style={{ color: "#a8a8c2" }}>
        This page does not exist or has moved. Try one of these instead:
      </p>
      <nav aria-label="Site" className="mt-8 flex flex-wrap justify-center gap-4">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="px-5 py-3 text-[12px] font-bold tracking-widest no-underline"
            style={{ fontFamily: "var(--font-mono), monospace", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.35)" }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
