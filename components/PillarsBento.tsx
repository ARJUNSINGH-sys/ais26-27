"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { featurePillars } from "@/lib/data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Shape 46 from shapes.gallery (256x256): scalloped square with four corner
 * circles. Rendered as a square SVG (never stretched) — pillar titles curve
 * along the four scallop curves via textPath, numerals sit in the circles.
 */
const SHAPE_46 =
  "M 192 0 C 227.346 0 256 28.654 256 64 C 256 99.346 227.346 128 192 128 C 227.346 128 256 156.654 256 192 C 256 227.346 227.346 256 192 256 C 156.654 256 128 227.346 128 192 C 128 227.346 99.346 256 64 256 C 28.654 256 0 227.346 0 192 C 0 156.654 28.654 128 64 128 C 28.654 128 0 99.346 0 64 C 0 28.654 28.654 0 64 0 C 99.346 0 128 28.654 128 64 C 128 28.654 156.654 0 192 0 Z M 64 160 C 46.327 160 32 174.327 32 192 C 32 209.673 46.327 224 64 224 C 81.673 224 96 209.673 96 192 C 96 174.327 81.673 160 64 160 Z M 192 160 C 174.327 160 160 174.327 160 192 C 160 209.673 174.327 224 192 224 C 209.673 224 224 209.673 224 192 C 224 174.327 209.673 160 192 160 Z M 64 32 C 46.327 32 32 46.327 32 64 C 32 81.673 46.327 96 64 96 C 81.673 96 96 81.673 96 64 C 96 46.327 81.673 32 64 32 Z M 192 32 C 174.327 32 160 46.327 160 64 C 160 81.673 174.327 96 192 96 C 209.673 96 224 81.673 224 64 C 224 46.327 209.673 32 192 32 Z";

/* Guide arcs: one per scallop curve, each oriented so its text reads
   upright at the middle of the curve. */
const TITLE_ARCS = [
  "M 64 0 A 64 64 0 0 0 192 0",
  "M 256 64 A 64 64 0 0 0 256 192",
  "M 64 256 A 64 64 0 0 1 192 256",
  "M 0 192 A 64 64 0 0 0 0 64",
];

/* Corner circles for the numerals: TL, TR, BR, BL (clockwise). */
const NUMERAL_SPOTS = [
  { x: 64, y: 64 },
  { x: 192, y: 64 },
  { x: 192, y: 192 },
  { x: 64, y: 192 },
];

export default function PillarsBento() {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean;
            standard: boolean;
          };

          if (reduceMotion) {
            gsap.set([".pillar-statement", ".pillar-tile"], {
              opacity: 1,
              y: 0,
              scale: 1,
            });
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
            defaults: { ease: "power3.out" },
          });

          tl.fromTo(
            ".pillar-statement",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
          ).fromTo(
            ".pillar-tile",
            { scale: 0.94, opacity: 0, y: 25 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.08,
            },
            "-=0.6",
          );
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="pillars"
      className="py-6 md:py-10 overflow-hidden"
    >
      <div className="shell">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Statement panel */}
          <div className="pillar-statement flex min-h-[400px] flex-col justify-between rounded-[32px] bg-panel p-9 sm:p-12 lg:col-span-5 lg:min-h-[520px]">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                Pillars
              </span>
              <h2 className="mt-6 font-display text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink">
                Why
                <br />
                AI Society
              </h2>
            </div>

            <div className="flex items-end justify-between gap-8">
              <p className="max-w-[26ch] text-[13px] leading-[1.55] text-ink-soft">
                Four commitments that turn curious students into engineers who
                ship.
              </p>
              <span
                aria-hidden
                className="font-display text-[26px] leading-none text-ink"
              >
                →
              </span>
            </div>
          </div>

          {/* Ink card cut as Shape 46 — titles curved along the four
              scallop curves, numerals inside the corner circles */}
          <div className="flex items-center justify-center lg:col-span-7">
            <svg
              viewBox="0 0 256 256"
              className="pillar-tile block aspect-square h-auto w-full max-w-[560px] will-change-transform"
              role="img"
              aria-label="The four AIS pillars: Research Excellence, Engineering Hub, Skill Incubation, Industry Trajectory"
            >
              <defs>
                {TITLE_ARCS.map((d, i) => (
                  <path key={i} id={`pillar-arc-${i}`} d={d} />
                ))}
              </defs>

              <path d={SHAPE_46} fill="#1A1816" />

              {/* Titles curved along the scallop curves */}
              {featurePillars.map((pillar, i) => (
                <text
                  key={pillar.numeral}
                  className="font-display font-bold"
                  fontSize="11"
                  letterSpacing="1.5"
                  fill="#1A1816"
                >
                  <textPath
                    href={`#pillar-arc-${i}`}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {pillar.title}
                  </textPath>
                </text>
              ))}

              {/* Numerals in the corner circles */}
              {featurePillars.map((pillar, i) => {
                const spot = NUMERAL_SPOTS[i];
                return (
                  <text
                    key={pillar.numeral}
                    x={spot.x}
                    y={spot.y}
                    className="font-display font-bold"
                    fontSize="15"
                    fill="#DE5D35"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {pillar.numeral}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
