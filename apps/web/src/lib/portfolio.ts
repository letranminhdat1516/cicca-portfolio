import type { Portfolio } from "@portfolio/types";
import { apiGet } from "./api";

// Fetch the whole portfolio payload from the NestJS API.
// ISR: re-fetched at most once per 60s; content edits in admin appear within that window.
export async function getPortfolio(): Promise<Portfolio> {
  return apiGet<Portfolio>("/content", { next: { revalidate: 60 } });
}
