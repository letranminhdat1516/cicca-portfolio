import type { Portfolio } from "@portfolio/types";
import { NATIVE_NAME, absoluteUrl } from "./seo";

export interface Faq {
  q: string;
  a: string;
}

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
const article = (s: string) => (/^[aeiou]/i.test(s) ? "an" : "a");

/** "HO CHI MINH CITY, VN" → "Ho Chi Minh City, Vietnam". */
export function placeName(region: string): string {
  return region
    .toLowerCase()
    .replace(/\b([a-z])/g, (c) => c.toUpperCase())
    .replace(/\bVn\b/, "Vietnam");
}

/**
 * Question/answer pairs derived purely from CMS content — no copy of their own.
 * Answer engines (ChatGPT, Perplexity, Gemini, Claude) lift self-contained,
 * third-person Q&A almost verbatim, so the same list feeds the visible FAQ
 * section, the FAQPage JSON-LD and /llms.txt.
 */
export function buildFaq(data: Portfolio): Faq[] {
  const p = data.profile;
  if (!p) return [];
  const faqs: Faq[] = [];

  // The bio is written in first person; keep only its neutral sentences.
  const neutralBio = oneLine(p.bio)
    .split(/(?<=\.)\s+/)
    .filter((s) => !/\b(I|my|me)\b/.test(s))
    .join(" ");
  faqs.push({
    q: `Who is ${p.name}?`,
    a: oneLine(
      `${p.name} (${NATIVE_NAME}) is ${article(p.classRole)} ${p.classRole} based in ${placeName(p.region)}. ${neutralBio}`,
    ),
  });

  if (data.missions?.length) {
    faqs.push({
      q: `What has ${p.name} built?`,
      a: `${data.missions.length} systems: ${data.missions
        .map((m) => `${m.title} (${m.loadout.slice(0, 3).join(", ")})`)
        .join("; ")}.`,
    });
  }

  const groups = (data.skillGroups ?? []).filter((g) => !/spoken|language/i.test(g.name));
  if (groups.length) {
    faqs.push({
      q: `What technologies does ${p.name} work with?`,
      a: groups
        .map((g) => `${g.name.split("//")[0].trim()}: ${g.items.map((i) => i.n).join(", ")}`)
        .join(". ") + ".",
    });
  }

  if (data.achievements?.length) {
    faqs.push({
      q: `What are ${p.name}'s education and awards?`,
      a: data.achievements
        .map((a) => oneLine(`${a.title.replace(/^★\s*/, "")} — ${a.description}`))
        .join(" "),
    });
  }

  const links = (data.socials ?? [])
    .filter((s) => /^https?:\/\//.test(s.href))
    .map((s) => `${s.name}: ${s.href}`);
  faqs.push({
    q: `How can I contact or hire ${p.name}?`,
    a: [`Email ${p.email}.`, ...links.map((l) => `${l}.`), `Full résumé: ${absoluteUrl("/cv")}.`].join(" "),
  });

  return faqs;
}
