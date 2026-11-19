import type { CSSProperties, ReactNode } from "react";

/** Ink speech bubble with a tail pointing down at its speaker. */
export default function SpeechBubble({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={style}
      className={`pointer-events-none relative inline-block whitespace-nowrap rounded-2xl border-[2.5px] border-ink bg-cream px-3.5 py-2 text-[14px] font-semibold leading-tight text-ink shadow-[0_4px_0_0_var(--color-ink)] ${className}`}
    >
      {children}
      <svg viewBox="0 0 20 12" aria-hidden className="absolute left-1/2 top-full -mt-[2px] h-3 w-5 -translate-x-1/2">
        <path d="M1 0 L10 11 L19 0" fill="var(--color-cream)" stroke="var(--color-ink)" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="2" y="-2" width="16" height="3" fill="var(--color-cream)" />
      </svg>
    </span>
  );
}
