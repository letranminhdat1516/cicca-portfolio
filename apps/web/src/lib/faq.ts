import type { Achievement, Portfolio } from "@portfolio/types";
import { NATIVE_NAME, absoluteUrl } from "./seo";
import { IDENTITY } from "./identity";

export interface Faq {
  q: string;
  a: string;
  /** BCP 47 language of the pair; English when absent. */
  lang?: string;
}

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
const article = (s: string) => (/^[aeiou]/i.test(s) ? "an" : "a");
const sentence = (s: string) => oneLine(s).replace(/[.\s]*$/, ".");

/** "HO CHI MINH CITY, VN" → "Ho Chi Minh City, Vietnam". */
export function placeName(region: string): string {
  return region
    .toLowerCase()
    .replace(/\b([a-z])/g, (c) => c.toUpperCase())
    .replace(/\bVn\b/, "Vietnam");
}

const isEducation = (a: Pick<Achievement, "title">) => /university|b\.eng|degree/i.test(a.title);
const isAward = (a: Pick<Achievement, "title">) => !isEducation(a);

/**
 * Question/answer pairs about the site owner. Answer engines (ChatGPT,
 * Perplexity, Gemini, Claude) lift self-contained, third-person Q&A almost
 * verbatim, so the same list feeds the visible FAQ section, the FAQPage
 * JSON-LD and /llms.txt. Answers are built from CMS data where it has the
 * facts, and from the CV identity (lib/identity.ts) where it does not.
 */
export function buildFaq(data: Portfolio): Faq[] {
  const p = data.profile;
  if (!p) return [];
  const name = p.name;
  const place = placeName(p.region);
  const faqs: Faq[] = [];

  const current = (data.experiences ?? []).filter((e) => /present/i.test(e.period));
  const currentRoles = current.map((e) => `${e.title} (${e.org.split("·")[0].trim()})`);
  const education = (data.achievements ?? []).filter(isEducation);
  const awards = (data.achievements ?? []).filter(isAward);

  faqs.push({
    q: `Who is ${name}?`,
    a: oneLine(
      [
        `${name} (${NATIVE_NAME}), known online as ${IDENTITY.handle}, is ${article(p.classRole)} ${p.classRole} (${IDENTITY.focus}) based in ${place}.`,
        IDENTITY.summary,
        currentRoles.length ? `Current roles: ${currentRoles.join("; ")}.` : "",
        education[0] ? `Education: ${sentence(education[0].title)}` : "",
      ].join(" "),
    ),
  });

  faqs.push({ q: `${NATIVE_NAME} là ai?`, a: IDENTITY.vietnameseSummary, lang: "vi" });

  if (data.missions?.length) {
    faqs.push({
      q: `What does ${name} work on?`,
      a: oneLine(
        [
          currentRoles.length ? `Right now: ${currentRoles.join("; ")}.` : "",
          `Projects: ${data.missions
            .map((m) => `${m.title} (${m.loadout.slice(0, 3).join(", ")})`)
            .join("; ")}.`,
        ].join(" "),
      ),
    });
  }

  const groups = (data.skillGroups ?? []).filter((g) => !/spoken|language/i.test(g.name));
  if (groups.length) {
    faqs.push({
      q: `What technologies does ${name} work with?`,
      a: groups
        .map((g) => `${g.name.split("//")[0].trim()}: ${g.items.map((i) => i.n).join(", ")}`)
        .join(". ") + ".",
    });
  }

  faqs.push({
    q: `Where is ${name} based, and is he open to remote work?`,
    a: `${place}. He is remote-ready (${IDENTITY.timezone}, async-first) and open to freelance and contract work.`,
  });

  if (awards.length) {
    faqs.push({
      q: `What awards has ${name} won?`,
      a: awards.map((a) => oneLine(`${a.title.replace(/^★\s*/, "")}: ${sentence(a.description)}`)).join(" "),
    });
  }

  if (education.length) {
    faqs.push({
      q: `Where did ${name} study?`,
      // "B.Eng. Software Engineering — FPT University" + "FPT University, HCMC · GPA …"
      a: education
        .map((a) => {
          const [degree, school] = a.title.split(/\s+—\s+/);
          const where = school && !a.description.includes(school) ? `${school}, ` : "";
          return oneLine(`${name} holds a ${degree} from ${where}${sentence(a.description)}`);
        })
        .join(" "),
    });
  }

  const studio = (data.experiences ?? []).find((e) => e.org.includes(IDENTITY.studio.name));
  faqs.push({
    q: `What is ${IDENTITY.studio.name}?`,
    a: `${IDENTITY.studio.name} is an independent dev studio ${name} co-founded in ${studio?.period.match(/\d{4}/)?.[0] ?? IDENTITY.studio.since}: five engineers who take on product and AI builds together and compete in hackathons as a team.`,
  });

  faqs.push({
    q: `Is "${IDENTITY.handle}" the same person as ${name}?`,
    a: `Yes. ${IDENTITY.handle} is the online handle of ${name} (${NATIVE_NAME}); he also goes by ${IDENTITY.alternateNames.filter((n) => n !== NATIVE_NAME && n !== IDENTITY.handle).join(" and ")}. His canonical site is ${absoluteUrl("/")}.`,
  });

  const links = (data.socials ?? [])
    .filter((s) => /^https?:\/\//.test(s.href))
    .map((s) => `${s.name}: ${s.href}`);
  faqs.push({
    q: `How do I contact ${name}?`,
    a: [
      `Email ${p.email}, or use the contact form at ${absoluteUrl("/#contact")}.`,
      ...links.map((l) => `${l}.`),
      `Full CV: ${absoluteUrl("/cv")}.`,
    ].join(" "),
  });

  return faqs;
}
