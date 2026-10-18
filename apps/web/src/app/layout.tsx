import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE_URL, alternatesFor } from "@/lib/seo";
import { BOTH_NAMES, IDENTITY } from "@/lib/identity";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600"],
});
// Legacy faces still used by the admin CMS only; preload off so the public
// pages never download them.
const orbitron = Orbitron({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  preload: false,
});
const spaceGrotesk = Space_Grotesk({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // 65 chars with both name forms: the Vietnamese spelling is what local
    // searchers type, the ASCII one what everyone else does.
    default: `${BOTH_NAMES} — ${IDENTITY.jobTitle}`,
    template: `%s — ${IDENTITY.name}`,
  },
  description: `${IDENTITY.jobTitle} in Ho Chi Minh City (${IDENTITY.nativeName}). I build AI agents and the backend they run on: LLM gateways, RAG, voice agents.`,
  applicationName: IDENTITY.name,
  // Renders <meta name="author"> on every page that does not override it.
  authors: [{ name: IDENTITY.name, url: SITE_URL }],
  creator: IDENTITY.name,
  publisher: IDENTITY.name,
  category: "technology",
  openGraph: {
    type: "website",
    siteName: IDENTITY.name,
    url: SITE_URL,
    locale: "en_US",
    alternateLocale: ["vi_VN"],
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { types: alternatesFor("/").types },
};

export const viewport: Viewport = { themeColor: "#03061A", colorScheme: "dark" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
