import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin — PLAYER_01.sys",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a12", color: "#e8e8f0" }}>
      {children}
    </div>
  );
}
