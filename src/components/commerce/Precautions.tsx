"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, TriangleAlert } from "lucide-react";

/**
 * Encart de précautions d'usage — replié par défaut, distinct du rituel.
 *
 * Les avertissements de dilution vivaient jusqu'ici informellement dans les
 * étapes du rituel (ex. huile essentielle de neem : « Toujours diluer »
 * mêlé aux gestes du quotidien). Rien ne garantissait qu'un futur produit
 * à risque n'oublie pas ces lignes. Ce composant leur donne un emplacement
 * fixe, visuellement à part — jamais noyé dans le flux des gestes.
 */
export function Precautions({ items }: { items: string[] }) {
  return (
    <Accordion.Root type="single" collapsible className="mt-8 border border-gold/45 bg-gold-wash/50">
      <Accordion.Item value="precautions">
        <Accordion.Header>
          <Accordion.Trigger className="group flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
            <span className="flex items-center gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-emerald-deep">
              <TriangleAlert size={15} strokeWidth={1.5} className="shrink-0 text-gold" aria-hidden="true" />
              Précautions d&apos;usage
            </span>
            <ChevronDown
              size={15}
              strokeWidth={1.5}
              className="shrink-0 text-earth-soft transition-transform duration-300 group-data-[state=open]:rotate-180"
              aria-hidden="true"
            />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="overflow-hidden px-5 data-[state=closed]:animate-[accordion-up_250ms_ease-out] data-[state=open]:animate-[accordion-down_250ms_ease-out]">
          <ul className="space-y-2 pb-5">
            {items.map((item) => (
              <li key={item} className="text-[13px] leading-relaxed text-earth-soft">
                {item}
              </li>
            ))}
          </ul>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}
