"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   SoapFoamCanvas — mousse de savon réactive au curseur.

   Choix technique : Canvas 2D, pas WebGL. Une simulation fluide
   GPU aurait coûté ~600 ko de bundle (Three.js) pour un rendu
   moins juste : la mousse de savon n'est pas un fluide continu,
   c'est un amas de bulles discrètes. Un système de particules
   avec répulsion douce donne un résultat plus proche du réel,
   tourne à 60 fps sur mobile et se dégrade proprement.

   Physique :
   — le curseur est suivi par un point à inertie (ressort amorti) ;
   — l'émission suit la vitesse de ce point : geste rapide, traînée
     de mousse abondante ; curseur immobile, seule la mousse
     d'ambiance subsiste ;
   — chaque bulle monte (poussée d'Archimède), dérive vers le socle
     du produit, se repousse de ses voisines, puis se résorbe.
   ============================================================ */

type Bubble = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  /** Rayon visé : la bulle « gonfle » à la naissance. */
  rTarget: number;
  age: number;
  life: number;
  hue: number;
  /** Déphasage de l'oscillation, pour que rien ne batte à l'unisson. */
  phase: number;
  ambient: boolean;
};

type Props = {
  className?: string;
  /** Point d'accumulation, en coordonnées normalisées (0-1). */
  focus?: { x: number; y: number };
  /** Densité globale, 1 = référence. */
  density?: number;
};

const TAU = Math.PI * 2;

