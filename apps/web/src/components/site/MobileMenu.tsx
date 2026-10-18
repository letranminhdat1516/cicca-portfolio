"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { MONO } from "./ui";

export const MENU_ID = "site-menu";

export interface MenuLink {
  href: string;
  label: string;
  current?: boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen numbered menu for narrow screens ("01 Work →"). Always in the DOM
 * (hidden when closed) so the burger's aria-controls points at a real element.
 * While open: focus starts on the close button and is kept inside, Esc closes,
 * the page behind does not scroll, and widening past the breakpoint closes it.
 */
export function MobileMenu({ open, onClose, links }: { open: boolean; onClose: () => void; links: MenuLink[] }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const body = document.body;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.current.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 761px)");
    const onWide = (e: MediaQueryListEvent) => {
      if (e.matches) onClose();
    };

    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open, onClose]);

  return (
    <div id={MENU_ID} ref={panel} role="dialog" aria-modal="true" aria-label="Menu" className="mmenu" hidden={!open}>
      <div className="mmenu-top">
        <span style={{ ...MONO, fontSize: 12, letterSpacing: "0.1em", color: "#8C97B8" }}>MENU</span>
        <button ref={closeBtn} type="button" className="btn-reset nav-burger mmenu-close" aria-label="Close menu" onClick={onClose}>
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <nav aria-label="Menu">
        <ol className="mmenu-list">
          {links.map((l, i) => (
            <li key={l.href} style={{ ["--k" as string]: i }}>
              <Link href={l.href} className="mmenu-link" aria-current={l.current ? "page" : undefined} onClick={onClose}>
                <span className="i" style={MONO}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="t">{l.label}</span>
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
