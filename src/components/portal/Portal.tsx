"use client";

import {
  AnimatePresence,
  motion,
  useAnimate,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import type { PortalIcon, PortalTheme } from "@/content/site";
import Oodle from "../ui/Oodle";
import { Particle } from "./particles";

const INK = "#1e222d";
const SUN = "#f2d439";
const CREAM = "#e4e1cf";

// Geometry — viewBox 0 0 360 440. A chunky arch: thick ring of five big stones on two block pillars.
const W = 360;
const H = 440;
const CX = 180;
const CY = 196; // spring line
const R = 174; // outer radius
const r = 104; // opening radius
const VX = 180;
const VY = 300; // doorway glow / swirl centre

const r2 = (v: number) => Math.round(v * 100) / 100;
const pt = (rad: number, a: number) => `${r2(CX + rad * Math.cos(a))} ${r2(CY + rad * Math.sin(a))}`;
/** Ring segment between two angles and two radii (angles run -π → 0 across the top). */
const seg = (a0: number, a1: number, ri: number, ro: number) =>
  `M${pt(ro, a0)} A${ro} ${ro} 0 0 1 ${pt(ro, a1)} L${pt(ri, a1)} A${ri} ${ri} 0 0 0 ${pt(ri, a0)} Z`;

function spiral(offset: number, turns = 2.2, a = 6) {
  const max = turns * Math.PI * 2;
  const b = 230 / max;
  let d = "";
  for (let t = 0; t <= max; t += 0.14) {
    const rad = a + b * t;
    d += `${d ? "L" : "M"}${r2(VX + rad * Math.cos(t + offset))} ${r2(VY + rad * Math.sin(t + offset))}`;
  }
  return d;
}
const ARMS = [spiral(0), spiral(Math.PI)];

// Five stones across the top; the middle one is the keystone.
const STONES = Array.from({ length: 5 }, (_, k) => {
  const gap = 0.012;
  const a0 = -Math.PI + (Math.PI * k) / 5 + gap;
  const a1 = -Math.PI + (Math.PI * (k + 1)) / 5 - gap;
  return { a0, a1, key: k === 2 };
});

function Emblem({ kind }: { kind: PortalTheme["emblem"] }) {
  if (kind === "rupee")
    return (
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={34}
        fontWeight={800}
        fill={SUN}
        stroke={INK}
        strokeWidth={2.2}
        paintOrder="stroke"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        ₹
      </text>
    );
  if (kind === "bulb")
    return (
      <g transform="translate(-15 -19) scale(0.64)">
        <path d="M24 4a14 14 0 0 0-8 25.5V34h16v-4.5A14 14 0 0 0 24 4z" fill={SUN} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <rect x="17" y="35" width="14" height="8" rx="2" fill={CREAM} stroke={INK} strokeWidth={4} />
      </g>
    );
  return <path d="M-16 9V-8l8 7 8-12 8 12 8-7V9z" fill={SUN} stroke={INK} strokeWidth={3} strokeLinejoin="round" />;
}

const rand = (i: number, seed: number) => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Burst = { id: number; icon: PortalIcon; dx: number; dy: number; rot: number };

// Where the floating contents sit inside the doorway (% of the portal box).
const INSIDE_POS = [
  { left: "36%", top: "37%", w: "19%", rot: -14, delay: 0 },
  { left: "65%", top: "47%", w: "16%", rot: 12, delay: 1.1 },
  { left: "33%", top: "59%", w: "16%", rot: -6, delay: 2.2 },
];

export default function Portal({
  theme,
  index,
  travel,
  outward,
}: {
  theme: PortalTheme;
  index: number;
  travel: number;
  outward: -1 | 0 | 1;
}) {
  const reduce = useReducedMotion();
  const uid = `p-${theme.id}`;
  const flip = outward === 1 ? -1 : 1; // mirror the smoke for the right-hand portal

  // Doorway swirl: steady turn, spring-boosted on hover.
  const spin = useMotionValue(0);
  const speed = useSpring(1, { stiffness: 60, damping: 14 });
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    spin.set((spin.get() + (Math.min(delta, 50) * speed.get() * 360) / 30000) % 360);
  });

  const [residentScope, animateResident] = useAnimate();
  const [perchScope, animatePerch] = useAnimate();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);
  const selfRef = useRef<HTMLAnchorElement>(null);

  const celebrate = () => {
    if (reduce) return;
    speed.set(4);
    window.setTimeout(() => speed.set(1), 900);
    animateResident(residentScope.current, { y: [0, -18, 0] }, { duration: 0.55, ease: [0.23, 1, 0.32, 1] });
    if (perchScope.current) animatePerch(perchScope.current, { y: [0, -16, 0] }, { duration: 0.6, ease: [0.23, 1, 0.32, 1] });
    const unit = (selfRef.current?.offsetWidth ?? W) / W;
    const next: Burst[] = Array.from({ length: 6 }, (_, k) => {
      const id = ++burstId.current;
      const a = -Math.PI / 2 + (k - 2.5) * 0.42 + (Math.random() - 0.5) * 0.3;
      const dist = (130 + Math.random() * 90) * unit;
      const pool = [...theme.inside, ...theme.icons];
      return { id, icon: pool[(id + k) % pool.length], dx: Math.cos(a) * dist, dy: Math.sin(a) * dist, rot: (Math.random() - 0.5) * 180 };
    });
    setBursts((b) => [...b, ...next]);
  };

  const stream = useMemo(
    () =>
      theme.icons.map((icon, i) => {
        const n = theme.icons.length;
        const dur = 8 + index * 0.4;
        const drift = (rand(i, index + 7) - 0.5) * 80 + outward * (40 + rand(i, index + 3) * 60);
        return {
          icon,
          style: {
            "--dur": `${dur}s`,
            "--delay": `${1.6 + index * 0.5 + (i * dur) / n}s`,
            "--dx": `${(drift / 3.6).toFixed(1)}cqw`,
            "--dist": `${((travel * (0.8 + rand(i, index + 5) * 0.2)) / 3.6).toFixed(1)}cqw`,
            "--rot": `${((rand(i, index + 9) - 0.5) * 200).toFixed(0)}deg`,
            "--rest-x": `${((i - 1) * 40 * (outward || 1)).toFixed(0)}px`,
            "--rest-y": `${(-50 - i * 24).toFixed(0)}px`,
            width: `max(16px, ${((30 + rand(i, index + 11) * 12) / 3.6).toFixed(1)}cqw)`,
          } as CSSProperties,
        };
      }),
    [theme.icons, travel, outward, index],
  );

  return (
    <motion.a
      ref={selfRef}
      href="#games"
      aria-label={`Enter the ${theme.game} world`}
      className="group relative block w-full outline-none [container-type:inline-size] focus-visible:[&_.frame]:drop-shadow-[0_0_0_4px_var(--color-ink)]"
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "0%", opacity: 1 }}
      transition={{
        type: "spring",
        duration: 1.1,
        bounce: 0.18,
        delay: 0.15 + index * 0.12,
        opacity: { duration: 0.3, delay: 0.15 + index * 0.12 },
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && celebrate()}
      onPointerDown={(e) => e.pointerType !== "mouse" && celebrate()}
    >
      {/* Smoke ribbons — behind the stones */}
      <svg
        viewBox={`${-W * 0.6} ${-H * 0.1} ${W * 2.2} ${H * 1.25}`}
        className="pointer-events-none absolute left-[-60%] top-[-10%] z-0 h-[125%] w-[220%] overflow-visible"
        aria-hidden
      >
        <g transform={flip === -1 ? `translate(${W} 0) scale(-1 1)` : undefined} fill="none" strokeLinecap="round">
          <path className="mist-flow" d="M180 270 C 110 250, 30 150, -70 170 C -160 188, -192 272, -132 322" stroke={theme.mist[0]} strokeWidth={60} opacity={0.5} />
          <path className="mist-flow mist-slow" d="M180 252 C 110 226, 22 128, -66 150 C -128 168, -150 226, -122 262" stroke={theme.mist[1]} strokeWidth={13} opacity={0.9} />
          <path className="mist-flow" d="M190 240 C 262 150, 384 130, 446 190 C 494 240, 482 300, 432 332" stroke={theme.mist[0]} strokeWidth={40} opacity={0.45} />
          <path className="mist-flow mist-slow" d="M196 228 C 270 160, 360 156, 410 200" stroke={theme.mist[1]} strokeWidth={10} opacity={0.8} />
        </g>
      </svg>
      {/* …and one wrapping in front */}
      <svg
        viewBox={`${-W * 0.6} ${-H * 0.1} ${W * 2.2} ${H * 1.25}`}
        className="pointer-events-none absolute left-[-60%] top-[-10%] z-[25] h-[125%] w-[220%] overflow-visible"
        aria-hidden
      >
        <g transform={flip === -1 ? `translate(${W} 0) scale(-1 1)` : undefined} fill="none" strokeLinecap="round">
          <path className="mist-flow" d="M296 318 C 350 344, 410 340, 462 300 C 500 270, 516 236, 498 200" stroke={theme.mist[0]} strokeWidth={30} opacity={0.6} />
          <path className="mist-flow mist-slow" d="M66 332 C 30 350, -20 344, -66 300" stroke={theme.mist[1]} strokeWidth={11} opacity={0.85} />
        </g>
      </svg>

      {/* Stream drifting out of the top */}
      <div className="pointer-events-none absolute left-1/2 top-[14%] z-30 h-0 w-0">
        {stream.map((it, i) => (
          <span key={i} className="portal-float absolute left-0 top-0" style={it.style}>
            <Particle icon={it.icon} className="block h-auto w-full -translate-x-1/2 -translate-y-1/2" />
          </span>
        ))}
        <AnimatePresence>
          {bursts.map((b) => (
            <motion.span
              key={b.id}
              className="absolute left-0 top-0 w-[max(18px,12cqw)]"
              initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
              animate={{ x: b.dx, y: b.dy, scale: 1, opacity: 0, rotate: b.rot }}
              transition={{ duration: 0.95, ease: [0.23, 1, 0.32, 1], opacity: { duration: 0.95, ease: [0.7, 0, 0.84, 0] } }}
              onAnimationComplete={() => setBursts((all) => all.filter((x) => x.id !== b.id))}
            >
              <Particle icon={b.icon} className="block h-auto w-full -translate-x-1/2 -translate-y-1/2" />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="frame relative z-10 block h-auto w-full overflow-visible" aria-hidden>
        <defs>
          <clipPath id={`${uid}-clip`}>
            <path d={`M${CX - r} ${H} V${CY} A${r} ${r} 0 0 1 ${CX + r} ${CY} V${H} Z`} />
          </clipPath>
          <radialGradient id={`${uid}-glow`} cx={VX} cy={VY + 20} r={210} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={theme.glow[0]} />
            <stop offset="0.45" stopColor={theme.glow[1]} />
            <stop offset="1" stopColor={theme.glow[2]} />
          </radialGradient>
        </defs>

        {/* Doorway */}
        <g clipPath={`url(#${uid}-clip)`}>
          <rect width={W} height={H} fill={`url(#${uid}-glow)`} />
          <motion.g style={{ rotate: spin, originX: `${VX}px`, originY: `${VY}px` }}>
            <path d={ARMS[0]} fill="none" stroke={CREAM} strokeOpacity={0.4} strokeWidth={30} strokeLinecap="round" />
            <path d={ARMS[1]} fill="none" stroke={theme.glow[0]} strokeOpacity={0.55} strokeWidth={14} strokeLinecap="round" />
            {[
              [120, 170, 3],
              [240, 160, 2.5],
              [140, 260, 2.2],
              [230, 250, 3],
              [110, 360, 2.6],
              [252, 350, 2.4],
              [180, 140, 2.2],
            ].map(([x, y, s], i) => (
              <path
                key={i}
                d={`M${x} ${y - s * 2.4}L${x + s} ${y - s}L${x + s * 2.4} ${y}L${x + s} ${y + s}L${x} ${y + s * 2.4}L${x - s} ${y + s}L${x - s * 2.4} ${y}L${x - s} ${y - s}Z`}
                fill={CREAM}
                opacity={0.85}
              />
            ))}
          </motion.g>
          <path
            d={`M${CX - r + 7} ${H} V${CY} A${r - 7} ${r - 7} 0 0 1 ${CX + r - 7} ${CY} V${H}`}
            fill="none"
            stroke={INK}
            strokeOpacity={0.22}
            strokeWidth={14}
          />
        </g>

        {/* Block pillars */}
        {[0, 1].map((side) => {
          const x = side ? CX + r : CX - R;
          const w = R - r;
          return (
            <g key={side}>
              {[
                [CY + 18, 108],
                [CY + 126, 130],
              ].map(([y, h], i) => (
                <g key={i}>
                  <rect x={x} y={y} width={w} height={h} rx="8" fill={theme.stone} stroke={INK} strokeWidth="3" />
                  <rect x={x + 7} y={y + 7} width={w - 14} height="9" rx="4.5" fill={CREAM} opacity="0.2" />
                  <rect x={x + (side ? 7 : w - 17)} y={y + 20} width="10" height={h - 30} rx="5" fill={INK} opacity="0.13" />
                </g>
              ))}
              {/* impost block at the spring line */}
              <rect x={x - 8} y={CY - 6} width={w + 16} height="28" rx="8" fill={theme.stone} stroke={INK} strokeWidth="3" />
              <rect x={x} y={CY - 1} width={w} height="7" rx="3.5" fill={CREAM} opacity="0.22" />
            </g>
          );
        })}

        {/* The stone ring */}
        {STONES.map((s, i) => {
          const ro = s.key ? R + 12 : R;
          const a0 = s.key ? s.a0 - 0.03 : s.a0;
          const a1 = s.key ? s.a1 + 0.03 : s.a1;
          return (
            <g key={i}>
              <path d={seg(a0, a1, r, ro)} fill={theme.stone} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
              <path d={seg(a0 + 0.03, a1 - 0.03, ro - 22, ro - 8)} fill={CREAM} opacity="0.2" />
              <path d={seg(a0 + 0.02, a1 - 0.02, r + 2, r + 12)} fill={INK} opacity="0.14" />
            </g>
          );
        })}
        <g transform={`translate(${CX} ${CY - (r + R + 12) / 2})`}>
          <Emblem kind={theme.emblem} />
        </g>
      </svg>

      {/* Floating contents of the world */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {theme.inside.map((icon, i) => {
          const p = INSIDE_POS[i];
          return (
            <motion.div
              key={icon}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: p.left, top: p.top, width: p.w }}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 1 + index * 0.12 + i * 0.08 }}
            >
              <div className="portal-bob" style={{ "--bob-delay": `${p.delay + index * 0.7}s`, rotate: `${p.rot}deg` } as CSSProperties}>
                <Particle icon={icon} className="block h-auto w-full drop-shadow-[0_4px_0_rgb(30_34_45/0.18)]" />
              </div>
            </motion.div>
          );
        })}
        <div className="absolute bottom-[15%] left-[60%] w-[33%] -translate-x-1/2">
          <motion.div ref={residentScope} className="origin-bottom">
            <Oodle world={theme.id} shape={theme.resident} priority className="h-auto w-full drop-shadow-[0_6px_0_rgb(30_34_45/0.2)]" sizes="140px" />
          </motion.div>
        </div>
      </div>

      {/* An Oodle outside the portal */}
      {theme.perch && (
        <motion.div
          className={`pointer-events-none absolute z-30 ${
            theme.perch.pose === "leap" ? "left-[-14%] top-[-34%] w-[52%]" : "left-1/2 top-[-27%] w-[40%] -translate-x-1/2"
          }`}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", duration: 0.8, bounce: 0.35, delay: 0.9 + index * 0.12 }}
        >
          <motion.div ref={perchScope} className="origin-bottom" style={{ rotate: theme.perch.pose === "leap" ? -14 : 0 }}>
            <Oodle world={theme.id} shape={theme.perch.shape} priority className="h-auto w-full drop-shadow-[0_8px_0_rgb(30_34_45/0.18)]" sizes="200px" />
          </motion.div>
        </motion.div>
      )}
    </motion.a>
  );
}
