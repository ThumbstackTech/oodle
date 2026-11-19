"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

declare global {
  interface Window {
    /** Smooth-scroll instance — modals stop()/start() it to lock the page. */
    __lenis?: Lenis;
  }
}

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.12, anchors: { offset: -72 } });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // reducedMotion="user": transform animations are skipped, opacity fades remain.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
