// Contact form client logic, kept free of React so it can be unit-tested.

/** Same public API base the browser already uses (Tracker, admin): /api via the rewrite in prod. */
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/** Topic keys accepted by the API (ContactDto.topic); labels are what the pills show. */
export const TOPICS = [
  { value: "job", label: "Job opportunity" },
  { value: "freelance", label: "Freelance project" },
  { value: "collab", label: "Collaboration" },
  { value: "hello", label: "Just saying hi" },
] as const;
export type Topic = (typeof TOPICS)[number]["value"];

export type ContactInput = { name: string; email: string; topic: Topic | ""; message: string; website: string };

export type ContactError = "rate_limited" | "not_configured" | "invalid" | "network" | "server";
export type ContactOutcome = { ok: true } | { ok: false; error: ContactError };

export const LIMITS = { name: 80, email: 120, messageMin: 10, messageMax: 3000 } as const;

export async function sendContact(
  input: ContactInput,
  fetchImpl: typeof fetch = fetch,
  base: string = API_BASE,
): Promise<ContactOutcome> {
  let res: Response;
  try {
    res = await fetchImpl(`${base}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim(),
        // Optional: omitted entirely when no pill is chosen.
        ...(input.topic ? { topic: input.topic } : {}),
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

export const ERROR_TEXT: Record<ContactError, string> = {
  rate_limited: "Too many messages in a short while. Please try again in a few minutes",
  not_configured: "The contact form is offline for a moment, so your message couldn't be sent",
  invalid: "Something didn't look right: check your name, a valid email, and a message of at least 10 characters",
  network: "Your message couldn't be sent (network error). Please try again",
  server: "Something went wrong on my side and the message wasn't sent. Please try again",
};

export const SENT_TITLE = "Message sent";
export const SENT_TEXT = "Thanks — I'll get back to you soon. A confirmation is on its way to your inbox.";

/** Form lifecycle; the view is a pure function of this so each state is testable. */
export type ContactStatus = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; error: ContactError };

export const isBusy = (s: ContactStatus) => s.kind === "sending";
export const submitLabel = (s: ContactStatus) => (s.kind === "sending" ? "Sending…" : "Send message");
export const errorMessage = (s: ContactStatus): string | null => (s.kind === "error" ? ERROR_TEXT[s.error] : null);

/**
 * Any link or button carrying this attribute opens the contact dialog instead of
 * following its href (the href stays a real fallback: mailto: or /#contact).
 */
export const CONTACT_OPEN_ATTR = "data-contact-open";
export const CONTACT_DIALOG_ID = "contact-dialog";
