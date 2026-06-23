"use client";
import { useEffect, useState } from "react";
import { navItems } from "@/data/profile";

export function HudNav() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className="h-[3px]"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg,#22d3ee,#b026ff,#ff2d9b)",
          transition: "width 0.1s linear",
        }}
      />
      <nav
        className="flex items-center justify-between px-6 py-3"
        style={{
          background: "rgba(8,7,15,0.72)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(176,38,255,0.18)",
        }}
      >
        <a href="#top" className="flex items-center gap-2 no-underline">
          <span
            className="grid place-items-center text-[12px] font-bold"
            style={{
              width: 26,
              height: 26,
              color: "#22d3ee",
              border: "1px solid rgba(34,211,238,0.5)",
              clipPath: "polygon(0 0,100% 0,100% 70%,calc(100% - 8px) 100%,0 100%)",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            P1
          </span>
          <span
            style={{ fontFamily: "var(--font-mono), monospace" }}
            className="text-[13px] tracking-widest text-[#e8e8f0]"
          >
            PLAYER_01<span style={{ color: "#b026ff" }}>.sys</span>
          </span>
        </a>
        <ul className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`/#${item.id}`}
                className="group relative text-[12px] tracking-widest text-[#9a9ab8] no-underline transition-colors hover:text-[#22d3ee]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {item.en}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#22d3ee] transition-all group-hover:w-full" />
              </a>
            </li>
          ))}
          <li>
            <a
              href="/blog"
              className="group relative text-[12px] tracking-widest text-[#9a9ab8] no-underline transition-colors hover:text-[#22d3ee]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              BLOG
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#22d3ee] transition-all group-hover:w-full" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
