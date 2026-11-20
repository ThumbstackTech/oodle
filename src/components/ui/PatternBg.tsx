import type { CSSProperties } from "react";

/**
 * Decorative brand-pattern background. A CSS background (not an <img>), so it never triggers
 * "lazy-loaded images should have explicit dimensions" and can't cause layout shift.
 * Positioned to fill its (relative) parent.
 */
export default function PatternBg({ src, className = "", style }: { src: string; className?: string; style?: CSSProperties }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url("${encodeURI(src)}")`, ...style }}
    />
  );
}
