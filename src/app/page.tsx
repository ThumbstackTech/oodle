import Nav from "@/components/Nav";
import HeroWorldRemote from "@/components/heroes/HeroWorldRemote";
import OodleThought from "@/components/sections/OodleThought";
import SkillsStrip from "@/components/sections/SkillsStrip";
import OodleDifference from "@/components/sections/OodleDifference";
import OodleStory from "@/components/sections/OodleStory";
import OodleFaq from "@/components/sections/OodleFaq";
import FreebieFactory from "@/components/sections/FreebieFactory";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Nav onDark />
      <main>
        <HeroWorldRemote />
        <OodleThought />
        <SkillsStrip />
        {/* Section 3 (Meet the games, #games) slots in here */}
        <OodleDifference />
        <OodleStory />
        <FreebieFactory />
        <OodleFaq />
        <FinalCta />
        {/* Next: Meet the games (#games), Oodle difference, Behind the Oodle (#story), Freebie Factory (#freebies), Talk Oodle to Me (#contact) */}
      </main>
      <Footer />
    </>
  );
}
