import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Missions } from "@/components/Missions";
import { Inventory } from "@/components/Inventory";
import { Trophies } from "@/components/Trophies";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Missions />
      <Inventory />
      <Trophies />
      <Contact />
      <Footer />
    </main>
  );
}
