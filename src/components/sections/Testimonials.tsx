import { Reveal } from "@/components/ui/Reveal";
import { Stars } from "@/components/ui/Stars";
import { LotusMark } from "@/components/brand/Logo";
import { PRODUCTS } from "@/lib/products";

/** Les trois avis les plus récents du catalogue, tous produits confondus. */
function latestReviews(count: number) {
  return PRODUCTS.flatMap((p) =>
    p.reviews.map((r) => ({ ...r, product: p.name, slug: p.slug })),
  )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count);
}

export function Testimonials() {
  const reviews = latestReviews(3);

  return (
    <section className="border-y border-earth/10 bg-linen-deep py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal className="flex flex-col items-center text-center">
          <LotusMark className="w-10 text-gold" />
          <p className="eyebrow mt-6">Elles l&apos;ont adopté</p>
          <h2 className="mt-4 max-w-2xl font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.05] text-emerald-deep text-balance">
            312 avis vérifiés, une moyenne de 4,8 sur 5.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-px bg-earth/10 md:grid-cols-3">
          {reviews.map((review, i) => (
            <Reveal
              key={`${review.slug}-${review.author}`}
              delay={i * 110}
              className="flex flex-col bg-linen-deep p-8 md:p-10"
            >
              <Stars rating={review.rating} size={13} />
              <blockquote className="mt-5 flex-1 font-display text-[1.45rem] font-light leading-[1.4] text-earth text-pretty">
                « {review.body} »
              </blockquote>
              <footer className="mt-7 border-t border-earth/12 pt-5">
                <p className="text-[13px] font-medium text-earth">
                  {review.author}
                  <span className="font-normal text-earth-muted"> · {review.city}</span>
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-gold">
                  {review.product}
                </p>
                {review.verified && (
                  <p className="mt-2 text-[10.5px] uppercase tracking-[0.16em] text-earth-muted">
                    Achat vérifié
                  </p>
                )}
              </footer>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
