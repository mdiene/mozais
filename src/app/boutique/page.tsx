import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/ProductCard";
import { CatalogFilters, type SortId } from "@/components/commerce/CatalogFilters";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/button";
import {
  PRODUCTS,
  allConcerns,
  averageRating,
  fromPrice,
  getCategory,
  type Product,
} from "@/lib/products";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Savons saponifiés à froid, soins capillaires afro, huiles pressées à froid et skincare naturel. Dix références formulées et coulées à Dakar.",
};

type SearchParams = Promise<{
  categorie?: string;
  besoin?: string;
  tri?: string;
}>;

function sortProducts(list: Product[], sort: SortId) {
  const copy = [...list];
  switch (sort) {
    case "prix-asc":
      return copy.sort((a, b) => fromPrice(a) - fromPrice(b));
    case "prix-desc":
      return copy.sort((a, b) => fromPrice(b) - fromPrice(a));
    case "note":
      return copy.sort(
        (a, b) =>
          averageRating(b) - averageRating(a) || b.reviews.length - a.reviews.length,
      );
    default:
      // « Les plus adoptés » : mis en avant d'abord, puis volume d'avis.
      return copy.sort(
        (a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
          b.reviews.length - a.reviews.length,
      );
  }
}

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categorie, besoin, tri } = await searchParams;
  const category = categorie ? getCategory(categorie) : undefined;

  let products = PRODUCTS;
  if (category) products = products.filter((p) => p.category === category.slug);
  if (besoin) products = products.filter((p) => p.skinConcerns.includes(besoin));
  products = sortProducts(products, (tri as SortId) ?? "populaire");

  /* Fil d'Ariane et liste ordonnée — mêmes libellés que le <nav> et la
     grille plus bas, jamais une copie qui pourrait diverger. */
  const breadcrumb = breadcrumbJsonLd([
    { name: "Accueil", href: "/" },
    { name: "Boutique", href: "/boutique" },
    ...(category
      ? [{ name: category.name, href: `/boutique?categorie=${category.slug}` }]
      : []),
  ]);
  const itemList = itemListJsonLd(
    products.map((p) => ({ name: p.name, href: `/produits/${p.slug}`, image: p.image })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      {/* En-tête de collection */}
      <header className="relative overflow-hidden bg-linen">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 12% 0%, rgba(228,200,140,0.26) 0%, rgba(251,248,245,0) 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[1440px] px-5 pb-14 pt-16 md:px-10 md:pb-16 md:pt-24">
          <nav aria-label="Fil d'Ariane" className="text-[11px] tracking-[0.14em] text-earth-muted">
            <Link href="/" className="link-draw hover:text-earth">
              Accueil
            </Link>
            <span className="mx-2">/</span>
            <Link href="/boutique" className="link-draw hover:text-earth">
              Boutique
            </Link>
            {category && (
              <>
                <span className="mx-2">/</span>
                <span className="text-earth">{category.name}</span>
              </>
            )}
          </nav>

          <h1 className="mt-6 max-w-3xl font-display text-[clamp(2.6rem,6vw,4.6rem)] font-light leading-[0.98] text-emerald-deep text-balance">
            {category ? category.title : "Toute la boutique"}
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-earth-soft text-pretty">
            {category
              ? category.blurb
              : "Dix références, pas une de plus. Chacune existe parce qu'un besoin réel n'était pas couvert — jamais pour étoffer une gamme."}
          </p>
        </div>
      </header>

      {/* useSearchParams impose une frontière Suspense en rendu statique. */}
      <Suspense fallback={<div className="h-[3.9rem] border-y border-earth/10" />}>
        <CatalogFilters concerns={allConcerns()} />
      </Suspense>

      {/* Grille */}
      <section className="mx-auto max-w-[1440px] px-5 py-14 md:px-10 md:py-20">
        <p className="mb-10 text-[11px] uppercase tracking-[0.2em] text-earth-muted">
          {products.length} produit{products.length > 1 ? "s" : ""}
          {besoin && (
            <>
              {" · "}
              <span className="text-earth">{besoin}</span>
            </>
          )}
        </p>

        {products.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <p className="font-display text-3xl font-light text-earth">
              Aucun produit pour cette combinaison.
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-earth-soft">
              Essayez un autre besoin, ou parcourez l&apos;ensemble du catalogue —
              il ne compte que dix références.
            </p>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/boutique">Voir tout</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-14 md:gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={Math.min(i, 6) * 70}>
                {/* Un seul candidat LCP par page : prioriser plusieurs
                    images à la fois dilue le signal au lieu de le
                    concentrer sur celle qui compte réellement. */}
                <ProductCard product={product} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
