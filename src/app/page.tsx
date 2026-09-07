import { Cta } from "@/components/sections/cta";
import { ExperiencePreview } from "@/components/sections/experience-preview";
import { GlobalNetwork } from "@/components/sections/global-network";
import { Hero } from "@/components/sections/hero";
import { IndustriesStrip } from "@/components/sections/industries-strip";
import { ServicesOverview } from "@/components/sections/services-overview";
import { Stats } from "@/components/sections/stats";
import { WhyTekko } from "@/components/sections/why-tekko";

export default function HomePage() {
  return (
    <>
      <Hero />
      <IndustriesStrip />
      <ServicesOverview />
      <Stats />
      <GlobalNetwork />
      <ExperiencePreview />
      <WhyTekko />
      <Cta />
    </>
  );
}
