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

  return <span dangerouslySetInnerHTML={{ __html: html }} className={block ? "block my-2" : "inline-block"} />;
}

export default function LogisticRegressionArticlePage() {
  const [weight, setWeight] = useState<number>(1.2);
  const [bias, setBias] = useState<number>(-2.4);

  // Synthetic 1D data points for logistic classification
  const dataPoints = [
    { x: -4, y: 0 },
    { x: -3, y: 0 },
    { x: -2, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 5, y: 1 },
  ];

  // Compute sigmoid probabilities and cross entropy loss
  const stats = useMemo(() => {
    const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
    let totalLoss = 0;

    const predictions = dataPoints.map((pt) => {
      const z = weight * pt.x + bias;
      const prob = sigmoid(z);
      // Binary cross-entropy
      const eps = 1e-6;
      const loss = -(pt.y * Math.log(prob + eps) + (1 - pt.y) * Math.log(1 - prob + eps));
      totalLoss += loss;
      return { ...pt, prob };
    });

    const bceLoss = totalLoss / dataPoints.length;
    // Decision boundary occurs where z = 0 => x = -bias / weight
    const boundaryX = weight !== 0 ? -bias / weight : 0;

    return {
      bceLoss,
      boundaryX,
      predictions,
    };
  }, [weight, bias]);

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <div className="shell max-w-5xl">
          {/* Top Breadcrumb */}
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.16em] uppercase text-[#75716B] mb-8">
            <Link href="/resources" className="hover:text-[#1A1816] transition-colors">
              03 / Resources
            </Link>
            <span>/</span>
            <span className="text-[#DE5D35] font-semibold">Classification · Logistic Regression</span>
          </div>

          {/* Article Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 03
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              Logistic Regression & The Sigmoid Curve
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              Projecting linear combinations onto calibrated probability bounds <MathTex math="[0, 1]" />. Exploring log-odds, decision boundaries, and binary cross-entropy loss.
            </p>
          </header>

          {/* Section 01: The Sigmoidal Transformation */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">01 / Probability Formulation</span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">The Sigmoidal Probability Curve</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left text & sliders */}
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  Linear regression cannot directly predict probabilities because linear functions <MathTex math="w \cdot x + b" /> produce unbounded outputs in <MathTex math="(-\infty, \infty)" />.
                </p>
                <p>
                  Logistic regression maps the unbounded linear score through the standard logistic (sigmoid) function <MathTex math="\sigma(z)" />:
                </p>
                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[13px]">
                  <MathTex math="P(Y=1|x) = \sigma(w x + b) = \frac{1}{1 + e^{-(w x + b)}}" block />
                </div>

                {/* Sliders */}
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                      <span>WEIGHT (w) · SLOPE SHARPNESS</span>
                      <span className="font-bold text-[#DE5D35]">{weight.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.05"
                      value={weight}
                      onChange={(e) => setWeight(parseFloat(e.target.value))}
                      className="w-full accent-[#DE5D35] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                      <span>BIAS (b) · HORIZONTAL SHIFT</span>
                      <span className="font-bold text-[#1A1816]">{bias.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="-5.0"
                      max="5.0"
                      step="0.1"
                      value={bias}
                      onChange={(e) => setBias(parseFloat(e.target.value))}
                      className="w-full accent-[#1A1816] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 text-[12px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#75716B]">DECISION BOUNDARY (z=0):</span>
                    <span className="font-bold text-[#DE5D35]">x = {stats.boundaryX.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75716B]">LOG LOSS (BCE):</span>
                    <span className="font-bold text-[#1A1816]">{stats.bceLoss.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Right: SVG Interactive Sigmoid Curve */}
              <div className="lg:col-span-7 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#75716B]">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1A1816]" />
                      <span>Class 0 (y=0)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#DE5D35]" />
                      <span>Class 1 (y=1)</span>
                    </span>
                  </div>
                  <span className="font-semibold text-[#DE5D35]">P(y=1|x)</span>
                </div>

                <div className="relative bg-[#EBF5FB]/30 border border-[#1A1816]/10 p-2 rounded-[2px] h-72 flex items-end">
                  <svg viewBox="-60 -10 120 120" className="w-full h-full overflow-visible select-none">
                    {/* Axes */}
                    <line x1="-55" y1="100" x2="55" y2="100" stroke="#1A1816" strokeWidth="0.8" />
                    <line x1="-55" y1="0" x2="55" y2="0" stroke="#1A1816" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="-55" y1="50" x2="55" y2="50" stroke="#75716B" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="0" x2="0" y2="100" stroke="#1A1816" strokeWidth="0.8" />

                    {/* Probability labels */}
                    <text x="-58" y="3" fontSize="4" fontFamily="monospace" textAnchor="end" fill="#75716B">1.0</text>
                    <text x="-58" y="52" fontSize="4" fontFamily="monospace" textAnchor="end" fill="#DE5D35">0.5</text>
                    <text x="-58" y="102" fontSize="4" fontFamily="monospace" textAnchor="end" fill="#75716B">0.0</text>

                    {/* Decision Boundary Line */}
                    {stats.boundaryX >= -5 && stats.boundaryX <= 5 && (
                      <g>
                        <line
                          x1={stats.boundaryX * 10}
                          y1="0"
                          x2={stats.boundaryX * 10}
                          y2="100"
                          stroke="#DE5D35"
                          strokeWidth="0.8"
                          strokeDasharray="2 2"
                        />
                        <text
                          x={stats.boundaryX * 10}
                          y="-3"
                          fontSize="4"
                          fontFamily="monospace"
                          textAnchor="middle"
                          fill="#DE5D35"
                          fontWeight="bold"
                        >
                          x* = {stats.boundaryX.toFixed(1)}
                        </text>
                      </g>
                    )}

                    {/* Sigmoid Continuous Curve */}
                    <path
                      d={Array.from({ length: 110 }, (_, i) => {
                        const xVal = -5.5 + i * 0.1;
                        const z = weight * xVal + bias;
                        const p = 1 / (1 + Math.exp(-z));
                        const svgX = xVal * 10;
                        const svgY = 100 - p * 100;
                        return `${i === 0 ? "M" : "L"} ${svgX} ${svgY}`;
                      }).join(" ")}
                      fill="none"
                      stroke="#DE5D35"
                      strokeWidth="1.6"
                    />

                    {/* Observed Data Points */}
                    {dataPoints.map((pt, idx) => {
                      const svgX = pt.x * 10;
                      const svgY = pt.y === 1 ? 0 : 100;
                      return (
                        <circle
                          key={idx}
                          cx={svgX}
                          cy={svgY}
                          r="2"
                          fill={pt.y === 1 ? "#DE5D35" : "#1A1816"}
                          stroke="#FAF9F5"
                          strokeWidth="0.6"
                        />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02: Maximum Likelihood & Cross-Entropy Loss */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">02 / Optimization</span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">Maximum Likelihood & Binary Cross-Entropy</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[14px] text-[#4A4742] leading-[1.7]">
              <div className="space-y-4">
                <p>
                  To find optimal weights <MathTex math="w^*" /> and bias <MathTex math="b^*" />, we maximize the log-likelihood of our dataset, equivalent to minimizing binary cross-entropy loss:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">Cross-Entropy Loss Formulation</span>
                  <MathTex math="\mathcal{L}(w, b) = -\frac{1}{N} \sum_{i=1}^N \left[ y_i \ln(\hat{y}_i) + (1 - y_i) \ln(1 - \hat{y}_i) \right]" block />
                </div>
              </div>

              <div className="space-y-4">
                <p>
                  Because this loss function is strictly convex, gradient descent is guaranteed to reach the global minimum without getting stuck in local suboptimal traps.
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">Log-Odds (Logit) Form</span>
                  <MathTex math="\ln \left( \frac{p}{1 - p} \right) = w \cdot x + b" block />
                  <p className="text-[12px] text-[#75716B] mt-2">
                    Notice the log-odds ratio is linear in <MathTex math="x" />! That is why the decision boundary remains planar in multi-dimensional space.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="border-t border-[#1A1816]/15 pt-8 flex items-center justify-between">
            <Link
              href="/resources/roc-auc"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
            >
              <span>← Topic 02: ROC & AUC</span>
            </Link>
            <Link
              href="/resources/linear-regression"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#DE5D35] font-bold hover:underline"
            >
              <span>Topic 04: Linear Regression →</span>
            </Link>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
