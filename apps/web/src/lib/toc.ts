// "On this page" for blog posts: the post's level-2 markdown headings, with the
// same anchor ids the rendered <h2>s get (see components/blog/markdown.tsx).

export interface TocHeading {
  id: string;
  text: string;
}

/** Lower-case, accent-free, hyphenated anchor id ("Where it broke" → "where-it-broke"). */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Hands out unique ids in document order: the second "Setup" becomes "setup-2".
 * The TOC and the renderer each make their own slugger and see the same headings
 * in the same order, so their ids match.
 */
export function createSlugger() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = slugify(text) || "section";
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
}

/** Inline markdown → the plain text a reader sees. */
export function stripInline(md: string): string {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links
    .replace(/\[([^\]]*)\]\[[^\]]*\]/g, "$1") // reference links
    .replace(/<[^>]+>/g, "") // inline html
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\\([\\`*_{}[\]()#+\-.!~|>])/g, "$1")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (_, e: string) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'", nbsp: " " })[e] ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every `## heading` (ATX or `---` setext) outside fenced code, in order. */
export function extractHeadings(markdown: string): TocHeading[] {
  const slug = createSlugger();
  const out: TocHeading[] = [];
  let fence: string | null = null;
  let prev = "";
  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.replace(/\t/g, "    ");
    const f = /^ {0,3}(`{3,}|~{3,})/.exec(line);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      prev = "";
      continue;
    }
    if (fence) continue;

    const atx = /^ {0,3}##(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/.exec(line);
    let text: string | null = atx ? (atx[1] ?? "") : null;
    // setext: a paragraph line underlined with dashes ("Title\n---")
    if (text === null && /^ {0,3}-+[ \t]*$/.test(line) && isParagraphLine(prev)) text = prev.trim();

    if (text !== null) {
      const plain = stripInline(text);
      if (plain) out.push({ id: slug(plain), text: plain });
      prev = "";
      continue;
    }
    prev = line;
  }
  return out;
}

const isParagraphLine = (line: string) =>
  line.trim() !== "" &&
  !/^ {0,3}(#|>|[-*+][ \t]|\d+[.)][ \t]|\||<)/.test(line) &&
  !/^ {4,}/.test(line);
