"use client";

import Matter from "matter-js";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type RefObject } from "react";
import { sayings, toys, type ToyPiece } from "@/content/site";
import Oodle, { OODLE_SIZES } from "../ui/Oodle";
import SpeechBubble from "../ui/SpeechBubble";
import { Particle } from "../portal/particles";
import { Block, Coin, GameCard, Token } from "./pieces";

const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter;

// Collision categories: pieces fall *through* the headline on the way in, then start colliding with it.
const CAT_WORLD = 0x0001;
const CAT_TEXT = 0x0002;
const CAT_PIECE = 0x0004;
const FALLING = { category: CAT_PIECE, mask: CAT_WORLD | CAT_PIECE };
const LANDED = { category: CAT_PIECE, mask: CAT_WORLD | CAT_PIECE | CAT_TEXT };

type Dims = { w: number; h: number };

/** Visual size of each piece at scale s. */
function dims(p: ToyPiece, s: number): Dims {
  switch (p.kind) {
    case "oodle": {
      const [iw, ih] = OODLE_SIZES[p.world][p.shape];
      const h = 182 * p.size * s;
      return { w: (h * iw) / ih, h };
    }
    case "coin":
      return { w: 80 * s, h: 80 * s };
    case "token":
      return { w: 58 * s, h: 58 * s };
    case "card": {
      const w = 126 * s;
      return { w, h: (w * 88) / 63 };
    }
    case "icon": {
      const w = 64 * (p.size ?? 1) * s;
      return { w, h: w };
    }
    case "block":
      return { w: Math.max(160, (96 + p.label.length * 13) * s), h: Math.max(66, 98 * s) };
  }
}

function makeBody(p: ToyPiece, d: Dims, x: number, y: number) {
  const common = { friction: 0.5, frictionStatic: 0.8, frictionAir: 0.012, sleepThreshold: 50 };
  if (p.kind === "coin" || p.kind === "token") {
    return Bodies.circle(x, y, d.w / 2, { ...common, restitution: 0.45, density: 0.0018 });
  }
  if (p.kind === "card") {
    return Bodies.rectangle(x, y, d.w, d.h, { ...common, restitution: 0.25, density: 0.0012, chamfer: { radius: d.w * 0.09 } });
  }
  if (p.kind === "icon") {
    const round = p.icon === "coin" || p.icon === "gear" || p.icon === "star" || p.icon === "cloud";
    return round
      ? Bodies.circle(x, y, d.w * 0.44, { ...common, restitution: 0.4, density: 0.0016 })
      : Bodies.rectangle(x, y, d.w * 0.84, d.h * 0.84, { ...common, restitution: 0.3, density: 0.0015, chamfer: { radius: d.w * 0.18 } });
  }
  if (p.kind === "block") {
    return Bodies.rectangle(x, y, d.w, d.h, { ...common, friction: 0.7, restitution: 0.18, density: 0.0016, chamfer: { radius: d.h * 0.22 } });
  }
  // Oodles: a rounded box a little inside the artwork so props can overlap neighbours.
  const bw = d.w * 0.8;
  const bh = d.h * 0.86;
  return Bodies.rectangle(x, y, bw, bh, {
    ...common,
    restitution: 0.3,
    density: 0.0014,
    chamfer: { radius: Math.min(bw, bh) * 0.34 },
  });
}

type Bubble = { index: number; text: string } | null;

