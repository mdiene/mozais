import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/*
 * Boutons MOZAIS.
 * Parti pris : l'or ne remplit jamais un grand bouton — il ne sert qu'en
 * filet, en soulignement ou sur de très petites surfaces. Un aplat doré
 * plein passe du luxe au clinquant en une seconde.
 */
const button = cva(
  [
    "inline-flex items-center justify-center gap-2.5 whitespace-nowrap",
    "font-sans font-medium uppercase",
    "transition-[background-color,color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:translate-y-px",
  ],
  {
    variants: {
      variant: {
        /* Action principale — émeraude plein, filet or au survol. */
        primary:
          "bg-emerald-deep text-linen border border-emerald-deep hover:bg-emerald-mid hover:border-gold",
        /* Action secondaire — filet brun, se remplit d'émeraude. */
        outline:
          "border border-earth/25 text-earth hover:border-emerald-deep hover:bg-emerald-deep hover:text-linen",
        /* Sur fond émeraude. */
        onDark:
          "border border-gold/50 text-gold-pale hover:bg-gold hover:text-emerald-deep hover:border-gold",
        /* Discret — lien habillé. */
        ghost: "text-earth-soft hover:text-earth",
        /* Rare, réservé aux micro-surfaces (badge d'action, puce). */
        gold: "bg-gold text-emerald-deep border border-gold hover:bg-gold-bright",
      },
      size: {
        sm: "h-9 px-4 text-[10px] tracking-[0.2em]",
        md: "h-12 px-7 text-[11px] tracking-[0.22em]",
        lg: "h-14 px-10 text-[11px] tracking-[0.26em]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp ref={ref} className={cn(button({ variant, size }), className)} {...props} />
    );
  },
);
Button.displayName = "Button";

export { button as buttonVariants };
