import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPortfolio } from "@/lib/portfolio";
import { SITE_URL, pageMetadata, seoOf } from "@/lib/seo";
import { JsonLd, PERSON_ID, breadcrumbJsonLd } from "@/components/seo/JsonLd";

// One indexable page per project case study: a long-tail landing page for
// search ("bank LLM gateway LiteLLM") and a precise URL for answer engines to
// cite. Projects without a written case study stay on the home page only.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…`);

async function load(slug: string) {
  const data = await getPortfolio();
  const mission = data.missions.find((m) => m.slug === slug);
  return mission ? { data, mission } : null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const found = await load(slug).catch(() => null);
  if (!found) return { title: "Not found", robots: { index: false, follow: false } };
  const { data, mission } = found;
  return pageMetadata({
    seo: seoOf(data),
    path: `/projects/${slug}`,
    title: `${mission.title} — Case Study`,
    description: clip(oneLine(mission.objective), 158),
    keywords: mission.loadout,
    noindex: !mission.content?.trim(),
    openGraph: { type: "article", authors: [SITE_URL], tags: mission.loadout },
  });
}

const MONO = { fontFamily: "var(--font-mono), monospace" } as const;

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const found = await load(slug);
  if (!found) notFound();
  const { data, mission: m } = found;
  const url = `${SITE_URL}/projects/${slug}`;

  return (
    <main className="mx-auto max-w-[760px] px-6 pt-32 pb-24">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${url}#article`,
            headline: m.title,
            description: oneLine(m.objective),
            keywords: m.loadout.join(", "),
            inLanguage: "en",
            url,
            mainEntityOfPage: url,
            image: `${SITE_URL}/opengraph-image`,
            dateModified: seoOf(data).updatedAt,
            author: { "@type": "Person", "@id": PERSON_ID, name: data.profile?.name, url: SITE_URL },
            publisher: { "@id": PERSON_ID },
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/#missions" },
            { name: m.title, path: `/projects/${slug}` },
          ]),
        ]}
      />
      <nav aria-label="Breadcrumb" className="text-[12px] tracking-widest" style={{ ...MONO, color: "#8686a4" }}>
        <Link href="/" className="no-underline" style={{ color: "#22d3ee" }}>
          HOME
        </Link>{" "}
        /{" "}
        <Link href="/#missions" className="no-underline" style={{ color: "#22d3ee" }}>
          PROJECTS
        </Link>{" "}
        / {m.code}
      </nav>
      <h1
        className="mt-4 font-bold"
        style={{
          fontFamily: "var(--font-title), sans-serif",
          fontSize: "clamp(28px,5vw,44px)",
          color: "#fff",
          textShadow: "0 0 20px rgba(176,38,255,0.35)",
        }}
      >
        {m.title}
      </h1>
      <p className="mt-2 text-[12px] tracking-widest" style={{ ...MONO, color: "#9a9ab8" }}>
        BY {data.profile?.name?.toUpperCase()} · STATUS <span style={{ color: m.statusColor }}>{m.status}</span> ·
        IMPACT <span style={{ color: "#22d3ee" }}>{m.impact}</span>
      </p>
      <p className="mt-6 text-[15px] leading-7" style={{ color: "#c8c8dc" }}>
        {m.objective}
      </p>
      <h2 className="mt-8 text-[13px] font-bold tracking-[3px]" style={{ ...MONO, color: "#22d3ee" }}>
        TECH STACK
      </h2>
      <ul className="mt-3 flex list-none flex-wrap gap-2 p-0">
        {m.loadout.map((t) => (
          <li key={t} className="px-2 py-1 text-[11px]" style={{ ...MONO, color: "#9a9ab8", border: "1px solid rgba(34,211,238,0.2)" }}>
            {t}
          </li>
        ))}
      </ul>
      {m.content?.trim() && (
        <article className="md mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
        </article>
      )}
      <p className="mt-12 text-[12px] tracking-widest" style={MONO}>
        <Link href="/#missions" className="no-underline" style={{ color: "#22d3ee" }}>
          ◂ ALL PROJECTS
        </Link>
        {"  ·  "}
        <Link href="/cv" className="no-underline" style={{ color: "#22d3ee" }}>
          RÉSUMÉ ▸
        </Link>
      </p>
    </main>
  );
}
