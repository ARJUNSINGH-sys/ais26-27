"use client";

import { useState } from "react";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Concept {
  id: string;
  name: string;
  category: "TRANSFORMERS" | "COMPUTER VISION" | "OPTIMIZATION" | "GENERATIVE AI";
  summary: string;
  equation: string;
  pytorchSnippet: string;
  paperRef: string;
}

const conceptsData: Concept[] = [
  {
    id: "attention",
    name: "Scaled Dot-Product Attention",
    category: "TRANSFORMERS",
    summary: "The computational bedrock of Transformer architectures, calculating contextual token-to-token relevance through Query, Key, and Value matrix projections.",
    equation: "Attention(Q, K, V) = softmax( (Q K^T) / √d_k ) V",
    pytorchSnippet: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    # Q, K, V: [batch_size, seq_len, d_k]
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    attention_weights = F.softmax(scores, dim=-1)
    output = torch.matmul(attention_weights, V)
    return output, attention_weights`,
    paperRef: "Vaswani et al., 'Attention Is All You Need' (NeurIPS 2017)",
  },
  {
    id: "convolution",
    name: "2D Spatial Kernel Convolution",
    category: "COMPUTER VISION",
    summary: "Discrete 2D cross-correlation sliding parameterized weight kernels across spatial feature maps to detect hierarchical edges, textures, and object motifs.",
    equation: "Y(i, j) = (X * K)(i, j) = ∑∑ X(i-m, j-n) · K(m, n)",
    pytorchSnippet: `import torch
import torch.nn as nn

# Standard 2D Convolution layer with 3x3 kernel
conv = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3, padding=1, bias=False)
x = torch.randn(1, 3, 224, 224)
features = conv(x)  # shape: [1, 64, 224, 224]`,
    paperRef: "LeCun et al., 'Gradient-Based Learning Applied to Document Recognition' (1998)",
  },
  {
    id: "gradient",
    name: "Loss Surfaces & Gradient Descent",
    category: "OPTIMIZATION",
    summary: "Iterative parameter optimization traversing complex, non-convex multi-dimensional loss topologies via first-order partial derivatives and momentum.",
    equation: "θ_{t+1} = θ_t - η · ∇_θ L(θ_t) + γ · v_t",
    pytorchSnippet: `import torch
import torch.optim as optim

model = torch.nn.Linear(768, 10)
optimizer = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

# Training loop step
optimizer.zero_grad()
loss = criterion(model(inputs), targets)
loss.backward()
optimizer.step()`,
    paperRef: "Kingma & Ba, 'Adam: A Method for Stochastic Optimization' (ICLR 2015)",
  },
  {
    id: "diffusion",
    name: "Denoising Diffusion Probabilistic Models",
    category: "GENERATIVE AI",
    summary: "Reversing a forward Gaussian noise corruption process through discrete Markovian transitions to synthesize high-dimensional tensors from latent random variables.",
    equation: "p_θ(x_{t-1} | x_t) = N(x_{t-1}; μ_θ(x_t, t), Σ_θ(x_t, t))",
    pytorchSnippet: `import torch

def q_sample(x_start, t, noise=None):
    if noise is None:
        noise = torch.randn_like(x_start)
    sqrt_alphas_cumprod_t = extract(sqrt_alphas_cumprod, t, x_start.shape)
    sqrt_one_minus_alphas_cumprod_t = extract(sqrt_one_minus_alphas_cumprod, t, x_start.shape)
    return sqrt_alphas_cumprod_t * x_start + sqrt_one_minus_alphas_cumprod_t * noise`,
    paperRef: "Ho, Jain & Abbeel, 'Denoising Diffusion Probabilistic Models' (NeurIPS 2020)",
  },
  {
    id: "temperature",
    name: "Softmax Scaling & Temperature Control",
    category: "TRANSFORMERS",
    summary: "Hyperparameter modulating probability entropy during autoregressive generation: low values yield deterministic greediness, while higher values expand entropy.",
    equation: "P(w_i) = exp(z_i / T) / ∑_j exp(z_j / T)",
    pytorchSnippet: `import torch
import torch.nn.functional as F

def sample_with_temperature(logits, temperature=0.7):
    # Scale logits before softmax
    scaled_logits = logits / max(temperature, 1e-4)
    probabilities = F.softmax(scaled_logits, dim=-1)
    next_token = torch.multinomial(probabilities, num_samples=1)
    return next_token`,
    paperRef: "Ackley, Hinton & Sejnowski, 'A Learning Algorithm for Boltzmann Machines' (1985)",
  },
  {
    id: "embeddings",
    name: "Latent Vectors & Cosine Similarity",
    category: "OPTIMIZATION",
    summary: "Measuring semantic relatedness between dense representations in high-dimensional vector space using the normalized dot product angle.",
    equation: "cos(u, v) = (u · v) / ( ||u|| · ||v|| )",
    pytorchSnippet: `import torch
import torch.nn.functional as F

# Two 768-dimensional token embeddings
u = torch.randn(1, 768)
v = torch.randn(1, 768)
similarity = F.cosine_similarity(u, v)  # in range [-1.0, 1.0]`,
    paperRef: "Mikolov et al., 'Efficient Estimation of Word Representations in Vector Space' (2013)",
  },
];

