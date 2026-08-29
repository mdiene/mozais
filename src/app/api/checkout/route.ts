import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getProduct } from "@/lib/products";
import { MAX_QTY, shippingFor } from "@/lib/commerce";
import { sendEmail, FROM, REPLY_TO } from "@/lib/email";
import { OrderConfirmation, type OrderLine } from "@/emails/OrderConfirmation";
import { RitualTips } from "@/emails/RitualTips";

export const runtime = "nodejs";

const PAYMENT_LABELS: Record<string, string> = {
  wave: "Wave — lien de paiement envoyé par SMS",
  "orange-money": "Orange Money — code envoyé sur votre mobile",
  carte: "Carte bancaire",
  livraison: "Paiement à la livraison, en espèces",
};

type IncomingLine = {
  slug?: unknown;
  variantId?: unknown;
  fragranceId?: unknown;
  quantity?: unknown;
};

function reference() {
  return `MZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  const customer = (body.customer ?? {}) as Record<string, string>;
  const address = (body.address ?? {}) as Record<string, string>;
  const incoming = Array.isArray(body.lines) ? (body.lines as IncomingLine[]) : [];

  /* ---------- Validation ---------- */
  if (!customer.firstName?.trim() || !customer.lastName?.trim()) {
    return NextResponse.json({ error: "Nom et prénom sont requis." }, { status: 400 });
  }
  if (!customer.email || !isEmail(customer.email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (!customer.phone?.trim()) {
    return NextResponse.json({ error: "Un numéro de téléphone est requis." }, { status: 400 });
  }
  if (!address.street?.trim() || !address.city?.trim() || !address.region?.trim()) {
    return NextResponse.json({ error: "Adresse de livraison incomplète." }, { status: 400 });
  }
  if (!incoming.length) {
    return NextResponse.json({ error: "Votre panier est vide." }, { status: 400 });
  }

  /* ---------- Reconstruction des prix côté serveur ----------
     Le panier vient du navigateur : ses prix ne sont qu'un affichage.
     On les recalcule depuis le catalogue, sinon n'importe qui peut
     commander à 0 F CFA en éditant le localStorage.               */
  const lines: OrderLine[] = [];

  for (const raw of incoming) {
    const slug = typeof raw.slug === "string" ? raw.slug : "";
    const variantId = typeof raw.variantId === "string" ? raw.variantId : "";
    const quantity = Math.floor(Number(raw.quantity));

    const product = getProduct(slug);
    if (!product) {
      return NextResponse.json({ error: `Produit inconnu : ${slug}` }, { status: 400 });
    }

    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) {
      return NextResponse.json(
        { error: `Format indisponible pour ${product.name}.` },
        { status: 400 },
      );
    }
    if (!variant.inStock) {
      return NextResponse.json(
        { error: `${product.name} (${variant.label}) est épuisé.` },
        { status: 409 },
      );
    }
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QTY) {
      return NextResponse.json(
        { error: `Quantité invalide pour ${product.name}.` },
        { status: 400 },
      );
    }

    const fragrance = product.fragrances?.find((f) => f.id === raw.fragranceId);

    lines.push({
      name: product.name,
      line: product.line,
      variantLabel: variant.label,
      fragranceName: fragrance?.name,
      quantity,
      unitPrice: variant.price,
    });
  }

  const subtotal = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);
  const shipping = shippingFor(subtotal, lines.length > 0);
  const total = subtotal + shipping;

  const ref = reference();
  const paymentKey = typeof body.payment === "string" ? body.payment : "wave";
  const paymentLabel = PAYMENT_LABELS[paymentKey] ?? PAYMENT_LABELS.wave;

  /* ---------- Persistance ----------
     Le point d'accroche pour votre base ou votre back-office : une seule
     écriture à ajouter ici, tout le reste du tunnel est déjà en place. */
  console.info("[mozais/commande]", {
    ref,
    email: customer.email,
    total,
    items: lines.length,
    payment: paymentKey,
  });

  /* ---------- Confirmation immédiate ---------- */
  const confirmation = await sendEmail({
    to: customer.email,
    subject: `Commande ${ref} confirmée — MOZAIS`,
    tags: [{ name: "type", value: "order_confirmation" }],
    react: OrderConfirmation({
      reference: ref,
      firstName: customer.firstName.trim(),
      lines,
      subtotal,
      shipping,
      total,
      address: {
        street: address.street,
        detail: address.detail,
        city: address.city,
        region: address.region,
      },
      paymentLabel,
    }),
  });

  if (!confirmation.ok) {
    // La commande est valide : on ne la rejette pas parce que l'e-mail
    // a échoué. On la renvoie en signalant que la confirmation manque.
    console.error("[mozais/commande] Confirmation non envoyée :", confirmation.error);
  }

  /* ---------- Conseils de rituel, J+7 ---------- */
  await scheduleRitualTips({
    email: customer.email,
    firstName: customer.firstName.trim(),
    slug: typeof incoming[0]?.slug === "string" ? incoming[0].slug : "",
  });

  return NextResponse.json({
    reference: ref,
    total,
    emailSent: confirmation.ok && !("skipped" in confirmation),
  });
}

/**
 * Programme l'e-mail J+7 via l'envoi différé de Resend, ce qui évite
 * d'avoir à faire tourner un planificateur séparé. Sans clé API,
 * l'appel est simplement ignoré.
 */
async function scheduleRitualTips({
  email,
  firstName,
  slug,
}: {
  email: string;
  firstName: string;
  slug: string;
}) {
  const product = getProduct(slug);
  if (!product) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `[mozais/email] J+7 non programmé (clé absente) — ${product.name} pour ${email}.`,
    );
    return;
  }

  const sendAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    await new Resend(apiKey).emails.send({
      from: FROM,
      to: email,
      replyTo: REPLY_TO,
      subject: `${firstName}, une semaine avec votre ${product.name}`,
      scheduledAt: sendAt,
      tags: [{ name: "type", value: "ritual_tips_d7" }],
      react: RitualTips({
        firstName,
        productName: product.name,
        productSlug: product.slug,
        steps: product.ritual,
      }),
    });
  } catch (err) {
    // Un J+7 manquant ne doit jamais faire échouer une commande payée.
    console.error("[mozais/email] Programmation J+7 impossible :", err);
  }
}
