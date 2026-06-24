"use client";
import type { Profile, Social } from "@portfolio/types";
import { useTypewriter } from "@/hooks/useTypewriter";

const HEX = "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)";

export function Hero({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const role = useTypewriter(profile.roles);

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

        <div className="mt-8 flex flex-wrap items-center gap-3">
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
          className="grid place-items-center overflow-hidden text-[44px]"
          style={{
            width: 256,
            height: 286,
            color: "#22d3ee",
            background: "linear-gradient(160deg,rgba(34,211,238,0.12),rgba(176,38,255,0.12))",
            border: "1px solid rgba(34,211,238,0.4)",
            clipPath: HEX,
            animation: "floatY 6s ease-in-out infinite",
          }}
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-full w-full object-contain p-2"
              // Logo art is dark (black text + crimson dragon). invert() flips the black
              // text to white so it reads on the dark hexagon; hue-rotate(180deg) swings
              // the inverted (cyan) dragon back to its original red. White text has no
              // saturation, so the hue shift leaves it white.
              style={{ filter: "invert(1) hue-rotate(182deg) saturate(3.4) brightness(0.82) drop-shadow(0 0 8px rgba(160,15,30,0.6))" }}
            />
          ) : (
            "⬡"
          )}
        </div>
        <div className="text-center">
          <div
            className="text-[11px] tracking-[2px]"
            style={{ fontFamily: "var(--font-mono), monospace", color: "#6b6b88" }}
          >
            [REGION: {profile.region}]
          </div>
        </div>
      </div>
    </section>
  );
}
