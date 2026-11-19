"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Fade + rise + de-blur once, when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Lines that rise from behind a mask. Pass each line as an array item.
 * `trigger="load"` animates on mount (hero); default animates when in view.
 */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.08,
  trigger = "view",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: "view" | "load";
}) {
  // The trigger lives on the (unclipped) wrapper; lines inherit the state via variants.
  return (
    <motion.span
      className={`block ${className}`}
      initial="hidden"
      {...(trigger === "load"
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
    >
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${lineClassName}`}>
          <motion.span
            className="block will-change-transform"
            variants={{ hidden: { y: "110%" }, shown: { y: "0%" } }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