export default function ResourcesPage() {
  const [activeConceptId, setActiveConceptId] = useState<string>("attention");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeViewMode, setActiveViewMode] = useState<"visualizer" | "pytorch">("visualizer");

  const currentConcept = conceptsData.find((c) => c.id === activeConceptId) || conceptsData[0];

  const filteredConcepts =
    activeCategory === "ALL"
      ? conceptsData
      : conceptsData.filter((c) => c.category === activeCategory);

  // Attention state
  const tokens = ["The", "neural", "network", "encodes", "representations"];
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(2);
  const attentionWeights = [
    [0.45, 0.25, 0.15, 0.10, 0.05],
    [0.10, 0.55, 0.20, 0.10, 0.05],
    [0.15, 0.20, 0.40, 0.15, 0.10],
    [0.05, 0.10, 0.35, 0.35, 0.15],
    [0.08, 0.12, 0.25, 0.20, 0.35],
  ];

  // Convolution state
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

  // Gradient Descent state
  const [learningRate, setLearningRate] = useState<number>(0.25);

  // Diffusion state
  const [timestep, setTimestep] = useState<number>(400);

  // Temperature state
  const [temperature, setTemperature] = useState<number>(0.8);
  const baseLogits = [4.2, 3.8, 2.1, 1.2, 0.5];
  const candidateWords = ["intelligence", "network", "algorithm", "parameter", "tensor"];
  const expValues = baseLogits.map((l) => Math.exp(l / Math.max(temperature, 0.05)));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  const probabilities = expValues.map((v) => (v / sumExp) * 100);

  // Embedding Similarity state
  const [vectorAngle, setVectorAngle] = useState<number>(30);
  const similarityScore = Math.cos((vectorAngle * Math.PI) / 180).toFixed(3);

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-[#F7F7F5] text-[#0A0A0A]">
        <Nav />

        <main className="grow pt-28 sm:pt-36 pb-24">
          <div className="bw-container">
            {/* Top Breadcrumb & Badge */}
            <div className="flex items-center gap-3 mb-6">
              <Link
                href="/"
                className="text-[12px] font-mono uppercase text-[#666663] hover:text-[#0A0A0A] transition-colors"
              >
                ← Back to Home
              </Link>
              <span className="text-[#D9D6CF]">/</span>
              <span className="text-[12px] font-mono uppercase font-bold text-[#0A0A0A]">
                AIS Resource Center
              </span>
            </div>

            {/* Header Title Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 sm:mb-16 pb-12 border-b border-[#E2E2DE]">
              <div className="max-w-[28ch]">
                <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#666663] block mb-3">
                  BENNETT UNIVERSITY · OPEN ARCHIVE
                </span>
                <h1 className="text-[38px] sm:text-[54px] lg:text-[64px] font-black tracking-[-0.035em] leading-[1.05] text-[#0A0A0A]">
                  Learning Resource Center
                </h1>
              </div>

              <div className="max-w-[42ch]">
                <p className="text-[15px] sm:text-[16px] text-[#666663] leading-[1.6] mb-4">
                  Interactive conceptual visualizers, mathematical formulations, and
                  battle-tested PyTorch implementations created by the AI Society cohort.
                </p>
                <div className="flex items-center gap-3 text-[12px] font-mono text-[#0A0A0A]">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span>6 Neural Concepts Online · Open Access</span>
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-8">
              {["ALL", "TRANSFORMERS", "COMPUTER VISION", "OPTIMIZATION", "GENERATIVE AI"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-[12px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[#0A0A0A] text-white font-bold"
                      : "bg-[#EEEEEC] text-[#666663] hover:text-[#0A0A0A] border border-[#E2E2DE]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Main Interactive Workstation (Spacious Card Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Concept Sidebar — 4 cols */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#666663] mb-1">
                  Select Topic ({filteredConcepts.length})
                </span>

                {filteredConcepts.map((concept) => (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => setActiveConceptId(concept.id)}
                    className={`p-5 rounded-[22px] text-left transition-all duration-200 border cursor-pointer ${
                      activeConceptId === concept.id
                        ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-sm"
                        : "bg-white text-[#0A0A0A] border-[#E2E2DE] hover:border-[#0A0A0A]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          activeConceptId === concept.id
                            ? "bg-white/20 text-white"
                            : "bg-[#EEEEEC] text-[#666663]"
                        }`}
                      >
                        {concept.category}
                      </span>
                      <span className="text-[12px] font-mono opacity-50">→</span>
                    </div>
                    <h3 className="text-[16px] font-bold tracking-tight mb-1">
                      {concept.name}
                    </h3>
                    <p
                      className={`text-[12px] line-clamp-2 leading-relaxed ${
                        activeConceptId === concept.id ? "text-white/70" : "text-[#666663]"
                      }`}
                    >
                      {concept.summary}
                    </p>
                  </button>
                ))}
              </div>

              {/* Interactive Visualizer Canvas — 8 cols */}
              <div className="lg:col-span-8 bg-white border border-[#E2E2DE] rounded-[32px] sm:rounded-[36px] p-6 sm:p-10 shadow-xs">
                {/* Visualizer Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E2DE] mb-8">
                  <div>
                    <span className="text-[11px] font-mono tracking-widest uppercase text-[#666663] block mb-1">
                      TOPIC SPECIFICATION
                    </span>
                    <h2 className="text-[24px] sm:text-[30px] font-extrabold text-[#0A0A0A] tracking-tight">
                      {currentConcept.name}
                    </h2>
                  </div>

                  {/* Toggle between Interactive Visualizer and PyTorch Code */}
                  <div className="flex items-center p-1 bg-[#EEEEEC] rounded-full self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => setActiveViewMode("visualizer")}
                      className={`px-4 py-1.5 rounded-full text-[12px] font-mono transition-all cursor-pointer ${
                        activeViewMode === "visualizer"
                          ? "bg-[#0A0A0A] text-white font-bold"
                          : "text-[#666663]"
                      }`}
                    >
                      Interactive Lab
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveViewMode("pytorch")}
                      className={`px-4 py-1.5 rounded-full text-[12px] font-mono transition-all cursor-pointer ${
                        activeViewMode === "pytorch"
                          ? "bg-[#0A0A0A] text-white font-bold"
                          : "text-[#666663]"
                      }`}
                    >
                      PyTorch Code
                    </button>
                  </div>
                </div>

                {/* Mathematical Equation Ribbon */}
                <div className="bg-[#F7F7F5] border border-[#E2E2DE] rounded-[20px] p-4 sm:p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#666663] uppercase block mb-1">
                      Mathematical Governing Law
                    </span>
                    <code className="text-[13px] sm:text-[14px] font-mono font-bold text-[#0A0A0A]">
                      {currentConcept.equation}
                    </code>
                  </div>
                  <div className="text-[11px] font-mono text-[#666663]">
                    {currentConcept.paperRef}
                  </div>
                </div>

                {/* View Mode: PyTorch Snippet */}
                {activeViewMode === "pytorch" && (
                  <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[24px] overflow-x-auto border border-[#262626]">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#262626] text-[11px] font-mono text-[#A1A19D]">
                      <span>torch_implementation.py</span>
                      <span>PyTorch 2.x Compliant</span>
                    </div>
                    <pre className="font-mono text-[13px] sm:text-[14px] text-white/90 leading-relaxed">
                      <code>{currentConcept.pytorchSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* View Mode: Interactive Visualizers */}
                {activeViewMode === "visualizer" && (
                  <div>
                    {/* 1. Attention Visualizer */}
                    {activeConceptId === "attention" && (
                      <div className="space-y-8">
                        <div>
                          <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold mb-3">
                            Click Query Token (q_i):
                          </h4>
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

                        <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[24px] border border-[#262626]">
                          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#262626]">
                            <span className="text-[12px] font-mono uppercase tracking-widest text-[#A1A19D]">
                              Attention Weights α_{selectedTokenIdx},j
                            </span>
                            <span className="text-[11px] font-mono text-white/60">
                              softmax(Q·K^T / √d_k)
                            </span>
                          </div>

                          <div className="space-y-4">
                            {tokens.map((targetToken, idx) => {
                              const weight = attentionWeights[selectedTokenIdx][idx];
                              const percent = Math.round(weight * 100);

                              return (
                                <div key={targetToken} className="space-y-1">
                                  <div className="flex justify-between text-[13px] font-mono">
                                    <span className="text-white/90">
                                      Token: {targetToken}
                                    </span>
                                    <span className="text-white font-bold">{percent}%</span>
                                  </div>
                                  <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                      className="h-full bg-white transition-all duration-300 rounded-full"
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

                    {/* 2. Convolution Visualizer */}
                    {activeConceptId === "convolution" && (
                      <div className="space-y-8">
                        <div>
                          <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold mb-3">
                            Select 3×3 Kernel:
                          </h4>
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
                              Laplacian Edge
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
                              Sharpen
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

                        <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[24px] border border-[#262626]">
                          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                            <div>
                              <span className="text-[11px] font-mono text-white/60 mb-2 block text-center">
                                Input Matrix X
                              </span>
                              <div className="grid grid-cols-3 gap-1.5 p-3 bg-white/5 rounded-[16px]">
                                {[140, 255, 120, 240, 255, 230, 110, 220, 100].map((v, i) => (
                                  <div
                                    key={i}
                                    className="w-10 h-10 rounded-[6px] bg-white/10 flex items-center justify-center font-mono text-[11px]"
                                  >
                                    {v}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <span className="text-[20px] font-bold text-white/40">⊛</span>

                            <div>
                              <span className="text-[11px] font-mono text-white/60 mb-2 block text-center">
                                Active Kernel K
                              </span>
                              <div className="grid grid-cols-3 gap-1.5 p-3 bg-white/10 rounded-[16px] border border-white/20">
                                {kernels[kernelType].flat().map((v, i) => (
                                  <div
                                    key={i}
                                    className="w-10 h-10 rounded-[6px] bg-white text-[#0A0A0A] flex items-center justify-center font-mono text-[11px] font-bold"
                                  >
                                    {v > 0 ? `+${v}` : v}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. Gradient Descent Visualizer */}
                    {activeConceptId === "gradient" && (
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold">
                              Adjust Learning Rate (η)
                            </h4>
                            <span className="font-mono text-[14px] font-bold px-3 py-1 bg-[#F7F7F5] rounded-[8px] border border-[#E2E2DE]">
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
                        </div>

                        <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[24px] border border-[#262626]">
                          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#262626] text-[12px] font-mono text-[#A1A19D]">
                            <span>Loss Topology Contours</span>
                            <span>Convergence Speed: {learningRate < 0.2 ? "Slow" : learningRate <= 0.6 ? "Optimal" : "Oscillating!"}</span>
                          </div>

                          <div className="relative w-full h-[220px] flex items-center justify-center">
                            <svg viewBox="0 0 500 220" className="w-full h-full overflow-visible">
                              <ellipse cx="250" cy="110" rx="220" ry="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                              <ellipse cx="250" cy="110" rx="150" ry="60" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
                              <ellipse cx="250" cy="110" rx="80" ry="30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
                              <circle cx="250" cy="110" r="4" fill="#FFFFFF" />

                              {(() => {
                                const pts = [
                                  { x: 70, y: 40 },
                                  { x: 70 + 140 * learningRate, y: 40 + 50 * learningRate },
                                  { x: 140 + 100 * (1 - learningRate * 0.5), y: 80 + 30 * learningRate },
                                  { x: 210 + 30 * learningRate, y: 104 + 5 * learningRate },
                                  { x: 250, y: 110 },
                                ];
                                const d = pts.reduce((acc, c, idx) => (idx === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`), "");
                                return (
                                  <>
                                    <path d={d} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4 4" />
                                    {pts.map((p, i) => (
                                      <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#FFFFFF" />
                                    ))}
                                  </>
                                );
                              })()}
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. Diffusion Visualizer */}
                    {activeConceptId === "diffusion" && (
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold">
                              Reverse Denoising Step (t)
                            </h4>
                            <span className="font-mono text-[14px] font-bold px-3 py-1 bg-[#F7F7F5] rounded-[8px] border border-[#E2E2DE]">
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
                        </div>

                        <div className="bg-[#0A0A0A] text-white p-8 rounded-[24px] border border-[#262626] flex flex-col items-center justify-center">
                          <div
                            className="w-52 h-52 rounded-[28px] border-2 border-white/20 relative overflow-hidden flex items-center justify-center transition-all duration-300"
                            style={{
                              backgroundColor: `rgb(${Math.round(20 + (timestep / 1000) * 100)}, ${Math.round(
                                20 + (timestep / 1000) * 100
                              )}, ${Math.round(20 + (timestep / 1000) * 100)})`,
                            }}
                          >
                            <div
                              className="font-black text-[60px] text-white transition-opacity duration-300 select-none"
                              style={{ opacity: 1 - timestep / 1000 }}
                            >
                              AIS
                            </div>
                            <div
                              className="absolute inset-0 pointer-events-none dot-pattern-bg"
                              style={{ opacity: timestep / 1000 }}
                            />
                          </div>
                          <span className="text-[12px] font-mono text-[#A1A19D] mt-4">
                            {timestep === 0 ? "Pure Reconstructed Latent x_0" : `Noise Level: ${Math.round((timestep / 1000) * 100)}%`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 5. Temperature Visualizer */}
                    {activeConceptId === "temperature" && (
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold">
                              Sampling Temperature (T)
                            </h4>
                            <span className="font-mono text-[14px] font-bold px-3 py-1 bg-[#F7F7F5] rounded-[8px] border border-[#E2E2DE]">
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
                        </div>

                        <div className="bg-[#0A0A0A] text-white p-6 sm:p-8 rounded-[24px] border border-[#262626]">
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

                    {/* 6. Embeddings Visualizer */}
                    {activeConceptId === "embeddings" && (
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-[13px] font-mono uppercase tracking-wider text-[#0A0A0A] font-bold">
                              Vector Separation Angle (θ)
                            </h4>
                            <span className="font-mono text-[14px] font-bold px-3 py-1 bg-[#F7F7F5] rounded-[8px] border border-[#E2E2DE]">
                              θ = {vectorAngle}° · Cosine = {similarityScore}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="180"
                            step="5"
                            value={vectorAngle}
                            onChange={(e) => setVectorAngle(parseInt(e.target.value))}
                            className="w-full accent-[#0A0A0A] cursor-pointer"
                          />
                        </div>

                        <div className="bg-[#0A0A0A] text-white p-8 rounded-[24px] border border-[#262626] flex flex-col items-center justify-center">
                          <svg viewBox="0 0 300 200" className="w-64 h-48 overflow-visible">
                            {/* Origin */}
                            <circle cx="150" cy="160" r="4" fill="#FFFFFF" />
                            {/* Vector U (Fixed at angle 0 pointing right) */}
                            <line x1="150" y1="160" x2="250" y2="160" stroke="#FFFFFF" strokeWidth="3" />
                            <text x="260" y="165" fill="#FFFFFF" fontSize="12" fontFamily="monospace">u</text>

                            {/* Vector V (Rotated by vectorAngle) */}
                            {(() => {
                              const rad = (vectorAngle * Math.PI) / 180;
                              const vx = 150 + 100 * Math.cos(rad);
                              const vy = 160 - 100 * Math.sin(rad);
                              return (
                                <>
                                  <line x1="150" y1="160" x2={vx} y2={vy} stroke="#FFFFFF" strokeWidth="3" strokeDasharray="3 3" />
                                  <circle cx={vx} cy={vy} r="4" fill="#FFFFFF" />
                                  <text x={vx + 8} y={vy} fill="#FFFFFF" fontSize="12" fontFamily="monospace">v</text>
                                </>
                              );
                            })()}
                          </svg>

                          <div className="text-center mt-4">
                            <span className="text-[13px] font-mono text-white/80 block">
                              {vectorAngle === 0
                                ? "Identical Semantic Meaning (1.000)"
                                : vectorAngle < 90
                                ? "Positive Semantic Affinity"
                                : vectorAngle === 90
                                ? "Orthogonal / Uncorrelated (0.000)"
                                : "Opposite / Negative Affinity"}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
