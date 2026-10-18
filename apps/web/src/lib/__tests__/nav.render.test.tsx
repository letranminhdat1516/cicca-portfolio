import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SiteNav } from "@/components/site/SiteNav";
import { MENU_ID, MobileMenu } from "@/components/site/MobileMenu";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/blog", label: "Blog", current: true },
  { href: "/#contact", label: "Contact", contact: true },
];

describe("mobile nav", () => {
  it("starts closed: burger points at a hidden menu", () => {
    const html = renderToStaticMarkup(<SiteNav />);
    expect(html).toContain('aria-label="Open menu"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain(`aria-controls="${MENU_ID}"`);
    expect(html).toMatch(new RegExp(`id="${MENU_ID}"[^>]*hidden=""`));
    // desktop links are still rendered (CSS hides them on narrow screens)
    expect(html).toContain('class="nav-links"');
    for (const label of ["Work", "Desk", "Experience", "Gallery", "Blog", "Contact"]) expect(html).toContain(`>${label}<`);
  });

  it("Contact opens the dialog in both navs, keeping /#contact as the no-JS href", () => {
    const html = renderToStaticMarkup(<SiteNav />);
    // desktop pill + mobile-menu entry
    const triggers = html.match(/<a [^>]*data-contact-open=""[^>]*>/g) ?? [];
    expect(triggers).toHaveLength(2);
    for (const t of triggers) {
      expect(t).toContain('href="/#contact"');
      expect(t).toContain('aria-haspopup="dialog"');
    }
    // the other links stay plain links
    expect(html).not.toMatch(/href="\/#work"[^>]*data-contact-open/);
  });

  it("open: a numbered, labelled dialog with a close button", () => {
    const html = renderToStaticMarkup(<MobileMenu open onClose={() => {}} links={links} />);
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).not.toMatch(/hidden=""/);
    expect(html).toContain('aria-label="Close menu"');
    expect(html).toMatch(/>01<\/span><span class="t">Work<\/span>/);
    expect(html).toMatch(/>03<\/span><span class="t">Contact<\/span>/);
    expect(html).toContain('aria-current="page"');
  });

  it("closed: same markup, hidden", () => {
    const html = renderToStaticMarkup(<MobileMenu open={false} onClose={() => {}} links={links} />);
    expect(html).toMatch(/hidden=""/);
  });
});
