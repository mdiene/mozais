import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

const INGREDIENTS = [
  {
    name: "Karité",
    latin: "Vitellaria paradoxa",
    origin: "Casamance, Sénégal",
    role: "Le corps gras de référence de la maison. Non raffiné, il garde ses insaponifiables — la fraction qui répare réellement la barrière cutanée. C'est aussi ce qui lui donne son odeur de noisette fumée, que nous ne masquons pas.",
    hue: "bg-gold-wash",
  },
  {
    name: "Baobab",
    latin: "Adansonia digitata",
    origin: "Ferlo, Sénégal",
    role: "Une huile sèche, rare : elle pénètre sans laisser de film. Riche en oméga 3-6-9, elle scelle l'hydratation sur peau humide et redonne du glissement aux cheveux crépus.",
    hue: "bg-linen-shade",
  },
  {
    name: "Soufre",
    latin: "Sulfur",
    origin: "Minéral purifié",
    role: "Kératolytique doux, connu depuis l'Antiquité pour les peaux à imperfections. Il désincruste les pores et régule le sébum. Son odeur franche est le signe qu'il est présent en quantité utile.",
    hue: "bg-gold-wash",
  },
  {
    name: "Neem",
    latin: "Azadirachta indica",
    origin: "Niayes, Sénégal",
    role: "L'arbre à pharmacie du Sahel. Assainissant sur la peau comme sur le cuir chevelu, il calme les inflammations. Puissant, donc à doser — jamais pur sur le visage.",
    hue: "bg-emerald-wash",
  },
];

export function IngredientsRail() {
  return (
    <section id="ingredients" className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <SectionHeading
        index="04"
        eyebrow="Les matières"
        title="Quatre plantes font tout le travail."
        intro="Nos listes INCI sont courtes par choix. Un actif dosé à 0,1 % pour figurer sur l'étiquette n'a jamais soigné personne."
      />

      <div className="mt-14 grid gap-px bg-earth/10 md:grid-cols-2">
        {INGREDIENTS.map((ing, i) => (
          <Reveal
            key={ing.name}
            delay={i * 100}
            className={`${ing.hue} p-8 md:p-10 lg:p-12`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-[2.6rem] font-light leading-none text-emerald-deep md:text-[3.2rem]">
                {ing.name}
              </h3>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-earth-muted">
                {ing.origin}
              </span>
            </div>
            <p className="mt-2 font-display text-base italic text-earth-soft">
              {ing.latin}
            </p>
            <div className="rule-gold my-6" />
            <p className="max-w-md text-[13.5px] leading-[1.75] text-earth-soft text-pretty">
              {ing.role}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
