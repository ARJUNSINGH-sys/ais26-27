"use client";

import { useState, useMemo } from "react";
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

  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      className={block ? "block my-2" : "inline-block"}
    />
  );
}

export default function PrecisionRecallArticlePage() {
  const [threshold, setThreshold] = useState<number>(0.45);
  const [imbalanceRate, setImbalanceRate] = useState<number>(0.1); // 10% positive rare events

  const stats = useMemo(() => {
    const totalSamples = 1000;
    const nPos = Math.round(totalSamples * imbalanceRate);
    const nNeg = totalSamples - nPos;

    // Positive scores follow Beta(4, 2) ~ higher scores
    // Negative scores follow Beta(1.5, 4) ~ lower scores
    // Approximate count above threshold
    const tp = Math.round(nPos * Math.pow(1 - threshold, 0.7));
    const fn = nPos - tp;

    const fp = Math.round(nNeg * Math.pow(1 - threshold, 2.5));
    const tn = nNeg - fp;

    const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 =
      precision + recall > 0
        ? (2 * precision * recall) / (precision + recall)
        : 0;
    const accuracy = (tp + tn) / totalSamples;

    return {
      totalSamples,
      nPos,
      nNeg,
      tp,
      fp,
      fn,
      tn,
      precision,
      recall,
      f1,
      accuracy,
    };
  }, [threshold, imbalanceRate]);

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <div className="shell max-w-5xl">
          {/* Back to Articles & Breadcrumb */}
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
              <Link
                href="/resources"
                className="hover:text-[#1A1816] transition-colors"
              >
                03 / Resources
              </Link>
              <span>/</span>
              <span className="text-[#DE5D35] font-semibold">
                Evaluation · Confusion Matrix, Precision-Recall & F1
              </span>
            </div>
          </div>

          {/* Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 03
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              Precision, Recall & Confusion Matrix Optimization
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              Navigating severe class imbalance where baseline accuracy fails.
              Deconstruct the confusion matrix and analyze the harmonic balance
              between false alarms, missed detections, and F1 optimization.
            </p>
          </header>

          {/* Section 01: The Accuracy Paradox & Class Imbalance */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                01 / Rare Event Regime
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Accuracy Paradox Under Imbalance
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders & Explanation */}
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  In fraud detection, rare pathology, or cyber threats, positive
                  events occur in fewer than 5% of cases. A naive model
                  predicting &ldquo;all negative&rdquo; achieves 95% accuracy
                  while finding zero actual threats!
                </p>

                {/* Interactive Controls */}
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                      <span>POSITIVE EVENT BASE RATE</span>
                      <span className="font-bold text-[#DE5D35]">
                        {(imbalanceRate * 100).toFixed(0)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.01"
                      max="0.50"
                      step="0.01"
                      value={imbalanceRate}
                      onChange={(e) =>
                        setImbalanceRate(parseFloat(e.target.value))
                      }
                      className="w-full accent-[#DE5D35] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                      <span>DECISION THRESHOLD (τ)</span>
                      <span className="font-bold text-[#1A1816]">
                        {threshold.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="0.9"
                      step="0.02"
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className="w-full accent-[#1A1816] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[12px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#75716B]">OVERALL ACCURACY:</span>
                    <span className="font-bold text-[#1A1816]">
                      {(stats.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75716B]">HARMONIC F1 SCORE:</span>
                    <span className="font-bold text-[#DE5D35]">
                      {stats.f1.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Real-time Confusion Matrix */}
              <div className="lg:col-span-7 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <div className="flex items-center justify-between mb-4 text-[11px] font-mono text-[#75716B]">
                  <span>
                    DYNAMIC 2x2 CONFUSION MATRIX (N = {stats.totalSamples})
                  </span>
                  <span className="font-bold text-[#DE5D35]">
                    τ = {threshold.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* True Positive */}
                  <div className="p-4 border border-[#DE5D35] bg-[#DE5D35]/5">
                    <span className="block text-[11px] font-mono uppercase text-[#DE5D35] font-bold">
                      TRUE POSITIVE (TP)
                    </span>
                    <span className="text-[28px] font-black font-mono text-[#DE5D35]">
                      {stats.tp}
                    </span>
                    <span className="block text-[11px] text-[#75716B] mt-1">
                      Correctly caught rare events
                    </span>
                  </div>

                  {/* False Positive */}
                  <div className="p-4 border border-[#1A1816]/20 bg-white">
                    <span className="block text-[11px] font-mono uppercase text-[#EF4444] font-bold">
                      FALSE POSITIVE (FP)
                    </span>
                    <span className="text-[28px] font-black font-mono text-[#EF4444]">
                      {stats.fp}
                    </span>
                    <span className="block text-[11px] text-[#75716B] mt-1">
                      False alarms / spurious flags
                    </span>
                  </div>

                  {/* False Negative */}
                  <div className="p-4 border border-[#1A1816]/20 bg-white">
                    <span className="block text-[11px] font-mono uppercase text-[#EF4444] font-bold">
                      FALSE NEGATIVE (FN)
                    </span>
                    <span className="text-[28px] font-black font-mono text-[#EF4444]">
                      {stats.fn}
                    </span>
                    <span className="block text-[11px] text-[#75716B] mt-1">
                      Missed positive events (danger!)
                    </span>
                  </div>

                  {/* True Negative */}
                  <div className="p-4 border border-[#1A1816]/20 bg-white">
                    <span className="block text-[11px] font-mono uppercase text-[#1A1816] font-bold">
                      TRUE NEGATIVE (TN)
                    </span>
                    <span className="text-[28px] font-black font-mono text-[#1A1816]">
                      {stats.tn}
                    </span>
                    <span className="block text-[11px] text-[#75716B] mt-1">
                      Correct normal rejections
                    </span>
                  </div>
                </div>

                {/* Precision & Recall Readout */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 text-center">
                    <span className="block text-[11px] font-mono text-[#75716B]">
                      PRECISION (TP / (TP+FP))
                    </span>
                    <span className="text-[20px] font-bold text-[#DE5D35] font-mono">
                      {(stats.precision * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 text-center">
                    <span className="block text-[11px] font-mono text-[#75716B]">
                      RECALL (TP / (TP+FN))
                    </span>
                    <span className="text-[20px] font-bold text-[#1A1816] font-mono">
                      {(stats.recall * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: The Harmonic Mean (F1-Score) */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / Mathematical Formulation
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Why Harmonic Mean Instead of Arithmetic?
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[14px] text-[#4A4742] leading-[1.7]">
              <div className="space-y-4">
                <p>
                  The arithmetic mean of <MathTex math="100\%" /> precision and{" "}
                  <MathTex math="0\%" /> recall is <MathTex math="50\%" />,
                  concealing total failure. The harmonic mean heavily penalizes
                  extreme asymmetry:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    F1 Score Formulation
                  </span>
                  <MathTex
                    math="F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2\text{TP}}{2\text{TP} + \text{FP} + \text{FN}}"
                    block
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p>
                  When optimizing retrieval systems where false alarms cause
                  user fatigue but missed detections create critical liability,
                  the <MathTex math="F_\beta" /> score allows weighting recall{" "}
                  <MathTex math="\beta" /> times higher than precision:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    Generalized F-Beta Metric
                  </span>
                  <MathTex
                    math="F_\beta = (1 + \beta^2) \frac{\text{Precision} \cdot \text{Recall}}{(\beta^2 \cdot \text{Precision}) + \text{Recall}}"
                    block
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="border-t border-[#1A1816]/15 pt-8 flex items-center justify-between">
            <Link
              href="/resources/linear-regression"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
            >
              <span>← Topic 04: Linear Regression</span>
            </Link>
            <Link
              href="/resources/cross-validation"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#DE5D35] font-bold hover:underline"
            >
              <span>Topic 06: Cross-Validation →</span>
            </Link>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
