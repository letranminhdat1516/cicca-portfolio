import type { Metadata } from "next";
import Link from "next/link";
import { getPortfolio } from "@/lib/portfolio";
import { CV_PDF_PATH, pageMetadata, seoOf } from "@/lib/seo";
import { splitDescription } from "@/lib/llms";
import { JsonLd, cvJsonLd } from "@/components/seo/JsonLd";

// The CV as semantic HTML: search engines and LLMs read this far more
// reliably than the PDF, so it is the canonical, indexable copy of the CV.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  const seo = seoOf(data);
  const name = data.profile?.name ?? seo.siteName;
  const title = `CV — ${name}, ${data.profile?.classRole ?? "Developer"}`;
  const description = `${name}'s CV: AI-native software engineer building AI agents, MCP servers, LLM gateways and RAG systems. Experience, skills, education and awards.`;
  return pageMetadata({
    seo,
    path: "/cv",
    title,
    absoluteTitle: true,
    description,
    openGraph: { type: "profile" },
  });
}

const MONO = { fontFamily: "var(--font-jetbrains), ui-monospace, monospace" } as const;
const UI = { fontFamily: "var(--font-outfit), system-ui, sans-serif" } as const;

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mt-12 mb-4 flex items-center gap-3 text-[13px] font-bold tracking-[3px]"
      style={{ ...MONO, color: "#6FA8FF" }}
    >
      {children}
      <span className="h-px flex-1" style={{ background: "linear-gradient(90deg,rgba(111,168,255,0.6),transparent)" }} />
    </h2>
  );
}

export default async function CvPage() {
  const data = await getPortfolio();
  const { profile, experiences, missions, skillGroups, achievements, socials } = data;

  return (
    <main className="mx-auto max-w-[880px] px-6 pt-14 pb-24">
      <JsonLd data={cvJsonLd(data)} />

      <nav aria-label="Breadcrumb" className="text-[12px] tracking-widest" style={{ ...MONO, color: "#8C97B8" }}>
        <Link href="/" className="no-underline" style={{ color: "#6FA8FF" }}>
          HOME
        </Link>{" "}
        / CV
      </nav>

      <header className="mt-6">
        <h1
          className="m-0 font-extrabold leading-tight"
          style={{
            ...UI,
            fontSize: "clamp(36px,6vw,60px)",
            letterSpacing: "-0.035em",
            color: "#F2F5FF",
          }}
        >
          {profile.name}
        </h1>
        <p className="mt-2 text-[15px] font-bold tracking-[3px]" style={{ ...MONO, color: "#9CC2FF" }}>
          {profile.classRole.toUpperCase()}
        </p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px]" style={{ color: "#8C97B8" }}>
          <span>Ho Chi Minh City, Vietnam</span>
          <a href={`mailto:${profile.email}`} style={{ color: "#6FA8FF" }}>
            {profile.email}
          </a>
          {socials
            .filter((s) => s.href.startsWith("http"))
            .map((s) => (
              <a key={s.href} href={s.href} rel="me noopener" target="_blank" style={{ color: "#6FA8FF" }}>
                {s.name}
              </a>
            ))}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={CV_PDF_PATH}
            target="_blank"
            rel="noopener"
            className="rounded-full px-6 py-3 text-[15px] font-medium no-underline"
            style={{ color: "#FFFFFF", background: "#2F6BFF", boxShadow: "0 8px 24px -8px rgba(47,123,255,0.7)" }}
          >
            Download PDF
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="rounded-full px-6 py-3 text-[15px] font-medium no-underline"
            style={{ color: "#E8EEFF", border: "1px solid rgba(111,168,255,0.45)", background: "rgba(10,16,52,0.5)" }}
          >
            Contact me
          </a>
        </div>
      </header>

      <section aria-labelledby="summary">
        <Heading>
          <span id="summary">SUMMARY</span>
        </Heading>
        <p className="text-[15px] leading-7" style={{ color: "#C9D4F2" }}>
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
                  <h3 className="m-0 text-[18px] font-bold" style={{ ...UI, color: "#F2F5FF" }}>
                    {e.title}
                  </h3>
                  <span className="text-[12px] tracking-widest" style={{ ...MONO, color: "#8C97B8" }}>
                    {e.period}
                  </span>
                </div>
                <p className="mt-1 text-[12px] tracking-wide" style={{ ...MONO, color: "#9CC2FF" }}>
                  {e.org}
                </p>
                {lead && (
                  <p className="mt-2 text-[13.5px] leading-6" style={{ color: "#8C97B8" }}>
                    {lead}
                  </p>
                )}
                {bullets.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1.5 pl-5" style={{ listStyle: "disc", color: "#C9D4F2" }}>
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
              <h3 className="m-0 text-[16px] font-bold" style={{ ...UI, color: "#F2F5FF" }}>
                {m.title}{" "}
                <span className="text-[11px] tracking-widest" style={{ ...MONO, color: "#6FA8FF" }}>
                  · {m.impact}
                </span>
              </h3>
              <p className="mt-1 text-[13.5px] leading-6" style={{ color: "#A9B4D0" }}>
                {m.objective}
              </p>
              <p className="mt-1 text-[12px]" style={{ ...MONO, color: "#8C97B8" }}>
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
              <dt className="text-[12px] font-bold tracking-widest" style={{ ...MONO, color: "#9CC2FF" }}>
                {g.name.split("//")[0].trim()}
              </dt>
              <dd className="m-0 text-[14px] leading-6" style={{ color: "#C9D4F2" }}>
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
              <span className="text-[15px] font-bold" style={{ ...UI, color: "#F2F5FF" }}>
                {a.title}
              </span>{" "}
              <span className="text-[11px] tracking-widest" style={{ ...MONO, color: "#9CC2FF" }}>
                {a.year}
              </span>
              <p className="mt-0.5 text-[13.5px] leading-6" style={{ color: "#A9B4D0" }}>
                {a.description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
