import { marked, Renderer } from "marked";
import { createSlugger } from "@/lib/toc";

export function Markdown({ children }: { children: string }) {
  const slug = createSlugger();
  const renderer = new Renderer();

  renderer.heading = ({ text, depth }) => {
    if (depth === 2) {
      const plain = text
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const id = plain ? slug(plain) : undefined;
      return `<h2${id ? ` id="${id}"` : ""}>${text}</h2>\n`;
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };

  renderer.image = ({ href, title, text }) => {
    const alt = text ?? "";
    return `<figure><img src="${href}" alt="${alt}" loading="lazy" />${alt ? `<figcaption>${alt}</figcaption>` : ""}</figure>`;
  };

  let html = marked.parse(children, {
    renderer,
    gfm: true,
    breaks: false,
    async: false,
  }) as string;

  // Unwrap <figure> from <p> tags (marked wraps inline images in paragraphs)
  html = html.replace(/<p>(<figure>[\s\S]*?<\/figure>)<\/p>/g, "$1");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
