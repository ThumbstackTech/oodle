"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Fragment, useMemo, useRef } from "react";
import { thought, type ThoughtInlineToken } from "@/content/site";
import { Particle } from "../portal/particles";
import ToyBox from "../toy/ToyBox";
import Oodle from "../ui/Oodle";
import { EASE_OUT } from "../ui/Reveal";
import SkillTapes from "../ui/SkillTapes";

type Badge = Extract<ThoughtInlineToken, { type: "oodle" | "particle" }>;
type ScrollItem = { kind: "word"; word: string; n: number } | { kind: "badge"; token: Badge; n: number } | { kind: "break" };

type ParsedBeat = {
  items: ScrollItem[];
  /** number of items that animate (words + badges) */
  count: number;
  plainText: string;
};

function parseBeat(tokens: ThoughtInlineToken[]): ParsedBeat {
  const items: ScrollItem[] = [];
  const words: string[] = [];
  for (const t of tokens) {
    if (t.type === "text") {
      for (const w of t.value.trim().split(/\s+/)) {
        if (!w) continue;
        items.push({ kind: "word", word: w, n: items.filter((i) => i.kind !== "break").length });
        words.push(w);
      }
    } else if (t.type === "break") {
      items.push({ kind: "break" });
    } else {
      items.push({ kind: "badge", token: t, n: items.filter((i) => i.kind !== "break").length });
    }
  }
  return { items, count: items.filter((i) => i.kind !== "break").length, plainText: words.join(" ") };
}

function ScrollWord({
  word,
  index,
  total,
  progress,
  rangeStart,
  rangeEnd,
  reduce,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  rangeStart: number;
  rangeEnd: number;
  reduce: boolean | null;
}) {
  const span = rangeEnd - rangeStart;
  const start = rangeStart + (index / total) * span;
  const end = Math.min(rangeEnd, rangeStart + ((index + 2.5) / total) * span);
  const opacity = useTransform(progress, [start, end], [0.16, 1]);
  return (
    <motion.span style={reduce ? undefined : { opacity }} className="font-normal text-ink">
      {word}
    </motion.span>
  );
}

function ScrollBadge({
  token,
  index,
  total,
  progress,
  rangeStart,
  rangeEnd,
  reduce,
}: {
  token: Badge;
  index: number;
  total: number;
  progress: MotionValue<number>;
  rangeStart: number;
  rangeEnd: number;
  reduce: boolean | null;
}) {
  const rotate = token.rotate ?? 0;
  const span = rangeEnd - rangeStart;
  const start = rangeStart + (index / total) * span;
  const end = Math.min(rangeEnd, rangeStart + ((index + 2.8) / total) * span);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);
  const scale = useTransform(progress, [start, end], [0.6, 1]);

  // Bigger inline art; negative block margins keep line spacing even.
  return (
    <motion.span
      style={reduce ? { rotate } : { opacity, scale, rotate }}
      whileHover={{ scale: 1.18, rotate: rotate > 0 ? rotate + 10 : rotate - 10 }}
      className="mx-1.5 -my-[0.35em] inline-flex select-none align-middle sm:mx-2"
    >
      {token.type === "oodle" ? (
        <span className="inline-flex h-[1.75em] w-auto items-center">
          <Oodle world={token.world} shape={token.shape} className="h-full w-auto drop-shadow-[0_3px_0_rgb(30_34_45/0.16)]" sizes="72px" />
        </span>
      ) : (
        <span className="inline-flex h-[1.45em] w-[1.45em] items-center justify-center">
          <Particle icon={token.icon} className="h-full w-full drop-shadow-[0_3px_0_rgb(30_34_45/0.16)]" />
        </span>
      )}
    </motion.span>
  );
}

