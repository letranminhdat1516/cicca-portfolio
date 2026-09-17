import { CinematicBg } from "@/components/CinematicBg";
import { HudNav } from "@/components/HudNav";
import { CursorFx } from "@/components/CursorFx";
import { Footer } from "@/components/Footer";
import { Tracker } from "@/components/analytics/Tracker";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Tracker />
      <CinematicBg />
      <CursorFx />
      <HudNav />
      <div className="relative z-10">
        {children}
        <Footer />
      </div>
    </>
  );
}
