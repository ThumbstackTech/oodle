"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { footer } from "@/content/site";
import { Particle } from "../portal/particles";
import Oodle from "../ui/Oodle";
import PatternBg from "../ui/PatternBg";

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
    </div>
  );
}

/**
 * Oodle-style Instagram mark: a chunky tomato camera whose lens is a smiling Oodle face,
 * with a little sun sparkle for the flash. Brand palette only.
 */
function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      {/* soft drop */}
      <rect x="2.5" y="3.5" width="27" height="27" rx="9" fill="#1e222d" opacity="0.14" />
      {/* camera body */}
      <rect x="2" y="2" width="27" height="27" rx="9" fill="#ea3d39" />
      <rect x="5.2" y="5.2" width="20.6" height="20.6" rx="6.4" stroke="#e4e1cf" strokeWidth="2" />
      {/* lens = Oodle face */}
      <circle cx="15.5" cy="16" r="6.2" fill="#f2d439" />
      <circle cx="13.4" cy="15.1" r="1.05" fill="#1e222d" />
      <circle cx="17.6" cy="15.1" r="1.05" fill="#1e222d" />
      <path d="M13.2 17.6q2.3 2.1 4.6 0" stroke="#1e222d" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="11.9" cy="17.4" r="0.9" fill="#ea3d39" opacity="0.45" />
      <circle cx="19.1" cy="17.4" r="0.9" fill="#ea3d39" opacity="0.45" />
      {/* flash sparkle */}
      <path d="M22.4 7.2l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7z" fill="#f2d439" />
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
          <PatternBg src="/patterns/solve.svg" className="opacity-[0.12]" />

          {/* Top: brand + links */}
          <div className="relative grid gap-10 px-6 pb-6 pt-10 sm:px-10 sm:pt-12 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:pt-14">
            <div className="lg:col-span-6">
              <Link href="/" scroll aria-label="Oodle Learn — home" className="relative block w-fit">
                <Image src="/brand/logo-light.svg" alt="Oodle Learn" width={144} height={64} loading="eager" className="h-14 w-auto sm:h-16" />
              </Link>
              <p className="mt-5 max-w-[16ch] font-display text-[clamp(1.8rem,3.4vw,3rem)] leading-[0.98]">
                {footer.tagline.lead} <span className="text-sun">{footer.tagline.word}</span>
              </p>
              <a
                href={footer.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex items-center gap-2.5 btn-soft rounded-full bg-cream py-2 pl-2 pr-5 text-[15px] font-bold text-ink transition-[transform,box-shadow] duration-[120ms] active:translate-y-[4px] active:[--btn-depth:0px] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5"
              >
                <InstagramIcon className="h-8 w-8 transition-transform duration-300 ease-(--ease-out) [@media(hover:hover)_and_(pointer:fine)]:group-hover:-rotate-[8deg] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-110" />
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
          </div>

          {/* Agency credit: "A Thumbstack. Website" */}
          <p className="relative flex items-baseline gap-[0.35em] px-6 pt-9 text-[clamp(16px,1.4vw,19px)] font-medium leading-none text-cream sm:px-10 sm:pt-10 lg:px-14">
            A
            {/* logo cap height ≈ Poppins cap height (~0.7em); sits on the text baseline */}
            <a
              href="https://thumbstack.co"
              target="_blank"
              rel="noopener"
              aria-label="Thumbstack (opens in a new tab)"
              className="self-baseline rounded-sm opacity-100 outline-none transition-opacity duration-200 hover:opacity-75 focus-visible:ring-2 focus-visible:ring-sun focus-visible:ring-offset-4 focus-visible:ring-offset-slate"
            >
              <Image src="/brand/thumbstack.svg" alt="Thumbstack" width={84} height={11} className="block h-[0.72em] w-auto" />
            </a>
            Website
          </p>

          {/* Bottom bar */}
          <div className="relative mt-6 flex flex-col gap-3 border-t border-cream/15 px-6 pb-5 pt-5 text-[13px] text-cream/75 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-14">
            <p>© 2026 Oodle Learn</p>
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
