"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Nav from "@/components/Nav";
import HeroPickACard from "@/components/heroes/HeroPickACard";
import HeroToyWorlds from "@/components/heroes/HeroToyWorlds";
import HeroWorldRemote from "@/components/heroes/HeroWorldRemote";
import HeroWorldsAccordion from "@/components/heroes/HeroWorldsAccordion";

const VARIANTS = [
  { name: "Three Worlds", C: HeroWorldsAccordion },
  { name: "Pick a Card", C: HeroPickACard },
  { name: "Toy Box Worlds", C: HeroToyWorlds },
  { name: "World Remote", C: HeroWorldRemote },
];

/** Review page: flip between the four hero iterations. `?v=1..4` deep-links one. */
export default function HeroLab() {
  const q = Number(useSearchParams().get("v"));
  const [v, setV] = useState(q >= 1 && q <= VARIANTS.length ? q - 1 : 0);

  const select = (i: number) => {
    setV(i);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(i + 1));
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0 });
  };

  const { C } = VARIANTS[v];

  return (
    <>
      <Nav onDark={v === 3} />
      <main>
        <C key={v} />
      </main>
      <div className="fixed bottom-4 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-1 rounded-full border-[2.5px] border-ink bg-cream p-1 shadow-[0_5px_0_0_var(--color-ink)]">
        {VARIANTS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => select(i)}
            aria-pressed={v === i}
            className={`rounded-full px-3 py-2 text-[12px] font-bold transition-colors duration-150 active:scale-[0.97] sm:px-4 sm:text-[13px] ${
              v === i ? "bg-ink text-cream" : "text-ink/70 hover:bg-ink/[0.07]"
            }`}
          >
            <span className="sm:hidden">{i + 1}</span>
            <span className="hidden sm:inline">
              {i + 1}. {x.name}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
