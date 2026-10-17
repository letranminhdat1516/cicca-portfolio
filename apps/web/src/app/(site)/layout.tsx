import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Tracker } from "@/components/analytics/Tracker";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // overflow-x: clip (not hidden) so the sticky nav keeps working.
    <div className="site" style={{ background: "#03061A", color: "#E8EEFF", overflowX: "clip", minHeight: "100vh" }}>
      <Tracker />
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  );
}
