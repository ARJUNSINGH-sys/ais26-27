import type { CSSProperties } from "react";
import { featurePillars } from "@/lib/data";

/**
 * Each quadrant is cut with a single concave corner facing the centre, so the
 * four quarter-circles close into one circular void at the meeting point.
 * `corner` rounds only the outward-facing corners — the block reads as one
 * shape with a hole in it rather than four separate tiles.
 */
const QUADRANTS = [
  {
    cut: "scallop-br",
    corner: "rounded-tl-[32px]",
    anchor: "justify-start items-start text-left",
  },
  {
    cut: "scallop-bl",
    corner: "rounded-tr-[32px]",
    anchor: "justify-start items-end text-right",
  },
  {
    cut: "scallop-tr",
    corner: "rounded-bl-[32px]",
    anchor: "justify-end items-start text-left",
  },
  {
    cut: "scallop-tl",
    corner: "rounded-br-[32px]",
    anchor: "justify-end items-end text-right",
  },
];

export default function PillarsBento() {
  return (
    <section id="pillars" className="py-6 md:py-10">
      <div className="shell">
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Statement panel */}
          <div className="flex min-h-[400px] flex-col justify-between rounded-[32px] bg-panel p-9 sm:p-12 lg:col-span-5 lg:min-h-[520px]">
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

          {/* Terracotta quadrant with a circular void at its centre */}
          <div className="grid grid-cols-2 grid-rows-2 lg:col-span-7 lg:min-h-[520px]">
            {QUADRANTS.map((quadrant, index) => {
              const pillar = featurePillars[index];
              return (
                <div
                  key={quadrant.cut}
                  className={`flex flex-col gap-4 bg-accent p-7 text-white sm:p-9 ${quadrant.cut} ${quadrant.corner} ${quadrant.anchor}`}
                  style={{ "--scallop": "64px" } as CSSProperties}
                >
                  <span className="font-display text-[32px] font-bold leading-none text-white/25">
                    {pillar.numeral}
                  </span>
                  <h3 className="max-w-[10ch] font-display text-[19px] font-bold leading-[1.15] tracking-[-0.02em]">
                    {pillar.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
