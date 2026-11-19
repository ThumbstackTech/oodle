// Single source of truth for landing-page copy. Text comes from docs/WEBSITE COPY.pdf and
// docs/oodle breif.pdf. Anything marked [draft] is new Oodle-voice micro-copy awaiting client approval.

export type World = "money" | "biz" | "solve";
export type Shape = "coin" | "clover" | "star" | "tri" | "cloud" | "blob";

export const nav = {
  links: [
    { label: "Hey, Oodle!", href: "#top" },
    { label: "Our Games", href: "#games" },
    { label: "The Oodle Difference", href: "#difference" },
    { label: "Behind the Oodle", href: "#story" },
    { label: "Freebie Factory", href: "#freebies" },
    { label: "FAQs", href: "#faq" },
  ],
  cta: { label: "Buy on Amazon", href: "#games" },
};

export const hero = {
  eyebrow: "Big lessons. Little play.",
  top: "Play today.",
  bottom: "Ready for life tomorrow.",
  lead: "What if playtime could do a little more? We turn important life skills into games children love to play.",
  primary: { label: "Explore Our Games", href: "#games" },
  secondary: { label: "Enter the Freebie Factory", href: "#freebies" },
  hint: "psst… grab one & throw it!", // [draft]
};

/** Portal hero (current). The toy-box hero above is parked in HeroToyBox.tsx. */
export const heroPortals = {
  heading: ["Big lessons.", "Little play."],
  sub: { before: "Play today. Ready ", underline: "for life", after: " tomorrow." },
  primary: { label: "Explore Our Games", href: "#games" },
  secondary: { label: "Enter the Freebie Factory", href: "#freebies" },
};

export type PortalIcon =
  | "coin"
  | "note"
  | "piggy"
  | "stack"
  | "sparkle"
  | "bulb"
  | "puzzle"
  | "question"
  | "gear"
  | "star"
  | "cloud"
  | "trophy"
  | "briefcase"
  | "chart";

export type PortalTheme = {
  id: World;
  game: string;
  /** stone colours: face, darker joint shade */
  stone: string;
  /** doorway glow: centre → mid → edge */
  glow: [string, string, string];
  /** smoke ribbons out of the portal */
  mist: [string, string];
  emblem: "rupee" | "bulb" | "crown";
  /** what floats inside the doorway */
  inside: [PortalIcon, PortalIcon, PortalIcon];
  resident: Shape;
  /** an Oodle outside the portal: leaping out, or sitting on top */
  perch?: { shape: Shape; pose: "leap" | "sit" };
  /** stream that drifts out of the top */
  icons: PortalIcon[];
};

/** The three worlds as portals — colours from each game's brand pattern. */
export const portals: PortalTheme[] = [
  {
    id: "money",
    game: "Master Money",
    stone: "#36604b",
    glow: ["#f2d439", "#95ba4c", "#36604b"],
    mist: ["#95ba4c", "#f2d439"],
    emblem: "rupee",
    inside: ["note", "coin", "piggy"],
    resident: "clover",
    perch: { shape: "coin", pose: "leap" },
    icons: ["coin", "sparkle", "stack", "coin"],
  },
  {
    id: "solve",
    game: "Master Solutions",
    stone: "#716bac",
    glow: ["#e4e1cf", "#716bac", "#434b6d"],
    mist: ["#716bac", "#e4e1cf"],
    emblem: "bulb",
    inside: ["bulb", "puzzle", "question"],
    resident: "star",
    icons: ["gear", "sparkle", "puzzle", "bulb"],
  },
  {
    id: "biz",
    game: "Master Biz",
    stone: "#991626",
    glow: ["#f2d439", "#cc652b", "#991626"],
    mist: ["#cc652b", "#ea3d39"],
    emblem: "crown",
    inside: ["chart", "trophy", "briefcase"],
    resident: "cloud",
    perch: { shape: "tri", pose: "sit" },
    icons: ["star", "sparkle", "star", "cloud"],
  },
];

