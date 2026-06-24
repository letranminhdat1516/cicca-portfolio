// Schema driving the Portfolio CMS admin (forms, lists, live preview).

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "select"
  | "tags"
  | "boolean"
  | "color"
  | "datetime";

export interface FieldSpec {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  full?: boolean;
}

export type PreviewKind = "mission" | "skill" | "achievement" | "generic";

export interface EntitySchema {
  model: string;
  label: string;
  singular: string;
  icon: string;
  titleField: string;
  subtitleField?: string;
  preview: PreviewKind;
  fields: FieldSpec[];
}

const orderField: FieldSpec = { name: "order", label: "ORDER", type: "number" };

export const RARITY: Record<string, string> = {
  common: "#6b7280",
  rare: "#22d3ee",
  epic: "#b026ff",
  legendary: "#ffd23f",
};
export const RARITY_GLOW: Record<string, string> = {
  common: "rgba(107,114,128,0.3)",
  rare: "rgba(34,211,238,0.3)",
  epic: "rgba(176,38,255,0.32)",
  legendary: "rgba(255,210,63,0.32)",
};

export const PROFILE_FIELDS: FieldSpec[] = [
  { name: "name", label: "NAME", type: "text" },
  { name: "classRole", label: "CLASS / ROLE", type: "text" },
  { name: "roles", label: "ROLES", type: "tags", full: true },
  { name: "tagline", label: "TAGLINE", type: "textarea", full: true },
  { name: "bio", label: "BIO", type: "textarea", full: true },
  { name: "level", label: "LEVEL", type: "number" },
  { name: "rank", label: "RANK", type: "text" },
  { name: "region", label: "REGION", type: "text" },
  { name: "email", label: "EMAIL", type: "text" },
  { name: "xpCurrent", label: "XP CURRENT", type: "number" },
  { name: "xpMax", label: "XP MAX", type: "number" },
  { name: "avatarUrl", label: "AVATAR URL", type: "text", full: true },
];

