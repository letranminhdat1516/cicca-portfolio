"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Privacy-friendly pageview tracker: one anonymous, cookieless beacon per route.
 * Honours Do-Not-Track and Global Privacy Control; never records admin routes.
 */
export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    // Respect user privacy signals.
    const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;

    const body = JSON.stringify({
      path: pathname,
      referrer: document.referrer || undefined,
    });

    // keepalive lets the request survive a navigation away from the page.
    fetch(`${API}/analytics/collect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      // No credentials needed — endpoint is anonymous.
    }).catch(() => {
      /* analytics must never break the page */
    });
  }, [pathname]);

  return null;
}
