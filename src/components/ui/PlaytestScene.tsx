/**
 * "Playtest #1 · the kitchen table" — a top-down, hand-drawn scene of the very first paper prototype:
 * a pencilled game board, coins, question cards, a pencil, a kid's "more coins!!" sticky note and
 * a big mug next to a little one (a quiet nod to parent + child without drawing either).
 * Brand palette only; soft pencil lines rather than hard ink outlines. viewBox is 400×420 (4:4.2).
 */

const INK = "#1e222d";
const CREAM = "#e4e1cf";
const SUN = "#f2d439";
const OCHRE = "#cc652b";
const OXBLOOD = "#42171b";
const TOMATO = "#ea3d39";
const LEAF = "#95ba4c";
const LILAC = "#716bac";

const PENCIL = { stroke: INK, strokeOpacity: 0.55, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" } as const;
const display = { fontFamily: "var(--font-display), system-ui, sans-serif" };

function Coin({ x, y, r = 13 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x + 1.5} cy={y + 3} r={r} fill={INK} opacity={0.14} />
      <circle cx={x} cy={y} r={r} fill={SUN} />
      <circle cx={x} cy={y} r={r * 0.68} fill="none" stroke={OCHRE} strokeOpacity={0.55} strokeWidth={1.6} />
      <path d={`M${x - r * 0.25} ${y - r * 0.45}l${r * 0.1} ${r * 0.9}`} stroke="#fff" strokeOpacity={0.55} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

export default function PlaytestScene({ className = "", detailed = true }: { className?: string; detailed?: boolean }) {
  return (
    <svg viewBox="0 0 400 420" className={className} role="img" aria-label="A hand-drawn paper prototype of the first Oodle game on a kitchen table, with coins, cards, a pencil and two mugs">
      {/* the table */}
      <rect width="400" height="420" fill={OCHRE} />
      <g stroke={OXBLOOD} strokeOpacity={0.14} strokeWidth={2}>
        <path d="M0 96 H400" />
        <path d="M0 204 H400" />
        <path d="M0 316 H400" />
        <path d="M120 0 V96 M290 96 V204 M70 204 V316 M240 316 V420" />
      </g>
      {/* soft lamp light pooling on the table */}
      <defs>
        <radialGradient id="pt-light" cx="45%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width="400" height="420" fill="url(#pt-light)" />

      {/* big mug (grown-up's coffee) */}
      <g>
        <circle cx="62" cy="70" r="36" fill={INK} opacity={0.14} transform="translate(3 5)" />
        <rect x="88" y="60" width="26" height="16" rx="8" fill={CREAM} />
        <circle cx="62" cy="70" r="36" fill={CREAM} />
        <circle cx="62" cy="70" r="28" fill={OXBLOOD} opacity={0.88} />
        <ellipse cx="54" cy="62" rx="9" ry="5" fill="#fff" opacity={0.16} />
      </g>
      {/* little mug (kid's milk) */}
      <g>
        <circle cx="128" cy="44" r="22" fill={INK} opacity={0.14} transform="translate(2 4)" />
        <rect x="144" y="37" width="17" height="11" rx="5.5" fill={LILAC} />
        <circle cx="128" cy="44" r="22" fill={LILAC} />
        <circle cx="128" cy="44" r="16" fill={CREAM} />
      </g>

      {/* the paper prototype board */}
      <g transform="rotate(-6 200 215)">
        <rect x="78" y="120" width="250" height="196" rx="6" fill={INK} opacity={0.16} transform="translate(4 7)" />
        <rect x="78" y="120" width="250" height="196" rx="6" fill={CREAM} />
        {/* faint notebook rules */}
        <g stroke={LILAC} strokeOpacity={0.18} strokeWidth={1}>
          {Array.from({ length: 9 }, (_, i) => (
            <path key={i} d={`M84 ${142 + i * 20} H322`} />
          ))}
        </g>
        {/* hand-drawn loop track */}
        <rect x="98" y="138" width="210" height="160" rx="26" {...PENCIL} strokeWidth={14} strokeOpacity={0.08} />
        <rect x="98" y="138" width="210" height="160" rx="26" {...PENCIL} strokeWidth={2.4} strokeDasharray="15 9" />
        {/* coloured-in squares */}
        <rect x="91" y="131" width="20" height="20" rx="4" fill={LEAF} opacity={0.85} />
        <rect x="294" y="131" width="20" height="20" rx="4" fill={SUN} opacity={0.95} />
        <rect x="294" y="284" width="20" height="20" rx="4" fill={TOMATO} opacity={0.8} />
        <rect x="91" y="284" width="20" height="20" rx="4" fill={LILAC} opacity={0.8} />
        <text x="96" y="171" style={display} fontSize="13" fill={INK} fillOpacity={0.7}>
          START
        </text>
        {/* title, with a wobbly pencil underline */}
        <text x="203" y="196" textAnchor="middle" style={display} fontSize="23" fill={INK} fillOpacity={0.82}>
          money game
        </text>
        <text x="203" y="222" textAnchor="middle" style={display} fontSize="14" fill={INK} fillOpacity={0.5}>
          version 1
        </text>
        <path d="M170 230 q16 -5 33 0 t33 -1" {...PENCIL} strokeWidth={2} strokeOpacity={0.45} />
        {/* pencilled rupee coin in the middle */}
        <circle cx="203" cy="256" r="17" {...PENCIL} strokeWidth={2.2} />
        <text x="203" y="263" textAnchor="middle" fontSize="19" fontWeight="700" fill={INK} fillOpacity={0.6}>
          ₹
        </text>
        {/* little arrows around the track */}
        <path d="M150 131 l8 7 -8 7" {...PENCIL} strokeWidth={2} />
        <path d="M250 292 l-8 7 8 7" {...PENCIL} strokeWidth={2} />
      </g>

      {/* question cards */}
      <g transform="rotate(14 318 344)">
        <rect x="290" y="306" width="56" height="78" rx="7" fill={INK} opacity={0.16} transform="translate(3 5)" />
        <rect x="290" y="306" width="56" height="78" rx="7" fill={LILAC} />
        <rect x="296" y="312" width="44" height="66" rx="5" fill="none" stroke={CREAM} strokeOpacity={0.5} strokeWidth={1.5} />
        <text x="318" y="357" textAnchor="middle" style={display} fontSize="30" fill={CREAM}>
          ?
        </text>
      </g>
      <g transform="rotate(-8 268 352)">
        <rect x="240" y="318" width="56" height="78" rx="7" fill={INK} opacity={0.16} transform="translate(3 5)" />
        <rect x="240" y="318" width="56" height="78" rx="7" fill={CREAM} />
        <text x="268" y="369" textAnchor="middle" style={display} fontSize="30" fill={TOMATO}>
          ?
        </text>
      </g>

      {/* coins */}
      <Coin x={54} y={330} />
      <Coin x={84} y={352} r={12} />
      <Coin x={46} y={372} r={11} />
      {detailed && <Coin x={350} y={150} r={11} />}

      {/* pencil */}
      <g transform="rotate(-28 130 372)">
        <rect x="90" y="364" width="96" height="14" rx="2" fill={INK} opacity={0.14} transform="translate(2 5)" />
        <rect x="104" y="364" width="80" height="14" fill={SUN} />
        <path d="M104 368.7 H184 M104 373.3 H184" stroke={OCHRE} strokeOpacity={0.35} strokeWidth={1} />
        <rect x="184" y="364" width="12" height="14" rx="3" fill={TOMATO} />
        <path d="M104 364 L86 371 L104 378 Z" fill="#e8c9a0" />
        <path d="M91 369 L86 371 L91 373 Z" fill={INK} opacity={0.7} />
      </g>

      {/* the kid's sticky note */}
      <g transform="rotate(7 330 62)">
        <rect x="282" y="18" width="96" height="88" rx="3" fill={INK} opacity={0.15} transform="translate(3 6)" />
        <rect x="282" y="18" width="96" height="88" rx="3" fill={SUN} />
        <rect x="282" y="18" width="96" height="14" fill={OCHRE} opacity={0.14} />
        <text x="330" y="62" textAnchor="middle" style={display} fontSize="19" fill={INK} fillOpacity={0.8}>
          more
        </text>
        <text x="330" y="84" textAnchor="middle" style={display} fontSize="19" fill={INK} fillOpacity={0.8}>
          coins!!
        </text>
        <path d="M304 92 q26 6 52 -2" {...PENCIL} strokeWidth={2} />
      </g>
    </svg>
  );
}
