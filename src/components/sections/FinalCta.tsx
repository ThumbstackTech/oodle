"use client";

import { motion, useAnimate } from "motion/react";
import { useRef, type ReactNode } from "react";
import { finalCta, type Shape, type World } from "@/content/site";
import { Button } from "../ui/Button";
import CardTrail from "../ui/CardTrail";
import Oodle from "../ui/Oodle";
import { MaskLines, Reveal } from "../ui/Reveal";

const VIEW = { once: true, margin: "0px 0px -15% 0px" } as const;

type Peek = { world: World; shape: Shape; cls: string; rot: number; front?: boolean };

/** A tilted, ink-outlined word block with an Oodle peeking from behind one corner. */
function WordBlock({
  children,
  fill,
  tilt,
  delay,
  peeks,
}: {
  children: ReactNode;
  fill: string;
  tilt: number;
  delay: number;
  peeks: Peek[];
}) {
  const [scope, animate] = useAnimate();
  const hop = () => {
    scope.current
      ?.querySelectorAll("[data-hop]")
      .forEach((el: Element) => animate(el, { y: [0, -14, 0] }, { duration: 0.5, ease: [0.23, 1, 0.32, 1] }));
  };
  return (
    <motion.span
      ref={scope}
      className="group relative mx-[0.06em] inline-block align-middle"
      initial={{ rotate: 0, scale: 0.9, opacity: 0 }}
      whileInView={{ rotate: tilt, scale: 1, opacity: 1 }}
      viewport={VIEW}
      transition={{ type: "spring", duration: 0.8, bounce: 0.35, delay }}
      onPointerEnter={(e) => e.pointerType === "mouse" && hop()}
    >
      {peeks.map((p, k) => (
        <motion.span
          key={p.shape}
          className={`pointer-events-none absolute block ${p.front ? "z-10" : "-z-10"} ${p.cls}`}
          initial={{ y: p.front ? "30%" : "60%", opacity: 0, rotate: p.rot }}
          whileInView={{ y: "0%", opacity: 1, rotate: p.rot }}
          viewport={VIEW}
          transition={{ type: "spring", duration: 0.7, bounce: 0.45, delay: delay + 0.35 + k * 0.1 }}
        >
          <span data-hop className="block origin-bottom">
            <Oodle world={p.world} shape={p.shape} className="h-auto w-full drop-shadow-[0_4px_0_rgb(30_34_45/0.2)]" sizes="140px" />
          </span>
        </motion.span>
      ))}
      <span
        className={`relative block rounded-[0.16em] border-[3px] border-ink px-[0.22em] pb-[0.1em] pt-[0.02em] shadow-[0_0.09em_0_0_var(--color-ink)] transition-[transform] duration-300 ease-(--ease-out) [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-[0.06em] ${fill}`}
      >
        {children}
      </span>
    </motion.span>
  );
}

/**
 * Final CTA. Inspo-style stacked headline with words in tilted colour blocks and Oodles peeking from
 * behind them. A smooth game-card trail follows the mouse across the section (but never over the CTA).
 */
export default function FinalCta() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      ref={ref}
      id="cta"
      aria-labelledby="cta-title"
      className="relative isolate flex min-h-[max(80svh,620px)] lg:min-h-[max(92svh,760px)] items-center justify-center overflow-hidden bg-cream px-5 py-[clamp(96px,12vh,136px)] text-ink sm:px-8"
    >
      <CardTrail areaRef={ref} />

      <div data-no-trail className="relative z-20 flex flex-col items-center px-[0.55em] text-center">
        <h2
          id="cta-title"
          aria-label={`${finalCta.lead} ${finalCta.blockA} ${finalCta.blockB}`}
          className="font-display text-[clamp(2.4rem,6vw,5.25rem)] lg:text-[clamp(3rem,4.6vw,4.4rem)] leading-[1.02]"
        >
          <span aria-hidden className="relative block">
            <MaskLines lines={[finalCta.lead]} />
          </span>
          <span aria-hidden className="mt-[0.18em] flex flex-wrap items-center justify-center gap-x-[0.5em] gap-y-[0.75em]">
            <WordBlock fill="bg-sun text-ink" tilt={-3} delay={0.15} peeks={[
                { world: "money", shape: "clover", cls: "-left-[0.62em] -top-[0.86em] w-[1.05em]", rot: -14 },
                { world: "solve", shape: "tri", cls: "-bottom-[0.66em] -left-[0.7em] w-[0.95em]", rot: -10, front: true },
              ]}>
              {finalCta.blockA}
            </WordBlock>
            <WordBlock fill="bg-forest text-cream" tilt={2.5} delay={0.28} peeks={[
                { world: "money", shape: "coin", cls: "-right-[0.62em] -top-[0.86em] w-[1.05em]", rot: 14 },
                { world: "biz", shape: "blob", cls: "-bottom-[0.68em] -right-[0.66em] w-[1em]", rot: 10, front: true },
              ]}>
              {finalCta.blockB}
            </WordBlock>
          </span>
        </h2>

        <Reveal delay={0.35} className="mt-[clamp(48px,7svh,72px)]">
          <p className="max-w-[40ch] text-[clamp(1rem,min(1.9vw,2.9svh),1.5rem)] font-medium lg:text-[clamp(1rem,1.35vw,1.25rem)] leading-[1.5] text-ink/80">{finalCta.sub}</p>
        </Reveal>
        <Reveal delay={0.45} className="mt-7">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Button href={finalCta.cta.href}>{finalCta.cta.label}</Button>
            <Button href={finalCta.buy.href} tone="cream">
              {finalCta.buy.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
