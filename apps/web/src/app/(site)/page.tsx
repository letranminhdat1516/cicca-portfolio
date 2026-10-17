import type { Metadata } from "next";
import { getPortfolio } from "@/lib/portfolio";
import { buildHomeMetadata } from "@/lib/seo";
import { buildFaq } from "@/lib/faq";
import { JsonLd, homeJsonLd } from "@/components/seo/JsonLd";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { DomainsMarquee } from "@/components/site/DomainsMarquee";
import { SelectedWork } from "@/components/site/SelectedWork";
import { Desk } from "@/components/site/Desk";
import { Experience } from "@/components/site/Experience";
import { Recognition } from "@/components/site/Recognition";
import { Gallery } from "@/components/site/Gallery";
import { ContactCta } from "@/components/site/ContactCta";
import { Beam } from "@/components/site/ui";

// Rendered per request (content fetches are cached 60s) so the image build
// never needs a live API.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  return buildHomeMetadata(data);
}

export default async function Home() {
  const data = await getPortfolio();
  return (
    <main>
      <JsonLd data={homeJsonLd(data)} />
      <Hero profile={data.profile} />
      <About profile={data.profile} />
      <DomainsMarquee />
      <SelectedWork missions={data.missions} />
      <Beam />
      <Desk />
      <Beam />
      <Experience experiences={data.experiences} />
      <Recognition achievements={data.achievements} />
      <Beam />
      <Gallery />
      <Faq faqs={buildFaq(data)} />
      <ContactCta profile={data.profile} socials={data.socials} />
    </main>
  );
}
