"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent } from "react";
import type { GameDetail, Shape } from "@/content/site";
import { Particle } from "../portal/particles";
import { Button } from "../ui/Button";
import Oodle from "../ui/Oodle";

const EASE = [0.23, 1, 0.32, 1] as const;

export type GameTheme = { hex: string; bg: string; chip: string; pattern: string; cast: Shape[] };

/** Accent tiles per world (palette only). */
const TILE: Record<GameDetail["world"], string[]> = {
  money: ["bg-sun text-ink", "bg-leaf text-ink", "bg-cream text-ink", "bg-forest text-cream"],
  solve: ["bg-sun text-ink", "bg-lilac text-cream", "bg-cream text-ink", "bg-slate text-cream"],
  biz: ["bg-sun text-ink", "bg-ochre text-cream", "bg-cream text-ink"],
};
const ACCENT: Record<GameDetail["world"], string> = { money: "text-forest", solve: "text-lilac", biz: "text-crimson" };

const MOBILE = "(max-width: 639px)";
function useIsMobile() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(MOBILE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(MOBILE).matches,
    () => false,
  );
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`font-display text-[clamp(1.45rem,2.6vw,2.1rem)] leading-[1] text-ink ${className}`}>{children}</h3>;
}

/**
 * Game details modal. Desktop: centred dialog; mobile: bottom sheet. World-coloured header with the
 * game's cast, then every section from the copy doc, and a sticky buy bar.
 */
