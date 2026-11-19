"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useRef } from "react";
import type { ToyPiece } from "@/content/site";
import ToyBox from "../toy/ToyBox";
import HeroHeading from "./HeroHeading";
import { WORLDS } from "./worlds";

// Each world's cast tumbles onto its own mat.
const PIECES: ToyPiece[] = [
  { kind: "oodle", world: "money", shape: "coin", size: 1, drop: 0.12 },
  { kind: "oodle", world: "solve", shape: "tri", size: 1, drop: 0.5 },
  { kind: "oodle", world: "biz", shape: "blob", size: 1, drop: 0.86 },
  { kind: "oodle", world: "money", shape: "blob", size: 0.95, drop: 0.24 },
  { kind: "oodle", world: "solve", shape: "star", size: 1.05, drop: 0.41 },
  { kind: "oodle", world: "biz", shape: "star", size: 0.95, drop: 0.74 },
  { kind: "coin", drop: 0.07 },
  { kind: "oodle", world: "money", shape: "clover", size: 0.9, drop: 0.3 },
  { kind: "oodle", world: "solve", shape: "cloud", size: 0.92, drop: 0.6 },
  { kind: "oodle", world: "biz", shape: "clover", size: 0.92, drop: 0.93 },
  { kind: "token", drop: 0.68 },
  { kind: "oodle", world: "money", shape: "star", size: 0.95, drop: 0.18 },
  { kind: "oodle", world: "solve", shape: "clover", size: 0.9, drop: 0.55 },
  { kind: "oodle", world: "biz", shape: "tri", size: 0.92, drop: 0.8 },
  { kind: "coin", drop: 0.36 },
];

/**
 * Iteration 3 — "Toy Box Worlds".
 * The physics playground, organised into the three worlds: each world's pattern is a mat on the floor,
 * and its Oodles tumble onto it. Grab, throw, stack — and tap an Oodle to hear it talk.
 */
export default function HeroToyWorlds() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[max(100svh,760px)] flex-col overflow-hidden bg-cream pt-[104px] sm:pt-[116px]"
    >
      <div className="relative z-20 flex justify-center px-4 sm:px-6">
        <div data-collider className="inline-flex">
          <HeroHeading size="lg" />
        </div>
      </div>
      <p className="relative z-20 mt-5 text-center font-display text-[18px] text-slate sm:text-[20px]">psst… grab an Oodle & throw it!</p>

      <div className="min-h-[200px] flex-1" />

      {/* World mats along the floor */}
      <div className="absolute inset-x-0 bottom-0 z-0 grid h-[24%] min-h-[150px] grid-cols-3 gap-2 px-2 sm:gap-3 sm:px-3">
        {WORLDS.map((w, i) => (
          <motion.div
            key={w.id}
            className={`relative overflow-hidden rounded-t-[28px] border-[3px] border-b-0 border-ink ${w.bg}`}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ type: "spring", duration: 0.9, bounce: 0.15, delay: 0.1 + i * 0.08 }}
          >
            <Image src={w.pattern} alt="" aria-hidden fill sizes="33vw" className="object-cover opacity-90" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${w.hex} 20%, transparent)` }} />
            <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5">
              <span className={`inline-block rounded-full border-2 border-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px] ${w.chip}`}>
                {w.game}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <ToyBox heroRef={ref} pieces={PIECES} />
    </section>
  );
}
