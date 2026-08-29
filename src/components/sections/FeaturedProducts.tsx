import { Reveal } from "@/components/ui/Reveal";
import { ProductCard } from "@/components/commerce/ProductCard";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { getFeatured } from "@/lib/products";

export function FeaturedProducts() {
  const products = getFeatured();

  return (
    <section className="bg-linen-deep py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <SectionHeading
          index="02"
          eyebrow="Les incontournables"
          title="Ce que nos clientes rachètent."
          intro="Cinq références qui reviennent, mois après mois, dans les mêmes paniers. C'est le meilleur indicateur que nous ayons."
          href="/boutique"
          hrefLabel="Voir les 10 produits"
        />

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 80}>
              <ProductCard product={product} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
