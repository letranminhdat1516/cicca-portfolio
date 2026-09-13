import {
  achievements,
  experiences,
  projects,
  seo,
  skillGroups,
  socials,
} from '../../prisma/content/cv';

describe('CV content', () => {
  it('keeps SEO title and description within search snippet limits', () => {
    expect(seo.defaultTitle.length).toBeLessThanOrEqual(60);
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
      'LLM Gateway Engineer',
      'AI Agent Consultant Engineer',
      'Accounting Application Developer',
      'AI Team Lead, Computer Vision',
      'AI Agent Engineer',
      'Freelance Software Engineer, Team Lead',
    ]) {
      expect(titles).toContain(t);
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
});
