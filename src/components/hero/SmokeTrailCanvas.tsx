"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   SmokeTrailCanvas — volute d'encens réactive au curseur.

   Sœur de SoapFoamCanvas.tsx : même moteur (particules, curseur à
   inertie, pause hors écran), physique différente. La mousse
   s'accumule autour d'un socle ; la fumée, elle, ne fait que monter
   et se dissiper — pas d'accumulation, pas de répulsion entre
   particules (la fumée ne se repousse pas comme des bulles), une
   dérive latérale qui s'amplifie avec l'altitude pour lire comme une
   volute plutôt qu'une pluie de points qui remonte en ligne droite.

   Physique :
   — un filet d'ambiance monte en continu depuis la base (un bâtonnet
     ou un charbon hors champ) ;
   — passer le curseur dans la scène ajoute des volutes le long du
     geste, comme la main qui trouble la fumée ;
   — chaque particule accélère en montant, dérive de plus en plus au
     fil de son ascension, grossit légèrement puis se dissout.
   ============================================================ */

type Wisp = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  rTarget: number;
  age: number;
  life: number;
  hue: number;
  /** Déphasage de la dérive, pour que rien ne batte à l'unisson. */
  phase: number;
  /** Fréquence propre de la dérive — chaque volute ondule à son rythme. */
  freq: number;
  ambient: boolean;
};

type Props = {
  className?: string;
  /** Point d'émission (base du bâtonnet), en coordonnées normalisées (0-1). */
  focus?: { x: number; y: number };
  /** Densité globale, 1 = référence. */
  density?: number;
};

const TAU = Math.PI * 2;

