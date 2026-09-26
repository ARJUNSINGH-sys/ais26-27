"use client";

import Image from "next/image";
import { assetPath } from "@/lib/basePath";

export default function ManifestoBanner() {
  return (
    <section
      className="relative w-full overflow-hidden bg-[#0E0D0C]"
      aria-label="AI Society manifesto"
    >
      <div className="relative mx-auto flex min-h-[320px] max-w-[1400px] flex-col items-start justify-center gap-0 px-[clamp(20px,5vw,60px)] py-16 md:min-h-[400px] md:flex-row md:items-center md:py-0">

        {/* Quote text — left side */}
        <div className="relative z-10 flex-1">
          <p
            className="font-display font-extrabold leading-[1.05] tracking-[-0.035em] text-white"
            style={{ fontSize: "clamp(28px, 5vw, 64px)" }}
          >
            THE GREATEST FRONTIER
            <br />
            FOR MACHINE INTELLIGENCE
            <br />
            IS FIRST PRINCIPLES.
          </p>
          <div className="mt-6 h-px w-16 bg-[#DE5D35]" />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
            AI Society · Bennett University
          </p>
        </div>

        {/* Butterfly SVG — right side, partially bleeds off edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative flex-shrink-0 md:absolute md:right-0 md:top-0 md:h-full md:w-[45%]"
        >
          <Image
            src={assetPath("/butterfly.svg")}
            alt=""
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-contain object-right brightness-0 invert opacity-[0.08] md:object-cover md:object-right"
            unoptimized
            priority
          />
        </div>

      </div>
    </section>
  );
}
