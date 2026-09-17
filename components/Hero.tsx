import Image from "next/image";

export default function Hero() {
  return (
    <section id="hero" className="pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="bw-container">
        {/* Top Editorial Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
          {/* Left Large Headline */}
          <div className="max-w-[16ch]">
            <h1 className="text-[36px] sm:text-[48px] lg:text-[64px] font-black tracking-[-0.035em] leading-[1.02] text-[#0A0A0A]">
              One Society.
              <br />
              Hundreds of Vital Epochs.
            </h1>
          </div>

          {/* Right Subtext & Pill CTA */}
          <div className="flex flex-col items-start lg:items-end gap-5 max-w-[34ch]">
            <p className="text-[14px] sm:text-[15px] leading-[1.5] text-[#666663] lg:text-right">
              Bennett University&apos;s AI specialization society. Rigorous deep
              learning research, neural engineering, and scalable production systems.
            </p>

            <a href="#events" className="btn-pill-dark group">
              <span>Explore Milestones</span>
              <span className="btn-arrow-circle">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </span>
            </a>
          </div>
        </div>

        {/* Spacious 3-Panel Rounded Triptych (Exact match to image copy 2.png hero) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Panel 1 */}
          <div className="relative h-[320px] sm:h-[400px] lg:h-[480px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/60">
            <Image
              src="/images/event-ai-101.png"
              alt="AI Society Keynote"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="bw-card-img object-cover object-left"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/80 block mb-1">
                PHASE 01 · FOUNDATIONS
              </span>
              <span className="text-[17px] font-bold tracking-tight text-white leading-snug block">
                Deep Neural Induction
              </span>
            </div>
          </div>

          {/* Panel 2 */}
          <div className="relative h-[320px] sm:h-[400px] lg:h-[480px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/60">
            <Image
              src="/images/event-tech-arena.png"
              alt="TechArena Hackathon"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="bw-card-img object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/80 block mb-1">
                PHASE 02 · COMPUTATION
              </span>
              <span className="text-[17px] font-bold tracking-tight text-white leading-snug block">
                Flagship Hackathons
              </span>
            </div>
          </div>

          {/* Panel 3 */}
          <div className="relative h-[320px] sm:h-[400px] lg:h-[480px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/60">
            <Image
              src="/images/event-project-showcase.png"
              alt="Project Showcase"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
              className="bw-card-img object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/80 block mb-1">
                PHASE 03 · DEPLOYMENT
              </span>
              <span className="text-[17px] font-bold tracking-tight text-white leading-snug block">
                Autonomous Systems
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
