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

  renderer.paragraph = ({ text }) => {
    if (text.startsWith("<figure>")) return `${text}\n`;
    return `<p>${text}</p>\n`;
  };

  const html = marked.parse(children, {
    renderer,
    gfm: true,
    breaks: false,
    async: false,
  }) as string;

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
