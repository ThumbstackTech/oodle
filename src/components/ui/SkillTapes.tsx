"use client";

import { Fragment } from "react";
import { skills, type Shape, type World } from "@/content/site";
import Marquee from "./Marquee";
import Oodle from "./Oodle";

const MINI: [World, Shape][] = [
  ["money", "coin"],
  ["biz", "star"],
  ["solve", "tri"],
  ["money", "cloud"],
  ["biz", "cloud"],
  ["solve", "clover"],
];

function Words({ tone }: { tone: "ink" | "cream" }) {
  return (
    <>
      {skills.marquee.map((w, i) => (
        <Fragment key={w}>
          <span
            className={`whitespace-nowrap px-5 font-display text-[clamp(1.4rem,min(3.4vw,5svh),2.9rem)] leading-none sm:px-7 ${
              tone === "ink" ? "text-ink" : "text-cream"
            }`}
          >
            {w}
          </span>
          <Oodle world={MINI[i % MINI.length][0]} shape={MINI[i % MINI.length][1]} className="h-[clamp(36px,6svh,56px)] w-auto shrink-0" sizes="56px" />
        </Fragment>
      ))}
    </>
  );
}

/**
 * The two crossing skill tapes. Each band sits in an *unrotated* wrapper tagged `data-floor` with its
 * tilt in `data-angle`, so a ToyBox above can turn it into a matching tilted physics surface — toys
 * then settle along the tape's real shape.
 */
export default function SkillTapes({ className = "" }: { className?: string }) {
  return (
    <div className={`h-[clamp(120px,21svh,190px)] ${className || "relative"}`} aria-hidden>
      <div data-floor data-angle="-3" className="absolute inset-x-[-5%] top-6 sm:top-8">
        <Marquee speed={2.4} className="rotate-[-3deg] border-y-[3px] border-ink bg-lilac py-3 sm:py-4">
          <Words tone="cream" />
        </Marquee>
      </div>
      <div data-floor data-angle="2.5" className="absolute inset-x-[-5%] top-10 hidden sm:top-12 sm:block">
        <Marquee speed={2.8} reverse className="rotate-[2.5deg] border-y-[3px] border-ink bg-sun py-3 sm:py-4">
          <Words tone="ink" />
        </Marquee>
      </div>
    </div>
  );
}
