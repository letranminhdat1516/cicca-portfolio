import { CinematicBg } from "@/components/CinematicBg";
import { HudNav } from "@/components/HudNav";
import { CursorFx } from "@/components/CursorFx";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CinematicBg />
      <CursorFx />
      <HudNav />
      <div className="relative z-10">{children}</div>
    </>
  );
}
