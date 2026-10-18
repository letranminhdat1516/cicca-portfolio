import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ContactForm } from "@/components/site/ContactForm";
import { ERROR_TEXT, SENT_TEXT, TOPICS, sendContact, type ContactInput } from "@/components/site/contact";

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
  const html = renderToStaticMarkup(<ContactForm email="datltmse@gmail.com" />);

  it("has a heading, the reply-time line and visible labels tied to each field", () => {
    expect(html).toMatch(/<h3[^>]*>Send a message<\/h3>/);
    expect(html).toContain("I usually reply within 1–2 days (GMT+7).");
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
    expect(html).toMatch(/<textarea[^>]*minLength="10"[^>]*maxLength="3000"/);
    expect(html).toContain('placeholder="A few lines about what you have in mind"');
    expect(html).toContain("At least 10 characters.");
    expect(html).toMatch(/<button type="submit"[^>]*>Send message<\/button>/);
    expect(html).toContain('href="mailto:datltmse@gmail.com"');
    expect(html).toContain("or email me directly");
  });

  it("renders the topic as an optional radio group inside a fieldset with a legend", () => {
    const fs = html.match(/<fieldset[^>]*>(.*?)<\/fieldset>/)?.[1] ?? "";
    expect(fs).toMatch(/<legend[^>]*>What&#x27;s it about\?/);
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

  it("uses the agreed success copy", () => {
    expect(SENT_TEXT).toBe("Thanks — your message is on its way. Check your inbox for a confirmation.");
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
