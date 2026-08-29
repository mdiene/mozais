/**
 * Règles commerciales partagées entre le client (affichage du panier)
 * et le serveur (recalcul du total à la commande).
 *
 * Volontairement dans un module neutre : la route /api/checkout ne doit
 * pas importer le store Zustand, qui est marqué "use client" et tire
 * localStorage avec lui.
 */

export const FREE_SHIPPING_THRESHOLD = 25000;
export const SHIPPING_FLAT = 2500;
export const MAX_QTY = 99;

export function shippingFor(subtotal: number, hasItems: boolean) {
  if (!hasItems) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}
