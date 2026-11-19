"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { heroPortals, portals } from "@/content/site";
import Portal from "../portal/Portal";
import { Particle } from "../portal/particles";
import { Button } from "../ui/Button";
import { EASE_OUT, MaskLines } from "../ui/Reveal";

const OUTWARD = [-1, 0, 1] as const;

/** Four-point sparkle (diamond star) used to dust the sky. */
function Diamond({ color, className = "", style }: { color: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`twinkle-soft ${className}`} style={style}>
      <path
        d="M12 1.5c1 6.2 4.3 9.5 10.5 10.5-6.2 1-9.5 4.3-10.5 10.5C11 16.3 7.7 13 1.5 12 7.7 11 11 7.7 12 1.5z"
        fill={color}
        stroke="#1e222d"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Soft cloud bank that tucks the portals in. */
function Clouds() {
  const puffs: [number, number, number][] = [
    [0, 92, 70], [70, 70, 64], [150, 96, 72], [235, 64, 60], [300, 90, 66], [380, 74, 58], [450, 100, 70],
    [530, 70, 62], [610, 96, 68], [690, 66, 58], [760, 92, 70], [840, 72, 64], [920, 100, 72], [1000, 70, 60],
    [1080, 94, 70], [1160, 66, 62], [1240, 96, 70], [1320, 72, 60], [1400, 96, 72], [1470, 70, 64],
  ];
  return (
    <svg
      viewBox="0 0 1440 170"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[clamp(70px,13svh,150px)] w-full"
    >
      <g fill="color-mix(in srgb, #e4e1cf 55%, white)">
        {puffs.map(([x, y, rad], i) => (
          <circle key={i} cx={x} cy={y + 26} r={rad} />
        ))}
        <rect x="0" y="110" width="1440" height="60" />
      </g>
      <g fill="#e4e1cf" opacity="0.9">
        {puffs.map(([x, y, rad], i) => (
          <circle key={i} cx={x + 38} cy={y + 64} r={rad * 0.7} />
        ))}
        <rect x="0" y="140" width="1440" height="30" />
      </g>
    </svg>
  );
}

export default function Hero() {
  const { sub } = heroPortals;
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[max(100svh,760px)] flex-col overflow-hidden bg-cream pt-[100px] sm:pt-[108px]"
    >
      {/* Sky doodles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <Diamond color="#f2d439" className="absolute left-[30%] top-[17%] w-7" />
        <Diamond color="#36604b" className="absolute left-[24%] top-[27%] w-4" style={{ "--tw-delay": "0.8s" } as CSSProperties} />
        <Diamond color="#716bac" className="absolute right-[24%] top-[40%] w-5" style={{ "--tw-delay": "1.4s" } as CSSProperties} />
        <Diamond color="#95ba4c" className="absolute right-[21%] top-[53%] w-4" style={{ "--tw-delay": "0.4s" } as CSSProperties} />
        <Diamond color="#f2d439" className="absolute left-[8%] top-[34%] w-4" style={{ "--tw-delay": "2s" } as CSSProperties} />
        <Diamond color="#cc652b" className="absolute right-[6%] top-[62%] w-5" style={{ "--tw-delay": "1.1s" } as CSSProperties} />
        <Diamond color="#716bac" className="absolute left-[36%] top-[63%] w-4" style={{ "--tw-delay": "1.7s" } as CSSProperties} />
        <Particle icon="star" className="absolute left-[27%] top-[16%] hidden w-10 -rotate-12 md:block" />
        <Particle icon="star" className="absolute right-[19%] top-[27%] hidden w-9 rotate-12 md:block" />
        <Particle icon="note" className="absolute right-[14%] top-[18%] hidden w-14 rotate-[18deg] md:block" />
        <Particle icon="chart" className="absolute right-[6%] top-[30%] hidden w-12 -rotate-12 lg:block" />
        <Particle icon="puzzle" className="absolute left-[11%] top-[19%] hidden w-11 rotate-[-20deg] lg:block" />
      </div>

      {/* Heading + CTAs */}
      <div className="relative z-30 mx-auto flex w-full max-w-[1100px] flex-col items-center px-4 text-center sm:px-6">
        <motion.svg
          aria-hidden
          viewBox="0 0 48 40"
          className="mb-1 h-8 w-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.7 }}
        >
          <g stroke="#1e222d" strokeWidth="4.5" strokeLinecap="round">
            <path d="M10 30l4-10" />
            <path d="M24 26V8" />
            <path d="M38 30l-4-10" />
          </g>
        </motion.svg>

        <h1 id="hero-title" aria-label={heroPortals.heading.join(" ")} className="font-display leading-[0.92]">
          <MaskLines
            trigger="load"
            delay={0.15}
            stagger={0.1}
            lines={[
              <span key="a" aria-hidden className="block text-[clamp(2.9rem,6vw,6rem)] text-ink">
                {heroPortals.heading[0]}
              </span>,
              <span
                key="b"
                aria-hidden
                className="block pb-[0.08em] text-[clamp(3.4rem,7.4vw,7.5rem)] text-sun [-webkit-text-stroke:0.075em_var(--color-ink)] [paint-order:stroke_fill] [text-shadow:0_0.07em_0_var(--color-ink)]"
              >
                {heroPortals.heading[1]}
              </span>,
            ]}
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.4 }}
          className="mt-3 text-[17px] font-semibold text-ink sm:text-[21px]"
        >
          {sub.before}
          <span className="relative inline-block">
            {sub.underline}
            <svg viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden className="absolute -bottom-2 left-[-6%] h-3 w-[112%]">
              <motion.path
                d="M3 9C30 4 70 3 117 7"
                fill="none"
                stroke="#1e222d"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1], delay: 0.9 }}
              />
            </svg>
          </span>
          {sub.after}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.5 }}
          className="mt-7 flex items-center justify-center gap-4"
        >
          <Button href={heroPortals.primary.href}>{heroPortals.primary.label}</Button>
          <span className="hidden sm:inline-flex">
            <Button href={heroPortals.secondary.href} tone="cream">
              {heroPortals.secondary.label}
            </Button>
          </span>
        </motion.div>
      </div>

      {/* The three worlds */}
      <div className="relative z-20 mt-auto grid w-full grid-cols-3 items-end px-[3vw] pt-16 [&>*]:justify-self-center">
        {portals.map((p, i) => (
          <div
            key={p.id}
            className={`w-[min(40vw,380px)] sm:w-[clamp(170px,min(25vw,calc((100svh-430px)*0.78)),380px)] ${
              i === 1 ? "translate-y-[6%] scale-[0.92]" : ""
            }`}
          >
            <Portal theme={p} index={i} outward={OUTWARD[i]} travel={i === 1 ? 130 : 300} />
          </div>
        ))}
      </div>

      <Clouds />
    </section>
  );
}
