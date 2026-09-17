"use client";

import { useState } from "react";

interface Concept {
  id: string;
  name: string;
  category: "TRANSFORMERS" | "COMPUTER VISION" | "OPTIMIZATION" | "GENERATIVE AI";
  summary: string;
  equation: string;
}

const concepts: Concept[] = [
  {
    id: "attention",
    name: "Scaled Dot-Product Attention",
    category: "TRANSFORMERS",
    summary: "The computational core of modern Large Language Models calculating contextual token relevance.",
    equation: "Attention(Q, K, V) = softmax(Q K^T / √d_k) V",
  },
  {
    id: "convolution",
    name: "2D Spatial Convolution",
    category: "COMPUTER VISION",
    summary: "Sliding localized filter kernels across pixel matrices to extract hierarchical edge and texture features.",
    equation: "(I * K)(i, j) = ∑∑ I(i-m, j-n) · K(m, n)",
  },
  {
    id: "gradient",
    name: "Loss Landscape & Gradient Descent",
    category: "OPTIMIZATION",
    summary: "Iterative parameter optimization traversing multi-dimensional loss surfaces toward global minima.",
    equation: "θ_{t+1} = θ_t - η · ∇_θ L(θ_t)",
  },
  {
    id: "diffusion",
    name: "Diffusion Denoising Scheduler",
    category: "GENERATIVE AI",
    summary: "Progressive Markovian transition reversing Gaussian noise to reconstruct high-fidelity latent tensors.",
    equation: "q(x_t | x_{t-1}) = N(x_t; √(1-β_t)x_{t-1}, β_t I)",
  },
  {
    id: "temperature",
    name: "Softmax & Sampling Temperature",
    category: "TRANSFORMERS",
    summary: "Controlling prediction entropy: low temperature forces greedy argmax; high temperature enables creativity.",
    equation: "P(w_i) = exp(z_i / T) / ∑_j exp(z_j / T)",
  },
];

