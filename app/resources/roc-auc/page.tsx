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

export default function RocAucArticlePage() {
  // Interactive Threshold: tau from 0 to 1
  const [threshold, setThreshold] = useState<number>(0.5);
  // Separation distance between negative (class 0) and positive (class 1)
  const [separation, setSeparation] = useState<number>(1.8);

  // Synthetic distribution parameters
  // Negative class: N(0, 1)
  // Positive class: N(separation, 1)
  // Normalized to display space [0, 100]
  const simData = useMemo(() => {
    // We compute TP, FP, TN, FN for a sample of 200 points (100 negative, 100 positive)
    const negMean = 35;
    const posMean = 35 + separation * 18;
    const std = 14;

    // Numerical integration of normal PDF
    const normalPdf = (x: number, mean: number, s: number) => {
      return (
        (1 / (s * Math.sqrt(2 * Math.PI))) *
        Math.exp(-0.5 * Math.pow((x - mean) / s, 2))
      );
    };

    const tauX = threshold * 100;

    // Approximate TPR and FPR by integrating from tauX to 100
    let tpSum = 0;
    let fpSum = 0;
    let tnSum = 0;
    let fnSum = 0;
    const steps = 200;
    const dx = 100 / steps;

    for (let i = 0; i < steps; i++) {
      const x = i * dx;
      const pPos = normalPdf(x, posMean, std);
      const pNeg = normalPdf(x, negMean, std);

      if (x >= tauX) {
        tpSum += pPos * dx;
        fpSum += pNeg * dx;
      } else {
        fnSum += pPos * dx;
        tnSum += pNeg * dx;
      }
    }

    const totalPos = tpSum + fnSum || 1;
    const totalNeg = fpSum + tnSum || 1;

    const tpr = Math.min(1, Math.max(0, tpSum / totalPos));
    const fpr = Math.min(1, Math.max(0, fpSum / totalNeg));

    // Construct the full ROC curve points for this separation
    const curvePoints: { fpr: number; tpr: number }[] = [];
    for (let t = 0; t <= 100; t += 2) {
      let curTp = 0;
      let curFp = 0;
      for (let i = 0; i < steps; i++) {
        const x = i * dx;
        if (x >= t) {
          curTp += normalPdf(x, posMean, std) * dx;
          curFp += normalPdf(x, negMean, std) * dx;
        }
      }
      curvePoints.push({
        fpr: Math.min(1, Math.max(0, curFp / totalNeg)),
        tpr: Math.min(1, Math.max(0, curTp / totalPos)),
      });
    }

    // Trapezoidal AUC estimation
    let auc = 0;
    for (let i = 0; i < curvePoints.length - 1; i++) {
      const p1 = curvePoints[i];
      const p2 = curvePoints[i + 1];
      const width = Math.abs(p1.fpr - p2.fpr);
      const avgHeight = (p1.tpr + p2.tpr) / 2;
      auc += width * avgHeight;
    }

    return {
      tpr,
      fpr,
      auc: Math.min(0.999, Math.max(0.5, auc)),
      curvePoints,
      tauX,
      posMean,
      negMean,
    };
  }, [threshold, separation]);

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
                Evaluation · ROC & AUC
              </span>
            </div>
          </div>

          {/* Article Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 04
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              ROC & AUC: Diagnostic Power
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              Mapping the sensitivity versus specificity tradeoff across
              continuous decision thresholds with live probability density
              functions and confusion matrix projections.
            </p>
          </header>

          {/* Section 01: Probability Densities & Operating Threshold */}
          <section className="mb-16">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                  01 / Continuous Score Densities
                </span>
                <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                  Thresholding Class Distributions
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left explanation */}
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  A binary classifier produces continuous risk scores or
                  posterior probabilities <MathTex math="S(x) \in [0, 1]" />. To
                  assign a discrete category (
                  <MathTex math="\hat{y} \in \{0, 1\}" />
                  ), we apply a decision threshold <MathTex math="\tau" />:
                </p>
                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[13px]">
                  <MathTex
                    math="\hat{y} = \begin{cases} 1 & \text{if } S(x) \ge \tau \\ 0 & \text{if } S(x) < \tau \end{cases}"
                    block
                  />
                </div>
                <p>
                  Moving <MathTex math="\tau" /> left captures more positive
                  instances (higher Sensitivity) at the cost of admitting false
                  alarms. Moving <MathTex math="\tau" /> right reduces false
                  alarms but causes false negatives.
                </p>

                {/* Sliders */}
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                      <span>THRESHOLD (τ)</span>
                      <span className="font-bold text-[#DE5D35]">
                        {threshold.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.95"
                      step="0.01"
                      value={threshold}
                      onChange={(e) => setThreshold(parseFloat(e.target.value))}
                      className="w-full accent-[#DE5D35] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                      <span>DISTRIBUTION SEPARATION (d&apos;)</span>
                      <span className="font-bold text-[#1A1816]">
                        {separation.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3.0"
                      step="0.1"
                      value={separation}
                      onChange={(e) =>
                        setSeparation(parseFloat(e.target.value))
                      }
                      className="w-full accent-[#1A1816] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Right: SVG Density Chart */}
              <div className="lg:col-span-7 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#75716B]">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1A1816]" />
                      <span>Class 0 (Negative)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#DE5D35]" />
                      <span>Class 1 (Positive)</span>
                    </span>
                  </div>
                  <span className="font-semibold text-[#DE5D35]">
                    τ = {threshold.toFixed(2)}
                  </span>
                </div>

                <div className="relative bg-[#EBF5FB]/30 border border-[#1A1816]/10 p-2 rounded-[2px] h-64 flex items-end">
                  <svg
                    viewBox="0 0 400 200"
                    className="w-full h-full overflow-visible select-none"
                  >
                    {/* Grid lines */}
                    <line
                      x1="0"
                      y1="180"
                      x2="400"
                      y2="180"
                      stroke="#1A1816"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1="20"
                      x2="0"
                      y2="180"
                      stroke="#1A1816"
                      strokeWidth="1"
                    />

                    {/* Negative Gaussian Curve */}
                    <path
                      d={`M 10 180 Q ${simData.negMean * 4} 20, ${(simData.negMean + 25) * 4} 180`}
                      fill="rgba(26,24,22,0.06)"
                      stroke="#1A1816"
                      strokeWidth="2"
                    />

                    {/* Positive Gaussian Curve */}
                    <path
                      d={`M ${(simData.posMean - 25) * 4} 180 Q ${simData.posMean * 4} 20, ${(simData.posMean + 25) * 4} 180`}
                      fill="rgba(222,93,53,0.12)"
                      stroke="#DE5D35"
                      strokeWidth="2"
                    />

                    {/* Threshold vertical line */}
                    <line
                      x1={simData.tauX * 4}
                      y1="10"
                      x2={simData.tauX * 4}
                      y2="185"
                      stroke="#DE5D35"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                    <polygon
                      points={`${simData.tauX * 4 - 5},10 ${simData.tauX * 4 + 5},10 ${simData.tauX * 4},18`}
                      fill="#DE5D35"
                    />
                    <text
                      x={simData.tauX * 4}
                      y="8"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fill="#DE5D35"
                      fontWeight="bold"
                    >
                      τ = {threshold.toFixed(2)}
                    </text>

                    {/* Axis Labels */}
                    <text
                      x="200"
                      y="196"
                      fontSize="10"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fill="#75716B"
                    >
                      Classifier Score S(x) →
                    </text>
                  </svg>
                </div>

                {/* Metric Readout Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="p-2.5 bg-[#FAF9F5] border border-[#1A1816]/15 text-center">
                    <span className="block text-[10px] font-mono text-[#75716B]">
                      TRUE POSITIVE RATE
                    </span>
                    <span className="text-[18px] font-bold text-[#DE5D35] font-mono">
                      {(simData.tpr * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#FAF9F5] border border-[#1A1816]/15 text-center">
                    <span className="block text-[10px] font-mono text-[#75716B]">
                      FALSE POSITIVE RATE
                    </span>
                    <span className="text-[18px] font-bold text-[#1A1816] font-mono">
                      {(simData.fpr * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#FAF9F5] border border-[#1A1816]/15 text-center">
                    <span className="block text-[10px] font-mono text-[#75716B]">
                      SPECIFICITY (1-FPR)
                    </span>
                    <span className="text-[18px] font-bold text-[#1A1816] font-mono">
                      {((1 - simData.fpr) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="p-2.5 bg-[#FAF9F5] border border-[#1A1816]/15 text-center">
                    <span className="block text-[10px] font-mono text-[#75716B]">
                      AREA UNDER CURVE
                    </span>
                    <span className="text-[18px] font-bold text-[#DE5D35] font-mono">
                      {simData.auc.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Interactive ROC Curve */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / Parametric Space
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Receiver Operating Characteristic (ROC)
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Graph */}
              <div className="lg:col-span-7 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <div className="relative aspect-square max-w-[420px] mx-auto bg-[#F4F1EA] border border-[#1A1816]/15 p-4 rounded-[2px]">
                  <svg
                    viewBox="0 0 300 300"
                    className="w-full h-full overflow-visible select-none"
                  >
                    {/* Background Grid */}
                    <line
                      x1="30"
                      y1="270"
                      x2="270"
                      y2="270"
                      stroke="#1A1816"
                      strokeWidth="1.2"
                    />
                    <line
                      x1="30"
                      y1="30"
                      x2="30"
                      y2="270"
                      stroke="#1A1816"
                      strokeWidth="1.2"
                    />

                    {/* Diagonal baseline (chance classifier, AUC = 0.5) */}
                    <line
                      x1="30"
                      y1="270"
                      x2="270"
                      y2="30"
                      stroke="#75716B"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />

                    {/* ROC Curve Path */}
                    {simData.curvePoints.length > 1 && (
                      <path
                        d={`M 30 270 ${simData.curvePoints
                          .map(
                            (p) => `L ${30 + p.fpr * 240} ${270 - p.tpr * 240}`,
                          )
                          .join(" ")} L 270 30`}
                        fill="rgba(222,93,53,0.08)"
                        stroke="#DE5D35"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Current operating threshold dot */}
                    <circle
                      cx={30 + simData.fpr * 240}
                      cy={270 - simData.tpr * 240}
                      r="6"
                      fill="#DE5D35"
                      stroke="#FAF9F5"
                      strokeWidth="2"
                    />

                    {/* Operating coordinates callout */}
                    <text
                      x={Math.min(240, Math.max(50, 30 + simData.fpr * 240))}
                      y={Math.max(45, 270 - simData.tpr * 240 - 12)}
                      fill="#1A1816"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      (FPR: {(simData.fpr * 100).toFixed(0)}%, TPR:{" "}
                      {(simData.tpr * 100).toFixed(0)}%)
                    </text>

                    {/* Axis labels */}
                    <text
                      x="150"
                      y="295"
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fill="#1A1816"
                    >
                      False Positive Rate (1 - Specificity) →
                    </text>
                    <text
                      x="-150"
                      y="14"
                      fontSize="11"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fill="#1A1816"
                      transform="rotate(-90)"
                    >
                      True Positive Rate (Sensitivity) →
                    </text>
                  </svg>
                </div>
              </div>

              {/* Right text & Math */}
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  The ROC curve plots <MathTex math="\text{TPR}" /> against{" "}
                  <MathTex math="\text{FPR}" /> across every continuous choice
                  of threshold <MathTex math="\tau \in [0, 1]" />.
                </p>

                <div className="space-y-2">
                  <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15">
                    <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-1">
                      Area Under Curve (AUC)
                    </span>
                    <MathTex
                      math="\text{AUC} = \int_{0}^{1} \text{TPR}(\tau) \, d\text{FPR}(\tau) = P(S(X^+) > S(X^-))"
                      block
                    />
                  </div>
                </div>

                <p>
                  <strong>Probabilistic Interpretation:</strong> The AUC
                  precisely equals the probability that the classifier ranks a
                  randomly chosen positive observation higher than a randomly
                  chosen negative one.
                </p>
                <p>
                  Notice how increasing the distribution separation{" "}
                  <MathTex math="d'" /> pushes the curve toward the upper-left
                  corner <MathTex math="(0, 1)" />, driving{" "}
                  <MathTex math="\text{AUC} \to 1.0" />.
                </p>
              </div>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="border-t border-[#1A1816]/15 pt-8 flex items-center justify-between">
            <Link
              href="/resources/neural-networks"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
            >
              <span>← Topic 01: Neural Networks</span>
            </Link>
            <Link
              href="/resources/logistic-regression"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#DE5D35] font-bold hover:underline"
            >
              <span>Topic 03: Logistic Regression →</span>
            </Link>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
