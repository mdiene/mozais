import { render } from "@react-email/components";
import { NextResponse } from "next/server";
import { OrderConfirmation } from "@/emails/OrderConfirmation";
import { ShippingNotice } from "@/emails/ShippingNotice";
import { RitualTips } from "@/emails/RitualTips";

export const runtime = "nodejs";

/**
 * Aperçu des e-mails dans le navigateur, avec les données de démonstration
 * déclarées en `PreviewProps` sur chaque gabarit.
 *
 *   /api/emails/preview?template=order
 *   /api/emails/preview?template=shipping
 *   /api/emails/preview?template=ritual
 *
 * Fermé en production : ces pages divulgueraient la mise en page et les
 * exemples de données à n'importe quel visiteur.
 */
const TEMPLATES = {
  order: () => OrderConfirmation(OrderConfirmation.PreviewProps),
  shipping: () => ShippingNotice(ShippingNotice.PreviewProps),
  ritual: () => RitualTips(RitualTips.PreviewProps),
} as const;

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const key = new URL(request.url).searchParams.get("template") ?? "order";
  const template = TEMPLATES[key as keyof typeof TEMPLATES];

  if (!template) {
    return NextResponse.json(
      { error: `Gabarit inconnu. Disponibles : ${Object.keys(TEMPLATES).join(", ")}` },
      { status: 404 },
    );
  }

  const html = await render(template());
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
