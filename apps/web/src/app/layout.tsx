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
    default: "Le Tran Minh Dat — AI-Native Full-Stack Developer",
    template: "%s — Le Tran Minh Dat",
  },
  description:
    "AI-native full-stack developer in Ho Chi Minh City. Shipped 6 production systems: a bank LLM gateway, RAG agents, a VAS ERP and real-time computer vision.",
  applicationName: "Le Tran Minh Dat",
  authors: [{ name: "Le Tran Minh Dat", url: SITE_URL }],
  creator: "Le Tran Minh Dat",
  category: "technology",
  openGraph: {
    type: "website",
    siteName: "Le Tran Minh Dat",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: {
    types: { "text/plain": [{ url: "/llms.txt", title: "LLM-readable profile" }] },
  },
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
