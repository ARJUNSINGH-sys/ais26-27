"use client";

import { useState } from "react";
import FoldLayout from "@/components/FoldLayout";

interface Milestone {
  id: string;
  epoch: string;
  quarter: string;
  title: string;
  focus: string;
  status: "COMPLETED" | "ACTIVE" | "UPCOMING" | "HORIZON";
  description: string;
  deliverables: {
    item: string;
    detail: string;
    completed: boolean;
  }[];
}

const ROADMAP_EPOCHS: Milestone[] = [
  {
    id: "01",
    epoch: "EPOCH 01",
    quarter: "2024 · Q3–Q4",
    title: "Foundations & Mathematical Rigor",
    focus: "Curriculum Architecture & Core Research Induction",
    status: "COMPLETED",
    description:
      "Establishing the foundational pillar of the society. Deconstructing machine learning algorithms from pure linear algebra, calculus, and matrix calculus without reliance on black-box frameworks.",
    deliverables: [
      {
        item: "First-Principles Visual Curriculum",
        detail:
          "Published 7 comprehensive interactive essays spanning Ordinary Least Squares to Neural Backprop.",
        completed: true,
      },
      {
        item: "Club Induction & Fellowship Screening",
        detail:
          "Recruited 45 research fellows and 60 associate engineers across CS and ECE branches.",
        completed: true,
      },
      {
        item: "AI Hunt 2.0 Cryptic Challenge",
        detail:
          "Campus-wide 48-hour challenge with 450+ participants solving adversarial logic gates.",
        completed: true,
      },
    ],
  },
  {
    id: "02",
    epoch: "EPOCH 02",
    quarter: "2025 · Q1–Q2",
    title: "Systems, Clusters & Competitive Scale",
    focus: "Model Serving Infrastructure & National Symposium",
    status: "ACTIVE",
    description:
      "Transitioning from toy algorithmic implementations to enterprise model deployment. Provisioning dedicated on-premise compute nodes, hosting TechArena 2025, and shipping production agent workflows.",
    deliverables: [
      {
        item: "TechArena 2025 Flagship Symposium",
        detail:
          "Hosting 1,200+ national competitors across generative AI, web3, and robotics tracks.",
        completed: true,
      },
      {
        item: "Campus Multi-Node GPU Cluster",
        detail:
          "Orchestrating containerized Slurm/Kubernetes job scheduling for research training runs.",
        completed: true,
      },
      {
        item: "3D Gaussian Splatting Workshop",
        detail:
          "Spatial computing masterclass integrating radiance field capture on Apple Vision Pro & Quest 3.",
        completed: false,
      },
      {
        item: "Project Showcase 2025 (Demo Day)",
        detail:
          "Live demonstration of 10 student-engineered production systems to faculty and VCs.",
        completed: false,
      },
    ],
  },
  {
    id: "03",
    epoch: "EPOCH 03",
    quarter: "2025 · Q3–Q4",
    title: "Autonomous Agents & Domain Fine-Tuning",
    focus: "Low-Rank Adaptation & Multi-Agent Workflows",
    status: "UPCOMING",
    description:
      "Expanding into multi-agent systems and customized foundation model adaptation. Training open-weight LLMs on specialized campus knowledge bases and deploying tool-augmented autonomous assistants.",
    deliverables: [
      {
        item: "Bennett University LLM (BU-GPT Alpha)",
        detail:
          "Fine-tuned 8B parameter model trained on campus bylaws, research archives, and syllabi.",
        completed: false,
      },
      {
        item: "Autonomous Research Agent Toolkit",
        detail:
          "Open-source Python framework for multi-agent literature search, synthesis, and code execution.",
        completed: false,
      },
      {
        item: "AI Hunt 3.0: Global Collegiate Edition",
        detail:
          "Scaling the signature cryptic challenge to inter-university national brackets.",
        completed: false,
      },
    ],
  },
  {
    id: "04",
    epoch: "EPOCH 04",
    quarter: "2026 · H1–H2",
    title: "Frontier Publications & Industry Spinouts",
    focus: "Peer-Reviewed Research & Startup Incubation",
    status: "HORIZON",
    description:
      "Submitting empirical findings to top-tier machine learning workshops (NeurIPS, ICML, CVPR). Incubating member ventures and bridging commercial deployment with venture capital backing.",
    deliverables: [
      {
        item: "Peer-Reviewed Student Research Papers",
        detail:
          "Aiming for 4+ accepted workshop preprints in neural efficiency and multi-modal alignment.",
        completed: false,
      },
      {
        item: "AIS Venture Accelerator Track",
        detail:
          "Providing compute grants, legal incorporation assistance, and mentor networks for student founders.",
        completed: false,
      },
      {
        item: "Open-Source Benchmark Suite",
        detail:
          "Comprehensive evaluation harness for long-context retrieval and code generation.",
        completed: false,
      },
    ],
  },
  {
    id: "05",
    epoch: "EPOCH 05",
    quarter: "2027",
    title: "Institutional Center of AI Excellence",
    focus: "Endowed Research Chairs & National Impact",
    status: "HORIZON",
    description:
      "Establishing Bennett University AI Society as a nationally recognized node for applied machine intelligence, policy advising, and advanced cognitive systems research.",
    deliverables: [
      {
        item: "National Collegiate AI Summit Host",
        detail:
          "Convening student research societies from IITs, BITS, and IIITs for an annual academic gathering.",
        completed: false,
      },
      {
        item: "Endowed Lab Space & Compute Endowment",
        detail:
          "Securing sustained corporate grants and dedicated multi-rack NVIDIA GPU clusters.",
        completed: false,
      },
    ],
  },
];

