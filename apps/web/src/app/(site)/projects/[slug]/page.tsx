import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPortfolio } from "@/lib/portfolio";
import { SITE_URL, pageMetadata, seoOf } from "@/lib/seo";
import { JsonLd, PERSON_ID, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ACCENT } from "@/data/home";
import { PROJECT_VISUALS, orderedWork, type ProjectImage } from "@/data/projectVisuals";
import { MONO, Highlight, Tag } from "@/components/site/ui";

// One indexable page per project case study: a long-tail landing page for
// search ("bank LLM gateway LiteLLM") and a precise URL for answer engines to
// cite. Projects without a written case study render but stay noindex.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
const clip = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n - 1).replace(/\s+\S*$/, "")}…`);
const titleCase = (s: string) => s.toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

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

const KICKER: CSSProperties = { ...MONO, fontSize: 12, letterSpacing: "0.08em" };
const LINK_ROW: CSSProperties = {
  textDecoration: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  minHeight: 44,
  padding: "0 18px",
  borderRadius: 999,
  fontWeight: 500,
};
const FRAME: CSSProperties = {
  position: "relative",
  aspectRatio: "16 / 10",
  borderRadius: 24,
  overflow: "hidden",
  border: "1px solid rgba(111,168,255,0.25)",
  background: "#03061A",
  boxShadow: "0 30px 60px -40px rgba(47,123,255,0.55)",
};

/** "Bank LLM Gateway" → "Bank LLM" + highlighted "Gateway"; one-word titles stay plain. */
function splitTitle(title: string): [string, string | null] {
  const t = title.trim();
  const i = t.lastIndexOf(" ");
  return i > 0 ? [t.slice(0, i), t.slice(i + 1)] : [t, null];
}

/** Screens after the cover as a vertical story: one large, then a pair, then one large, … */
function storyRows(images: ProjectImage[]): ProjectImage[][] {
  const rows: ProjectImage[][] = [];
  for (let i = 0; i < images.length; ) {
    const size = rows.length % 2 === 1 && i + 1 < images.length ? 2 : 1;
    rows.push(images.slice(i, i + size));
    i += size;
  }
  return rows;
}

function SectionHead({ n, id, title }: { n: string; id: string; title: string }) {
  return (
    <div className="blk-lbl">
      <span aria-hidden="true" style={{ ...MONO, fontSize: 14, color: "#6FA8FF" }}>
        {n}
      </span>
      <h2 id={id} style={{ margin: 0, fontWeight: 800, fontSize: "clamp(26px, 2.8vw, 34px)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
        {title}
      </h2>
    </div>
  );
}

function Shot({ img, no, sizes, preload, heading = true }: { img: ProjectImage; no: string; sizes: string; preload?: boolean; heading?: boolean }) {
  const Caption = heading ? "h3" : "span";
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
      <div style={FRAME}>
        <Image src={img.src} alt={img.alt} fill sizes={sizes} preload={preload} style={{ objectFit: "cover", objectPosition: "top" }} />
      </div>
      <figcaption style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
        <span aria-hidden="true" style={{ ...MONO, fontSize: 12, color: "#8C97B8" }}>
          {no}
        </span>
        <Caption style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#E8EEFF" }}>{img.caption}</Caption>
      </figcaption>
    </figure>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const found = await load(slug);
  if (!found) notFound();
  const { data, mission: m } = found;
  const url = `${SITE_URL}/projects/${slug}`;

  const visual = PROJECT_VISUALS[slug];
  const images = visual?.images ?? [];
  const [cover, ...screens] = images;
  const work = orderedWork(data.missions);
  const pos = work.findIndex((w) => w.mission.slug === slug);
  const next = work.length ? work[(pos + 1) % work.length] : undefined;
  const nextItem = next && next.mission.slug !== slug ? next : undefined;
  const counter = pos >= 0 ? `${work[pos].no} / ${String(work.length).padStart(2, "0")}` : null;

  const statusText = visual?.statusLabel
    ? titleCase(visual.statusLabel)
    : m.status === "ACTIVE"
      ? "In production"
      : "Delivered";
  const facts = [
    { k: "Client", v: visual?.client },
    { k: "Timeline", v: visual?.when },
    { k: "Role", v: visual?.role },
    { k: "Outcome", v: visual?.outcome ?? statusText },
  ].filter((f): f is { k: string; v: string } => Boolean(f.v));
  const specs = [
    { k: "Domain", v: visual?.domain },
    { k: "Impact", v: m.impact ? titleCase(m.impact) : undefined },
  ].filter((f): f is { k: string; v: string } => Boolean(f.v));

  const [lead, mark] = splitTitle(m.title);
  const sections = ["about", ...(screens.length ? ["screens"] : []), "stack"];
  const num = (id: string) => String(sections.indexOf(id) + 1).padStart(2, "0");
  const hasContent = Boolean(m.content?.trim());

  return (
    <main>
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
            { name: "Projects", path: "/#work" },
            { name: m.title, path: `/projects/${slug}` },
          ]),
        ]}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px" }}>
        {/* CRUMB */}
        <nav aria-label="Breadcrumb" style={{ ...MONO, paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, fontSize: 13 }}>
          <Link href="/#work" style={{ textDecoration: "none", color: "#8C97B8", padding: "10px 0" }}>
            ← All work
          </Link>
          {counter && (
            <span style={{ color: "#8C97B8" }}>
              <span className="sr-only">Project </span>
              {counter}
            </span>
          )}
        </nav>

        {/* TITLE */}
        <header className="p-hero">
          <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            <span style={{ ...MONO, alignSelf: "flex-start", background: ACCENT, color: "#FFFFFF", fontSize: 12, padding: "4px 12px", borderRadius: 999 }}>
              {statusText}
            </span>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(44px, 7vw, 96px)", lineHeight: 1, letterSpacing: "-0.04em", textWrap: "balance" }}>
              {mark ? (
                <>
                  {lead} <Highlight big>{mark}</Highlight>
                </>
              ) : (
                lead
              )}
            </h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
            {visual?.tagline && <p style={{ margin: 0, fontSize: "clamp(20px, 2vw, 24px)", lineHeight: 1.35, color: "#C9D4F2", textWrap: "pretty" }}>{visual.tagline}</p>}
            {visual?.tags.length ? (
              <ul aria-label="Tags" style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {visual.tags.map((t) => (
                  <li key={t}>
                    <Tag size={14}>{t}</Tag>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </header>

        {/* COVER */}
        {/* the cover sits above the first h2, so its caption is not a heading */}
        {cover && <Shot img={cover} no="01" sizes="(max-width: 1240px) 100vw, 1192px" preload heading={false} />}

        {/* META */}
        {facts.length > 0 && (
          <dl className="p-facts">
            {facts.map((f) => (
              <div key={f.k} style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                <dt style={{ ...MONO, fontSize: 12, letterSpacing: "0.06em", color: "#8C97B8", textTransform: "uppercase" }}>{f.k}</dt>
                <dd style={{ margin: 0, fontSize: 19, fontWeight: 600, lineHeight: 1.3, color: "#F2F5FF" }}>{f.v}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* 01 ABOUT */}
        <section aria-labelledby="about" className="blk">
          <SectionHead n={num("about")} id="about" title="About the project" />
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ margin: 0, fontSize: "clamp(22px, 2.4vw, 30px)", lineHeight: 1.3, fontWeight: 500, color: "#F2F5FF", textWrap: "pretty" }}>{m.objective}</p>
            {hasContent ? (
              <div className="md md-article" style={{ fontSize: 18, marginTop: 16 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content ?? ""}</ReactMarkdown>
              </div>
            ) : (
              <p style={{ margin: "16px 0 0", fontSize: 16, color: "#8C97B8" }}>The full write-up is on the way.</p>
            )}
          </div>
        </section>

        {/* 02 SCREENS */}
        {screens.length > 0 && (
          <section aria-labelledby="screens" className="blk blk-wide">
            <SectionHead n={num("screens")} id="screens" title="Screens" />
            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px, 6vw, 72px)", minWidth: 0 }}>
              {storyRows(screens).map((row) => (
                <div key={row[0].src} className={row.length === 2 ? "shot-pair" : undefined}>
                  {row.map((img) => (
                    <Shot
                      key={img.src}
                      img={img}
                      no={String(images.indexOf(img) + 1).padStart(2, "0")}
                      sizes={row.length === 2 ? "(max-width: 900px) 100vw, 600px" : "(max-width: 1240px) 100vw, 1192px"}
                    />
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 03 STACK */}
        <section aria-labelledby="stack" className="blk">
          <SectionHead n={num("stack")} id="stack" title="Stack & links" />
          <div className="p-specs">
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 style={{ ...KICKER, margin: 0, fontWeight: 400, color: "#8C97B8" }}>STACK</h3>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {m.loadout.map((t) => (
                  <li key={t}>
                    <Tag size={15}>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
            {specs.map((f) => (
              <div key={f.k} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <h3 style={{ ...KICKER, margin: 0, fontWeight: 400, color: "#8C97B8" }}>{f.k.toUpperCase()}</h3>
                <p style={{ margin: 0, fontWeight: 600 }}>{f.v}</p>
              </div>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h3 style={{ ...KICKER, margin: 0, fontWeight: 400, color: "#8C97B8" }}>LINKS</h3>
              <Link href="/blog" style={{ ...LINK_ROW, background: ACCENT, color: "#FFFFFF" }}>
                Read the write-ups <span aria-hidden="true">→</span>
              </Link>
              <Link href="/cv" style={{ ...LINK_ROW, border: "1.5px dashed rgba(111,168,255,0.4)" }}>
                CV <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* NEXT */}
      {nextItem && (
        <section style={{ width: "100%", boxSizing: "border-box", maxWidth: 1240, margin: "0 auto", padding: "72px 24px 96px" }}>
          <Link
            href={`/projects/${nextItem.mission.slug}`}
            className="card"
            style={{
              textDecoration: "none",
              background: "linear-gradient(120deg,#1C3FD6,#2F6BFF 50%,#5B4BE6)",
              color: "#FFFFFF",
              borderRadius: 32,
              padding: "clamp(28px, 5vw, 56px)",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ ...KICKER, color: "#DCE4FF" }}>NEXT PROJECT</span>
              <span style={{ fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
                {nextItem.mission.title}
              </span>
            </div>
            <span
              aria-hidden="true"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#03061A",
                flex: "0 0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
              }}
            >
              {/* an SVG, not the "→" glyph: font metrics push the glyph off-centre */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </section>
      )}
    </main>
  );
}
