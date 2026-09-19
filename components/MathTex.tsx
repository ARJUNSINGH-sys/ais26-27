"use client";

import katex from "katex";
import { useMemo } from "react";

interface MathTexProps {
  math: string;
  block?: boolean;
}

/**
 * Renders a KaTeX expression. Falls back to the raw source string when the
 * input fails to parse, so a typo degrades to readable text rather than
 * throwing during render.
 */
export default function MathTex({ math, block = false }: MathTexProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className={block ? "block my-2" : "inline-block"}
    />
  );
}