/** What each Oodle says when poked. [draft] */
export const sayings: Record<`${World}-${Shape}`, string[]> = {
  "money-coin": ["Saving up for something big!", "Ka-ching!", "Money grows with patience."],
  "money-clover": ["Earned it! Spend or save?", "Needs first, wants later."],
  "money-star": ["₹50, ₹100, ₹150… budget!", "Juggling my pocket money!"],
  "money-tri": ["Let me check the numbers…", "Reading up on saving."],
  "money-cloud": ["Calculating my goal!", "Wink wink, smart choice."],
  "money-blob": ["Piggy bank's getting heavy!", "Off to the bank!"],
  "biz-coin": ["Game on!", "Let's make a deal."],
  "biz-clover": ["Lemonade stand? Think bigger.", "Off to my big pitch!"],
  "biz-star": ["Customer on line one!", "Sales are up!"],
  "biz-tri": ["Idea. Customer. Price. Done.", "Checklist complete!"],
  "biz-cloud": ["We won the pitch!", "Trophy time!"],
  "biz-blob": ["Chief Executive of snack time.", "Super-founder, away!"],
  "solve-coin": ["Bullseye! Goal set.", "Aim, then act."],
  "solve-clover": ["Tricky? Let's figure it out.", "Every piece fits somewhere."],
  "solve-star": ["Ooh, I've got an idea!", "Lightbulb moment!"],
  "solve-tri": ["There's more than one answer.", "Think it through…"],
  "solve-cloud": ["Think. Feel. Talk. Act.", "Found the key!"],
  "solve-blob": ["Kind wins the crown.", "We did it together!"],
};

/** Physics toy box contents. `drop` = horizontal spawn position as a fraction of the hero width. */
export type ToyPiece =
  | { kind: "oodle"; world: World; shape: Shape; size: number; drop: number }
  | { kind: "coin"; drop: number }
  | { kind: "token"; drop: number }
  | { kind: "card"; variant: "money" | "solve" | "biz"; drop: number }
  | { kind: "block"; label: string; world: World; shape: Shape; tone: BlockTone; drop: number }
  | { kind: "icon"; icon: PortalIcon; size?: number; drop: number };

export type BlockTone = "forest" | "lilac" | "sun" | "slate" | "ochre" | "crimson";

export const toys: ToyPiece[] = [
  { kind: "oodle", world: "money", shape: "star", size: 1.05, drop: 0.22 },
  { kind: "oodle", world: "biz", shape: "blob", size: 1, drop: 0.74 },
  { kind: "card", variant: "money", drop: 0.08 },
  { kind: "coin", drop: 0.15 },
  { kind: "oodle", world: "solve", shape: "tri", size: 1, drop: 0.88 },
  { kind: "token", drop: 0.62 },
  { kind: "oodle", world: "money", shape: "coin", size: 1, drop: 0.32 },
  { kind: "card", variant: "biz", drop: 0.93 },
  { kind: "coin", drop: 0.47 },
  { kind: "oodle", world: "biz", shape: "clover", size: 0.95, drop: 0.55 },
  { kind: "card", variant: "solve", drop: 0.4 },
  { kind: "token", drop: 0.26 },
  { kind: "oodle", world: "solve", shape: "cloud", size: 0.95, drop: 0.68 },
  { kind: "coin", drop: 0.82 },
  { kind: "token", drop: 0.05 },
  { kind: "coin", drop: 0.6 },
];

export type ThoughtInlineToken =
  | { type: "text"; value: string }
  | { type: "break" }
  | { type: "oodle"; world: World; shape: Shape; rotate?: number }
  | { type: "particle"; icon: PortalIcon; rotate?: number };

