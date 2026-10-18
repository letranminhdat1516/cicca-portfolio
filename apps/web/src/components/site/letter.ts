// Contact "letter" client logic, kept free of React so it can be unit-tested.

/** Same public API base the browser already uses (Tracker, admin): /api via the rewrite in prod. */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type LetterInput = { name: string; email: string; message: string; website: string };

export type LetterError = "rate_limited" | "not_configured" | "invalid" | "network" | "server";
export type LetterOutcome = { ok: true } | { ok: false; error: LetterError };

export const LIMITS = { name: 80, email: 120, messageMin: 10, messageMax: 3000 } as const;

export async function sendLetter(
  input: LetterInput,
  fetchImpl: typeof fetch = fetch,
  base: string = API_BASE,
): Promise<LetterOutcome> {
  let res: Response;
  try {
    res = await fetchImpl(`${base}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim(),
        message: input.message.trim(),
        website: input.website,
      }),
    });
  } catch {
    return { ok: false, error: "network" };
  }
  if (res.ok) return { ok: true };
  if (res.status === 429) return { ok: false, error: "rate_limited" };
  if (res.status === 503) return { ok: false, error: "not_configured" };
  if (res.status === 400) return { ok: false, error: "invalid" };
  return { ok: false, error: "server" };
}

export const ERROR_TEXT: Record<LetterError, string> = {
  rate_limited: "That's a lot of letters in a short while. Please try again in a few minutes",
  not_configured: "My mailbox is offline for a moment, so the letter couldn't go out",
  invalid: "Something in the letter didn't look right: check your name, a valid email, and a message of at least 10 characters",
  network: "The letter got lost on the way (network error). Please try again",
  server: "The post office hiccupped and the letter wasn't sent. Please try again",
};

export const SENT_TEXT = "Letter sent — check your inbox for a reply from me.";
