import "server-only";
import { Resend } from "resend";
import type { ReactElement } from "react";

/* ============================================================
   Envoi transactionnel — Resend.

   La clé est facultative. Sans `RESEND_API_KEY`, les envois sont
   simplement journalisés : le tunnel de commande continue de
   fonctionner en développement et une commande n'est jamais perdue
   parce que l'e-mail n'a pas pu partir.
   ============================================================ */

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

export const FROM = process.env.MOZAIS_FROM_EMAIL ?? "MOZAIS <bonjour@mozais.sn>";
export const REPLY_TO = process.env.MOZAIS_REPLY_TO ?? "bonjour@mozais.sn";

export type SendResult =
  | { ok: true; id: string | null; skipped?: true }
  | { ok: false; error: string };

export async function sendEmail({
  to,
  subject,
  react,
  tags,
}: {
  to: string;
  subject: string;
  react: ReactElement;
  tags?: { name: string; value: string }[];
}): Promise<SendResult> {
  if (!resend) {
    console.warn(
      `[mozais/email] RESEND_API_KEY absente — e-mail « ${subject} » non envoyé à ${to}.`,
    );
    return { ok: true, id: null, skipped: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      react,
      replyTo: REPLY_TO,
      tags,
    });

    if (error) {
      console.error("[mozais/email] Resend a refusé l'envoi :", error);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id ?? null };
  } catch (err) {
    console.error("[mozais/email] Échec réseau :", err);
    return { ok: false, error: err instanceof Error ? err.message : "Erreur inconnue" };
  }
}