const METRICS = [
  { value: "05", label: "PLANNED EPOCHS", sub: "Through academic year 2027" },
  { value: "10+", label: "PRODUCTION RELEASES", sub: "Open-source & toolkits" },
  {
    value: "1,200+",
    label: "HACKATHON DELEGATES",
    sub: "Annual symposium scale",
  },
  { value: "100%", label: "OPEN ACCESS", sub: "Free code, papers & datasets" },
];

export default function RoadmapPage() {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const filteredEpochs = ROADMAP_EPOCHS.filter((epoch) => {
    if (activeFilter === "ALL") return true;
    return epoch.status === activeFilter;
  });

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <div className="shell relative">
          {/* Watermark */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-4 text-[clamp(120px,20vw,240px)] font-extralight text-black/[0.04] leading-none select-none pointer-events-none tracking-tighter"
          >
            05
          </div>

          {/* Header */}
          <header className="relative z-10 max-w-[68ch] mb-12 sm:mb-16">
            {/* Coming Soon Announcement Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#DE5D35]/10 border border-[#DE5D35]/25 text-[#DE5D35] font-mono text-[11px] font-bold tracking-widest uppercase mb-5 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DE5D35] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DE5D35]" />
              </span>
              <span>COMING SOON · OFFICIAL 2025–2027 ROADMAP</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.18em] uppercase text-[#75716B]">
                05 / TRAJECTORY · COMING SOON
              </span>
            </div>

            <h1 className="text-[42px] sm:text-[64px] md:text-[76px] font-black tracking-[-0.035em] leading-[0.96] uppercase text-[#1A1816] mb-5 font-display">
              Roadmap <span className="text-[#DE5D35]">Coming Soon.</span>
            </h1>

            <p className="text-[16px] text-[#75716B] leading-[1.65]">
              Our strategic trajectory across autonomous agents, foundation
              model fine-tuning, campus GPU clusters, and research publications
              for Epochs 2025–2027 is currently undergoing technical
              calibration. Explore the preliminary preview below.
            </p>
          </header>

          {/* Coming Soon Notice Card */}
          <div className="mb-10 p-4 sm:p-5 bg-[#FAF9F5] border border-[#DE5D35]/30 rounded-[20px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 text-[12px] sm:text-[13px] font-mono text-[#1A1816]">
              <span className="px-2.5 py-0.5 rounded bg-[#DE5D35] text-white text-[10px] font-bold tracking-wider uppercase shrink-0 mt-0.5 sm:mt-0">
                COMING SOON
              </span>
              <span>
                The full interactive roadmap for future epochs is currently
                undergoing technical committee calibration and will unlock
                during the next symposium.
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#75716B] shrink-0">
              EST. REVEAL: Q2 2025
            </span>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-14 p-6 sm:p-8 bg-[#FAF9F5] border border-[#1A1816]/15 rounded-[28px]">
            {METRICS.map((m) => (
              <div
                key={m.label}
                className="flex flex-col border-l-2 border-[#DE5D35]/50 pl-4 py-1"
              >
                <span className="font-display text-[28px] sm:text-[36px] font-black text-[#1A1816] leading-none mb-1">
                  {m.value}
                </span>
                <span className="font-mono text-[10px] font-bold tracking-wider text-[#DE5D35] uppercase">
                  {m.label}
                </span>
                <span className="text-[12px] text-[#75716B] mt-0.5">
                  {m.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="border-t border-b border-[#1A1816]/15 py-4 mb-12 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-mono tracking-wider uppercase">
              {["ALL", "ACTIVE", "UPCOMING", "COMPLETED", "HORIZON"].map(
                (filter) => {
                  const isActive = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`inline-flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${
                        isActive
                          ? "text-[#1A1816] font-bold"
                          : "text-[#75716B] hover:text-[#1A1816]"
                      }`}
                    >
                      {isActive && (
                        <span className="w-1 h-1 rounded-full bg-[#DE5D35]" />
                      )}
                      <span>{filter}</span>
                    </button>
                  );
                },
              )}
            </div>

            <span className="font-mono text-[11px] text-[#75716B]">
              SHOWING {filteredEpochs.length} EPOCH PHASES
            </span>
          </div>

          {/* Epoch Timeline Cards */}
          <div className="space-y-8 sm:space-y-10 relative">
            {filteredEpochs.map((epoch) => {
              const isCompleted = epoch.status === "COMPLETED";
              const isActive = epoch.status === "ACTIVE";

              return (
                <div
                  key={epoch.id}
                  className={`border transition-all duration-300 rounded-[28px] p-6 sm:p-9 ${
                    isActive
                      ? "border-[#DE5D35] bg-[#FAF9F5] shadow-xl ring-1 ring-[#DE5D35]/20"
                      : "border-[#1A1816]/15 bg-[#FAF9F5] hover:border-[#1A1816]/40"
                  }`}
                >
                  {/* Top Epoch Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-[#1A1816]/10">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-[#1A1816] text-[#FAF9F5] font-mono text-[11px] font-bold tracking-widest uppercase">
                        {epoch.epoch}
                      </span>
                      <span className="font-mono text-[12px] text-[#75716B]">
                        {epoch.quarter}
                      </span>
                    </div>

                    <span
                      className={`self-start sm:self-auto px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isActive
                          ? "bg-[#DE5D35] text-white animate-pulse"
                          : isCompleted
                            ? "bg-emerald-600 text-white"
                            : "bg-[#1A1816]/10 text-[#1A1816]"
                      }`}
                    >
                      {epoch.status === "ACTIVE"
                        ? "CURRENT ACTIVE EPOCH"
                        : epoch.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="max-w-[72ch] mb-8">
                    <span className="text-[12px] font-mono text-[#DE5D35] font-semibold tracking-wider uppercase block mb-1">
                      {epoch.focus}
                    </span>
                    <h2 className="font-display text-[24px] sm:text-[32px] font-extrabold text-[#1A1816] tracking-[-0.02em] leading-tight mb-3">
                      {epoch.title}
                    </h2>
                    <p className="text-[14px] leading-[1.65] text-[#75716B]">
                      {epoch.description}
                    </p>
                  </div>

                  {/* Deliverables Checklist Grid */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#1A1816]/60 font-bold block mb-4">
                      KEY DELIVERABLES & MILESTONES
                    </span>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {epoch.deliverables.map((d) => (
                        <div
                          key={d.item}
                          className={`p-4 rounded-xl border transition-all ${
                            d.completed
                              ? "bg-emerald-500/5 border-emerald-500/30"
                              : "bg-[#EFECE6]/50 border-[#1A1816]/10"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                d.completed
                                  ? "bg-emerald-600 text-white"
                                  : "bg-[#1A1816]/10 text-[#75716B]"
                              }`}
                            >
                              {d.completed ? "✓" : "○"}
                            </span>
                            <span className="font-display text-[14px] font-bold text-[#1A1816] leading-tight">
                              {d.item}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#75716B] leading-relaxed pl-6">
                            {d.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Contribution Card */}
          <div className="mt-20 p-8 sm:p-12 bg-[#1A1816] text-[#FAF9F5] rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-8 border border-white/10 relative overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#DE5D35]/20 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-[50ch]">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#DE5D35] animate-ping" />
                <span className="text-[10px] font-mono tracking-widest text-[#DE5D35] uppercase font-bold">
                  CONTRIBUTE TO OUR HORIZON
                </span>
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-extrabold font-display tracking-tight text-[#FAF9F5] leading-tight mb-3">
                Have a Research Direction in Mind?
              </h2>
              <p className="text-[14px] text-white/70 leading-relaxed">
                The roadmap is continuously shaped by student proposals. If you
                have an ambitious model architecture, paper hypothesis, or
                deployment concept, pitch it directly to the cohort.
              </p>
            </div>

            <div className="relative z-10 shrink-0">
              <a
                href="mailto:ais@bennett.edu.in?subject=Roadmap%20Proposal%20Submission"
                className="pill bg-[#FAF9F5] text-[#1A1816] hover:bg-white transition-all shadow-md"
              >
                <span>Submit a Proposal</span>
                <span className="pill__medal bg-[#1A1816]/10" />
              </a>
            </div>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
