import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête illisible." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "Cette adresse ne semble pas valide." },
      { status: 400 },
    );
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const apiKey = process.env.RESEND_API_KEY;

  /* Sans audience configurée, on journalise et on répond normalement :
     inutile d'afficher une erreur à un visiteur pour une clé manquante
     côté maison. */
  if (!apiKey || !audienceId) {
    console.info(`[mozais/newsletter] Inscription non transmise (config absente) : ${email}`);
    return NextResponse.json({ message: "Bienvenue dans le carnet." });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      // Une adresse déjà inscrite ne doit pas ressembler à un échec.
      console.warn("[mozais/newsletter] Resend :", error.message);
    }
  } catch (err) {
    console.error("[mozais/newsletter] Échec :", err);
    return NextResponse.json(
      { error: "Inscription momentanément indisponible." },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: "Bienvenue dans le carnet." });
}
