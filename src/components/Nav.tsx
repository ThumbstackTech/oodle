"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { Button } from "./ui/Button";
import Oodle from "./ui/Oodle";

/** Official Oodle Learn logo (public/brand). `light` swaps to the cream version for dark backgrounds. */
function Wordmark({ light = false, href = "/", onClick }: { light?: boolean; href?: string; onClick?: () => void }) {
  return (
    <Link href={href} scroll onClick={onClick} aria-label="Oodle Learn — home" className="group relative block h-10 w-[90px] shrink-0 sm:h-11 sm:w-[99px]">
      <Image
        src="/brand/logo.svg"
        alt="Oodle Learn"
        fill
        priority
        sizes="100px"
        className={`object-contain object-left transition-[opacity,transform] duration-300 ease-(--ease-out) [@media(hover:hover)_and_(pointer:fine)]:group-hover:-rotate-3 ${light ? "opacity-0" : "opacity-100"}`}
      />
      <Image
        src="/brand/logo-light.svg"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100px"
        className={`object-contain object-left transition-[opacity,transform] duration-300 ease-(--ease-out) [@media(hover:hover)_and_(pointer:fine)]:group-hover:-rotate-3 ${light ? "opacity-100" : "opacity-0"}`}
      />
    </Link>
  );
}

const EASE = [0.23, 1, 0.32, 1] as const;

/** `onDark`: the nav starts over a dark hero, so links/wordmark are cream until the bar turns solid on scroll. */
export default function Nav({ onDark = false }: { onDark?: boolean }) {
  const onHome = usePathname() === "/";
  const to = (h: string) => (onHome || !h.startsWith("#") ? h : `/${h}`);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          aria-label="Main"
          className={`mx-auto flex h-16 max-w-[1320px] items-center justify-between rounded-full border-[2.5px] pl-5 pr-2 transition-[background-color,border-color,box-shadow] duration-300 ease-(--ease-out) ${
            scrolled ? "border-ink bg-cream shadow-[0_5px_0_0_var(--color-ink)]" : "border-transparent bg-transparent"
          }`}
        >
          <Wordmark light={onDark && !scrolled} />

          <ul className="hidden items-center gap-0.5 lg:flex">
            {nav.links.slice(1).map((l) => (
              <li key={l.href}>
                <a
                  href={to(l.href)}
                  className={`whitespace-nowrap rounded-full px-3 py-2 text-[14px] font-semibold transition-colors duration-200 ${
                    onDark && !scrolled ? "text-cream/85 hover:bg-cream/10 hover:text-cream" : "text-ink/80 hover:bg-ink/[0.07] hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <div className="hidden pb-[5px] sm:block">
              <Button href={to(nav.cta.href)} size="sm">
                {nav.cta.label}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center rounded-full border-[2.5px] border-ink bg-sun transition-transform duration-[120ms] active:scale-[0.95] lg:hidden"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden>
                <span className="h-[2.5px] w-5 rounded-full bg-ink" />
                <span className="h-[2.5px] w-3.5 rounded-full bg-ink" />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)", transition: { duration: 0.55, ease: EASE } }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)", transition: { duration: 0.3, ease: EASE } }}
            className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-lilac px-5 pb-8 pt-5 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <Wordmark light onClick={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border-[2.5px] border-ink bg-cream text-ink active:scale-[0.95]"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ul className="mt-10 flex flex-col gap-1">
              {nav.links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { type: "spring", duration: 0.5, bounce: 0.25, delay: 0.12 + i * 0.05 } }}
                >
                  <a
                    href={to(l.href)}
                    onClick={() => setOpen(false)}
                    className="block py-2 font-display text-[clamp(34px,10vw,52px)] leading-[1.05] text-cream"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto">
              <Button href={to(nav.cta.href)} className="w-full">
                {nav.cta.label}
              </Button>
            </div>
            <Oodle world="solve" shape="star" className="pointer-events-none absolute -right-4 bottom-28 h-36 w-auto rotate-12" />
            <Oodle world="money" shape="coin" className="pointer-events-none absolute bottom-24 right-28 h-20 w-auto -rotate-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
