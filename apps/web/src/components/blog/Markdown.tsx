import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { createSlugger } from "@/lib/toc";

type HastNode = { type: string; tagName?: string; value?: string; children?: HastNode[]; properties?: Record<string, unknown> };

const textOf = (n: HastNode | undefined): string =>
  !n ? "" : n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(textOf).join("");

export function Markdown({ children }: { children: string }) {
  const slug = createSlugger();
  const components: Components = {
    h2: ({ node, children: kids }) => {
      const text = textOf(node as HastNode).replace(/\s+/g, " ").trim();
      return <h2 id={text ? slug(text) : undefined}>{kids}</h2>;
    },
  };

  const parts: { type: "md" | "img"; content: string; alt?: string }[] = [];
  let buf: string[] = [];
  for (const line of children.split("\n")) {
    const m = /^!\[([^\]]*)\]\(([^)]+)\)\s*$/.exec(line);
    if (m) {
      if (buf.length) { parts.push({ type: "md", content: buf.join("\n") }); buf = []; }
      parts.push({ type: "img", content: m[2], alt: m[1] });
    } else {
      buf.push(line);
    }
  }
  if (buf.length) parts.push({ type: "md", content: buf.join("\n") });

  if (parts.length <= 1) {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    );
  }

  return (
    <div>
      {parts.map((p, i) =>
        p.type === "img" ? (
          <figure key={`fig-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.content} alt={p.alt ?? ""} loading="lazy" />
            {p.alt && <figcaption>{p.alt}</figcaption>}
          </figure>
        ) : (
          <ReactMarkdown key={`md-${i}`} remarkPlugins={[remarkGfm]} components={components}>
            {p.content}
          </ReactMarkdown>
        ),
      )}
    </div>
  );
}
