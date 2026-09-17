import Image from "next/image";
import { eventsData } from "@/lib/data";

export default function EventsGallery() {
  return (
    <section id="events" className="py-20 md:py-28">
      <div className="bw-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#666663] block mb-2">
              CURATED TIMELINE · 2024–2025
            </span>
            <h2 className="text-[32px] sm:text-[44px] font-extrabold tracking-[-0.025em] text-[#0A0A0A] leading-tight">
              Selected Works & Epochs
            </h2>
          </div>
          <p className="text-[14px] text-[#666663] max-w-[32ch] sm:text-right">
            Real event photographs documenting our research sprints, workshops, and flagship conferences.
          </p>
        </div>

        {/* 3-Column Asymmetric Gallery (Exact match to image copy 2.png gallery) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-start">
          {/* Column 1 */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {/* Dark Title Pill Card (Mirrors "Мои работы" card) */}
            <div className="bg-[#0A0A0A] text-white rounded-[26px] sm:rounded-[30px] p-7 sm:p-8 flex items-center justify-between border border-[#262626]">
              <div>
                <h3 className="text-[22px] sm:text-[26px] font-extrabold tracking-tight text-white leading-tight">
                  Flagship
                  <br />
                  Epochs
                </h3>
                <span className="text-[11px] font-mono text-white/50 tracking-wider uppercase mt-1 block">
                  Archive 24–25
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>

            {/* Event 1: Club Carnival (Tall Portrait Card) */}
            <div className="relative h-[380px] sm:h-[460px] rounded-[28px] sm:rounded-[34px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/70 group">
              <Image
                src="/images/event-club-carnival.png"
                alt="Club Carnival Orientation"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="bw-card-img object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-mono tracking-widest text-white/80 uppercase block mb-1">
                  JULY 2024 · INDUCTION
                </span>
                <h4 className="text-[19px] font-bold text-white leading-snug">
                  Club Carnival
                </h4>
                <p className="text-[12px] text-white/70 line-clamp-2 mt-1">
                  Welcoming 300+ freshers with live model inference and robotics demos.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {/* Event 2: AI Hunt 2.0 */}
            <div className="relative h-[280px] sm:h-[320px] rounded-[28px] sm:rounded-[34px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/70 group">
              <Image
                src="/images/event-ai-hunt.png"
                alt="AI Hunt 2.0 Scavenger Sprint"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="bw-card-img object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-mono tracking-widest text-white/80 uppercase block mb-1">
                  SEPTEMBER 2024 · CHALLENGE
                </span>
                <h4 className="text-[19px] font-bold text-white leading-snug">
                  AI Hunt 2.0
                </h4>
                <p className="text-[12px] text-white/70 line-clamp-1 mt-1">
                  48-hour cryptic algorithmic scavenger deciphering neural steganography.
                </p>
              </div>
            </div>

            {/* Event 3: XR & GenAI Workshop */}
            <div className="relative h-[280px] sm:h-[320px] rounded-[28px] sm:rounded-[34px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/70 group">
              <Image
                src="/images/event-workshop.png"
                alt="XR & GenAI Workshop"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="bw-card-img object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-mono tracking-widest text-white/80 uppercase block mb-1">
                  APRIL 2025 · MASTERCLASS
                </span>
                <h4 className="text-[19px] font-bold text-white leading-snug">
                  XR & GenAI Workshop
                </h4>
                <p className="text-[12px] text-white/70 line-clamp-1 mt-1">
                  Bridging Gaussian Splatting with generative diffusion pipelines.
                </p>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-5 sm:gap-6">
            {/* Event 4: AI 101 */}
            <div className="relative h-[320px] sm:h-[360px] rounded-[28px] sm:rounded-[34px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/70 group">
              <Image
                src="/images/event-ai-101.png"
                alt="AI 101 Foundations Session"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="bw-card-img object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-mono tracking-widest text-white/80 uppercase block mb-1">
                  AUGUST 2024 · KEYNOTE
                </span>
                <h4 className="text-[19px] font-bold text-white leading-snug">
                  AI 101 Induction
                </h4>
                <p className="text-[12px] text-white/70 line-clamp-1 mt-1">
                  Core tensor mathematics and hands-on PyTorch deep dive.
                </p>
              </div>
            </div>

            {/* Event 5: TechArena 2025 */}
            <div className="relative h-[240px] sm:h-[280px] rounded-[28px] sm:rounded-[34px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/70 group">
              <Image
                src="/images/event-tech-arena.png"
                alt="TechArena 2025 Symposium"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="bw-card-img object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] font-mono tracking-widest text-white/80 uppercase block mb-1">
                  FEBRUARY 2025 · SYMPOSIUM
                </span>
                <h4 className="text-[19px] font-bold text-white leading-snug">
                  TechArena 2025
                </h4>
                <p className="text-[12px] text-white/70 line-clamp-1 mt-1">
                  Bennett University&apos;s annual multi-track techfest and hackathon.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 6: Project Showcase Wide Bleed (Panoramic Anchor Card) */}
        <div className="mt-5 sm:mt-6 relative h-[260px] sm:h-[340px] rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#EEEEEC] bw-card border border-[#E2E2DE]/70 group">
          <Image
            src="/images/event-project-showcase.png"
            alt="Project Showcase Demo Day"
            fill
            sizes="100vw"
            className="bw-card-img object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
          <div className="absolute inset-y-0 left-8 sm:left-12 flex flex-col justify-center max-w-[44ch] text-white z-10">
            <span className="text-[11px] font-mono tracking-widest text-white/80 uppercase mb-2">
              MARCH 2025 · DEMO EXPO
            </span>
            <h3 className="text-[24px] sm:text-[32px] font-extrabold text-white tracking-tight leading-tight mb-2">
              Project Showcase 2025
            </h3>
            <p className="text-[13px] sm:text-[14px] text-white/80 line-clamp-2 mb-6">
              10+ student-engineered autonomous agents, neural vision trackers, and
              production APIs presented to industry leaders and research faculty.
            </p>
            <div>
              <span className="inline-flex items-center gap-2 text-[12px] font-mono uppercase tracking-wider text-white border-b border-white pb-0.5">
                Archived In Full Repository →
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
