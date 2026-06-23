// Schema that drives the admin forms. Define fields once; forms render from this.

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
  options?: string[]; // for select
  placeholder?: string;
  full?: boolean; // span full width in the grid
}

export interface EntitySchema {
  model: string; // API model key
  label: string; // display name (plural)
  singular: string;
  icon: string; // emoji for the sidebar
  titleField: string; // which field to show as the row title
  subtitleField?: string;
  fields: FieldSpec[];
}

const orderField: FieldSpec = { name: "order", label: "Order", type: "number" };

export const ENTITIES: EntitySchema[] = [
  {
    model: "projects",
    label: "Missions",
    singular: "Mission",
    icon: "🎯",
    titleField: "title",
    subtitleField: "code",
    fields: [
      { name: "code", label: "Code", type: "text", placeholder: "MSN_06" },
      { name: "slug", label: "Slug (unique)", type: "text", placeholder: "my-project" },
      { name: "title", label: "Title", type: "text", full: true },
      { name: "objective", label: "Objective", type: "textarea", full: true },
      { name: "difficulty", label: "Difficulty", type: "text", placeholder: "★★★★☆" },
      { name: "impact", label: "Impact", type: "text", placeholder: "100k+ USERS" },
      { name: "status", label: "Status", type: "select", options: ["COMPLETE", "ACTIVE"] },
      { name: "statusColor", label: "Status color", type: "color" },
      { name: "loadout", label: "Loadout (tags)", type: "tags", full: true },
      { name: "content", label: "Content (markdown, optional)", type: "markdown", full: true },
      orderField,
    ],
  },
  {
    model: "skills",
    label: "Skills",
    singular: "Skill",
    icon: "🧰",
    titleField: "name",
    subtitleField: "groupName",
    fields: [
      { name: "groupName", label: "Group", type: "text", placeholder: "AI & AGENTS // SPECIALTY", full: true },
      { name: "name", label: "Name", type: "text" },
      { name: "rarity", label: "Rarity", type: "select", options: ["common", "rare", "epic", "legendary"] },
      { name: "level", label: "Level (0–100)", type: "number" },
      { name: "tip", label: "Tooltip", type: "text", full: true },
      orderField,
    ],
  },
  {
    model: "achievements",
    label: "Achievements",
    singular: "Achievement",
    icon: "🏆",
    titleField: "title",
    subtitleField: "year",
    fields: [
      { name: "year", label: "Year", type: "text", placeholder: "2026" },
      { name: "title", label: "Title", type: "text", full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "color", label: "Color", type: "color" },
      { name: "glow", label: "Glow (rgba)", type: "text", placeholder: "rgba(255,210,63,0.65)" },
      orderField,
    ],
  },
  {
    model: "experiences",
    label: "Experiences",
    singular: "Experience",
    icon: "💼",
    titleField: "title",
    subtitleField: "org",
    fields: [
      { name: "title", label: "Role / Title", type: "text", full: true },
      { name: "org", label: "Org · Type", type: "text", placeholder: "Company · Freelance", full: true },
      { name: "period", label: "Period", type: "text", placeholder: "Jan 2025 – Now" },
      { name: "description", label: "Description", type: "textarea", full: true },
      orderField,
    ],
  },
  {
    model: "resources",
    label: "Resources",
    singular: "Resource",
    icon: "📦",
    titleField: "title",
    fields: [
      { name: "title", label: "Title", type: "text", full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "url", label: "Live URL", type: "text" },
      { name: "repoUrl", label: "Repo URL", type: "text" },
      { name: "tags", label: "Tags", type: "tags", full: true },
      orderField,
    ],
  },
  {
    model: "stats",
    label: "Radar Stats",
    singular: "Stat",
    icon: "📡",
    titleField: "label",
    fields: [
      { name: "label", label: "Label", type: "text" },
      { name: "value", label: "Value (0–100)", type: "number" },
      orderField,
    ],
  },
  {
    model: "counters",
    label: "Counters",
    singular: "Counter",
    icon: "🔢",
    titleField: "label",
    fields: [
      { name: "label", label: "Label", type: "text" },
      { name: "value", label: "Value", type: "number" },
      { name: "suffix", label: "Suffix", type: "text", placeholder: "+ or %" },
      { name: "color", label: "Color", type: "color" },
      orderField,
    ],
  },
  {
    model: "socials",
    label: "Socials",
    singular: "Social",
    icon: "🔗",
    titleField: "name",
    subtitleField: "label",
    fields: [
      { name: "label", label: "Short label", type: "text", placeholder: "GH" },
      { name: "name", label: "Name", type: "text", placeholder: "GitHub" },
      { name: "href", label: "URL", type: "text", full: true },
      orderField,
    ],
  },
  {
    model: "blog",
    label: "Blog Posts",
    singular: "Post",
    icon: "✍️",
    titleField: "title",
    subtitleField: "slug",
    fields: [
      { name: "title", label: "Title", type: "text", full: true },
      { name: "slug", label: "Slug (unique)", type: "text" },
      { name: "published", label: "Published", type: "boolean" },
      { name: "publishedAt", label: "Published at", type: "datetime" },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { name: "tags", label: "Tags", type: "tags", full: true },
      { name: "coverImage", label: "Cover image URL", type: "text", full: true },
      { name: "content", label: "Content (markdown)", type: "markdown", full: true },
    ],
  },
];

export const PROFILE_FIELDS: FieldSpec[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "classRole", label: "Class / Role", type: "text" },
  { name: "roles", label: "Roles (typing rotation)", type: "tags", full: true },
  { name: "tagline", label: "Tagline", type: "textarea", full: true },
  { name: "bio", label: "Bio", type: "textarea", full: true },
  { name: "level", label: "Level", type: "number" },
  { name: "rank", label: "Rank", type: "text" },
  { name: "region", label: "Region", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "xpCurrent", label: "XP current", type: "number" },
  { name: "xpMax", label: "XP max", type: "number" },
  { name: "avatarUrl", label: "Avatar URL", type: "text", full: true },
];

export function getEntity(model: string): EntitySchema | undefined {
  return ENTITIES.find((e) => e.model === model);
}

// Build an empty record for a "create" form.
export function emptyValues(fields: FieldSpec[]): Record<string, unknown> {
  const v: Record<string, unknown> = {};
  for (const f of fields) {
    v[f.name] =
      f.type === "number"
        ? 0
        : f.type === "tags"
          ? []
          : f.type === "boolean"
            ? false
            : f.type === "color"
              ? "#22d3ee"
              : "";
  }
  return v;
}
