import type { Profile, Social } from "@portfolio/types";
import { SectionHeader } from "./SectionHeader";

export function Contact({ profile, socials }: { profile: Profile; socials: Social[] }) {
  return (
    <section id="contact" className="mx-auto max-w-[820px] px-6 py-24 text-center">
      <SectionHeader index="05" label="PARTY UP" center />
      <h2
        className="mx-auto mt-2 font-bold"
        style={{
          fontFamily: "var(--font-title), sans-serif",
          fontSize: "clamp(28px,4.5vw,46px)",
          color: "#fff",
          textShadow: "0 0 24px rgba(34,211,238,0.35)",
        }}
      >
        READY FOR THE NEXT QUEST
      </h2>
      <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-7" style={{ color: "#a8a8c2" }}>
        Open to collaborations, freelance missions, and full-time raids. Send a signal.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`mailto:${profile.email}`}
          className="px-7 py-3 text-[12px] font-bold tracking-widest no-underline"
          style={{
            fontFamily: "var(--font-mono), monospace",
            color: "#08070f",
            background: "linear-gradient(135deg,#22d3ee,#b026ff)",
            clipPath: "polygon(0 0,100% 0,100% 70%,calc(100% - 12px) 100%,0 100%)",
          }}
        >
          {profile.email} ▸
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
    </section>
  );
}