export function SoapFoamCanvas({
  className,
  focus = { x: 0.5, y: 0.66 },
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
      // Au-delà de 2, le gain visuel est nul et le coût de remplissage double.
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
    const MAX = Math.round((isCoarse ? 110 : 240) * density);
    const AMBIENT = Math.round((isCoarse ? 34 : 62) * density);

    const bubbles: Bubble[] = [];

    /* ---------- Curseur à inertie ---------- */
    // `t` = position réelle du pointeur, `p` = point amorti qui la poursuit.
    const target = { x: w * focus.x, y: h * focus.y, active: false };
    const pointer = { x: target.x, y: target.y, vx: 0, vy: 0, speed: 0 };

    /* On écoute la fenêtre, pas le canvas.

       Le canvas est en `pointer-events: none` et se trouve sous la colonne
       de texte du hero : un écouteur posé dessus ne recevrait rien dès que
       le curseur passe sur le titre ou les boutons, et la mousse se
       figerait au moment précis où l'utilisateur regarde la scène. La
       fenêtre voit tous les mouvements ; on convertit ensuite en
       coordonnées locales et on ne réagit que dans les limites du canvas. */
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

    /* ---------- Fabrique de bulles ---------- */
    const spawn = (x: number, y: number, energy: number, ambient = false) => {
      if (bubbles.length >= MAX) return;
      const rTarget = ambient
        ? 5 + Math.random() * 22
        : 3 + Math.random() * (9 + energy * 13);

      bubbles.push({
        x: x + (Math.random() - 0.5) * (ambient ? 40 : 26),
        y: y + (Math.random() - 0.5) * (ambient ? 26 : 22),
        vx: (Math.random() - 0.5) * 0.5 + (ambient ? 0 : pointer.vx * 0.11),
        vy: (Math.random() - 0.5) * 0.4 + (ambient ? 0 : pointer.vy * 0.11),
        r: rTarget * 0.15,
        rTarget,
        age: 0,
        life: ambient ? 5.5 + Math.random() * 6 : 1.7 + Math.random() * 2.6,
        // Irisation : du doré (46) au vert d'eau (168), la gamme de la marque.
        hue: 44 + Math.random() * 126,
        phase: Math.random() * TAU,
        ambient,
      });
    };

    // Lit de mousse initial, autour du socle produit.
    const seedAmbient = () => {
      for (let i = 0; i < AMBIENT; i++) {
        const a = Math.random() * TAU;
        const d = Math.pow(Math.random(), 0.55) * Math.min(w, h) * 0.3;
        spawn(w * focus.x + Math.cos(a) * d, h * focus.y + Math.sin(a) * d * 0.5, 0, true);
      }
    };
    seedAmbient();

    /* ---------- Rendu d'une bulle ---------- */
    const draw = (b: Bubble) => {
      const t = b.age / b.life;
      // Fondu d'entrée court, résorption longue : une bulle qui éclate
      // disparaît vite, une mousse qui retombe s'affaisse lentement.
      const alpha =
        t < 0.12 ? t / 0.12 : t > 0.62 ? 1 - (t - 0.62) / 0.38 : 1;
      const a = Math.max(0, Math.min(1, alpha)) * (b.ambient ? 0.72 : 0.92);
      if (a <= 0.01 || b.r < 0.4) return;

      const { x, y, r } = b;

      // Corps : blanc crémeux au sommet, quasi transparent au bord.
      const body = ctx.createRadialGradient(
        x - r * 0.34,
        y - r * 0.4,
        r * 0.04,
        x,
        y,
        r,
      );
      body.addColorStop(0, `rgba(255,255,255,${a * 0.94})`);
      body.addColorStop(0.42, `rgba(253,249,243,${a * 0.5})`);
      body.addColorStop(0.82, `rgba(246,240,232,${a * 0.2})`);
      body.addColorStop(1, `rgba(240,232,222,${a * 0.05})`);
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();

      // Film irisé sur le pourtour.
      if (r > 2.2) {
        const rim = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
        rim.addColorStop(0, `hsla(${b.hue},72%,74%,${a * 0.5})`);
        rim.addColorStop(0.45, `hsla(${(b.hue + 60) % 360},48%,86%,${a * 0.14})`);
        rim.addColorStop(1, `hsla(${(b.hue + 116) % 360},64%,70%,${a * 0.42})`);
        ctx.strokeStyle = rim;
        ctx.lineWidth = Math.max(0.55, r * 0.085);
        ctx.beginPath();
        ctx.arc(x, y, r * 0.95, 0, TAU);
        ctx.stroke();
      }

      // Spéculaire — c'est lui qui fait lire « bulle » plutôt que « rond ».
      if (r > 3) {
        ctx.fillStyle = `rgba(255,255,255,${a * 0.8})`;
        ctx.beginPath();
        ctx.ellipse(
          x - r * 0.36,
          y - r * 0.42,
          r * 0.17,
          r * 0.115,
          -0.65,
          0,
          TAU,
        );
        ctx.fill();
      }
    };

    /* ---------- Boucle ---------- */
    let raf = 0;
    let last = performance.now();
    let running = true;
    let emitCarry = 0;

    const step = (now: number) => {
      // Borné : un onglet en arrière-plan revient avec un delta énorme.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, w, h);

      const fx = w * focus.x;
      const fy = h * focus.y;

      /* Curseur amorti — ressort critique, sans rebond. */
      if (!target.active) {
        target.x += (fx - target.x) * 0.015;
        target.y += (fy - target.y) * 0.015;
      }
      const stiffness = 7.5;
      const damping = 0.86;
      pointer.vx = (pointer.vx + (target.x - pointer.x) * stiffness * dt) * damping;
      pointer.vy = (pointer.vy + (target.y - pointer.y) * stiffness * dt) * damping;
      pointer.x += pointer.vx;
      pointer.y += pointer.vy;
      pointer.speed = Math.hypot(pointer.vx, pointer.vy);

      /* Émission : proportionnelle à la vitesse du geste. */
      if (!reduceMotion) {
        const energy = Math.min(pointer.speed / 26, 1);
        const rate = (target.active ? 4 + energy * 52 : 3) * density;
        emitCarry += rate * dt;
        while (emitCarry >= 1) {
          emitCarry -= 1;
          if (target.active && energy > 0.02) {
            spawn(pointer.x, pointer.y, energy);
          } else {
            // Renouvellement lent du lit de mousse.
            const a = Math.random() * TAU;
            const d = Math.pow(Math.random(), 0.55) * Math.min(w, h) * 0.3;
            spawn(fx + Math.cos(a) * d, fy + Math.sin(a) * d * 0.5, 0, true);
          }
        }
      }

      /* Répulsion douce — empêche l'empilement en un seul gros disque. */
      for (let i = 0; i < bubbles.length; i++) {
        const a = bubbles[i];
        for (let j = i + 1; j < bubbles.length; j++) {
          const b = bubbles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const minD = (a.r + b.r) * 0.86;
          const d2 = dx * dx + dy * dy;
          if (d2 > minD * minD || d2 < 0.0001) continue;
          const d = Math.sqrt(d2);
          const push = ((minD - d) / minD) * 0.22;
          const nx = dx / d;
          const ny = dy / d;
          a.vx -= nx * push;
          a.vy -= ny * push;
          b.vx += nx * push;
          b.vy += ny * push;
        }
      }

      /* Intégration */
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.age += dt;

        if (b.age >= b.life) {
          bubbles.splice(i, 1);
          continue;
        }

        // Gonflement à la naissance.
        b.r += (b.rTarget - b.r) * Math.min(1, dt * 7);
        // Résorption : la bulle s'affaisse avant de disparaître.
        const t = b.age / b.life;
        if (t > 0.7) b.r *= 1 - (t - 0.7) * dt * 2.2;

        // Poussée : les grosses bulles montent plus vite.
        b.vy -= (0.008 + b.r * 0.0016) * dt * 60;

        // Dérive vers le socle produit — c'est ce qui fait « s'accumuler
        // la mousse autour du packaging » plutôt que se disperser.
        b.vx += (fx - b.x) * 0.00055 * dt * 60;
        b.vy += (fy - b.y) * 0.00042 * dt * 60;

        // Oscillation latérale, façon mousse qui respire.
        b.vx += Math.sin(now * 0.0011 + b.phase) * 0.014;

        // Amortissement visqueux.
        const drag = b.ambient ? 0.945 : 0.955;
        b.vx *= drag;
        b.vy *= drag;

        b.x += b.vx;
        b.y += b.vy;

        // Rebond mou sur les bords, pour ne rien perdre hors-champ.
        const m = b.r;
        if (b.x < m) {
          b.x = m;
          b.vx = Math.abs(b.vx) * 0.4;
        } else if (b.x > w - m) {
          b.x = w - m;
          b.vx = -Math.abs(b.vx) * 0.4;
        }
        if (b.y < m) {
          b.y = m;
          b.vy = Math.abs(b.vy) * 0.4;
        } else if (b.y > h - m) {
          b.y = h - m;
          b.vy = -Math.abs(b.vy) * 0.4;
        }
      }

      /* Dessin : les grosses derrière, les fines devant. */
      bubbles.sort((a, b) => b.r - a.r);
      for (const b of bubbles) draw(b);

      if (running) raf = requestAnimationFrame(step);
    };

    if (reduceMotion) {
      // Mousse figée : la composition reste, le mouvement disparaît.
      ctx.clearRect(0, 0, w, h);
      for (const b of bubbles) {
        b.r = b.rTarget;
        b.age = b.life * 0.3;
        draw(b);
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
