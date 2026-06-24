import type { Metadata } from "next";
import { getPortfolio } from "@/lib/portfolio";
import { buildHomeMetadata } from "@/lib/seo";
import { JsonLd, homeJsonLd } from "@/components/seo/JsonLd";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Missions } from "@/components/Missions";
import { Inventory } from "@/components/Inventory";
import { GithubRecord } from "@/components/GithubRecord";
import { Trophies } from "@/components/Trophies";
import { Experiences } from "@/components/Experiences";
import { Resources } from "@/components/Resources";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolio();
  return buildHomeMetadata(data);
}

export default async function Home() {
  const data = await getPortfolio();
  return (
    <main>
      <JsonLd data={homeJsonLd(data)} />
      <Hero profile={data.profile} socials={data.socials} />
      <About profile={data.profile} stats={data.stats} counters={data.counters} />
      <Missions missions={data.missions} />
      <Inventory skillGroups={data.skillGroups} />
      <GithubRecord github={data.github} />
      <Trophies achievements={data.achievements} />
      <Experiences experiences={data.experiences} />
      <Resources resources={data.resources} />
      <Contact profile={data.profile} socials={data.socials} />
      <Footer />
    </main>
  );
}
