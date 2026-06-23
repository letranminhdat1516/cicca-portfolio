"use client";
import { profile, socials } from "@/data/profile";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useCountUp } from "@/hooks/useCountUp";
import { XpBar } from "./XpBar";

const CHAMFER =
  "polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))";
const HEX = "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)";

export function Hero() {
  const role = useTypewriter(profile.roles);
  const { value: level, ref: levelRef } = useCountUp<HTMLDivElement>(profile.level, 2000);

  return (
    <section
      id="top"
      className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 pt-32 pb-20 [@media(min-width:900px)]:grid-cols-[1.2fr_0.8fr]"
    >
      <div>
        <div
          className="mb-4 flex items-center gap-2 text-[11px] tracking-[3px]"
          style={{ fontFamily: "var(--font-mono), monospace", color: "#9a9ab8" }}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: "#4ade80", animation: "pulseGlow 1.6s infinite" }}
          />
          STATUS: ONLINE // CHARACTER SHEET
        </div>

        <h1
          className="m-0 font-black leading-[1.02]"
          style={{
            fontFamily: "var(--font-title), sans-serif",
            fontSize: "clamp(38px,7vw,76px)",
            color: "#fff",
            textShadow: "0 0 24px rgba(176,38,255,0.45)",
          }}
        >
          {profile.name}
        </h1>

        <div
          className="mt-3"
          style={{
            fontFamily: "var(--font-ui), sans-serif",
            fontSize: "clamp(15px,2.4vw,22px)",
            color: "#22d3ee",
          }}
        >
          CLASS:{" "}
          <span style={{ color: "#fff" }}>[{role}</span>
          <span style={{ animation: "blink 1s step-end infinite", color: "#22d3ee" }}>|</span>
          <span style={{ color: "#fff" }}>]</span>
        </div>

        <p className="mt-5 max-w-[52ch] text-[15px] leading-7" style={{ color: "#a8a8c2" }}>
          {profile.tagline}
        </p>

        <div className="mt-7 max-w-[420px]">
          <XpBar current={profile.xpCurrent} max={profile.xpMax} />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href="#missions"
            className="px-6 py-3 text-[12px] font-bold tracking-widest no-underline"
            style={{
              fontFamily: "var(--font-mono), monospace",
              color: "#08070f",
              background: "linear-gradient(135deg,#22d3ee,#b026ff)",
              clipPath: "polygon(0 0,100% 0,100% 70%,calc(100% - 12px) 100%,0 100%)",
            }}
          >
            VIEW MISSIONS ▸
          </a>
          <a
            href="#contact"
            className="px-6 py-3 text-[12px] font-bold tracking-widest no-underline"
            style={{
              fontFamily: "var(--font-mono), monospace",
              color: "#e8e8f0",
              border: "1px solid rgba(34,211,238,0.4)",
            }}
          >
            PARTY UP
          </a>
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.name}
                title={s.name}
                className="grid h-9 w-9 place-items-center text-[11px] font-bold no-underline transition-colors hover:text-[#22d3ee]"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  color: "#9a9ab8",
                  border: "1px solid rgba(176,38,255,0.25)",
                  clipPath: "polygon(0 0,100% 0,100% 70%,calc(100% - 8px) 100%,0 100%)",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-5">
        <div
          className="grid place-items-center text-[44px]"
          style={{
            width: 180,
            height: 200,
            color: "#22d3ee",
            background: "linear-gradient(160deg,rgba(34,211,238,0.12),rgba(176,38,255,0.12))",
            border: "1px solid rgba(34,211,238,0.4)",
            clipPath: HEX,
            animation: "floatY 6s ease-in-out infinite",
          }}
        >
          ⬡
        </div>
        <div ref={levelRef} className="text-center">
          <div
            className="font-black"
            style={{
              fontFamily: "var(--font-title), sans-serif",
              fontSize: 54,
              color: "#ffd23f",
              textShadow: "0 0 18px rgba(255,210,63,0.5)",
            }}
          >
            {level}
          </div>
          <div
            className="text-[11px] tracking-[3px]"
            style={{ fontFamily: "var(--font-mono), monospace", color: "#ffd23f" }}
          >
            RANK · {profile.rank}
          </div>
          <div
            className="mt-1 text-[10px] tracking-[2px]"
            style={{ fontFamily: "var(--font-mono), monospace", color: "#6b6b88" }}
          >
            [REGION: {profile.region}]
          </div>
        </div>
      </div>
    </section>
  );
}
