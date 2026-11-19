import type { BlockTone, Shape, World } from "@/content/site";
import Oodle from "../ui/Oodle";

/*
  Visual pieces for the toy box. Each fills its parent box (sized by the physics layer),
  using container query units so type scales with the piece.
*/

export function Coin() {
  return (
    <div className="grid h-full w-full place-items-center rounded-full border-[3px] border-ink bg-sun">
      <div className="grid h-[76%] w-[76%] place-items-center rounded-full border-2 border-dashed border-ink/35">
        <span className="font-sans text-[46cqw] font-extrabold leading-none text-ink">₹</span>
      </div>
    </div>
  );
}

export function Token() {
  return (
    <div className="grid h-full w-full place-items-center rounded-full border-[3px] border-ink bg-tomato">
      <svg viewBox="0 0 24 24" aria-hidden className="h-[58%] w-[58%]">
        <path
          d="M12 2.8l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.7l-5.4 2.9 1.1-6.1-4.5-4.3 6.1-.8z"
          fill="var(--color-cream)"
          stroke="var(--color-ink)"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const CARD = {
  money: { face: "bg-forest", rim: "border-cream/35", kicker: "text-leaf", game: "Master Money" },
  solve: { face: "bg-slate", rim: "border-cream/30", kicker: "text-lilac", game: "Master Solutions" },
  biz: { face: "bg-oxblood", rim: "border-cream/25", kicker: "text-ochre", game: "Master Biz" },
} as const;

/** A game card at real playing-card proportions (63:88). */
export function GameCard({ variant }: { variant: keyof typeof CARD }) {
  const c = CARD[variant];
  return (
    <div className={`relative h-full w-full rounded-[9cqw] border-[3px] border-ink ${c.face} p-[6cqw]`}>
      <div className={`flex h-full w-full flex-col rounded-[6cqw] border-2 ${c.rim} p-[7cqw] text-cream`}>
        {variant === "money" && (
          <>
            <span className="font-display text-[16cqw] leading-none text-sun">₹100</span>
            <div className="grid flex-1 place-items-center">
              <Oodle world="money" shape="coin" className="h-auto w-[60cqw]" sizes="90px" />
            </div>
            <span className="self-end rotate-180 font-display text-[16cqw] leading-none text-sun">₹100</span>
          </>
        )}
        {variant === "solve" && (
          <>
            <span className={`label text-[6.5cqw] tracking-[0.12em] ${c.kicker}`}>Problem</span>
            <p className="mt-[5cqw] font-display text-[13cqw] leading-[1.02]">Your friend won&apos;t share. What now?</p>
            <div className="mt-auto grid grid-cols-4 gap-[2cqw]">
              {["Think", "Feel", "Talk", "Act"].map((w) => (
                <span key={w} className="rounded-full bg-cream/12 py-[2cqw] text-center text-[5.5cqw] font-bold uppercase text-sun">
                  {w}
                </span>
              ))}
            </div>
          </>
        )}
        {variant === "biz" && (
          <>
            <span className={`label text-[6.5cqw] tracking-[0.12em] ${c.kicker}`}>Market</span>
            <span className="mt-[7cqw] text-[8.5cqw] font-semibold text-cream/75">Kids want:</span>
            <span className="font-display text-[19cqw] leading-[0.95] text-sun">Fun +</span>
            <span className="font-display text-[19cqw] leading-[0.95] text-sun">Budget</span>
            <div className="mt-auto flex items-center justify-end">
              <span className="grid h-[16cqw] w-[16cqw] place-items-center rounded-full bg-ochre text-[8cqw] font-extrabold text-ink">
                +3
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const TONE: Record<BlockTone, { face: string; text: string }> = {
  forest: { face: "bg-forest", text: "text-sun" },
  lilac: { face: "bg-lilac", text: "text-cream" },
  sun: { face: "bg-sun", text: "text-ink" },
  slate: { face: "bg-slate", text: "text-cream" },
  ochre: { face: "bg-ochre", text: "text-cream" },
  crimson: { face: "bg-crimson", text: "text-cream" },
};

/** A chunky toy block carrying one of the life lessons, with its Oodle riding along. */
export function Block({ label, world, shape, tone }: { label: string; world: World; shape: Shape; tone: BlockTone }) {
  const t = TONE[tone];
  return (
    <div
      className={`relative flex h-full w-full items-center gap-[0.5em] rounded-[0.6em] border-[3px] border-ink pl-[0.35em] pr-[0.7em] text-[clamp(14px,1.65vw,23px)] shadow-[inset_0_-0.32em_0_rgb(30_34_45/0.28)] ${t.face}`}
    >
      <span className="pointer-events-none absolute inset-x-[0.5em] top-[0.3em] h-[0.28em] rounded-full bg-cream/25" />
      <span className="relative grid aspect-square h-[72%] shrink-0 place-items-center rounded-[0.45em] border-[2.5px] border-ink bg-cream">
        <Oodle world={world} shape={shape} className="h-[82%] w-auto" sizes="64px" />
      </span>
      <span className={`relative font-display leading-[0.95] ${t.text}`}>{label}</span>
    </div>
  );
}
