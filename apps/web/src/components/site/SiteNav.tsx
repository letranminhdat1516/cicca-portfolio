"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCENT, BRAND } from "@/data/home";
import { MONO } from "./ui";

const LINKS = [
  { href: "/#work", label: "Work", match: "/projects" },
  { href: "/#desk", label: "Desk" },
  { href: "/#experience", label: "Experience" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/blog", label: "Blog", match: "/blog" },
];

/** Sticky glass nav shared by every public page. */
export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const logoH = 38;
  return (
    <header
      className="nav-glass"
      style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(3,6,26,0.72)", borderBottom: "1px solid rgba(111,168,255,0.15)" }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "18px 24px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px 32px",
        }}
      >
        <Link href="/" aria-label="Home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
          <Image
            src={BRAND.logo}
            alt="Cicca logo"
            width={Math.round((logoH * BRAND.logoWidth) / BRAND.logoHeight)}
            height={logoH}
            preload
            style={{ height: logoH, width: "auto", display: "block" }}
          />
          <span style={{ ...MONO, fontSize: 12, color: "#8C97B8" }}>{BRAND.kicker}</span>
        </Link>
        <nav
          aria-label="Main"
          className="nav-links"
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 26px", fontSize: 14, fontWeight: 500 }}
        >
          {LINKS.map((l) => {
            const current = l.match ? pathname.startsWith(l.match) : false;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={current ? "page" : undefined}
                style={{ textDecoration: "none", padding: "10px 0", ...(current ? { color: "#6FA8FF", fontWeight: 600 } : null) }}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            style={{
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: 999,
              background: ACCENT,
              color: "#FFFFFF",
              boxShadow: "0 0 24px rgba(47,123,255,0.6)",
            }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
