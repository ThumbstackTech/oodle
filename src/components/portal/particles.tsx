import type { PortalIcon } from "@/content/site";

/*
  Flat-vector icons that fly out of the portals. Same language as the Oodle characters:
  palette fills, chunky ink outline, rounded joins. All drawn on a 48×48 grid.
*/

const INK = "#1e222d";
const SUN = "#f2d439";
const CREAM = "#e4e1cf";
const LEAF = "#95ba4c";
const FOREST = "#36604b";
const LILAC = "#716bac";
const SLATE = "#434b6d";
const OCHRE = "#cc652b";
const CRIMSON = "#991626";
const TOMATO = "#ea3d39";

const stroke = { stroke: INK, strokeWidth: 2.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Rupee({ x, y, size, fill = INK }: { x: number; y: number; size: number; fill?: string }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={size}
      fontWeight={800}
      fill={fill}
      style={{ fontFamily: "var(--font-poppins), sans-serif" }}
    >
      ₹
    </text>
  );
}

const ICONS: Record<PortalIcon, React.ReactNode> = {
  coin: (
    <>
      <circle cx="24" cy="24" r="18" fill={SUN} {...stroke} />
      <circle cx="24" cy="24" r="12.5" fill="none" stroke={INK} strokeOpacity={0.35} strokeWidth={1.8} strokeDasharray="2 3" />
      <Rupee x={24} y={25} size={17} />
    </>
  ),
  note: (
    <>
      <rect x="4" y="12" width="40" height="24" rx="4" fill={LEAF} {...stroke} />
      <rect x="8.5" y="16.5" width="31" height="15" rx="2" fill="none" stroke={FOREST} strokeWidth={1.8} />
      <circle cx="24" cy="24" r="6" fill={SUN} {...stroke} strokeWidth={2} />
      <Rupee x={24} y={24.6} size={8} />
    </>
  ),
  piggy: (
    <>
      <circle cx="30" cy="9" r="5" fill={SUN} {...stroke} strokeWidth={2} />
      <path d="M13 18l2-6 5 4" fill={CREAM} {...stroke} />
      <ellipse cx="22" cy="27" rx="15" ry="11" fill={CREAM} {...stroke} />
      <ellipse cx="37" cy="27" rx="4" ry="4.5" fill={CREAM} {...stroke} />
      <rect x="12" y="35" width="5" height="6" rx="2" fill={CREAM} {...stroke} />
      <rect x="25" y="35" width="5" height="6" rx="2" fill={CREAM} {...stroke} />
      <path d="M18 18h8" {...stroke} />
      <circle cx="29" cy="24" r="1.6" fill={INK} />
    </>
  ),
  stack: (
    <>
      <rect x="11" y="30" width="26" height="8" rx="4" fill={SUN} {...stroke} />
      <rect x="9" y="22" width="26" height="8" rx="4" fill={SUN} {...stroke} />
      <rect x="13" y="14" width="26" height="8" rx="4" fill={SUN} {...stroke} />
      <Rupee x={26} y={18.4} size={7} />
    </>
  ),
  sparkle: (
    <g stroke={INK} strokeWidth={3.6} strokeLinecap="round">
      <path d="M9 33l8 4" />
      <path d="M17 11l6 15" />
      <path d="M38 7l-5 17" />
    </g>
  ),
  bulb: (
    <>
      <g stroke={SUN} strokeWidth={2.6} strokeLinecap="round">
        <path d="M5 16l4 2M43 16l-4 2M24 1v4M10 5l3 3M38 5l-3 3" />
      </g>
      <path d="M24 9a12 12 0 0 0-7 21.8V34h14v-3.2A12 12 0 0 0 24 9z" fill={SUN} {...stroke} />
      <path d="M20 26c2-3 6-3 8 0" fill="none" {...stroke} strokeWidth={2} />
      <rect x="17" y="34" width="14" height="5" rx="1.5" fill={SLATE} {...stroke} strokeWidth={2.2} />
      <rect x="19.5" y="39" width="9" height="4.5" rx="1.5" fill={SLATE} {...stroke} strokeWidth={2.2} />
    </>
  ),
  puzzle: (
    <path
      d="M10 14h8a4 4 0 1 1 8 0h8v8a4 4 0 1 1 0 8v8h-8a4 4 0 1 0-8 0h-8v-8a4 4 0 1 0 0-8z"
      fill={SUN}
      {...stroke}
    />
  ),
  question: (
    <>
      <path d="M16 16a8 8 0 1 1 11 7.4c-2 .9-3 2.4-3 4.6v2" fill="none" stroke={INK} strokeWidth={10} strokeLinecap="round" />
      <path d="M16 16a8 8 0 1 1 11 7.4c-2 .9-3 2.4-3 4.6v2" fill="none" stroke={LILAC} strokeWidth={5} strokeLinecap="round" />
      <circle cx="24" cy="39.5" r="4.6" fill={LILAC} {...stroke} />
    </>
  ),
  gear: (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x="20.5" y="3.5" width="7" height="10" rx="2" fill={SLATE} {...stroke} transform={`rotate(${i * 45} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="14" fill={SLATE} {...stroke} />
      <circle cx="24" cy="24" r="5.5" fill={CREAM} {...stroke} />
    </>
  ),
  star: (
    <path d="M24 5l5.6 11.6 12.8 1.8-9.3 9 2.2 12.7L24 34.1l-11.4 6 2.2-12.7-9.3-9 12.8-1.8z" fill={SUN} {...stroke} />
  ),
  cloud: <path d="M14 36a8.5 8.5 0 0 1-1-16.9A11.5 11.5 0 0 1 35 17.5a9.2 9.2 0 0 1 0 18.5z" fill={CREAM} {...stroke} />,
  trophy: (
    <>
      <path d="M15 12H8a6 6 0 0 0 9 8M33 12h7a6 6 0 0 1-9 8" fill="none" {...stroke} />
      <path d="M14 7h20v10a10 10 0 0 1-20 0z" fill={SUN} {...stroke} />
      <rect x="21" y="27" width="6" height="6" fill={SUN} {...stroke} />
      <rect x="15" y="33" width="18" height="7" rx="2" fill={OCHRE} {...stroke} />
      <path d="M24 11l1.5 3 3.3.5-2.4 2.3.6 3.2-3-1.6-3 1.6.6-3.2-2.4-2.3 3.3-.5z" fill={CREAM} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
    </>
  ),
  briefcase: (
    <>
      <path d="M18 16v-4a2.5 2.5 0 0 1 2.5-2.5h7A2.5 2.5 0 0 1 30 12v4" fill="none" {...stroke} />
      <rect x="7" y="16" width="34" height="23" rx="4" fill={OCHRE} {...stroke} />
      <path d="M7 26h34" {...stroke} />
      <rect x="21" y="23" width="6" height="6" rx="1.5" fill={SUN} {...stroke} strokeWidth={2} />
    </>
  ),
  chart: (
    <>
      <rect x="6" y="6" width="36" height="36" rx="6" fill={CREAM} {...stroke} />
      <rect x="12" y="27" width="6" height="9" rx="1.5" fill={OCHRE} {...stroke} strokeWidth={2} />
      <rect x="21" y="21" width="6" height="15" rx="1.5" fill={CRIMSON} {...stroke} strokeWidth={2} />
      <rect x="30" y="14" width="6" height="22" rx="1.5" fill={SUN} {...stroke} strokeWidth={2} />
      <path d="M12 19l8-6 5 4 9-7m0 0h-5m5 0v5" fill="none" stroke={TOMATO} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export function Particle({ icon, className = "" }: { icon: PortalIcon; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className} overflow="visible">
      {ICONS[icon]}
    </svg>
  );
}
