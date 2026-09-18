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

export default function LinearRegressionArticlePage() {
  const [slope, setSlope] = useState<number>(0.8);
  const [intercept, setIntercept] = useState<number>(15);

  // Observed points
  const points = useMemo(
    () => [
      { x: 10, y: 22 },
      { x: 20, y: 38 },
      { x: 30, y: 32 },
      { x: 40, y: 55 },
      { x: 50, y: 62 },
      { x: 60, y: 58 },
      { x: 70, y: 79 },
      { x: 80, y: 84 },
      { x: 90, y: 92 },
    ],
    [],
  );

  // Compute analytical optimal OLS solution
  const optimalOLS = useMemo(() => {
    const n = points.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    points.forEach((p) => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
    });

    const mOpt = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const cOpt = (sumY - mOpt * sumX) / n;

    return { mOpt, cOpt };
  }, [points]);

  // Compute residuals and MSE
  const metrics = useMemo(() => {
    let sumSqError = 0;
    const residuals = points.map((p) => {
      const yPred = slope * p.x + intercept;
      const error = p.y - yPred;
      sumSqError += error * error;
      return {
        ...p,
        yPred,
        error,
      };
    });

    const mse = sumSqError / points.length;
    const rSquared = 1 - sumSqError / 4680; // baseline total variance ~ 4680

    return {
      residuals,
      mse,
      rSquared: Math.max(0, Math.min(1, rSquared)),
    };
  }, [slope, intercept, points]);

  const handleSnapToOptimal = () => {
    setSlope(parseFloat(optimalOLS.mOpt.toFixed(3)));
    setIntercept(parseFloat(optimalOLS.cOpt.toFixed(2)));
  };

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
                Regression · Linear Regression
              </span>
            </div>
          </div>

          {/* Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 01
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              Linear Regression: Ordinary Least Squares
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              Minimizing orthogonal Euclidean residuals in continuous parameter
              space. Compare closed-form normal equations with iterative
              gradient optimization.
            </p>
          </header>

          {/* Section 01: The Interactive Residual Sandbox */}
          <section className="mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                  01 / Residual Geometry
                </span>
                <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                  Sum of Squared Errors (SSE)
                </h2>
              </div>
              <button
                type="button"
                onClick={handleSnapToOptimal}
                className="px-3.5 py-1.5 bg-[#DE5D35] text-white text-[11px] font-mono tracking-wider uppercase font-bold hover:bg-[#c94d27] transition-colors cursor-pointer self-start sm:self-auto"
              >
                Snap to Analytical OLS Solution
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sliders & Math */}
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  Linear regression fits a straight line{" "}
                  <MathTex math="\hat{y} = m x + c" /> by minimizing the
                  vertical distance (residual{" "}
                  <MathTex math="e_i = y_i - \hat{y}_i" />) between points and
                  the hypothesis line:
                </p>

                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[13px]">
                  <MathTex
                    math="\text{MSE}(m, c) = \frac{1}{N} \sum_{i=1}^N \left( y_i - (m x_i + c) \right)^2"
                    block
                  />
                </div>

                {/* Sliders */}
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                      <span>SLOPE (m)</span>
                      <span className="font-bold text-[#DE5D35]">
                        {slope.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.8"
                      step="0.02"
                      value={slope}
                      onChange={(e) => setSlope(parseFloat(e.target.value))}
                      className="w-full accent-[#DE5D35] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                      <span>INTERCEPT (c)</span>
                      <span className="font-bold text-[#1A1816]">
                        {intercept.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="40"
                      step="0.5"
                      value={intercept}
                      onChange={(e) => setIntercept(parseFloat(e.target.value))}
                      className="w-full accent-[#1A1816] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Error Readout */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15">
                    <span className="block text-[10px] font-mono text-[#75716B]">
                      MEAN SQUARED ERROR
                    </span>
                    <span className="text-[18px] font-mono font-bold text-[#DE5D35]">
                      {metrics.mse.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15">
                    <span className="block text-[10px] font-mono text-[#75716B]">
                      COEFFICIENT R²
                    </span>
                    <span className="text-[18px] font-mono font-bold text-[#1A1816]">
                      {metrics.rSquared.toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: SVG Scatter & Residuals Canvas */}
              <div className="lg:col-span-7 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#75716B]">
                  <span>RESIDUAL RESIDUES (VERTICAL DISTANCES)</span>
                  <span className="font-bold text-[#DE5D35]">
                    ŷ = {slope.toFixed(2)}x + {intercept.toFixed(1)}
                  </span>
                </div>

                <div className="relative bg-[#EBF5FB]/30 border border-[#1A1816]/10 p-2 rounded-[2px] h-72 flex items-end">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full overflow-visible select-none"
                  >
                    {/* Grid */}
                    <line
                      x1="5"
                      y1="95"
                      x2="95"
                      y2="95"
                      stroke="#1A1816"
                      strokeWidth="0.6"
                    />
                    <line
                      x1="5"
                      y1="5"
                      x2="5"
                      y2="95"
                      stroke="#1A1816"
                      strokeWidth="0.6"
                    />

                    {/* Residual lines from points to line */}
                    {metrics.residuals.map((r, idx) => {
                      const svgX = r.x;
                      const svgYActual = 100 - r.y;
                      const svgYPred = 100 - r.yPred;
                      return (
                        <line
                          key={idx}
                          x1={svgX}
                          y1={svgYActual}
                          x2={svgX}
                          y2={svgYPred}
                          stroke="#EF4444"
                          strokeWidth="0.8"
                          strokeDasharray="1.5 1.5"
                        />
                      );
                    })}

                    {/* Hypothesis Regression Line */}
                    <line
                      x1="5"
                      y1={100 - (slope * 5 + intercept)}
                      x2="95"
                      y2={100 - (slope * 95 + intercept)}
                      stroke="#DE5D35"
                      strokeWidth="1.6"
                    />

                    {/* Actual data points */}
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={100 - p.y}
                        r="2.2"
                        fill="#1A1816"
                        stroke="#FAF9F5"
                        strokeWidth="0.6"
                      />
                    ))}
                  </svg>
                </div>

                <p className="text-[12px] font-mono text-[#75716B] mt-3 text-center">
                  Red dashed hairlines indicate prediction error{" "}
                  <MathTex math="e_i" />. OLS seeks to minimize the sum of their
                  squared lengths.
                </p>
              </div>
            </div>
          </section>

          {/* Section 02: Closed-Form Normal Equations */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / Vector Formulation
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Normal Equations Matrix Solution
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[14px] text-[#4A4742] leading-[1.7]">
              <div className="space-y-4">
                <p>
                  Rather than performing numerical gradient steps, the global
                  optimal parameters <MathTex math="\beta = [c, m]^T" /> can be
                  solved in a single step using matrix projection:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    Closed-Form Normal Equation
                  </span>
                  <MathTex
                    math="\mathbf{\beta}^* = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}"
                    block
                  />
                </div>
              </div>

              <div className="space-y-4">
                <p>
                  When dataset dimension <MathTex math="D" /> is massive,
                  computing the matrix inverse{" "}
                  <MathTex math="(\mathbf{X}^T \mathbf{X})^{-1}" /> requires{" "}
                  <MathTex math="\mathcal{O}(D^3)" /> computational complexity.
                  For high-dimensional regimes, Stochastic Gradient Descent
                  (SGD) is preferred.
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 text-[12px] font-mono">
                  <span className="text-[#DE5D35] font-bold">
                    OPTIMAL VALUE FOR THIS DATASET:
                  </span>
                  <div className="mt-1">
                    m* = {optimalOLS.mOpt.toFixed(3)}, c* ={" "}
                    {optimalOLS.cOpt.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="border-t border-[#1A1816]/15 pt-8 flex items-center justify-between">
            <Link
              href="/resources/logistic-regression"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
            >
              <span>← Topic 03: Logistic Regression</span>
            </Link>
            <Link
              href="/resources/precision-recall"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#DE5D35] font-bold hover:underline"
            >
              <span>Topic 05: Precision-Recall & F1 →</span>
            </Link>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