export const thought = {
  label: "The Oodle Thought",
  headline: "Some lessons are too important to leave until later.",
  highlight: "important",
  beats: [
    [
      { type: "text", value: "Children learn to read," },
      { type: "particle", icon: "note", rotate: -8 },
      { type: "text", value: "write and solve equations. But what about managing" },
      { type: "oodle", world: "money", shape: "coin", rotate: 6 },
      { type: "text", value: "money? Making decisions?" },
      { type: "particle", icon: "puzzle", rotate: -8 },
      { type: "text", value: "Thinking" },
      { type: "particle", icon: "bulb", rotate: 8 },
      { type: "text", value: "independently? Dealing with" },
      { type: "oodle", world: "solve", shape: "cloud", rotate: -5 },
      { type: "text", value: "setbacks? Recognising" },
      { type: "oodle", world: "biz", shape: "blob", rotate: 7 },
      { type: "text", value: "opportunities?" },
    ],
    [
      { type: "text", value: "These are skills that shape how" },
      { type: "oodle", world: "solve", shape: "tri", rotate: -6 },
      { type: "text", value: "children approach the world. And there's no reason they can't start exploring" },
      { type: "particle", icon: "star", rotate: 12 },
      { type: "text", value: "them early. At Oodle Learn, we believe children learn best when they're curious," },
      { type: "particle", icon: "question", rotate: 8 },
      { type: "text", value: "involved and having" },
      { type: "oodle", world: "money", shape: "clover", rotate: -6 },
      { type: "text", value: "fun. So we make play" },
      { type: "particle", icon: "trophy", rotate: 8 },
      { type: "text", value: "the starting point for learning that goes beyond the" },
      { type: "oodle", world: "biz", shape: "star", rotate: 6 },
      { type: "text", value: "classroom." },
    ],
  ] as ThoughtInlineToken[][],
  /** Revealed on its own at the very end. */
  closing: { lead: "Because growing up is one big", word: "adventure.", tail: "Let's help them get ready for it." },
  /** Toys that rain in as you enter, and settle on the skill tapes below. */
  toys: [
    { kind: "oodle", world: "money", shape: "coin", size: 0.69, drop: 0.1 },
    { kind: "icon", icon: "star", size: 1.15, drop: 0.5 },
    { kind: "oodle", world: "solve", shape: "tri", size: 0.69, drop: 0.88 },
    { kind: "token", drop: 0.3 },
    { kind: "oodle", world: "biz", shape: "blob", size: 0.69, drop: 0.24 },
    { kind: "icon", icon: "bulb", size: 1.15, drop: 0.68 },
    { kind: "coin", drop: 0.76 },
    { kind: "icon", icon: "puzzle", size: 1.15, drop: 0.06 },
    { kind: "oodle", world: "solve", shape: "star", size: 0.71, drop: 0.36 },
    { kind: "icon", icon: "piggy", size: 1.26, drop: 0.92 },
    { kind: "oodle", world: "money", shape: "clover", size: 0.64, drop: 0.64 },
    { kind: "token", drop: 0.16 },
    { kind: "icon", icon: "trophy", size: 1.15, drop: 0.44 },
    { kind: "oodle", world: "biz", shape: "star", size: 0.67, drop: 0.82 },
    { kind: "coin", drop: 0.46 },
    { kind: "icon", icon: "gear", size: 1.15, drop: 0.2 },
    { kind: "oodle", world: "money", shape: "blob", size: 0.64, drop: 0.56 },
    { kind: "icon", icon: "note", size: 1.32, drop: 0.72 },
    { kind: "oodle", world: "solve", shape: "cloud", size: 0.64, drop: 0.96 },
    { kind: "icon", icon: "star", size: 0.92, drop: 0.6 },
    { kind: "oodle", world: "biz", shape: "tri", size: 0.64, drop: 0.03 },
    { kind: "token", drop: 0.86 },
    { kind: "icon", icon: "question", size: 1.15, drop: 0.4 },
  ] as ToyPiece[],
};

