"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Oodle from "../ui/Oodle";
import HeroHeading from "./HeroHeading";
import { WORLDS } from "./worlds";

const SPRING = { type: "spring", duration: 0.7, bounce: 0.22 } as const;

/**
 * Iteration 1 — "Three Worlds".
 * Three world panels (the client's own pattern art) sit under the headline. Hover or tap one and it
 * opens up: the panel widens and its whole cast pops up to say hello.
 */
export default function HeroWorldsAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="relative flex min-h-[max(100svh,760px)] flex-col overflow-hidden bg-cream pt-[104px] sm:pt-[112px]">
      <div className="px-4 sm:px-6">
        <HeroHeading size="md" />
      </div>

      <div
        className="mt-10 flex flex-1 flex-col gap-3 px-3 pb-3 sm:mt-12 sm:flex-row sm:gap-4 sm:px-5 sm:pb-5"
        onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
      >
        {WORLDS.map((w, i) => {
          const isOpen = open === i;
          const dim = open !== null && !isOpen;
          return (
            <motion.a
              key={w.id}
              href="#games"
              aria-label={`Explore ${w.game}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
              onFocus={() => setOpen(i)}
              onClick={(e) => {
                // first tap on touch opens the world; second tap follows the link
                if (window.matchMedia("(hover: none)").matches && open !== i) {
                  e.preventDefault();
                  setOpen(i);
                }
              }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1, flexGrow: isOpen ? 2.3 : 1 }}
              transition={{ ...SPRING, delay: 0.3 + i * 0.08, flexGrow: SPRING }}
              className={`group relative flex min-h-[200px] basis-0 flex-col overflow-hidden rounded-[32px] border-[3px] border-ink ${w.bg} p-5 text-cream outline-none sm:min-h-0 sm:p-7`}
            >
              {/* the world's own pattern illustration */}
              <motion.div
                className="absolute inset-0"
                animate={{ scale: isOpen ? 1.06 : 1, opacity: dim ? 0.55 : 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              >
                <Image src={w.pattern} alt="" aria-hidden fill sizes="(min-width: 640px) 60vw, 100vw" className="object-cover" priority />
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(to top, ${w.hex}, transparent)` }} />

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-block rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${w.chip}`}>
                    {w.game}
                  </span>
                  <h2 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.75rem)] leading-[0.9] text-sun">{w.short}</h2>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.p
                        initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, transition: { duration: 0.12 } }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
                        className="mt-2 max-w-[30ch] text-[15px] font-semibold leading-snug text-cream"
                      >
                        {w.tagline}
                        <span className="mt-1 block text-[12px] font-bold uppercase tracking-[0.14em] text-cream/70">{w.teaches}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-cream text-ink transition-transform duration-300 ease-(--ease-out) group-hover:-rotate-12">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                    <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>

              {/* cast lineup — 2 at rest, all 6 when the world opens */}
              <div className="relative mt-auto flex items-end justify-center gap-[2%] pt-6">
                <AnimatePresence initial={false} mode="popLayout">
                  {(isOpen ? w.cast : w.cast.slice(0, 2)).map((shape, k) => (
                    <motion.div
                      key={shape}
                      layout
                      className={`origin-bottom ${isOpen ? "w-[30%] max-w-[150px] sm:w-[15%]" : "w-[34%] max-w-[190px] sm:w-[36%]"}`}
                      initial={{ y: 70, opacity: 0, scale: 0.8 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: 40, opacity: 0, scale: 0.9, transition: { duration: 0.18 } }}
                      transition={{ ...SPRING, delay: isOpen ? 0.04 + k * 0.05 : 0 }}
                    >
                      <Oodle world={w.id} shape={shape} priority className="h-auto w-full drop-shadow-[0_6px_0_rgb(30_34_45/0.25)]" sizes="150px" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
