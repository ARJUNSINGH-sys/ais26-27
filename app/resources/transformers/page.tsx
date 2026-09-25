"use client";

import Link from "next/link";
import { useState } from "react";
import FoldLayout from "@/components/FoldLayout";
import MathTex from "@/components/MathTex";

export default function TransformersArticlePage() {
  // ── State for Interactive Attention Simulator ──
  const sentence = ["The", "animal", "didn't", "cross", "the", "street", "because", "it", "was", "too", "tired"];
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(7); // default 'it'
  const [activeHead, setActiveHead] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<number>(1);
  const [simStep, setSimStep] = useState<number>(0);

  // Attention weights for "it" pointing to "animal" (Head 1) vs "street" (Head 2)
  const getAttentionWeights = (idx: number, head: number) => {
    if (idx === 7) { // "it"
      if (head === 1) {
        return [0.02, 0.76, 0.01, 0.03, 0.01, 0.04, 0.02, 0.05, 0.02, 0.01, 0.03]; // points to "animal"
      } else {
        return [0.01, 0.05, 0.01, 0.04, 0.02, 0.68, 0.03, 0.08, 0.02, 0.02, 0.04]; // points to "street"
      }
    }
    // Generic fallback weights
    return sentence.map((_, i) => (i === idx ? 0.65 : 0.35 / (sentence.length - 1)));
  };

  const weights = getAttentionWeights(selectedTokenIdx, activeHead);

  // Autoregressive generation steps
  const genSteps = [
    { generated: ["<BOS>"], nextToken: "Thinking", probs: [{ word: "Thinking", p: "84.2%" }, { word: "Learning", p: "10.5%" }, { word: "Artificial", p: "3.1%" }] },
    { generated: ["<BOS>", "Thinking"], nextToken: "machines", probs: [{ word: "machines", p: "91.8%" }, { word: "systems", p: "5.2%" }, { word: "models", p: "1.9%" }] },
    { generated: ["<BOS>", "Thinking", "machines"], nextToken: "attend", probs: [{ word: "attend", p: "79.4%" }, { word: "learn", p: "14.1%" }, { word: "reason", p: "4.3%" }] },
    { generated: ["<BOS>", "Thinking", "machines", "attend"], nextToken: "<EOS>", probs: [{ word: "<EOS>", p: "95.1%" }, { word: "globally", p: "3.2%" }, { word: ".", p: "1.1%" }] },
  ];

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <div className="shell max-w-5xl">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <Link
              href="/resources"
              aria-label="Return to Published Articles Archive"
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-[2px] bg-[#FAF9F5] border border-[#1A1816] text-[#1A1816] font-mono text-[12px] font-bold tracking-wider uppercase transition-all duration-200 hover:bg-[#1A1816] hover:text-[#FAF9F5] group"
            >
              <span className="text-[#DE5D35] group-hover:text-[#FAF9F5] transition-transform duration-200 group-hover:-translate-x-1 font-bold">
                ←
              </span>
              <span>Back to 03 / Published Articles</span>
            </Link>

            <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.16em] uppercase text-[#75716B]">
              <Link href="/resources" className="hover:text-[#1A1816] transition-colors">
                03 / Resources
              </Link>
              <span>/</span>
              <span className="text-[#DE5D35] font-semibold">
                Deep Learning · Transformers
              </span>
            </div>
          </div>

          {/* Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 16
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              The Transformer: Attention Is All You Need
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              Eliminating recurrence in favor of global multi-head self-attention.
              Experience how queries, keys, and values replace temporal bottlenecks with
              constant-path <MathTex math="O(1)" /> attention highways.
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-6 font-mono text-[11px] uppercase tracking-wider text-[#75716B]">
              <span>Read Time: 12 min</span>
              <span>•</span>
              <span>Vaswani et al. (NeurIPS 2017)</span>
              <span>•</span>
              <span className="text-[#DE5D35] font-bold">AIS Research Cohort</span>
            </div>
          </header>

          {/* Section 01: Paradigm Shift: RNN vs Attention */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                01 / The Architectural Leap
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                From Sequential Bottlenecks to Constant-Path Attention
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
              <div className="lg:col-span-6 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  Recurrent architectures (RNNs and LSTMs) process sequences step-by-step.
                  To link token <MathTex math="x_1" /> to token <MathTex math="x_{100}" />, the gradient must survive
                  a chain of 100 non-linear matrix multiplications. This causes the classic
                  vanishing gradient problem and forces strictly sequential training.
                </p>
                <p>
                  The <strong>Transformer architecture</strong> discards recurrence entirely.
                  Every token can attend directly to every other token in a single operation,
                  reducing the maximum signal path length from <MathTex math="O(n)" /> to <MathTex math="O(1)" />:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[13px] rounded-[2px]">
                  <div className="text-[11px] text-[#75716B] uppercase mb-1">Attention Matrix Formulation</div>
                  <MathTex math="\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" block />
                </div>
              </div>

              {/* Comparison Diagram */}
              <div className="lg:col-span-6 border border-[#1A1816]/15 bg-[#FAF9F5] p-6 rounded-[2px]">
                <div className="text-[11px] font-mono text-[#75716B] uppercase tracking-wider mb-4 font-bold flex justify-between">
                  <span>SIGNAL PROPAGATION PATH</span>
                  <span className="text-[#DE5D35]">O(1) VS O(N)</span>
                </div>

                <div className="space-y-6">
                  {/* RNN Chain */}
                  <div className="p-3 bg-[#EFECE6]/50 border border-[#1A1816]/10 rounded">
                    <div className="text-[10px] font-mono text-[#75716B] mb-2 uppercase">Recurrent Network (Sequential O(n) delay)</div>
                    <div className="flex items-center justify-between text-center font-mono text-[11px]">
                      <div className="px-2 py-1 bg-white border border-[#1A1816]/20 rounded">h₁</div>
                      <span className="text-[#75716B]">→</span>
                      <div className="px-2 py-1 bg-white border border-[#1A1816]/20 rounded">h₂</div>
                      <span className="text-[#75716B]">→</span>
                      <div className="px-2 py-1 bg-white border border-[#1A1816]/20 rounded">h₃</div>
                      <span className="text-[#75716B]">→</span>
                      <div className="px-2 py-1 bg-[#DE5D35]/15 border border-[#DE5D35] text-[#DE5D35] font-bold rounded">hₙ</div>
                    </div>
                  </div>

                  {/* Transformer Highway */}
                  <div className="p-3 bg-[#DE5D35]/5 border border-[#DE5D35]/30 rounded">
                    <div className="text-[10px] font-mono text-[#DE5D35] mb-2 uppercase font-bold">Transformer Attention Highway (Constant O(1) path)</div>
                    <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px]">
                      {["x₁", "x₂", "x₃", "xₙ"].map((token, i) => (
                        <div key={i} className="p-2 bg-white border border-[#DE5D35]/40 text-[#1A1816] font-bold rounded shadow-xs">
                          {token}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-center text-[10px] font-mono text-[#DE5D35] font-semibold">
                      ↕ Global Pairwise Softmax Attention (Parallelized on GPUs)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Interactive Canonical Dual Tower Architecture */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / Canonical Blueprint
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Vaswani et al. Dual-Tower Architecture
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* SVG Blueprint */}
                <div className="flex justify-center p-4 bg-white border border-[#1A1816]/10 rounded">
                  <svg viewBox="0 0 420 540" className="w-full max-w-[340px] h-auto" style={{ fontFamily: "monospace" }}>
                    {/* ENCODER TOWER */}
                    <rect x="30" y="80" width="160" height="380" rx="4" fill="#FAF9F5" stroke="#1A1816" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="38" y="100" fill="#75716B" fontSize="10" fontWeight="bold">ENCODER (Nx = 6)</text>

                    {/* Feed Forward */}
                    <rect x="45" y="125" width="130" height="42" rx="3" fill="#008080" fillOpacity="0.15" stroke="#008080" strokeWidth="1.5" />
                    <text x="110" y="150" textAnchor="middle" fill="#008080" fontSize="11" fontWeight="bold">Feed Forward</text>

                    {/* Add & Norm 2 */}
                    <rect x="55" y="180" width="110" height="28" rx="2" fill="#DE5D35" fillOpacity="0.15" stroke="#DE5D35" strokeWidth="1.2" />
                    <text x="110" y="198" textAnchor="middle" fill="#DE5D35" fontSize="10" fontWeight="bold">Add & Norm</text>

                    {/* Multi-Head Self-Attention */}
                    <rect x="45" y="225" width="130" height="48" rx="3" fill="#F4A261" fillOpacity="0.2" stroke="#F4A261" strokeWidth="1.5" />
                    <text x="110" y="248" textAnchor="middle" fill="#B25E1A" fontSize="11" fontWeight="bold">Multi-Head</text>
                    <text x="110" y="262" textAnchor="middle" fill="#B25E1A" fontSize="10">Attention</text>

                    {/* Add & Norm 1 */}
                    <rect x="55" y="290" width="110" height="28" rx="2" fill="#DE5D35" fillOpacity="0.15" stroke="#DE5D35" strokeWidth="1.2" />
                    <text x="110" y="308" textAnchor="middle" fill="#DE5D35" fontSize="10" fontWeight="bold">Add & Norm</text>

                    {/* Input Positional Encoding */}
                    <circle cx="110" cy="380" r="14" fill="#FAF9F5" stroke="#1A1816" strokeWidth="1.2" />
                    <text x="110" y="384" textAnchor="middle" fill="#1A1816" fontSize="14" fontWeight="bold">+</text>
                    <rect x="45" y="415" width="130" height="32" rx="2" fill="#EFECE6" stroke="#1A1816" strokeWidth="1.2" />
                    <text x="110" y="435" textAnchor="middle" fill="#1A1816" fontSize="10" fontWeight="bold">Input Embedding</text>

                    {/* DECODER TOWER */}
                    <rect x="230" y="80" width="160" height="380" rx="4" fill="#FAF9F5" stroke="#1A1816" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="238" y="100" fill="#75716B" fontSize="10" fontWeight="bold">DECODER (Nx = 6)</text>

                    {/* Decoder Feed Forward */}
                    <rect x="245" y="125" width="130" height="42" rx="3" fill="#008080" fillOpacity="0.15" stroke="#008080" strokeWidth="1.5" />
                    <text x="310" y="150" textAnchor="middle" fill="#008080" fontSize="11" fontWeight="bold">Feed Forward</text>

                    {/* Add & Norm 3 */}
                    <rect x="255" y="180" width="110" height="28" rx="2" fill="#DE5D35" fillOpacity="0.15" stroke="#DE5D35" strokeWidth="1.2" />
                    <text x="310" y="198" textAnchor="middle" fill="#DE5D35" fontSize="10" fontWeight="bold">Add & Norm</text>

                    {/* Cross-Attention Bridge */}
                    <rect x="245" y="225" width="130" height="48" rx="3" fill="#E76F51" fillOpacity="0.25" stroke="#E76F51" strokeWidth="1.5" />
                    <text x="310" y="248" textAnchor="middle" fill="#A83218" fontSize="11" fontWeight="bold">Cross Attention</text>
                    <text x="310" y="262" textAnchor="middle" fill="#A83218" fontSize="10">(Q from Dec, K,V from Enc)</text>

                    {/* Masked Multi-Head Attention */}
                    <rect x="245" y="295" width="130" height="48" rx="3" fill="#E9C46A" fillOpacity="0.25" stroke="#E9C46A" strokeWidth="1.5" />
                    <text x="310" y="318" textAnchor="middle" fill="#8B6D1B" fontSize="11" fontWeight="bold">Masked Attention</text>
                    <text x="310" y="332" textAnchor="middle" fill="#8B6D1B" fontSize="10">Causal Lookahead</text>

                    {/* Cross Attention Bridge Line */}
                    <path d="M 110 120 L 110 110 L 220 110 L 220 249 L 245 249" fill="none" stroke="#DE5D35" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                </div>

                {/* Architecture Insights */}
                <div className="space-y-4 text-[13px] text-[#4A4742]">
                  <h3 className="font-mono text-[12px] font-bold text-[#DE5D35] uppercase tracking-wider">
                    Core Building Blocks
                  </h3>
                  <div className="p-3 bg-white border border-[#1A1816]/10 rounded">
                    <strong>1. Positional Encoding:</strong> Injects sequence order without recurrent loops using sinusoidal waves of varying frequencies.
                  </div>
                  <div className="p-3 bg-white border border-[#1A1816]/10 rounded">
                    <strong>2. Scaled Dot-Product:</strong> Scales the inner product of queries and keys by <MathTex math="1/\sqrt{d_k}" /> to prevent vanishing softmax gradients.
                  </div>
                  <div className="p-3 bg-white border border-[#1A1816]/10 rounded">
                    <strong>3. Multi-Head Projection:</strong> Projects <MathTex math="Q, K, V" /> into <MathTex math="h=8" /> distinct subspaces, allowing the model to jointly attend to semantic and syntactic roles.
                  </div>
                  <div className="p-3 bg-white border border-[#1A1816]/10 rounded">
                    <strong>4. Residual Connections:</strong> <MathTex math="x + \mathrm{Sublayer}(x)" /> ensures stable gradient flow across deep 6-to-96 layer stacks.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 03: Live Interactive Attention Simulator */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                03 / Live Interactive Simulator
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Coreference Attention Resolution
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px]">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                Click on the pronoun <strong>&ldquo;it&rdquo;</strong> below. Notice how Head 1 correctly resolves
                &ldquo;it&rdquo; to attend strongly (<strong>76%</strong>) to <strong>&ldquo;animal&rdquo;</strong>,
                while Head 2 captures the syntactic relation to <strong>&ldquo;street&rdquo;</strong>.
              </p>

              {/* Head Selector */}
              <div className="flex items-center gap-3 mb-6 font-mono text-[11px]">
                <span className="font-bold text-[#75716B] uppercase">SELECT HEAD:</span>
                <button
                  onClick={() => setActiveHead(1)}
                  className={`px-3 py-1.5 rounded border transition-all ${activeHead === 1 ? "bg-[#DE5D35] text-white border-[#DE5D35] font-bold" : "bg-white border-[#1A1816]/20 text-[#1A1816]"}`}
                >
                  Head 1 · Semantic Coreference (&rarr; animal)
                </button>
                <button
                  onClick={() => setActiveHead(2)}
                  className={`px-3 py-1.5 rounded border transition-all ${activeHead === 2 ? "bg-[#DE5D35] text-white border-[#DE5D35] font-bold" : "bg-white border-[#1A1816]/20 text-[#1A1816]"}`}
                >
                  Head 2 · Syntactic Boundary (&rarr; street)
                </button>
              </div>

              {/* Tokens Display */}
              <div className="flex flex-wrap gap-2 mb-8">
                {sentence.map((tok, i) => {
                  const isSelected = i === selectedTokenIdx;
                  const weight = weights[i];
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedTokenIdx(i)}
                      className={`relative px-3 py-2 rounded font-mono text-[13px] transition-all border ${
                        isSelected
                          ? "bg-[#1A1816] text-[#FAF9F5] border-[#1A1816] font-bold shadow-sm"
                          : "bg-white border-[#1A1816]/20 text-[#1A1816] hover:border-[#DE5D35]"
                      }`}
                    >
                      <span>{tok}</span>
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#DE5D35] rounded-b transition-all"
                        style={{ opacity: weight, transform: `scaleX(${weight})` }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Attention Weights Bar Chart */}
              <div className="p-4 bg-white border border-[#1A1816]/10 rounded">
                <div className="text-[11px] font-mono text-[#75716B] uppercase mb-3 flex justify-between">
                  <span>Attention Distribution for query: &ldquo;{sentence[selectedTokenIdx]}&rdquo;</span>
                  <span className="text-[#DE5D35] font-bold">Softmax Weights</span>
                </div>
                <div className="space-y-2">
                  {sentence.map((tok, i) => {
                    const w = weights[i];
                    return (
                      <div key={i} className="flex items-center gap-3 font-mono text-[12px]">
                        <span className="w-16 text-right font-medium text-[#1A1816]">{tok}:</span>
                        <div className="grow bg-[#EFECE6] h-4 rounded-xs overflow-hidden relative">
                          <div
                            className="h-full bg-[#DE5D35] transition-all duration-300"
                            style={{ width: `${w * 100}%` }}
                          />
                        </div>
                        <span className="w-12 text-right font-bold text-[#DE5D35]">
                          {(w * 100).toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Section 04: Autoregressive Decoder Step-by-Step */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                04 / Causal Generation
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Autoregressive Decoder & Causal Masking
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px]">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                During generation, tokens are predicted one-by-one. The causal lookahead mask sets all future
                attention logits to <MathTex math="-\infty" /> so the model cannot peek ahead into tokens it hasn&apos;t generated yet:
              </p>

              {/* Generation Stepper Controls */}
              <div className="flex items-center gap-2 mb-6">
                {genSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSimStep(idx)}
                    className={`px-4 py-2 font-mono text-[11px] font-bold rounded transition-all border ${
                      simStep === idx
                        ? "bg-[#DE5D35] text-white border-[#DE5D35]"
                        : "bg-white border-[#1A1816]/20 text-[#1A1816] hover:bg-[#FAF9F5]"
                    }`}
                  >
                    STEP {idx + 1}
                  </button>
                ))}
              </div>

              {/* Active Generation Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="p-4 bg-white border border-[#1A1816]/10 rounded">
                  <div className="text-[10px] font-mono text-[#75716B] uppercase mb-2">Context Window (Input Tokens)</div>
                  <div className="flex flex-wrap gap-2">
                    {genSteps[simStep].generated.map((tok, i) => (
                      <span key={i} className="px-3 py-1 bg-[#EFECE6] border border-[#1A1816]/15 font-mono text-[13px] rounded">
                        {tok}
                      </span>
                    ))}
                    <span className="px-3 py-1 bg-[#DE5D35]/15 border border-[#DE5D35] text-[#DE5D35] font-mono text-[13px] font-bold rounded animate-pulse">
                      ? &rarr; {genSteps[simStep].nextToken}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#1A1816]/10 rounded">
                  <div className="text-[10px] font-mono text-[#75716B] uppercase mb-2">Top Softmax Sampling Probabilities</div>
                  <div className="space-y-1.5 font-mono text-[12px]">
                    {genSteps[simStep].probs.map((p, i) => (
                      <div key={i} className="flex justify-between items-center py-0.5 border-b border-[#1A1816]/5">
                        <span className="font-semibold text-[#1A1816]">{p.word}</span>
                        <span className="text-[#DE5D35] font-bold">{p.p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Reference Citation */}
          <footer className="border-t border-[#1A1816]/15 pt-8 text-[13px] font-mono text-[#75716B]">
            <p className="mb-2">
              <strong>Primary Reference:</strong> Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., &amp; Polosukhin, I. (2017). <em>Attention Is All You Need</em>. Advances in Neural Information Processing Systems (NeurIPS 2017).
            </p>
            <p>AI Society — Bennett University Research Curriculum Archive.</p>
          </footer>
        </div>
      </main>
    </FoldLayout>
  );
}
