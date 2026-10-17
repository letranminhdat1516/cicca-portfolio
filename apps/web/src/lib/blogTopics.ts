// Blog posts carry free-form tags; the index groups them into a few topics
// for the filter row. Unknown tags fall into "Engineering".
export const TOPICS = ["LLM", "Engineering", "Infra"] as const;
export type Topic = (typeof TOPICS)[number];

const TAG_TOPIC: Record<string, Topic> = {
  llm: "LLM",
  ai: "LLM",
  rag: "LLM",
  agents: "LLM",
  agent: "LLM",
  gateway: "LLM",
  litellm: "LLM",
  mcp: "LLM",
  voice: "LLM",
  k3s: "Infra",
  k8s: "Infra",
  kubernetes: "Infra",
  gitops: "Infra",
  argocd: "Infra",
  infra: "Infra",
  devops: "Infra",
  homelab: "Infra",
};

/** First tag that maps to a topic wins. */
export function topicOf(tags: string[]): Topic {
  for (const t of tags) {
    const hit = TAG_TOPIC[t.toLowerCase()];
    if (hit) return hit;
  }
  return "Engineering";
}

/** Minutes to read at ~220 wpm, never below 1. */
export const readMinutes = (words: number) => Math.max(1, Math.round(words / 220));

export const formatPostDate = (iso: string | null | undefined) =>
  iso
    ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(iso))
    : null;
