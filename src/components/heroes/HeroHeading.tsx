"use client";

import { motion } from "motion/react";
import { Button, Chip } from "../ui/Button";
import { EASE_OUT, MaskLines } from "../ui/Reveal";
import { HERO_COPY } from "./worlds";

/** Shared headline block for the hero iterations. */
export default function HeroHeading({
  tone = "light",
  size = "lg",
  align = "center",
  accent = "text-tomato",
  eyebrow = true,
}: {
  tone?: "light" | "dark";
  size?: "md" | "lg";
  align?: "center" | "left";
  accent?: string;
  eyebrow?: boolean;
}) {
  const dark = tone === "dark";
  const left = align === "left";
  return (
    <div className={`relative z-30 flex flex-col ${left ? "items-start text-left" : "items-center text-center"}`}>
      {eyebrow && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}>
          <Chip className={dark ? "!border-cream/40 !bg-transparent !text-cream" : ""}>
            <span className="h-2 w-2 rounded-full bg-tomato" aria-hidden />
            {HERO_COPY.eyebrow}
          </Chip>
        </motion.div>
      )}
      <h1
        aria-label={HERO_COPY.heading.join(" ")}
        className={`${eyebrow ? "mt-5" : ""} font-display leading-[0.88] ${dark ? "text-cream" : "text-ink"} ${
          size === "lg" ? "text-[clamp(3.2rem,9vw,8.75rem)]" : "text-[clamp(2.8rem,6.4vw,6rem)]"
        }`}
      >
        <MaskLines
          trigger="load"
          delay={0.15}
          stagger={0.09}
          lines={[
            <span key="a" aria-hidden>
              {HERO_COPY.heading[0]}
            </span>,
            <span key="b" aria-hidden className={accent}>
              {HERO_COPY.heading[1]}
            </span>,
          ]}
        />
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.45 }}
        className={`mt-7 flex items-center gap-4 ${left ? "justify-start" : "justify-center"}`}
      >
        <Button href={HERO_COPY.primary.href}>{HERO_COPY.primary.label}</Button>
        <span className="hidden sm:inline-flex">
          <Button href={HERO_COPY.secondary.href} tone={dark ? "cream" : "cream"}>
            {HERO_COPY.secondary.label}
          </Button>
        </span>
      </motion.div>
    </div>
  );
}
