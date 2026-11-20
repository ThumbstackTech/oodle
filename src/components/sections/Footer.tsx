"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { footer } from "@/content/site";
import { Particle } from "../portal/particles";
import Oodle from "../ui/Oodle";
import SpeechBubble from "../ui/SpeechBubble";

type Member = (typeof footer.parade)[number];
const CAST = footer.parade;
const UNCOLOURED = "grayscale(1) brightness(1.75) contrast(1.15)";

/** One figure in a lineup. Oodles are larger, props smaller and sit lower. */
function Figure({ m, className = "", imgClass = "", style }: { m: Member; className?: string; imgClass?: string; style?: React.CSSProperties }) {
  if ("prop" in m)
    return (
      <span className={`block w-[clamp(30px,2.8vw,60px)] shrink-0 self-end overflow-visible p-1 pb-[2%] ${className}`} style={style}>
        <Particle icon={m.prop} className={`block h-auto w-full overflow-visible p-0.5 ${imgClass}`} />
      </span>
    );
  return (
    <span className={`block h-[clamp(76px,8.8vw,196px)] shrink-0 overflow-visible p-1 ${className}`} style={style}>
      <Oodle world={m.world} shape={m.shape} className={`h-full w-auto overflow-visible p-1 ${imgClass}`} sizes="140px" />
    </span>
  );
}

/** A loaf cat napping at the end of a strip. Hover (or tap) and it says meow. */
function SleepyCat({ coloured = true }: { coloured?: boolean }) {
  const [awake, setAwake] = useState(false);
  const timer = useRef(0);
  const meow = () => {
    setAwake(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAwake(false), 1600);
  };
  return (
    <button
      type="button"
      aria-label="A sleepy cat. Meow!"
      onPointerEnter={(e) => e.pointerType === "mouse" && meow()}
      onClick={meow}
      className="relative block shrink-0 cursor-pointer self-end overflow-visible"
    >
      <AnimatePresence>
        {awake && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.5 }}
            style={{ originX: 0.5, originY: 1 }}
            className="absolute bottom-[78%] left-[30%] z-10 -translate-x-1/2"
          >
            <SpeechBubble className="font-display !text-[16px] sm:!text-[18px]">meow!</SpeechBubble>
          </motion.span>
        )}
      </AnimatePresence>
      <motion.span
        className="block origin-bottom"
        animate={awake ? { scaleY: [1, 1.08, 1], y: [0, -6, 0] } : { scaleY: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      >
        <Image
          src="/oodles/extra/cat.svg"
          alt=""
          aria-hidden
          width={340}
          height={220}
          draggable={false}
          className={`pointer-events-none block h-[clamp(36px,3.6vw,80px)] w-auto select-none overflow-visible p-1 transition-[filter] duration-300 ${coloured ? "sticker" : ""}`}
          style={coloured || awake ? undefined : { filter: UNCOLOURED }}
        />
      </motion.span>
    </button>
  );
}

/** How many figures fit per breakpoint (the sleepy cat always gets the last spot on top of these). */
function fit(pos: number) {
  if (pos >= 10) return "max-xl:hidden";
  if (pos >= 8) return "max-lg:hidden";
  if (pos >= 6) return "max-md:hidden";
  if (pos >= 4) return "max-sm:hidden";
  return "";
}

/** Row 1 — full colour, sticker outline, pops in, hops on hover. */
function ColourRow() {
  return (
    <div className="flex items-end justify-between overflow-visible px-4 sm:px-6 lg:px-[3.5vw]">
      {CAST.map((m, i) => (
        <motion.span
          key={i}
          className={`block shrink-0 origin-bottom overflow-visible ${fit(i)}`}
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ type: "spring", duration: 0.6, bounce: 0.4, delay: i * 0.04 }}
          whileHover={{ y: -12, rotate: i % 2 ? 6 : -6 }}
        >
          <Figure m={m} imgClass="sticker" />
        </motion.span>
      ))}
      <SleepyCat />
    </div>
  );
}

