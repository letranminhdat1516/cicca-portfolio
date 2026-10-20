import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';

// Upsert the Markdown posts in prisma/content/blog into an existing database,
// by slug. Other posts (written in the admin CMS) are left alone.
//   pnpm --filter @portfolio/api exec ts-node prisma/import-blog.ts
const DIR = join(__dirname, 'content', 'blog');
const prisma = new PrismaClient();

export function parsePost(raw: string) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('missing frontmatter');
  const fm = Object.fromEntries(
    m[1].split('\n').map((line) => {
      const i = line.indexOf(':');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
  for (const key of ['slug', 'title', 'excerpt', 'tags', 'published']) {
    if (!fm[key]) throw new Error(`frontmatter is missing "${key}"`);
  }
  return {
    slug: fm.slug,
    title: fm.title,
    excerpt: fm.excerpt,
    tags: fm.tags.replace(/^\[|\]$/g, '').split(',').map((t) => t.trim()).filter(Boolean),
    coverImage: fm.cover || null,
    published: true,
    publishedAt: new Date(`${fm.published}T00:00:00Z`),
    content: m[2].trim() + '\n',
  };
}

async function main() {
  for (const file of readdirSync(DIR).filter((f) => f.endsWith('.md'))) {
    const { slug, ...data } = parsePost(readFileSync(join(DIR, file), 'utf8'));
    await prisma.blogPost.upsert({ where: { slug }, update: data, create: { slug, ...data } });
    console.log(`upserted ${slug}`);
  }
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