export const skills = {
  label: "What little minds can master",
  title: "More than just play.",
  titleAccent: "Skills for life.",
  marquee: ["earn", "save", "think", "feel", "pitch", "spend", "talk", "invest", "act", "spot ideas", "solve", "dream big"],
  panels: [
    {
      world: "money" as World,
      title: "Money Smart",
      game: "Master Money",
      body: "Understanding money, making choices and learning to save, spend and grow.",
      teaches: "Earn · Spend · Save · Invest",
      hex: "#36604b",
      bg: "bg-forest",
      chip: "bg-leaf text-ink",
      pattern: "/patterns/money.svg",
      letters: "/patterns/letters-money.svg",
      cast: ["coin", "clover", "star", "tri", "cloud", "blob"] as Shape[],
      href: "#games",
    },
    {
      world: "solve" as World,
      title: "Life Smart",
      game: "Master Solutions",
      body: "Understanding feelings, handling challenges and learning to think before reacting.",
      teaches: "Think · Feel · Talk · Act",
      hex: "#434b6d",
      bg: "bg-slate",
      chip: "bg-lilac text-cream",
      pattern: "/patterns/solve.svg",
      letters: "/patterns/letters-solve.svg",
      cast: ["tri", "star", "clover", "cloud", "coin", "blob"] as Shape[],
      href: "#games",
    },
    {
      world: "biz" as World,
      title: "Business Smart",
      game: "Master Biz",
      body: "Spotting opportunities, creating ideas and thinking like a young entrepreneur.",
      teaches: "Idea · Customer · Price · Pitch",
      hex: "#42171b",
      bg: "bg-oxblood",
      chip: "bg-ochre text-cream",
      pattern: "/patterns/biz.svg",
      letters: "/patterns/letters-biz.svg",
      cast: ["blob", "clover", "star", "tri", "cloud", "coin"] as Shape[],
      href: "#games",
    },
  ],
};

/** Section 4 — The Oodle difference. Copy verbatim from the website copy doc. */
export const difference = {
  label: "The Oodle difference",
  headline: ["Not another lesson.", "A different way to learn."],
  highlight: "different",
  intro:
    "We don't believe every learning experience needs a textbook, a classroom or a right answer. Sometimes, it's a game that gets a child thinking. A question that sparks a conversation. A challenge that makes them try again. Or an idea that takes them somewhere unexpected.",
  wantIntro: "At Oodle Learn, we want children to",
  traits: [
    {
      trait: "curious",
      title: "Be curious",
      rest: "to ask questions.",
      body: "Curious enough to ask questions, wonder why and explore how the world works.",
      world: "solve",
      shape: "star",
      face: "bg-leaf text-ink",
      pill: "border-ink/45 text-ink",
      icons: ["question", "bulb", "sparkle"] as PortalIcon[],
    },
    {
      trait: "confident",
      title: "Be confident",
      rest: "to try.",
      body: "Confident enough to try something new, speak up and make their own move.",
      world: "biz",
      shape: "blob",
      face: "bg-tomato text-cream",
      pill: "border-cream/55 text-cream",
      icons: ["trophy", "star", "sparkle"] as PortalIcon[],
    },
    {
      trait: "comfortable",
      title: "Be comfortable",
      rest: "to make mistakes.",
      body: "Comfortable enough to make mistakes, laugh them off and try another way.",
      world: "solve",
      shape: "cloud",
      face: "bg-sun text-ink",
      pill: "border-ink/45 text-ink",
      icons: ["puzzle", "gear", "sparkle"] as PortalIcon[],
    },
    {
      trait: "open",
      title: "Be open",
      rest: "to see things differently.",
      body: "Open enough to see things differently, listen and understand other perspectives.",
      world: "solve",
      shape: "tri",
      face: "bg-lilac text-cream",
      pill: "border-cream/55 text-cream",
      icons: ["bulb", "cloud", "star"] as PortalIcon[],
    },
    {
      trait: "excited",
      title: "Be excited",
      rest: "to keep figuring things out.",
      body: "Excited enough to keep figuring things out, one playful challenge at a time.",
      world: "money",
      shape: "star",
      face: "bg-forest text-cream",
      pill: "border-cream/55 text-cream",
      icons: ["coin", "star", "sparkle"] as PortalIcon[],
    },
  ] as {
    trait: string;
    title: string;
    rest: string;
    body: string;
    world: World;
    shape: Shape;
    face: string;
    pill: string;
    icons: PortalIcon[];
  }[],
  closing: { lead: "Because growth mindset isn't built in a day.", tail: "It grows with every little opportunity to explore." },
};

