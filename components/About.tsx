import Image from "next/image";
import { featurePillars } from "@/lib/data";
import { assetPath } from "@/lib/basePath";

export default function About() {
  return (
    <section id="about" className="swiss-section relative bg-[#F2F0EB]">
      {/* Watermark Section Number */}
      <span className="section-numeral select-none pr-8">02</span>

      <div className="swiss-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column — 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="eyebrow-label">
                <span className="eyebrow-dot" />
                <span>ABOUT AIS · SPECIALIZATION CLUB</span>
              </div>

              <h2 className="section-title text-[#111110] mb-6">
                Bridging Neural Theory with Real Systems.
              </h2>

              <p className="text-[16px] leading-[1.65] text-[#6B6860] mb-6">
                The Artificial Intelligence Society is Bennett University&apos;s
                premier technical specialization cohort. Founded to foster
                intellectual rigor and high-impact development, our society
                cultivates students who build, publish, and ship.
              </p>

              <p className="text-[16px] leading-[1.65] text-[#6B6860] mb-8">
                Through open-source architectures, national hackathons, and
                immersive research groups, members progress from machine
                learning novices to autonomous system engineers.
              </p>
            </div>

            {/* University Trust & Affiliation Card */}
            <div className="p-6 bg-[#E8E5DF] border border-[#D9D6CF] rounded-[2px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 shrink-0 bg-white p-2 rounded-[2px] border border-[#D9D6CF]">
                  <Image
                    src={assetPath("/images/bennett-logo.webp")}
                    alt="Bennett University Crest"
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#6B6860]">
                    Official Chapter
                  </div>
                  <div className="text-[14px] font-bold text-[#111110]">
                    Bennett University, Greater Noida
                  </div>
                </div>
              </div>
              <div className="text-right self-end sm:self-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111110] text-[#FAFAF8] text-[11px] font-mono font-medium rounded-[2px]">
                  <span>EST. 2021</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column — 7 cols (Feature Pillars 2x2 Grid) */}
          <div id="pillars" className="lg:col-span-7">
            <div className="mb-6 flex items-center justify-between border-b border-[#D9D6CF] pb-4">
              <span className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#111110]">
                Core Pillars & Methodologies
              </span>
              <span className="text-[12px] font-mono text-[#6B6860]">
                [ 04 FOCUS AREAS ]
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featurePillars.map((pillar) => (
                <div
                  key={pillar.numeral}
                  className="relative p-6 bg-[#E8E5DF] border border-[#D9D6CF] rounded-[2px] flex flex-col justify-between min-h-[220px] group hover:border-[#111110] transition-colors"
                >
                  {/* Dot Pattern Accent on Corner */}
                  <div className="absolute top-4 right-4 w-12 h-12 dot-pattern-bg opacity-40 group-hover:opacity-80 transition-opacity" />

                  {/* Header info */}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold text-[#C8773A] px-2 py-0.5 bg-white/70 rounded-[2px]">
                      {pillar.tag}
                    </span>
                    <span className="font-mono text-[13px] font-bold text-[#6B6860]">
                      {pillar.numeral}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="relative z-10 my-auto">
                    <h3 className="text-[18px] font-bold tracking-[-0.01em] text-[#111110] mb-2 group-hover:text-[#C8773A] transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-[13px] leading-[1.6] text-[#6B6860]">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Footer link accent */}
                  <div className="relative z-10 pt-4 border-t border-[#D9D6CF]/70 flex items-center justify-between text-[11px] font-semibold tracking-[0.12em] uppercase text-[#111110]">
                    <span>Standard Protocol</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
