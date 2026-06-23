// Presentation config that is structural (not editable content).
// Editable content now comes from the API (@/lib/portfolio).

import type { Rarity } from "@portfolio/types";

export const RARITY: Record<Rarity, { color: string; glow: string; label: string }> = {
  common: { color: "#6b7280", glow: "rgba(107,114,128,0.5)", label: "COMMON" },
  rare: { color: "#22d3ee", glow: "rgba(34,211,238,0.6)", label: "RARE" },
  epic: { color: "#b026ff", glow: "rgba(176,38,255,0.6)", label: "EPIC" },
  legendary: { color: "#ffd23f", glow: "rgba(255,210,63,0.65)", label: "LEGENDARY" },
};

export const navItems: { id: string; en: string }[] = [
  { id: "about", en: "PROFILE" },
  { id: "missions", en: "MISSIONS" },
  { id: "inventory", en: "INVENTORY" },
  { id: "trophies", en: "TROPHIES" },
  { id: "contact", en: "CONTACT" },
];
