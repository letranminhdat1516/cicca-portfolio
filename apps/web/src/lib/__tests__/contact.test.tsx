import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactForm } from "@/components/site/ContactForm";
import { ContactButton, ContactDialog } from "@/components/site/ContactDialog";
import { ContactCta } from "@/components/site/ContactCta";
import { CTA } from "@/data/home";
import {
  CONTACT_DIALOG_ID,
  CONTACT_OPEN_ATTR,
  ERROR_TEXT,
  SENT_TEXT,
  SENT_TITLE,
  TOPICS,
  errorMessage,
  isBusy,
  sendContact,
  submitLabel,
  type ContactInput,
} from "@/components/site/contact";
import { portfolio } from "./fixture";

const input: ContactInput = {
  name: "  Ada ",
  email: " ada@example.com ",
  topic: "",
  message: "  Let's build an engine. ",
  website: "",
};
const res = (status: number) => ({ ok: status >= 200 && status < 300, status }) as Response;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("ContactForm", () => {
  const html = renderToStaticMarkup(<ContactForm email="datltmse@gmail.com" onClose={() => {}} />);

  it("has visible labels tied to each field, hints and a full-width submit", () => {
    for (const [label, name] of [
      ["Name", "name"],
      ["Email", "email"],
      ["Message", "message"],
    ]) {
      const m = html.match(new RegExp(`<label for="([^"]+)"[^>]*>${label}</label>`));
      expect(m, label).not.toBeNull();
      expect(html).toMatch(new RegExp(`id="${esc(m![1])}"[^>]*name="${name}"`));
    }
    expect(html).toMatch(/type="email"[^>]*required/);
    expect(html).toMatch(/<textarea[^>]*rows="5"[^>]*minLength="10"[^>]*maxLength="3000"/);
    expect(html).toContain("At least 10 characters.");
    expect(html).toMatch(/<button type="submit"[^>]*>Send message<\/button>/);
    expect(html).not.toContain('role="alert"');
  });

  it("ends with an 'or email me at' mailto line", () => {
    expect(html).toContain('or email me at <a href="mailto:datltmse@gmail.com">datltmse@gmail.com</a>');
    const noMail = renderToStaticMarkup(<ContactForm />);
    expect(noMail).not.toContain("mailto:");
  });

  it("renders the topic as an optional radio group inside a fieldset with a legend", () => {
    const fs = html.match(/<fieldset[^>]*>(.*?)<\/fieldset>/)?.[1] ?? "";
    expect(fs).toMatch(/<legend[^>]*>Topic <span[^>]*>\(optional\)<\/span>/);
    const radios = fs.match(/<input[^>]*type="radio"[^>]*>/g) ?? [];
    expect(radios).toHaveLength(4);
    for (const r of radios) {
      expect(r).toContain('name="topic"');
      expect(r).not.toContain("checked");
      expect(r).not.toContain("required");
    }
    for (const t of TOPICS) {
      expect(fs).toContain(`value="${t.value}"`);
      expect(fs).toContain(t.label);
    }
  });

  it("hides the honeypot from humans and assistive tech without display:none", () => {
    const trap = html.match(/<div class="[^"]*" aria-hidden="true">(.*?)<\/div>/)?.[1] ?? "";
    expect(trap).toContain('name="website"');
    expect(trap).toContain('tabindex="-1"');
    expect(html).not.toContain("display:none");
  });

  it("sending: fields and button disabled, spinner, busy", () => {
    const s = renderToStaticMarkup(<ContactForm initialStatus={{ kind: "sending" }} />);
    expect(s).toContain('aria-busy="true"');
    expect(s).toMatch(/<button type="submit"[^>]*disabled=""[^>]*><span[^>]*aria-hidden="true"><\/span>Sending…<\/button>/);
    expect(s).toMatch(/<fieldset[^>]*disabled=""/);
    expect(s).toMatch(/name="message"[^>]*disabled=""/);
  });

  it("error: inline alert placed above the button", () => {
    const s = renderToStaticMarkup(<ContactForm initialStatus={{ kind: "error", error: "rate_limited" }} />);
    const alertAt = s.indexOf('role="alert"');
    expect(alertAt).toBeGreaterThan(-1);
    expect(alertAt).toBeLessThan(s.indexOf('type="submit"'));
    expect(s).toContain(`${ERROR_TEXT.rate_limited}.`);
  });

  it("sent: the form body is replaced by a success panel with a Close button", () => {
    const s = renderToStaticMarkup(<ContactForm onClose={() => {}} initialStatus={{ kind: "sent" }} />);
    expect(s).not.toContain("<form");
    expect(s).toContain('role="status"');
    expect(s).toContain(`>${SENT_TITLE}</h3>`);
    expect(s).toContain(SENT_TEXT.replace("'", "&#x27;"));
    expect(s).toMatch(/<button type="button"[^>]*>Close<\/button>/);
  });
});