export function SmokeTrailCanvas({
  className,
  focus = { x: 0.5, y: 0.92 },
  density = 1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Dimensionnement ---------- */
    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    /* ---------- Réglages ---------- */
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const MAX = Math.round((isCoarse ? 90 : 190) * density);
    const AMBIENT_RATE = (isCoarse ? 2.2 : 3.4) * density;

    const wisps: Wisp[] = [];

    /* ---------- Curseur à inertie (identique à SoapFoamCanvas) ---------- */
    const target = { x: w * focus.x, y: h * focus.y, active: false };
    const pointer = { x: target.x, y: target.y, vx: 0, vy: 0, speed: 0 };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside) {
        target.x = x;
        target.y = y;
        target.active = true;
      } else {
        target.active = false;
      }
    };
    const onPointerLeave = () => {
      target.active = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave, { passive: true });

    /* ---------- Fabrique de volutes ---------- */
    const spawn = (x: number, y: number, energy: number, ambient = false) => {
      if (wisps.length >= MAX) return;
      const rTarget = ambient ? 4 + Math.random() * 10 : 3 + Math.random() * (6 + energy * 9);

      wisps.push({
        x: x + (Math.random() - 0.5) * (ambient ? 10 : 22),
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.3 + (ambient ? 0 : pointer.vx * 0.08),
        // Monte toujours : vitesse verticale initiale négative.
        vy: -(0.25 + Math.random() * 0.35) - (ambient ? 0 : energy * 0.3),
        r: rTarget * 0.25,
        rTarget,
        age: 0,
        life: ambient ? 4.5 + Math.random() * 3.5 : 2.6 + Math.random() * 2.2,
        // Gris-ambré : de la braise (28°) au gris-fumée neutre (24°, faible saturation).
        hue: 26 + Math.random() * 14,
        phase: Math.random() * TAU,
        freq: 0.6 + Math.random() * 0.9,
        ambient,
      });
    };

    /* ---------- Rendu d'une volute ---------- */
    const draw = (wisp: Wisp) => {
      const t = wisp.age / wisp.life;
      // Apparition rapide, dissolution longue — la fumée s'efface en
      // s'étirant, elle ne disparaît jamais d'un coup.
      const alpha = t < 0.1 ? t / 0.1 : t > 0.45 ? 1 - (t - 0.45) / 0.55 : 1;
      const a = Math.max(0, Math.min(1, alpha)) * (wisp.ambient ? 0.34 : 0.46);
      if (a <= 0.008 || wisp.r < 0.4) return;

      const { x, y, r } = wisp;

      const body = ctx.createRadialGradient(x, y, 0, x, y, r);
      body.addColorStop(0, `hsla(${wisp.hue}, 22%, 88%, ${a})`);
      body.addColorStop(0.5, `hsla(${wisp.hue}, 16%, 76%, ${a * 0.55})`);
      body.addColorStop(1, `hsla(${wisp.hue}, 10%, 60%, 0)`);
      ctx.fillStyle = body;

      // Légèrement étirée à la verticale : une volute, pas une bulle.
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.82, r * 1.15, 0, 0, TAU);
      ctx.fill();
    };

    /* ---------- Boucle ---------- */
    let raf = 0;
    let last = performance.now();
    let running = true;
    let emitCarry = 0;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, w, h);

      const fx = w * focus.x;
      const fy = h * focus.y;

      /* Curseur amorti. */
      if (!target.active) {
        target.x += (fx - target.x) * 0.02;
        target.y += (fy - target.y) * 0.02;
      }
      const stiffness = 7.5;
      const damping = 0.86;
      pointer.vx = (pointer.vx + (target.x - pointer.x) * stiffness * dt) * damping;
      pointer.vy = (pointer.vy + (target.y - pointer.y) * stiffness * dt) * damping;
      pointer.x += pointer.vx;
      pointer.y += pointer.vy;
      pointer.speed = Math.hypot(pointer.vx, pointer.vy);

      /* Émission : un filet d'ambiance continu, plus une traînée sous
         le geste quand le curseur est dans la scène. */
      if (!reduceMotion) {
        const energy = Math.min(pointer.speed / 22, 1);
        const rate = AMBIENT_RATE + (target.active ? energy * 30 : 0);
        emitCarry += rate * dt;
        while (emitCarry >= 1) {
          emitCarry -= 1;
          if (target.active && energy > 0.03) {
            spawn(pointer.x, pointer.y, energy);
          } else {
            spawn(fx, fy, 0, true);
          }
        }
      }

      /* Intégration — pas de répulsion : la fumée se traverse. */
      for (let i = wisps.length - 1; i >= 0; i--) {
        const wisp = wisps[i];
        wisp.age += dt;

        if (wisp.age >= wisp.life) {
          wisps.splice(i, 1);
          continue;
        }

        wisp.r += (wisp.rTarget - wisp.r) * Math.min(1, dt * 5);
        // Diffusion : grossit doucement tout au long de la montée.
        wisp.r += dt * 3.5;

        const t = wisp.age / wisp.life;

        // Accélère en montant — l'air chaud prend de la vitesse.
        wisp.vy -= (0.35 + t * 0.5) * dt;

        // Dérive latérale qui s'amplifie avec l'altitude parcourue :
        // c'est ce qui fait « onduler » la volute plutôt que monter
        // droit comme une colonne de bulles.
        const drift = Math.sin(now * 0.0009 * wisp.freq + wisp.phase) * (0.5 + t * 1.8);
        wisp.vx += drift * dt * 6;

        // Amortissement — la fumée d'ambiance se disperse plus vite
        // que la traînée tirée par le geste.
        const drag = wisp.ambient ? 0.985 : 0.99;
        wisp.vx *= drag;
        wisp.vy *= drag;

        wisp.x += wisp.vx;
        wisp.y += wisp.vy;
      }

      for (const wisp of wisps) draw(wisp);

      if (running) raf = requestAnimationFrame(step);
    };

    if (reduceMotion) {
      // Volute figée : quelques particules statiques, pas de mouvement.
      ctx.clearRect(0, 0, w, h);
      const fx0 = w * focus.x;
      const fy0 = h * focus.y;
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * TAU;
        spawn(fx0 + Math.cos(a) * 6, fy0 - i * (h * 0.03) - Math.random() * 10, 0, true);
      }
      for (const wisp of wisps) {
        wisp.r = wisp.rTarget;
        wisp.age = wisp.life * 0.35;
        draw(wisp);
      }
    } else {
      raf = requestAnimationFrame(step);
    }

    /* ---------- Économie : rien ne tourne hors écran ---------- */
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (reduceMotion) return;
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(step);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.01 },
    );
    visibility.observe(canvas);

    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduceMotion) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [focus.x, focus.y, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none h-full w-full", className)}
    />
  );
}
