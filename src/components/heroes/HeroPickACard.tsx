"use client";

import Image from "next/image";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import Oodle from "../ui/Oodle";
import SpeechBubble from "../ui/SpeechBubble";
import HeroHeading from "./HeroHeading";
import { WORLDS, type WorldDef } from "./worlds";

const FLIP = { type: "spring", duration: 0.8, bounce: 0.25 } as const;
const FAN = [
  { rotate: -9, y: 18 },
  { rotate: 0, y: -10 },
  { rotate: 9, y: 18 },
];

function WorldCard({ w, i, flipped, onFlip }: { w: WorldDef; i: number; flipped: boolean; onFlip: () => void }) {
  return (
    <motion.div
      className="relative w-[min(30vw,270px)] shrink-0 [perspective:1400px] lg:w-[clamp(200px,17vw,270px)]"
      initial={{ y: 200, opacity: 0, rotate: 0 }}
      animate={{ y: FAN[i].y, opacity: 1, rotate: FAN[i].rotate }}
      transition={{ type: "spring", duration: 1, bounce: 0.2, delay: 0.35 + i * 0.1 }}
      style={{ zIndex: i === 1 ? 3 : 2 }}
    >
      {/* cast popping out of the top once revealed */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[86%] z-0 flex items-end justify-center">
        <AnimatePresence>
          {flipped &&
            [w.cast[1], w.cast[2]].map((shape, k) => (
              <motion.div
                key={shape}
                className="w-[44%] origin-bottom"
                initial={{ y: 90, opacity: 0, rotate: 0 }}
                animate={{ y: 0, opacity: 1, rotate: k ? 8 : -8 }}
                exit={{ y: 60, opacity: 0, transition: { duration: 0.18 } }}
                transition={{ type: "spring", duration: 0.7, bounce: 0.4, delay: 0.25 + k * 0.08 }}
              >
                <Oodle world={w.id} shape={shape} className="h-auto w-full" sizes="120px" />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        aria-label={flipped ? `${w.game}: ${w.tagline}` : `Flip the ${w.short} card`}
        className="relative z-10 block aspect-[63/88] w-full cursor-pointer transition-transform duration-[120ms] ease-(--ease-out) active:scale-[0.97] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-2"
      >
        <motion.div className="relative h-full w-full [transform-style:preserve-3d]" animate={{ rotateY: flipped ? 180 : 0 }} transition={FLIP}>
          {/* Back — face down */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-[22px] border-[3px] border-ink ${w.bg} shadow-[0_10px_0_0_var(--color-ink)] [backface-visibility:hidden]`}
          >
            <Image src={w.letters} alt="" aria-hidden fill sizes="270px" className="object-cover" />
            <div className="absolute inset-[7%] flex flex-col items-center justify-between rounded-[14px] border-2 border-cream/35 py-[10%] text-cream">
              <span className="font-display text-[clamp(14px,1.4vw,20px)] leading-none text-cream/80">oodle</span>
              <span className="font-display text-[clamp(70px,8vw,120px)] leading-none text-sun">?</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-cream/80">Tap to flip</span>
            </div>
          </div>

          {/* Front — the world */}
          <div className="absolute inset-0 overflow-hidden rounded-[22px] border-[3px] border-ink bg-cream shadow-[0_10px_0_0_var(--color-ink)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className={`absolute inset-0 ${w.bg}`}>
              <Image src={w.pattern} alt="" aria-hidden fill sizes="270px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 h-[55%]" style={{ background: `linear-gradient(to top, ${w.hex} 30%, transparent)` }} />
            </div>
            <div className="absolute inset-[6%] rounded-[14px] border-2 border-cream/35" />
            <div className="absolute inset-x-[11%] top-[10%] text-left">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cream/80">Master</span>
              <div className="font-display text-[clamp(28px,3vw,46px)] leading-[0.9] text-sun">{w.short}</div>
            </div>
            <Oodle world={w.id} shape={w.cast[0]} className="absolute bottom-[20%] left-1/2 h-auto w-[56%] -translate-x-1/2 drop-shadow-[0_6px_0_rgb(30_34_45/0.25)]" sizes="160px" />
            <p className="absolute inset-x-[11%] bottom-[8%] text-left text-[clamp(10px,0.85vw,13px)] font-semibold leading-snug text-cream">{w.tagline}</p>
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

/**
 * Iteration 2 — "Pick a Card".
 * The worlds are dealt face-down like a real Oodle game. Kids flip them to reveal each world — its
 * pattern, its tagline, and its cast popping out of the top of the card.
 */
export default function HeroPickACard() {
  const [flipped, setFlipped] = useState([false, false, false]);
  const [hintScope, animateHint] = useAnimate();
  const all = flipped.every(Boolean);

  // One gentle nudge if nobody has touched a card yet.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (hintScope.current) animateHint(hintScope.current, { rotate: [0, -4, 4, -2, 0] }, { duration: 0.7, ease: "easeInOut" });
    }, 2600);
    return () => window.clearTimeout(t);
  }, [animateHint, hintScope]);

  const flip = (i: number) => setFlipped((f) => f.map((v, k) => (k === i ? !v : v)));

  return (
    <section className="relative flex min-h-[max(100svh,760px)] items-center overflow-hidden bg-cream pb-16 pt-[110px]">
      <div className="mx-auto grid w-full max-w-[1320px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <HeroHeading size="md" align="left" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 hidden -rotate-2 font-display text-[22px] text-slate lg:block"
          >
            Three worlds, face down. Go on, pick one →
          </motion.p>
        </div>

        <div className="relative flex justify-center gap-[2vw] pt-24 lg:col-span-7 lg:gap-[1.5vw]">
          {WORLDS.map((w, i) => (
            <div key={w.id} ref={i === 0 ? hintScope : undefined}>
              <WorldCard w={w} i={i} flipped={flipped[i]} onFlip={() => flip(i)} />
            </div>
          ))}

          <AnimatePresence>
            {all && (
              <motion.div
                className="absolute -bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, transition: { duration: 0.15 } }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3, delay: 0.5 }}
              >
                <SpeechBubble>You found all three worlds!</SpeechBubble>
                <button
                  type="button"
                  onClick={() => setFlipped([false, false, false])}
                  className="rounded-full border-2 border-ink bg-sun px-4 py-2 text-[13px] font-bold text-ink transition-transform duration-[120ms] active:scale-[0.97]"
                >
                  Shuffle again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
