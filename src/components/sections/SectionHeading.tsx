import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * En-tête de section éditoriale : numéro, sur-titre, titre serif, et
 * éventuel lien de fuite à droite. La numérotation donne au site son
 * rythme de magazine.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  href,
  hrefLabel = "Tout voir",
  align = "left",
  onDark = false,
  className,
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  href?: string;
  hrefLabel?: string;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <p
          className={cn(
            "eyebrow flex items-center gap-3",
            align === "center" && "justify-center",
            onDark ? "text-gold/80" : "text-earth-soft",
          )}
        >
          {index && (
            <span className={onDark ? "text-gold" : "text-gold"}>{index}</span>
          )}
          <span className="h-px w-8 bg-current opacity-40" aria-hidden="true" />
          {eyebrow}
        </p>

        <h2
          className={cn(
            "mt-5 font-display text-[clamp(2.1rem,4.4vw,3.5rem)] font-light leading-[1.02] text-balance",
            onDark ? "text-linen" : "text-emerald-deep",
          )}
        >
          {title}
        </h2>

        {intro && (
          <p
            className={cn(
              "mt-5 max-w-xl text-[15px] leading-[1.75] text-pretty",
              align === "center" && "mx-auto",
              onDark ? "text-linen/60" : "text-earth-soft",
            )}
          >
            {intro}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors",
            onDark
              ? "text-gold hover:text-gold-pale"
              : "text-earth-soft hover:text-emerald-deep",
          )}
        >
          {hrefLabel}
          <ArrowRight
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5"
          />
        </Link>
      )}
    </Reveal>
  );
}
