import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Leaf, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { AddToCart } from "@/components/commerce/AddToCart";
import { Precautions } from "@/components/commerce/Precautions";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import {
  PRODUCTS,
  averageRating,
  fromPrice,
  getCategory,
  getProduct,
} from "@/lib/products";
import { formatPrice, CURRENCY } from "@/lib/utils";
import { breadcrumbJsonLd } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produit introuvable" };

  return {
    title: `${product.name} — ${product.tagline}`,
    description: product.description.slice(0, 158),
    openGraph: {
      title: `${product.name} · MOZAIS`,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

const REASSURANCE = [
  { icon: Truck, label: "Expédié sous 24 h depuis Dakar" },
  { icon: ShieldCheck, label: "Sans agent éclaircissant, jamais" },
  { icon: Leaf, label: "Saponifié à froid, sans huile de palme" },
  { icon: PackageCheck, label: "Numéro de lot sur chaque unité" },
];

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const rating = averageRating(product);
  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const related = PRODUCTS.filter(
    (p) => p.slug !== product.slug && p.category === product.category,
  )
    .concat(PRODUCTS.filter((p) => p.slug !== product.slug && p.featured))
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 4);

  /* Données structurées — indispensables pour les extraits enrichis Google. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: gallery,
    brand: { "@type": "Brand", name: "MOZAIS" },
    countryOfOrigin: "SN",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: CURRENCY,
      lowPrice: fromPrice(product),
      highPrice: Math.max(...product.variants.map((v) => v.price)),
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.inStock)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(product.reviews.length && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount: product.reviews.length,
      },
      review: product.reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.author },
        datePublished: r.date,
        reviewRating: { "@type": "Rating", ratingValue: r.rating },
        reviewBody: r.body,
      })),
    }),
  };

  /* Fil d'Ariane — mêmes libellés et mêmes chemins que le <nav> plus bas,
     jamais une copie qui pourrait diverger. */
  const breadcrumb = breadcrumbJsonLd([
    { name: "Accueil", href: "/" },
    { name: "Boutique", href: "/boutique" },
    ...(category
      ? [{ name: category.name, href: `/boutique?categorie=${category.slug}` }]
      : []),
    { name: product.name, href: `/produits/${product.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      {/* — Achat — */}
      <section className="mx-auto max-w-[1440px] px-5 pt-10 md:px-10 md:pt-14">
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
              <Link
                href={`/boutique?categorie=${category.slug}`}
                className="link-draw hover:text-earth"
              >
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Galerie */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-4/5 overflow-hidden bg-linen-deep">
              <Image
                src={gallery[0]}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {gallery.map((src, i) => (
                  <div
                    key={src + i}
                    className="relative aspect-square overflow-hidden bg-linen-deep"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="lg:pt-4">
            {product.line && (
              <p className="text-[10px] uppercase tracking-[0.26em] text-gold">
                {product.line}
              </p>
            )}
            <h1 className="mt-2 font-display text-[clamp(2.4rem,5vw,3.8rem)] font-light leading-[1] text-emerald-deep text-balance">
              {product.name}
            </h1>
            <p className="mt-3 text-[15px] text-earth-soft">{product.tagline}</p>

            {rating > 0 && (
              <a href="#avis" className="mt-4 inline-flex items-center gap-2.5">
                <Stars rating={rating} size={13} />
                <span className="link-draw text-[12.5px] text-earth-soft">
                  {rating.toString().replace(".", ",")} · {product.reviews.length} avis
                  vérifiés
                </span>
              </a>
            )}

            <div className="rule-gold mt-7" />

            <p className="mt-7 text-[15px] leading-[1.8] text-earth-soft text-pretty">
              {product.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {product.skinConcerns.map((c) => (
                <Link
                  key={c}
                  href={`/boutique?besoin=${encodeURIComponent(c)}`}
                  className="border border-earth/18 px-3 py-1.5 text-[11px] text-earth-soft transition-colors hover:border-emerald-deep hover:text-emerald-deep"
                >
                  {c}
                </Link>
              ))}
            </div>

            <AddToCart product={product} />

            <ul className="mt-10 grid gap-3 border-t border-earth/10 pt-7 sm:grid-cols-2">
              {REASSURANCE.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-2.5 text-[12.5px] text-earth-soft">
                  <Icon size={15} strokeWidth={1.25} className="mt-0.5 shrink-0 text-gold" />
                  {label}
                </li>
              ))}
            </ul>

            {product.precautions && <Precautions items={product.precautions} />}
          </div>
        </div>
      </section>

      {/* — Principes actifs — */}
      <section className="mt-24 bg-emerald-deep py-20 text-linen md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal>
            <p className="eyebrow text-gold/80">Ce qu&apos;il y a dedans</p>
            <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05] text-linen text-balance">
              Les principes actifs, et ce qu&apos;ils font vraiment.
            </h2>
          </Reveal>

          <dl className="mt-14 grid gap-px bg-gold/15 md:grid-cols-3">
            {product.actives.map((active, i) => (
              <Reveal
                key={active.name}
                delay={i * 100}
                className="bg-emerald-deep p-8 md:p-10"
              >
                <dt>
                  <span className="font-display text-[2rem] font-light leading-tight text-gold-pale">
                    {active.name}
                  </span>
                  {active.latin && (
                    <span className="mt-1 block font-display text-sm italic text-linen/45">
                      {active.latin}
                    </span>
                  )}
                </dt>
                <dd className="mt-5 text-[13.5px] leading-relaxed text-linen/60">
                  {active.role}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* — Geste — */}
      {product.lifestyle && (
        <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-28">
          <Reveal className="flex flex-col items-center text-center">
            <p className="eyebrow">Le geste</p>
            <div className="relative mt-8 aspect-4/5 w-full max-w-md overflow-hidden">
              <Image
                src={product.lifestyle.image}
                alt={product.lifestyle.alt}
                fill
                sizes="(min-width: 768px) 28rem, 90vw"
                className="object-cover"
              />
            </div>
            <p className="mt-8 max-w-md font-display text-2xl font-light italic leading-snug text-earth text-balance">
              {product.lifestyle.caption}
            </p>
          </Reveal>
        </section>
      )}

      {/* — Rituel — */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="eyebrow">Le rituel</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05] text-emerald-deep text-balance">
            Comment l&apos;utiliser, geste par geste.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-px bg-earth/10 md:grid-cols-2 lg:grid-cols-4">
          {product.ritual.map((step, i) => (
            <Reveal
              key={step.title}
              as="li"
              delay={i * 90}
              className="bg-linen p-8 md:p-9"
            >
              <span className="font-display text-4xl font-light leading-none text-gold/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 font-display text-[1.6rem] font-light leading-tight text-earth">
                {step.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-earth-soft">
                {step.detail}
              </p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* — Avis — */}
      <section id="avis" className="border-y border-earth/10 bg-linen-deep py-24 md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">Les retours</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05] text-emerald-deep">
                Ce qu&apos;elles en disent.
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-display text-5xl font-light text-emerald-deep tabular-nums">
                {rating.toString().replace(".", ",")}
              </span>
              <div>
                <Stars rating={rating} size={15} />
                <p className="mt-1.5 text-[11.5px] text-earth-soft">
                  {product.reviews.length} avis vérifiés
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-px bg-earth/10 md:grid-cols-3">
            {product.reviews.map((review, i) => (
              <Reveal
                key={review.author + review.date}
                delay={i * 100}
                className="flex flex-col bg-linen-deep p-8"
              >
                <div className="flex items-center justify-between gap-3">
                  <Stars rating={review.rating} size={12} />
                  <time
                    dateTime={review.date}
                    className="text-[11px] text-earth-muted tabular-nums"
                  >
                    {new Date(review.date).toLocaleDateString("fr-FR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <blockquote className="mt-5 flex-1 text-[14.5px] leading-[1.75] text-earth text-pretty">
                  « {review.body} »
                </blockquote>
                <footer className="mt-6 border-t border-earth/12 pt-4 text-[12.5px]">
                  <span className="font-medium text-earth">{review.author}</span>
                  <span className="text-earth-muted"> · {review.city}</span>
                  {review.verified && (
                    <span className="mt-1 block text-[10.5px] uppercase tracking-[0.16em] text-gold">
                      Achat vérifié
                    </span>
                  )}
                </footer>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* — À associer — */}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-28">
          <Reveal>
            <p className="eyebrow">Compléter le rituel</p>
            <h2 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-light leading-[1.05] text-emerald-deep">
              À associer avec {product.name}.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Repli : prix visible pour les moteurs même sans JavaScript. */}
      <p className="sr-only">
        {product.name} à partir de {formatPrice(fromPrice(product))}.
      </p>
    </>
  );
}
