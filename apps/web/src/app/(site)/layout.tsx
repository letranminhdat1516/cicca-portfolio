import { CinematicBg } from "@/components/CinematicBg";
import { HudNav } from "@/components/HudNav";
import { CursorFx } from "@/components/CursorFx";
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
      <div className="relative z-10">{children}</div>
    </>
  );
}
