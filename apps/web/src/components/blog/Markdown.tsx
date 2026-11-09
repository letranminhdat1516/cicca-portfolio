import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { createSlugger } from "@/lib/toc";

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  children?: HastNode[];
  properties?: Record<string, unknown>;
};

const textOf = (n: HastNode | undefined): string =>
  !n
    ? ""
    : n.type === "text"
      ? (n.value ?? "")
      : (n.children ?? []).map(textOf).join("");

function hasImg(children: React.ReactNode): boolean {
  if (!Array.isArray(children)) return false;
  for (const c of children) {
    if (c && typeof c === "object" && "type" in c) {
      const el = c as React.ReactElement<{ src?: string }>;
      if (el.type === "img" || el.type === "figure") return true;
    }
  }
  return false;
}

export function Markdown({ children }: { children: string }) {
  const slug = createSlugger();
  const components: Components = {
    h2: ({ node, children: kids }) => {
      const text = textOf(node as HastNode).replace(/\s+/g, " ").trim();
      return <h2 id={text ? slug(text) : undefined}>{kids}</h2>;
    },
    img: ({ src, alt }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt ?? ""} loading="lazy" />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
    ),
    p: ({ children: kids, node }) => {
      if (hasImg(kids as React.ReactNode)) return <>{kids}</>;
      return <p>{kids}</p>;
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
