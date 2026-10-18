import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { LetterForm } from "@/components/site/LetterForm";
import { ERROR_TEXT, sendLetter } from "@/components/site/letter";

const input = { name: "  Ada ", email: " ada@example.com ", message: "  Let's build an engine. ", website: "" };
const res = (status: number) => ({ ok: status >= 200 && status < 300, status }) as Response;

describe("LetterForm", () => {
  const html = renderToStaticMarkup(<LetterForm email="datltmse@gmail.com" />);

  it("reads as a letter with real labels on every blank", () => {
    expect(html).toContain("Dear Dat,");
    for (const [phrase, hint, name] of [
      ["I am", "(your name)", "name"],
      ["reach me at", "(your email)", "email"],
      ["and I&#x27;d like to talk about", "(your message)", "message"],
    ]) {
      const m = html.match(new RegExp(`<label for="([^"]+)"[^>]*>${phrase}<span[^>]*> ${hint.replace(/[()]/g, "\\$&")}</span></label>`));
      expect(m, phrase).not.toBeNull();
      expect(html).toMatch(new RegExp(`id="${m![1]}"[^>]*name="${name}"`));
    }
    expect(html).toMatch(/type="email"[^>]*required/);
    expect(html).toMatch(/<textarea[^>]*minLength="10"[^>]*maxLength="3000"/);
    expect(html).toContain("Send the letter");
  });

  it("hides the honeypot from humans and assistive tech without display:none", () => {
    const trap = html.match(/<div class="[^"]*" aria-hidden="true">(.*?)<\/div>/)?.[1] ?? "";
    expect(trap).toContain('name="website"');
    expect(trap).toContain('tabindex="-1"');
    expect(html).not.toContain("display:none");
  });
});

describe("sendLetter", () => {
  it("POSTs trimmed JSON to <base>/contact", async () => {
    const f = vi.fn(async () => res(200));
    expect(await sendLetter(input, f as unknown as typeof fetch, "/api")).toEqual({ ok: true });
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

  it.each([
    [429, "rate_limited"],
    [503, "not_configured"],
    [400, "invalid"],
    [502, "server"],
    [500, "server"],
  ] as const)("maps HTTP %i to %s", async (status, error) => {
    const out = await sendLetter(input, (async () => res(status)) as unknown as typeof fetch, "/api");
    expect(out).toEqual({ ok: false, error });
    expect(ERROR_TEXT[error]).toBeTruthy();
  });

  it("maps a thrown fetch to a network error", async () => {
    const out = await sendLetter(input, (async () => { throw new TypeError("offline"); }) as unknown as typeof fetch, "/api");
    expect(out).toEqual({ ok: false, error: "network" });
  });
});
