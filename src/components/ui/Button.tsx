import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

type Tone = "sun" | "cream" | "ink";

const TONES: Record<Tone, string> = {
  sun: "bg-sun text-ink",
  cream: "bg-cream text-ink",
  ink: "bg-ink text-cream",
};

/**
 * Chunky pill with a soft edge + translucent press ledge (see .btn-soft) that presses flat on :active (120ms).
 */
export function Button({
  href,
  children,
  tone = "sun",
  size = "md",
  className = "",
  disabled = false,
  onClick,
}: {
  href: string;
  children: ReactNode;
  tone?: Tone;
  size?: "sm" | "md";
  className?: string;
  /** Renders inert (no link, not focusable) and visibly muted. */
  disabled?: boolean;
  /** Optional click handler (e.g. open a modal instead of navigating). */
  onClick?: (e: ReactMouseEvent<HTMLAnchorElement>) => void;
}) {
  const sizes = size === "sm" ? "h-10 pl-4 pr-1.5 text-[14px] gap-2.5" : "h-[52px] pl-6 pr-2 text-[15px] gap-3";
  return (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={onClick}
      className={`group inline-flex items-center justify-between whitespace-nowrap btn-soft rounded-full font-semibold [--btn-depth:5px] transition-[transform,box-shadow] duration-[120ms] ease-(--ease-out) active:translate-y-[5px] active:[--btn-depth:0px] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 [@media(hover:hover)_and_(pointer:fine)]:hover:[--btn-depth:7px] ${TONES[tone]} ${sizes} ${disabled ? "pointer-events-none opacity-55 saturate-50" : ""} ${className}`}
    >
      {children}
      <span
        className={`grid aspect-square h-[calc(100%-10px)] place-items-center rounded-full ${
          tone === "ink" ? "bg-sun text-ink" : "bg-ink text-cream"
        }`}
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className="h-4 w-4 transition-transform duration-200 ease-(--ease-out) [@media(hover:hover)_and_(pointer:fine)]:group-hover:-rotate-12"
        >
          <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 border-ink bg-cream px-3.5 py-1.5 text-[13px] font-semibold leading-none text-ink ${className}`}
    >
      {children}
    </span>
  );
}