describe("status helpers", () => {
  it("map each state to the busy flag, button label and error text", () => {
    expect(isBusy({ kind: "sending" })).toBe(true);
    expect(isBusy({ kind: "idle" })).toBe(false);
    expect(submitLabel({ kind: "sending" })).toBe("Sending…");
    expect(submitLabel({ kind: "error", error: "network" })).toBe("Send message");
    expect(errorMessage({ kind: "error", error: "network" })).toBe(ERROR_TEXT.network);
    expect(errorMessage({ kind: "idle" })).toBeNull();
  });

  it("uses the agreed success copy", () => {
    expect(SENT_TITLE).toBe("Message sent");
    expect(SENT_TEXT).toBe("Thanks — I'll get back to you soon. A confirmation is on its way to your inbox.");
  });
});

describe("ContactDialog", () => {
  const html = renderToStaticMarkup(<ContactDialog email="datltmse@gmail.com" />);

  it("is a closed native <dialog> labelled by its title and reply-time line", () => {
    expect(html).toMatch(new RegExp(`^<dialog id="${CONTACT_DIALOG_ID}"`));
    expect(html).not.toMatch(/<dialog[^>]* open/);
    expect(html).toContain(`aria-labelledby="${CONTACT_DIALOG_ID}-title"`);
    expect(html).toContain(`aria-describedby="${CONTACT_DIALOG_ID}-sub"`);
    expect(html).toMatch(new RegExp(`<h2[^>]*id="${CONTACT_DIALOG_ID}-title"[^>]*>Let&#x27;s talk</h2>`));
    expect(html).toContain("I usually reply within 1–2 days (GMT+7).");
  });

  it("has an icon close button and contains the form", () => {
    expect(html).toMatch(/<button type="button"[^>]*aria-label="Close"[^>]*><svg aria-hidden="true"/);
    expect(html).toContain("<form");
    expect(html).toContain("or email me at");
  });
});

describe("ContactButton / ContactCta", () => {
  it("is a real link (mailto fallback) that opens the dialog with JS", () => {
    const b = renderToStaticMarkup(<ContactButton email="datltmse@gmail.com" />);
    expect(b).toMatch(/^<a href="mailto:datltmse@gmail.com"/);
    expect(b).toContain(`${CONTACT_OPEN_ATTR}=""`);
    expect(b).toContain('aria-haspopup="dialog"');
    expect(b).toContain(">Contact me<");
    expect(renderToStaticMarkup(<ContactButton />)).toContain('href="/#contact"');
  });

  it("the CTA band shows one Contact me button and no inline form", () => {
    const cta = renderToStaticMarkup(<ContactCta profile={portfolio.profile} socials={portfolio.socials} />);
    expect(cta).toContain('id="contact"');
    expect(cta).toContain(CTA.title);
    expect(cta).not.toContain("<form");
    expect(cta.match(new RegExp(`${CONTACT_OPEN_ATTR}=""`, "g"))).toHaveLength(1);
    expect(cta).toContain(">Contact me<");
  });
});

describe("sendContact", () => {
  it("POSTs trimmed JSON to <base>/contact, without topic when none is chosen", async () => {
    const f = vi.fn(async () => res(200));
    expect(await sendContact(input, f as unknown as typeof fetch, "/api")).toEqual({ ok: true });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Ada",
      email: "ada@example.com",
      message: "Let's build an engine.",
      website: "",
    });
  });

  it("sends the chosen topic key", async () => {
    const f = vi.fn(async () => res(200));
    await sendContact({ ...input, topic: "freelance" }, f as unknown as typeof fetch, "/api");
    const [, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string).topic).toBe("freelance");
  });

  it.each([
    [429, "rate_limited"],
    [503, "not_configured"],
    [400, "invalid"],
    [502, "server"],
    [500, "server"],
  ] as const)("maps HTTP %i to %s", async (status, error) => {
    const out = await sendContact(input, (async () => res(status)) as unknown as typeof fetch, "/api");
    expect(out).toEqual({ ok: false, error });
    expect(ERROR_TEXT[error]).toBeTruthy();
  });

  it("maps a thrown fetch to a network error", async () => {
    const out = await sendContact(input, (async () => { throw new TypeError("offline"); }) as unknown as typeof fetch, "/api");
    expect(out).toEqual({ ok: false, error: "network" });
  });
});
