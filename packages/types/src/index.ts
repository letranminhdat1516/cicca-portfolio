export type Rarity = "common" | "rare" | "epic" | "legendary";

export interface Profile {
  id: number;
  name: string;
  classRole: string;
  roles: string[];
  tagline: string;
  bio: string;
  level: number;
  rank: string;
  region: string;
  email: string;
  xpCurrent: number;
  xpMax: number;
  avatarUrl: string | null;
}

export interface Stat {
  label: string;
  value: number;
}

export interface Counter {
  label: string;
  value: number;
  suffix: string | null;
  color: string;
}

export interface Mission {
  code: string;
  slug: string;
  title: string;
  objective: string;
  difficulty: string;
  impact: string;
  status: "COMPLETE" | "ACTIVE";
  statusColor: string;
  loadout: string[];
}

export interface SkillItem {
  n: string;
  r: Rarity;
  lvl: number;
  tip: string;
}

export interface SkillGroup {
  name: string;
  items: SkillItem[];
}

export interface Achievement {
  year: string;
  title: string;
  description: string;
  color: string;
  glow: string;
}

export interface Social {
  label: string;
  name: string;
  href: string;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  coverImage: string | null;
  publishedAt: string | null;
}

export interface BlogPost extends BlogPostSummary {
  id: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Portfolio {
  profile: Profile;
  stats: Stat[];
  counters: Counter[];
  missions: Mission[];
  skillGroups: SkillGroup[];
  achievements: Achievement[];
  socials: Social[];
}
