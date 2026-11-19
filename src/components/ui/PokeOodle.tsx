"use client";

import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { sayings, type Shape, type World } from "@/content/site";
import Oodle from "./Oodle";
import SpeechBubble from "./SpeechBubble";

/** An Oodle you can poke: squash, jump, land — and it says something. Cycles through its lines. */
export default function PokeOodle({ world, shape, className = "" }: { world: World; shape: Shape; className?: string }) {
  const [scope, animate] = useAnimate();
  const [line, setLine] = useState<string | null>(null);
  const count = useRef(0);
  const lines = sayings[`${world}-${shape}`];

  useEffect(() => {
    if (!line) return;
    const t = window.setTimeout(() => setLine(null), 2200);
    return () => window.clearTimeout(t);
  }, [line]);

  const poke = async () => {
    setLine(lines[count.current % lines.length]);
    count.current += 1;
    await animate(scope.current, { scaleY: 0.86, scaleX: 1.08, y: 0 }, { duration: 0.09, ease: "easeOut" });
    await animate(scope.current, { scaleY: 1.06, scaleX: 0.96, y: -34, rotate: -6 }, { type: "spring", duration: 0.32, bounce: 0 });
    await animate(scope.current, { scaleY: 1, scaleX: 1, y: 0, rotate: 0 }, { type: "spring", duration: 0.5, bounce: 0.45 });
  };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {line && (
          <motion.div
            key={line}
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.35, bounce: 0.3 } }}
            exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.12 } }}
            style={{ originX: 0.5, originY: 1 }}
            className="absolute bottom-[calc(100%+6px)] left-1/2 z-20 -translate-x-1/2"
            role="status"
          >
            <SpeechBubble>{line}</SpeechBubble>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          poke();
        }}
        aria-label={`Poke the Oodle: ${lines[0]}`}
        className="block w-full cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
      >
        <motion.span ref={scope} className="block origin-bottom">
          <Oodle world={world} shape={shape} className="h-auto w-full drop-shadow-[0_8px_0_rgb(0_0_0/0.22)]" sizes="200px" />
        </motion.span>
      </button>
    </div>
  );
}
