import {
  achievements,
  experiences,
  mergeContent,
  projects,
  seo,
  skillGroups,
  socials,
} from '../../prisma/content/cv';
import { caseStudies } from '../../prisma/content/case-studies';

describe('CV content', () => {
  it('keeps SEO title and description within search snippet limits', () => {
    expect(seo.defaultTitle.length).toBeLessThanOrEqual(65);
    expect(seo.defaultTitle).toContain('Lê Trần Minh Đạt');
    expect(seo.defaultDescription.length).toBeGreaterThanOrEqual(70);
    expect(seo.defaultDescription.length).toBeLessThanOrEqual(160);
  });

  it('has unique slugs, experience keys and skill names', () => {
    const uniq = (xs: string[]) => new Set(xs).size === xs.length;
    expect(uniq(projects.map((p) => p.slug))).toBe(true);
    expect(uniq(experiences.map((e) => `${e.org}-${e.title}`))).toBe(true);
    expect(uniq(skillGroups.flatMap((g) => g.items.map((i) => i.name)))).toBe(true);
    expect(uniq(achievements.map((a) => a.title))).toBe(true);
  });

  it('lists every role from the CV', () => {
    const titles = experiences.map((e) => e.title);
    for (const t of [
      'AI Gateway Platform Engineer',
      'Backend & AI Engineer',
      'Co-founder',
      'AI Agent Consultant Engineer',
      'Core Full-stack Developer',
      'AI Team Lead, Computer Vision',
      'Team Lead, Software Engineer',
      'IT Support Technician',
    ]) {
      expect(titles).toContain(t);
    }
  });

  it('keeps retired or anonymised wording out of the content', () => {
    const all = JSON.stringify({ projects, experiences, skillGroups, achievements, seo, caseStudies });
    for (const banned of [/Ăng/i, /\.NET/, /C#/, /34 orders/, /202 leads/, /100,000/, /Polkadot/, /95-file/, /lines of code/i, /% of the code/i]) {
      expect(all).not.toMatch(banned);
    }
  });

  it('uses only real links (no "#" placeholders or example.com)', () => {
    for (const s of socials) {
      expect(s.href).not.toBe('#');
      expect(s.href).not.toMatch(/example\.com/);
    }
  });

  it('keeps skill levels in range', () => {
    for (const s of skillGroups.flatMap((g) => g.items)) {
      expect(s.level).toBeGreaterThanOrEqual(0);
      expect(s.level).toBeLessThanOrEqual(100);
    }
  });

  // Startup work shown only as "what it is and that I was on the team": no
  // product detail, so a short two-section write-up instead of the full one.
  const BRIEF = new Set(['chord-agents']);

  it('keeps brief case studies to what the project is and the outcome', () => {
    for (const slug of BRIEF) {
      const md = caseStudies[slug];
      expect(md).toContain('## The project');
      expect(md).toContain('## Outcome');
      expect(md.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(150);
    }
  });

  it('has a factual case study for every project with the standard sections', () => {
    for (const p of projects) {
      const md = caseStudies[p.slug];
      expect(md).toBeDefined();
      if (BRIEF.has(p.slug)) continue;
      for (const h of ['## The problem', '## What I built', '## How it works', '## Outcome', '## Stack']) {
        expect(md).toContain(h);
      }
      const words = md.split(/\s+/).filter(Boolean).length;
      expect(words).toBeGreaterThanOrEqual(250);
      expect(words).toBeLessThanOrEqual(450);
    }
    expect(Object.keys(caseStudies).sort()).toEqual(projects.map((p) => p.slug).sort());
  });
});

describe('mergeContent', () => {
  it('keeps non-empty admin content', () => {
    expect(mergeContent('## Mine', '## Seed')).toBe('## Mine');
  });

  it('fills empty or missing content with the seeded case study', () => {
    expect(mergeContent(null, '## Seed')).toBe('## Seed');
    expect(mergeContent(undefined, '## Seed')).toBe('## Seed');
    expect(mergeContent('   \n', '## Seed')).toBe('## Seed');
  });

  it('stores null when neither has content', () => {
    expect(mergeContent('', undefined)).toBeNull();
    expect(mergeContent(null, '  ')).toBeNull();
  });
});
