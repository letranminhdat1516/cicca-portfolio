import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { createSlugger } from "@/lib/toc";

// Minimal hast shape — enough to read text and spot a lone image.
type HastNode = { type: string; tagName?: string; value?: string; children?: HastNode[]; properties?: Record<string, unknown> };

const textOf = (n: HastNode | undefined): string =>
  !n ? "" : n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(textOf).join("");

const IMG_RE = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/;

type Segment = { kind: "md"; text: string } | { kind: "img"; alt: string; src: string };

function splitImages(md: string): Segment[] {
  const out: Segment[] = [];
  let buf: string[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(IMG_RE);
    if (m) {
      if (buf.length) { out.push({ kind: "md", text: buf.join("\n") }); buf = []; }
      out.push({ kind: "img", alt: m[1], src: m[2] });
    } else {
      buf.push(line);
    }
  }
  if (buf.length) out.push({ kind: "md", text: buf.join("\n") });
  return out;
}

export function Markdown({ children }: { children: string }) {
  const slug = createSlugger();
  const components: Components = {
    h2: ({ node, children: kids }) => {
      const text = textOf(node as HastNode).replace(/\s+/g, " ").trim();
      return <h2 id={text ? slug(text) : undefined}>{kids}</h2>;
    },
  };
  const segments = splitImages(children);
  return (
    <>
      {segments.map((seg, i) =>
        seg.kind === "img" ? (
          <figure key={i}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={seg.src} alt={seg.alt} loading="lazy" />
            {seg.alt && <figcaption>{seg.alt}</figcaption>}
          </figure>
        ) : (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={components}>
            {seg.text}
          </ReactMarkdown>
        ),
      )}
    </>
  );
}
