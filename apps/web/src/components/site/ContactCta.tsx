import type { ReactNode } from "react";
import Image from "next/image";
import type { Profile, Social } from "@portfolio/types";
import { BRAND, CTA } from "@/data/home";
import { DocIcon, GithubIcon, LinkedinIcon, MailIcon } from "./ui";

type CtaLink = { href: string; label: string; icon: ReactNode; rel?: string };

/** Socials from the CMS → the CTA link row: GitHub / LinkedIn / Résumé / email. */
export function ctaLinks(profile: Pick<Profile, "email">, socials: Social[]): CtaLink[] {
  const out: CtaLink[] = [];
  for (const s of socials) {
    if (!/^https?:/.test(s.href)) continue;
    const key = `${s.name} ${s.href}`.toLowerCase();
    if (key.includes("github")) {
      out.push({ href: s.href, label: s.href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), icon: <GithubIcon />, rel: "me noopener" });
    } else if (key.includes("linkedin")) {
      out.push({ href: s.href, label: "LinkedIn", icon: <LinkedinIcon />, rel: "me noopener" });
    }
  }
  out.push({ href: "/cv", label: "Résumé", icon: <DocIcon /> });
  if (profile.email) out.push({ href: `mailto:${profile.email}`, label: profile.email, icon: <MailIcon /> });
  return out;
}

export function ContactCta({ profile, socials }: { profile: Profile; socials: Social[] }) {
  const logoH = 64;
  return (
    <section id="contact" className="cta">
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "72px 24px 56px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "18px 28px",
            borderRadius: 24,
            background: "#03061A",
            border: "1px solid rgba(160,200,255,0.55)",
            boxShadow: "0 0 0 6px rgba(255,255,255,0.08), 0 18px 50px -12px rgba(3,6,26,0.8), 0 0 40px rgba(111,168,255,0.45)",
          }}
        >
          <Image
            src={BRAND.logo}
            alt="Cicca logo"
            width={Math.round((logoH * BRAND.logoWidth) / BRAND.logoHeight)}
            height={logoH}
            style={{ height: logoH, width: "auto", display: "block" }}
          />
        </div>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "0.01em" }}>{CTA.title}</h2>
        <p style={{ margin: 0, maxWidth: 560, color: "#DCE4FF" }}>{CTA.body}</p>
        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            style={{ textDecoration: "none", background: "#FFFFFF", color: "#1C3FD6", padding: "12px 28px", borderRadius: 999, fontWeight: 600 }}
          >
            {CTA.button}
          </a>
        )}
        <div style={{ width: "100%", marginTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, fontSize: 14 }}>
          {ctaLinks(profile, socials).map((l) => (
            <a
              key={l.href}
              href={l.href}
              rel={l.rel}
              style={{ textDecoration: "none", color: "#FFFFFF", display: "flex", alignItems: "center", gap: 8, padding: "10px 0" }}
            >
              {l.icon}
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
