import Image from "next/image";

/**
 * 3 Flagship Events arranged side-by-side in a single row:
 * - Left: AI 101
 * - Center: AI Hunt 2.0
 * - Right: Club Carnival
 *
 * Each panel has asymmetric width and sculpted organic corner curves/cutouts,
 * matching reference image 3.
 */
/**
 * Hero Photographic Canvas Architecture:
 * Rebuilt using pure individual rectangles with rounded corners (no artificial cuts).
 *
 * - Column 1 (AI 101):
 *   3 individual rectangles stacked vertically, each with rounded corners (rx=36).
 *   The adjacent rounded corners naturally sculpt the negative-space ticket notches!
 * - Column 2 (AI Hunt 2.0):
 *   2 individual rectangles (narrow top + wide bottom), each with rounded corners (rx=36).
 * - Column 3 (Club Carnival):
 *   2 individual interlocking rectangles (wide top + narrow bottom), each with rounded corners (rx=44).
 *
 * Uniform 12px negative-space channel throughout the entire composition.
 */

export default function Hero() {
  return (
    <section id="hero" className="pt-[124px] pb-16 md:pt-[180px] md:pb-24">
      <div className="shell">
        {/* Top Editorial Row */}
        <div className="mb-12 flex flex-col gap-10 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="type-container lg:w-[68%]">
            <h1 className="type-display text-ink">
              One Society.
              <br />
              Hundreds of Vital Epochs.
            </h1>
          </div>

          <div className="flex flex-col items-start gap-7 lg:w-[28%] lg:items-end">
            <p className="max-w-[40ch] text-[14px] leading-[1.55] text-ink-soft lg:text-right">
              Bennett University&apos;s artificial intelligence society —
              engineering autonomous systems, neural architectures, and
              real-world intelligence.
            </p>

            <a href="#works" className="pill">
              <span>See our work</span>
              <span className="pill__medal" aria-hidden />
            </a>
          </div>
        </div>

        {/* 
          Hero Photographic Canvas:
          Exact 3-Panel Interlocking Silhouette from Reference Design
          Panel 1 (AI 101) | Panel 2 (AI Hunt 2.0) | Panel 3 (Club Carnival)
          Genuine transparent negative space channels with scalloped cutouts
        */}
        <div className="group relative w-full overflow-hidden select-none">
          <svg
            viewBox="0 0 1200 500"
            className="w-full h-auto block"
            style={{ filter: "drop-shadow(0 20px 45px rgba(0,0,0,0.06))" }}
            aria-label="AIS Flagship Events: AI 101, AI Hunt 2.0, Club Carnival"
          >
            <defs>
              {/* Zone 1: AI 101 (3 Stacked Rectangles on Left with 4px gap) */}
              <clipPath id="panel-ai-101-clip">
                <rect x="8" y="8" width="350" height="158" rx="38" />
                <rect x="8" y="170" width="350" height="168" rx="38" />
                <rect x="8" y="342" width="350" height="150" rx="38" />
              </clipPath>

              {/* Zone 2: AI Hunt 2.0 (2 Stepped Rectangles in Center with 4px gap) */}
              <clipPath id="panel-ai-hunt-clip">
                <rect x="362" y="8" width="146" height="228" rx="38" />
                <rect x="362" y="240" width="324" height="252" rx="38" />
              </clipPath>

              {/* Zone 3: Club Battle (Top Right Panoramic Banner with 4px gap) */}
              <clipPath id="panel-clubbattle-clip">
                <rect x="512" y="8" width="680" height="228" rx="44" />
              </clipPath>

              {/* Zone 4: Club Carnival (Bottom Right Wide Shelf with 4px gap) */}
              <clipPath id="panel-carnival-clip">
                <rect x="690" y="240" width="502" height="252" rx="44" />
              </clipPath>

              {/* Subtle cinematic gradient overlay for depth */}
              <linearGradient id="panel-scrim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="60%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            {/* Zone 1: AI 101 & AI Hunt Cohort (hero1.jpg - Left 3 Stacked Apertures) */}
            <g clipPath="url(#panel-ai-101-clip)">
              <image
                href="/images/hero1.jpg"
                x="8"
                y="8"
                width="350"
                height="484"
                preserveAspectRatio="xMidYMid slice"
              />
              <rect
                x="8"
                y="8"
                width="350"
                height="484"
                fill="url(#panel-scrim)"
                pointerEvents="none"
              />
            </g>

            {/* Zone 2: Tekken 8 Esports & Hackathon (hero2.jpg - Center Stepped Shelf) */}
            <g clipPath="url(#panel-ai-hunt-clip)">
              <image
                href="/images/hero2.jpg"
                x="362"
                y="8"
                width="324"
                height="484"
                preserveAspectRatio="xMidYMid slice"
              />
              <rect
                x="362"
                y="8"
                width="324"
                height="484"
                fill="url(#panel-scrim)"
                pointerEvents="none"
              />
            </g>

            {/* Zone 3: Club Battle Campus Showcase (clubbattle.jpg - Top Right Panoramic Banner) */}
            <g clipPath="url(#panel-clubbattle-clip)">
              <image
                href="/images/clubbattle.jpg"
                x="512"
                y="8"
                width="680"
                height="228"
                preserveAspectRatio="xMidYMid slice"
              />
              <rect
                x="512"
                y="8"
                width="680"
                height="228"
                fill="url(#panel-scrim)"
                pointerEvents="none"
              />
            </g>

            {/* Zone 4: Faculty & Student Assembly (hero3.jpg - Bottom Right Wide Shelf) */}
            <g clipPath="url(#panel-carnival-clip)">
              <image
                href="/images/hero3.jpg"
                x="690"
                y="240"
                width="502"
                height="252"
                preserveAspectRatio="xMidYMid slice"
              />
              <rect
                x="690"
                y="240"
                width="502"
                height="252"
                fill="url(#panel-scrim)"
                pointerEvents="none"
              />
            </g>
          </svg>

          {/* Minimalist Editorial Metadata Bar below the canvas */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 px-2 font-mono text-[11px] uppercase tracking-widest text-ink-soft/70">
            <div className="flex flex-wrap items-center gap-6">
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/40" />
                01 · AI Society Cohort
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/40" />
                02 · Tech Arena & Esports
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/40" />
                03 · Club Battle Showcase
              </span>
              <span className="hidden sm:flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/40" />
                04 · Academic Assembly
              </span>
            </div>
            <span className="text-[10px] text-ink-soft/50">
              Interlocking Curved Silhouette
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