function BeatItems({
  beat,
  progress,
  rangeStart,
  rangeEnd,
  reduce,
}: {
  beat: ParsedBeat;
  progress: MotionValue<number>;
  rangeStart: number;
  rangeEnd: number;
  reduce: boolean | null;
}) {
  return (
    <span aria-hidden>
      {beat.items.map((item, idx) => {
        if (item.kind === "break") return <br key={idx} />;
        const next = beat.items[idx + 1];
        return (
          <Fragment key={idx}>
            {item.kind === "word" ? (
              <ScrollWord word={item.word} index={item.n} total={beat.count} progress={progress} rangeStart={rangeStart} rangeEnd={rangeEnd} reduce={reduce} />
            ) : (
              <ScrollBadge token={item.token} index={item.n} total={beat.count} progress={progress} rangeStart={rangeStart} rangeEnd={rangeEnd} reduce={reduce} />
            )}
            {next && next.kind !== "break" ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}

function Headline() {
  const [before, after] = thought.headline.split(thought.highlight);
  return (
    <motion.h2
      id="thought-title"
      aria-label={thought.headline}
      initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.75, ease: EASE_OUT }}
      className="mx-auto max-w-[960px] font-display text-[clamp(1.65rem,3.6vw,3.35rem)] leading-[1.06] text-ink"
    >
      <span aria-hidden className="block">
        {before}
        <span className="text-tomato">{thought.highlight}</span>
      </span>
      <span aria-hidden className="block">
        {after.trim()}
      </span>
    </motion.h2>
  );
}

/** The closing line — held back, then revealed on its own at the very end, in display type. */
function Closing({ style }: { style?: { opacity: MotionValue<number>; y: MotionValue<number>; scale: MotionValue<number> } }) {
  const c = thought.closing;
  return (
    <motion.div style={style} className="col-start-1 row-start-1 mx-auto max-w-[900px]">
      <p className="font-display text-[clamp(1.4rem,min(2.7vw,4.3svh),2.6rem)] leading-[1.05] text-ink [text-wrap:balance]">
        {c.lead} <span className="text-forest">{c.word}</span>
      </p>
      <p className="mt-[clamp(10px,2svh,20px)] inline-block -rotate-2 rounded-full border-[2.5px] border-ink bg-sun px-5 py-2 text-[clamp(0.95rem,min(1.5vw,2.4svh),1.25rem)] font-semibold text-ink shadow-[0_4px_0_0_var(--color-ink)]">
        {c.tail}
      </p>
    </motion.div>
  );
}

const beatCls =
  "mx-auto max-w-[820px] text-[clamp(1rem,min(1.9vw,2.9svh),1.6rem)] font-normal leading-[1.6] tracking-[-0.018em] text-ink";

export default function OodleThought() {
  const pinRef = useRef<HTMLDivElement>(null);
  // The pinned viewport is also the toy box; the tapes hang just below it and are the floor.
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start 55%", "end end"] });

  const beats = useMemo(() => thought.beats.map(parseBeat), []);

  const beat1Opacity = useTransform(scrollYProgress, [0, 0.4, 0.46], [1, 1, 0]);
  const beat1Y = useTransform(scrollYProgress, [0, 0.4, 0.46], [0, 0, -24]);
  const beat2Opacity = useTransform(scrollYProgress, [0.42, 0.48, 0.76, 0.82], [0, 1, 1, 0]);
  const beat2Y = useTransform(scrollYProgress, [0.42, 0.48, 0.76, 0.82], [24, 0, 0, -24]);
  const closeOpacity = useTransform(scrollYProgress, [0.82, 0.9], [0, 1]);
  const closeY = useTransform(scrollYProgress, [0.82, 0.9], [36, 0]);
  const closeScale = useTransform(scrollYProgress, [0.82, 0.9], [0.94, 1]);

  const dots = [
    { s: useTransform(scrollYProgress, [0, 0.42, 0.46], [1.25, 1.25, 0.85]), o: useTransform(scrollYProgress, [0, 0.42, 0.46], [1, 1, 0.3]) },
    {
      s: useTransform(scrollYProgress, [0.42, 0.46, 0.8, 0.84], [0.85, 1.25, 1.25, 0.85]),
      o: useTransform(scrollYProgress, [0.42, 0.46, 0.8, 0.84], [0.3, 1, 1, 0.3]),
    },
    { s: useTransform(scrollYProgress, [0.8, 0.84], [0.85, 1.25]), o: useTransform(scrollYProgress, [0.8, 0.84], [0.3, 1]) },
  ];

  if (reduce) {
    return (
      <section aria-labelledby="thought-title" className="relative bg-cream pt-28 text-ink">
        <div className="mx-auto max-w-[900px] space-y-10 px-5 text-center sm:px-8">
          <Headline />
          {beats.map((b, i) => (
            <p key={i} aria-label={b.plainText} className={beatCls}>
              <BeatItems beat={b} progress={scrollYProgress} rangeStart={0} rangeEnd={1} reduce={reduce} />
            </p>
          ))}
          <div className="grid">
            <Closing />
          </div>
        </div>
        <SkillTapes className="relative mt-16" />
      </section>
    );
  }

  return (
    <section aria-labelledby="thought-title" className="relative bg-cream text-ink">
      <div ref={pinRef} className="relative h-[260vh] sm:h-[300vh]">
        <div ref={stageRef} className="sticky top-0 z-10 flex h-[100svh] flex-col overflow-x-clip sm:min-h-[720px]">
          <div className="flex flex-1 items-center justify-center px-5 pb-[clamp(110px,18svh,260px)] pt-[clamp(72px,10svh,120px)] sm:px-8">
            {/* data-collider: toys bounce off the text column instead of covering it */}
            <div data-collider className="relative mx-auto flex w-full max-w-[1120px] flex-col items-center text-center">
              <div>
                <Headline />
              </div>

              <div className="relative mt-[clamp(24px,5svh,64px)] grid w-full place-items-center">
                <motion.p style={{ opacity: beat1Opacity, y: beat1Y }} aria-label={beats[0].plainText} className={`col-start-1 row-start-1 ${beatCls}`}>
                  <BeatItems beat={beats[0]} progress={scrollYProgress} rangeStart={0.02} rangeEnd={0.36} reduce={reduce} />
                </motion.p>
                <motion.p style={{ opacity: beat2Opacity, y: beat2Y }} aria-label={beats[1].plainText} className={`col-start-1 row-start-1 ${beatCls}`}>
                  <BeatItems beat={beats[1]} progress={scrollYProgress} rangeStart={0.48} rangeEnd={0.74} reduce={reduce} />
                </motion.p>
                <Closing style={{ opacity: closeOpacity, y: closeY, scale: closeScale }} />
              </div>

              <div aria-hidden className="mt-[clamp(18px,3.5svh,44px)] flex items-center gap-2.5">
                {dots.map((d, i) => (
                  <motion.span key={i} style={{ scale: d.s, opacity: d.o }} className="h-2 w-2 rounded-full bg-ink" />
                ))}
              </div>
            </div>
          </div>

          {/* Tapes hang just below the screen-height stage — they're the floor the toys settle on. */}
          <SkillTapes className="absolute inset-x-0 top-[calc(100%-26px)] -z-10" />
          <ToyBox heroRef={stageRef} pieces={thought.toys} trigger="visible" threshold={0.7} clipY={false} />
        </div>
      </div>
      {/* room for the tapes once the stage un-pins */}
      <div aria-hidden className="h-[140px] sm:h-[180px] lg:h-[220px]" />
    </section>
  );
}
