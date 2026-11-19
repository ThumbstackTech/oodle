"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Shape, World } from "@/content/site";
import Oodle from "./Oodle";

/** The cards in the trail cycle through these — world colours + one of that world's Oodles. */
const DECK: { bg: string; world: World; shape: Shape }[] = [
  { bg: "bg-forest", world: "money", shape: "coin" },
  { bg: "bg-sun", world: "solve", shape: "star" },
  { bg: "bg-oxblood", world: "biz", shape: "blob" },
  { bg: "bg-lilac", world: "solve", shape: "tri" },
  { bg: "bg-slate", world: "solve", shape: "cloud" },
  { bg: "bg-ochre", world: "money", shape: "clover" },
  { bg: "bg-forest", world: "money", shape: "star" },
  { bg: "bg-oxblood", world: "biz", shape: "star" },
];

const POOL = 9;
const SPACING = 80; // px of smoothed travel between cards
const LERP = 0.2;
const W = 132;
const H = (W * 88) / 63;

/**
 * Smooth card trail that follows the mouse inside `areaRef`. Mouse + fine pointer only, off under reduced
 * motion, and never over elements marked `data-no-trail` (e.g. the CTA). A fixed pool of nodes is recycled
 * and animated with WAAPI (transform + opacity only).
 */
export default function CardTrail({ areaRef }: { areaRef: RefObject<HTMLElement | null> }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const area = areaRef.current;
    const layer = layerRef.current;
    if (!area || !layer) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    let target = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };
    let last = { x: 0, y: 0 };
    let inside = false;
    let primed = false;
    let raf = 0;
    let next = 0;
    const anims: (Animation | null)[] = Array(POOL).fill(null);

    const blocked = (cx: number, cy: number) => {
      for (const el of area.querySelectorAll<HTMLElement>("[data-no-trail]")) {
        const r = el.getBoundingClientRect();
        const pad = 40;
        if (cx > r.left - pad && cx < r.right + pad && cy > r.top - pad && cy < r.bottom + pad) return true;
      }
      return false;
    };

    const spawn = (x: number, y: number, dx: number) => {
      const i = next;
      next = (next + 1) % POOL;
      const el = nodes.current[i];
      if (!el) return;
      const rot = Math.max(-14, Math.min(14, dx * 0.6)) + (Math.random() - 0.5) * 8;
      anims[i]?.cancel();
      // keep the whole card (incl. tilt + fall) inside the section so it's never clipped
      const m = 22;
      x = Math.min(Math.max(x, W / 2 + m), area.clientWidth - W / 2 - m);
      y = Math.min(Math.max(y, H / 2 + m), area.clientHeight - H / 2 - m - 34);
      const base = `translate(${x - W / 2}px, ${y - H / 2}px)`;
      anims[i] = el.animate(
        [
          { transform: `${base} rotate(${rot * 0.4}deg) scale(0.6)`, opacity: 0 },
          { transform: `${base} rotate(${rot}deg) scale(1)`, opacity: 1, offset: 0.16 },
          { transform: `${base} rotate(${rot}deg) scale(1)`, opacity: 1, offset: 0.45 },
          { transform: `${base} translateY(34px) rotate(${rot * 1.4}deg) scale(0.86)`, opacity: 0 },
        ],
        { duration: 1600, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" },
      );
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;
      const dx = pos.x - last.x;
      const dy = pos.y - last.y;
      if (Math.hypot(dx, dy) >= SPACING) {
        const ar = area.getBoundingClientRect();
        if (!blocked(pos.x + ar.left, pos.y + ar.top)) spawn(pos.x, pos.y, dx);
        last = { ...pos };
      }
      if (inside || Math.hypot(target.x - pos.x, target.y - pos.y) > 0.5) raf = requestAnimationFrame(loop);
      else raf = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const ar = area.getBoundingClientRect();
      target = { x: e.clientX - ar.left, y: e.clientY - ar.top };
      if (!primed) {
        pos = { ...target };
        last = { ...target };
        primed = true;
      }
      inside = true;
      // fade out cards near the CTA when the cursor reaches it
      if (blocked(e.clientX, e.clientY)) {
        anims.forEach((a) => {
          if (a && a.playState === "running" && (a.currentTime as number) < 1150) a.currentTime = 1150;
        });
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      inside = false;
      primed = false;
    };

    area.addEventListener("pointermove", onMove);
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      anims.forEach((a) => a?.cancel());
    };
  }, [areaRef]);

  return (
    <div ref={layerRef} aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden overflow-hidden lg:block">
      {Array.from({ length: POOL }, (_, i) => (
        <div
          key={i}
          ref={(el) => {
            nodes.current[i] = el;
          }}
          className="absolute left-0 top-0 opacity-0 will-change-transform"
          style={{ width: W, height: H }}
        >
          {(() => {
            const c = DECK[i % DECK.length];
            return (
              <div className={`h-full w-full rounded-[12px] border-[2.5px] border-ink p-[6px] shadow-[0_4px_0_0_var(--color-ink)] ${c.bg}`}>
                <div className="grid h-full w-full place-items-center rounded-[7px] border-2 border-cream/40">
                  <Oodle world={c.world} shape={c.shape} className="h-auto w-[72%]" sizes="60px" />
                </div>
              </div>
            );
          })()}
        </div>
      ))}
    </div>
  );
}