export const ENTITIES: EntitySchema[] = [
  {
    model: "projects",
    label: "Missions",
    singular: "Mission",
    icon: "target",
    titleField: "title",
    subtitleField: "code",
    preview: "mission",
    fields: [
      { name: "code", label: "CODE", type: "text", placeholder: "MSN_06" },
      { name: "slug", label: "SLUG", type: "text", placeholder: "my-project" },
      { name: "title", label: "TITLE", type: "text", full: true },
      { name: "objective", label: "OBJECTIVE", type: "textarea", full: true },
      { name: "difficulty", label: "DIFFICULTY", type: "text", placeholder: "★★★★☆" },
      { name: "impact", label: "IMPACT", type: "text", placeholder: "100k+ USERS" },
      { name: "status", label: "STATUS", type: "select", options: ["COMPLETE", "ACTIVE"] },
      { name: "statusColor", label: "STATUS COLOR", type: "color" },
      { name: "loadout", label: "LOADOUT", type: "tags", full: true },
      { name: "content", label: "CONTENT", type: "markdown", full: true },
      orderField,
    ],
  },
  {
    model: "skills",
    label: "Skills",
    singular: "Skill",
    icon: "wrench",
    titleField: "name",
    subtitleField: "groupName",
    preview: "skill",
    fields: [
      { name: "groupName", label: "GROUP NAME", type: "text", placeholder: "AI & AGENTS // SPECIALTY", full: true },
      { name: "name", label: "NAME", type: "text" },
      { name: "rarity", label: "RARITY", type: "select", options: ["common", "rare", "epic", "legendary"] },
      { name: "level", label: "LEVEL", type: "number" },
      { name: "tip", label: "TIP", type: "text", full: true },
      orderField,
    ],
  },
  {
    model: "achievements",
    label: "Achievements",
    singular: "Achievement",
    icon: "trophy",
    titleField: "title",
    subtitleField: "year",
    preview: "achievement",
    fields: [
      { name: "year", label: "YEAR", type: "text", placeholder: "2026" },
      { name: "title", label: "TITLE", type: "text", full: true },
      { name: "description", label: "DESCRIPTION", type: "textarea", full: true },
      { name: "color", label: "COLOR", type: "color" },
      { name: "glow", label: "GLOW", type: "text", placeholder: "rgba(255,210,63,0.65)" },
      orderField,
    ],
  },
  {
    model: "experiences",
    label: "Experiences",
    singular: "Experience",
    icon: "briefcase",
    titleField: "title",
    subtitleField: "org",
    preview: "generic",
    fields: [
      { name: "title", label: "TITLE", type: "text", full: true },
      { name: "org", label: "ORG", type: "text", placeholder: "Company · Freelance", full: true },
      { name: "period", label: "PERIOD", type: "text", placeholder: "Jan 2025 – Now" },
      { name: "description", label: "DESCRIPTION", type: "textarea", full: true },
      orderField,
    ],
  },
  {
    model: "resources",
    label: "Resources",
    singular: "Resource",
    icon: "package",
    titleField: "title",
    preview: "generic",
    fields: [
      { name: "title", label: "TITLE", type: "text", full: true },
      { name: "description", label: "DESCRIPTION", type: "textarea", full: true },
      { name: "url", label: "URL", type: "text" },
      { name: "repoUrl", label: "REPO URL", type: "text" },
      { name: "tags", label: "TAGS", type: "tags", full: true },
      orderField,
    ],
  },
  {
    model: "stats",
    label: "Radar Stats",
    singular: "Stat",
    icon: "radar",
    titleField: "label",
    preview: "generic",
    fields: [
      { name: "label", label: "LABEL", type: "text" },
      { name: "value", label: "VALUE", type: "number" },
      orderField,
    ],
  },
  {
    model: "counters",
    label: "Counters",
    singular: "Counter",
    icon: "hash",
    titleField: "label",
    preview: "generic",
    fields: [
      { name: "label", label: "LABEL", type: "text" },
      { name: "value", label: "VALUE", type: "number" },
      { name: "suffix", label: "SUFFIX", type: "text", placeholder: "+ or %" },
      { name: "color", label: "COLOR", type: "color" },
      orderField,
    ],
  },
  {
    model: "socials",
    label: "Socials",
    singular: "Social",
    icon: "link",
    titleField: "name",
    subtitleField: "label",
    preview: "generic",
    fields: [
      { name: "label", label: "LABEL", type: "text", placeholder: "GH" },
      { name: "name", label: "NAME", type: "text", placeholder: "GitHub" },
      { name: "href", label: "HREF", type: "text", full: true },
      orderField,
    ],
  },
  {
    model: "blog",
    label: "Blog Posts",
    singular: "Post",
    icon: "pen",
    titleField: "title",
    subtitleField: "slug",
    preview: "generic",
    fields: [
      { name: "title", label: "TITLE", type: "text", full: true },
      { name: "slug", label: "SLUG", type: "text" },
      { name: "published", label: "PUBLISHED", type: "boolean" },
      { name: "publishedAt", label: "PUBLISHED AT", type: "datetime" },
      { name: "excerpt", label: "EXCERPT", type: "textarea", full: true },
      { name: "tags", label: "TAGS", type: "tags", full: true },
      { name: "coverImage", label: "COVER IMAGE", type: "text", full: true },
      { name: "content", label: "CONTENT", type: "markdown", full: true },
    ],
  },
];

export function getEntity(model: string): EntitySchema | undefined {
  return ENTITIES.find((e) => e.model === model);
}

export function emptyValues(fields: FieldSpec[]): Record<string, unknown> {
  const v: Record<string, unknown> = {};
  for (const f of fields) {
    v[f.name] =
      f.type === "number" ? 0 : f.type === "tags" ? [] : f.type === "boolean" ? false : f.type === "color" ? "#22d3ee" : "";
  }
  return v;
}

// Convert form values → API payload with correct types.
export function coerce(fields: FieldSpec[], values: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    let v = values[f.name];
    if (f.type === "number") v = Number(v ?? 0);
    else if (f.type === "boolean") v = Boolean(v);
    else if (f.type === "datetime" && (v === "" || v == null)) v = null;
    out[f.name] = v;
  }
  return out;
}