/** Row 2 — the same crew, uncoloured. Hover (or tap) an Oodle to colour it in. */
function ColourMeInRow() {
  const [done, setDone] = useState<Set<number>>(() => new Set());
  const reversed = [...CAST].map((m, i) => ({ m, i })).reverse();
  const colour = (i: number) => setDone((s) => (s.has(i) ? s : new Set(s).add(i)));
  const toggle = (i: number) =>
    setDone((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <div className="flex items-end justify-between overflow-visible px-4 sm:px-6 lg:px-[3.5vw]">
      {reversed.map(({ m, i }, pos) => {
        const on = done.has(i);
        const isProp = "prop" in m;
        return (
          <button
            key={i}
            type="button"
            tabIndex={isProp ? -1 : 0}
            aria-label={isProp ? undefined : on ? "Coloured in!" : "Colour me in"}
            aria-hidden={isProp || undefined}
            onPointerEnter={(e) => e.pointerType === "mouse" && colour(i)}
            onClick={() => toggle(i)}
            className={`block shrink-0 cursor-pointer self-end overflow-visible transition-transform duration-200 ease-(--ease-out) active:scale-95 ${fit(pos)}`}
          >
            <Figure
              m={m}
              className="transition-[filter] duration-300 ease-(--ease-out)"
              style={{ filter: on ? "none" : UNCOLOURED }}
            />
          </button>
        );
      })}
      <SleepyCat coloured={false} />
    </div>
  );
}

/** Row 3 — a faint ghost of the crew, cut off by the frame. */
function GhostRow() {
  return (
    <div aria-hidden className="flex h-[clamp(32px,3.6vw,72px)] items-start justify-between overflow-hidden px-4 opacity-[0.13] mix-blend-luminosity sm:px-6 lg:px-[3.5vw]">
      {CAST.map((m, i) => (
        <Figure key={i} m={m} className={fit(i)} style={{ filter: "grayscale(1) brightness(2)" }} />
      ))}
    </div>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
    </svg>
  );
}

/**
 * Footer — inside a double-framed box (wireframe). The Oodle crew parades three times, inspired by the
 * full-colour / uncoloured / ghost lineup: hover the middle row to colour the crew in.
 */
export default function Footer() {
  return (
    <footer className="bg-cream px-3 pb-3 pt-6 sm:px-5 sm:pb-5">
      <div className="rounded-[40px] border-[3px] border-ink bg-slate p-[7px] shadow-[0_8px_0_0_var(--color-ink)] sm:p-[9px]">
        <div className="relative overflow-hidden rounded-[32px] border-2 border-cream/35 text-cream">
          {/* faint brand pattern */}
          <Image src="/patterns/solve.svg" alt="" aria-hidden fill sizes="100vw" className="object-cover opacity-[0.12]" />

          {/* Top: brand + links */}
          <div className="relative grid gap-10 px-6 pb-6 pt-10 sm:px-10 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:pt-14">
            <div className="lg:col-span-6">
              <Link href="/" scroll aria-label="Oodle Learn — home" className="relative block h-14 w-[126px] sm:h-16 sm:w-[144px]">
                <Image src="/brand/logo-light.svg" alt="Oodle Learn" fill sizes="150px" className="object-contain object-left" />
              </Link>
              <p className="mt-5 max-w-[16ch] font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[0.98]">
                {footer.tagline.lead} <span className="text-sun">{footer.tagline.word}</span>
              </p>
              <a
                href={footer.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2.5 rounded-full border-[2.5px] border-ink bg-cream py-2 pl-2 pr-5 text-[15px] font-bold text-ink shadow-[0_4px_0_0_var(--color-ink)] transition-[transform,box-shadow] duration-[120ms] active:translate-y-[4px] active:shadow-none [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-tomato text-cream">
                  <InstagramIcon className="h-[18px] w-[18px]" />
                </span>
                {footer.instagram.handle}
              </a>
            </div>

            <nav aria-label="Footer" className="lg:col-span-6 lg:pt-2">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:gap-x-10">
                {footer.links.map((l) => (
                  <li key={l.label}>
                    <a
                  href={l.href}
                  className="bg-[linear-gradient(var(--color-sun),var(--color-sun))] bg-[length:0%_2.5px] bg-left-bottom bg-no-repeat pb-1 text-[clamp(15px,1.4vw,18px)] font-semibold text-cream transition-[background-size,color] duration-300 ease-(--ease-out) hover:bg-[length:100%_2.5px] hover:text-sun"
                >
                  {l.label}
                </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* The parade */}
          <div className="relative overflow-x-clip overflow-y-visible pt-7 sm:pt-8">
            <ColourRow />
            <p className="mt-5 text-center font-display text-[clamp(15px,1.4vw,19px)] text-sun/90"><span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">{footer.hint.hover}</span>
              <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">{footer.hint.tap}</span>
            </p>
            <div className="mt-2">
              <ColourMeInRow />
            </div>
            <div className="mt-3">
              <GhostRow />
            </div>
          </div>

          {/* Bottom bar */}
          <div className="relative flex flex-col gap-3 border-t-2 border-cream/20 px-6 py-5 text-[13px] text-cream/75 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
            <p>
              © 2026 Oodle Learn <span className="mx-2 opacity-50">·</span> {footer.note}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {footer.legal.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="transition-colors duration-200 hover:text-sun">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
