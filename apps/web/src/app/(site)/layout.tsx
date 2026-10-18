import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Tracker } from "@/components/analytics/Tracker";
import { ContactDialog } from "@/components/site/ContactDialog";
import { getPortfolio } from "@/lib/portfolio";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Same cached fetch the pages make; only the email is needed (the dialog's mailto line).
  const email = (await getPortfolio().catch(() => null))?.profile.email || undefined;
  return (
    // overflow-x: clip (not hidden) so the sticky nav keeps working.
    <div className="site" style={{ background: "#03061A", color: "#E8EEFF", overflowX: "clip", minHeight: "100vh" }}>
      <Tracker />
      <SiteNav />
      {children}
      <SiteFooter />
      <ContactDialog email={email} />
    </div>
  );
}
