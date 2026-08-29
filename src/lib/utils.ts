import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Devise du site. Le Sénégal est en franc CFA (XOF). */
export const CURRENCY = "XOF" as const;

const priceFormatter = new Intl.NumberFormat("fr-SN", {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
});

/** 8500 -> "8 500 F CFA" */
export function formatPrice(amount: number) {
  return priceFormatter.format(amount).replace(/ | /g, " ");
}

/** "01", "02", … pour la numérotation éditoriale des sections. */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}
