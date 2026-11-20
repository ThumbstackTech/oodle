"use client";

import { motion } from "motion/react";
import { useState, useSyncExternalStore } from "react";
import { difference } from "@/content/site";
import { Particle } from "../portal/particles";
import Oodle from "../ui/Oodle";
import { MaskLines, Reveal } from "../ui/Reveal";

const REST_TILT = [-5.5, 3.2, -3.8, 4.2, -3.2];

const DESKTOP_MQ = "(min-width: 1024px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP_MQ);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP_MQ).matches,
    () => true,
  );
}
const REST_Y = [10, -8, 16, -6, 12];
const ACTIVE_TILT = [-2, 1.5, -1.5, 2, -1.5];

const CARD_SPRING = { type: "spring", stiffness: 280, damping: 20, mass: 0.85 } as const;
const DOODLE_SPRING = { type: "spring", stiffness: 320, damping: 16 } as const;

const ICON_SPOTS = [
  { base: { x: -46, y: -32, rotate: -14, scale: 0.88 }, hover: { x: -60, y: -46, rotate: -26, scale: 1.12 } },
  { base: { x: 48, y: -26, rotate: 12, scale: 0.85 }, hover: { x: 62, y: -42, rotate: 24, scale: 1.14 } },
  { base: { x: 44, y: 26, rotate: -8, scale: 0.78 }, hover: { x: 56, y: 34, rotate: 14, scale: 1.05 } },
];

function TraitCard({
  t,
  i,
  active,
  onEnter,
  onToggle,
}: {
  t: (typeof difference.traits)[number];
  i: number;
  active: number | null;
  onEnter: () => void;
  onToggle: () => void;
}) {
  const desktop = useIsDesktop();
  const isHovered = active === i;
  // On phones the cards sit in a horizontal scroller, which clips anything that moves vertically —
  // so they stay level and only lift a little; the fanned tilt/stagger is desktop-only.
  const shiftX = !desktop || active === null || active === i ? 0 : i < active ? -16 : 16;
  const targetRotate = desktop ? (isHovered ? ACTIVE_TILT[i] : REST_TILT[i]) : isHovered ? ACTIVE_TILT[i] : 0;
  const targetY = desktop ? (isHovered ? REST_Y[i] - 20 : REST_Y[i]) : isHovered ? -10 : 0;
  const targetScale = isHovered ? (desktop ? 1.06 : 1.03) : 1;

  return (
    <motion.li
      className="relative w-[min(72vw,260px)] shrink-0 snap-center sm:w-[240px] lg:-mx-2 lg:w-[clamp(205px,18.2vw,258px)]"
      style={{ zIndex: isHovered ? 30 : 10 + (i % 2) }}
      initial={{ opacity: 0, y: desktop ? 90 : 40, rotate: desktop ? REST_TILT[i] * 1.5 : 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ type: "spring", duration: 0.85, bounce: 0.24, delay: i * 0.07 }}
    >
      <motion.div
        role="button"
        tabIndex={0}
        aria-pressed={isHovered}
        onPointerEnter={(e) => e.pointerType === "mouse" && onEnter()}
        onFocus={onEnter}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        animate={{
          rotate: targetRotate,
          y: targetY,
          x: shiftX,
          scale: targetScale,
        }}
        transition={CARD_SPRING}
        className={`group relative flex aspect-[64/88] w-full cursor-pointer select-none flex-col justify-between overflow-hidden rounded-[24px] border-[2.5px] border-ink p-5 shadow-[0_10px_0_0_var(--color-ink)] outline-none transition-shadow duration-300 focus-visible:ring-4 focus-visible:ring-ink sm:p-6 ${
          isHovered ? "shadow-[0_18px_0_0_var(--color-ink)]" : ""
        } ${t.face}`}
      >
        {/* Center illustration scene inside the card */}
        <div className="pointer-events-none relative my-auto flex h-[54%] w-full items-center justify-center">
          {t.icons.map((icon, k) => {
            const spot = ICON_SPOTS[k % ICON_SPOTS.length];
            const pose = isHovered ? spot.hover : spot.base;
            return (
              <motion.div
                key={`${icon}-${k}`}
                animate={pose}
                transition={{ ...DOODLE_SPRING, delay: isHovered ? k * 0.03 : 0 }}
                className="absolute h-7 w-7 sm:h-8 sm:w-8"
              >
                <Particle icon={icon} className="h-full w-full drop-shadow-[0_3px_0_rgb(30_34_45/0.18)]" />
              </motion.div>
            );
          })}

          <motion.div
            animate={
              isHovered
                ? { y: -8, scale: 1.14, rotate: i % 2 === 0 ? -7 : 7 }
                : { y: 0, scale: 1, rotate: 0 }
            }
            transition={DOODLE_SPRING}
            className="relative z-10 h-[82%] w-auto"
          >
            <Oodle
              world={t.world}
              shape={t.shape}
              className="h-full w-auto drop-shadow-[0_7px_0_rgb(30_34_45/0.22)]"
              sizes="140px"
            />
          </motion.div>
        </div>

        {/* Bottom left-aligned bold title + readable copy (like the video) */}
        <div className="relative z-10 text-left">
          <h3 className="font-display text-[clamp(1.5rem,2.1vw,1.95rem)] leading-[0.96] tracking-[-0.01em]">
            {t.title}
          </h3>
          <p className="mt-2 font-sans text-[12.5px] font-medium leading-[1.38] opacity-90 sm:text-[13px]">
            {t.body}
          </p>
        </div>
      </motion.div>
    </motion.li>
  );
}

