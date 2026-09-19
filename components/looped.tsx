"use client";

import type { ReactNode } from "react";

/**
 * Literal colour values mirroring the Tailwind `@theme` tokens in
 * `app/globals.css`. SVG presentation attributes and canvas drawing cannot
 * resolve `var(--color-*)`, so diagram code needs the raw values.
 */
export const PALETTE = {
  ground: "#EFECE6",
  surface: "#FAF9F5",
  panel: "#E3DFD7",
  ink: "#1A1816",
  muted: "#75716B",
  accent: "#DE5D35",
  line: "rgba(26, 24, 22, 0.12)",
  danger: "#EF4444",
} as const;

interface LoopedStylesProps {
  /** Keyframe and rule definitions. Namespace keyframes per diagram. */
  css: string;
  /**
   * Class names to halt under reduced motion. These must be the same literal
   * class names used in `css` — the guard is emitted verbatim.
   */
  reduceMotionTargets: string[];
}

/**
 * Emits an animation stylesheet plus the `prefers-reduced-motion` opt-out.
 * Every looped diagram routes through here so the accessibility behaviour
 * stays uniform across the archive.
 */
export function LoopedStyles({ css, reduceMotionTargets }: LoopedStylesProps) {
  return (
    <style>{`${css}
      @media (prefers-reduced-motion: reduce) {
        ${reduceMotionTargets.join(", ")} { animation: none !important; }
      }`}</style>
  );
}

interface LoopedProps {
  children: ReactNode;
  /** Accessible description of what the loop depicts. */
  label: string;
  className?: string;
}

/**
 * Wrapper for a self-running diagram. Marks the region as an image so screen
 * readers announce it as one graphic instead of reading the raw SVG geometry.
 */
export function Looped({ children, label, className }: LoopedProps) {
  return (
    <div role="img" aria-label={label} className={className}>
      {children}
    </div>
  );
}
