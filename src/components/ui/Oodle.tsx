import Image from "next/image";
import type { Shape, World } from "@/content/site";

// Intrinsic sizes (viewBox) of the characters extracted from the brand SVGs.
export const OODLE_SIZES: Record<World, Record<Shape, [number, number]>> = {
  money: { coin: [144, 145], clover: [122, 143], star: [141, 170], tri: [116, 137], cloud: [126, 143], blob: [151, 156] },
  biz: { coin: [140, 156], clover: [127, 140], star: [125, 153], tri: [125, 140], cloud: [147, 155], blob: [142, 154] },
  solve: { star: [137, 199], clover: [120, 151], tri: [130, 140], cloud: [127, 138], coin: [140, 126], blob: [140, 165] },
};

type Props = {
  world: World;
  shape: Shape;
  className?: string;
  priority?: boolean;
  alt?: string;
  sizes?: string;
};

/** A single Oodle character. Static by design — motion comes from the parent, in response to the user. */
export default function Oodle({ world, shape, className = "", priority, alt = "", sizes = "260px" }: Props) {
  const [w, h] = OODLE_SIZES[world][shape];
  return (
    <Image
      src={`/oodles/${world}/${shape}.svg`}
      width={w * 2}
      height={h * 2}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      priority={priority}
      sizes={sizes}
      draggable={false}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
