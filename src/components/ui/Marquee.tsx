"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef, type ReactNode } from "react";

/** Endless band that drifts at rest and speeds up with scroll velocity (direction follows the scroll). */
export default function Marquee({
  children,
  speed = 3,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  /** percent of one copy per second */
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const dir = useRef(reverse ? -1 : 1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = reverse ? 1 : -1;
    else if (f > 0) dir.current = reverse ? -1 : 1;
    const move = dir.current * speed * (delta / 1000) * (1 + Math.abs(f));
    let next = base.get() - move;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    base.set(next);
  });

  const x = useTransform(base, (v) => `${v}%`);

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="flex w-max" style={{ x }}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
