import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolio } from "@/lib/portfolio";
import { CV_PDF_PATH, ogImage, seoOf } from "@/lib/seo";
import { splitDescription } from "@/lib/llms";
import { JsonLd, cvJsonLd } from "@/components/seo/JsonLd";

// The résumé as semantic HTML: search engines and LLMs read this far more
// reliably than the PDF, so it is the canonical, indexable copy of the CV.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  const seo = seoOf(data);
  const name = data.profile?.name ?? seo.siteName;
  const title = `Résumé — ${name}, ${data.profile?.classRole ?? "Developer"}`;
  const description = `${name}'s CV: LLM gateway, RAG agents, VAS accounting ERP, computer vision and k3s platform work. Experience, skills, education and awards.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/cv" },
    openGraph: {
      type: "profile",
      url: "/cv",
      title,
      description,
      images: [{ url: ogImage(seo), width: 1200, height: 630, alt: name }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const MONO = { fontFamily: "var(--font-mono), monospace" } as const;
const UI = { fontFamily: "var(--font-ui), sans-serif" } as const;

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-12 mb-4 flex items-center gap-3 text-[13px] font-bold tracking-[3px]"
      style={{ ...MONO, color: "#22d3ee" }}
    >
      {children}
      <span className="h-px flex-1" style={{ background: "rgba(34,211,238,0.2)" }} />
    </h2>
  );
}

export default async function CvPage() {
  const data = await getPortfolio();
  const { profile, experiences, missions, skillGroups, achievements, socials } = data;

  return (
    <main className="mx-auto max-w-[880px] px-6 pt-32 pb-24">
      <JsonLd data={cvJsonLd(data)} />

      <nav aria-label="Breadcrumb" className="text-[12px] tracking-widest" style={{ ...MONO, color: "#6b6b88" }}>
        <Link href="/" className="no-underline" style={{ color: "#22d3ee" }}>
          HOME
        </Link>{" "}
        / RÉSUMÉ
      </nav>

      <header className="mt-6">
        <h1
          className="m-0 font-black leading-tight"
          style={{
            fontFamily: "var(--font-title), sans-serif",
            fontSize: "clamp(32px,6vw,54px)",
            color: "#fff",
            textShadow: "0 0 24px rgba(176,38,255,0.4)",
          }}
        >
          {profile.name}
        </h1>
        <p className="mt-2 text-[15px] font-bold tracking-[3px]" style={{ ...MONO, color: "#ffd23f" }}>
          {profile.classRole.toUpperCase()}
        </p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]" style={{ color: "#9a9ab8" }}>
          <span>Ho Chi Minh City, Vietnam</span>
          <a href={`mailto:${profile.email}`} style={{ color: "#22d3ee" }}>
            {profile.email}
          </a>
          {socials
            .filter((s) => s.href.startsWith("http"))
            .map((s) => (
              <a key={s.href} href={s.href} rel="me noopener" target="_blank" style={{ color: "#22d3ee" }}>
                {s.name}
              </a>
            ))}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={CV_PDF_PATH}
            target="_blank"
            rel="noopener"
            className="px-6 py-3 text-[12px] font-bold tracking-widest no-underline"
            style={{
              ...MONO,
              color: "#08070f",
              background: "linear-gradient(135deg,#22d3ee,#b026ff)",
              clipPath: "polygon(0 0,100% 0,100% 70%,calc(100% - 12px) 100%,0 100%)",
            }}
          >
            DOWNLOAD PDF ▾
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="px-6 py-3 text-[12px] font-bold tracking-widest no-underline"
            style={{ ...MONO, color: "#e8e8f0", border: "1px solid rgba(34,211,238,0.4)" }}
          >
            CONTACT ME
          </a>
        </div>
      </header>

      <section aria-labelledby="summary">
        <Heading>
          <span id="summary">SUMMARY</span>
        </Heading>
        <p className="text-[15px] leading-7" style={{ color: "#c4c4d8" }}>
          {profile.bio}
        </p>
      </section>

      <section aria-labelledby="experience">
        <Heading>
          <span id="experience">EXPERIENCE</span>
        </Heading>
        <div className="flex flex-col gap-8">
          {experiences.map((e) => {
            const { lead, bullets } = splitDescription(e.description);
            return (
              <article key={`${e.org}-${e.title}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="m-0 text-[18px] font-bold" style={{ ...UI, color: "#fff" }}>
                    {e.title}
                  </h3>
                  <span className="text-[12px] tracking-widest" style={{ ...MONO, color: "#9a9ab8" }}>
                    {e.period}
                  </span>
                </div>
                <p className="mt-1 text-[12px] tracking-wide" style={{ ...MONO, color: "#b026ff" }}>
                  {e.org}
                </p>
                {lead && (
                  <p className="mt-2 text-[13.5px] leading-6" style={{ color: "#9a9ab8" }}>
                    {lead}
                  </p>
                )}
                {bullets.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1.5 pl-5" style={{ listStyle: "disc", color: "#c4c4d8" }}>
                    {bullets.map((b) => (
                      <li key={b} className="text-[14px] leading-6">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="projects">
        <Heading>
          <span id="projects">SELECTED PROJECTS</span>
        </Heading>
        <ul className="flex flex-col gap-4 p-0" style={{ listStyle: "none" }}>
          {missions.map((m) => (
            <li key={m.slug}>
              <h3 className="m-0 text-[16px] font-bold" style={{ ...UI, color: "#fff" }}>
                {m.title}{" "}
                <span className="text-[11px] tracking-widest" style={{ ...MONO, color: m.statusColor }}>
                  · {m.impact}
                </span>
              </h3>
              <p className="mt-1 text-[13.5px] leading-6" style={{ color: "#a8a8c2" }}>
                {m.objective}
              </p>
              <p className="mt-1 text-[12px]" style={{ ...MONO, color: "#6b6b88" }}>
                {m.loadout.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="skills">
        <Heading>
          <span id="skills">SKILLS</span>
        </Heading>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 [@media(min-width:700px)]:grid-cols-[200px_1fr]">
          {skillGroups.map((g) => (
            <div key={g.name} className="contents">
              <dt className="text-[12px] font-bold tracking-widest" style={{ ...MONO, color: "#ffd23f" }}>
                {g.name.split("//")[0].trim()}
              </dt>
              <dd className="m-0 text-[14px] leading-6" style={{ color: "#c4c4d8" }}>
                {g.items.map((i) => i.n).join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="education">
        <Heading>
          <span id="education">EDUCATION & AWARDS</span>
        </Heading>
        <ul className="flex flex-col gap-3 p-0" style={{ listStyle: "none" }}>
          {achievements.map((a) => (
            <li key={a.title}>
              <span className="text-[15px] font-bold" style={{ ...UI, color: "#fff" }}>
                {a.title}
              </span>{" "}
              <span className="text-[11px] tracking-widest" style={{ ...MONO, color: a.color }}>
                {a.year}
              </span>
              <p className="mt-0.5 text-[13.5px] leading-6" style={{ color: "#a8a8c2" }}>
                {a.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
