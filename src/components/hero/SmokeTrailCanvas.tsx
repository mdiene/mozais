"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   SmokeTrailCanvas — volute d'encens réactive au curseur.

   Deuxième version : la première étirait chaque particule le long de
   son vecteur vitesse, pensant qu'une bulle ronde ne pouvait pas lire
   comme de la fumée. À l'usage c'était l'inverse — les filets orientés
   avaient l'air de traits, pas de fumée. Un repère fourni (un simple
   dégradé radial qui grossit et s'efface, sans rotation ni étirement)
   a montré que le réalisme vient d'ailleurs : des ronds nombreux, très
   doux, qui grossissent lentement et se recouvrent. On y revient ici,
   en gardant du premier jet ce qui restait juste : le filet d'ambiance
   continu, l'émission proportionnelle au geste, la pause hors écran.

   Physique, volontairement simple :
   — chaque volute est un cercle au dégradé très progressif (centre
     plein, bord totalement transparent), jamais un bord net ;
   — elle grossit tout au long de sa vie, sans plafond — c'est la
     diffusion qui fait la fumée, pas la forme ;
   — elle monte et dérive doucement sur le côté, sans virage brusque ;
   — beaucoup de volutes superposées, chacune très diaphane : c'est
     leur recouvrement qui doit lire comme un nuage continu.
   ============================================================ */

type Wisp = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  age: number;
  life: number;
  hue: number;
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
    const MAX = Math.round((isCoarse ? 90 : 170) * density);
    const AMBIENT_RATE = (isCoarse ? 3 : 4.5) * density;

    const wisps: Wisp[] = [];

    /* ---------- Curseur à inertie ---------- */
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

      wisps.push({
        x: x + (Math.random() - 0.5) * (ambient ? 12 : 20),
        y: y + (Math.random() - 0.5) * 10,
        // Dérive latérale légère et constante — pas de virage, juste
        // un léger désaxement, comme de l'air qui n'est jamais parfaitement
        // immobile.
        vx: (Math.random() - 0.5) * 0.5,
        // Monte toujours, lentement — la vitesse ne s'emballe pas.
        vy: -(0.35 + Math.random() * 0.4) - (ambient ? 0 : energy * 0.25),
        r: (ambient ? 10 : 8) + Math.random() * (ambient ? 14 : 12 + energy * 10),
        age: 0,
        life: ambient ? 5 + Math.random() * 3.5 : 3.2 + Math.random() * 2.4,
        // Gris-ambré très désaturé — proche du repère fourni (blanc-gris),
        // teinté juste assez pour rester dans la gamme de la maison.
        hue: 30 + Math.random() * 12,
        ambient,
      });
    };

    /* ---------- Rendu d'une volute ----------
       Un seul dégradé radial, sans rotation ni étirement : un centre
       plein qui se perd très progressivement vers la transparence.
       C'est la multiplication de cercles très doux qui se recouvrent
       qui donne l'impression de nuage, pas la forme de chacun. */
    const draw = (wisp: Wisp) => {
      const t = wisp.age / wisp.life;
      // Apparition rapide, dissolution longue.
      const alpha = t < 0.15 ? t / 0.15 : t > 0.35 ? 1 - (t - 0.35) / 0.65 : 1;
      const a = Math.max(0, Math.min(1, alpha)) * (wisp.ambient ? 0.22 : 0.3);
      if (a <= 0.006 || wisp.r < 0.5) return;

      const { x, y, r } = wisp;
      const body = ctx.createRadialGradient(x, y, 0, x, y, r);
      body.addColorStop(0, `hsla(${wisp.hue}, 14%, 92%, ${a})`);
      body.addColorStop(0.35, `hsla(${wisp.hue}, 12%, 86%, ${a * 0.7})`);
      body.addColorStop(0.7, `hsla(${wisp.hue}, 10%, 78%, ${a * 0.28})`);
      body.addColorStop(1, `hsla(${wisp.hue}, 8%, 70%, 0)`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
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
        const rate = AMBIENT_RATE + (target.active ? energy * 22 : 0);
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

        // Diffusion continue, sans plafond — la fumée s'étale tant
        // qu'elle existe, elle ne s'arrête pas de grandir en chemin.
        wisp.r += dt * (wisp.ambient ? 5 : 7);

        // Amortissement doux — la vitesse ne s'emballe jamais, elle se
        // stabilise, comme un filet qui monte à rythme presque constant.
        wisp.vx *= 0.99;
        wisp.vy *= 0.995;

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
      for (let i = 0; i < 14; i++) {
        spawn(fx0 + (Math.random() - 0.5) * 16, fy0 - i * (h * 0.035) - Math.random() * 10, 0, true);
      }
      for (const wisp of wisps) {
        wisp.age = wisp.life * 0.3;
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
