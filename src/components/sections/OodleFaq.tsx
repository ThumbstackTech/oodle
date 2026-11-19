"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState, useSyncExternalStore } from "react";
import { faq } from "@/content/site";
import Oodle from "../ui/Oodle";
import { MaskLines } from "../ui/Reveal";

const EASE = [0.23, 1, 0.32, 1] as const;

const DESKTOP = "(min-width: 1024px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}
// zig-zag the lineup so it reads hand-placed, like a sticker column
const NUDGE = ["0%", "18%", "4%", "22%", "2%", "16%", "6%", "20%"];
const TILT = [-6, 5, -3, 7, -5, 4, -7, 3];

function Answer({ text }: { text: string }) {
  // "Freebie Factory" becomes a link to that section
  const [a, b] = text.split("Freebie Factory");
  if (b === undefined) return <>{text}</>;
  return (
    <>
      {a}
      <a href="#freebies" className="font-semibold text-ink underline decoration-tomato decoration-2 underline-offset-4">
        Freebie Factory
      </a>
      {b}
    </>
  );
}

/**
 * FAQs. Left: the Oodle crew stacked like a sticker column, with a hand-drawn brace and note.
 * Right: accordions. Each question has its own Oodle — open a question and its Oodle steps out;
 * tap an Oodle and its question opens.
 */
export default function OodleFaq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  const desktop = useIsDesktop();
  const [before, after] = faq.headline.split(faq.highlight);
  const toggle = (i: number) => setOpen((o) => (o === i ? null : i));

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative overflow-x-clip bg-cream py-14 text-ink sm:py-[clamp(96px,14vh,160px)]">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <h2
            id="faq-title"
            aria-label={faq.headline}
            className="font-display text-[clamp(1.8rem,min(4vw,6.4svh),4rem)] leading-[0.95] [text-wrap:balance]"
          >
            <MaskLines
              lines={[
                <span key="h" aria-hidden>
                  {before}
                  <span className="text-tomato">{faq.highlight}</span>
                  {after}
                </span>,
              ]}
            />
          </h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-[clamp(40px,7vh,80px)] sm:gap-10 lg:grid-cols-12 lg:gap-8">
          {/* The crew */}
          <div className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              {/* mobile/tablet: a row; desktop: a zig-zag column with brace + note */}
              <ul
                aria-label="Pick an Oodle to open its question"
                className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-3 pr-8 pt-9 sm:-mx-8 sm:px-8 sm:pr-10 lg:mx-0 lg:pr-0 lg:w-[46%] lg:flex-col lg:gap-0 lg:overflow-visible lg:p-0"
              >
                {faq.items.map((it, i) => {
                  const on = open === i;
                  return (
                    <li key={it.q} className="shrink-0 lg:-my-1" style={{ ["--nudge" as string]: NUDGE[i] }}>
                      <motion.button
                        type="button"
                        onClick={() => toggle(i)}
                        aria-label={`Open: ${it.q}`}
                        aria-controls={`${uid}-panel-${i}`}
                        className="relative block w-[64px] cursor-pointer sm:w-[76px] lg:ml-[var(--nudge)] lg:w-[clamp(68px,6.4vw,92px)]"
                        initial={{ opacity: 0, y: 24, rotate: 0 }}
                        whileInView={{ opacity: 1, y: 0, rotate: TILT[i] }}
                        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                        transition={{ type: "spring", duration: 0.7, bounce: 0.35, delay: i * 0.05 }}
                        whileHover={{ scale: 1.08, rotate: 0 }}
                        whileTap={{ scale: 0.94 }}
                      >
                        <motion.span
                          className="block origin-bottom"
                          animate={on ? (desktop ? { x: 14, y: -6, scale: 1.18, rotate: -TILT[i] } : { x: 0, y: -12, scale: 1.1, rotate: -TILT[i] }) : { x: 0, y: 0, scale: 1, rotate: 0 }}
                          transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
                        >
                          <Oodle
                            world={it.world}
                            shape={it.shape}
                            className={`h-auto w-full transition-[filter] duration-300 ${on ? "sticker" : "drop-shadow-[0_4px_0_rgb(30_34_45/0.15)]"}`}
                            sizes="96px"
                          />
                        </motion.span>
                        <AnimatePresence>
                          {on && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.12 } }}
                              transition={{ type: "spring", duration: 0.4, bounce: 0.5 }}
                              className="absolute -right-2 -top-4 grid h-7 w-7 place-items-center rounded-full border-2 border-ink bg-sun font-display text-[15px] leading-none text-ink lg:-right-6"
                              aria-hidden
                            >
                              ?
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </li>
                  );
                })}
              </ul>

              {/* hand-drawn brace + note (desktop) */}
              <div aria-hidden className="pointer-events-none absolute left-[50%] top-0 hidden h-full w-[50%] items-center lg:flex">
                <svg viewBox="0 0 60 600" preserveAspectRatio="none" className="h-[86%] w-[44px] shrink-0 text-ink/45">
                  <motion.path
                    d="M8 6 C 40 8, 34 60, 30 150 C 26 240, 30 280, 54 300 C 30 320, 26 360, 30 450 C 34 540, 40 592, 8 594"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.3 }}
                  />
                </svg>
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: EASE, delay: 1.1 }}
                  className="ml-3 max-w-[13ch] -rotate-3 font-display text-[clamp(18px,1.6vw,24px)] leading-[1.1] text-slate"
                >
                  {faq.crewNote}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Accordions */}
          <ul className="flex min-w-0 flex-col gap-3 lg:col-span-8 lg:gap-4">
            {faq.items.map((it, i) => {
              const on = open === i;
              return (
                <motion.li
                  key={it.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                  className={`overflow-hidden rounded-[22px] border-[2.5px] border-ink transition-[background-color,box-shadow] duration-300 ${
                    on ? "bg-sun shadow-[0_6px_0_0_var(--color-ink)]" : "bg-cream shadow-[0_3px_0_0_var(--color-ink)] hover:bg-[color-mix(in_srgb,var(--color-sun)_22%,var(--color-cream))]"
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      id={`${uid}-btn-${i}`}
                      aria-expanded={on}
                      aria-controls={`${uid}-panel-${i}`}
                      onClick={() => toggle(i)}
                      className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-7 sm:py-5"
                    >
                      <span className="tabular w-7 shrink-0 text-[13px] font-bold text-ink/45">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-[clamp(1rem,1.5vw,1.25rem)] font-semibold leading-snug">{it.q}</span>
                      <span
                        aria-hidden
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-ink transition-[transform,background-color] duration-300 ease-(--ease-out) ${
                          on ? "rotate-45 bg-ink text-cream" : "bg-cream text-ink"
                        }`}
                      >
                        <svg viewBox="0 0 20 20" className="h-4 w-4">
                          <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`${uid}-panel-${i}`}
                        role="region"
                        aria-labelledby={`${uid}-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ height: { duration: 0.35, ease: EASE }, opacity: { duration: 0.25 } }}
                      >
                        <p className="max-w-[62ch] px-5 pb-5 pl-[4.25rem] text-[clamp(0.95rem,1.25vw,1.08rem)] leading-[1.65] text-ink/80 sm:px-7 sm:pb-6 sm:pl-[4.75rem]">
                          <Answer text={it.a} />
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
