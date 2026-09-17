import type { Faq as FaqItem } from "@/lib/faq";
import { SectionHeader } from "./SectionHeader";

// Plain-language Q&A in server-rendered HTML. <details> keeps every answer in
// the DOM (crawlable, no JS) while staying compact on screen.
export function Faq({ faqs }: { faqs: FaqItem[] }) {
  if (faqs.length === 0) return null;
  return (
    <section id="faq" className="mx-auto max-w-[880px] px-6 py-20">
      <SectionHeader index="08" label="INTEL" title="FAQ" plain="Frequently asked questions" />
      <div className="flex flex-col gap-3">
        {faqs.map((f, i) => (
          <details
            key={f.q}
            open={i === 0}
            className="p-5"
            style={{
              background: "rgba(10,10,18,0.7)",
              border: "1px solid rgba(176,38,255,0.2)",
            }}
          >
            <summary
              className="cursor-pointer text-[16px] font-bold"
              style={{ fontFamily: "var(--font-ui), sans-serif", color: "#fff" }}
            >
              <h3 className="inline text-[16px]">{f.q}</h3>
            </summary>
            <p className="mt-3 text-[13.5px] leading-6" style={{ color: "#a8a8c2" }}>
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
