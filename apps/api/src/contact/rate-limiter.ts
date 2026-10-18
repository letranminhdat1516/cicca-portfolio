export interface RateWindow {
  /** Window length in milliseconds. */
  ms: number;
  /** Max accepted hits inside the window. */
  max: number;
}

export type RateResult = { ok: true } | { ok: false; retryAfterSec: number };

/**
 * Tiny in-memory sliding-window limiter, keyed by client IP. One API replica,
 * so process memory is enough; counts reset on restart, which is acceptable
 * for a contact form.
 */
export class RateLimiter {
  private hits = new Map<string, number[]>();
  private readonly longest: number;

  constructor(
    private readonly windows: RateWindow[],
    private readonly now: () => number = Date.now,
    private readonly maxKeys = 10_000,
  ) {
    this.longest = Math.max(...windows.map((w) => w.ms));
  }

  /** Record a hit for `key` if every window has room; otherwise refuse it. */
  take(key: string): RateResult {
    const t = this.now();
    const list = (this.hits.get(key) ?? []).filter((h) => t - h < this.longest);

    let retryAfterMs = 0;
    for (const w of this.windows) {
      const inWindow = list.filter((h) => t - h < w.ms);
      if (inWindow.length >= w.max) {
        // The oldest hit in this window has to expire before another fits.
        const oldest = inWindow[inWindow.length - w.max];
        retryAfterMs = Math.max(retryAfterMs, oldest + w.ms - t);
      }
    }
    if (retryAfterMs > 0) {
      this.hits.set(key, list);
      return { ok: false, retryAfterSec: Math.ceil(retryAfterMs / 1000) };
    }

    list.push(t);
    this.hits.set(key, list);
    if (this.hits.size > this.maxKeys) this.prune(t);
    return { ok: true };
  }

  private prune(t: number) {
    for (const [k, list] of this.hits) {
      if (!list.some((h) => t - h < this.longest)) this.hits.delete(k);
    }
    // Still too many live keys: drop the oldest-inserted ones.
    for (const k of this.hits.keys()) {
      if (this.hits.size <= this.maxKeys) break;
      this.hits.delete(k);
    }
  }
}
