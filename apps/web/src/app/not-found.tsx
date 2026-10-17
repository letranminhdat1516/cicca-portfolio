import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/data/home";

export const metadata: Metadata = { title: "404 — Page not found", robots: { index: false, follow: true } };

const LINKS = [
  { href: "/", label: "Home", primary: true },
  { href: "/#work", label: "Selected work" },
  { href: "/cv", label: "Résumé" },
  { href: "/blog", label: "Blog" },
];

const MONO = { fontFamily: "var(--font-jetbrains), ui-monospace, monospace" } as const;

export default function NotFound() {
  return (
    <main
      className="site grid-bg"
      style={{
        minHeight: "100vh",
        background: "#03061A",
        color: "#E8EEFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        position: "relative",
      }}
    >
      <div className="glow-right" aria-hidden="true" style={{ position: "absolute", inset: 0 }} />
      <div style={{ position: "relative", maxWidth: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>
        <Link href="/" aria-label="Home">
          <Image src={BRAND.logo} alt="Cicca logo" width={78} height={48} style={{ height: 48, width: "auto", display: "block" }} />
        </Link>
        <span style={{ ...MONO, fontSize: 12, letterSpacing: "0.1em", color: "#6FA8FF" }}>$ curl -I this-page → 404</span>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(36px, 6vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.035em" }}>
          Page not{" "}
          <span
            style={{
              display: "inline-block",
              background: "#2F6BFF",
              padding: "0 14px 4px",
              borderRadius: "10px 20px 12px 22px",
              transform: "rotate(-2deg)",
              boxShadow: "0 0 30px rgba(47,123,255,0.6)",
            }}
          >
            found
          </span>
        </h1>
        <p style={{ margin: 0, fontSize: 17, color: "#A9B4D0" }}>This page does not exist or has moved. Try one of these instead:</p>
        <nav aria-label="Site" style={{ marginTop: 8, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 500,
                ...(l.primary
                  ? { background: "#2F6BFF", color: "#FFFFFF", boxShadow: "0 8px 24px -8px rgba(47,123,255,0.7)" }
                  : { border: "1px solid rgba(111,168,255,0.45)", background: "rgba(10,16,52,0.5)" }),
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
