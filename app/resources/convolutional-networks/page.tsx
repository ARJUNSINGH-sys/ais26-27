"use client";

import Link from "next/link";
import FoldLayout from "@/components/FoldLayout";
import MathTex from "@/components/MathTex";

export default function ConvolutionalNetworksArticlePage() {
  // ---------- Convolution animation data ----------
  const IN = 7; // input grid size
  const K = 3; // kernel size
  const OUT = IN - K + 1; // 5
  const CELL = 38; // px per cell
  const STEPS = OUT * OUT; // 25 window positions
  const CYCLE = 9; // seconds

  // Input image: bright left region, dark right region → vertical edge
  const inputValue = (_r: number, c: number) => (c < 4 ? 1 : 0);
  // Vertical edge detector kernel
  const kernel = [
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1],
  ];
  const convOutput = (r: number, c: number) => {
    let sum = 0;
    for (let kr = 0; kr < K; kr++)
      for (let kc = 0; kc < K; kc++)
        sum += kernel[kr][kc] * inputValue(r + kr, c + kc);
    return sum;
  };

  // Window keyframes: snap through 25 raster positions with steps(1,end)
  const windowKeyframes = (() => {
    const stops: string[] = [];
    for (let i = 0; i < STEPS; i++) {
      const r = Math.floor(i / OUT);
      const c = i % OUT;
      const p = ((i / STEPS) * 100).toFixed(3);
      stops.push(
        `${p}% { transform: translate(${c * CELL}px, ${r * CELL}px); opacity: 1; }`,
      );
    }
    stops.push(`100% { transform: translate(0px, 0px); opacity: 0; }`);
    return `@keyframes cnnWindow { ${stops.join(" ")} }`;
  })();

  const css = `
    ${windowKeyframes}
    @keyframes cnnOutCell {
      0%       { opacity: 0.08; transform: scale(0.85); }
      2%       { opacity: 1; transform: scale(1); }
      90%      { opacity: 1; transform: scale(1); }
      100%     { opacity: 0.08; transform: scale(0.85); }
    }
    @keyframes cnnPoolWindow {
      0%, 22%    { transform: translate(0px, 0px); opacity: 1; }
      25%, 47%   { transform: translate(96px, 0px); opacity: 1; }
      50%, 72%   { transform: translate(0px, 96px); opacity: 1; }
      75%, 97%   { transform: translate(96px, 96px); opacity: 1; }
      100%       { transform: translate(0px, 0px); opacity: 0; }
    }
    @keyframes cnnPoolCell {
      0%       { opacity: 0.1; transform: scale(0.8); }
      3%       { opacity: 1; transform: scale(1); }
      92%      { opacity: 1; }
      100%     { opacity: 0.1; transform: scale(0.8); }
    }
    @keyframes cnnArchPulse {
      0%, 100% { box-shadow: none; border-color: rgba(26,24,22,0.15); }
      50%      { box-shadow: none; border-color: #DE5D35; }
    }
    @keyframes cnnFlowDot {
      0%   { opacity: 0; transform: translateX(0); }
      10%  { opacity: 1; }
      90%  { opacity: 1; transform: translateX(52px); }
      100% { opacity: 0; transform: translateX(52px); }
    }
    .cnn-window {
      animation: cnnWindow ${CYCLE}s steps(1, end) infinite;
    }
    .cnn-out-cell { animation: cnnOutCell ${CYCLE}s linear infinite; }
    .cnn-pool-window { animation: cnnPoolWindow 6s steps(1, end) infinite; }
    .cnn-pool-cell { animation: cnnPoolCell 6s linear infinite; }
    .cnn-arch-block { animation: cnnArchPulse 4.5s ease-in-out infinite; }
    .cnn-flow-dot { animation: cnnFlowDot 1.1s linear infinite; }
    @media (prefers-reduced-motion: reduce) {
      .cnn-window, .cnn-out-cell, .cnn-pool-window, .cnn-pool-cell, .cnn-arch-block, .cnn-flow-dot { animation: none; }
    }
  `;

  // Pipeline blocks for the architecture animation
  const archBlocks = [
    { name: "INPUT", size: "28×28×1", note: "pixel grid" },
    { name: "CONV", size: "26×26×8", note: "8 filters" },
    { name: "ReLU", size: "26×26×8", note: "clamp ≥ 0" },
    { name: "POOL", size: "13×13×8", note: "max 2×2" },
    { name: "CONV", size: "11×11×16", note: "16 filters" },
    { name: "POOL", size: "5×5×16", note: "max 2×2" },
    { name: "FLAT", size: "400", note: "unroll" },
    { name: "DENSE", size: "128", note: "reason" },
    { name: "SOFTMAX", size: "10", note: "probabilities" },
  ];

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <style>{css}</style>
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
                Deep Learning · Convolutional Neural Networks
              </span>
            </div>
          </div>

          {/* Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 08
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              Convolutional Neural Networks
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              A tiny magnifying glass sweeping across an image is the whole
              idea. Watch a real filter slide over real pixels, watch edges
              become feature maps, and follow the data through a full CNN — all
              on loop.
            </p>
          </header>

          {/* Section 01: THE SLIDING FILTER */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                01 / The Sliding Filter
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Convolution: A Flashlight Over the Pixels
              </h2>
            </div>

            <p className="text-[14px] text-[#4A4742] leading-[1.7] max-w-3xl mb-6">
              On the left is a 7×7 image — bright on the left, dark on the
              right, so a <strong>vertical edge</strong> runs down the middle.
              The red 3×3 window is the <strong>filter (kernel)</strong>. It
              starts in the corner, multiplies its 9 numbers with the 9 pixels
              underneath, sums them into <em>one</em> output pixel, then steps
              one cell right — raster-scanning the whole image. The output grid
              on the right is the <strong>feature map</strong>: bright where the
              filter found its pattern.
            </p>

            {/* Convolution animation panel */}
            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-[11px] font-mono text-[#75716B]">
                <span>7×7 INPUT × 3×3 KERNEL → 5×5 FEATURE MAP</span>
                <span className="font-semibold text-[#DE5D35]">
                  looping · 25 positions per cycle
                </span>
              </div>

              <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
                {/* Input grid with sliding window */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#75716B] mb-2 text-center">
                    input image
                  </div>
                  <div
                    className="relative border border-[#1A1816]/20 rounded-[2px]"
                    style={{ width: IN * CELL, height: IN * CELL }}
                  >
                    {Array.from({ length: IN * IN }, (_, i) => {
                      const r = Math.floor(i / IN);
                      const c = i % IN;
                      const v = inputValue(r, c);
                      return (
                        <div
                          key={i}
                          className="absolute border border-[#EFECE6]"
                          style={{
                            left: c * CELL,
                            top: r * CELL,
                            width: CELL,
                            height: CELL,
                            backgroundColor: v ? "#E5DFD2" : "#8C857A",
                          }}
                        />
                      );
                    })}
                    {/* Sliding 3x3 window */}
                    <div
                      className="cnn-window absolute border-[3px] border-[#DE5D35] rounded-[2px]"
                      style={{
                        width: K * CELL,
                        height: K * CELL,
                        left: 0,
                        top: 0,
                      }}
                    />
                  </div>
                </div>

                {/* Kernel card */}
                <div className="text-center">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#75716B] mb-2">
                    kernel (edge detector)
                  </div>
                  <div className="inline-block border-2 border-[#DE5D35] rounded-[2px] p-1.5 bg-white">
                    {kernel.map((row, ri) => (
                      <div key={ri} className="flex">
                        {row.map((v, ci) => (
                          <div
                            key={ci}
                            className={`w-9 h-9 flex items-center justify-center font-mono text-[14px] font-bold ${
                              v > 0
                                ? "text-[#DE5D35] bg-[#DE5D35]/10"
                                : v < 0
                                  ? "text-[#1A1816] bg-[#1A1816]/10"
                                  : "text-[#75716B]"
                            }`}
                          >
                            {v > 0 ? `+${v}` : v}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-[#75716B] mt-2">
                    Σ (pixel × weight)
                  </div>
                </div>

                {/* Output feature map */}
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#75716B] mb-2 text-center">
                    feature map (output)
                  </div>
                  <div
                    className="relative border border-[#1A1816]/20 rounded-[2px]"
                    style={{ width: OUT * CELL, height: OUT * CELL }}
                  >
                    {Array.from({ length: OUT * OUT }, (_, i) => {
                      const r = Math.floor(i / OUT);
                      const c = i % OUT;
                      const v = Math.abs(convOutput(r, c)); // 0..3
                      const intensity = v / 3;
                      return (
                        <div
                          key={i}
                          className="cnn-out-cell absolute border border-[#EFECE6] flex items-center justify-center font-mono text-[12px] font-bold"
                          style={{
                            left: c * CELL,
                            top: r * CELL,
                            width: CELL,
                            height: CELL,
                            animationDelay: `${i * (CYCLE / STEPS)}s`,
                            backgroundColor: `rgba(222, 93, 53, ${
                              0.12 + intensity * 0.85
                            })`,
                            color: intensity > 0.5 ? "#FAF9F5" : "#1A1816",
                          }}
                        >
                          {v}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="text-[11px] font-mono text-[#75716B] text-center mt-5 uppercase tracking-wider">
                the edge column of the feature map lights up — the filter found
                the border
              </p>
            </div>
          </section>

          {/* Section 02: Why convolution beats dense layers */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / Why Not Just Flatten?
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Weight Sharing &amp; Translation Invariance
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-[14px] text-[#4A4742] leading-[1.7]">
              <div className="space-y-4">
                <p>
                  A dense layer connecting a 28×28 image to just 1,000 neurons
                  needs <MathTex math="784{,}000" /> weights — and a cat in the
                  top-left corner teaches it nothing about a cat in the
                  bottom-right, because every pixel gets its own private
                  weights.
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    The Convolutional Counter-Offer
                  </span>
                  <p className="text-[13px]">
                    Use the <strong>same 9 weights at every position</strong>.
                    One 3×3 filter = 9 numbers (plus 1 bias), slid across the
                    entire image. A cat anywhere is still a cat, because the
                    detector looks for the same local pattern everywhere.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    Parameter Count Formula
                  </span>
                  <MathTex
                    math="\text{params} = (k \times k \times C_{\text{in}} + 1) \times C_{\text{out}}"
                    block
                  />
                  <p className="text-[12px] text-[#75716B] mt-2">
                    For 8 filters of 3×3 on grayscale:{" "}
                    <MathTex math="(9+1) \times 8 = 80" /> weights instead of
                    784,000. Depth (channels) grows as spatial size shrinks.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p>
                  The output size follows from three knobs — kernel size{" "}
                  <MathTex math="k" />, stride (step size), and padding
                  (zero-border):
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    Output Spatial Size
                  </span>
                  <MathTex
                    math="O = \left\lfloor \frac{N - k + 2P}{S} \right\rfloor + 1"
                    block
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 bg-[#FAF9F5] border border-[#1A1816]/15">
                    <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                      STRIDE
                    </span>
                    <p className="text-[12px] leading-[1.6]">
                      How far the window jumps each step. Stride 2 halves the
                      output — cheap downsampling.
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#FAF9F5] border border-[#1A1816]/15">
                    <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                      PADDING
                    </span>
                    <p className="text-[12px] leading-[1.6]">
                      A zero border lets the filter visit the edges and keeps
                      output size equal to input (&ldquo;same&rdquo; padding).
                    </p>
                  </div>
                  <div className="p-3.5 bg-[#FAF9F5] border border-[#1A1816]/15">
                    <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                      CHANNELS
                    </span>
                    <p className="text-[12px] leading-[1.6]">
                      Filters are 3D (k×k×channels). 64 stacked outputs = 64
                      feature maps = depth of the next layer.
                    </p>
                  </div>
                </div>
                <p>
                  Early filters learn edges and blobs; deeper layers combine
                  them into corners, textures, eyes, wheels, faces. Nobody
                  programs this — it emerges from backpropagation (Topic 07).
                </p>
              </div>
            </div>
          </section>

          {/* Section 03: Pooling animation */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                03 / Shrinking Without Losing the Point
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Max Pooling
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  After each convolution, a <strong>pooling layer</strong>{" "}
                  downsamples the feature map. Max pooling splits the map into{" "}
                  <MathTex math="2 \times 2" /> tiles and keeps only the
                  strongest activation per tile.
                </p>
                <p>
                  Why throw information away? Because <em>whether</em> an edge
                  was found matters more than <em>exactly which pixel</em> it
                  peaked on. Pooling buys translation tolerance: shift the input
                  a little, the max stays the same.
                </p>
                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[12px]">
                  <span className="text-[#75716B]">
                    4×4 → 2×2 · 75% of values dropped · zero learned parameters
                  </span>
                </div>
                <p>
                  Modern architectures sometimes replace pooling with strided
                  convolutions, but the idea — shrink spatial, keep signal — is
                  everywhere.
                </p>
              </div>

              {/* Pooling animation */}
              <div className="lg:col-span-7 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <div className="flex items-center justify-between mb-4 text-[11px] font-mono text-[#75716B]">
                  <span>MAX POOL 2×2 · STRIDE 2</span>
                  <span className="font-semibold text-[#DE5D35]">looping</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  <div
                    className="relative border border-[#1A1816]/20 rounded-[2px]"
                    style={{ width: 4 * 48, height: 4 * 48 }}
                  >
                    {[
                      [3, 1, 2, 0],
                      [1, 4, 0, 2],
                      [2, 0, 6, 1],
                      [0, 3, 1, 5],
                    ].map((row, r) =>
                      row.map((v, c) => (
                        <div
                          key={`${r}-${c}`}
                          className="absolute flex items-center justify-center font-mono text-[14px] font-bold border border-[#EFECE6]"
                          style={{
                            left: c * 48,
                            top: r * 48,
                            width: 48,
                            height: 48,
                            backgroundColor: `rgba(222,93,53,${0.06 + (v / 6) * 0.55})`,
                            color: v / 6 > 0.5 ? "#FAF9F5" : "#1A1816",
                          }}
                        >
                          {v}
                        </div>
                      )),
                    )}
                    <div
                      className="cnn-pool-window absolute border-[3px] border-[#1A1816] rounded-[2px]"
                      style={{ width: 96, height: 96, left: 0, top: 0 }}
                    />
                  </div>

                  <div className="font-mono text-[20px] text-[#DE5D35] font-bold">
                    →
                  </div>

                  <div
                    className="relative border border-[#1A1816]/20 rounded-[2px]"
                    style={{ width: 2 * 48, height: 2 * 48 }}
                  >
                    {[
                      [4, 2],
                      [6, 5],
                    ].map((row, r) =>
                      row.map((v, c) => (
                        <div
                          key={`o-${r}-${c}`}
                          className="cnn-pool-cell absolute flex items-center justify-center font-mono text-[15px] font-bold border border-[#EFECE6] bg-[#DE5D35]"
                          style={{
                            left: c * 48,
                            top: r * 48,
                            width: 48,
                            height: 48,
                            color: "#FAF9F5",
                            animationDelay: `${(r * 2 + c) * 1.5}s`,
                          }}
                        >
                          {v}
                        </div>
                      )),
                    )}
                  </div>
                </div>
                <p className="text-[11px] font-mono text-[#75716B] text-center mt-4 uppercase tracking-wider">
                  each output = max of its 2×2 quadrant
                </p>
              </div>
            </div>
          </section>

          {/* Section 04: Full architecture */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                04 / The Full Pipeline
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                A Classic CNN, End to End
              </h2>
            </div>

            <p className="text-[14px] text-[#4A4742] leading-[1.7] max-w-3xl mb-6">
              Stack the pieces — convolve, activate, pool, repeat — then flatten
              and hand over to dense layers for the final verdict. Below is a
              LeNet-style digit classifier; the flowing dots show a batch of
              pixels riding the conveyor belt. Spatial size shrinks, channel
              depth grows, until the network thinks in pure concepts.
            </p>

            {/* Architecture pipeline animation */}
            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-5 overflow-x-auto">
              <div className="flex items-center gap-0 min-w-[760px] justify-between">
                {archBlocks.map((b, i) => (
                  <div key={i} className="flex items-center">
                    <div
                      className="cnn-arch-block w-[76px] px-2 py-3 bg-white border rounded-[2px] text-center shrink-0"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    >
                      <div className="text-[10px] font-mono font-bold tracking-wider text-[#1A1816]">
                        {b.name}
                      </div>
                      <div className="text-[9px] font-mono text-[#DE5D35] mt-1">
                        {b.size}
                      </div>
                      <div className="text-[8px] font-mono text-[#75716B] mt-0.5 uppercase">
                        {b.note}
                      </div>
                    </div>
                    {i < archBlocks.length - 1 && (
                      <div className="relative w-[52px] h-6 shrink-0 overflow-hidden">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-[#1A1816]/20" />
                        <div
                          className="cnn-flow-dot absolute top-[9px] left-0 w-2 h-2 rounded-full bg-[#DE5D35]"
                          style={{ animationDelay: `${i * 0.18}s` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center text-[11px] font-mono text-[#75716B] uppercase tracking-wider">
                spatial shrinks 28 → 26 → 13 → 11 → 5 · depth grows 1 → 8 → 16 ·
                dense layers decide
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                  ReLU — THE NONLINEAR SPARK
                </span>
                <MathTex math="\text{ReLU}(x) = \max(0, x)" block />
                <p className="text-[12px] text-[#4A4742] leading-[1.6] mt-1">
                  Without it, 100 convolutions collapse into one big convolution
                  — the whole network would be a single linear map. ReLU keeps
                  the negatives silent and lets depth mean something.
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                  SOFTMAX — THE FINAL VERDICT
                </span>
                <MathTex
                  math="\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}"
                  block
                />
                <p className="text-[12px] text-[#4A4742] leading-[1.6] mt-1">
                  Converts 10 raw scores into a probability distribution that
                  sums to 1 — Topic 02&apos;s sigmoid, generalized to many
                  classes.
                </p>
              </div>
            </div>
          </section>

          {/* Section 05: Landmark architectures */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                05 / Landmark Lineage
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                From LeNet to ResNet
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  name: "LeNet-5 · 1998",
                  desc: "The original digit reader — the exact CONV→POOL→FLAT→DENSE skeleton you animated above.",
                },
                {
                  name: "AlexNet · 2012",
                  desc: "Same skeleton, GPUs + ReLU + dropout. Won ImageNet by a mile and started the deep learning era.",
                },
                {
                  name: "VGG · 2014",
                  desc: "Showed depth matters: only 3×3 kernels, stacked very deep. Simple and uniform — but heavy.",
                },
                {
                  name: "ResNet · 2015",
                  desc: "Skip connections let gradients bypass layers, making 100+ layers trainable. The backbone of modern vision.",
                },
              ].map((m) => (
                <div
                  key={m.name}
                  className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15"
                >
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                    {m.name}
                  </span>
                  <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#1A1816] text-[#FAF9F5] mt-6">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                THE ROAD AHEAD
              </span>
              <p className="text-[13px] leading-[1.7] max-w-3xl text-[#FAF9F5]/85">
                CNNs conquer space — images, where neighbors matter. But
                language, audio and time series have a <em>before and after</em>
                . For that, the next topic rolls the network out along a
                timeline.
              </p>
            </div>
          </section>

          {/* Section 06: Receptive fields & shared weights */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                06 / What Each Neuron Sees
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Receptive Fields &amp; the Price of Sharing
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  A single neuron in a <MathTex math="3 \times 3" /> convolution
                  only ever looks at <MathTex math="3 \times 3" /> pixels — its{" "}
                  <strong>receptive field</strong>. Stack a second convolution
                  on top and each of <em>its</em> neurons reads a{" "}
                  <MathTex math="3 \times 3" /> block of the first feature map,
                  which was itself built from overlapping{" "}
                  <MathTex math="3 \times 3" /> patches. The window it
                  effectively sees in the original image is therefore{" "}
                  <MathTex math="5 \times 5" />. Add a third and it becomes{" "}
                  <MathTex math="7 \times 7" />.
                </p>
                <p>
                  Depth is a zoom-out machine: shallow layers detect tiny local
                  patterns (edges, corners), deep layers respond to large
                  structures (eyes, wheels, faces) while still computing each
                  response from a small local kernel. Pooling accelerates the
                  zoom-out — a stride-2 pool roughly doubles every subsequent
                  hop, so a handful of layers can cover the whole image.
                </p>
                <p>
                  That growth is also what buys{" "}
                  <strong>translation tolerance</strong>. Shift the input a few
                  pixels and the same features simply land in neighbouring
                  neurons; after pooling keeps only the strongest activation per
                  tile, the deeper representation barely changes. A dense
                  network would instead have to relearn the pattern at every
                  position.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    Receptive Field Recurrence
                  </span>
                  <MathTex
                    math="r_{\text{out}} = r_{\text{in}} + (k - 1)\prod_i s_i"
                    block
                  />
                  <p className="text-[12px] text-[#75716B] mt-2">
                    Each layer adds <MathTex math="k-1" /> to the window, scaled
                    by the strides already applied before it.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] font-mono border border-[#1A1816]/15 bg-[#FAF9F5]">
                    <thead>
                      <tr className="bg-[#1A1816] text-[#FAF9F5] text-left">
                        <th className="px-3 py-2 font-bold uppercase tracking-wider">
                          Stack
                        </th>
                        <th className="px-3 py-2 font-bold uppercase tracking-wider">
                          Field
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-[#4A4742]">
                      <tr className="border-t border-[#1A1816]/15">
                        <td className="px-3 py-2">1 × conv 3×3</td>
                        <td className="px-3 py-2 text-[#1A1816] font-bold">
                          3×3
                        </td>
                      </tr>
                      <tr className="border-t border-[#1A1816]/15">
                        <td className="px-3 py-2">2 × conv 3×3</td>
                        <td className="px-3 py-2 text-[#1A1816] font-bold">
                          5×5
                        </td>
                      </tr>
                      <tr className="border-t border-[#1A1816]/15">
                        <td className="px-3 py-2">3 × conv 3×3</td>
                        <td className="px-3 py-2 text-[#1A1816] font-bold">
                          7×7
                        </td>
                      </tr>
                      <tr className="border-t border-[#1A1816]/15">
                        <td className="px-3 py-2">2 × conv + pool 2×2</td>
                        <td className="px-3 py-2 text-[#DE5D35] font-bold">
                          10×10
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#1A1816] text-[#FAF9F5] mt-6">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                WHY THIS IS ONLY POSSIBLE WITH SHARING
              </span>
              <p className="text-[13px] leading-[1.7] max-w-3xl text-[#FAF9F5]/85">
                A dense layer feeding a 28×28 image to 1,000 neurons needs{" "}
                <MathTex math="784{,}000" /> independent weights, and stacking
                three of those makes the cost explode. Convolution replaces them
                with one <MathTex math="3 \times 3" /> kernel —{" "}
                <strong className="text-[#FAF9F5]">
                  9 weights plus a bias
                </strong>{" "}
                — reused at all 26×26 positions. Sharing is exactly what makes
                deep stacks affordable: 80 parameters for 8 filters instead of
                784,000, while still letting the receptive field grow layer by
                layer. The network learns a detector once and applies it
                everywhere, which is also why a cat in any corner triggers the
                same feature.
              </p>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="border-t border-[#1A1816]/15 pt-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/resources/neural-networks"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
            >
              <span>← Topic 07: Neural Networks</span>
            </Link>
            <Link
              href="/resources/recurrent-networks"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-[#DE5D35] font-bold hover:underline"
            >
              <span>Topic 09: Recurrent Networks →</span>
            </Link>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
