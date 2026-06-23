import { getPortfolio } from "@/lib/portfolio";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Missions } from "@/components/Missions";
import { Inventory } from "@/components/Inventory";
import { Trophies } from "@/components/Trophies";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default async function Home() {
  const data = await getPortfolio();
  return (
    <main>
      <Hero profile={data.profile} socials={data.socials} />
      <About profile={data.profile} stats={data.stats} counters={data.counters} />
      <Missions missions={data.missions} />
      <Inventory skillGroups={data.skillGroups} />
      <Trophies achievements={data.achievements} />
      <Contact profile={data.profile} socials={data.socials} />
      <Footer />
    </main>
  );
}