export default function GameModal({
  game,
  theme,
  onClose,
}: {
  game: GameDetail;
  theme: GameTheme;
  onClose: () => void;
}) {
  const mobile = useIsMobile();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `game-modal-${game.world}`;
  const tiles = TILE[game.world];

  // Lock page scroll (native + Lenis), Esc to close, focus the close button.
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

  // Keep Tab inside the dialog.
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

  const hasLink = Boolean(game.buyHref);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" onKeyDown={trap}>
      {/* Backdrop */}
      <motion.button
        type="button"
        aria-label="Close game details"
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
        aria-labelledby={titleId}
        className="relative flex max-h-[94svh] w-full flex-col overflow-hidden rounded-t-[28px] border-[3px] border-b-0 border-ink bg-cream shadow-[0_-6px_0_0_rgb(30_34_45/0.25)] sm:max-h-[90svh] sm:max-w-[1080px] sm:rounded-[32px] sm:border-b-[3px] sm:shadow-[0_12px_0_0_var(--color-ink)]"
        initial={mobile ? { y: "100%" } : { opacity: 0, scale: 0.96, y: 24 }}
        animate={mobile ? { y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.12 } } : { opacity: 1, scale: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.2 } }}
        exit={mobile ? { y: "100%", transition: { duration: 0.22, ease: EASE } } : { opacity: 0, scale: 0.97, y: 12, transition: { duration: 0.18, ease: EASE } }}
      >
        {/* Close */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border-[2.5px] border-ink bg-cream text-ink shadow-[0_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-[120ms] active:translate-y-[4px] active:shadow-none sm:right-5 sm:top-5"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
        </button>

        {/* Scrollable body */}
        <div data-lenis-prevent className="oodle-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {/* Header */}
          <header className={`relative overflow-hidden border-b-[3px] border-ink ${theme.bg} px-6 pt-8 text-cream sm:px-10 sm:pt-10`}>
            <Image src={theme.pattern} alt="" aria-hidden fill sizes="1080px" className="object-cover opacity-45" />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse 80% 75% at 18% 22%, ${theme.hex} 40%, transparent 85%), linear-gradient(to top, ${theme.hex} 8%, transparent 45%)` }}
            />
            <div className="relative pr-12">
              <span className={`inline-block rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${theme.chip}`}>
                The Oodle Play Lab
              </span>
              <h2
                id={titleId}
                className="mt-3 font-display text-[clamp(2.6rem,6vw,4.75rem)] leading-[0.92] text-sun [-webkit-text-stroke:0.06em_var(--color-ink)] [paint-order:stroke_fill] [text-shadow:0_4px_0_var(--color-ink)]"
              >
                {game.name}
              </h2>
              <p className="mt-2 text-[clamp(1rem,1.6vw,1.25rem)] font-semibold text-cream drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]">{game.tagline}</p>
            </div>
            {/* the cast */}
            <div className="relative mt-6 flex items-end justify-center gap-[1.5%] sm:mt-8">
              {theme.cast.map((shape, k) => (
                <motion.div
                  key={shape}
                  className={`w-[15%] max-w-[120px] origin-bottom ${k >= 4 ? "max-sm:hidden" : "max-sm:w-[22%]"}`}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 6, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.35, delay: 0.12 + k * 0.05 }}
                >
                  <Oodle world={game.world} shape={shape} className="sticker h-auto w-full" sizes="120px" />
                </motion.div>
              ))}
            </div>
          </header>

          <div className="space-y-12 px-6 py-10 sm:space-y-14 sm:px-10 sm:py-12">
            {/* About */}
            <section className="grid gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <span className="text-[13px] font-medium text-ink/60">What&apos;s the game about?</span>
                <p className={`mt-2 font-display text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.05] ${ACCENT[game.world]}`}>{game.hook}</p>
              </div>
              <div className="space-y-3 text-[clamp(0.98rem,1.2vw,1.08rem)] leading-[1.7] text-ink/80 lg:col-span-7">
                {game.about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>

            {/* Quick facts */}
            <section>
              <SectionTitle>Quick game facts</SectionTitle>
              <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {game.facts.map((f) => (
                  <div key={f.label} className="flex flex-col rounded-[20px] border-[2.5px] border-ink bg-cream p-4 shadow-[0_4px_0_0_var(--color-ink)]">
                    <Particle icon={f.icon} className="h-9 w-9" />
                    <dt className="mt-3 text-[12px] font-bold uppercase tracking-[0.12em] text-ink/55">{f.label}</dt>
                    <dd className="mt-1 text-[15px] font-semibold leading-snug text-ink">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Feature block */}
            <section>
              <SectionTitle>{game.feature.title}</SectionTitle>
              <ul className={`mt-5 grid gap-3 sm:grid-cols-2 ${game.feature.items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}>
                {game.feature.items.map((it, i) => (
                  <li
                    key={it.name}
                    className={`relative flex flex-col rounded-[22px] border-[2.5px] border-ink p-5 shadow-[0_5px_0_0_var(--color-ink)] ${tiles[i % tiles.length]}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-[clamp(1.5rem,2.2vw,1.9rem)] leading-none">
                        {game.world === "biz" ? `${i + 1}. ` : ""}
                        {it.name}
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-ink bg-cream">
                        <Particle icon={it.icon} className="h-7 w-7" />
                      </span>
                    </div>
                    {it.title && <p className="mt-3 text-[15px] font-bold">{it.title}</p>}
                    <p className={`${it.title ? "mt-1" : "mt-3"} text-[14.5px] leading-[1.55] opacity-90`}>{it.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* How to play */}
            <section className="grid gap-6 rounded-[26px] border-[2.5px] border-ink bg-[color-mix(in_srgb,var(--color-sun)_28%,var(--color-cream))] p-6 sm:p-8 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <span className="text-[13px] font-medium text-ink/60">How to play</span>
                <p className="mt-2 font-display text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.05] text-ink">{game.howTo.headline}</p>
              </div>
              <div className="lg:col-span-7">
                <ol className="space-y-3">
                  {game.howTo.body.map((p, i) => (
                    <li key={p} className="flex gap-3 text-[clamp(0.98rem,1.2vw,1.06rem)] leading-[1.65] text-ink/85">
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink bg-cream text-[12px] font-bold">{i + 1}</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ol>
                {game.howTo.wins && (
                  <div className="mt-4 flex flex-wrap gap-2 pl-10">
                    {game.howTo.wins.map((w, i) => (
                      <span
                        key={w}
                        className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-ink bg-sun px-4 py-1.5 text-[14px] font-bold text-ink shadow-[0_3px_0_0_var(--color-ink)]"
                        style={{ rotate: `${i ? 1.5 : -1.5}deg` }}
                      >
                        <Particle icon="trophy" className="h-5 w-5" />
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Inside the box + practise */}
            <div className="grid gap-10 lg:grid-cols-12">
              <section className="lg:col-span-5">
                <SectionTitle>What&apos;s inside the box?</SectionTitle>
                <ul className="mt-5 space-y-2.5">
                  {game.inBox.map((x) => (
                    <li key={x} className="flex items-start gap-3 rounded-[16px] border-2 border-ink/15 bg-cream px-4 py-3 text-[15px] font-medium text-ink">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-cream">
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                          <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </section>
              <section className="lg:col-span-7">
                <SectionTitle>{game.practiseTitle}</SectionTitle>
                {game.world === "money" && (
                  <p className="mt-2 text-[15px] text-ink/70">By the time children finish playing, they will have had the opportunity to practise:</p>
                )}
                <ul className="mt-5 flex flex-wrap gap-2.5">
                  {game.practise.map((x, i) => (
                    <li
                      key={x}
                      className={`rounded-full border-[2.5px] border-ink px-4 py-2 text-[14px] font-semibold ${i % 3 === 0 ? "bg-sun text-ink" : i % 3 === 1 ? "bg-cream text-ink" : `${theme.bg} text-cream`}`}
                    >
                      {x}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* For the grown-ups */}
            <section className="relative rounded-[26px] border-[2.5px] border-ink bg-cream p-6 pt-8 shadow-[0_5px_0_0_var(--color-ink)] sm:p-8 sm:pt-10">
              <span aria-hidden className={`absolute -top-6 left-6 font-display text-[64px] leading-none ${ACCENT[game.world]}`}>“</span>
              <SectionTitle>For the grown-ups</SectionTitle>
              <div className="mt-3 space-y-3 text-[clamp(0.98rem,1.2vw,1.08rem)] leading-[1.7] text-ink/80">
                {game.grownUps.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sticky buy bar */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t-[3px] border-ink bg-cream px-6 py-4 sm:px-10">
          <div className="flex items-center gap-3">
            <Button href={game.buyHref || "#"} disabled={!hasLink}>
              {game.buyLabel}
            </Button>
          </div>
          <button type="button" onClick={onClose} className="hidden text-[14px] font-semibold text-ink/70 underline-offset-4 hover:text-ink hover:underline sm:inline">
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}