/**
 * Section 4 — The Oodle difference.
 * Headline + the "why", then the five things we want children to be, dealt as a playful row of
 * tilted illustrated cards inspired by the reference interaction.
 */
export default function OodleDifference() {
  const [active, setActive] = useState<number | null>(null);
  const [l1, l2] = difference.headline;
  const [before, after] = l2.split(difference.highlight);

  return (
    <section id="difference" aria-labelledby="difference-title" className="relative overflow-x-clip bg-cream py-12 text-ink sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8">
        <div className="flex flex-col items-center text-center">
          <h2
            id="difference-title"
            aria-label={difference.headline.join(" ")}
            className="font-display text-[clamp(1.8rem,min(4vw,6.4svh),4rem)] leading-[0.95] [text-wrap:balance]"
          >
            <MaskLines
              stagger={0.09}
              lines={[
                <span key="a" aria-hidden>
                  {l1}
                </span>,
                <span key="b" aria-hidden>
                  {before}
                  <span className="text-tomato">{difference.highlight}</span>
                  {after}
                </span>,
              ]}
            />
          </h2>

          <Reveal delay={0.05} className="mt-6 max-w-[820px] sm:mt-10 lg:mt-14">
            <p className="text-[clamp(1rem,min(1.9vw,2.9svh),1.6rem)] font-normal leading-[1.6] tracking-[-0.018em] text-ink">{difference.intro}</p>
          </Reveal>
        </div>

        <Reveal className="mt-10 text-center sm:mt-16 lg:mt-24">
          <p className="font-display text-[clamp(1.4rem,2.6vw,2.25rem)] leading-tight">{difference.wantIntro}</p>
        </Reveal>

        {/* The fanned card row */}
        <ul
          onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
          className="no-scrollbar -mx-5 mt-6 flex touch-pan-x snap-x snap-mandatory items-center gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain px-6 pb-14 pt-10 sm:-mx-8 sm:mt-8 sm:px-10 sm:pb-14 sm:pt-12 lg:mx-0 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0"
        >
          {difference.traits.map((t, i) => (
            <TraitCard
              key={t.trait}
              t={t}
              i={i}
              active={active}
              onEnter={() => setActive(i)}
              onToggle={() => setActive((cur) => (cur === i ? null : i))}
            />
          ))}
        </ul>

        {/* Closing — display line + sticker */}
        <Reveal className="mt-6 text-center sm:mt-12 lg:mt-16">
          <p className="mx-auto max-w-[760px] font-display text-[clamp(1.4rem,2.7vw,2.6rem)] leading-[1.05] [text-wrap:balance]">
            {difference.closing.lead.split("growth mindset")[0]}
            <span className="text-forest">growth mindset</span>
            {difference.closing.lead.split("growth mindset")[1]}
          </p>
          <p className="mt-4 inline-block -rotate-2 rounded-full border-[2.5px] border-ink bg-sun px-5 py-2 text-[clamp(0.95rem,1.4vw,1.2rem)] font-semibold shadow-[0_4px_0_0_var(--color-ink)]">
            {difference.closing.tail}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
