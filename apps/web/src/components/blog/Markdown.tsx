import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { createSlugger } from "@/lib/toc";

// Minimal hast shape — enough to read text and spot a lone image.
type HastNode = { type: string; tagName?: string; value?: string; children?: HastNode[]; properties?: Record<string, unknown> };

const textOf = (n: HastNode | undefined): string =>
  !n ? "" : n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(textOf).join("");

/**
 * Article markdown: every h2 gets the anchor id the "On this page" list links
 * to (lib/toc.ts makes the same ids), and a paragraph holding just an image
 * becomes a <figure> captioned by the image title, else its alt text.
 */
export function Markdown({ children }: { children: string }) {
  const slug = createSlugger();
  const components: Components = {
    h2: ({ node, children: kids }) => {
      const text = textOf(node as HastNode).replace(/\s+/g, " ").trim();
      return <h2 id={text ? slug(text) : undefined}>{kids}</h2>;
    },
    p: ({ node, children: kids }) => {
      const parts = ((node as HastNode | undefined)?.children ?? []).filter((c) => !(c.type === "text" && !c.value?.trim()));
      const only = parts.length === 1 && parts[0].tagName === "img" ? parts[0] : null;
      if (!only) return <p>{kids}</p>;
      const src = String(only.properties?.src ?? "");
      const alt = String(only.properties?.alt ?? "");
      const caption = String(only.properties?.title ?? "") || alt;
      return (
        <figure>
          {/* CMS images are arbitrary URLs, so a plain <img> (no remotePatterns needed). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} loading="lazy" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    },
  };
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
