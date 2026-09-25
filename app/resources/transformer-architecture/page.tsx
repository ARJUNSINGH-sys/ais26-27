"use client";

import Link from "next/link";
import FoldLayout from "@/components/FoldLayout";
import MathTex from "@/components/MathTex";

export default function TransformerArchitectureArticlePage() {
  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <div className="shell max-w-5xl">
          {/* Back to Articles Archive */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/resources"
              aria-label="Return to Published Articles Archive"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[2px] bg-[#FAF9F5] border border-[#1A1816] text-[#1A1816] font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-200 hover:bg-[#1A1816] hover:text-[#FAF9F5] group"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
                ←
              </span>
              <span>All Articles</span>
            </Link>

            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#75716B]">
              <span>CURRICULUM ARCHIVE</span>
              <span>•</span>
              <span className="text-[#DE5D35] font-semibold">DEEP LEARNING</span>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-12">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#DE5D35]">
                RESEARCH DISPATCH • NO. 00
              </span>
              <span className="text-[#1A1816]/30">/</span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#75716B]">
                VASWANI ET AL. (2017)
              </span>
            </div>

            <h1 className="font-display font-black text-[clamp(36px,6vw,72px)] tracking-[-0.035em] uppercase text-[#1A1816] leading-[0.96] mb-6">
              The Transformer Architecture:
              <br />
              Attention Is All You Need
            </h1>

            <p className="font-sans text-[18px] sm:text-[21px] leading-[1.4] text-[#1A1816]/80 max-w-[44ch] mb-8">
              Eliminating recurrent temporal bottlenecks in sequence modeling in favor of constant-path multi-head self-attention.
            </p>

            <div className="flex flex-wrap items-center gap-6 font-mono text-[12px] uppercase text-[#75716B] border-t border-[#1A1816]/10 pt-6">
              <span>Read Time: 12 min</span>
              <span>•</span>
              <span>Published: September 2026</span>
              <span>•</span>
              <span>Author: AIS Research Cohort</span>
              <span>•</span>
              <a
                href="/visualizer/index.html"
                target="_blank"
                rel="noreferrer"
                className="text-[#DE5D35] font-bold hover:underline"
              >
                Launch 3D WebGL Engine ↗
              </a>
            </div>
          </header>

          {/* Abstract / First-Principles Callout */}
          <section className="p-8 sm:p-10 rounded-[4px] border border-[#1A1816]/20 bg-[#FAF9F5] mb-16 shadow-xs">
            <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-widest text-[#DE5D35] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#DE5D35] animate-pulse" />
              <span>FIRST-PRINCIPLES ABSTRACT</span>
            </div>
            <p className="font-sans text-[16px] sm:text-[17px] leading-relaxed text-[#1A1816] mb-6">
              Prior to 2017, sequence transduction was dominated by recurrent neural networks (RNNs, LSTMs, GRUs) processing sequences step-by-step: <MathTex math="h_t = f(h_{t-1}, x_t)" />. This sequential computation inherently prevented parallelization during training and forced signals between distant positions to traverse <MathTex math="O(n)" /> recurrent steps, leading to catastrophic gradient degradation.
            </p>
            <p className="font-sans text-[16px] sm:text-[17px] leading-relaxed text-[#1A1816]">
              The Transformer discards recurrence entirely, connecting every token to every other token in <MathTex math="O(1)" /> operations via scaled dot-product attention. This page provides the canonical architectural breakdown, mathematical derivations, and links to our live 3D Eigensight visualization engine.
            </p>
          </section>

          {/* 01. Canonical Architecture Blueprint */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[12px] font-bold uppercase text-[#DE5D35]">01 / BLUEPRINT</span>
              <span className="h-px bg-[#1A1816]/20 grow" />
            </div>
            <h2 className="font-display font-black text-[clamp(28px,4.5vw,48px)] uppercase text-[#1A1816] leading-[1.02] mb-6">
              The Canonical Paper Architecture
            </h2>
            <p className="font-sans text-[15px] sm:text-[16px] leading-relaxed text-[#1A1816]/80 mb-8 max-w-[65ch]">
              An exact, pixel-perfect rendering of the original architecture diagram from Vaswani et al. (2017), illustrating the 6-layer Encoder stack (left), the 6-layer Decoder stack (right), residual bypass highways, and cross-attention bridges:
            </p>

            {/* Canonical Architecture SVG Box */}
            <div className="rounded-[4px] border border-[#1A1816]/20 bg-[#141518] p-6 sm:p-10 mb-8 overflow-x-auto shadow-md text-center">
              <div className="inline-block max-w-[640px] w-full text-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 700 860"
                  className="w-full h-auto"
                  style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif" }}
                >
                  <defs>
                    <marker id="arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#1B1B1B" />
                    </marker>
                    <marker id="arr-w" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                      <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#FAF9F5" />
                    </marker>
                  </defs>

                  <text x="350" y="32" fill="#FAF9F5" fontSize="15" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">
                    THE TRANSFORMER ARCHITECTURE (VASWANI ET AL., 2017)
                  </text>

                  {/* Top: Output Probabilities */}
                  <text x="480" y="68" fill="#FAF9F5" fontSize="14.5" fontWeight="bold" textAnchor="middle">Output Probabilities</text>
                  <line x1="480" y1="94" x2="480" y2="76" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>

                  {/* Softmax */}
                  <rect x="402" y="94" width="156" height="35" rx="7" fill="#D9CEEB" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="116" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Softmax</text>
                  <line x1="480" y1="152" x2="480" y2="131" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>

                  {/* Linear */}
                  <rect x="402" y="152" width="156" height="35" rx="7" fill="#D0E9F9" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="174" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Linear</text>
                  <line x1="480" y1="205" x2="480" y2="189" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>

                  {/* Decoder Container */}
                  <rect x="375" y="205" width="210" height="440" rx="12" fill="#EAF4E8" stroke="#52A852" strokeWidth="1.8"/>
                  <text x="598" y="420" fill="#FAF9F5" fontSize="16" fontWeight="bold" textAnchor="start">
                    Decoder<tspan x="598" dy="20">layer</tspan>
                  </text>

                  {/* Decoder Sublayers */}
                  <rect x="402" y="220" width="156" height="34" rx="7" fill="#FFF5B8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="242" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Add &amp; Norm</text>

                  <line x1="480" y1="280" x2="480" y2="256" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <rect x="402" y="280" width="156" height="34" rx="7" fill="#FBDDB7" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="302" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Feed Forward</text>
                  <path d="M 480 334 L 570 334 L 570 237 L 560 237" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>

                  <line x1="480" y1="344" x2="480" y2="316" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <rect x="402" y="344" width="156" height="34" rx="7" fill="#FFF5B8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="366" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Add &amp; Norm</text>

                  <line x1="480" y1="406" x2="480" y2="380" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <rect x="402" y="406" width="156" height="52" rx="7" fill="#E6D3E8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="428" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">
                    Multi-Head<tspan x="480" dy="17">Attention</tspan>
                  </text>
                  <path d="M 480 482 L 570 482 L 570 361 L 560 361" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>

                  <line x1="480" y1="494" x2="480" y2="460" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <rect x="402" y="494" width="156" height="34" rx="7" fill="#FFF5B8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="516" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Add &amp; Norm</text>

                  <line x1="480" y1="556" x2="480" y2="530" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <rect x="402" y="556" width="156" height="66" rx="7" fill="#E6D3E8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="578" fill="#1B1B1B" fontSize="13" fontWeight="bold" textAnchor="middle">
                    Masked<tspan x="480" dy="16">Multi-Head</tspan><tspan x="480" dy="16">Attention</tspan>
                  </text>

                  <line x1="480" y1="642" x2="480" y2="624" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <path d="M 480 635 L 438 635 L 438 624" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <path d="M 480 635 L 522 635 L 522 624" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <path d="M 480 642 L 570 642 L 570 511 L 560 511" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>

                  <line x1="480" y1="678" x2="480" y2="650" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>
                  <circle cx="480" cy="678" r="12" fill="#FAF9F5" stroke="#1B1B1B" strokeWidth="1.8"/>
                  <text x="480" y="683" fill="#1B1B1B" fontSize="17" fontWeight="bold" textAnchor="middle">+</text>

                  <circle cx="532" cy="678" r="13" fill="#FAF9F5" stroke="#1B1B1B" strokeWidth="1.8"/>
                  <path d="M 524 678 Q 528 672 532 678 T 540 678" fill="none" stroke="#1B1B1B" strokeWidth="1.8"/>
                  <line x1="519" y1="678" x2="494" y2="678" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>
                  <text x="554" y="674" fill="#FAF9F5" fontSize="12" fontWeight="bold" textAnchor="start">
                    Positional<tspan x="554" dy="14">Encoding</tspan>
                  </text>

                  <line x1="480" y1="712" x2="480" y2="692" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>
                  <rect x="402" y="712" width="156" height="44" rx="7" fill="#F4D5E8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="480" y="732" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">
                    Output<tspan x="480" dy="16">Embedding</tspan>
                  </text>

                  <line x1="480" y1="795" x2="480" y2="758" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>
                  <text x="480" y="812" fill="#FAF9F5" fontSize="14" fontWeight="bold" textAnchor="middle">Outputs</text>
                  <text x="480" y="828" fill="#A0A0A0" fontSize="11" textAnchor="middle">(Output Tokens from Previous Step)</text>

                  {/* Encoder Container */}
                  <rect x="95" y="335" width="210" height="310" rx="12" fill="#EAF4E8" stroke="#52A852" strokeWidth="1.8"/>
                  <text x="78" y="500" fill="#FAF9F5" fontSize="16" fontWeight="bold" textAnchor="end">
                    Encoder<tspan x="78" dy="20">layer</tspan>
                  </text>

                  <rect x="122" y="346" width="156" height="34" rx="7" fill="#FFF5B8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="200" y="368" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Add &amp; Norm</text>

                  <line x1="200" y1="406" x2="200" y2="382" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <rect x="122" y="406" width="156" height="34" rx="7" fill="#FBDDB7" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="200" y="428" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Feed Forward</text>
                  <path d="M 200 460 L 110 460 L 110 363 L 120 363" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>

                  <line x1="200" y1="472" x2="200" y2="442" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <rect x="122" y="472" width="156" height="34" rx="7" fill="#FFF5B8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="200" y="494" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">Add &amp; Norm</text>

                  <line x1="200" y1="534" x2="200" y2="508" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <rect x="122" y="534" width="156" height="52" rx="7" fill="#E6D3E8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="200" y="556" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">
                    Multi-Head<tspan x="200" dy="17">Attention</tspan>
                  </text>

                  <line x1="200" y1="620" x2="200" y2="588" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <path d="M 200 612 L 158 612 L 158 588" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <path d="M 200 612 L 242 612 L 242 588" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <path d="M 200 620 L 110 620 L 110 489 L 120 489" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>

                  <line x1="200" y1="678" x2="200" y2="650" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>
                  <circle cx="200" cy="678" r="12" fill="#FAF9F5" stroke="#1B1B1B" strokeWidth="1.8"/>
                  <text x="200" y="683" fill="#1B1B1B" fontSize="17" fontWeight="bold" textAnchor="middle">+</text>

                  <circle cx="148" cy="678" r="13" fill="#FAF9F5" stroke="#1B1B1B" strokeWidth="1.8"/>
                  <path d="M 140 678 Q 144 672 148 678 T 156 678" fill="none" stroke="#1B1B1B" strokeWidth="1.8"/>
                  <line x1="161" y1="678" x2="186" y2="678" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>
                  <text x="126" y="674" fill="#FAF9F5" fontSize="12" fontWeight="bold" textAnchor="end">
                    Positional<tspan x="126" dy="14">Encoding</tspan>
                  </text>

                  <line x1="200" y1="712" x2="200" y2="692" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>
                  <rect x="122" y="712" width="156" height="44" rx="7" fill="#F4D5E8" stroke="#1B1B1B" strokeWidth="1.5"/>
                  <text x="200" y="732" fill="#1B1B1B" fontSize="13.5" fontWeight="bold" textAnchor="middle">
                    Input<tspan x="200" dy="16">Embedding</tspan>
                  </text>

                  <line x1="200" y1="795" x2="200" y2="758" stroke="#FAF9F5" strokeWidth="1.8" markerEnd="url(#arr-w)"/>
                  <text x="200" y="812" fill="#FAF9F5" fontSize="14" fontWeight="bold" textAnchor="middle">Inputs</text>

                  {/* Cross-Attention Highway Connection */}
                  <path d="M 200 346 L 200 305 L 340 305 L 340 424 L 398 424" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <path d="M 340 442 L 398 442" fill="none" stroke="#1B1B1B" strokeWidth="1.8" markerEnd="url(#arr)"/>
                  <circle cx="340" cy="424" r="2.5" fill="#1B1B1B"/>
                  <circle cx="340" cy="442" r="2.5" fill="#1B1B1B"/>
                </svg>
              </div>
            </div>
          </section>

          {/* 02. Mathematical Foundations Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[12px] font-bold uppercase text-[#DE5D35]">02 / MATHEMATICS</span>
              <span className="h-px bg-[#1A1816]/20 grow" />
            </div>
            <h2 className="font-display font-black text-[clamp(28px,4.5vw,48px)] uppercase text-[#1A1816] leading-[1.02] mb-6">
              Scaled Dot-Product & Multi-Head Attention
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-8 rounded-[4px] border border-[#1A1816]/20 bg-[#FAF9F5]">
                <h3 className="font-mono text-[13px] font-bold uppercase text-[#DE5D35] mb-3">
                  Scaled Dot-Product Attention
                </h3>
                <p className="font-sans text-[14px] leading-relaxed text-[#1A1816]/75 mb-4">
                  Computes query-key compatibility scaled by <MathTex math="1/\sqrt{d_k}" /> to prevent softmax saturation into regions of infinitesimally small gradients:
                </p>
                <div className="p-4 bg-[#EFECE6] rounded font-mono text-[13px] text-center my-4 overflow-x-auto">
                  <MathTex math="\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" block />
                </div>
              </div>

              <div className="p-8 rounded-[4px] border border-[#1A1816]/20 bg-[#FAF9F5]">
                <h3 className="font-mono text-[13px] font-bold uppercase text-[#DE5D35] mb-3">
                  Multi-Head Decomposition
                </h3>
                <p className="font-sans text-[14px] leading-relaxed text-[#1A1816]/75 mb-4">
                  Linearly projects queries, keys, and values <MathTex math="h=8" /> times into distinct representation subspaces of dimension <MathTex math="d_k = 64" />:
                </p>
                <div className="p-4 bg-[#EFECE6] rounded font-mono text-[13px] text-center my-4 overflow-x-auto">
                  <MathTex math="\mathrm{MultiHead}(Q, K, V) = \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_h)W^O" block />
                </div>
              </div>
            </div>
          </section>

          {/* 03. Live 3D Visualizer Launcher Banner */}
          <section className="p-8 sm:p-12 rounded-[4px] border border-[#1A1816] bg-[#141518] text-[#FAF9F5] mb-20 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#00FFCC]">
                EIGENSIGHT 3D TRANSFORMER ENGINE
              </span>
              <span className="font-mono text-[11px] px-3 py-1 rounded bg-[#00FFCC]/15 text-[#00FFCC] border border-[#00FFCC]/30">
                60 FPS WEBGL & CANVAS
              </span>
            </div>

            <h3 className="font-display font-black text-[clamp(28px,4.5vw,52px)] uppercase leading-[1.02] mb-6">
              Explore the 3D Volumetric Tower.
            </h3>

            <p className="font-sans text-[15px] sm:text-[17px] leading-relaxed text-[#FAF9F5]/75 max-w-[55ch] mb-8">
              Experience the dual 6-layer Encoder/Decoder towers in real-time continuous 3D space with particle streams, Value Addition vectors, and autoregressive causal masking.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/visualizer/index.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#DE5D35] text-white font-mono text-[12px] font-bold uppercase tracking-wider hover:bg-[#DE5D35]/90 transition-all shadow-md active:scale-98"
              >
                <span>OPEN FULL 3D ENGINE</span>
                <span>↗</span>
              </a>
              <span className="font-mono text-[12px] text-[#A0A0A0]">
                Interactive Orbit · Camera Presets · 12 First-Principles Chapters
              </span>
            </div>
          </section>

          {/* Canonical Reference & Citation */}
          <footer className="border-t border-[#1A1816]/15 pt-8 text-[13px] font-mono text-[#75716B]">
            <p className="mb-2">
              <strong>Primary Reference:</strong> Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., &amp; Polosukhin, I. (2017). <em>Attention Is All You Need</em>. Advances in Neural Information Processing Systems (NeurIPS 2017).
            </p>
            <p>
              AI Society — Bennett University Research Archive.
            </p>
          </footer>
        </div>
      </main>
    </FoldLayout>
  );
}
