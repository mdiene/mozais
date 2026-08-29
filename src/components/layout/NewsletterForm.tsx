"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

type Status = "idle" | "loading" | "done" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Inscription impossible.");
      setStatus("done");
      setMessage(data.message ?? "Bienvenue dans le carnet.");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Inscription impossible.");
    }
  }

  if (status === "done") {
    return (
      <div
        className="flex items-start gap-3 border border-gold/30 bg-gold/5 px-5 py-5"
        role="status"
      >
        <Check size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold" />
        <div>
          <p className="text-sm text-linen">{message}</p>
          <p className="mt-1 text-[12px] text-linen/50">
            Le premier carnet arrive dans les prochains jours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label htmlFor="newsletter-email" className="sr-only">
        Votre adresse e-mail
      </label>
      <div className="flex items-center border-b border-gold/40 focus-within:border-gold">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="vous@exemple.com"
          autoComplete="email"
          className="w-full bg-transparent py-3.5 text-sm text-linen placeholder:text-linen/30 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group flex shrink-0 items-center gap-2 py-3.5 pl-4 text-[11px] font-medium uppercase tracking-[0.22em] text-gold transition-colors hover:text-gold-pale disabled:opacity-50"
        >
          {status === "loading" ? "Envoi" : "S'inscrire"}
          <ArrowRight
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
          />
        </button>
      </div>

      {status === "error" && (
        <p className="mt-3 text-[12px] text-gold-pale" role="alert">
          {message}
        </p>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-linen/35">
        Désinscription en un clic. Votre adresse ne quitte jamais la maison.
      </p>
    </form>
  );
}
