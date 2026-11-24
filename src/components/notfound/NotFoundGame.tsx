"use client";

import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PortalIcon, Shape, World } from "@/content/site";
import { Particle } from "../portal/particles";
import { Button, Chip } from "../ui/Button";
import Oodle from "../ui/Oodle";
import PatternBg from "../ui/PatternBg";
import SpeechBubble from "../ui/SpeechBubble";

type Pair = { id: number; world: World; shape: Shape };
type Card = Pair & { key: string };

const PAIRS: Pair[] = [
  { id: 0, world: "money", shape: "coin" },
  { id: 1, world: "solve", shape: "tri" },
  { id: 2, world: "biz", shape: "blob" },
  { id: 3, world: "money", shape: "star" },
  { id: 4, world: "solve", shape: "cloud" },
  { id: 5, world: "biz", shape: "clover" },
];

const BACK: Record<World, { bg: string; letters: string; band: string }> = {
  money: { bg: "bg-forest", letters: "/patterns/letters-money.svg", band: "bg-forest" },
  solve: { bg: "bg-slate", letters: "/patterns/letters-solve.svg", band: "bg-slate" },
  biz: { bg: "bg-oxblood", letters: "/patterns/letters-biz.svg", band: "bg-oxblood" },
};
// card backs rotate through the worlds by position, so the back never gives the answer away
const BACK_ORDER: World[] = ["money", "solve", "biz"];

const COIN_LINES = [
  "Hey! I was saving that page.",
  "Lost? Let's find a way home.",
  "This page is on a coin break.",
  "Match my friends and I'll show you out!",
  "Ka-ching… nope, nothing here.",
]; // [draft]

const CONFETTI: PortalIcon[] = ["coin", "star", "bulb", "puzzle", "trophy", "sparkle", "piggy", "chart"];

const FLIP = { type: "spring", duration: 0.5, bounce: 0.2 } as const;

