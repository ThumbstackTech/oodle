"use client";

import { motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import type { Shape, World } from "@/content/site";
import Oodle from "./Oodle";

type Props = {
  index: number;
  q: string;
  world: World;
  shape: Shape;
  face: string;
  game: string;
  prompt: string;
  tilt: number;
};

const FLIP = { type: "spring", duration: 0.7, bounce: 0.22 } as const;

/** A question card that flips over (3D, spring) to reveal a playable prompt. */
export default function FlipCard({ index, q, world, shape, face, game, prompt, tilt }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group relative h-full [perspective:1200px] [rotate:var(--tilt)] transition-[rotate,translate] duration-300 ease-(--ease-out) [@media(hover:hover)_and_(pointer:fine)]:hover:[rotate:0deg] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-4"
      style={{ "--tilt": `${tilt}deg` } as CSSProperties}
    >
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={flipped ? `${game}: ${prompt}. Flip back.` : `${q} Flip card.`}
        className="block aspect-[4/5] w-full cursor-pointer text-left transition-transform duration-[120ms] ease-(--ease-out) active:scale-[0.97]"
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={FLIP}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 flex flex-col justify-between rounded-[26px] border-[3px] border-ink p-5 shadow-[0_8px_0_0_rgb(0_0_0/0.35)] [backface-visibility:hidden] [container-type:inline-size] ${face}`}
          >
            <Oodle
              world={world}
              shape={shape}
              className="absolute -top-12 right-4 h-[76px] w-auto transition-transform duration-300 ease-(--ease-out) [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-2"
              sizes="80px"
            />
            <div className="flex items-center justify-between">
              <span className="label text-[11px] opacity-70">Q{index + 1}</span>
            </div>
            <p className="font-display text-[11.5cqw] leading-[1]">{q}</p>
            <span className="label flex items-center gap-1.5 text-[10px] opacity-70">
              <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                <path d="M4 10a6 6 0 0 1 10.5-4M16 10a6 6 0 0 1-10.5 4M14 2v4h-4M6 18v-4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Flip me
            </span>
          </div>

          {/* Back */}
          <div className="absolute inset-0 flex flex-col rounded-[26px] border-[3px] border-ink bg-cream p-5 text-ink shadow-[0_8px_0_0_rgb(0_0_0/0.35)] [backface-visibility:hidden] [transform:rotateY(180deg)] [container-type:inline-size]">
            <span className="label text-[10px] text-grey">Try it in</span>
            <span className="mt-1 font-display text-[11cqw] leading-none text-tomato">{game}</span>
            <p className="mt-auto text-[7.4cqw] font-semibold leading-snug">{prompt}</p>
            <span className="label mt-4 text-[10px] text-grey">Tap to flip back</span>
          </div>
        </motion.div>
      </button>
    </div>
  );
}
