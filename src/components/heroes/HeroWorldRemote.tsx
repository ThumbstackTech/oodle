"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { sayings } from "@/content/site";
import Oodle from "../ui/Oodle";
import PatternBg from "../ui/PatternBg";
import SpeechBubble from "../ui/SpeechBubble";
import HeroHeading from "./HeroHeading";
import { WORLDS } from "./worlds";

/** How long each world stays on screen before the next one wipes in. */
const CYCLE_MS = 2500;

type Layer = { i: number; key: number; origin: { x: string; y: string } };

/**
 * Hero — "World Remote".
 * The whole hero *is* a world. It advances every 3s (the progress bar in the active tab *is* the
 * timer), and the chunky tabs let you jump to any world. The new world wipes in from the tab that
 * triggered it (clip-path circle) and its whole cast pops up along the bottom.
 * Pauses while the pointer is on the remote, when the hero is off-screen, or via the pause button.
 */
export default function HeroWorldRemote() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const keyRef = useRef(1);
  const inView = useInView(sectionRef, { amount: 0.3 });

  const [active, setActive] = useState(0);
  const [layers, setLayers] = useState<Layer[]>([{ i: 0, key: 0, origin: { x: "50%", y: "70%" } }]);
  const [hovering, setHovering] = useState(false);
  // which cast member is being hovered / tapped (null = none)
  const [poked, setPoked] = useState<number | null>(null);
  const [stopped, setStopped] = useState(false);
  // Bumped on every world change so the timer bar restarts from zero.
  const [tick, setTick] = useState(0);

  const paused = hovering || poked !== null || stopped || !inView || !!reduce;

  const go = (i: number) => {
    setPoked(null);
    setTick((t) => t + 1);
    if (i === active) return;
    const tab = tabRefs.current[i];
    const sec = sectionRef.current;
    let origin = { x: "50%", y: "70%" };
    if (tab && sec) {
      const t = tab.getBoundingClientRect();
      const s = sec.getBoundingClientRect();
      origin = { x: `${t.left + t.width / 2 - s.left}px`, y: `${t.top + t.height / 2 - s.top}px` };
    }
    setActive(i);
    setLayers((ls) => [...ls.slice(-1), { i, key: keyRef.current++, origin }]);
  };
  const next = () => go((active + 1) % WORLDS.length);

  const w = WORLDS[active];

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="The three Oodle worlds"
      className="relative isolate flex min-h-[max(100svh,760px)] flex-col overflow-hidden pt-[112px] sm:pt-[128px]"
    >
      {/* World backgrounds — the newest wipes in over the previous one */}
      {layers.map((l, idx) => {
        const lw = WORLDS[l.i];
        const isNew = idx === layers.length - 1 && layers.length > 1;
        return (
          <motion.div
            key={l.key}
            className={`absolute inset-0 -z-10 ${lw.bg}`}
            initial={isNew ? { clipPath: `circle(0% at ${l.origin.x} ${l.origin.y})` } : false}
            animate={{ clipPath: `circle(150% at ${l.origin.x} ${l.origin.y})` }}
            transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
          >
            <PatternBg src={lw.pattern} className="opacity-70" />
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 70% 55% at 50% 32%, ${lw.hex} 35%, color-mix(in srgb, ${lw.hex} 40%, transparent) 75%, transparent)`,
              }}
            />
          </motion.div>
        );
      })}

      <div className="flex flex-1 flex-col justify-center pb-6">
      <div className="px-4 sm:px-6">
        <HeroHeading tone="dark" size="lg" accent="text-sun" eyebrow={false} />
      </div>

      {/* The remote */}
      <motion.div
        className="relative z-30 mx-auto mt-7 flex flex-wrap items-center justify-center gap-2 px-4 sm:mt-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={() => setHovering(false)}
      >
        <div className="flex items-center gap-1 rounded-full border-[2.5px] border-ink bg-cream p-1 shadow-[0_5px_0_0_var(--color-ink)] sm:gap-2 sm:p-1.5">
        <div role="tablist" aria-label="Choose a world" className="flex gap-0.5 sm:gap-2">
          {WORLDS.map((tw, i) => {
            const on = i === active;
            return (
              <button
                key={tw.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                aria-selected={on}
                aria-label={tw.game}
                onClick={() => go(i)}
                className={`relative flex h-11 items-center gap-1.5 overflow-hidden rounded-full pl-1 pr-2.5 text-[12.5px] min-[400px]:pr-3 min-[400px]:text-[13px] font-bold transition-[background-color,color,transform] duration-200 active:scale-[0.97] sm:h-12 sm:gap-2 sm:pl-1.5 sm:pr-5 sm:text-[15px] ${
                  on ? "bg-sun text-ink" : "text-ink/70 hover:bg-ink/[0.06]"
                }`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink sm:h-9 sm:w-9 ${tw.bg}`}>
                  <Oodle world={tw.id} shape={tw.cast[0]} className="h-5 w-auto sm:h-6" sizes="36px" />
                </span>
                {tw.short}
                {/* timer track + bar: when the bar fills, the next world comes in */}
                <span aria-hidden className="absolute bottom-[5px] left-[42px] right-3 h-[3px] overflow-hidden rounded-full bg-ink/10 sm:left-[52px] sm:right-5 sm:h-[4px]">
                  {on && (
                    <span
                      key={`${active}-${tick}`}
                      className="remote-progress absolute inset-0 block rounded-full bg-ink"
                      style={{ "--cycle": `${CYCLE_MS}ms`, animationPlayState: paused ? "paused" : "running" } as CSSProperties}
                      onAnimationEnd={next}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setStopped((s) => !s)}
          aria-label={stopped ? "Play world slideshow" : "Pause world slideshow"}
          aria-pressed={stopped}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-cream transition-transform duration-[120ms] active:scale-[0.94] sm:h-10 sm:w-10"
        >
          {stopped ? (
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
              <path d="M6 4l10 6-10 6z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
              <rect x="5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
              <rect x="11.5" y="4" width="3.5" height="12" rx="1" fill="currentColor" />
            </svg>
          )}
        </button>
        </div>
      </motion.div>

      {/* World line */}
      <div className="relative z-20 mt-5 px-6 text-center" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={w.id}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
            className="text-[15px] font-semibold leading-snug text-cream sm:text-[18px]"
          >
            <span className="font-display text-sun">{w.game}</span> — {w.tagline}
          </motion.p>
        </AnimatePresence>
      </div>
      </div>

      {/* The cast — cream sticker outline keeps every Oodle readable on every world */}
      <div
        className={`relative flex h-[clamp(96px,min(26svh,23vw),220px)] ${poked !== null ? "z-40" : "z-20"} items-end justify-center gap-[3vw] px-3 max-sm:h-[clamp(96px,26vw,130px)] sm:gap-[1.5vw]`}
        onPointerLeave={(e) => e.pointerType === "mouse" && setPoked(null)}
      >
        <AnimatePresence mode="popLayout">
          {w.cast.map((shape, k) => (
            <motion.div
              key={`${w.id}-${shape}`}
              className={`h-full origin-bottom ${k >= 4 ? "max-sm:hidden" : ""}`}
              initial={{ y: "110%", rotate: k % 2 ? 8 : -8 }}
              animate={{ y: "6%", rotate: 0 }}
              exit={{ y: "110%", transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0], delay: k * 0.015 } }}
              transition={{ type: "spring", duration: 0.65, bounce: 0.35, delay: 0.15 + k * 0.04 }}
            >
              <CastMember
                world={w.id}
                shape={shape}
                k={k}
                last={k === w.cast.length - 1}
                poked={poked}
                onEnter={() => setPoked(k)}
                onTap={() => setPoked((p) => (p === k ? null : k))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

/**
 * One member of the hero cast. Hover (or tap) and it springs up and says one of its lines;
 * its neighbours lean away to make room. The slideshow pauses while someone's being poked.
 */
function CastMember({
  world,
  shape,
  k,
  last,
  poked,
  onEnter,
  onTap,
}: {
  world: (typeof WORLDS)[number]["id"];
  shape: (typeof WORLDS)[number]["cast"][number];
  k: number;
  last: boolean;
  poked: number | null;
  onEnter: () => void;
  onTap: () => void;
}) {
  const on = poked === k;
  const near = poked !== null && Math.abs(poked - k) === 1;
  const dir = poked !== null && k > poked ? 1 : -1;
  const lines = sayings[`${world}-${shape}`] ?? [];
  const line = lines[k % Math.max(lines.length, 1)];

  return (
    <motion.button
      type="button"
      aria-label={line ? `Oodle says: ${line}` : "Oodle"}
      onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
      // touch/pen: tap toggles · keyboard: Enter/Space toggles · mouse: hover already handles it
      onPointerUp={(e) => e.pointerType !== "mouse" && onTap()}
      onClick={(e) => e.detail === 0 && onTap()}
      className="relative block h-full cursor-pointer outline-none"
      animate={
        on
          ? { y: "-14%", scale: 1.1, rotate: k % 2 ? 4 : -4, x: 0 }
          : near
            ? { y: "2%", scale: 0.96, rotate: dir * 7, x: `${dir * 6}%` }
            : { y: 0, scale: 1, rotate: 0, x: 0 }
      }
      transition={{ type: "spring", duration: 0.45, bounce: 0.4 }}
      style={{ originY: 1 }}
    >
      <AnimatePresence>
        {on && line && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.45 }}
            style={{ originX: k === 0 ? 0 : last ? 1 : 0.5, originY: 1 }}
            className={`pointer-events-none absolute bottom-[88%] z-30 ${k === 0 ? "left-0" : last ? "right-0" : k === 3 ? "left-1/2 -translate-x-1/2 max-sm:left-auto max-sm:right-0 max-sm:translate-x-0" : "left-1/2 -translate-x-1/2"}`}
          >
            <SpeechBubble className="max-sm:!px-2.5 max-sm:!py-1.5 max-sm:!text-[11.5px]">{line}</SpeechBubble>
          </motion.span>
        )}
      </AnimatePresence>
      <Oodle world={world} shape={shape} priority className="sticker h-full w-auto" sizes="220px" />
    </motion.button>
  );
}