/** Section 6 — Behind the Games (the story). Copy verbatim from the website copy doc. */
export const story = {
  label: "Behind the games",
  headline: "It started with a mom, a little boy and a lot of questions.",
  highlight: "a lot of questions.",
  body: [
    "From conversations about money, investing and earning to the many questions that come with growing up, Oodle Learn began at home.",
    "What started as an idea for one curious little mind became a bigger ambition: to help more children discover the skills that matter in life.",
  ],
  cta: { label: "Get to Know Us", href: "#story" },
  /** Placeholder until the founders' photo arrives. */
  caption: "Olinda & Orai · where it all began",
  ask: "Ask another",
  /** The little boy's questions. [draft] */
  questions: [
    "Mumma, what's investing?",
    "Why can't we buy everything?",
    "How do shops make money?",
    "Can I start a business?",
    "Why do we save?",
    "What's a budget?",
    "Where does money come from?",
    "What if I make a mistake?",
    "Is a lemonade stand a business?",
  ],
};

/** FAQs — questions & answers verbatim from the website copy doc. Each one has an Oodle "answerer". */
export const faq = {
  label: "FAQs",
  headline: "Frequently asked questions",
  highlight: "questions",
  crewNote: "our crew of very serious question-answerers", // [draft]
  items: [
    {
      q: "What is Oodle Learn?",
      a: "Oodle Learn creates games and playful learning experiences that help children explore important life skills, including financial literacy, problem-solving, emotional intelligence and entrepreneurial thinking.",
      world: "money" as World,
      shape: "coin" as Shape,
    },
    {
      q: "What age group are the games designed for?",
      a: "Our current games are designed for children aged 4–10, with age recommendations varying by game. Please refer to individual game pages for details.",
      world: "solve" as World,
      shape: "tri" as Shape,
    },
    {
      q: "Are these educational games or regular card games?",
      a: "They're designed to bring the two together. Children play, make decisions, explore different situations and learn through the experience, without feeling like they're sitting through a lesson.",
      world: "biz" as World,
      shape: "blob" as Shape,
    },
    {
      q: "Can parents play along?",
      a: "Absolutely! Parents can join in, ask questions and encourage conversations. The games are designed to make learning together enjoyable.",
      world: "money" as World,
      shape: "clover" as Shape,
    },
    {
      q: "Do children need prior knowledge of money or business?",
      a: "No. The games introduce concepts through play, so children can learn as they go.",
      world: "solve" as World,
      shape: "star" as Shape,
    },
    {
      q: "Where can I buy Oodle Learn games?",
      a: "Our games are available through Amazon India. Follow the purchase links on the individual game pages.",
      world: "biz" as World,
      shape: "cloud" as Shape,
    },
    {
      q: "Do you offer free activities?",
      a: "Yes! Visit the Freebie Factory for free printables, puzzles, challenges and activities.",
      world: "money" as World,
      shape: "star" as Shape,
    },
    {
      q: "Do you deliver internationally?",
      a: "Our physical games are currently available for delivery within India. Please check the purchase platform for the latest delivery availability.",
      world: "solve" as World,
      shape: "cloud" as Shape,
    },
  ],
};

