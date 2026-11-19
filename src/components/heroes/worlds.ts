import type { Shape, World } from "@/content/site";

/** The three Oodle worlds — built from the client's own pattern artwork and character sets. */
export type WorldDef = {
  id: World;
  game: string;
  short: string;
  tagline: string;
  teaches: string;
  /** solid field (palette) */
  hex: string;
  bg: string;
  text: string;
  accent: string;
  chip: string;
  pattern: string;
  letters: string;
  /** the full cast, in lineup order */
  cast: Shape[];
};

export const WORLDS: WorldDef[] = [
  {
    id: "money",
    game: "Master Money",
    short: "Money",
    tagline: "Little money minds. Big money moves.",
    teaches: "Earn · Spend · Save · Invest",
    hex: "#36604b",
    bg: "bg-forest",
    text: "text-cream",
    accent: "text-sun",
    chip: "bg-leaf text-ink",
    pattern: "/patterns/money.svg",
    letters: "/patterns/letters-money.svg",
    cast: ["coin", "clover", "star", "tri", "cloud", "blob"],
  },
  {
    id: "solve",
    game: "Master Solutions",
    short: "Solutions",
    tagline: "Think it through. See it differently.",
    teaches: "Think · Feel · Talk · Act",
    hex: "#434b6d",
    bg: "bg-slate",
    text: "text-cream",
    accent: "text-sun",
    chip: "bg-lilac text-cream",
    pattern: "/patterns/solve.svg",
    letters: "/patterns/letters-solve.svg",
    cast: ["tri", "star", "clover", "cloud", "coin", "blob"],
  },
  {
    id: "biz",
    game: "Master Biz",
    short: "Biz",
    tagline: "Big ideas can come in little packages.",
    teaches: "Idea · Customer · Price · Pitch",
    hex: "#42171b",
    bg: "bg-oxblood",
    text: "text-cream",
    accent: "text-sun",
    chip: "bg-ochre text-cream",
    pattern: "/patterns/biz.svg",
    letters: "/patterns/letters-biz.svg",
    cast: ["blob", "clover", "star", "tri", "cloud", "coin"],
  },
];

export const HERO_COPY = {
  eyebrow: "Play today. Ready for life tomorrow.",
  heading: ["Big lessons.", "Little play."],
  primary: { label: "Explore Our Games", href: "#games" },
  secondary: { label: "Enter the Freebie Factory", href: "#freebies" },
};
