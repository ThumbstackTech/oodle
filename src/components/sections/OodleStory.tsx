"use client";

import { AnimatePresence, motion, useAnimate, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { story } from "@/content/site";
import { Button } from "../ui/Button";
import StoryModal from "./StoryModal";
import Oodle from "../ui/Oodle";
import PlaytestScene from "../ui/PlaytestScene";
import { MaskLines, Reveal } from "../ui/Reveal";

/** One abstract doodle stroke: top-left → bottom-right with a single twirl in the middle (viewBox 1440×1000). */
const DOODLE =
  "M 40 -40 C 140 200, 380 360, 600 450 C 820 540, 880 360, 740 320 C 600 280, 580 500, 740 580 C 940 680, 1220 760, 1420 1040";

/** Where the question bubbles sit around the polaroid (desktop). `tail` = which side points at the boy. */
const SLOTS = [
  { cls: "left-[-6%] top-[4%]", rot: -6, tail: "right", fill: "bg-sun text-ink" },
  { cls: "right-[-4%] top-[-2%]", rot: 5, tail: "left", fill: "bg-cream text-ink" },
  { cls: "left-[-10%] top-[46%]", rot: 4, tail: "right", fill: "bg-lilac text-cream" },
  { cls: "right-[-16%] top-[24%]", rot: -4, tail: "left", fill: "bg-ochre text-cream" },
  { cls: "right-[-12%] bottom-[9%] max-lg:hidden", rot: 3, tail: "left", fill: "bg-sun text-ink" },
] as const;

function Bubble({ text, slot, delay }: { text: string; slot: (typeof SLOTS)[number]; delay: number }) {
  return (
    <motion.div
      className={`absolute z-20 ${slot.cls}`}
      initial={{ opacity: 0, scale: 0.6, y: 14 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ type: "spring", duration: 0.6, bounce: 0.4, delay }}
      style={{ rotate: slot.rot }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={text}
          initial={{ opacity: 0, scale: 0.7, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: -8, transition: { duration: 0.14 } }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.45 }}
          className={`relative block max-w-[16ch] rounded-[18px] border-[2.5px] border-ink px-4 py-2.5 text-[clamp(13px,1.1vw,16px)] font-semibold leading-snug shadow-[0_4px_0_0_var(--color-ink)] ${slot.fill}`}
        >
          {text}
          <span
            aria-hidden
            className={`absolute bottom-[-8px] h-4 w-4 rotate-45 border-b-[2.5px] border-r-[2.5px] border-ink ${slot.fill.split(" ")[0]} ${
              slot.tail === "right" ? "right-6" : "left-6"
            }`}
          />
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Section 6 — Behind the Games.
 * A taped polaroid of "Playtest #1": the first paper prototype on the kitchen table (swap for a real
 * photo if the founders share one), with a curious Oodle's questions popping up around it.
 * Tap "Ask another" and it keeps asking.
 */
export default function OodleStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Draws as soon as the section enters and is fully drawn by the time it is centred on screen.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 95%", "center 55%"] });
  const drawn = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 90, damping: 24, mass: 0.4 });
  const [shown, setShown] = useState<string[]>(() => story.questions.slice(0, SLOTS.length));
  const next = useRef(SLOTS.length);
  const turn = useRef(0);
  const [boyScope, animateBoy] = useAnimate();
  const [storyOpen, setStoryOpen] = useState(false);
  const ctaRef = useRef<HTMLElement | null>(null);
  const closeStory = useCallback(() => {
    setStoryOpen(false);
    requestAnimationFrame(() => ctaRef.current?.focus({ preventScroll: true }));
  }, []);
  const [before] = story.headline.split(story.highlight);

  const ask = () => {
    const slot = turn.current % SLOTS.length;
    turn.current += 1;
    const q = story.questions[next.current % story.questions.length];
    next.current += 1;
    setShown((s) => s.map((v, i) => (i === slot ? q : v)));
    if (boyScope.current) animateBoy(boyScope.current, { y: [0, -16, 0], rotate: [0, -8, 0] }, { duration: 0.5, ease: [0.23, 1, 0.32, 1] });
  };

  return (
    <section ref={sectionRef} id="story" aria-labelledby="story-title" className="relative overflow-hidden bg-forest py-[clamp(96px,14vh,160px)] text-cream">
      {/* the brand's loopy string — an abstract doodle that draws itself top → bottom as you scroll */}
      <svg aria-hidden viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full">
        <motion.path
          d={DOODLE}
          fill="none"
          stroke="var(--color-leaf)"
          strokeOpacity={0.4}
          strokeWidth={7}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={reduce ? undefined : { pathLength: drawn }}
        />
      </svg>

      <div className="relative mx-auto grid max-w-[1320px] items-center gap-[clamp(64px,8vw,96px)] px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        {/* Copy */}
        <div className="lg:col-span-6 lg:pr-6">
          <h2
            id="story-title"
            aria-label={story.headline}
            className="font-display text-[clamp(1.8rem,min(4vw,6.4svh),4rem)] leading-[0.95] [text-wrap:balance]"
          >
            <MaskLines
              lines={[
                <span key="h" aria-hidden>
                  {before}
                  <span className="text-sun">{story.highlight}</span>
                </span>,
              ]}
            />
          </h2>
          <div className="mt-[clamp(24px,4svh,44px)] space-y-4 text-[clamp(1rem,min(1.5vw,2.6svh),1.3rem)] leading-[1.6] text-cream/85">
            {story.body.map((p, i) => (
              <Reveal key={p} delay={0.05 + i * 0.06}>
                <p className="max-w-[46ch]">{p}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.18} className="mt-[clamp(28px,4.5svh,48px)]">
            <Button
              href={story.cta.href}
              onClick={(e) => {
                e.preventDefault();
                ctaRef.current = e.currentTarget;
                setStoryOpen(true);
              }}
            >
              {story.cta.label}
            </Button>
          </Reveal>
        </div>

        {/* The kitchen-table scene */}
        <div className="relative mx-auto w-[84%] max-w-[520px] sm:w-full lg:col-span-6">
          <motion.div
            className="relative mx-auto w-[min(78vw,400px)]"
            initial={{ opacity: 0, y: 40, rotate: -10 }}
            whileInView={{ opacity: 1, y: 0, rotate: -3 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ type: "spring", duration: 0.9, bounce: 0.25 }}
          >
            {/* tape */}
            <span aria-hidden className="absolute -top-4 left-1/2 z-10 h-8 w-28 -translate-x-1/2 rotate-[-4deg] rounded-sm border-2 border-ink/20 bg-sun/85" />
            {/* polaroid: the first paper prototype on the kitchen table */}
            <div className="card-soft rounded-[10px] bg-cream p-[5%] pb-[16%] shadow-[0_2px_6px_-2px_rgb(0_0_0/0.2),0_28px_50px_-22px_rgb(0_0_0/0.55)]">
              <div className="relative aspect-[4/4.2] overflow-hidden rounded-[6px]">
                <PlaytestScene className="absolute inset-0 h-full w-full" />
                {/* a curious little Oodle peeking over the table edge — hops when "Ask another" is tapped */}
                <motion.div ref={boyScope} className="absolute -bottom-[7%] left-[34%] w-[22%] origin-bottom">
                  <Oodle world="solve" shape="star" className="h-auto w-full drop-shadow-[0_4px_6px_rgb(30_34_45/0.3)]" sizes="110px" />
                </motion.div>
              </div>
              <p className="mt-[5%] text-center font-display text-[clamp(15px,1.5vw,21px)] text-ink">{story.caption}</p>
            </div>
          </motion.div>

          {/* His questions */}
          {SLOTS.map((slot, i) => (
            <Bubble key={i} text={shown[i]} slot={slot} delay={0.4 + i * 0.12} />
          ))}

          <div className="relative z-20 mt-8 flex justify-center">
            <button
              type="button"
              onClick={ask}
              className="inline-flex items-center gap-2 btn-soft rounded-full bg-cream px-5 py-2.5 text-[14px] font-bold text-ink transition-[transform,box-shadow] duration-[120ms] active:translate-y-[4px] active:[--btn-depth:0px]"
            >
              <span className="font-display text-[18px] leading-none text-tomato">?</span>
              {story.ask}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>{storyOpen && <StoryModal onClose={closeStory} />}</AnimatePresence>
    </section>
  );
}