/** Freebie Factory — downloadable printables (public/freebies). Registration required before download. */
export const freebies = {
  headline: "Little downloads. Big discoveries.",
  highlight: "Big discoveries.",
  lead: "Free printables, puzzles and challenges to keep the learning going at home.",
  items: [
    {
      title: "My 500 Challenge",
      blurb: "Plan, budget and stretch ₹500 like a real money pro.", // [draft]
      tag: "Money Matters",
      slug: "my-500-challenge",
      world: "money" as World,
      shape: "coin" as Shape,
      pattern: "/patterns/money.svg",
      bg: "bg-forest",
      chip: "bg-leaf text-ink",
    },
    {
      title: "The Think it Through Challenge",
      blurb: "Pause, think, then act — tricky situations to talk through together.", // [draft]
      tag: "Think It Through",
      slug: "think-it-through",
      world: "solve" as World,
      shape: "tri" as Shape,
      pattern: "/patterns/solve.svg",
      bg: "bg-slate",
      chip: "bg-lilac text-cream",
    },
    {
      title: "My First Little Business",
      blurb: "From a big idea to a tiny business plan.", // [draft]
      tag: "Little Entrepreneurs",
      slug: "my-first-little-business",
      world: "biz" as World,
      shape: "blob" as Shape,
      pattern: "/patterns/biz.svg",
      bg: "bg-oxblood",
      chip: "bg-ochre text-cream",
    },
    {
      title: "7-Day Brave Challenge",
      blurb: "One small brave step a day, for a whole week.", // [draft]
      tag: "Think It Through",
      slug: "7-day-brave-challenge",
      world: "solve" as World,
      shape: "star" as Shape,
      pattern: "/patterns/letters-solve.svg",
      bg: "bg-lilac",
      chip: "bg-sun text-ink",
    },
    {
      title: "The Little Detectives",
      blurb: "Spot clues, solve puzzles, crack the case.", // [draft]
      tag: "Creative Corner",
      slug: "little-detectives",
      world: "biz" as World,
      shape: "cloud" as Shape,
      pattern: "/patterns/letters-biz.svg",
      bg: "bg-ochre",
      chip: "bg-cream text-ink",
    },
  ],
  form: {
    title: "A little Oodle treat, coming right up!",
    sub: "Tell us who you are and your download will start straight away.",
    name: "Name",
    phone: "Contact no.",
    email: "Email",
    submit: "Download now",
    note: "We'll only use this to send you Oodle goodies. No spam, promise.", // [draft]
    done: "Yay! Your download has started.",
  },
};

/** Full game details for the game modal — verbatim from "Page 2. The Oodle Play Lab" in the copy doc. */
export type GameDetail = {
  world: World;
  name: string;
  short: string;
  tagline: string;
  hook: string;
  about: string[];
  facts: { label: string; value: string; icon: PortalIcon }[];
  feature: { title: string; items: { name: string; title?: string; body: string; icon: PortalIcon }[] };
  howTo: { headline: string; body: string[]; wins?: string[] };
  inBox: string[];
  practiseTitle: string;
  practise: string[];
  grownUps: string[];
  buyLabel: string;
  /** Amazon link — add later */
  buyHref: string;
};

