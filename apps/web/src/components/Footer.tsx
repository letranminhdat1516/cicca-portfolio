import Link from "next/link";
import { NATIVE_NAME } from "@/lib/seo";

const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/cv", label: "RÉSUMÉ" },
  { href: "/blog", label: "BLOG" },
  { href: "/feed.xml", label: "RSS" },
  { href: "/llms.txt", label: "LLMS.TXT" },
];

export function Footer({ name = "Le Tran Minh Dat" }: { name?: string }) {
  return (
    <footer
      className="px-6 py-8 text-center text-[10.5px] tracking-[2px]"
      style={{
        fontFamily: "var(--font-mono), monospace",
        color: "#8686a4",
        borderTop: "1px solid rgba(176,38,255,0.12)",
      }}
    >
      <nav aria-label="Footer" className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} prefetch={false} className="no-underline" style={{ color: "#9a9ab8" }}>
            {l.label}
          </Link>
        ))}
      </nav>
      <div style={{ animation: "flick 6s infinite" }}>
        © 2026 {name} ({NATIVE_NAME}) · SYSTEM LOADED. NO PIXELS HARMED. · BUILD v1.0.0
      </div>
    </footer>
  );
}