export default function ToyBox({
  heroRef,
  pieces = toys,
  trigger = "load",
  clipY = true,
  threshold = 0.35,
}: {
  heroRef: RefObject<HTMLElement | null>;
  pieces?: ToyPiece[];
  /** "visible": hold the drop until the play area scrolls into view */
  trigger?: "load" | "visible";
  /** false: pieces may hang below the box (e.g. resting on tapes just under it) */
  clipY?: boolean;
  /** how much of the box must be visible before the drop starts (trigger="visible") */
  threshold?: number;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const pieceEls = useRef<(HTMLDivElement | null)[]>([]);
  const bubbleEl = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [bubble, setBubble] = useState<Bubble>(null);
  const bubbleRef = useRef<Bubble>(null);
  const sayCount = useRef<Record<number, number>>({});

  useEffect(() => {
    const hero = heroRef.current;
    const layer = layerRef.current;
    if (!hero || !layer) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let engine: Matter.Engine | null = null;
    let bodies: Matter.Body[] = [];
    let sizes: Dims[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let drag: { constraint: Matter.Constraint; index: number; x0: number; y0: number; t0: number; moved: boolean } | null = null;
    let builtWidth = 0;
    let zoneTop = 0;
    const cleanups: (() => void)[] = [];

    const render = () => {
      bodies.forEach((b, i) => {
        const el = pieceEls.current[i];
        if (!el) return;
        const { w, h } = sizes[i];
        el.style.transform = `translate3d(${b.position.x - w / 2}px, ${b.position.y - h / 2}px, 0) rotate(${b.angle}rad)`;
      });
      const bub = bubbleRef.current;
      if (bub && bubbleEl.current && bodies[bub.index]) {
        const b = bodies[bub.index];
        const top = b.bounds.min.y;
        bubbleEl.current.style.transform = `translate3d(${b.position.x}px, ${top - 10}px, 0)`;
      }
    };

    const STEP = 1000 / 60;
    let last = 0;
    let acc = 0;
    const loop = (t: number) => {
      if (!engine) return;
      if (!last) last = t;
      acc += Math.min(t - last, 64);
      last = t;
      while (acc >= STEP) {
        Engine.update(engine, STEP);
        acc -= STEP;
      }
      bodies.forEach((b, i) => {
        if (b.collisionFilter.mask === FALLING.mask && b.position.y - sizes[i].h / 2 > zoneTop) b.collisionFilter = { ...LANDED, group: 0 };
      });
      // Rescue anything flung out of bounds.
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      bodies.forEach((b) => {
        if (b.position.y > H + 600 || b.position.x < -300 || b.position.x > W + 300) {
          Body.setPosition(b, { x: W / 2, y: -100 });
          Body.setVelocity(b, { x: 0, y: 0 });
        }
      });
      render();
      const allAsleep = bodies.every((b) => b.isSleeping);
      if (!visible || (allAsleep && !drag && !bubbleRef.current)) {
        running = false;
        last = 0;
        acc = 0;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || disposed || !engine) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const build = (settle: boolean) => {
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
      const W = hero.clientWidth;
      const H = hero.clientHeight;
      builtWidth = W;
      const s = Math.min(Math.max(W / 1440, 0.56), 1.1, Math.max(H / 900, 0.6));
      setScale(s);

      engine = Engine.create({ enableSleeping: true, positionIterations: 8, velocityIterations: 6 });
      engine.gravity.y = 1.1;

      const heroBox = hero.getBoundingClientRect();
      const statics: Matter.Body[] = [
        Bodies.rectangle(W / 2, (hero.querySelector("[data-floor]") ? H + 260 : H) + 60, W * 3, 120, { isStatic: true }),
        Bodies.rectangle(-60, H / 2 - 1500, 120, H + 3000, { isStatic: true }),
        Bodies.rectangle(W + 60, H / 2 - 1500, 120, H + 3000, { isStatic: true }),
      ];
      zoneTop = 0;
      // Tilted floors (e.g. the skill tapes): the wrapper is unrotated, the tilt comes from data-angle,
      // so the physics surface matches the band exactly and toys settle along it.
      hero.querySelectorAll<HTMLElement>("[data-floor]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const angle = (Number(el.dataset.angle ?? 0) * Math.PI) / 180;
        statics.push(
          Bodies.rectangle(r.left - heroBox.left + r.width / 2, r.top - heroBox.top + r.height / 2, r.width, r.height, {
            isStatic: true,
            angle,
            friction: 0.9,
            frictionStatic: 1,
          }),
        );
      });

      // Text colliders: one box per row, each stretched down to meet the next row so nothing can wedge between lines.
      const rows = [...hero.querySelectorAll<HTMLElement>("[data-collider]")]
        .map((el) => el.getBoundingClientRect())
        .filter((r) => r.width && r.height)
        .map((r) => ({ l: r.left - heroBox.left, t: r.top - heroBox.top, r: r.right - heroBox.left, b: r.bottom - heroBox.top }))
        .sort((p, q) => p.t - q.t);
      rows.forEach((row, i) => {
        const next = rows[i + 1];
        const bottom = next ? Math.max(row.b, next.t + 2) : row.b;
        const w = row.r - row.l;
        const h = bottom - row.t;
        zoneTop = Math.max(zoneTop, row.b + 8);
        statics.push(
          Bodies.rectangle(row.l + w / 2, row.t + h / 2, w, h, {
            isStatic: true,
            chamfer: { radius: Math.min(14, h / 3) },
            collisionFilter: { category: CAT_TEXT, mask: CAT_PIECE, group: 0 },
          }),
        );
      });

      sizes = pieces.map((p) => dims(p, s));
      bodies = pieces.map((p, i) => {
        const x = Math.min(Math.max(p.drop * W, sizes[i].w), W - sizes[i].w);
        const y = -160 - i * 85;
        const b = makeBody(p, sizes[i], x, y);
        b.collisionFilter = { ...FALLING, group: 0 };
        Body.setAngle(b, ((i * 37) % 60) * (Math.PI / 180) - 0.5);
        return b;
      });
      Composite.add(engine.world, [...statics, ...bodies]);

      if (settle) {
        for (let i = 0; i < 420; i++) Engine.update(engine, STEP);
      }
      render();
      layer.style.visibility = "visible";
      start();
    };

    // --- Pointer: grab, drag, throw, tap ---
    const toWorld = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onDown = (index: number) => (e: PointerEvent) => {
      if (!engine || drag) return;
      e.preventDefault();
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);
      el.style.cursor = "grabbing";
      const body = bodies[index];
      const p = toWorld(e);
      Sleeping.set(body, false);
      // While held (and until it drops back below the text), a piece passes over the headline.
      body.collisionFilter = { ...FALLING, group: 0 };
      const constraint = Constraint.create({
        pointA: p,
        bodyB: body,
        pointB: { x: p.x - body.position.x, y: p.y - body.position.y },
        stiffness: 0.18,
        damping: 0.08,
        length: 0,
      });
      Composite.add(engine.world, constraint);
      drag = { constraint, index, x0: e.clientX, y0: e.clientY, t0: performance.now(), moved: false };
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6) drag.moved = true;
      drag.constraint.pointA = toWorld(e);
    };
    const onUp = () => {
      if (!drag || !engine) return;
      const el = pieceEls.current[drag.index];
      if (el) el.style.cursor = "";
      Composite.remove(engine.world, drag.constraint);
      const body = bodies[drag.index];
      const v = body.velocity;
      const speed = Math.hypot(v.x, v.y);
      if (speed > 32) Body.setVelocity(body, { x: (v.x / speed) * 32, y: (v.y / speed) * 32 });

      const tapped = !drag.moved && performance.now() - drag.t0 < 300;
      const index = drag.index;
      drag = null;
      if (tapped) {
        const piece = pieces[index];
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: -10 - Math.random() * 3 });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
        if (piece.kind === "oodle") {
          const lines = sayings[`${piece.world}-${piece.shape}`];
          const n = sayCount.current[index] ?? 0;
          sayCount.current[index] = n + 1;
          setBubble({ index, text: lines[n % lines.length] });
        }
      }
      start();
    };

    pieceEls.current.forEach((el, i) => {
      if (!el) return;
      const down = onDown(i);
      el.addEventListener("pointerdown", down);
      cleanups.push(() => el.removeEventListener("pointerdown", down));
    });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    cleanups.push(() => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    });

    // Pause when off-screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(hero);
    cleanups.push(() => io.disconnect());

    // Rebuild on meaningful width changes (pre-settled, no re-drop).
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (!disposed && Math.abs(hero.clientWidth - builtWidth) > 40) build(true);
      }, 250);
    });
    ro.observe(hero);
    cleanups.push(() => {
      ro.disconnect();
      window.clearTimeout(resizeTimer);
    });

    // Wait for fonts so headline colliders are measured at their final size.
    const begin = () =>
      document.fonts.ready.then(() => {
        if (!disposed) requestAnimationFrame(() => build(reduce));
      });
    if (trigger === "visible") {
      const gate = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gate.disconnect();
            begin();
          }
        },
        { threshold },
      );
      gate.observe(hero);
      cleanups.push(() => gate.disconnect());
    } else {
      begin();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((c) => c());
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
    };
  }, [heroRef, pieces, trigger, threshold]);

  // Keep the physics loop in sync with the bubble, and auto-hide it.
  useEffect(() => {
    bubbleRef.current = bubble;
    if (!bubble) return;
    const t = window.setTimeout(() => setBubble(null), 2400);
    return () => window.clearTimeout(t);
  }, [bubble]);

  return (
    <div ref={layerRef} aria-hidden className={`pointer-events-none absolute inset-0 z-30 ${clipY ? "overflow-hidden" : "overflow-x-clip"}`} style={{ visibility: "hidden" }}>
      {pieces.map((p, i) => {
        const d = dims(p, scale || 1);
        return (
          <div
            key={i}
            ref={(el) => {
              pieceEls.current[i] = el;
            }}
            className="pointer-events-auto absolute left-0 top-0 cursor-grab touch-none select-none will-change-transform [container-type:inline-size]"
            style={{ width: d.w, height: d.h }}
          >
            {p.kind === "oodle" && <Oodle world={p.world} shape={p.shape} priority className="h-full w-full" sizes="200px" />}
            {p.kind === "coin" && <Coin />}
            {p.kind === "token" && <Token />}
            {p.kind === "card" && <GameCard variant={p.variant} />}
            {p.kind === "icon" && <Particle icon={p.icon} className="h-full w-full drop-shadow-[0_4px_0_rgb(30_34_45/0.18)]" />}
            {p.kind === "block" && <Block label={p.label} world={p.world} shape={p.shape} tone={p.tone} />}
          </div>
        );
      })}

      <div ref={bubbleEl} className="pointer-events-none absolute left-0 top-0 z-20">
        <AnimatePresence>
          {bubble && (
            <motion.div
              key={`${bubble.index}-${bubble.text}`}
              initial={{ opacity: 0, scale: 0.92, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.35, bounce: 0.3 } }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
              style={{ originX: 0.5, originY: 1 }}
              className="absolute bottom-0 left-0 -translate-x-1/2"
            >
              <SpeechBubble>{bubble.text}</SpeechBubble>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
