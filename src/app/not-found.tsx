import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LotusMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
      <LotusMark className="w-14 text-gold/40" />
      <p className="eyebrow mt-8">Erreur 404</p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4rem)] font-light leading-[1] text-emerald-deep text-balance">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-earth-soft text-pretty">
        Le lien est peut-être ancien, ou le produit n&apos;est plus au
        catalogue. La boutique ne compte que dix références — vous y retrouverez
        vite votre chemin.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/boutique">Voir la boutique</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
