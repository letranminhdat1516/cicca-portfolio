import { marked } from "marked";
import { createSlugger } from "@/lib/toc";

export function Markdown({ children }: { children: string }) {
  const slug = createSlugger();

  const renderer = new marked.Renderer();
  renderer.heading = ({ text, depth }) => {
    if (depth === 2) {
      const plain = text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      return `<h2 id="${slug(plain)}">${text}</h2>\n`;
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };
  renderer.image = ({ href, text, title }) => {
    const caption = title || text;
    return `<figure><img src="${href}" alt="${text || ""}" loading="lazy" />${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
  };

  const html = marked.parse(children, { renderer, async: false }) as string;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
