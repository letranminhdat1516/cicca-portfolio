import { CinematicBg } from "@/components/CinematicBg";
import { HudNav } from "@/components/HudNav";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <CinematicBg />
      <HudNav />
      <div className="relative z-10">{children}</div>
    </>
  );
}