function shuffled(): Card[] {
  const deck = PAIRS.flatMap((p) => [
    { ...p, key: `${p.id}-a` },
    { ...p, key: `${p.id}-b` },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/** Deterministic initial order (server + first client render), reshuffled after mount. */
const INITIAL: Card[] = PAIRS.flatMap((p) => [
  { ...p, key: `${p.id}-a` },
  { ...p, key: `${p.id}-b` },
]);

function GameCard({
  card,
  index,
  faceUp,
  matched,
  missKey,
  reduce,
  onFlip,
}: {
  card: Card;
  index: number;
  faceUp: boolean;
  matched: boolean;
  missKey: number;
  reduce: boolean | null;
  onFlip: () => void;
}) {
  const back = BACK[BACK_ORDER[index % BACK_ORDER.length]];
  const face = BACK[card.world];
  const [scope, animate] = useAnimate();

  // miss → wiggle; match → hop
  useEffect(() => {
    if (!missKey || reduce || !scope.current) return;
    animate(scope.current, { x: [0, -8, 8, -6, 6, 0] }, { duration: 0.45, ease: "easeInOut" });
  }, [missKey, reduce, animate, scope]);
  useEffect(() => {
    if (!matched || reduce || !scope.current) return;
    animate(scope.current, { y: [0, -14, 0] }, { duration: 0.45, ease: [0.23, 1, 0.32, 1] });
  }, [matched, reduce, animate, scope]);

  return (
    <motion.div ref={scope} className="[perspective:1000px]" style={{ rotate: matched ? (index % 2 ? 2.5 : -2.5) : 0 }}>
      <button
        type="button"
        data-pair={card.id}
        onClick={onFlip}
        disabled={faceUp || matched}
        aria-label={faceUp || matched ? `${card.shape} Oodle card` : "Face-down card"}
        className="block aspect-[63/88] w-full cursor-pointer rounded-[16px] transition-transform duration-[120ms] ease-(--ease-out) enabled:active:scale-[0.96] disabled:cursor-default [@media(hover:hover)_and_(pointer:fine)]:enabled:hover:-translate-y-1"
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          initial={false}
          animate={reduce ? undefined : { rotateY: faceUp || matched ? 180 : 0 }}
          transition={FLIP}
        >
          {/* Back */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-[16px] border-[2.5px] border-ink shadow-[0_5px_0_0_var(--color-ink)] [backface-visibility:hidden] sm:rounded-[18px] ${back.bg} ${
              reduce ? `transition-opacity duration-200 ${faceUp || matched ? "opacity-0" : "opacity-100"}` : ""
            }`}
          >
            <PatternBg src={back.letters} />
            <div className="absolute inset-[7%] flex flex-col items-center justify-between rounded-[10px] border-2 border-cream/35 py-[12%] text-cream">
              <span className="font-display text-[clamp(10px,1.2vw,15px)] leading-none text-cream/80">oodle</span>
              <span className="font-display text-[clamp(34px,5vw,64px)] leading-none text-sun">?</span>
              <span className="h-1 w-6 rounded-full bg-cream/40" />
            </div>
          </div>

          {/* Face */}
          <div
            className={`absolute inset-0 overflow-hidden rounded-[16px] border-[2.5px] border-ink bg-cream shadow-[0_5px_0_0_var(--color-ink)] sm:rounded-[18px] ${
              reduce
                ? `transition-opacity duration-200 ${faceUp || matched ? "opacity-100" : "opacity-0"}`
                : "[backface-visibility:hidden] [transform:rotateY(180deg)]"
            }`}
          >
            <div className={`absolute inset-x-0 top-0 h-[14%] border-b-2 border-ink ${face.band}`} />
            <div className="absolute inset-[6%] top-[19%] rounded-[10px] border-2 border-ink/15" />
            <div className="absolute inset-0 grid place-items-center pt-[14%]">
              <Oodle
                world={card.world}
                shape={card.shape}
                className={`h-auto w-[62%] ${matched ? "sticker" : "drop-shadow-[0_4px_0_rgb(30_34_45/0.18)]"}`}
                sizes="120px"
              />
            </div>
            {matched && (
              <span className="absolute bottom-[6%] right-[7%] grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-sun sm:h-7 sm:w-7">
                <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
                  <path d="M4 10.5l4 4 8-9" stroke="var(--color-ink)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

/**
 * 404 — "This page got shuffled." A 12-card memory match with the Oodle crew; find all six pairs to win.
 */
export default function NotFoundGame() {
  const reduce = useReducedMotion();
  const [deck, setDeck] = useState<Card[]>(INITIAL);
  const [up, setUp] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [miss, setMiss] = useState<{ idx: number[]; n: number }>({ idx: [], n: 0 });
  const [line, setLine] = useState<string | null>(null);
  const lineN = useRef(0);
  const [coinScope, animateCoin] = useAnimate();
  const locked = up.length === 2;
  const won = matched.size === PAIRS.length;

  // shuffle after mount (keeps SSR + hydration identical)
  useEffect(() => {
    const t = window.setTimeout(() => setDeck(shuffled()), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!line) return;
    const t = window.setTimeout(() => setLine(null), 2200);
    return () => window.clearTimeout(t);
  }, [line]);

  const flip = (i: number) => {
    if (locked || up.includes(i) || matched.has(deck[i].id)) return;
    const next = [...up, i];
    setUp(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next;
    if (deck[a].id === deck[b].id) {
      window.setTimeout(() => {
        setMatched((s) => new Set(s).add(deck[a].id));
        setUp([]);
      }, 380);
    } else {
      window.setTimeout(() => {
        setMiss((m) => ({ idx: [a, b], n: m.n + 1 }));
        window.setTimeout(() => setUp([]), 380);
      }, 650);
    }
  };

  const restart = useCallback(() => {
    setUp([]);
    setMatched(new Set());
    setMoves(0);
    setDeck(shuffled());
  }, []);

  const pokeCoin = () => {
    setLine(COIN_LINES[lineN.current % COIN_LINES.length]);
    lineN.current += 1;
    if (!reduce && coinScope.current) animateCoin(coinScope.current, { y: [0, -26, 0], rotate: [0, -12, 0] }, { duration: 0.55, ease: [0.23, 1, 0.32, 1] });
  };

  return (
    <section className="relative overflow-hidden bg-cream px-5 pb-20 pt-[120px] text-ink sm:px-8 sm:pt-[140px]">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center text-center">
        {/* 4 [coin] 4 */}
        <h1 className="sr-only">Page not found (404)</h1>
        <div aria-hidden className="flex items-center justify-center gap-[0.04em] font-display text-[clamp(5.5rem,16vw,11rem)] leading-none">
          <motion.span initial={{ y: "40%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", duration: 0.7, bounce: 0.35 }}>
            4
          </motion.span>
          <span className="relative inline-block w-[0.82em]">
            <AnimatePresence>
              {line && (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.35 }}
                  className="absolute bottom-[calc(100%+4px)] left-1/2 z-20 -translate-x-1/2 font-sans text-[15px] leading-tight"
                  style={{ originY: 1 }}
                >
                  <SpeechBubble>{line}</SpeechBubble>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={pokeCoin}
              aria-label="Poke the coin"
              className="block w-full cursor-pointer"
              initial={{ scale: 0.6, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8, bounce: 0.45, delay: 0.12 }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.span ref={coinScope} className="block origin-bottom">
                <Oodle world="money" shape="coin" priority className="sticker h-auto w-full" sizes="200px" />
              </motion.span>
            </motion.button>
          </span>
          <motion.span initial={{ y: "40%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", duration: 0.7, bounce: 0.35, delay: 0.08 }}>
            4
          </motion.span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.25 }}
          className="mt-4 font-display text-[clamp(1.8rem,4vw,3.2rem)] leading-[1]"
        >
          Oops! This page got <span className="text-tomato">shuffled.</span>
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.32 }}
          className="mt-3 max-w-[44ch] text-[clamp(1rem,1.5vw,1.2rem)] font-medium leading-relaxed text-ink/75"
        >
          Match the Oodle pairs to find your way home or skip straight back.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.4 }}
          className="mt-6 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Button href="/">Take me home</Button>
          <Button href="/#games" tone="cream">
            Explore Our Games
          </Button>
        </motion.div>

        {/* HUD */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:mt-14">
          <Chip>
            Moves <span className="tabular font-extrabold">{moves}</span>
          </Chip>
          <Chip>
            Pairs <span className="tabular font-extrabold">{matched.size}/{PAIRS.length}</span>
          </Chip>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-2 btn-soft rounded-full bg-sun px-3.5 py-1.5 text-[13px] font-bold leading-none [--btn-depth:3px] transition-[transform,box-shadow] duration-[120ms] active:translate-y-[3px] active:[--btn-depth:0px]"
          >
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
              <path d="M4 10a6 6 0 0 1 10.5-4M16 10a6 6 0 0 1-10.5 4M14 2v4h-4M6 18v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Shuffle
          </button>
        </div>

        {/* Board */}
        <div className="relative mt-6 w-full max-w-[720px]">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
            {deck.map((card, i) => (
              <GameCard
                key={card.key}
                card={card}
                index={i}
                faceUp={up.includes(i)}
                matched={matched.has(card.id)}
                missKey={miss.idx.includes(i) ? miss.n : 0}
                reduce={reduce}
                onFlip={() => flip(i)}
              />
            ))}
          </div>

          {/* Win */}
          <AnimatePresence>
            {won && (
              <motion.div
                className="absolute inset-0 z-20 grid place-items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                role="status"
              >
                {!reduce &&
                  Array.from({ length: 22 }, (_, k) => {
                    const a = (k / 22) * Math.PI * 2;
                    const d = 180 + (k % 4) * 60;
                    return (
                      <motion.span
                        key={k}
                        className="pointer-events-none absolute left-1/2 top-1/2 w-9 sm:w-11"
                        initial={{ x: 0, y: 0, scale: 0.3, opacity: 1, rotate: 0 }}
                        animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d * 0.7, scale: 1, opacity: 0, rotate: (k % 2 ? 1 : -1) * 220 }}
                        transition={{ duration: 1.3, ease: [0.23, 1, 0.32, 1], delay: 0.15 + (k % 5) * 0.03 }}
                      >
                        <Particle icon={CONFETTI[k % CONFETTI.length]} className="block h-auto w-full -translate-x-1/2 -translate-y-1/2" />
                      </motion.span>
                    );
                  })}
                <motion.div
                  initial={{ scale: 0.85, rotate: -6, y: 20 }}
                  animate={{ scale: 1, rotate: -2, y: 0 }}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.4, delay: 0.2 }}
                  className="relative mx-4 rounded-[26px] border-[3px] border-ink bg-sun px-6 py-6 text-center shadow-[0_8px_0_0_var(--color-ink)] sm:px-10"
                >
                  <p className="font-display text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1]">You found them all!</p>
                  <p className="mt-2 text-[15px] font-semibold text-ink/75">
                    {moves} moves{moves <= 8 ? " — that's a real Oodle memory!" : ". Nicely done!"}
                  </p>
                  <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button href="/" tone="ink">
                      Take me home
                    </Button>
                    <button
                      type="button"
                      onClick={restart}
                      className="btn-soft rounded-full bg-cream px-5 py-3 text-[14px] font-bold transition-[transform,box-shadow] duration-[120ms] active:translate-y-[4px] active:[--btn-depth:0px]"
                    >
                      Play again
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
