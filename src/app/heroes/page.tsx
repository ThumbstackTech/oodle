import type { Metadata } from "next";
import { Suspense } from "react";
import HeroLab from "./HeroLab";

export const metadata: Metadata = {
  title: "Hero iterations — Oodle Learn",
  robots: { index: false },
};

export default function HeroesPage() {
  return (
    <Suspense>
      <HeroLab />
    </Suspense>
  );
}
