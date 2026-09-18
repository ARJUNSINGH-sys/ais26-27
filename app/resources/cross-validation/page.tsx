"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import FoldLayout from "@/components/FoldLayout";
import katex from "katex";

function MathTex({ math, block = false }: { math: string; block?: boolean }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return math;
    }
  }, [math, block]);

  return <span dangerouslySetInnerHTML={{ __html: html }} className={block ? "block my-2" : "inline-block"} />;
}

export default function CrossValidationArticlePage() {
  const [kFolds, setKFolds] = useState<number>(5);
  const [activeIteration, setActiveIteration] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Generate synthetic validation error scores for each fold
  const foldScores = useMemo(() => {
    // Deterministic pseudo scores depending on k
    const baseErrors: Record<number, number[]> = {
      3: [0.142, 0.168, 0.155],
      5: [0.138, 0.152, 0.141, 0.160, 0.147],
      10: [0.135, 0.142, 0.158, 0.139, 0.146, 0.151, 0.163, 0.140, 0.148, 0.155],
    };
    return baseErrors[kFolds] || baseErrors[5];
  }, [kFolds]);

  const stats = useMemo(() => {
    const mean = foldScores.reduce((acc, s) => acc + s, 0) / foldScores.length;
    const variance =
      foldScores.reduce((acc, s) => acc + Math.pow(s - mean, 2), 0) / (foldScores.length - 1);
    const stdErr = Math.sqrt(variance / foldScores.length);

    return {
      mean,
      stdErr,
    };
  }, [foldScores]);

  // Auto playback effect
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIteration((prev) => (prev + 1) % kFolds);
    }, 1400);
    return () => clearInterval(interval);
  }, [isAutoPlaying, kFolds]);

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <div className="shell max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.16em] uppercase text-[#75716B] mb-8">
            <Link href="/resources" className="hover:text-[#1A1816] transition-colors">
              03 / Resources
            </Link>
            <span>/</span>
            <span className="text-[#DE5D35] font-semibold">Validation · Cross-Validation</span>
          </div>

          {/* Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 06
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              K-Fold Partitioning & Generalization
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              Mitigating sample bias and estimating performance variance through rotational holdout splits, out-of-fold validation, and standard error bounds.
            </p>
          </header>

          {/* Section 01: Interactive Partition Matrix */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">01 / Resampling Strategy</span>
                <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">Rotational Train-Validation Splits</h2>
              </div>

              {/* Fold Selectors */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#75716B] mr-2">FOLDS (K):</span>
                {[3, 5, 10].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      setKFolds(k);
                      setActiveIteration(0);
                    }}
                    className={`px-3 py-1 text-[12px] font-mono border transition-colors cursor-pointer ${
                      kFolds === k
                        ? "bg-[#1A1816] text-[#EFECE6] border-[#1A1816] font-bold"
                        : "bg-[#FAF9F5] text-[#1A1816] border-[#1A1816]/20 hover:border-[#1A1816]"
                    }`}
                  >
                    K={k}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Controls and Math */}
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  A simple train/test split suffers from sample variance: lucky splits overestimate generalization, while unlucky splits underestimate it.
                </p>
                <p>
                  <MathTex math="K" />-Fold Cross-Validation partitions the full dataset into <MathTex math="K" /> equal-sized subsets. In each round <MathTex math="k" />, one fold is held out for validation while the remaining <MathTex math="K-1" /> folds train the model.
                </p>

                {/* Animation / Step Controls */}
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-[#75716B]">ACTIVE ITERATION:</span>
                    <span className="text-[13px] font-mono font-bold text-[#DE5D35]">
                      ROUND {activeIteration + 1} OF {kFolds}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveIteration((prev) => (prev + 1) % kFolds)}
                      className="flex-1 py-2 bg-[#FAF9F5] border border-[#1A1816]/20 text-[11px] font-mono hover:border-[#1A1816] transition-colors cursor-pointer"
                    >
                      Step to Next Fold →
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className={`px-4 py-2 border text-[11px] font-mono transition-colors cursor-pointer ${
                        isAutoPlaying
                          ? "bg-[#DE5D35] text-white border-[#DE5D35]"
                          : "bg-[#1A1816] text-[#EFECE6] border-[#1A1816]"
                      }`}
                    >
                      {isAutoPlaying ? "Pause Loop" : "Auto-Cycle"}
                    </button>
                  </div>
                </div>

                {/* Aggregate Metrics */}
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[12px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#75716B]">MEAN CV ERROR:</span>
                    <span className="font-bold text-[#DE5D35]">{(stats.mean * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75716B]">STANDARD ERROR (SE):</span>
                    <span className="font-bold text-[#1A1816]">±{(stats.stdErr * 100).toFixed(3)}%</span>
                  </div>
                </div>
              </div>

              {/* Right: Visual Matrix Grid */}
              <div className="lg:col-span-7 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <div className="flex items-center justify-between mb-4 text-[11px] font-mono text-[#75716B]">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-[#EAE7DF] border border-[#1A1816]/20" />
                      <span>Train Folds ({kFolds - 1})</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-3 h-3 bg-[#DE5D35]" />
                      <span>Validation Holdout (1)</span>
                    </span>
                  </div>
                  <span className="font-semibold text-[#DE5D35]">Fold {activeIteration + 1}</span>
                </div>

                {/* Iteration Rows */}
                <div className="space-y-2.5">
                  {Array.from({ length: kFolds }, (_, iterIdx) => {
                    const isCurrent = iterIdx === activeIteration;
                    return (
                      <div
                        key={iterIdx}
                        onClick={() => setActiveIteration(iterIdx)}
                        className={`p-2.5 border transition-all cursor-pointer ${
                          isCurrent
                            ? "border-[#DE5D35] bg-[#DE5D35]/5 ring-1 ring-[#DE5D35]"
                            : "border-[#1A1816]/15 bg-white opacity-85 hover:opacity-100"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                          <span className={isCurrent ? "font-bold text-[#DE5D35]" : "text-[#75716B]"}>
                            SPLIT #{iterIdx + 1}
                          </span>
                          <span className="font-mono text-[11px]">
                            Holdout Loss: {(foldScores[iterIdx] * 100).toFixed(1)}%
                          </span>
                        </div>

                        {/* Folds Strip */}
                        <div className="flex gap-1 h-6">
                          {Array.from({ length: kFolds }, (_, foldIdx) => {
                            const isHoldout = foldIdx === iterIdx;
                            return (
                              <div
                                key={foldIdx}
                                className={`flex-1 flex items-center justify-center text-[10px] font-mono rounded-[1px] transition-colors ${
                                  isHoldout
                                    ? "bg-[#DE5D35] text-white font-bold"
                                    : "bg-[#EAE7DF] text-[#75716B]"
                                }`}
                              >
                                {isHoldout ? "VAL" : `F${foldIdx + 1}`}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Formulation */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">02 / Mathematical Bounds</span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">The K-Fold Risk Estimator</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[14px] text-[#4A4742] leading-[1.7]">
              <div className="space-y-4">
                <p>
                  The overall cross-validation generalization score aggregates the out-of-fold validation loss across all <MathTex math="K" /> splits:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">CV Error Aggregation</span>
                  <MathTex math="\text{CV}_{(K)} = \frac{1}{K} \sum_{k=1}^K \mathcal{L}_k = \frac{1}{K} \sum_{k=1}^K \left( \frac{1}{N_k} \sum_{i \in \mathcal{C}_k} \ell(y_i, \hat{f}^{(-k)}(x_i)) \right)" block />
                </div>
              </div>

              <div className="space-y-4">
                <p>
                  <strong>The One-Standard-Error Rule:</strong> When performing model selection or hyperparameter tuning, practitioners often select the simplest model whose error lies within one standard error of the minimum:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">1-SE Selection Boundary</span>
                  <MathTex math="\text{Error}_{\text{candidate}} \le \text{Error}_{\text{best}} + \text{SE}(\text{Error}_{\text{best}})" block />
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="border-t border-[#1A1816]/15 pt-8 flex items-center justify-between">
            <Link
              href="/resources/precision-recall"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
            >
              <span>← Topic 05: Precision-Recall & F1</span>
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#DE5D35] font-bold hover:underline"
            >
              <span>Back to Archive Index (03) →</span>
            </Link>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
