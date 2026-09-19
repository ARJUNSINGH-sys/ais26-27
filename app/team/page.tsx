"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import FoldLayout from "@/components/FoldLayout";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamSlot {
  id: string;
  role: string;
  domain: string;
  badge: string;
  labelColor?: string;
  aspect?: string;
  rounded?: string;
}

const CORE_SLOTS: TeamSlot[] = [
  {
    id: "01",
    role: "PRESIDENCY",
    domain: "FOUNDATION MODELS & ALIGNMENT",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#2B6CB0]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
  {
    id: "02",
    role: "VICE PRESIDENCY",
    domain: "DIFFUSION & GENERATIVE MODELING",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#1A1816]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
  {
    id: "03",
    role: "TECHNICAL SECRETARY",
    domain: "DISTRIBUTED SYSTEMS & GPU SERVING",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#1A1816]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
  {
    id: "04",
    role: "RESEARCH FELLOW",
    domain: "COMPUTATIONAL VISION & BIO-ML",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#1A1816]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
  {
    id: "05",
    role: "COMPETITIVE AI LEAD",
    domain: "REINFORCEMENT LEARNING & GAME THEORY",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#2B6CB0]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
  {
    id: "06",
    role: "SYSTEMS ARCHITECT",
    domain: "AUTONOMOUS MULTI-AGENT WORKFLOWS",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#1A1816]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
  {
    id: "07",
    role: "WEB & GRAPHICS LEAD",
    domain: "INTERACTIVE PEDAGOGY & WEBGL",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#1A1816]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
  {
    id: "08",
    role: "OPERATIONS & SYMPOSIA",
    domain: "NATIONAL HACKATHONS & OUTREACH",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#1A1816]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
  {
    id: "09",
    role: "CREATIVE & EDITORIAL",
    domain: "BRAND SYSTEMS & RESEARCH ZINES",
    badge: "CORE REVEALING SOON",
    labelColor: "text-[#2B6CB0]",
    aspect: "aspect-[4/5]",
    rounded: "rounded-[28px]",
  },
];

export default function TeamPage() {
  const containerRef = useRef<HTMLElement | null>(null);
  const [viewMode, setViewMode] = useState<"gallery" | "list">("gallery");
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
            gsap.set(
              [
                ".team-top-hairline",
                ".team-hero-left",
                ".team-hero-title",
                ".team-hero-edition",
                ".team-card-slot",
                ".team-statement-title",
                ".team-statement-body",
                ".team-circuit-section",
              ],
              { opacity: 1, y: 0, scale: 1, scaleX: 1 },
            );
            return;
          }

          // Entrance timeline for hero
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
          });

          // Top hairline expansion
          tl.fromTo(
            ".team-top-hairline",
            { scaleX: 0, transformOrigin: "left" },
            { scaleX: 1, duration: 0.85 },
          )
            // Towering title masked slide-up
            .fromTo(
              ".team-hero-title",
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 1.1, ease: "power4.out" },
              "-=0.5",
            )
            // Edition badge 26-27 pop
            .fromTo(
              ".team-hero-edition",
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 0.6, duration: 0.6, ease: "back.out(1.6)" },
              "-=0.65",
            )
            // Left column (switcher and manifesto)
            .fromTo(
              ".team-hero-left",
              { y: 28, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.85 },
              "-=0.6",
            );

          // Scroll-triggered batched entrance for team cards
          ScrollTrigger.batch(".team-card-slot", {
            interval: 0.1,
            batchMax: 3,
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                { y: 50, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  stagger: 0.1,
                  ease: "power3.out",
                  overwrite: "auto",
                },
              ),
            start: "top 85%",
            once: true,
          });

          // Statement section reveal
          const statementTl = gsap.timeline({
            scrollTrigger: {
              trigger: ".team-statement-section",
              start: "top 75%",
              toggleActions: "play none none none",
            },
            defaults: { ease: "power3.out" },
          });

          statementTl
            .fromTo(
              ".team-statement-title",
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.95 },
            )
            .fromTo(
              ".team-statement-body",
              { y: 25, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
              "-=0.55",
            );

          // Schematic Circuit & Newsletter section
          gsap.fromTo(
            ".team-circuit-section",
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: ".team-circuit-section",
                start: "top 78%",
                toggleActions: "play none none none",
              },
            },
          );
        },
      );
    },
    { scope: containerRef, dependencies: [viewMode] },
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <FoldLayout>
      <main
        ref={containerRef}
        className="grow pt-24 sm:pt-28 md:pt-32 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen overflow-hidden"
      >
        <div className="shell">
          {/* Top Divider Hairline */}
          <div className="team-top-hairline w-full border-t border-[#1A1816]/20 mb-8 sm:mb-12 will-change-transform" />

          {/* Drive Capital Style Editorial Hero: Left manifesto vs Right towering title */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16 sm:mb-20">
            {/* Left Column: View Mode Pill & Manifesto Paragraph */}
            <div className="team-hero-left lg:col-span-5 flex flex-col justify-between h-full pt-2">
              <div className="mb-8">
                {/* Drive Capital Rounded Gallery View Pill */}
                <div className="inline-flex items-center gap-2 p-1 rounded-full border border-[#1A1816]/30 bg-transparent text-[11px] font-mono tracking-wider uppercase mb-8">
                  <button
                    type="button"
                    onClick={() => setViewMode("gallery")}
                    className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      viewMode === "gallery"
                        ? "bg-[#1A1816] text-[#FAF9F5] font-bold shadow-xs"
                        : "text-[#1A1816]/70 hover:text-[#1A1816]"
                    }`}
                  >
                    GALLERY VIEW
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                      viewMode === "list"
                        ? "bg-[#1A1816] text-[#FAF9F5] font-bold shadow-xs"
                        : "text-[#1A1816]/70 hover:text-[#1A1816]"
                    }`}
                  >
                    ROSTER
                  </button>
                </div>

                {/* Subtitle / Narrative Copy */}
                <p className="text-[17px] sm:text-[19px] md:text-[21px] font-normal leading-[1.4] text-[#1A1816] max-w-[36ch]">
                  We&apos;re a cohort driven by conviction and first principles.
                  These are our people and their stories.
                </p>
              </div>

              {/* Auxiliary hairline divider */}
              <div className="w-full border-b border-[#1A1816]/15 pt-6 hidden lg:block" />
            </div>

            {/* Right Column: Giant Towering Condensed Title (OUR TEAM) */}
            <div className="lg:col-span-7 flex justify-start lg:justify-end overflow-hidden py-2">
              <div className="relative inline-block select-none">
                <div className="overflow-hidden">
                  <h1 className="team-hero-title font-black text-[clamp(72px,13.5vw,180px)] tracking-[-0.04em] uppercase text-[#1A1816] leading-[0.88] font-display will-change-transform">
                    OUR TEAM
                  </h1>
                </div>
                <span className="team-hero-edition absolute -top-1 -right-7 sm:-right-10 md:-right-12 font-mono text-[22px] sm:text-[32px] md:text-[38px] font-normal text-[#1A1816]/60 will-change-transform">
                  26–27
                </span>
              </div>
            </div>
          </section>

          {/* Drive Capital 3-Column Staggered Grid */}
          <section className="mb-28 sm:mb-36">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-10 gap-y-12 sm:gap-y-16 items-start">
              {CORE_SLOTS.map((slot, index) => {
                // Staggered top offset to mimic Drive Capital's organic masonry rhythm
                const offsetClass =
                  index % 3 === 1
                    ? "lg:pt-8"
                    : index % 3 === 2
                      ? "lg:pt-16"
                      : "";

                return (
                  <div
                    key={slot.id}
                    className={`team-card-slot group ${offsetClass} will-change-transform`}
                  >
                    {/* Hairline Rule Above Member */}
                    <div className="w-full border-t border-[#1A1816]/20 mb-3" />

                    {/* Monospace Header Label: ROLE • REVEALING SOON */}
                    <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-mono tracking-wider uppercase mb-3">
                      <span
                        className={`font-semibold ${
                          slot.labelColor || "text-[#1A1816]"
                        }`}
                      >
                        {slot.role} • REVEALING SOON
                      </span>
                      <span className="text-[#75716B]">{slot.id}</span>
                    </div>

                    {/* Photo Card with Silhouette & Revealing Soon Atmosphere */}
                    <div
                      className={`relative w-full ${
                        slot.aspect || "aspect-[4/5]"
                      } overflow-hidden ${
                        slot.rounded || "rounded-[28px]"
                      } bg-[#141414] border border-[#1A1816]/15 shadow-sm transition-all duration-500 ease-out group-hover:border-[#1A1816] group-hover:shadow-xl`}
                    >
                      {/* Atmospheric Grain Texture Background */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-b from-[#1E1C1A] via-[#121110] to-[#0A0908] opacity-95"
                      />

                      {/* Stylized Silhouette Contour (Vector Drawing of Mysterious Human Figure) */}
                      <svg
                        viewBox="0 0 400 500"
                        preserveAspectRatio="xMidYMax meet"
                        className="absolute inset-0 w-full h-full text-[#FAF9F5] opacity-20 transition-all duration-500 ease-out group-hover:opacity-30 group-hover:scale-102"
                        aria-hidden="true"
                      >
                        {/* Head Contour */}
                        <ellipse
                          cx="200"
                          cy="190"
                          rx="62"
                          ry="78"
                          fill="currentColor"
                        />
                        {/* Neck */}
                        <path
                          d="M 175 250 L 170 300 L 230 300 L 225 250 Z"
                          fill="currentColor"
                        />
                        {/* Shoulders & Torso */}
                        <path
                          d="M 90 480 C 100 340, 150 295, 200 295 C 250 295, 300 340, 310 480 Z"
                          fill="currentColor"
                        />
                      </svg>

                      {/* Ambient Glowing Core Pulse in Chest / Face */}
                      <div
                        aria-hidden="true"
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#DE5D35]/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60"
                      />

                      {/* Diagonal Architectural Grid Lines Accent */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "24px 24px",
                        }}
                      />

                      {/* Center Revealing Soon Monospace Medallion */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FAF9F5] font-mono text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-3 group-hover:bg-[#DE5D35] group-hover:border-transparent transition-all duration-300 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>CORE REVEALING SOON</span>
                        </div>

                        <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase block max-w-[24ch]">
                          {slot.domain}
                        </span>
                      </div>

                      {/* Bottom Identification Tag */}
                      <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between text-white/40 font-mono text-[9px] uppercase tracking-widest px-2">
                        <span>BENNETT AI SOCIETY</span>
                        <span>ED. 26-27</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Drive Capital Large Statement Banner (Screenshot 3) */}
          <section className="team-statement-section border-t border-[#1A1816]/20 pt-16 sm:pt-20 mb-24 sm:mb-32">
            <h2 className="team-statement-title font-display font-extrabold text-[clamp(36px,6.8vw,88px)] tracking-[-0.035em] text-[#1A1816] uppercase leading-[0.94] mb-12 sm:mb-16">
              WE&apos;RE HEADING UP
              <br />
              AND TO THE RIGHT
            </h2>

            {/* Split Narrative & CTA Button */}
            <div className="team-statement-body grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-[#1A1816]/15 pt-8">
              <div className="md:col-span-3 flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#1A1816]">
                <span className="w-2.5 h-2.5 border border-[#1A1816] flex items-center justify-center p-0.5">
                  <span className="w-1 h-1 bg-[#DE5D35]" />
                </span>
                <span>JOIN US</span>
              </div>

              <div className="md:col-span-9 max-w-[56ch]">
                <p className="text-[20px] sm:text-[24px] md:text-[28px] font-normal leading-[1.3] text-[#1A1816] mb-8">
                  At AIS, we want to work with people who love a challenge and
                  pride themselves on the performance of their work.
                </p>

                <a
                  href="mailto:ais@bennett.edu.in?subject=Application%20for%20AIS%20Cohort%2026-27"
                  className="inline-flex items-center gap-4 px-7 py-3 rounded-full border border-[#1A1816] bg-transparent text-[#1A1816] hover:bg-[#1A1816] hover:text-white font-mono text-[12px] uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer shadow-xs active:scale-98"
                >
                  <span>APPLY FOR MEMBERSHIP</span>
                  <span className="text-[14px]">↗</span>
                </a>
              </div>
            </div>
          </section>

          {/* Drive Capital Architectural Circuit Graphic & Newsletter Box (Screenshot 4) */}
          <section className="team-circuit-section border-t border-[#1A1816]/20 pt-16 sm:pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
              {/* Left Headline */}
              <div className="lg:col-span-7">
                <h3 className="font-display font-extrabold text-[clamp(28px,4.5vw,56px)] tracking-[-0.03em] uppercase text-[#1A1816] leading-[1.02]">
                  THE GREATEST FRONTIER
                  <br />
                  FOR MACHINE INTELLIGENCE
                  <br />
                  IS FIRST PRINCIPLES.
                </h3>
              </div>

              {/* Right Architectural Schematic Circuit Vector */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <svg
                  viewBox="0 0 380 200"
                  className="w-full max-w-[340px] h-auto text-[#1A1816]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  aria-hidden="true"
                >
                  {/* Grid of circuit-like geometric lines inspired by Drive Capital's artwork */}
                  <line x1="20" y1="100" x2="120" y2="100" />
                  <line x1="120" y1="100" x2="160" y2="50" />
                  <line x1="160" y1="50" x2="250" y2="50" />
                  <line x1="250" y1="50" x2="290" y2="100" />
                  <line x1="290" y1="100" x2="360" y2="100" />

                  <line x1="120" y1="100" x2="160" y2="150" />
                  <line x1="160" y1="150" x2="250" y2="150" />
                  <line x1="250" y1="150" x2="290" y2="100" />

                  <line x1="160" y1="50" x2="160" y2="150" />
                  <line x1="205" y1="50" x2="205" y2="150" />
                  <line x1="250" y1="50" x2="250" y2="150" />

                  {/* Nodes */}
                  <circle cx="20" cy="100" r="3" fill="#1A1816" />
                  <circle cx="120" cy="100" r="3" fill="#1A1816" />
                  <circle cx="160" cy="50" r="3" fill="#DE5D35" />
                  <circle cx="205" cy="100" r="4" fill="#DE5D35" />
                  <circle cx="250" cy="150" r="3" fill="#DE5D35" />
                  <circle cx="290" cy="100" r="3" fill="#1A1816" />
                  <circle cx="360" cy="100" r="3" fill="#1A1816" />

                  {/* Cross-hatch isometric blocks */}
                  <rect
                    x="170"
                    y="60"
                    width="25"
                    height="30"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <rect
                    x="215"
                    y="110"
                    width="25"
                    height="30"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                </svg>
              </div>
            </div>

            {/* Newsletter Input Strip (matching Drive Capital's subscription capsule) */}
            <div className="border-t border-[#1A1816]/15 pt-8">
              <span className="block font-mono text-[11px] uppercase tracking-widest text-[#75716B] mb-3">
                SUBSCRIBE TO OUR RESEARCH DISPATCHES
              </span>

              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-3 max-w-lg"
              >
                <div className="relative grow">
                  <input
                    type="email"
                    required
                    placeholder="YOUR@EMAIL.COM"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full h-12 px-6 rounded-full border border-[#1A1816]/40 bg-transparent font-mono text-[13px] uppercase text-[#1A1816] placeholder:text-[#75716B]/60 focus:outline-none focus:border-[#1A1816] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  aria-label="Submit subscription"
                  className="w-12 h-12 rounded-full border border-[#1A1816] bg-[#1A1816] text-[#FAF9F5] hover:bg-[#DE5D35] hover:border-[#DE5D35] flex items-center justify-center transition-colors duration-200 cursor-pointer shadow-xs shrink-0"
                >
                  <span className="text-[16px]">→</span>
                </button>
              </form>

              {subscribed && (
                <p className="font-mono text-[11px] text-emerald-700 mt-3 animate-in fade-in duration-200">
                  ✓ You are on the priority dispatch list for the Core Reveal.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </FoldLayout>
  );
}
