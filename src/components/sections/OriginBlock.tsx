import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { LotusMark } from "@/components/brand/Logo";

const FIGURES = [
  { value: "2019", label: "Premier pain coulé" },
  { value: "400", label: "Pains par lot, pas un de plus" },
  { value: "28", label: "Jours de séchage minimum" },
  { value: "9", label: "Coopératives partenaires" },
];

export function OriginBlock() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
        {/* Panneau signature */}
        <Reveal>
          <div className="relative flex aspect-4/5 flex-col items-center justify-center overflow-hidden bg-emerald-deep p-10 text-center lg:aspect-square">
            <div className="grain absolute inset-0" aria-hidden="true" />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 55% at 50% 32%, rgba(212,175,55,0.20) 0%, rgba(27,48,34,0) 70%)",
              }}
            />
            <div className="relative">
              <LotusMark className="mx-auto w-20" />
              <p className="mt-8 font-display text-[clamp(1.7rem,3vw,2.4rem)] font-light leading-tight text-linen">
                Made with love
                <br />
                in Senegal
              </p>
              <div className="rule-gold mx-auto mt-7 w-32" />
              <p className="mt-7 max-w-xs text-[13px] leading-relaxed text-linen/55">
                Atelier de Golf Nord, Guédiawaye. Chaque pain porte son
                numéro de lot et sa date de coulage.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Récit */}
        <div>
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-gold">05</span>
              <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
              La maison
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-light leading-[1.02] text-emerald-deep text-balance">
              Née d&apos;un refus :
              <br />
              celui des savons éclaircissants.
            </h2>
            <div className="mt-7 space-y-5 text-[15px] leading-[1.8] text-earth-soft text-pretty">
              <p>
                MOZAIS a commencé dans une cuisine de Dakar, en 2019, parce
                qu&apos;il devenait impossible de trouver un savon efficace
                contre les imperfections qui ne promette pas, en même temps, de
                « clarifier le teint ».
              </p>
              <p>
                Nous avons pris le problème par l&apos;autre bout : traiter la
                cause — un excès de sébum, une inflammation, une barrière
                cutanée abîmée — et laisser la peau retrouver son éclat propre.
                Aucune de nos formules ne contient d&apos;agent éclaircissant,
                et aucune n&apos;en contiendra.
              </p>
              <p>
                Sept ans plus tard, la méthode n&apos;a pas changé :
                saponification à froid, petits lots, matières premières
                achetées en direct aux coopératives de femmes de Casamance et du
                Ferlo.
              </p>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <dl className="mt-12 grid grid-cols-2 gap-px border border-earth/10 bg-earth/10 sm:grid-cols-4">
              {FIGURES.map((f) => (
                <div key={f.label} className="bg-linen p-5">
                  <dt className="font-display text-3xl font-light text-emerald-deep">
                    {f.value}
                  </dt>
                  <dd className="mt-1.5 text-[11.5px] leading-snug text-earth-soft">
                    {f.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={220} className="mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/maison">Lire notre histoire</Link>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
