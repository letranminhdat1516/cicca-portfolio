"use client";
import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCENT, BRAND } from "@/data/home";
import { MONO } from "./ui";
import { MENU_ID, MobileMenu } from "./MobileMenu";

const LINKS: { href: string; label: string; match?: string }[] = [
  { href: "/#work", label: "Work", match: "/projects" },
  { href: "/#desk", label: "Desk" },
  { href: "/#experience", label: "Experience" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/blog", label: "Blog", match: "/blog" },
];
const CONTACT: { href: string; label: string; match?: string } = { href: "/#contact", label: "Contact" };

/** Sticky glass nav shared by every public page; ≤760px the links move into a full-screen menu. */
export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    // back to the button that opened it; it sits in the sticky bar, so no scroll jump
    burger.current?.focus({ preventScroll: true });
  }, []);
  const logoH = 38;
  const isCurrent = (match?: string) => (match ? pathname.startsWith(match) : false);

  return (
    <>
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
              const current = isCurrent(l.match);
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
              href={CONTACT.href}
              style={{
                textDecoration: "none",
                padding: "10px 20px",
                borderRadius: 999,
                background: ACCENT,
                color: "#FFFFFF",
                boxShadow: "0 0 24px rgba(47,123,255,0.6)",
              }}
            >
              {CONTACT.label}
            </Link>
          </nav>
          <button
            ref={burger}
            type="button"
            className="btn-reset nav-burger"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpen(true)}
          >
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>
      {/* outside the header: its backdrop-filter would trap a position:fixed child inside the bar */}
      <MobileMenu
        open={open}
        onClose={close}
        links={[...LINKS, CONTACT].map((l) => ({ href: l.href, label: l.label, current: isCurrent(l.match) }))}
      />
    </>
  );
}
