import { Hero } from "@/components/hero/Hero";
import { ValueStrip } from "@/components/sections/ValueStrip";
import { CollectionsGrid } from "@/components/sections/CollectionsGrid";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { RitualFeature } from "@/components/sections/RitualFeature";
import { IngredientsRail } from "@/components/sections/IngredientsRail";
import { Testimonials } from "@/components/sections/Testimonials";
import { OriginBlock } from "@/components/sections/OriginBlock";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueStrip />
      <CollectionsGrid />
      <FeaturedProducts />
      <RitualFeature />
      <IngredientsRail />
      <Testimonials />
      <OriginBlock />
    </>
  );
}
