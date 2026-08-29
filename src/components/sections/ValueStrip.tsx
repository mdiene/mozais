import { Reveal } from "@/components/ui/Reveal";

const VALUES = [
  {
    title: "Saponifié à froid",
    detail: "La glycérine naturelle reste dans le pain, au lieu d'être extraite.",
  },
  {
    title: "Karité de Casamance",
    detail: "Acheté en direct aux coopératives de femmes, prix négocié à l'année.",
  },
  {
    title: "Sans huile de palme",
    detail: "Coco, sésame, baobab. Aucun compromis sur l'origine des corps gras.",
  },
  {
    title: "Coulé à Dakar",
    detail: "Petits lots de 400 pains, séchage quatre semaines, numéro de lot visible.",
  },
];

export function ValueStrip() {
  return (
    <section className="border-y border-earth/10 bg-linen-deep">
      <div className="mx-auto grid max-w-[1440px] gap-px bg-earth/10 px-5 py-0 md:px-10 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <Reveal
            key={v.title}
            delay={i * 90}
            className="bg-linen-deep px-1 py-9 lg:px-7"
          >
            <p className="font-display text-[1.4rem] font-light leading-tight text-emerald-deep">
              {v.title}
            </p>
            <p className="mt-2.5 max-w-xs text-[13px] leading-relaxed text-earth-soft">
              {v.detail}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