export const gameDetails: Record<World, GameDetail> = {
  money: {
    world: "money",
    name: "Master Money",
    short: "Money",
    tagline: "Little money minds. Big money moves.",
    hook: "Money doesn't grow on trees. But smart money habits can grow with practice!",
    about: [
      "In Master Money, children step into a world where they get to earn money, make spending choices, work towards goals and explore what it means to save and invest.",
      "Every decision gives them something to think about. Should they spend now or save for later? Is something a need or a want? How much do they need to reach their goal?",
      "The game makes these conversations easier, more relatable and a whole lot more fun.",
    ],
    facts: [
      { label: "Recommended age", value: "4–10 years", icon: "star" },
      { label: "Players", value: "2–6 Players", icon: "sparkle" },
      { label: "Play style", value: "Financial literacy card game", icon: "note" },
      { label: "Skills explored", value: "Money maths, budgeting, saving, spending and decision-making", icon: "bulb" },
    ],
    feature: {
      title: "What will little players explore?",
      items: [
        { name: "Earn", body: "Understand that money comes from creating value, working and earning.", icon: "coin" },
        { name: "Spend", body: "Make choices, understand wants versus needs and think before spending.", icon: "note" },
        { name: "Save", body: "Discover the satisfaction of putting money aside for something they really want.", icon: "piggy" },
        { name: "Invest", body: "Get introduced to the idea that money can be put to work to grow over time.", icon: "chart" },
      ],
    },
    howTo: {
      headline: "Earn. Decide. Make your move.",
      body: [
        "Players use money cards and goal cards as they move through different money decisions.",
        "They get to earn, spend, save and explore ways to grow their money, while keeping their goals in mind. The challenge is to make thoughtful choices with the money they have.",
        "It's a simple way to introduce children to money concepts through decisions they can actually understand and enjoy.",
      ],
    },
    inBox: ["Money cards in denominations of 50, 100, 150 and 200", "Goal cards", "Game instructions"],
    practiseTitle: "A little more than just a game",
    practise: [
      "Counting and basic money maths",
      "Understanding the value of money",
      "Making spending decisions",
      "Setting savings goals",
      "Thinking about the future",
    ],
    grownUps: [
      "Master Money is a great way to start conversations about money without turning them into lectures.",
      "Let children make their own choices, ask why they made them and talk through what might happen next. There's plenty to discover beyond the cards.",
    ],
    buyLabel: "Get Master Money",
    buyHref: "",
  },
  solve: {
    world: "solve",
    name: "Master Solutions",
    short: "Solutions",
    tagline: "Think it through. See it differently.",
    hook: "A problem can have more than one solution.",
    about: [
      "Master Solutions invites children to explore everyday situations and think about how they might respond.",
      "Through Problem Cards and different ways of responding, children get to consider what they think, what they feel, what they could say and what they could do.",
      "There isn't always a single correct answer. The fun is in exploring possibilities, understanding different perspectives and discovering that there is more than one way to approach a situation.",
    ],
    facts: [
      { label: "Recommended age", value: "4–10 years", icon: "star" },
      { label: "Players", value: "2–6 Players", icon: "sparkle" },
      { label: "Play style", value: "Problem-solving and emotional intelligence card game", icon: "puzzle" },
      { label: "Skills explored", value: "Perspective-taking, emotional awareness, communication and decision-making", icon: "bulb" },
    ],
    feature: {
      title: "Four ways to figure it out",
      items: [
        { name: "Think", title: "Pause and consider.", body: "What is happening? What could be going on? What are the possible ways forward?", icon: "bulb" },
        { name: "Feel", title: "Recognise emotions.", body: "How might I feel? How might the other person feel?", icon: "star" },
        { name: "Talk", title: "Find the words.", body: "How can I communicate what I feel or what I need?", icon: "question" },
        { name: "Act", title: "Explore what to do.", body: "What action could help? What might happen next?", icon: "puzzle" },
      ],
    },
    howTo: {
      headline: "Pick a problem. Explore your possibilities.",
      body: [
        "Players draw a Problem Card presenting a familiar everyday situation.",
        "They then use the solution cards to explore different responses through Think, Feel, Talk and Act.",
        "Each situation opens up a conversation: What could you do? Why might that help? Could there be another way?",
        "The game encourages children to consider their options rather than react automatically.",
      ],
    },
    inBox: ["40 Problem Cards", "48 Solution Icon Cards", "12 Power Wild Cards", "30 Strength Tags"],
    practiseTitle: "What little players get to practise",
    practise: [
      "Recognising and naming emotions",
      "Understanding different perspectives",
      "Thinking through everyday challenges",
      "Expressing thoughts and feelings",
      "Exploring different responses",
      "Building confidence in decision-making",
    ],
    grownUps: [
      "Master Solutions is a lovely way to open up conversations that don't always happen naturally.",
      "There is no need to rush children towards an answer. Give them room to explain their thinking, listen to other perspectives and consider different possibilities.",
      "The aim isn't to tell them how they should feel. It's to help them explore what they can do with those feelings.",
    ],
    buyLabel: "Get Master Solutions",
    buyHref: "",
  },
  biz: {
    world: "biz",
    name: "Master Biz",
    short: "Biz",
    tagline: "Big ideas can come in little packages.",
    hook: "Every great business starts with an idea. But an idea is just the beginning.",
    about: [
      "In Master Biz, children learn to think beyond what they want to create. They explore who their customers could be, what those customers might need and how to price their offering.",
      "The challenge? Their idea needs to match the market.",
      "Each round gives them an opportunity to pitch, make connections and earn Success Tokens. The more they understand the market, the better their chances of building a successful business idea.",
    ],
    facts: [
      { label: "Recommended age", value: "4–10 years", icon: "star" },
      { label: "Players", value: "2–6 Players", icon: "sparkle" },
      { label: "Play style", value: "Entrepreneurial thinking and pitch card game", icon: "briefcase" },
      { label: "Skills explored", value: "Creativity, opportunity spotting, customer thinking, pricing and pitching", icon: "bulb" },
    ],
    feature: {
      title: "Three things every little entrepreneur needs to figure out",
      items: [
        { name: "The Idea", body: "What are you creating? Is it fun, fast, smart, creative or helpful?", icon: "bulb" },
        { name: "The Customer", body: "Who would want it? Kids, parents, teachers, families or everyone?", icon: "star" },
        { name: "The Pricing", body: "How much would you charge? Budget, premium or luxury?", icon: "coin" },
      ],
    },
    howTo: {
      headline: "Think up an idea. Read the market. Make your pitch.",
      body: [
        "Every player uses an Opportunity Card to create a business idea by choosing its idea, customer and pricing categories.",
        "A Market Card is then revealed to show what the market is looking for.",
        "If the player's chosen categories match the market, they earn Success Tokens.",
        "The first player to collect the required number of tokens wins:",
      ],
      wins: ["Ages 5–6: First to 12 Success Tokens", "Ages 7–10: First to 18 Success Tokens"],
    },
    inBox: ["40 Opportunity Cards", "40 Market Cards", "13 Biz Tags", "40 Success Tokens", "Game instructions"],
    practiseTitle: "What little players get to practise",
    practise: [
      "Spotting opportunities",
      "Coming up with creative ideas",
      "Understanding customer needs",
      "Exploring pricing and value",
      "Thinking about market demand",
      "Building confidence in pitching ideas",
      "Making connections between ideas and real-world needs",
    ],
    grownUps: [
      "Master Biz is a great way to introduce children to the thinking behind business without making it feel like a business lesson.",
      "Let them explain their ideas, make their pitches and discover why understanding the customer matters.",
      "You might be surprised by what they come up with!",
    ],
    buyLabel: "Get Master Biz",
    buyHref: "",
  },
};

