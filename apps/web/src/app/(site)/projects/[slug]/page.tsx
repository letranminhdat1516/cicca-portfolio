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
import { MediaViewer, type MediaItem } from "@/components/project/MediaViewer";

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
const ASIDE_CARD: CSSProperties = {
  background: "#03061A",
  border: "1px solid rgba(111,168,255,0.25)",
  borderRadius: 24,
  padding: 24,
  display: "flex",
  flexDirection: "column",
};
const LINK_ROW: CSSProperties = {
  textDecoration: "none",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 18px",
  borderRadius: 999,
  fontWeight: 500,
};

/** Real screenshots when the project has them; otherwise the "coming soon" placeholders. */
function mediaFor(short: string, images?: ProjectImage[]): MediaItem[] {
  if (images?.length) {
    return images.map((img) => ({ kind: "IMAGE", label: img.caption, short: img.caption, src: img.src, alt: img.alt }));
  }
  return [
    { kind: "VIDEO", label: `Demo — ${short} (coming soon)`, short: "Demo video" },
    { kind: "IMAGE", label: "Architecture overview", short: "Architecture" },
    { kind: "IMAGE", label: "Product screens", short: "Screens" },
  ];
}

const FIGURES = [
  { label: "[Architecture diagram]", caption: "How the pieces fit together — diagram coming soon.", ratio: "16 / 9", full: true },
  { label: "[Screenshot]", caption: "The product in use — screenshots coming soon.", ratio: "4 / 3", full: false },
  { label: "[Dashboard]", caption: "Operations view — coming soon.", ratio: "4 / 3", full: false },
];

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const found = await load(slug);
  if (!found) notFound();
  const { data, mission: m } = found;
  const url = `${SITE_URL}/projects/${slug}`;

  const visual = PROJECT_VISUALS[slug];
  const images = visual?.images ?? [];
  const gallery = images.slice(1);
  const work = orderedWork(data.missions);
  const pos = work.findIndex((w) => w.mission.slug === slug);
  const next = work.length ? work[(pos + 1) % work.length] : undefined;
  const nextItem = next && next.mission.slug !== slug ? next : undefined;
  const no = pos >= 0 ? work[pos].no : null;

  const statusText = visual?.statusLabel
    ? titleCase(visual.statusLabel)
    : m.status === "ACTIVE"
      ? "In production"
      : "Delivered";
  const facts = [
    { k: "ROLE", v: visual?.role },
    { k: "TIMELINE", v: visual?.when },
    { k: "DOMAIN", v: visual?.domain },
    { k: "IMPACT", v: m.impact ? titleCase(m.impact) : undefined },
  ].filter((f): f is { k: string; v: string } => Boolean(f.v));

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

      {/* TITLE */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "56px 24px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
        <Link href="/#work" style={{ ...MONO, alignSelf: "flex-start", textDecoration: "none", fontSize: 13, color: "#8C97B8", padding: "8px 0" }}>
          ← All work
        </Link>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <span style={{ ...MONO, background: ACCENT, color: "#FFFFFF", fontSize: 12, padding: "4px 12px", borderRadius: 999 }}>{statusText}</span>
          {(no || visual?.domain) && (
            <span style={{ ...MONO, fontSize: 13, color: "#8C97B8" }}>{[no, visual?.domain].filter(Boolean).join(" · ")}</span>
          )}
        </div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 1, letterSpacing: "-0.04em", maxWidth: 1000 }}>
          {m.title}
        </h1>
        <p style={{ margin: 0, maxWidth: 760, fontSize: 20, color: "#C9D4F2" }}>{m.objective}</p>
        {facts.length > 0 && (
          <dl
            style={{
              margin: "8px 0 0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))",
              gap: "0 32px",
              borderTop: "1px solid rgba(232,238,255,0.6)",
            }}
          >
            {facts.map((f) => (
              <div key={f.k} style={{ padding: "14px 0", display: "flex", flexDirection: "column", gap: 2 }}>
                <dt style={{ ...MONO, fontSize: 12, color: "#8C97B8" }}>{f.k}</dt>
                <dd style={{ margin: 0, fontWeight: 600 }}>{f.v}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {/* MEDIA VIEWER */}
      <MediaViewer items={mediaFor(visual?.short ?? m.title, visual?.images)} glyph={visual?.glyph ?? "◆"} />

      {/* CASE STUDY */}
      <section style={{ background: "rgba(10,16,52,0.7)", borderTop: "1px solid rgba(111,168,255,0.25)", borderBottom: "1px solid rgba(111,168,255,0.25)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 24px", display: "flex", flexWrap: "wrap", gap: "48px 72px" }}>
          <article style={{ flex: "999 1 620px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <h2 style={{ ...KICKER, margin: 0, fontWeight: 400, color: "#6FA8FF" }}>THE CASE STUDY</h2>
            {m.content?.trim() ? (
              <div className="md" style={{ fontSize: 18 }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
              </div>
            ) : (
              <>
                {visual?.tagline && <p style={{ margin: 0, fontSize: 18, color: "#C9D4F2" }}>{visual.tagline}</p>}
                <p style={{ margin: 0, fontSize: 16, color: "#8C97B8" }}>The full write-up is on the way.</p>
              </>
            )}
          </article>
          <aside style={{ flex: "1 1 300px", minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ ...ASIDE_CARD, gap: 10 }}>
              <h2 style={{ ...KICKER, margin: 0, fontWeight: 400, color: "#8C97B8" }}>LINKS</h2>
              <Link href="/blog" style={{ ...LINK_ROW, background: ACCENT, color: "#FFFFFF" }}>
                Read the write-ups <span aria-hidden="true">→</span>
              </Link>
              <Link href="/cv" style={{ ...LINK_ROW, border: "1.5px dashed rgba(111,168,255,0.4)" }}>
                Résumé <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div style={{ ...ASIDE_CARD, gap: 14 }}>
              <h2 style={{ ...KICKER, margin: 0, fontWeight: 400, color: "#8C97B8" }}>STACK</h2>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {m.loadout.map((t) => (
                  <li key={t}>
                    <Tag size={14}>{t}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* GALLERY — placeholders only for projects without screenshots; when there are screenshots
          the media viewer above already shows every one, so a second gallery would repeat them */}
      {images.length === 0 && (
        <section aria-labelledby="bts" style={{ maxWidth: 1240, margin: "0 auto", padding: "88px 24px", display: "flex", flexDirection: "column", gap: 32 }}>
          <h2 id="bts" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Behind the <Highlight>scenes</Highlight>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: 20 }}>
            {gallery.map((g, i) => (
              <figure key={g.src} style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10, gridColumn: i === 0 ? "1 / -1" : undefined }}>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "16 / 10",
                    borderRadius: 22,
                    overflow: "hidden",
                    border: "1px solid rgba(111,168,255,0.25)",
                    background: "#03061A",
                  }}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes={i === 0 ? "(max-width: 1240px) 100vw, 1192px" : "(max-width: 640px) 100vw, (max-width: 1240px) 50vw, 600px"}
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
                <figcaption style={{ fontSize: 14, color: "#8C97B8" }}>{g.caption}</figcaption>
              </figure>
            ))}
            {images.length === 0 &&
              FIGURES.map((f) => (
                <figure key={f.label} style={{ margin: 0, display: "flex", flexDirection: "column", gap: 10, gridColumn: f.full ? "1 / -1" : undefined }}>
                  <div
                    className="ph"
                    aria-hidden="true"
                    style={{
                      ...MONO,
                      aspectRatio: f.ratio,
                      borderRadius: 22,
                      border: "1px solid rgba(111,168,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      color: "#8C97B8",
                    }}
                  >
                    {f.label}
                  </div>
                  <figcaption style={{ fontSize: 14, color: "#8C97B8" }}>{f.caption}</figcaption>
                </figure>
              ))}
          </div>
        </section>
      )}

      {/* NEXT */}
      {nextItem && (
        <section style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px 96px" }}>
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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "#FFFFFF",
              }}
            >
              →
            </span>
          </Link>
        </section>
      )}
    </main>
  );
}
