import { Rarity } from '@prisma/client';

/** Single source of truth: rarity is derived from the numeric level. */
export function rarityFromLevel(level: number): Rarity {
  if (level >= 85) return Rarity.legendary;
  if (level >= 70) return Rarity.epic;
  if (level >= 50) return Rarity.rare;
  return Rarity.common;
}
