"use client";

import { motion } from "motion/react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { storyFull } from "@/content/site";
import { Particle } from "../portal/particles";
import PlaytestScene from "../ui/PlaytestScene";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * "Get to Know Us" — the founder story as a letter from Olinda.
 * Desktop: centred dialog. Phones: full-screen sheet. Content verbatim from the copy doc.
 */
export default function StoryModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [before] = storyFull.headline.split(storyFull.highlight);

  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    window.__lenis?.stop();
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.__lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const trap = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const f = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-stretch justify-center text-ink sm:items-center sm:p-6" onKeyDown={trap}>
      <motion.button
        type="button"
        aria-label="Close our story"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/60 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-cream sm:h-auto sm:max-h-[90svh] sm:max-w-[920px] sm:rounded-[32px] sm:border-[3px] sm:border-ink sm:shadow-[0_12px_0_0_var(--color-ink)]"
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.5, bounce: 0.2 } }}
        exit={{ opacity: 0, y: 14, scale: 0.98, transition: { duration: 0.18, ease: EASE } }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center btn-soft rounded-full bg-cream text-ink transition-[transform,box-shadow] duration-[120ms] active:translate-y-[4px] active:[--btn-depth:0px] sm:right-5 sm:top-5"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </button>

        <div data-lenis-prevent className="oodle-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* Header */}
          <header className="relative overflow-hidden border-b-[3px] border-ink bg-forest px-6 pb-10 pt-12 text-cream sm:px-10 sm:pt-12">
            <svg aria-hidden viewBox="0 0 900 300" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
              <path d="M -20 60 C 160 20, 320 220, 520 150 C 700 90, 640 10, 560 40 C 470 80, 560 220, 720 230 C 820 236, 880 200, 940 210" fill="none" stroke="var(--color-leaf)" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" />
            </svg>
            <div className="relative grid items-center gap-8 sm:grid-cols-[1fr_auto]">
              <div className="pr-10 sm:pr-0">
                <span className="text-[13px] font-medium text-cream/70">{storyFull.kicker}</span>
                <h2 id="story-modal-title" className="mt-2 font-display text-[clamp(1.9rem,4.2vw,3.25rem)] leading-[0.95] [text-wrap:balance]">
                  {before}
                  <span className="text-sun">{storyFull.highlight}</span>
                </h2>
              </div>
              {/* mini polaroid */}
              <motion.div
                className="mx-auto w-[200px] sm:mr-4 sm:w-[220px]"
                initial={{ rotate: -12, y: 20, opacity: 0 }}
                animate={{ rotate: 4, y: 0, opacity: 1 }}
                transition={{ type: "spring", duration: 0.8, bounce: 0.3, delay: 0.15 }}
              >
                <div className="card-soft relative rounded-[8px] bg-cream p-[6%] pb-[18%] shadow-[0_2px_6px_-2px_rgb(0_0_0/0.2),0_22px_40px_-20px_rgb(0_0_0/0.5)]">
                  <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-sm bg-sun/85" />
                  <div className="relative aspect-[4/4.2] overflow-hidden rounded-[5px]">
                    <PlaytestScene detailed={false} className="absolute inset-0 h-full w-full" />
                  </div>
                  <p className="absolute inset-x-0 bottom-[4%] text-center font-display text-[15px] text-ink">Playtest #1</p>
                </div>
              </motion.div>
            </div>
          </header>

          {/* The path */}
          <div className="border-b-[3px] border-ink bg-[color-mix(in_srgb,var(--color-sun)_30%,var(--color-cream))] px-6 py-6 sm:px-10">
            <ol className="no-scrollbar -mx-6 flex items-center gap-2 overflow-x-auto px-6 sm:mx-0 sm:justify-between sm:px-0">
              {storyFull.path.map((p, i) => (
                <li key={p.label} className="flex shrink-0 items-center gap-2">
                  <motion.span
                    className="flex items-center gap-2 rounded-full border-2 border-ink bg-cream py-1 pl-1 pr-3 text-[13px] font-semibold"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.25 + i * 0.07 }}
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-sun">
                      <Particle icon={p.icon} className="h-5 w-5" />
                    </span>
                    {p.label}
                  </motion.span>
                  {i < storyFull.path.length - 1 && (
                    <svg viewBox="0 0 30 12" className="h-3 w-6 shrink-0 text-ink/40" fill="none" aria-hidden>
                      <path d="M1 6c6-6 10 6 16 0s8 0 12 0m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </li>
              ))}
            </ol>
          </div>

          {/* The letter */}
          <article className="mx-auto max-w-[680px] px-6 py-10 sm:px-10 sm:py-12">
            {storyFull.chapters.map((c, i) => (
              <section key={c.title} className={i ? "mt-10" : ""}>
                <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.8rem)] leading-none">
                  {c.title}
                </h3>
                <div className="mt-4 space-y-4 text-[clamp(1rem,1.25vw,1.08rem)] leading-[1.75] text-ink/80">
                  {c.paras.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {c.pull && (
                  <blockquote className="relative my-8 -rotate-1 rounded-[22px] border-[2.5px] border-ink bg-lilac px-6 py-5 text-cream shadow-[0_5px_0_0_var(--color-ink)] sm:px-8">
                    <span aria-hidden className="absolute -top-5 left-5 font-display text-[54px] leading-none text-sun">“</span>
                    <p className="font-display text-[clamp(1.3rem,2.4vw,1.75rem)] leading-[1.1]">{c.pull}</p>
                  </blockquote>
                )}
              </section>
            ))}

            {/* Closing */}
            <div className="mt-12 border-t-2 border-dashed border-ink/20 pt-10">
              <div className="space-y-2 font-display text-[clamp(1.35rem,2.6vw,1.9rem)] leading-[1.15]">
                {storyFull.closing.map((l, i) => (
                  <p key={l} className={i === storyFull.closing.length - 1 ? "text-forest" : ""}>
                    {l}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="-rotate-3 font-display text-[44px] leading-none text-slate">{storyFull.signature}</p>
                  <p className="mt-1 text-[13px] font-semibold text-ink/60">Founder, Oodle Learn · and Orai, chief playtester</p>
                </div>
                <span className="-rotate-2 rounded-full border-[2.5px] border-ink bg-sun px-5 py-2 text-[15px] font-semibold shadow-[0_4px_0_0_var(--color-ink)]">
                  {storyFull.signoff}
                </span>
              </div>
            </div>
          </article>
        </div>
      </motion.div>
    </div>
  );
}
