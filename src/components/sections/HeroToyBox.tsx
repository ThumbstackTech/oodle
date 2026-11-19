"use client";

import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { hero } from "@/content/site";
import { Button, Chip } from "../ui/Button";
import { EASE_OUT } from "../ui/Reveal";
import ToyBox from "../toy/ToyBox";

/** A headline line that rises from a mask. The outer wrapper is static so it can double as a physics collider. */
function Line({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span data-collider className="inline-block overflow-hidden px-[0.04em] pb-[0.06em] align-top">
      <motion.span
        className="inline-block"
        initial={{ y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default function HeroToyBox() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[max(100svh,680px)] flex-col overflow-hidden bg-cream pt-[104px] sm:pt-[120px]"
    >
      <div className="relative z-20 mx-auto flex w-full max-w-[1320px] flex-col items-center px-4 text-center sm:px-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT }}>
          <Chip>
            <span className="h-2 w-2 rounded-full bg-tomato" aria-hidden />
            {hero.eyebrow}
          </Chip>
        </motion.div>

        <h1 id="hero-title" aria-label={`${hero.top} ${hero.bottom}`} className="mt-5 font-display text-ink sm:mt-6">
          <span aria-hidden className="block text-[clamp(3.6rem,12.4vw,10.75rem)] leading-[0.84]">
            <Line delay={0.1}>
              <span className="text-tomato">Play</span> today.
            </Line>
          </span>
          <span aria-hidden className="mt-2 block text-[clamp(1.9rem,4.9vw,4.5rem)] leading-[1] sm:mt-3">
            <Line delay={0.2}>
              Ready for <span className="text-forest">life</span> tomorrow.
            </Line>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 }}
          className="mt-5 max-w-[46ch] text-[16px] font-medium leading-relaxed text-ink/75 sm:text-[17px]"
        >
          <span data-collider>{hero.lead}</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.45 }}
          className="relative mt-7"
        >
          <div data-collider className="flex flex-col items-center gap-4 sm:flex-row">
            <Button href={hero.primary.href}>{hero.primary.label}</Button>
            <Button href={hero.secondary.href} tone="cream">
              {hero.secondary.label}
            </Button>
          </div>

          {/* A note for the kids */}
          <div className="pointer-events-none absolute left-full top-1/2 ml-8 hidden w-[200px] -translate-y-1/2 text-left xl:block">
            <p className="-rotate-6 font-display text-[22px] leading-[1] text-slate">{hero.hint}</p>
            <svg viewBox="0 0 90 70" aria-hidden className="ml-8 mt-1 h-14 w-[72px] text-slate" fill="none">
              <path
                d="M10 6c4 22 18 40 44 46m0 0-10-10m10 10-13 5"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
        <p className="pointer-events-none mt-6 -rotate-3 font-display text-[18px] text-slate xl:hidden">{hero.hint}</p>
      </div>

      {/* Open floor where the toys pile up */}
      <div className="min-h-[220px] flex-1 sm:min-h-[250px]" aria-hidden />

      <ToyBox heroRef={ref} />
    </section>
  );
}
