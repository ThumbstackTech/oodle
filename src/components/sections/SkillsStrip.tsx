"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { gameDetails, skills } from "@/content/site";
import GameModal from "../games/GameModal";
import Oodle from "../ui/Oodle";
import PatternBg from "../ui/PatternBg";
import { MaskLines } from "../ui/Reveal";

const SPRING = { type: "spring", stiffness: 130, damping: 20, mass: 0.9 } as const;
const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

export default function SkillsStrip() {
  const [open, setOpen] = useState<number | null>(null);
  // Which game's details modal is showing; the card that opened it gets focus back on close.
  const [selected, setSelected] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const closeModal = useCallback(() => {
    setSelected(null);
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }, []);

  return (
    <section id="games" aria-labelledby="skills-title" className="relative overflow-x-clip bg-cream pb-14 pt-16 sm:pb-24 sm:pt-24 lg:pb-32 lg:pt-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6">
        <div className="relative flex flex-col items-start">
          <h2
            id="skills-title"
            className="font-display text-[clamp(1.65rem,3.6vw,3.35rem)] leading-[1.02] text-ink sm:leading-[0.95]"
          >
            <MaskLines lines={[skills.title, <span key="b" className="text-lilac">{skills.titleAccent}</span>]} />
          </h2>
        </div>

        <div
          className="mt-10 flex flex-col gap-4 sm:mt-14 lg:h-[480px] lg:flex-row lg:gap-4"
          onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(null)}
        >
          {skills.panels.map((p, i) => {
            const isOpen = open === i;
            const dim = open !== null && !isOpen;
            return (
              <motion.a
                key={p.title}
                href={p.href}
                aria-label={`See ${p.game} game details`}
                aria-haspopup="dialog"
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
                onFocus={() => setOpen(i)}
                onClick={(e) => {
                  e.preventDefault();
                  // touch: first tap expands the card, second tap opens the details
                  if (window.matchMedia("(hover: none)").matches && open !== i) {
                    setOpen(i);
                    return;
                  }
                  triggerRef.current = e.currentTarget;
                  setSelected(i);
                }}
                initial={{ y: 80, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                animate={{ flexGrow: isOpen ? 2.3 : 1 }}
                transition={{ ...SPRING, delay: i * 0.08, flexGrow: { duration: 0.65, ease: SMOOTH_EASE } }}
                className={`group relative flex min-h-[260px] flex-col overflow-hidden [container-type:inline-size] rounded-[28px] ${p.bg} p-5 text-cream shadow-[0_2px_6px_-2px_rgb(30_34_45/0.15),0_22px_44px_-22px_rgb(30_34_45/0.55)] outline-none focus-visible:ring-4 focus-visible:ring-sun/70 sm:min-h-[300px] sm:rounded-[32px] sm:p-7 lg:h-full lg:min-h-0 lg:basis-0`}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: isOpen ? 1.06 : 1, opacity: dim ? 0.4 : isOpen ? 0.52 : 0.45 }}
                  transition={{ duration: 0.7, ease: SMOOTH_EASE }}
                >
                  <PatternBg src={p.pattern} />
                </motion.div>
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse 85% 70% at 18% 18%, ${p.hex} 38%, transparent 85%), linear-gradient(to top, ${p.hex} 12%, transparent 55%)`,
                  }}
                />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="relative min-w-0 flex-1">
                    <span className="block text-[12px] font-bold uppercase tracking-[0.16em] text-cream/90 drop-shadow-[0_1px_2px_rgb(0_0_0/0.45)]">
                      {p.game}
                    </span>
                    <h3 className="mt-2 font-display text-[min(clamp(2rem,3.8vw,3.5rem),14cqw)] leading-[0.95] text-sun [-webkit-text-stroke:0.06em_var(--color-ink)] [paint-order:stroke_fill] [text-shadow:0_3px_8px_rgb(30_34_45/0.35)]">
                      {p.title}
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.p
                          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={{ opacity: 0, transition: { duration: 0.15 } }}
                          transition={{ duration: 0.45, ease: SMOOTH_EASE, delay: 0.1 }}
                          className="mt-2.5 max-w-[32ch] text-[14px] font-semibold leading-snug text-cream drop-shadow-[0_1px_2px_rgb(0_0_0/0.55)] sm:text-[15px] lg:absolute lg:left-0 lg:top-full lg:w-[32ch]"
                        >
                          {p.body}
                          <span className="mt-1.5 block text-[11.5px] font-bold uppercase tracking-[0.14em] text-cream/85 sm:text-[12px]">{p.teaches}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Plain text link (no capsule): underline + a small arrow that nudges on hover */}
                  <span
                    className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap pt-0.5 text-[13px] font-bold text-cream drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)] transition-opacity duration-300 sm:text-[14px] ${
                      isOpen ? "opacity-100" : "lg:opacity-0"
                    }`}
                  >
                    <span className="underline decoration-cream/45 decoration-2 underline-offset-[5px] transition-[text-decoration-color] duration-200 group-hover:decoration-sun">
                      See game details
                    </span>
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4 transition-transform duration-300 ease-(--ease-out) group-hover:translate-x-1"
                      fill="none"
                      aria-hidden
                    >
                      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>

                <div className="relative mt-auto flex items-end justify-center pt-6 sm:pt-8">
                  {p.cast.map((shape, k) => {
                    const visible = isOpen || k < 2;
                    return (
                      <motion.div
                        key={shape}
                        aria-hidden={!visible}
                        initial={false}
                        animate={
                          isOpen
                            ? {
                                width: "15.5%",
                                maxWidth: 135,
                                marginLeft: k === 0 ? "0%" : "1.2%",
                                marginRight: k === p.cast.length - 1 ? "0%" : "1.2%",
                                opacity: 1,
                                y: 0,
                                scale: 1,
                              }
                            : k < 2
                              ? {
                                  width: "36%",
                                  maxWidth: 155,
                                  marginLeft: "2.5%",
                                  marginRight: "2.5%",
                                  opacity: 1,
                                  y: 0,
                                  scale: 1,
                                }
                              : {
                                  width: "0%",
                                  maxWidth: 0,
                                  marginLeft: "0%",
                                  marginRight: "0%",
                                  opacity: 0,
                                  y: 44,
                                  scale: 0.75,
                                }
                        }
                        transition={{
                          duration: 0.65,
                          ease: SMOOTH_EASE,
                          delay: isOpen && k >= 2 ? 0.04 * (k - 1) : 0,
                        }}
                        className="origin-bottom overflow-visible"
                      >
                        <Oodle world={p.world} shape={shape} className="h-auto w-full drop-shadow-[0_6px_0_rgb(30_34_45/0.25)]" sizes="180px" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <GameModal
            key={skills.panels[selected].world}
            game={gameDetails[skills.panels[selected].world]}
            theme={skills.panels[selected]}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
