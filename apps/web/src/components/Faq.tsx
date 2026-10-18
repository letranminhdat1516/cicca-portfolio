import type { Faq as FaqItem } from "@/lib/faq";
import { Eyebrow, H2 } from "./site/ui";

// Plain-language Q&A in server-rendered HTML. <details> keeps every answer in
// the DOM (crawlable, no JS) while staying compact on screen. It mirrors the
// FAQPage JSON-LD, so it must stay visible on the home page.
export function Faq({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 96px", display: "flex", flexDirection: "column", gap: 28 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Eyebrow>06 · FAQ</Eyebrow>
        <h2 id="faq-title" style={H2}>
          Frequently asked
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 880 }}>
        {faqs.map((f, i) => (
          <details
            key={f.q}
            lang={f.lang}
            open={i === 0}
            style={{
              borderRadius: 18,
              border: "1px solid rgba(111,168,255,0.25)",
              background: "rgba(10,16,52,0.7)",
              padding: "16px 20px",
            }}
          >
            <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 17, color: "#F2F5FF" }}>
              <h3 style={{ display: "inline", margin: 0, fontSize: 17, fontWeight: 600 }}>{f.q}</h3>
            </summary>
            <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.65, color: "#A9B4D0" }}>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
