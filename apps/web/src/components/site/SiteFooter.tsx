import Link from "next/link";
import { FOOTER_LINE } from "@/data/home";
import { IDENTITY } from "@/lib/identity";
import { MONO } from "./ui";

// Crawlable internal links (feeds, llms.txt) live here on every page.
const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/cv", label: "CV" },
  { href: "/blog", label: "BLOG" },
  { href: "/feed.xml", label: "RSS" },
  { href: "/llms.txt", label: "LLMS.TXT" },
];

export function SiteFooter() {
  return (
    <footer style={{ background: "#03061A", borderTop: "1px solid rgba(111,168,255,0.12)" }}>
      <div
        style={{
          ...MONO,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "22px 24px",
          textAlign: "center",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "#8C97B8",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <nav aria-label="Footer" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "4px 20px" }}>
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} prefetch={false} style={{ textDecoration: "none", color: "#A9B4D0", padding: "6px 0" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        {/* Both spellings of the name plus the handle, in visible text on every page. */}
        <p style={{ margin: 0, letterSpacing: "0.04em", color: "#A9B4D0" }}>
          {/* single text nodes so streamed HTML has no <!-- --> between the words */}
          {`© 2026 ${IDENTITY.name} (`}
          <span lang="vi">{IDENTITY.nativeName}</span>
          {`) · ${IDENTITY.handle}`}
        </p>
        <div>{FOOTER_LINE}</div>
      </div>
    </footer>
  );
}