export default function ResourceCenter() {
  const [activeTab, setActiveTab] = useState<string>("attention");

  // Interactive state for Attention
  const tokens = ["The", "neural", "network", "encodes", "representations"];
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(2);

  // Precomputed realistic attention distribution matrix (5x5)
  const attentionWeights = [
    [0.45, 0.25, 0.15, 0.10, 0.05],
    [0.10, 0.55, 0.20, 0.10, 0.05],
    [0.15, 0.20, 0.40, 0.15, 0.10],
    [0.05, 0.10, 0.35, 0.35, 0.15],
    [0.08, 0.12, 0.25, 0.20, 0.35],
  ];

  // Interactive state for Convolution
  const [kernelType, setKernelType] = useState<"edge" | "sharpen" | "gaussian">("edge");
  const kernels = {
    edge: [
      [-1, -1, -1],
      [-1, 8, -1],
      [-1, -1, -1],
    ],
    sharpen: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
    gaussian: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1],
    ],
  };

  // Interactive state for Gradient Descent
  const [learningRate, setLearningRate] = useState<number>(0.25);

  // Interactive state for Diffusion Denoising
  const [timestep, setTimestep] = useState<number>(350);

  // Interactive state for Softmax Temperature
  const [temperature, setTemperature] = useState<number>(0.8);
  const baseLogits = [4.2, 3.8, 2.1, 1.2, 0.5];
  const candidateWords = ["intelligence", "network", "algorithm", "parameter", "tensor"];

  // Compute softmax probabilities dynamically
  const expValues = baseLogits.map((l) => Math.exp(l / Math.max(temperature, 0.05)));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  const probabilities = expValues.map((v) => (v / sumExp) * 100);

  return (
    <section id="resources" className="py-24 md:py-32 bg-[#F7F7F5] border-t border-[#E2E2DE]">
      <div className="bw-container">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A0A0A] text-white rounded-full text-[11px] font-mono tracking-widest uppercase mb-4">
              <span>AIS ACADEMIC REPOSITORY</span>
              <span>·</span>
              <span className="text-[#A1A19D]">INTERACTIVE LAB</span>
            </div>
            <h2 className="text-[34px] sm:text-[48px] font-black tracking-[-0.03em] text-[#0A0A0A] leading-tight">
              Learning Resource Center
            </h2>
          </div>
          <p className="text-[14px] sm:text-[15px] text-[#666663] max-w-[38ch] lg:text-right">
            Interactive mathematical and intuitive visualizers for foundational machine
            learning and deep neural architectures.
          </p>
        </div>

        {/* Concept Selector Tabs (Spacious Rounded Pills) */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-10">
          {concepts.map((concept) => (
            <button
              key={concept.id}
              type="button"
              onClick={() => setActiveTab(concept.id)}
              className={`px-5 py-3 rounded-full text-[12px] sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                activeTab === concept.id
                  ? "bg-[#0A0A0A] text-white shadow-xs"
                  : "bg-white text-[#666663] border border-[#E2E2DE] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
              }`}
            >
              <span>{concept.name}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  activeTab === concept.id ? "bg-white/20 text-white" : "bg-[#EEEEEC] text-[#666663]"
                }`}
              >
                {concept.category}
              </span>
            </button>
          ))}
        </div>

        {/* Main Visualizer Container (Spacious Rounded Card Matching Reference) */}
        <div className="bg-[#FFFFFF] border border-[#E2E2DE] rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 lg:p-12 shadow-xs">
          {/* Active Concept Top Info */}
          {concepts
            .filter((c) => c.id === activeTab)
            .map((c) => (
              <div
                key={c.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#E2E2DE] mb-8"
              >
                <div>
                  <span className="text-[11px] font-mono tracking-widest text-[#666663] uppercase block mb-1">
                    CONCEPT SPECIFICATION
                  </span>
                  <h3 className="text-[22px] sm:text-[28px] font-bold text-[#0A0A0A] tracking-tight">
                    {c.name}
                  </h3>
                  <p className="text-[14px] text-[#666663] max-w-[55ch] mt-1">
                    {c.summary}
                  </p>
                </div>

                <div className="bg-[#F7F7F5] border border-[#E2E2DE] rounded-[20px] px-5 py-3 self-start lg:self-center">
                  <span className="text-[10px] font-mono text-[#666663] uppercase block mb-0.5">
                    Governing Equation
                  </span>
                  <code className="text-[13px] font-mono font-bold text-[#0A0A0A]">
                    {c.equation}
                  </code>
                </div>
              </div>
            ))}

          {/* 1. Scaled Dot-Product Attention Interactive Visualizer */}
          {activeTab === "attention" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div>
                  <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold mb-3">
                    Query Token Selection
                  </h4>
                  <p className="text-[13px] text-[#666663] mb-4">
                    Click a word to inspect how its Query vector attends to all Key vectors across the sequence:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tokens.map((token, idx) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => setSelectedTokenIdx(idx)}
                        className={`px-4 py-2 rounded-full text-[13px] font-mono transition-all cursor-pointer ${
                          selectedTokenIdx === idx
                            ? "bg-[#0A0A0A] text-white font-bold"
                            : "bg-[#F7F7F5] text-[#0A0A0A] border border-[#E2E2DE] hover:border-[#0A0A0A]"
                        }`}
                      >
                        {token}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-[#F7F7F5] p-5 rounded-[24px] border border-[#E2E2DE]">
                  <span className="text-[11px] font-mono uppercase text-[#666663] block mb-1">
                    Active Query Vector
                  </span>
                  <span className="text-[16px] font-bold text-[#0A0A0A]">
                    q(&quot;{tokens[selectedTokenIdx]}&quot;) · K^T / √d_k
                  </span>
                  <p className="text-[12px] text-[#666663] mt-2">
                    Higher percentages denote stronger bidirectional contextual affinity within multi-head attention blocks.
                  </p>
                </div>
              </div>

              {/* Dynamic Attention Distribution Bars */}
              <div className="lg:col-span-7 bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[28px] border border-[#262626]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#262626]">
                  <span className="text-[12px] font-mono uppercase tracking-widest text-[#A1A19D]">
                    Attention Distribution Heatmap
                  </span>
                  <span className="text-[11px] font-mono text-white/60">
                    d_model = 768
                  </span>
                </div>

                <div className="space-y-4">
                  {tokens.map((targetToken, idx) => {
                    const weight = attentionWeights[selectedTokenIdx][idx];
                    const percent = Math.round(weight * 100);

                    return (
                      <div key={targetToken} className="space-y-1.5">
                        <div className="flex justify-between text-[13px] font-mono">
                          <span className="text-white/90 flex items-center gap-2">
                            <span>{targetToken}</span>
                            {selectedTokenIdx === idx && (
                              <span className="text-[10px] text-[#A1A19D]">(self)</span>
                            )}
                          </span>
                          <span className="text-white font-bold">{percent}%</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-500 ease-out rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. 2D Spatial Convolution Visualizer */}
          {activeTab === "convolution" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold mb-3">
                    Kernel Filter Operator
                  </h4>
                  <p className="text-[13px] text-[#666663] mb-4">
                    Choose an analytical 3×3 matrix convolution kernel to observe edge gradient response:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setKernelType("edge")}
                      className={`px-4 py-2 rounded-full text-[13px] font-mono cursor-pointer ${
                        kernelType === "edge"
                          ? "bg-[#0A0A0A] text-white font-bold"
                          : "bg-[#F7F7F5] border border-[#E2E2DE] text-[#0A0A0A]"
                      }`}
                    >
                      Laplacian Edge (-1 / +8)
                    </button>
                    <button
                      type="button"
                      onClick={() => setKernelType("sharpen")}
                      className={`px-4 py-2 rounded-full text-[13px] font-mono cursor-pointer ${
                        kernelType === "sharpen"
                          ? "bg-[#0A0A0A] text-white font-bold"
                          : "bg-[#F7F7F5] border border-[#E2E2DE] text-[#0A0A0A]"
                      }`}
                    >
                      Sharpening Filter
                    </button>
                    <button
                      type="button"
                      onClick={() => setKernelType("gaussian")}
                      className={`px-4 py-2 rounded-full text-[13px] font-mono cursor-pointer ${
                        kernelType === "gaussian"
                          ? "bg-[#0A0A0A] text-white font-bold"
                          : "bg-[#F7F7F5] border border-[#E2E2DE] text-[#0A0A0A]"
                      }`}
                    >
                      Gaussian Smoothing
                    </button>
                  </div>
                </div>

                <div className="p-5 bg-[#F7F7F5] rounded-[24px] border border-[#E2E2DE]">
                  <span className="text-[11px] font-mono uppercase text-[#666663] block mb-2">
                    3×3 Spatial Weight Matrix
                  </span>
                  <div className="grid grid-cols-3 gap-2 max-w-[180px]">
                    {kernels[kernelType].flat().map((val, i) => (
                      <div
                        key={i}
                        className="h-10 rounded-[10px] bg-white border border-[#E2E2DE] flex items-center justify-center font-mono text-[13px] font-bold text-[#0A0A0A]"
                      >
                        {val > 0 ? `+${val}` : val}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Convolution Visual Representation */}
              <div className="lg:col-span-7 bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[28px] border border-[#262626]">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#262626]">
                  <span className="text-[12px] font-mono uppercase tracking-widest text-[#A1A19D]">
                    Feature Map Activation Result
                  </span>
                  <span className="text-[11px] font-mono text-white/60">Stride = 1 · Padding = 0</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
                  {/* Input Patch 4x4 */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono text-white/60 mb-2">Input Image Tensor (X)</span>
                    <div className="grid grid-cols-4 gap-1.5 p-3 bg-white/5 rounded-[18px] border border-white/10">
                      {[120, 130, 240, 255, 115, 125, 235, 250, 110, 120, 230, 245, 105, 115, 225, 240].map(
                        (px, idx) => (
                          <div
                            key={idx}
                            className="w-10 h-10 rounded-[6px] flex items-center justify-center font-mono text-[10px] text-white/80"
                            style={{ backgroundColor: `rgba(255, 255, 255, ${px / 320})` }}
                          >
                            {px}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="text-[20px] font-bold text-white/40">⊛</div>

                  {/* Output Feature Activation 2x2 */}
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] font-mono text-white/60 mb-2">Convolved Output (Y)</span>
                    <div className="grid grid-cols-2 gap-2 p-3 bg-white/10 rounded-[18px] border border-white/20">
                      {kernelType === "edge" &&
                        [385, 410, 370, 395].map((val, idx) => (
                          <div
                            key={idx}
                            className="w-14 h-14 rounded-[10px] bg-white text-[#0A0A0A] flex items-center justify-center font-mono text-[13px] font-bold"
                          >
                            {val}
                          </div>
                        ))}
                      {kernelType === "sharpen" &&
                        [210, 245, 195, 230].map((val, idx) => (
                          <div
                            key={idx}
                            className="w-14 h-14 rounded-[10px] bg-white text-[#0A0A0A] flex items-center justify-center font-mono text-[13px] font-bold"
                          >
                            {val}
                          </div>
                        ))}
                      {kernelType === "gaussian" &&
                        [175, 190, 165, 180].map((val, idx) => (
                          <div
                            key={idx}
                            className="w-14 h-14 rounded-[10px] bg-white text-[#0A0A0A] flex items-center justify-center font-mono text-[13px] font-bold"
                          >
                            {val}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Loss Landscape & Gradient Descent Visualizer */}
          {activeTab === "gradient" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold">
                      Learning Rate (η)
                    </h4>
                    <span className="font-mono text-[14px] font-bold px-2 py-0.5 bg-[#F7F7F5] rounded-[6px] border border-[#E2E2DE]">
                      η = {learningRate.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    className="w-full accent-[#0A0A0A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#666663] mt-1">
                    <span>0.05 (Slow / Stable)</span>
                    <span>0.50 (Optimal)</span>
                    <span>0.95 (Overshoot / Diverge)</span>
                  </div>
                </div>

                <div className="p-5 bg-[#F7F7F5] rounded-[24px] border border-[#E2E2DE] text-[13px] text-[#666663] leading-relaxed">
                  <span className="font-bold text-[#0A0A0A] block mb-1">
                    Dynamics Status:{" "}
                    {learningRate < 0.2
                      ? "Underdamped creeping convergence."
                      : learningRate <= 0.6
                      ? "Optimal monotonic decay towards global minimum."
                      : "Severe oscillation with gradient explosion risk!"}
                  </span>
                  Parameter updates follow the negative gradient vector pointing toward steepest descent.
                </div>
              </div>

              {/* Animated SVG Gradient Trajectory */}
              <div className="lg:col-span-7 bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[28px] border border-[#262626]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262626]">
                  <span className="text-[12px] font-mono uppercase tracking-widest text-[#A1A19D]">
                    Loss Contour & Descent Path L(θ)
                  </span>
                  <span className="text-[11px] font-mono text-white/60">Epochs 1 → 8</span>
                </div>

                <div className="relative w-full h-[220px] flex items-center justify-center">
                  <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
                    {/* Elliptical Loss Contours */}
                    <ellipse cx="250" cy="110" rx="220" ry="90" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
                    <ellipse cx="250" cy="110" rx="160" ry="65" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
                    <ellipse cx="250" cy="110" rx="100" ry="40" fill="none" stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" />
                    <ellipse cx="250" cy="110" rx="40" ry="18" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                    <circle cx="250" cy="110" r="4" fill="#FFFFFF" />

                    {/* Gradient Descent Steps based on learning rate */}
                    {(() => {
                      const steps = [
                        { x: 70, y: 40 },
                        { x: 70 + 140 * learningRate, y: 40 + 50 * learningRate },
                        { x: 140 + 100 * (1 - learningRate * 0.5), y: 80 + 30 * learningRate },
                        { x: 200 + 40 * learningRate, y: 100 + 10 * learningRate },
                        { x: 235 + 15 * learningRate, y: 108 + 2 * learningRate },
                        { x: 250, y: 110 },
                      ];

                      const pathD = steps.reduce(
                        (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
                        ""
                      );

                      return (
                        <>
                          <path d={pathD} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 4" />
                          {steps.map((st, i) => (
                            <circle key={i} cx={st.x} cy={st.y} r={i === steps.length - 1 ? 5 : 3.5} fill="#FFFFFF" />
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* 4. Diffusion Denoising Visualizer */}
          {activeTab === "diffusion" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold">
                      Reverse Timestep (t)
                    </h4>
                    <span className="font-mono text-[14px] font-bold px-2.5 py-0.5 bg-[#F7F7F5] rounded-[6px] border border-[#E2E2DE]">
                      t = {timestep} / 1000
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="25"
                    value={timestep}
                    onChange={(e) => setTimestep(parseInt(e.target.value))}
                    className="w-full accent-[#0A0A0A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#666663] mt-1">
                    <span>t = 0 (Clear Sample x_0)</span>
                    <span>t = 1000 (Pure Noise x_T)</span>
                  </div>
                </div>

                <div className="p-5 bg-[#F7F7F5] rounded-[24px] border border-[#E2E2DE] text-[13px] text-[#666663]">
                  <span className="font-bold text-[#0A0A0A] block mb-1">
                    Noise Level: {Math.round((timestep / 1000) * 100)}% Gaussian Perturbation
                  </span>
                  Neural U-Net predicts the score function ∇_x log p_t(x) at each discrete transition step.
                </div>
              </div>

              {/* Visual Reconstruction Matrix */}
              <div className="lg:col-span-7 bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[28px] border border-[#262626]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262626]">
                  <span className="text-[12px] font-mono uppercase tracking-widest text-[#A1A19D]">
                    Latent Tensor Reconstruction State
                  </span>
                  <span className="text-[11px] font-mono text-white/60">
                    β_schedule = Cosine
                  </span>
                </div>

                <div className="flex items-center justify-center p-6">
                  {/* Dynamic noise canvas representation */}
                  <div
                    className="w-48 h-48 rounded-[24px] border-2 border-white/20 relative overflow-hidden transition-all duration-300 flex items-center justify-center"
                    style={{
                      backgroundColor: `rgb(${Math.round(20 + (timestep / 1000) * 100)}, ${Math.round(
                        20 + (timestep / 1000) * 100
                      )}, ${Math.round(20 + (timestep / 1000) * 100)})`,
                    }}
                  >
                    {/* Emerging Symbol as noise diminishes */}
                    <div
                      className="font-black text-[56px] text-white transition-opacity duration-300 select-none"
                      style={{ opacity: 1 - timestep / 1000 }}
                    >
                      AIS
                    </div>

                    {/* Noise Texture Overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none dot-pattern-bg"
                      style={{ opacity: timestep / 1000 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Softmax Temperature Visualizer */}
          {activeTab === "temperature" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold">
                      Sampling Temperature (T)
                    </h4>
                    <span className="font-mono text-[14px] font-bold px-2.5 py-0.5 bg-[#F7F7F5] rounded-[6px] border border-[#E2E2DE]">
                      T = {temperature.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-[#0A0A0A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#666663] mt-1">
                    <span>0.1 (Deterministic)</span>
                    <span>1.0 (Standard)</span>
                    <span>2.0 (High Entropy)</span>
                  </div>
                </div>

                <div className="p-5 bg-[#F7F7F5] rounded-[24px] border border-[#E2E2DE] text-[13px] text-[#666663]">
                  <span className="font-bold text-[#0A0A0A] block mb-1">
                    State:{" "}
                    {temperature <= 0.3
                      ? "Near-greedy argmax selection. Minimal hallucination."
                      : temperature <= 1.0
                      ? "Balanced linguistic diversity with syntactic coherence."
                      : "Uniform distribution. High creativity, risk of incoherent tokens."}
                  </span>
                  Divides logit scores prior to exponentiation to sharpen or flatten the probability simplex.
                </div>
              </div>

              {/* Dynamic Next-Token Probability Bar Chart */}
              <div className="lg:col-span-7 bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[28px] border border-[#262626]">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262626]">
                  <span className="text-[12px] font-mono uppercase tracking-widest text-[#A1A19D]">
                    Next-Token Probability Simplex P(y | x)
                  </span>
                  <span className="text-[11px] font-mono text-white/60">Top 5 Candidates</span>
                </div>

                <div className="space-y-4">
                  {candidateWords.map((word, i) => {
                    const pct = Math.max(probabilities[i], 0.5);

                    return (
                      <div key={word} className="space-y-1">
                        <div className="flex justify-between text-[13px] font-mono">
                          <span className="text-white/90">{word}</span>
                          <span className="text-white font-bold">{pct.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-white transition-all duration-300 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
