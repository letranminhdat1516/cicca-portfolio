import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";

const orbitron = Orbitron({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lê Trần Minh Đạt — Creative Developer & AI Engineer",
    template: "%s — Lê Trần Minh Đạt",
  },
  description:
    "Creative full-stack & AI developer building production AI agents (Claude Agent SDK, RAG), real-time systems, and full-stack web apps — from trading to ERP.",
  openGraph: {
    type: "website",
    siteName: "Lê Trần Minh Đạt",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