/** Final CTA — verbatim from the copy doc. */
export const finalCta = {
  lead: "Ready to make",
  blockA: "playtime",
  blockB: "count?",
  sub: "Find your first Oodle game and let the discoveries begin.",
  cta: { label: "Explore Our Games", href: "#games" },
  /** Amazon link — add later */
  buy: { label: "Buy on Amazon", href: "#games" },
};

/** Footer — content from the copy doc's "Website footer". */
export const footer = {
  tagline: { lead: "Play today. Ready for life", word: "tomorrow." },
  links: [
    { label: "Hey, Oodle!", href: "#top" },
    { label: "The Oodle Play Lab", href: "#games" },
    { label: "The Freebie Factory", href: "#freebies" },
    { label: "Behind the Games", href: "#story" },
  ] as { label: string; href?: string; soon?: boolean }[],
  instagram: { handle: "@oodlelearn", href: "https://www.instagram.com/oodlelearn" },
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Refund Policy", href: "/refunds" },
  ],
  note: "Physical games delivered within India",
  hint: { hover: "psst… hover to colour us in", tap: "psst… tap to colour us in" }, // [draft]
  /** The parade, left → right. `prop` = a little brand item between characters. */
  parade: [
    { world: "money", shape: "coin" },
    { world: "solve", shape: "tri" },
    { prop: "coin" },
    { world: "biz", shape: "blob" },
    { world: "money", shape: "clover" },
    { world: "solve", shape: "star" },
    { prop: "bulb" },
    { world: "biz", shape: "star" },
    { world: "money", shape: "cloud" },
    { world: "solve", shape: "cloud" },
    { prop: "star" },
    { world: "biz", shape: "tri" },
  ] as ({ world: World; shape: Shape } | { prop: PortalIcon })[],
};
