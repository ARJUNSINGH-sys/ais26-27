"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import FoldLayout from "@/components/FoldLayout";
import katex from "katex";

// KaTeX LaTeX formula helper component
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

export default function NeuralNetworksArticlePage() {
  // ─────────────────────────────────────────────────────────────────────────────
  // Section 2: Weights Sliders (Modulation)
  // ─────────────────────────────────────────────────────────────────────────────
  const [weightW1, setWeightW1] = useState<number>(1.4);
  const [weightW2, setWeightW2] = useState<number>(-0.8);
  const x1Const = 2.0;
  const x2Const = 1.5;
  const weightedSum = useMemo(() => {
    return x1Const * weightW1 + x2Const * weightW2;
  }, [weightW1, weightW2]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Section 3: Activation Functions & Decision Boundary / Slope Simulator
  // (Directly matches MLU-Explain screenshots: Linear, Sigmoid, ReLU, Step, Deep)
  // ─────────────────────────────────────────────────────────────────────────────
  type ActMode = "linear" | "sigmoid" | "relu" | "step" | "deep";
  const [actMode, setActMode] = useState<ActMode>("sigmoid");
  
  // Interactive sliders for decision boundary / slope
  const [boundaryAngle, setBoundaryAngle] = useState<number>(35); // in degrees
  const [boundaryOffset, setBoundaryOffset] = useState<number>(0); // bias offset
  const [linearSlope, setLinearSlope] = useState<number>(1.1); // for linear regression
  const [linearIntercept, setLinearIntercept] = useState<number>(20);

  // Synthetic 2D dataset points (Two clusters: pink class vs blue class)
  const classificationDots = useMemo(() => {
    return [
      // Pink cluster (upper / left crescent)
      { x: 30, y: 140, cluster: "pink" },
      { x: 45, y: 120, cluster: "pink" },
      { x: 55, y: 100, cluster: "pink" },
      { x: 70, y: 85, cluster: "pink" },
      { x: 90, y: 75, cluster: "pink" },
      { x: 110, y: 70, cluster: "pink" },
      { x: 130, y: 75, cluster: "pink" },
      { x: 145, y: 90, cluster: "pink" },
      { x: 155, y: 115, cluster: "pink" },
      { x: 160, y: 135, cluster: "pink" },
      { x: 75, y: 125, cluster: "pink" },
      { x: 95, y: 110, cluster: "pink" },
      { x: 115, y: 105, cluster: "pink" },

      // Blue cluster (lower / right crescent)
      { x: 80, y: 165, cluster: "blue" },
      { x: 100, y: 175, cluster: "blue" },
      { x: 120, y: 180, cluster: "blue" },
      { x: 140, y: 170, cluster: "blue" },
      { x: 155, y: 155, cluster: "blue" },
      { x: 170, y: 140, cluster: "blue" },
      { x: 180, y: 110, cluster: "blue" },
      { x: 185, y: 80, cluster: "blue" },
      { x: 105, y: 145, cluster: "blue" },
      { x: 125, y: 150, cluster: "blue" },
      { x: 145, y: 140, cluster: "blue" },
      { x: 165, y: 125, cluster: "blue" },
    ];
  }, []);

  // Synthetic Linear Scatter Points
  const scatterDots = useMemo(() => {
    return [
      { x: 20, y: 155 },
      { x: 35, y: 145 },
      { x: 45, y: 135 },
      { x: 60, y: 125 },
      { x: 75, y: 115 },
      { x: 90, y: 100 },
      { x: 105, y: 95 },
      { x: 120, y: 85 },
      { x: 135, y: 70 },
      { x: 150, y: 60 },
      { x: 165, y: 45 },
      { x: 180, y: 35 },
      { x: 50, y: 115 },
      { x: 80, y: 130 },
      { x: 115, y: 110 },
      { x: 145, y: 85 },
      { x: 175, y: 55 },
    ];
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Section 4: Synaptic looping wave phase (for loop animation)
  // ─────────────────────────────────────────────────────────────────────────────
  const [loopPhase, setLoopPhase] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setLoopPhase((p) => (p + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // Section 5: Forward pass interactive sliders
  // ─────────────────────────────────────────────────────────────────────────────
  const [inputX1, setInputX1] = useState<number>(0.8);
  const [inputX2, setInputX2] = useState<number>(-0.4);
  const forwardResult = useMemo(() => {
    const w1 = [1.2, -0.6, 0.9];
    const w2 = [-0.8, 1.4, 0.5];
    const h1 = Math.max(0, inputX1 * w1[0] + inputX2 * w2[0]);
    const h2 = Math.max(0, inputX1 * w1[1] + inputX2 * w2[1]);
    const h3 = Math.max(0, inputX1 * w1[2] + inputX2 * w2[2]);
    const out = 1 / (1 + Math.exp(-(h1 * 0.9 + h2 * -1.1 + h3 * 0.7)));
    return { h1, h2, h3, out };
  }, [inputX1, inputX2]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Section 7: Animated End-to-End Training Cycle State
  // (Forward Pass -> Highlight Misclassified Dots -> Calculate Loss -> Backpropagation -> Repeat)
  // ─────────────────────────────────────────────────────────────────────────────
  const [isLoopPlaying, setIsLoopPlaying] = useState<boolean>(true);
  const [loopSpeed, setLoopSpeed] = useState<1 | 2>(1);
  const [trainingPhase, setTrainingPhase] = useState<0 | 1 | 2 | 3>(0);
  const [loopEpoch, setLoopEpoch] = useState<number>(1);

  useEffect(() => {
    if (!isLoopPlaying) return;
    const delay = loopSpeed === 1 ? 2400 : 1200;
    const timer = setInterval(() => {
      setTrainingPhase((prev) => {
        const next = ((prev + 1) % 4) as 0 | 1 | 2 | 3;
        if (next === 0) {
          setLoopEpoch((e) => (e >= 20 ? 1 : e + 1));
        }
        return next;
      });
    }, delay);
    return () => clearInterval(timer);
  }, [isLoopPlaying, loopSpeed]);

  // Copy code feedback
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopyCode = () => {
    const code = `import torch
import torch.nn as nn
import torch.optim as optim

class FeedForwardNetwork(nn.Module):
    def __init__(self, input_dim=2, hidden_dim=3, output_dim=1):
        super().__init__()
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        z1 = self.fc1(x)
        a1 = self.relu(z1)
        z2 = self.fc2(a1)
        return self.sigmoid(z2)`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FoldLayout>
      <div className="min-h-screen bg-[#EFECE6] text-[#1A1816] pt-24 sm:pt-32 pb-32">
        {/* Editorial Article Header */}
        <header className="shell max-w-[860px] mx-auto pt-6 pb-10">
          <div className="mb-6">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
            >
              <span>← Back to 03 / Published Articles</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
            <span className="text-[11px] font-mono tracking-[0.18em] uppercase text-[#75716B]">
              01 / DEEP LEARNING ARCHIVE · BENNETT UNIVERSITY
            </span>
          </div>

          <h1 className="text-[40px] sm:text-[64px] font-black tracking-[-0.035em] text-[#1A1816] uppercase leading-[0.98] mb-4 font-display">
            Neural Networks
          </h1>

          <p className="text-[13px] font-mono text-[#75716B]">
            Jared Wilber & AIS Research Cohort · May 2024 · 12 min read
          </p>
        </header>

        {/* Introductory Paragraphs */}
        <section className="shell max-w-[860px] mx-auto pb-14 space-y-8">
          <div>
            <h2 className="text-[12px] font-mono font-bold tracking-[0.2em] uppercase text-[#1A1816] border-b border-[#1A1816]/15 pb-2 mb-3">
              A VISUAL INTRODUCTION
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.8]">
              Neural networks have revolutionized artificial intelligence and are the backbone of popular algorithms
              today, such as ChatGPT, Stable-Diffusion, and many others. In this visual introduction, we&apos;ll journey
              through the fundamentals of feed-forward neural networks, starting from their essential components,
              understanding their learning mechanisms, and even getting hands-on experience by interacting with one
              ourselves.
            </p>
          </div>

          <div>
            <h2 className="text-[12px] font-mono font-bold tracking-[0.2em] uppercase text-[#1A1816] border-b border-[#1A1816]/15 pb-2 mb-3">
              WHAT IS A NETWORK?
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.8]">
              Neural networks are networks - that much is clear.{" "}
              <em className="font-serif italic text-[#1A1816]">But what is a &ldquo;network&rdquo;?</em> A network is a
              structure consisting of interconnected computational nodes, or &apos;neurons&apos;, arranged in layers.
              These nodes perform mathematical operations on input data, learning some underlying patterns in the data,
              before producing some output based on those patterns.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ALTERNATING SIDE-BY-SIDE SECTIONS: PARAGRAPHS & GRAPHS                    */}
        {/* ========================================================================= */}
        <div className="shell max-w-[1240px] mx-auto space-y-20 sm:space-y-24">

          {/* SECTION 1: COMPUTATIONAL GRAPHS */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-[#1A1816]/15">
            {/* Visual Canvas (Left) */}
            <div className="lg:col-span-7">
              <div
                className="relative rounded-[2px] border border-[#1A1816] p-6 bg-[#EBF5FB]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #D8EAFD 1px, transparent 1px), linear-gradient(to bottom, #D8EAFD 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#75716B] mb-4 pb-2 border-b border-[#D8EAFD]">
                  <span className="font-bold text-[#1A1816]">FIGURE 01 · COMPUTATIONAL GRAPH</span>
                  <span>FEED-FORWARD TOPOLOGY</span>
                </div>

                <div className="w-full flex items-center justify-center py-6">
                  <svg viewBox="0 0 460 220" className="w-full h-auto select-none max-w-[420px]">
                    <path d="M 120 60 C 160 60, 170 110, 210 110" fill="none" stroke="#1A1816" strokeWidth="2" />
                    <path d="M 120 160 C 160 160, 170 110, 210 110" fill="none" stroke="#1A1816" strokeWidth="2" />
                    <path d="M 270 110 L 330 110" fill="none" stroke="#1A1816" strokeWidth="2" />

                    <circle cx="195" cy="110" r="4.5" fill="#1A1816" />
                    <circle cx="310" cy="110" r="4.5" fill="#1A1816" />

                    {/* input1 */}
                    <g transform="translate(50, 40)">
                      <rect width="70" height="40" rx="2" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="35" y="25" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="600" fill="#1A1816">
                        input₁
                      </text>
                    </g>

                    {/* input2 */}
                    <g transform="translate(50, 140)">
                      <rect width="70" height="40" rx="2" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="35" y="25" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="600" fill="#1A1816">
                        input₂
                      </text>
                    </g>

                    {/* function */}
                    <g transform="translate(200, 90)">
                      <rect width="70" height="40" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="35" y="25" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill="#1A1816">
                        function
                      </text>
                    </g>

                    {/* output */}
                    <g transform="translate(330, 90)">
                      <rect width="70" height="40" rx="2" fill="#FFD670" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="35" y="25" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill="#1A1816">
                        output
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="text-[11px] font-mono text-[#75716B] pt-2 border-t border-[#D8EAFD]">
                  *For simplicity, bias terms are not shown.
                </div>
              </div>
            </div>

            {/* Explanation Paragraphs (Right) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#DE5D35] block">
                01 / FOUNDATIONS
              </span>
              <h3 className="text-[24px] sm:text-[28px] font-black uppercase tracking-tight text-[#1A1816] font-display">
                Building Blocks: Computational Graphs
              </h3>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                A computational graph has an input node where data is fed into the graph, a function node where the input
                data is processed, and an output node where the result of the computation is produced.
              </p>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                As we can see, data flows in one direction, from inputs to output, through the graph. These simple
                directional flows form the foundational algebra of every deep learning network.
              </p>
            </div>
          </section>


          {/* SECTION 2: WEIGHTS WITH INTERACTIVE SLIDERS */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-[#1A1816]/15">
            {/* Explanation (Left) */}
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#DE5D35] block">
                02 / PARAMETERS & SLIDERS
              </span>
              <h3 className="text-[24px] sm:text-[28px] font-black uppercase tracking-tight text-[#1A1816] font-display">
                Weights: Scaling Input Signals
              </h3>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                To give the network capacity to learn and adapt, each incoming connection wire is parameterized by a
                real-valued weight (<MathTex math="w" />). The function node calculates a weighted sum of inputs:
              </p>
              <div className="bg-[#FAF9F5] border border-[#1A1816]/20 p-2.5 rounded-[2px] font-mono text-[13px] text-center">
                <MathTex math="z = w_1 x_1 + w_2 x_2" />
              </div>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                Weights act like precision volume knobs: higher weights amplify critical features, while negative weights
                dampen distracting or contradictory inputs before they reach the nucleus.
              </p>
            </div>

            {/* Visual Canvas with SLIDERS (Right) */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div
                className="relative rounded-[2px] border border-[#1A1816] p-6 bg-[#EBF5FB]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #D8EAFD 1px, transparent 1px), linear-gradient(to bottom, #D8EAFD 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#75716B] mb-4 pb-2 border-b border-[#D8EAFD]">
                  <span className="font-bold text-[#1A1816]">FIGURE 02 · WEIGHT MODULATION</span>
                  <span className="text-[#DE5D35] font-bold font-mono">z = {weightedSum.toFixed(2)}</span>
                </div>

                <div className="w-full flex items-center justify-center py-4">
                  <svg viewBox="0 0 460 220" className="w-full h-auto select-none max-w-[420px]">
                    <path d="M 120 60 C 160 60, 170 110, 210 110" fill="none" stroke="#1A1816" strokeWidth="2.5" />
                    <path d="M 120 160 C 160 160, 170 110, 210 110" fill="none" stroke="#1A1816" strokeWidth="2.5" />
                    <path d="M 270 110 L 330 110" fill="none" stroke="#1A1816" strokeWidth="2" />

                    {/* Weight Badges on Wires */}
                    <rect x="145" y="65" width="52" height="20" rx="2" fill="#1A1816" />
                    <text x="171" y="79" fill="#FAF9F5" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      w₁={weightW1.toFixed(1)}
                    </text>

                    <rect x="145" y="135" width="52" height="20" rx="2" fill="#1A1816" />
                    <text x="171" y="149" fill="#FAF9F5" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      w₂={weightW2.toFixed(1)}
                    </text>

                    {/* Inputs */}
                    <g transform="translate(50, 40)">
                      <rect width="70" height="40" rx="2" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="35" y="25" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill="#1A1816">
                        x₁ = {x1Const.toFixed(1)}
                      </text>
                    </g>

                    <g transform="translate(50, 140)">
                      <rect width="70" height="40" rx="2" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="35" y="25" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill="#1A1816">
                        x₂ = {x2Const.toFixed(1)}
                      </text>
                    </g>

                    {/* Summation Node */}
                    <g transform="translate(200, 90)">
                      <rect width="70" height="40" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="35" y="25" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold" fill="#1A1816">
                        ∑(w·x)
                      </text>
                    </g>

                    {/* Output */}
                    <g transform="translate(330, 90)">
                      <rect width="70" height="40" rx="2" fill="#FFD670" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="35" y="25" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#1A1816">
                        z={weightedSum.toFixed(2)}
                      </text>
                    </g>
                  </svg>
                </div>

                {/* Sliders for w1 and w2 */}
                <div className="bg-[#FAF9F5] p-4 rounded-[2px] border border-[#1A1816]/15 grid grid-cols-2 gap-4 text-[11px] font-mono">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Weight w₁:</span>
                      <span className="font-bold text-[#1A1816]">{weightW1.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="3.0"
                      step="0.1"
                      value={weightW1}
                      onChange={(e) => setWeightW1(parseFloat(e.target.value))}
                      className="w-full accent-[#1A1816] cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Weight w₂:</span>
                      <span className="font-bold text-[#1A1816]">{weightW2.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="-2.0"
                      max="3.0"
                      step="0.1"
                      value={weightW2}
                      onChange={(e) => setWeightW2(parseFloat(e.target.value))}
                      className="w-full accent-[#1A1816] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* ========================================================================= */}
          {/* SECTION 3: ACTIVATION FUNCTIONS & HOW THEY SHAPE DECISION BOUNDARIES      */}
          {/* (Exact match to User's Uploaded Screenshots 1, 2, 3, 4!)                  */}
          {/* ========================================================================= */}
          <section className="pt-10 border-t border-[#1A1816]/15">
            {/* User Requested Header Narrative */}
            <div className="max-w-[860px] mx-auto mb-10 space-y-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#DE5D35] block">
                03 / LAYERS OF COMPUTATION
              </span>
              <h3 className="text-[28px] sm:text-[36px] font-black uppercase tracking-tight text-[#1A1816] font-display">
                Activation Functions
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.8]">
                As you can see, neural networks are not so complicated! They are just computational graphs, channeling
                inputs through successive layers of computation to generate outputs. This process of inference, whereby
                inputs are fed through the network to produce output predictions, is called the{" "}
                <strong className="text-[#1A1816] font-bold">forward pass</strong>. Let&apos;s talk more about those
                layers of computation, the activation functions.
              </p>
              <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.8]">
                Activation functions are at the heart of artificial neurons in a neural network. These crucial components
                introduce non-linearity into the model, transforming the weighted inputs to generate an output. Simply
                put, an activation function decides how much signal to pass onto the next layer based on the input it
                receives. This idea of chaining many weighted signals together is what allows neural networks to learn
                very complex relationships.
              </p>
              <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.8]">
                The non-linear nature of these functions is essential for neural networks to learn from complex data. If
                we only used linear activation functions, no matter how many layers we stacked, the network would behave
                just like a single-layer perceptron because the composition of linear functions is still a linear
                function. Non-linear activation functions enable the network to learn complex patterns and solve intricate
                problems by adding layers of abstraction.
              </p>
            </div>

            {/* MASTER INTERACTIVE DECISION BOUNDARY & REGRESSION SIMULATOR (Screenshots 1-4) */}
            <div className="rounded-[2px] border border-[#1A1816] p-6 sm:p-8 bg-[#FAF9F5] mb-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1A1816]/10 mb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#DE5D35] uppercase block">
                    LIVE COMPUTATIONAL GRAPH & FEATURE SPACE SIMULATOR
                  </span>
                  <h4 className="text-[20px] font-bold text-[#1A1816] mt-0.5">
                    Select Activation Function & Watch The Output Feature Space Change
                  </h4>
                </div>

                {/* Mode Selector Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: "sigmoid", label: "Sigmoid" },
                      { id: "linear", label: "Linear" },
                      { id: "step", label: "Step Function" },
                      { id: "relu", label: "ReLU" },
                      { id: "deep", label: "Deep MLP (No Limits)" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setActMode(m.id)}
                      className={`px-3 py-1.5 rounded-[2px] text-[11px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                        actMode === m.id
                          ? "bg-[#1A1816] text-[#FAF9F5]"
                          : "bg-transparent text-[#75716B] border border-[#1A1816]/15 hover:text-[#1A1816]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* The Visual Diagram Area (Blueprint Grid with Nodes & Output Feature Space Box) */}
              <div
                className="relative rounded-[2px] border border-[#1A1816] p-6 bg-[#EBF5FB] overflow-hidden"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #D8EAFD 1px, transparent 1px), linear-gradient(to bottom, #D8EAFD 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                {/* Header Labels (input layer / hidden layers / output layer) */}
                <div className="flex items-center text-[10px] font-mono font-bold tracking-widest uppercase mb-4">
                  <span className="w-1/4 text-[#75716B]">input layer</span>
                  <span className="w-1/2 text-center text-[#FF70A6]">
                    {actMode === "deep" ? "hidden layers (wide & deep)" : actMode === "step" ? "hidden layers (multi-step)" : "computation node"}
                  </span>
                  <span className="w-1/4 text-right text-[#EAB308]">output layer (y)</span>
                </div>

                {/* SVG Graph + 2D Decision Feature Space Output */}
                <div className="w-full flex items-center justify-center py-2">
                  <svg viewBox="0 0 540 260" className="w-full h-auto select-none max-w-[560px]">
                    {/* INPUT NODES X1 and X2 (All modes) */}
                    <g transform="translate(20, 60)">
                      <rect width="65" height="42" rx="2" fill="#FFE8D6" stroke="#1A1816" strokeWidth="2" />
                      <text x="32" y="26" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold">X₁</text>
                    </g>
                    <g transform="translate(20, 160)">
                      <rect width="65" height="42" rx="2" fill="#FFE8D6" stroke="#1A1816" strokeWidth="2" />
                      <text x="32" y="26" textAnchor="middle" fontSize="13" fontFamily="monospace" fontWeight="bold">X₂</text>
                    </g>

                    {/* Joint dots on input exits */}
                    <circle cx="95" cy="81" r="5" fill="#1A1816" />
                    <circle cx="95" cy="181" r="5" fill="#1A1816" />

                    {/* ======================================================= */}
                    {/* MODE 1: SIGMOID (Screenshot 1)                          */}
                    {/* ======================================================= */}
                    {actMode === "sigmoid" && (
                      <g className="transition-all duration-300">
                        {/* Wires */}
                        <path d="M 95 81 L 180 130" stroke="#1A1816" strokeWidth="2" />
                        <path d="M 95 181 L 180 130" stroke="#1A1816" strokeWidth="2" />
                        <text x="135" y="100" fontSize="9" fontFamily="monospace" fill="#1A1816">w</text>
                        <text x="135" y="165" fontSize="9" fontFamily="monospace" fill="#1A1816">w</text>

                        <line x1="250" y1="130" x2="330" y2="130" stroke="#1A1816" strokeWidth="2" />

                        {/* Sigmoid Node with S-curve inside */}
                        <g transform="translate(180, 105)">
                          <rect width="70" height="50" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="2" />
                          <path d="M 12 36 Q 28 36, 35 25 Q 42 14, 58 14" fill="none" stroke="#1A1816" strokeWidth="3" strokeLinecap="round" />
                          <text x="35" y="44" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">sigmoid</text>
                        </g>

                        {/* Output Box y: 2D DECISION BOUNDARY (Screenshot 1) */}
                        <g transform="translate(330, 45)">
                          <rect width="180" height="170" rx="2" fill="#7DD3FC" stroke="#1A1816" strokeWidth="2.5" />
                          
                          {/* Smooth Decision Boundary dividing pink vs blue */}
                          {(() => {
                            const rad = (boundaryAngle * Math.PI) / 180;
                            const yMid = 85 + boundaryOffset;
                            const dx = 90 * Math.cos(rad);
                            const dy = 90 * Math.sin(rad);
                            const p1x = 0;
                            const p1y = Math.max(0, Math.min(170, yMid - dy));
                            const p2x = 180;
                            const p2y = Math.max(0, Math.min(170, yMid + dy));
                            return (
                              <path
                                d={`M 0 170 L ${p1x} ${p1y} C 60 ${p1y - 15}, 120 ${p2y + 15}, ${p2x} ${p2y} L 180 170 Z`}
                                fill="#FBCFE8"
                              />
                            );
                          })()}

                          {/* Data points (pink vs blue dots) */}
                          {classificationDots.map((pt, i) => (
                            <circle
                              key={i}
                              cx={(pt.x / 200) * 180}
                              cy={(pt.y / 200) * 170}
                              r="4.5"
                              fill={pt.cluster === "pink" ? "#F472B6" : "#0284C7"}
                              stroke="#FAF9F5"
                              strokeWidth="1.5"
                            />
                          ))}
                          <text x="90" y="185" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">y</text>
                        </g>
                      </g>
                    )}

                    {/* ======================================================= */}
                    {/* MODE 2: LINEAR (Screenshot 2)                           */}
                    {/* ======================================================= */}
                    {actMode === "linear" && (
                      <g className="transition-all duration-300">
                        <path d="M 95 81 L 180 130" stroke="#1A1816" strokeWidth="2" />
                        <path d="M 95 181 L 180 130" stroke="#1A1816" strokeWidth="2" />
                        <text x="135" y="100" fontSize="9" fontFamily="monospace" fill="#1A1816">w</text>
                        <text x="135" y="165" fontSize="9" fontFamily="monospace" fill="#1A1816">w</text>

                        <circle cx="260" cy="130" r="5" fill="#1A1816" />
                        <line x1="260" y1="130" x2="330" y2="130" stroke="#1A1816" strokeWidth="2" />

                        {/* Linear Node with straight diagonal line inside */}
                        <g transform="translate(180, 105)">
                          <rect width="70" height="50" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="2" />
                          <line x1="12" y1="38" x2="58" y2="12" stroke="#FAF9F5" strokeWidth="4" strokeLinecap="round" />
                          <line x1="12" y1="38" x2="58" y2="12" stroke="#1A1816" strokeWidth="2" strokeLinecap="round" />
                          <text x="35" y="44" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">linear</text>
                        </g>

                        {/* Output Box y: SCATTER PLOT & REGRESSION LINE (Screenshot 2) */}
                        <g transform="translate(330, 45)">
                          <rect width="180" height="170" rx="2" fill="#FAF9F5" stroke="#1A1816" strokeWidth="2.5" />
                          
                          {/* Scatter Dots */}
                          {scatterDots.map((pt, i) => (
                            <circle
                              key={i}
                              cx={(pt.x / 200) * 180}
                              cy={(pt.y / 200) * 170}
                              r="4"
                              fill="#0284C7"
                            />
                          ))}

                          {/* Linear Fit Line */}
                          {(() => {
                            const yStart = 170 - (linearIntercept / 100) * 170;
                            const yEnd = 170 - ((linearSlope * 150 + linearIntercept) / 100) * 170;
                            return (
                              <>
                                <line x1="0" y1={yStart} x2="180" y2={yEnd} stroke="#FDE047" strokeWidth="7" strokeLinecap="square" />
                                <line x1="0" y1={yStart} x2="180" y2={yEnd} stroke="#1A1816" strokeWidth="2" strokeLinecap="square" />
                              </>
                            );
                          })()}
                          <text x="90" y="185" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">y</text>
                        </g>
                      </g>
                    )}

                    {/* ======================================================= */}
                    {/* MODE 3: STEP FUNCTION (Screenshot 3)                    */}
                    {/* ======================================================= */}
                    {actMode === "step" && (
                      <g className="transition-all duration-300">
                        <path d="M 95 81 L 140 130" stroke="#1A1816" strokeWidth="2" />
                        <path d="M 95 181 L 140 130" stroke="#1A1816" strokeWidth="2" />
                        <text x="115" y="100" fontSize="9" fontFamily="monospace">w</text>
                        <text x="115" y="165" fontSize="9" fontFamily="monospace">w</text>

                        {/* Step Node 1 */}
                        <g transform="translate(140, 105)">
                          <rect width="50" height="48" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="2" />
                          <path d="M 8 36 L 25 36 L 25 12 L 42 12" fill="none" stroke="#FAF9F5" strokeWidth="4" />
                          <path d="M 8 36 L 25 36 L 25 12 L 42 12" fill="none" stroke="#1A1816" strokeWidth="2" />
                          <text x="25" y="44" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold">step</text>
                        </g>

                        <line x1="190" y1="130" x2="225" y2="130" stroke="#1A1816" strokeWidth="2" />
                        <text x="207" y="123" fontSize="9" fontFamily="monospace">w</text>

                        {/* Step Node 2 */}
                        <g transform="translate(225, 105)">
                          <rect width="50" height="48" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="2" />
                          <path d="M 8 36 L 25 36 L 25 12 L 42 12" fill="none" stroke="#FAF9F5" strokeWidth="4" />
                          <path d="M 8 36 L 25 36 L 25 12 L 42 12" fill="none" stroke="#1A1816" strokeWidth="2" />
                          <text x="25" y="44" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold">step</text>
                        </g>

                        <circle cx="290" cy="130" r="5" fill="#1A1816" />
                        <line x1="290" y1="130" x2="330" y2="130" stroke="#1A1816" strokeWidth="2" />

                        {/* Output Box y: RIGHT-ANGLED STEP DECISION BOUNDARY (Screenshot 3) */}
                        <g transform="translate(330, 45)">
                          <rect width="180" height="170" rx="2" fill="#FBCFE8" stroke="#1A1816" strokeWidth="2.5" />
                          <rect x={70 + boundaryOffset * 0.5} y={70 + boundaryOffset * 0.5} width="110" height="100" fill="#7DD3FC" />

                          {classificationDots.map((pt, i) => (
                            <circle
                              key={i}
                              cx={(pt.x / 200) * 180}
                              cy={(pt.y / 200) * 170}
                              r="4.5"
                              fill={pt.cluster === "pink" ? "#F472B6" : "#0284C7"}
                              stroke="#FAF9F5"
                              strokeWidth="1.5"
                            />
                          ))}
                          <text x="90" y="185" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">y</text>
                        </g>
                      </g>
                    )}

                    {/* ======================================================= */}
                    {/* MODE 4: RELU                                            */}
                    {/* ======================================================= */}
                    {actMode === "relu" && (
                      <g className="transition-all duration-300">
                        <path d="M 95 81 L 180 130" stroke="#1A1816" strokeWidth="2" />
                        <path d="M 95 181 L 180 130" stroke="#1A1816" strokeWidth="2" />
                        <circle cx="260" cy="130" r="5" fill="#1A1816" />
                        <line x1="260" y1="130" x2="330" y2="130" stroke="#1A1816" strokeWidth="2" />

                        {/* ReLU Node with hinge curve inside */}
                        <g transform="translate(180, 105)">
                          <rect width="70" height="50" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="2" />
                          <path d="M 12 36 L 35 36 L 58 12" fill="none" stroke="#FAF9F5" strokeWidth="4" />
                          <path d="M 12 36 L 35 36 L 58 12" fill="none" stroke="#1A1816" strokeWidth="2" />
                          <text x="35" y="44" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">reLu</text>
                        </g>

                        {/* Output Box y: HINGE / BENT LINE BOUNDARY */}
                        <g transform="translate(330, 45)">
                          <rect width="180" height="170" rx="2" fill="#7DD3FC" stroke="#1A1816" strokeWidth="2.5" />
                          <path
                            d={`M 0 170 L 0 ${110 + boundaryOffset * 0.4} L ${90 + boundaryOffset * 0.3} 95 L 180 ${130 - boundaryAngle * 0.5} L 180 170 Z`}
                            fill="#FBCFE8"
                          />

                          {classificationDots.map((pt, i) => (
                            <circle
                              key={i}
                              cx={(pt.x / 200) * 180}
                              cy={(pt.y / 200) * 170}
                              r="4.5"
                              fill={pt.cluster === "pink" ? "#F472B6" : "#0284C7"}
                              stroke="#FAF9F5"
                              strokeWidth="1.5"
                            />
                          ))}
                          <text x="90" y="185" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">y</text>
                        </g>
                      </g>
                    )}

                    {/* ======================================================= */}
                    {/* MODE 5: DEEP MLP (Screenshot 4 - No Limits)             */}
                    {/* ======================================================= */}
                    {actMode === "deep" && (
                      <g className="transition-all duration-300">
                        {/* Synapses X -> Hidden Layer 1 (3 nodes) */}
                        {[81, 181].map((yIn, iIdx) =>
                          [55, 120, 185].map((yH, hIdx) => (
                            <line key={`s1-${iIdx}-${hIdx}`} x1="95" y1={yIn} x2="140" y2={yH} stroke="#1A1816" strokeWidth="1.5" />
                          ))
                        )}

                        {/* Hidden Layer 1: 3 ReLU nodes */}
                        {[55, 120, 185].map((yH, idx) => (
                          <g key={idx} transform={`translate(140, ${yH - 22})`}>
                            <rect width="45" height="40" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                            <path d="M 8 28 L 22 28 L 38 10" fill="none" stroke="#FAF9F5" strokeWidth="3" />
                            <path d="M 8 28 L 22 28 L 38 10" fill="none" stroke="#1A1816" strokeWidth="1.5" />
                            <text x="22" y="36" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold">reLu</text>
                          </g>
                        ))}

                        {/* Synapses Hidden Layer 1 -> Hidden Layer 2 (2 nodes) */}
                        {[55, 120, 185].map((yH1, h1Idx) =>
                          [85, 160].map((yH2, h2Idx) => (
                            <line key={`s2-${h1Idx}-${h2Idx}`} x1="185" y1={yH1} x2="235" y2={yH2} stroke="#1A1816" strokeWidth="1.5" />
                          ))
                        )}

                        {/* Joints between layers */}
                        <circle cx="210" cy="70" r="4" fill="#1A1816" />
                        <circle cx="210" cy="120" r="4" fill="#1A1816" />
                        <circle cx="210" cy="170" r="4" fill="#1A1816" />

                        {/* Hidden Layer 2: 2 Sigmoid nodes */}
                        {[85, 160].map((yH, idx) => (
                          <g key={idx} transform={`translate(235, ${yH - 22})`}>
                            <rect width="46" height="40" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                            <path d="M 8 28 Q 18 28, 23 20 Q 28 12, 38 12" fill="none" stroke="#FAF9F5" strokeWidth="3" />
                            <path d="M 8 28 Q 18 28, 23 20 Q 28 12, 38 12" fill="none" stroke="#1A1816" strokeWidth="1.5" />
                            <text x="23" y="36" textAnchor="middle" fontSize="8" fontFamily="monospace" fontWeight="bold">sigmoid</text>
                          </g>
                        ))}

                        {/* Synapses to Output Box */}
                        <circle cx="300" cy="120" r="5" fill="#1A1816" />
                        <line x1="281" y1="85" x2="330" y2="105" stroke="#1A1816" strokeWidth="1.8" />
                        <line x1="281" y1="160" x2="330" y2="145" stroke="#1A1816" strokeWidth="1.8" />

                        {/* Output Box y: COMPLEX CURVED NON-LINEAR MOONS (Screenshot 4) */}
                        <g transform="translate(330, 45)">
                          <rect width="180" height="170" rx="2" fill="#7DD3FC" stroke="#1A1816" strokeWidth="2.5" />
                          
                          {/* Intricate Multi-Layer Contour Boundary */}
                          <path
                            d={`M 0 0 L 180 0 L 180 120 C 130 110, 120 70, 70 85 C 40 95, 20 130, 0 140 Z`}
                            fill="#FBCFE8"
                          />

                          {classificationDots.map((pt, i) => (
                            <circle
                              key={i}
                              cx={(pt.x / 200) * 180}
                              cy={(pt.y / 200) * 170}
                              r="4.5"
                              fill={pt.cluster === "pink" ? "#F472B6" : "#0284C7"}
                              stroke="#FAF9F5"
                              strokeWidth="1.5"
                            />
                          ))}
                          <text x="90" y="185" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">y</text>
                        </g>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Interactive Sliders modifying Decision Boundary / Slope */}
                <div className="mt-4 pt-4 border-t border-[#D8EAFD] bg-[#FAF9F5] p-4 rounded-[2px] border border-[#1A1816]/15">
                  <span className="text-[11px] font-mono font-bold text-[#1A1816] block mb-2">
                    Adjust Boundary Parameters in Feature Space:
                  </span>

                  {actMode === "linear" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-mono">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Regression Slope (m):</span>
                          <span className="font-bold text-[#DE5D35]">{linearSlope.toFixed(2)}</span>
                        </div>
                        <input
                          type="range"
                          min="0.2"
                          max="2.2"
                          step="0.05"
                          value={linearSlope}
                          onChange={(e) => setLinearSlope(parseFloat(e.target.value))}
                          className="w-full accent-[#1A1816] cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Y-Intercept (b):</span>
                          <span className="font-bold text-[#DE5D35]">{linearIntercept.toFixed(1)}</span>
                        </div>
                        <input
                          type="range"
                          min="-20"
                          max="60"
                          step="1"
                          value={linearIntercept}
                          onChange={(e) => setLinearIntercept(parseFloat(e.target.value))}
                          className="w-full accent-[#1A1816] cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-mono">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Decision Boundary Angle / Tilt:</span>
                          <span className="font-bold text-[#DE5D35]">{boundaryAngle}°</span>
                        </div>
                        <input
                          type="range"
                          min="-60"
                          max="80"
                          step="2"
                          value={boundaryAngle}
                          onChange={(e) => setBoundaryAngle(parseFloat(e.target.value))}
                          className="w-full accent-[#1A1816] cursor-pointer"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Decision Threshold / Bias Offset:</span>
                          <span className="font-bold text-[#DE5D35]">{boundaryOffset}</span>
                        </div>
                        <input
                          type="range"
                          min="-45"
                          max="45"
                          step="2"
                          value={boundaryOffset}
                          onChange={(e) => setBoundaryOffset(parseFloat(e.target.value))}
                          className="w-full accent-[#1A1816] cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* ACTIVATION FUNCTIONS COMPARISON TABLE (Rendered with KaTeX!)              */}
            {/* ========================================================================= */}
            <div className="max-w-[860px] mx-auto mt-12 space-y-6">
              <h4 className="text-[18px] font-mono font-bold uppercase tracking-wider text-[#1A1816] border-b border-[#1A1816]/15 pb-2">
                Four Popular Activation Functions
              </h4>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                There&apos;s a diverse range of activation functions utilized in neural networks, each with its unique
                benefits and applications. Here are four foundational activation functions:
              </p>

              {/* Table */}
              <div className="border border-[#1A1816]/20 rounded-[2px] overflow-x-auto bg-[#FAF9F5]">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#1A1816]/20 bg-[#F4F1EA] text-[11px] font-mono uppercase text-[#1A1816]">
                      <th className="p-3.5 font-bold">Name</th>
                      <th className="p-3.5 font-bold">Plot</th>
                      <th className="p-3.5 font-bold">Mathematical Function</th>
                      <th className="p-3.5 font-bold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1816]/10 font-mono">
                    {/* Sigmoid */}
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#1A1816]">Sigmoid (logistic)</td>
                      <td className="p-3.5">
                        <svg width="60" height="32" viewBox="0 0 60 32" className="stroke-[#1A1816]">
                          <line x1="5" y1="28" x2="55" y2="28" stroke="#D9D6CF" strokeWidth="1" />
                          <path d="M 8 26 Q 25 26, 30 16 Q 35 6, 52 6" fill="none" stroke="#DE5D35" strokeWidth="2.2" />
                        </svg>
                      </td>
                      <td className="p-3.5">
                        <MathTex math="f(x) = \frac{1}{1 + e^{-x}}" />
                      </td>
                      <td className="p-3.5 text-[#475569] font-sans text-[12px]">
                        Squashes input into calibrated range <MathTex math="(0, 1)" />.
                      </td>
                    </tr>

                    {/* Tanh */}
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#1A1816]">Hyperbolic Tangent (tanh)</td>
                      <td className="p-3.5">
                        <svg width="60" height="32" viewBox="0 0 60 32" className="stroke-[#1A1816]">
                          <line x1="5" y1="16" x2="55" y2="16" stroke="#D9D6CF" strokeWidth="1" />
                          <path d="M 8 28 Q 24 28, 30 16 Q 36 4, 52 4" fill="none" stroke="#DE5D35" strokeWidth="2.2" />
                        </svg>
                      </td>
                      <td className="p-3.5">
                        <MathTex math="f(x) = \frac{e^x - e^{-x}}{e^x + e^{-x}}" />
                      </td>
                      <td className="p-3.5 text-[#475569] font-sans text-[12px]">
                        Zero-centered output squashed into <MathTex math="(-1, 1)" />.
                      </td>
                    </tr>

                    {/* ReLU */}
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#1A1816]">Rectified Linear Unit (ReLU)</td>
                      <td className="p-3.5">
                        <svg width="60" height="32" viewBox="0 0 60 32" className="stroke-[#1A1816]">
                          <line x1="5" y1="26" x2="55" y2="26" stroke="#D9D6CF" strokeWidth="1" />
                          <path d="M 8 26 L 30 26 L 52 6" fill="none" stroke="#DE5D35" strokeWidth="2.2" />
                        </svg>
                      </td>
                      <td className="p-3.5">
                        <MathTex math="f(x) = \begin{cases} 0 & \text{if } x < 0 \\ x & \text{if } x \ge 0 \end{cases}" />
                      </td>
                      <td className="p-3.5 text-[#475569] font-sans text-[12px]">
                        Only keeps positive values; fast and prevents saturation.
                      </td>
                    </tr>

                    {/* Step Function */}
                    <tr className="hover:bg-white/50 transition-colors">
                      <td className="p-3.5 font-bold text-[#1A1816]">Step Function (Perceptron)</td>
                      <td className="p-3.5">
                        <svg width="60" height="32" viewBox="0 0 60 32" className="stroke-[#1A1816]">
                          <line x1="5" y1="16" x2="55" y2="16" stroke="#D9D6CF" strokeWidth="1" />
                          <path d="M 8 26 L 30 26 L 30 6 L 52 6" fill="none" stroke="#DE5D35" strokeWidth="2.2" />
                        </svg>
                      </td>
                      <td className="p-3.5">
                        <MathTex math="f(x) = \begin{cases} +1 & \text{if } x \ge 0 \\ -1 & \text{if } x < 0 \end{cases}" />
                      </td>
                      <td className="p-3.5 text-[#475569] font-sans text-[12px]">
                        Binary step: neuron fires (<MathTex math="+1" />) or remains silent (<MathTex math="-1" />).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Detailed Narrative Insights */}
              <div className="space-y-4 text-[15px] sm:text-[16px] text-[#475569] leading-[1.8] pt-4">
                <p>
                  The <strong className="text-[#1A1816]">sigmoid (or logistic)</strong> function, which ranges from 0 to 1,
                  is particularly useful in the output layer of binary classification models, representing the probability
                  of a binary event. However, it can suffer from the vanishing gradients problem during backpropagation.
                </p>
                <p>
                  The <strong className="text-[#1A1816]">hyperbolic tangent (tanh)</strong> function, which ranges from -1
                  to 1, provides a zero-centered output designed to make learning for the next layer easier. Yet, like
                  sigmoid, it also faces vanishing gradients at extreme values.
                </p>
                <p>
                  The <strong className="text-[#1A1816]">Rectified Linear Unit (ReLU)</strong> function is the ubiquitous
                  choice in hidden layers due to computational efficiency and gradient propagation. It activates a node
                  linearly if its input is positive; otherwise, it outputs zero.
                </p>
                <p>
                  Despite their simplicity, chaining these functions together in a neural network yields powerful
                  geometric representations. The best choice depends on data distributions, computational constraints, and
                  network depth.
                </p>
              </div>
            </div>
          </section>


          {/* SECTION 4: MULTI-LAYER PERCEPTRON IN A CONTINUOUS LOOP */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-[#1A1816]/15">
            {/* Explanation (Left) */}
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#DE5D35] block">
                04 / TOPOLOGY & LOOPING SIGNALS
              </span>
              <h3 className="text-[24px] sm:text-[28px] font-black uppercase tracking-tight text-[#1A1816] font-display">
                Multi-Layer Perceptron (MLP)
              </h3>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                We expand the network by stacking intermediate &apos;hidden&apos; layers between input sensors and output classifiers.
                Each hidden neuron becomes a specialized feature detector.
              </p>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                Notice the continuous transmission wave running in an infinite loop on the canvas: signals propagate
                rhythmically across the bipartite synaptic mesh, progressively assembling low-level edges into high-level concepts.
              </p>
            </div>

            {/* Visual Canvas with LOOPING ANIMATION (Right) */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div
                className="relative rounded-[2px] border border-[#1A1816] p-6 bg-[#EBF5FB]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #D8EAFD 1px, transparent 1px), linear-gradient(to bottom, #D8EAFD 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#75716B] mb-4 pb-2 border-b border-[#D8EAFD]">
                  <span className="font-bold text-[#1A1816]">FIGURE 04 · BIPARTITE SYNAPSE MESH</span>
                  <span className="flex items-center gap-1.5 text-[#DE5D35] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#DE5D35] animate-ping" />
                    LIVE SIGNAL LOOP
                  </span>
                </div>

                <div className="w-full flex items-center justify-center py-4">
                  <svg viewBox="0 0 460 260" className="w-full h-auto select-none max-w-[440px]">
                    {[65, 175].map((yIn, iIdx) =>
                      [45, 120, 195].map((yH, hIdx) => (
                        <line
                          key={`syn-${iIdx}-${hIdx}`}
                          x1="75"
                          y1={yIn}
                          x2="225"
                          y2={yH}
                          stroke="#1A1816"
                          strokeWidth="1.8"
                          strokeDasharray="4 4"
                          strokeDashoffset={-loopPhase * 1.5}
                        />
                      ))
                    )}

                    {[45, 120, 195].map((yH, hIdx) => (
                      <line
                        key={`syn-out-${hIdx}`}
                        x1="245"
                        y1={yH}
                        x2="375"
                        y2={120}
                        stroke="#DE5D35"
                        strokeWidth="2.2"
                        strokeDasharray="4 4"
                        strokeDashoffset={-loopPhase * 2}
                      />
                    ))}

                    <circle cx="65" cy="65" r="18" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="65" y="69" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">x₁</text>

                    <circle cx="65" cy="175" r="18" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="65" y="179" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">x₂</text>

                    {[45, 120, 195].map((yH, idx) => (
                      <g key={idx}>
                        <circle cx="235" cy={yH} r="20" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                        <text x="235" y={yH + 4} textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#1A1816">
                          h{idx + 1}
                        </text>
                      </g>
                    ))}

                    <circle cx="385" cy="120" r="22" fill="#FFD670" stroke="#1A1816" strokeWidth="2" />
                    <text x="385" y="124" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold" fill="#1A1816">
                      ŷ
                    </text>

                    <text x="65" y="240" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#75716B" fontWeight="bold">INPUT</text>
                    <text x="235" y="240" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#75716B" fontWeight="bold">HIDDEN LAYER</text>
                    <text x="385" y="240" textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#75716B" fontWeight="bold">OUTPUT</text>
                  </svg>
                </div>

                <div className="text-[11px] font-mono text-[#75716B] pt-2 border-t border-[#D8EAFD]">
                  *Loop animation actively simulates rhythmic activation voltage propagation.
                </div>
              </div>
            </div>
          </section>


          {/* SECTION 5: LIVE FORWARD PASS WITH INTERACTIVE SENSOR SLIDERS */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-[#1A1816]/15">
            {/* Visual Canvas (Left) */}
            <div className="lg:col-span-7">
              <div
                className="relative rounded-[2px] border border-[#1A1816] p-6 bg-[#EBF5FB]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #D8EAFD 1px, transparent 1px), linear-gradient(to bottom, #D8EAFD 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#75716B] mb-4 pb-2 border-b border-[#D8EAFD]">
                  <span className="font-bold text-[#1A1816]">FIGURE 05 · LIVE NUMERICAL COMPUTE</span>
                  <span className="text-[#DE5D35] font-bold font-mono">Prediction ŷ = {forwardResult.out.toFixed(3)}</span>
                </div>

                <div className="w-full flex items-center justify-center py-4">
                  <svg viewBox="0 0 460 250" className="w-full h-auto select-none max-w-[440px]">
                    {[65, 175].map((yIn, iIdx) =>
                      [45, 120, 195].map((yH, hIdx) => (
                        <line key={`fwd-${iIdx}-${hIdx}`} x1="75" y1={yIn} x2="225" y2={yH} stroke="#1A1816" strokeWidth="1.8" />
                      ))
                    )}

                    {[45, 120, 195].map((yH, hIdx) => (
                      <line key={`fwd-out-${hIdx}`} x1="245" y1={yH} x2="375" y2={120} stroke="#DE5D35" strokeWidth="2.2" />
                    ))}

                    {/* Inputs with real values */}
                    <circle cx="65" cy="65" r="20" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="65" y="69" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {inputX1.toFixed(1)}
                    </text>

                    <circle cx="65" cy="175" r="20" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="65" y="179" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {inputX2.toFixed(1)}
                    </text>

                    {/* Hidden Activations */}
                    <circle cx="235" cy="45" r="21" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="235" y="49" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {forwardResult.h1.toFixed(2)}
                    </text>

                    <circle cx="235" cy="120" r="21" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="235" y="124" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {forwardResult.h2.toFixed(2)}
                    </text>

                    <circle cx="235" cy="195" r="21" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="235" y="199" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {forwardResult.h3.toFixed(2)}
                    </text>

                    {/* Output */}
                    <circle cx="385" cy="120" r="23" fill="#FFD670" stroke="#1A1816" strokeWidth="2" />
                    <text x="385" y="124" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      {forwardResult.out.toFixed(3)}
                    </text>
                  </svg>
                </div>

                {/* Sliders */}
                <div className="bg-[#FAF9F5] p-4 rounded-[2px] border border-[#1A1816]/15 grid grid-cols-2 gap-4 text-[11px] font-mono">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Input Sensor x₁:</span>
                      <span className="font-bold text-[#1A1816]">{inputX1.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="-1.5"
                      max="2.5"
                      step="0.1"
                      value={inputX1}
                      onChange={(e) => setInputX1(parseFloat(e.target.value))}
                      className="w-full accent-[#1A1816] cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Input Sensor x₂:</span>
                      <span className="font-bold text-[#1A1816]">{inputX2.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="-1.5"
                      max="2.5"
                      step="0.1"
                      value={inputX2}
                      onChange={(e) => setInputX2(parseFloat(e.target.value))}
                      className="w-full accent-[#1A1816] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation (Right) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#DE5D35] block">
                05 / FORWARD PASS
              </span>
              <h3 className="text-[24px] sm:text-[28px] font-black uppercase tracking-tight text-[#1A1816] font-display">
                The Forward Pass: Live Calculations
              </h3>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                During the forward pass, numerical vectors enter at the left sensors. Each hidden neuron takes the linear
                combination of all inputs, applies the activation function, and exposes its internal activation.
              </p>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                Adjust the sensor sliders on the left: watch the internal activations inside h₁, h₂, and h₃ recalculate
                immediately, culminating in the terminal prediction <MathTex math="\hat{y}" />.
              </p>
            </div>
          </section>


          {/* ========================================================================= */}
          {/* SECTION 6: BACKPROPAGATION & GRADIENT FEEDBACK LOOP                       */}
          {/* ========================================================================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 border-t border-[#1A1816]/15">
            {/* Explanation (Left) */}
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-4">
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#DE5D35] block">
                06 / HOW NETWORKS LEARN
              </span>
              <h3 className="text-[24px] sm:text-[28px] font-black uppercase tracking-tight text-[#1A1816] font-display">
                Backpropagation: How Networks Learn
              </h3>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                Now that we&apos;ve grasped the concept of activation functions and their role in neural networks,
                it&apos;s time to understand how these networks learn. The magic behind this learning process is a
                technique known as <strong className="text-[#1A1816] font-bold">backpropagation</strong>.
              </p>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                Backpropagation is an algorithm used during the training of neural networks. The goal of backpropagation
                is to update the weights so that the Neural Network makes better predictions. Specifically, backpropagation
                will calculate the gradient of the loss function with respect to the weights of the network, updating
                the weights layer-by-layer to minimize the network&apos;s prediction error.
              </p>
              <p className="text-[15px] text-[#475569] leading-[1.75]">
                Notice the reverse loop on the right: the error signal travels backward from the Loss node, flowing
                through the multivariable chain rule to update every weight parameter in the graph.
              </p>
            </div>

            {/* Visual Canvas with BACKWARD ERROR FEEDBACK LOOP (Right) */}
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div
                className="relative rounded-[2px] border border-[#1A1816] p-6 bg-[#EBF5FB]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #D8EAFD 1px, transparent 1px), linear-gradient(to bottom, #D8EAFD 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-[#75716B] mb-4 pb-2 border-b border-[#D8EAFD]">
                  <span className="font-bold text-[#1A1816]">FIGURE 06 · BACKWARD FEEDBACK LOOP</span>
                  <span className="text-[#DE5D35] font-bold font-mono">∂L/∂w GRADIENT ARCS</span>
                </div>

                <div className="w-full flex items-center justify-center py-4">
                  <svg viewBox="0 0 460 240" className="w-full h-auto select-none max-w-[440px]">
                    <path d="M 60 120 L 160 120" stroke="#75716B" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 220 120 L 300 120" stroke="#75716B" strokeWidth="1.5" strokeDasharray="3 3" />
                    <path d="M 340 120 L 380 120" stroke="#DE5D35" strokeWidth="2" />

                    {/* THE BACKWARD ERROR FEEDBACK LOOP */}
                    <path
                      d="M 395 95 C 395 15, 185 15, 185 85"
                      fill="none"
                      stroke="#DE5D35"
                      strokeWidth="2.5"
                      strokeDasharray="5 5"
                      strokeDashoffset={loopPhase * 1.8}
                    />
                    <polygon points="185,90 179,78 191,80" fill="#DE5D35" />

                    <rect x="235" y="10" width="130" height="22" rx="2" fill="#1A1816" />
                    <text x="300" y="25" fill="#FAF9F5" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                      ← ∂L/∂w Loop
                    </text>

                    {/* Secondary Loop from Hidden to Input */}
                    <path
                      d="M 185 135 C 185 190, 70 190, 70 135"
                      fill="none"
                      stroke="#1A1816"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      strokeDashoffset={loopPhase * 1.5}
                    />
                    <polygon points="70,130 64,142 76,140" fill="#1A1816" />
                    <text x="125" y="185" fill="#1A1816" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      ← Gradient to Inputs
                    </text>

                    {/* Nodes */}
                    <circle cx="50" cy="120" r="18" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="50" y="124" textAnchor="middle" fontSize="10" fontFamily="monospace">x_in</text>

                    <g transform="translate(160, 100)">
                      <rect width="60" height="40" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="30" y="25" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">Hidden</text>
                    </g>

                    <g transform="translate(285, 100)">
                      <rect width="60" height="40" rx="2" fill="#FFD670" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="30" y="25" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">Output ŷ</text>
                    </g>

                    {/* Loss Node */}
                    <g transform="translate(375, 100)">
                      <rect width="68" height="40" rx="2" fill="#FAF9F5" stroke="#DE5D35" strokeWidth="1.8" />
                      <text x="34" y="25" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill="#DE5D35">
                        Loss(ŷ, y)
                      </text>
                    </g>
                  </svg>
                </div>
                <div className="text-[11px] font-mono text-[#75716B] pt-2 border-t border-[#D8EAFD]">
                  *Curved feedback loops convey continuous chain-rule error signals flowing backward to update weights.
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 7: FULL ANIMATED TRAINING LOOP (Continuous End-to-End Cycle)      */}
          {/* Forward Pass -> Highlight Errors -> Compute Loss -> Backprop -> Repeat    */}
          {/* ========================================================================= */}
          <section className="pt-12 border-t border-[#1A1816]/15">
            <div className="max-w-[860px] mx-auto mb-8 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#DE5D35] block">
                  07 / CONTINUOUS TRAINING CYCLE
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#75716B]">SPEED:</span>
                  <button
                    type="button"
                    onClick={() => setLoopSpeed((s) => (s === 1 ? 2 : 1))}
                    className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-[2px] bg-[#FAF9F5] border border-[#1A1816]/20 hover:bg-[#1A1816] hover:text-[#FAF9F5] cursor-pointer"
                  >
                    {loopSpeed}x
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLoopPlaying((p) => !p)}
                    className="px-2.5 py-0.5 text-[11px] font-mono font-bold rounded-[2px] bg-[#1A1816] text-[#FAF9F5] cursor-pointer hover:bg-[#DE5D35] transition-colors"
                  >
                    {isLoopPlaying ? "⏸ Pause Loop" : "▶ Play Loop"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTrainingPhase((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
                    }}
                    className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-[2px] bg-[#FAF9F5] border border-[#1A1816]/20 hover:bg-[#1A1816] hover:text-[#FAF9F5] cursor-pointer"
                  >
                    Step ⏭
                  </button>
                </div>
              </div>

              <h3 className="text-[28px] sm:text-[34px] font-black uppercase tracking-tight text-[#1A1816] font-display">
                The Full Training Loop in Motion
              </h3>
              <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.8]">
                Every epoch in deep learning executes an unbroken circular dance:{" "}
                <strong className="text-[#1A1816] font-bold">Forward Pass</strong> sends data through weights,{" "}
                <strong className="text-[#1A1816] font-bold">Highlighting Errors</strong> flags misclassified samples,{" "}
                <strong className="text-[#1A1816] font-bold">Calculate Loss</strong> measures prediction discrepancy, and{" "}
                <strong className="text-[#1A1816] font-bold">Backpropagation</strong> streams gradients in reverse to update
                every synapse before repeating the next forward pass.
              </p>
            </div>

            {/* Canvas Container */}
            <div
              className="relative rounded-[2px] border border-[#1A1816] p-6 bg-[#EBF5FB] overflow-hidden"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #D8EAFD 1px, transparent 1px), linear-gradient(to bottom, #D8EAFD 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            >
              {/* Top Status Bar: 4 Step Breadcrumb Indicator */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-[11px] font-mono">
                {[
                  { id: 0, label: "1. Forward Pass", icon: "⚡" },
                  { id: 1, label: "2. Highlight Errors", icon: "⚠️" },
                  { id: 2, label: "3. Calculate Loss", icon: "🎯" },
                  { id: 3, label: "4. Backprop Loop", icon: "🔄" },
                ].map((st) => (
                  <div
                    key={st.id}
                    onClick={() => setTrainingPhase(st.id as 0 | 1 | 2 | 3)}
                    className={`p-2 rounded-[2px] border transition-all cursor-pointer text-center ${
                      trainingPhase === st.id
                        ? "bg-[#1A1816] text-[#FAF9F5] border-[#1A1816] font-bold shadow-xs"
                        : "bg-[#FAF9F5]/70 text-[#75716B] border-[#D8EAFD] hover:text-[#1A1816]"
                    }`}
                  >
                    <span>{st.icon} {st.label}</span>
                  </div>
                ))}
              </div>

              {/* Real-time Metric Banner */}
              <div className="flex items-center justify-between text-[11px] font-mono text-[#75716B] mb-3 pb-2 border-b border-[#D8EAFD]">
                <span className="font-bold text-[#1A1816]">
                  {trainingPhase === 0 && "⚡ PHASE 1: FORWARD INFERENCE PASS THROUGH COMPUTE NODES"}
                  {trainingPhase === 1 && "⚠️ PHASE 2: EVALUATING PREDICTIONS & HIGHLIGHTING MISCLASSIFIED POINTS"}
                  {trainingPhase === 2 && "🎯 PHASE 3: COMPUTING LOSS PENALTY L(ŷ, y)"}
                  {trainingPhase === 3 && "🔄 PHASE 4: RETROGRADE ERROR FLOW ∂L/∂w & WEIGHT UPDATES"}
                </span>
                <span className="text-[#DE5D35] font-bold">
                  EPOCH {loopEpoch} · LOSS: {(0.68 / Math.sqrt(loopEpoch)).toFixed(3)}
                </span>
              </div>

              {/* Master End-to-End Visual SVG */}
              <div className="w-full flex items-center justify-center py-2">
                <svg viewBox="0 0 580 270" className="w-full h-auto select-none max-w-[600px]">
                  {/* Inputs X1, X2 */}
                  <g transform="translate(15, 60)">
                    <rect width="55" height="36" rx="2" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="27" y="23" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold">X₁</text>
                  </g>
                  <g transform="translate(15, 150)">
                    <rect width="55" height="36" rx="2" fill="#FFE8D6" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="27" y="23" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold">X₂</text>
                  </g>

                  {/* Synapses: Inputs -> Hidden (animated in Phase 0) */}
                  {[78, 168].map((yIn, iIdx) =>
                    [55, 115, 175].map((yH, hIdx) => (
                      <line
                        key={`train-syn1-${iIdx}-${hIdx}`}
                        x1="70"
                        y1={yIn}
                        x2="155"
                        y2={yH}
                        stroke={trainingPhase === 0 ? "#DE5D35" : "#1A1816"}
                        strokeWidth={trainingPhase === 0 ? "2.5" : "1.2"}
                        strokeDasharray={trainingPhase === 0 ? "4 4" : "none"}
                        strokeDashoffset={trainingPhase === 0 ? -loopPhase * 2 : 0}
                      />
                    ))
                  )}

                  {/* Hidden Layer: 3 ReLU nodes */}
                  {[55, 115, 175].map((yH, idx) => (
                    <g key={idx} transform={`translate(155, ${yH - 18})`}>
                      <rect width="50" height="36" rx="2" fill="#FF70A6" stroke="#1A1816" strokeWidth="1.8" />
                      <text x="25" y="22" textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        h{idx + 1}
                      </text>
                    </g>
                  ))}

                  {/* Synapses: Hidden -> Output (animated in Phase 0) */}
                  {[55, 115, 175].map((yH, hIdx) => (
                    <line
                      key={`train-syn2-${hIdx}`}
                      x1="205"
                      y1={yH}
                      x2="265"
                      y2={115}
                      stroke={trainingPhase === 0 ? "#DE5D35" : "#1A1816"}
                      strokeWidth={trainingPhase === 0 ? "2.8" : "1.5"}
                      strokeDasharray={trainingPhase === 0 ? "4 4" : "none"}
                      strokeDashoffset={trainingPhase === 0 ? -loopPhase * 2 : 0}
                    />
                  ))}

                  {/* Output Node (ŷ) */}
                  <g transform="translate(265, 95)">
                    <rect width="50" height="40" rx="2" fill="#FFD670" stroke="#1A1816" strokeWidth="1.8" />
                    <text x="25" y="25" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">ŷ</text>
                  </g>

                  {/* Connection from ŷ to 2D Feature Space Box */}
                  <line x1="315" y1="115" x2="360" y2="115" stroke="#1A1816" strokeWidth="2" />

                  {/* 2D FEATURE SPACE BOX (Shows dots and decision boundary) */}
                  <g transform="translate(360, 20)">
                    <rect width="190" height="155" rx="2" fill="#7DD3FC" stroke="#1A1816" strokeWidth="2" />

                    {/* Decision Boundary (narrows / improves slightly with epoch) */}
                    {(() => {
                      const tilt = Math.sin(loopEpoch * 0.5) * 10;
                      return (
                        <path
                          d={`M 0 155 L 0 ${95 - tilt} C 60 ${75 - tilt}, 120 ${105 + tilt}, 190 ${85 + tilt} L 190 155 Z`}
                          fill="#FBCFE8"
                        />
                      );
                    })()}

                    {/* Correct & Misclassified Data Dots */}
                    {/* Pink dots */}
                    {[
                      { x: 30, y: 125, err: false },
                      { x: 50, y: 110, err: false },
                      { x: 75, y: 100, err: false },
                      { x: 100, y: 95, err: false },
                      { x: 130, y: 105, err: false },
                      { x: 155, y: 120, err: false },
                      // Misclassified pink dots in blue territory:
                      { x: 45, y: 55, err: true },
                      { x: 140, y: 65, err: true },
                    ].map((pt, i) => {
                      const isErr = pt.err && (trainingPhase === 1 || trainingPhase === 2);
                      return (
                        <g key={`p-${i}`}>
                          {isErr && (
                            <circle cx={pt.x} cy={pt.y} r="10" fill="#EF4444" fillOpacity="0.4" className="animate-ping" />
                          )}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isErr ? "5.5" : "4.5"}
                            fill={isErr ? "#EF4444" : "#F472B6"}
                            stroke={isErr ? "#FAF9F5" : "#FAF9F5"}
                            strokeWidth={isErr ? "2" : "1.2"}
                          />
                        </g>
                      );
                    })}

                    {/* Blue dots */}
                    {[
                      { x: 60, y: 40, err: false },
                      { x: 90, y: 45, err: false },
                      { x: 120, y: 50, err: false },
                      { x: 160, y: 40, err: false },
                      { x: 175, y: 60, err: false },
                      // Misclassified blue dots in pink territory:
                      { x: 80, y: 135, err: true },
                      { x: 115, y: 125, err: true },
                    ].map((pt, i) => {
                      const isErr = pt.err && (trainingPhase === 1 || trainingPhase === 2);
                      return (
                        <g key={`b-${i}`}>
                          {isErr && (
                            <circle cx={pt.x} cy={pt.y} r="10" fill="#EF4444" fillOpacity="0.4" className="animate-ping" />
                          )}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isErr ? "5.5" : "4.5"}
                            fill={isErr ? "#EF4444" : "#0284C7"}
                            stroke="#FAF9F5"
                            strokeWidth={isErr ? "2" : "1.2"}
                          />
                        </g>
                      );
                    })}

                    {/* Label */}
                    <text x="95" y="145" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      Feature Space (y)
                    </text>
                  </g>

                  {/* Error Projection Rays from Misclassified Points to Loss Node (in Phase 2) */}
                  {trainingPhase === 2 && (
                    <g>
                      <path
                        d="M 405 75 C 440 180, 320 220, 240 220"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        className="animate-pulse"
                      />
                      <path
                        d="M 500 85 C 500 180, 320 220, 240 220"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2"
                        strokeDasharray="3 3"
                        className="animate-pulse"
                      />
                    </g>
                  )}

                  {/* OBJECTIVE LOSS NODE (Bottom Center) */}
                  <g transform="translate(170, 205)">
                    <rect
                      width="140"
                      height="44"
                      rx="2"
                      fill={trainingPhase === 2 ? "#FEE2E2" : "#FAF9F5"}
                      stroke={trainingPhase === 2 ? "#EF4444" : "#1A1816"}
                      strokeWidth={trainingPhase === 2 ? "2.5" : "1.8"}
                    />
                    <text x="70" y="20" textAnchor="middle" fontSize="10" fontFamily="monospace" fontWeight="bold" fill={trainingPhase === 2 ? "#991B1B" : "#1A1816"}>
                      Loss L(ŷ, y)
                    </text>
                    <text x="70" y="34" textAnchor="middle" fontSize="9" fontFamily="monospace" fill={trainingPhase === 2 ? "#EF4444" : "#75716B"}>
                      {(0.68 / Math.sqrt(loopEpoch)).toFixed(3)}
                    </text>
                  </g>

                  {/* BACKPROPAGATION REVERSE GRADIENT ARCS (Active in Phase 3) */}
                  {trainingPhase === 3 && (
                    <g>
                      {/* Arc from Loss back to Hidden Layer */}
                      <path
                        d="M 170 225 C 100 225, 110 140, 155 115"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="3"
                        strokeDasharray="4 4"
                        strokeDashoffset={loopPhase * 2}
                      />
                      <polygon points="155,115 145,123 147,110" fill="#EF4444" />

                      {/* Arc from Hidden Layer back to Inputs */}
                      <path
                        d="M 155 95 C 110 70, 100 70, 70 78"
                        fill="none"
                        stroke="#DE5D35"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                        strokeDashoffset={loopPhase * 2}
                      />
                      <polygon points="70,78 82,72 80,85" fill="#DE5D35" />

                      {/* Gradient Badge */}
                      <rect x="55" y="195" width="95" height="20" rx="2" fill="#1A1816" />
                      <text x="102" y="209" fill="#FAF9F5" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                        ← ∂L/∂w Loop
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Bottom Context Narrative */}
              <div className="mt-4 pt-3 border-t border-[#D8EAFD] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#75716B]">
                <span>
                  {trainingPhase === 0 && "1/4: Inputs ripple forward across synaptic weights to output neuron ŷ."}
                  {trainingPhase === 1 && "2/4: Output decision boundary evaluates data; 4 misclassified dots pulse in red."}
                  {trainingPhase === 2 && "3/4: Penalty vectors flow to Loss node, measuring total cross-entropy error."}
                  {trainingPhase === 3 && "4/4: Reverse chain-rule gradients ∂L/∂w loop backward to update weights."}
                </span>
                <span className="text-[#1A1816] font-bold">
                  {isLoopPlaying ? "Cycle Running Automatically 🔄" : "Loop Paused ⏸"}
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* ========================================================================= */}
        {/* MATHEMATICAL DERIVATIONS & CODE WITH SYNTAX HIGHLIGHTING                  */}
        {/* ========================================================================= */}
        <section className="shell max-w-[860px] mx-auto mt-24 pt-12 border-t border-[#1A1816]/15 space-y-12">
          {/* Mathematical Formulations in KaTeX */}
          <div>
            <h2 className="text-[12px] font-mono font-bold tracking-[0.2em] uppercase text-[#1A1816] border-b border-[#1A1816]/15 pb-2 mb-4">
              MATHEMATICAL FORMULATION: MULTIVARIABLE CHAIN RULE
            </h2>
            <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.8] mb-4">
              To evaluate weight updates across successive layers, the chain rule decomposes the total derivative of the
              loss with respect to any arbitrary connection weight <MathTex math="w_{ij}^{(l)}" />:
            </p>

            <div className="bg-[#FAF9F5] border border-[#1A1816] p-5 rounded-[2px] text-center my-4 overflow-x-auto">
              <MathTex
                math="\frac{\partial \mathcal{L}}{\partial w_{ij}^{(l)}} = \frac{\partial \mathcal{L}}{\partial a^{(L)}} \cdot \frac{\partial a^{(L)}}{\partial z^{(L)}} \cdot \prod_{k=l+1}^{L-1} \frac{\partial z^{(k)}}{\partial z^{(k-1)}} \cdot \frac{\partial z^{(l)}}{\partial w_{ij}^{(l)}}"
                block={true}
              />
            </div>

            <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.8]">
              Once these error derivatives are compiled across all training instances, the weights are updated via
              Stochastic Gradient Descent (SGD) parameterized by learning rate <MathTex math="\eta" />:
            </p>

            <div className="bg-[#1A1816] text-[#FAF9F5] p-4 rounded-[2px] text-center max-w-[340px] mx-auto mt-4">
              <MathTex math="w_{\text{new}} = w_{\text{old}} - \eta \cdot \nabla_w \mathcal{L}(w)" block={true} />
            </div>
          </div>

          {/* PyTorch Reference with Clean Syntax Highlighting */}
          <div>
            <div className="flex items-center justify-between border-b border-[#1A1816]/15 pb-2 mb-4">
              <h2 className="text-[12px] font-mono font-bold tracking-[0.2em] uppercase text-[#1A1816]">
                PYTORCH REFERENCE IMPLEMENTATION
              </h2>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 text-[11px] font-mono rounded-[2px] bg-[#FAF9F5] border border-[#1A1816]/20 hover:bg-[#1A1816] hover:text-[#FAF9F5] transition-colors cursor-pointer"
              >
                {copied ? "✓ Copied" : "Copy Code"}
              </button>
            </div>

            <p className="text-[15px] text-[#475569] mb-3">
              Here is how this feedforward computational graph and activation pipeline is declared in modern PyTorch:
            </p>

            {/* Syntax Highlighted Code Container */}
            <div className="bg-[#161513] text-[#FAF9F5] p-5 rounded-[2px] font-mono text-[12px] sm:text-[13px] overflow-x-auto leading-[1.7] border border-[#1A1816]">
              <pre>
                <code>
                  <span className="text-[#F43F5E]">import</span> <span className="text-[#FAF9F5]">torch</span>{"\n"}
                  <span className="text-[#F43F5E]">import</span> <span className="text-[#FAF9F5]">torch.nn</span> <span className="text-[#F43F5E]">as</span> <span className="text-[#FAF9F5]">nn</span>{"\n"}
                  <span className="text-[#F43F5E]">import</span> <span className="text-[#FAF9F5]">torch.optim</span> <span className="text-[#F43F5E]">as</span> <span className="text-[#FAF9F5]">optim</span>{"\n\n"}
                  <span className="text-[#75716B]"># ── Define FeedForward Computational Graph ─────────────</span>{"\n"}
                  <span className="text-[#F43F5E]">class</span> <span className="text-[#38BDF8]">FeedForwardNetwork</span><span className="text-[#FAF9F5]">(nn.Module):</span>{"\n"}
                  {"    "}<span className="text-[#F43F5E]">def</span> <span className="text-[#60A5FA]">__init__</span><span className="text-[#FAF9F5]">(self, input_dim=</span><span className="text-[#F59E0B]">2</span><span className="text-[#FAF9F5]">, hidden_dim=</span><span className="text-[#F59E0B]">3</span><span className="text-[#FAF9F5]">, output_dim=</span><span className="text-[#F59E0B]">1</span><span className="text-[#FAF9F5]">):</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">super().</span><span className="text-[#60A5FA]">__init__</span><span className="text-[#FAF9F5]">()</span>{"\n"}
                  {"        "}<span className="text-[#75716B]"># Layer 1: Input to Hidden</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">self.fc1 = nn.</span><span className="text-[#38BDF8]">Linear</span><span className="text-[#FAF9F5]">(input_dim, hidden_dim)</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">self.relu = nn.</span><span className="text-[#38BDF8]">ReLU</span><span className="text-[#FAF9F5]">()</span>{"\n\n"}
                  {"        "}<span className="text-[#75716B]"># Layer 2: Hidden to Output</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">self.fc2 = nn.</span><span className="text-[#38BDF8]">Linear</span><span className="text-[#FAF9F5]">(hidden_dim, output_dim)</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">self.sigmoid = nn.</span><span className="text-[#38BDF8]">Sigmoid</span><span className="text-[#FAF9F5]">()</span>{"\n\n"}
                  {"    "}<span className="text-[#F43F5E]">def</span> <span className="text-[#60A5FA]">forward</span><span className="text-[#FAF9F5]">(self, x):</span>{"\n"}
                  {"        "}<span className="text-[#75716B]"># Affine combination + non-linear activation</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">z1 = self.</span><span className="text-[#60A5FA]">fc1</span><span className="text-[#FAF9F5]">(x)</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">a1 = self.</span><span className="text-[#60A5FA]">relu</span><span className="text-[#FAF9F5]">(z1)</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">z2 = self.</span><span className="text-[#60A5FA]">fc2</span><span className="text-[#FAF9F5]">(a1)</span>{"\n"}
                  {"        "}<span className="text-[#FAF9F5]">y_hat = self.</span><span className="text-[#60A5FA]">sigmoid</span><span className="text-[#FAF9F5]">(z2)</span>{"\n"}
                  {"        "}<span className="text-[#F43F5E]">return</span> <span className="text-[#FAF9F5]">y_hat</span>{"\n\n"}
                  <span className="text-[#75716B]"># ── Train with Binary Cross-Entropy Loss & SGD ─────────</span>{"\n"}
                  <span className="text-[#FAF9F5]">model = </span><span className="text-[#38BDF8]">FeedForwardNetwork</span><span className="text-[#FAF9F5]">()</span>{"\n"}
                  <span className="text-[#FAF9F5]">criterion = nn.</span><span className="text-[#38BDF8]">BCELoss</span><span className="text-[#FAF9F5]">()</span>{"\n"}
                  <span className="text-[#FAF9F5]">optimizer = optim.</span><span className="text-[#38BDF8]">SGD</span><span className="text-[#FAF9F5]">(model.parameters(), lr=</span><span className="text-[#F59E0B]">0.1</span><span className="text-[#FAF9F5]">)</span>
                </code>
              </pre>
            </div>
          </div>

          {/* Return to Articles Grid */}
          <div className="pt-8 border-t border-[#1A1816]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[12px] font-mono text-[#75716B]">
              Explore additional visual essays in the collection:
            </span>
            <Link
              href="/resources"
              className="px-4 py-2 bg-[#1A1816] text-[#FAF9F5] font-mono text-[11px] font-bold tracking-wider uppercase rounded-[2px] hover:bg-[#DE5D35] transition-colors"
            >
              Explore Published Articles Grid →
            </Link>
          </div>
        </section>
      </div>
    </FoldLayout>
  );
}
