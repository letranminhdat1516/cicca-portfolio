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

export const PROFILE_FIELDS: FieldSpec[] = [
  { name: "name", label: "NAME", type: "text" },
  { name: "classRole", label: "CLASS / ROLE", type: "text" },
  { name: "roles", label: "ROLES", type: "tags", full: true },
  { name: "tagline", label: "TAGLINE", type: "textarea", full: true },
  { name: "bio", label: "BIO", type: "textarea", full: true },
  { name: "region", label: "REGION", type: "text" },
  { name: "email", label: "EMAIL", type: "text" },
  { name: "avatarUrl", label: "AVATAR URL", type: "text", full: true },
];

export const SEO_FIELDS: FieldSpec[] = [
  { name: "siteName", label: "SITE NAME", type: "text" },
  { name: "defaultTitle", label: "DEFAULT TITLE (30–60 chars)", type: "text", full: true },
  { name: "defaultDescription", label: "META DESCRIPTION (70–160 chars)", type: "textarea", full: true },
  { name: "keywords", label: "KEYWORDS", type: "tags", full: true },
  { name: "ogImageUrl", label: "OG IMAGE URL (blank = auto)", type: "text", full: true },
  { name: "twitterHandle", label: "TWITTER / X HANDLE", type: "text", placeholder: "@username" },
  { name: "gscVerification", label: "GOOGLE SEARCH CONSOLE CODE", type: "text", placeholder: "paste verification meta content", full: true },
  { name: "llmsTxt", label: "LLMS.TXT OVERRIDE (blank = auto)", type: "textarea", full: true },
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
