import type { TocHeading } from "@/lib/toc";
import { MONO } from "@/components/site/ui";

/** Minimum headings before the "On this page" list earns its space. */
export const TOC_MIN = 2;

function Links({ headings }: { headings: TocHeading[] }) {
  return (
    <ol className="toc-list">
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`}>{h.text}</a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Sticky side list on wide screens; a collapsed <details> above the article on
 * narrow ones (CSS shows one or the other, so only one is ever in the a11y tree).
 */
export function Toc({ headings }: { headings: TocHeading[] }) {
  if (headings.length < TOC_MIN) return null;
  return (
    <>
      <nav aria-label="On this page" className="post-toc">
        <p style={{ ...MONO, margin: "0 0 12px", fontSize: 12, letterSpacing: "0.08em", color: "#8C97B8" }}>ON THIS PAGE</p>
        <Links headings={headings} />
      </nav>
      <details className="post-toc-m">
        <summary style={MONO}>On this page</summary>
        <nav aria-label="On this page">
          <Links headings={headings} />
        </nav>
      </details>
    </>
  );
}
