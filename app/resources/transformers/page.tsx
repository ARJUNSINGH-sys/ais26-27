"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FoldLayout from "@/components/FoldLayout";
import MathTex from "@/components/MathTex";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Static Constants (lifted outside component to prevent re-allocation)
// ─────────────────────────────────────────────────────────────────────────────
interface VecToken {
  text: string;
  id: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  color: string;
}

const PRESET_VEC_TOKENS: readonly VecToken[] = [
  {
    text: "attention",
    id: 3721,
    baseX: 70,
    baseY: 65,
    baseZ: 40,
    color: "#00FFCC",
  },
  { text: "all", id: 477, baseX: -40, baseY: 30, baseZ: -20, color: "#52E3A4" },
  { text: "you", id: 345, baseX: 35, baseY: -50, baseZ: 30, color: "#FFB703" },
  {
    text: "need",
    id: 761,
    baseX: -65,
    baseY: -35,
    baseZ: 50,
    color: "#FF758F",
  },
  {
    text: "transformer",
    id: 10928,
    baseX: 85,
    baseY: 80,
    baseZ: 45,
    color: "#00FFCC",
  },
  {
    text: "king",
    id: 2891,
    baseX: -80,
    baseY: 40,
    baseZ: 60,
    color: "#9D4EDD",
  },
  {
    text: "queen",
    id: 3122,
    baseX: -75,
    baseY: 42,
    baseZ: -55,
    color: "#FF758F",
  },
  { text: "man", id: 187, baseX: -85, baseY: -20, baseZ: 58, color: "#9D4EDD" },
  {
    text: "woman",
    id: 241,
    baseX: -80,
    baseY: -18,
    baseZ: -57,
    color: "#FF758F",
  },
  {
    text: "neural",
    id: 4210,
    baseX: 55,
    baseY: 50,
    baseZ: -45,
    color: "#52E3A4",
  },
  {
    text: "sequence",
    id: 3110,
    baseX: 45,
    baseY: -30,
    baseZ: -60,
    color: "#FFB703",
  },
  { text: "model", id: 894, baseX: 60, baseY: 35, baseZ: 30, color: "#00FFCC" },
];

const SENTENCE_TOKENS = [
  { id: "sent-lead-the-0", text: "The", idx: 0 },
  { id: "sent-animal-1", text: "animal", idx: 1 },
  { id: "sent-didnt-2", text: "didn't", idx: 2 },
  { id: "sent-cross-3", text: "cross", idx: 3 },
  { id: "sent-mid-the-4", text: "the", idx: 4 },
  { id: "sent-street-5", text: "street", idx: 5 },
  { id: "sent-because-6", text: "because", idx: 6 },
  { id: "sent-it-7", text: "it", idx: 7 },
  { id: "sent-was-8", text: "was", idx: 8 },
  { id: "sent-too-9", text: "too", idx: 9 },
  { id: "sent-tired-10", text: "tired", idx: 10 },
] as const;

const RAW_LOGITS = [
  { word: "transduction", logit: 6.8 },
  { word: "modeling", logit: 5.4 },
  { word: "generation", logit: 4.9 },
  { word: "translation", logit: 4.2 },
  { word: "synthesis", logit: 3.1 },
  { word: "learning", logit: 2.4 },
  { word: "prediction", logit: 1.8 },
  { word: "recognition", logit: 0.9 },
] as const;

const AR_SEQUENCE = [
  {
    stepId: "ar-step-bos-0",
    stepIdx: 0,
    token: "<BOS>",
    logits: [
      { word: "The", p: "88%" },
      { word: "Attention", p: "8%" },
      { word: "A", p: "4%" },
    ],
  },
  {
    stepId: "ar-step-attention-1",
    stepIdx: 1,
    token: "Attention",
    logits: [
      { word: "is", p: "94%" },
      { word: "mechanism", p: "4%" },
      { word: "model", p: "2%" },
    ],
  },
  {
    stepId: "ar-step-is-2",
    stepIdx: 2,
    token: "is",
    logits: [
      { word: "all", p: "97%" },
      { word: "a", p: "2%" },
      { word: "the", p: "1%" },
    ],
  },
  {
    stepId: "ar-step-all-3",
    stepIdx: 3,
    token: "all",
    logits: [
      { word: "you", p: "99%" },
      { word: "we", p: "0.8%" },
      { word: "that", p: "0.2%" },
    ],
  },
  {
    stepId: "ar-step-you-4",
    stepIdx: 4,
    token: "you",
    logits: [
      { word: "need", p: "98%" },
      { word: "want", p: "1.5%" },
      { word: "have", p: "0.5%" },
    ],
  },
  {
    stepId: "ar-step-need-5",
    stepIdx: 5,
    token: "need",
    logits: [
      { word: "<EOS>", p: "92%" },
      { word: "for", p: "6%" },
      { word: ".", p: "2%" },
    ],
  },
] as const;

const CAUSAL_MASK_CELLS = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 5 }, (_, col) => ({
    row,
    col,
    isAllowed: col <= row,
    id: `cell-r${row}-c${col}`,
  })),
).flat();

const LAYERS = [1, 2, 3, 4, 5, 6] as const;

// Pure helper function for coreference weights calculation
function computeAttentionWeights(idx: number, head: number): readonly number[] {
  if (idx === 7) {
    return head === 1
      ? [0.02, 0.76, 0.01, 0.03, 0.01, 0.04, 0.02, 0.05, 0.02, 0.01, 0.03]
      : [0.01, 0.05, 0.01, 0.04, 0.02, 0.68, 0.03, 0.08, 0.02, 0.02, 0.04];
  }
  const remainingShare = 0.35 / (SENTENCE_TOKENS.length - 1);
  return SENTENCE_TOKENS.map((t) => (t.idx === idx ? 0.65 : remainingShare));
}

export default function TransformersArticlePage() {
  // ── 1. BPE Tokenizer State ──
  const [customText, setCustomText] = useState(
    "Attention is all you need for neural sequence transduction",
  );
  const [tokens, setTokens] = useState<
    { text: string; id: number; bytes: string }[]
  >([]);
  const [inspectedToken, setInspectedToken] = useState<{
    text: string;
    id: number;
    bytes: string;
  } | null>(null);

  // ── 2. Vector Space Interactive Canvas State ──
  const vecCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [vecMode, setVecMode] = useState<"static" | "context" | "autoregress">(
    "static",
  );
  const [contextLayer, setContextLayer] = useState<number>(3);
  const [autoStepIdx, setAutoStepIdx] = useState<number>(0);
  const [selectedTokenA, setSelectedTokenA] = useState<number | null>(0);
  const [selectedTokenB, setSelectedTokenB] = useState<number | null>(4);

  // Authentically compute exact 3D cosine similarity between selected tokens
  const cosineSim = useMemo(() => {
    if (selectedTokenA === null || selectedTokenB === null) return 0;
    const a = PRESET_VEC_TOKENS[selectedTokenA];
    const b = PRESET_VEC_TOKENS[selectedTokenB];
    if (!a || !b) return 0;
    const dot = a.baseX * b.baseX + a.baseY * b.baseY + a.baseZ * b.baseZ;
    const magA = Math.hypot(a.baseX, a.baseY, a.baseZ);
    const magB = Math.hypot(b.baseX, b.baseY, b.baseZ);
    if (magA === 0 || magB === 0) return 0;
    return Math.max(-1, Math.min(1, dot / (magA * magB)));
  }, [selectedTokenA, selectedTokenB]);

  // Keep refs for live animation loop to prevent effect teardown and camera angle resets
  const vecModeRef = useRef(vecMode);
  vecModeRef.current = vecMode;

  const contextLayerRef = useRef(contextLayer);
  contextLayerRef.current = contextLayer;

  const autoStepIdxRef = useRef(autoStepIdx);
  autoStepIdxRef.current = autoStepIdx;

  const selectedTokenARef = useRef(selectedTokenA);
  selectedTokenARef.current = selectedTokenA;

  const selectedTokenBRef = useRef(selectedTokenB);
  selectedTokenBRef.current = selectedTokenB;

  const cosineSimRef = useRef(cosineSim);
  cosineSimRef.current = cosineSim;

  // ── 3. Positional Encoding Canvas State ──
  const posCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [posSeqLen, setPosSeqLen] = useState<number>(20);
  const posSeqLenRef = useRef(posSeqLen);
  posSeqLenRef.current = posSeqLen;

  // ── 4. Coreference Attention Simulator State ──
  const [selectedAttentionIdx, setSelectedAttentionIdx] = useState<number>(7);
  const [activeHead, setActiveHead] = useState<number>(1);
  const weights = useMemo(
    () => computeAttentionWeights(selectedAttentionIdx, activeHead),
    [selectedAttentionIdx, activeHead],
  );

  // ── 5. Position-Wise FFN Interactive State ──
  const [ffnInputVal, setFfnInputVal] = useState<number>(1.4);

  // ── 6. Residual Connection Interactive Toggle State ──
  const [residualEnabled, setResidualEnabled] = useState<boolean>(true);

  // ── 7. Cross-Layer Decoder Stepper ──
  const [decoderStep, setDecoderStep] = useState<number>(2);

  // ── 8. Final Softmax & Temperature Sampling State ──
  const [temperature, setTemperature] = useState<number>(0.8);
  const [topK, setTopK] = useState<number>(5);
  const [samplingMethod, setSamplingMethod] = useState<
    "temperature" | "topk" | "greedy"
  >("temperature");

  // Dynamically compute softmax probabilities with full numerical stability (Log-Sum-Exp & NaN protection)
  const softmaxProbabilities = useMemo(() => {
    if (samplingMethod === "greedy") {
      return RAW_LOGITS.map((item, idx) => ({
        word: item.word,
        logit: item.logit,
        prob: idx === 0 ? 1 : 0,
        percent: idx === 0 ? "100.0" : "0.0",
        isFilteredOut: idx !== 0,
      }));
    }

    // Guard against division by zero, non-finite, or negative temperatures
    const safeTemp = Math.max(
      0.01,
      Number.isFinite(temperature) ? temperature : 1.0,
    );

    // Bound Top-K cutoff to valid vocabulary index range [1, RAW_LOGITS.length]
    const safeK =
      samplingMethod === "topk"
        ? Math.max(
            1,
            Math.min(
              RAW_LOGITS.length,
              Math.floor(Number.isFinite(topK) ? topK : 1),
            ),
          )
        : RAW_LOGITS.length;

    // Numerical stability: Subtract maximum active scaled logit (Log-Sum-Exp trick)
    let maxScaledLogit = -Infinity;
    const scaledLogits: number[] = new Array(RAW_LOGITS.length);

    for (let i = 0; i < RAW_LOGITS.length; i++) {
      if (i < safeK) {
        const scaled = RAW_LOGITS[i].logit / safeTemp;
        scaledLogits[i] = scaled;
        if (scaled > maxScaledLogit) {
          maxScaledLogit = scaled;
        }
      } else {
        scaledLogits[i] = -Infinity;
      }
    }

    if (!Number.isFinite(maxScaledLogit)) {
      maxScaledLogit = 0;
    }

    let sumExp = 0;
    const expVals = new Array(RAW_LOGITS.length);

    for (let i = 0; i < RAW_LOGITS.length; i++) {
      if (i < safeK) {
        const ev = Math.exp(scaledLogits[i] - maxScaledLogit);
        const safeEv = Number.isFinite(ev) ? ev : 0;
        expVals[i] = safeEv;
        sumExp += safeEv;
      } else {
        expVals[i] = 0;
      }
    }

    const safeSum = sumExp > 0 && Number.isFinite(sumExp) ? sumExp : 1;

    return RAW_LOGITS.map((item, i) => {
      const isFilteredOut = i >= safeK;
      const prob = isFilteredOut ? 0 : expVals[i] / safeSum;
      const safeProb = Number.isFinite(prob)
        ? Math.max(0, Math.min(1, prob))
        : 0;
      return {
        word: item.word,
        logit: item.logit,
        prob: safeProb,
        percent: (safeProb * 100).toFixed(1),
        isFilteredOut,
      };
    });
  }, [temperature, topK, samplingMethod]);

  // ── Simple BPE Tokenization Rule Simulator ──
  const runTokenizer = useCallback((textToTokenize: string) => {
    const trimmed = textToTokenize.trim();
    if (!trimmed) {
      setTokens([]);
      setInspectedToken(null);
      return;
    }

    const rawWords = trimmed.split(/\s+/);
    const subwords: { text: string; id: number; bytes: string }[] = [];

    for (const word of rawWords) {
      // Retain unicode letters, digits, and apostrophes
      const lower = word.toLowerCase().replace(/[^\p{L}\p{N}']/gu, "");
      if (!lower) continue;

      if (lower.length > 7) {
        const part1 = lower.slice(0, 5);
        const part2 = `##${lower.slice(5)}`;

        // 32-bit integer arithmetic to prevent floating-point precision overflow
        let h1 = 7;
        for (let i = 0; i < part1.length; i++) {
          h1 = (h1 * 31 + part1.charCodeAt(i)) | 0;
        }
        let h2 = 13;
        for (let i = 0; i < part2.length; i++) {
          h2 = (h2 * 31 + part2.charCodeAt(i)) | 0;
        }

        const hash1 = Math.abs(h1) % 32000;
        const hash2 = Math.abs(h2) % 32000;

        const bytes1 = Array.from(part1)
          .map((c) =>
            c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase(),
          )
          .join(" ");
        const bytes2 = Array.from(part2)
          .map((c) =>
            c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase(),
          )
          .join(" ");

        subwords.push({ text: part1, id: hash1, bytes: bytes1 });
        subwords.push({ text: part2, id: hash2, bytes: bytes2 });
      } else {
        let h = 11;
        for (let i = 0; i < lower.length; i++) {
          h = (h * 31 + lower.charCodeAt(i)) | 0;
        }
        const hash = Math.abs(h) % 32000;
        const bytes = Array.from(lower)
          .map((c) =>
            c.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase(),
          )
          .join(" ");
        subwords.push({ text: lower, id: hash, bytes });
      }
    }

    setTokens(subwords);
    if (subwords.length > 0) {
      setInspectedToken(subwords[0]);
    } else {
      setInspectedToken(null);
    }
  }, []);

  useEffect(() => {
    runTokenizer(customText);
  }, [runTokenizer, customText]);

  // ── 2D/3D Vector Space Canvas Interactive Renderer ──
  useEffect(() => {
    const canvas = vecCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let azimuth = 0.65;
    let targetAzimuth = 0.65;
    let elevation = 0.35;
    let targetElevation = 0.35;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let pulse = 0;

    let width = Math.max(300, canvas.clientWidth || 800);
    let height = Math.max(200, canvas.clientHeight || 360);
    let dpr = window.devicePixelRatio || 1;

    const updateDimensions = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width) || 800);
      height = Math.max(200, Math.floor(rect.height) || 360);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    resizeObserver.observe(canvas);

    const onPointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      lastX = clientX;
      lastY = clientY;
      canvas.style.cursor = "grabbing";
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const dx = clientX - lastX;
        const dy = clientY - lastY;
        targetAzimuth += dx * 0.008;
        targetElevation = Math.max(
          -1.1,
          Math.min(1.1, targetElevation + dy * 0.008),
        );
        lastX = clientX;
        lastY = clientY;
      }
    };

    const onPointerUp = () => {
      if (isDragging) {
        isDragging = false;
        canvas.style.cursor = "grab";
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      onPointerDown(e.clientX, e.clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      onPointerMove(e.clientX, e.clientY);
    };

    const onMouseUp = () => {
      onPointerUp();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const onTouchEnd = () => {
      onPointerUp();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      if (!isDragging) {
        targetAzimuth += 0.0025;
      }
      azimuth += (targetAzimuth - azimuth) * 0.08;
      elevation += (targetElevation - elevation) * 0.08;
      pulse += 0.04;

      const cx = width / 2;
      const cy = height / 2 + 10;

      // Dark background gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, width * 0.6);
      bgGrad.addColorStop(0, "rgba(0, 255, 204, 0.05)");
      bgGrad.addColorStop(0.5, "rgba(10, 15, 24, 0.95)");
      bgGrad.addColorStop(1, "rgba(4, 6, 8, 1)");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 3D projection matrix math
      const cosA = Math.cos(azimuth);
      const sinA = Math.sin(azimuth);
      const cosE = Math.cos(elevation);
      const sinE = Math.sin(elevation);

      const project = (x: number, y: number, z: number) => {
        const rotX = x * cosA - z * sinA;
        const tempZ = x * sinA + z * cosA;
        const rotY = y * cosE - tempZ * sinE;
        const rotZ = y * sinE + tempZ * cosE;

        const fov = 400 / (400 + rotZ + 150);
        return {
          px: cx + rotX * fov * 1.5,
          py: cy - rotY * fov * 1.5,
          pz: rotZ,
          scale: fov,
        };
      };

      // Ground plane grid (XZ)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let r = 40; r <= 160; r += 40) {
        ctx.beginPath();
        for (let th = 0; th <= Math.PI * 2; th += 0.2) {
          const pt = project(Math.cos(th) * r, -50, Math.sin(th) * r);
          if (th === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Origin Axes
      const o = project(0, 0, 0);
      const axX = project(90, 0, 0);
      const axY = project(0, 90, 0);
      const axZ = project(0, 0, 90);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255, 80, 80, 0.6)";
      ctx.beginPath();
      ctx.moveTo(o.px, o.py);
      ctx.lineTo(axX.px, axX.py);
      ctx.stroke();

      ctx.strokeStyle = "rgba(80, 255, 80, 0.6)";
      ctx.beginPath();
      ctx.moveTo(o.px, o.py);
      ctx.lineTo(axY.px, axY.py);
      ctx.stroke();

      ctx.strokeStyle = "rgba(0, 255, 204, 0.7)";
      ctx.beginPath();
      ctx.moveTo(o.px, o.py);
      ctx.lineTo(axZ.px, axZ.py);
      ctx.stroke();

      // Read current values from refs to avoid restarting the animation loop
      const curMode = vecModeRef.current;
      const curContextLayer = contextLayerRef.current;
      const curAutoStepIdx = autoStepIdxRef.current;
      const curTokenA = selectedTokenARef.current;
      const curTokenB = selectedTokenBRef.current;
      const curCosineSim = cosineSimRef.current;

      // Render tokens
      const activeTokens = PRESET_VEC_TOKENS.slice(
        0,
        curMode === "autoregress"
          ? curAutoStepIdx + 3
          : PRESET_VEC_TOKENS.length,
      );

      const projectedTokens = activeTokens.map((t, i) => {
        let x = t.baseX;
        let y = t.baseY;
        const z = t.baseZ;

        if (curMode === "context") {
          const shift = curContextLayer * 6;
          x += (t.id % 2 === 0 ? shift : -shift) * 0.4;
          y += Math.sin(pulse + i) * 8;
        }

        const pt = project(x, y, z);
        return { ...t, ...pt, origIdx: i };
      });

      // Draw vectors from origin to tokens
      for (const t of projectedTokens) {
        ctx.strokeStyle = `${t.color}33`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(o.px, o.py);
        ctx.lineTo(t.px, t.py);
        ctx.stroke();

        ctx.fillStyle = t.color;
        ctx.beginPath();
        ctx.arc(t.px, t.py, 4.5 * t.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#FAF9F5";
        ctx.font = "bold 10px monospace";
        ctx.fillText(t.text, t.px + 7, t.py + 3);
      }

      // Draw Cosine Similarity arc if two tokens selected
      if (
        curTokenA !== null &&
        curTokenB !== null &&
        projectedTokens[curTokenA] &&
        projectedTokens[curTokenB]
      ) {
        const tA = projectedTokens[curTokenA];
        const tB = projectedTokens[curTokenB];

        ctx.strokeStyle = "#DE5D35";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(tA.px, tA.py);
        ctx.lineTo(tB.px, tB.py);
        ctx.stroke();
        ctx.setLineDash([]);

        const midX = (tA.px + tB.px) / 2;
        const midY = (tA.py + tB.py) / 2;
        ctx.fillStyle = "#DE5D35";
        ctx.fillRect(midX - 34, midY - 10, 68, 20);
        ctx.fillStyle = "#FAF9F5";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`cos: ${curCosineSim.toFixed(2)}`, midX, midY + 4);
        ctx.textAlign = "left";
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  // ── Positional Encoding Spectrum Wave Renderer ──
  useEffect(() => {
    const canvas = posCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let waveOffset = 0;

    let width = Math.max(300, canvas.clientWidth || 800);
    let height = Math.max(120, canvas.clientHeight || 180);
    let dpr = window.devicePixelRatio || 1;

    const updateWaveDimensions = () => {
      dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(300, Math.floor(rect.width) || 800);
      height = Math.max(120, Math.floor(rect.height) || 180);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
    };

    updateWaveDimensions();

    const resizeObserver = new ResizeObserver(() => {
      updateWaveDimensions();
    });
    resizeObserver.observe(canvas);

    const renderWave = () => {
      const curPosSeqLen = posSeqLenRef.current;
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#0A0D12";
      ctx.fillRect(0, 0, width, height);

      waveOffset += 0.03;

      const numCurves = 8;
      for (let c = 0; c < numCurves; c++) {
        const isSine = c % 2 === 0;
        const freq = 0.01 + c * 0.018;
        const alpha = 0.8 - c * 0.08;

        ctx.strokeStyle = isSine
          ? `rgba(0, 255, 204, ${alpha})`
          : `rgba(222, 93, 53, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        for (let x = 0; x < width; x += 3) {
          const pos = (x / width) * curPosSeqLen;
          const y = isSine
            ? Math.sin(pos * freq * 10 + waveOffset + c) * 35 + height / 2
            : Math.cos(pos * freq * 10 + waveOffset + c) * 35 + height / 2;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      ctx.restore();
      animId = requestAnimationFrame(renderWave);
    };

    animId = requestAnimationFrame(renderWave);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen overflow-x-hidden">
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
              <Link
                href="/resources"
                className="hover:text-[#1A1816] transition-colors"
              >
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
              A complete first-principles architectural breakdown: from subword
              Byte-Pair Encoding and 3D token vector spaces, to sinusoidal
              positional encoding, feed-forward expansion, residual highways,
              6-layer dual towers, and final softmax temperature sampling.
            </p>
            <div className="flex flex-wrap items-center gap-6 mt-6 font-mono text-[11px] uppercase tracking-wider text-[#75716B]">
              <span>Read Time: 16 min</span>
              <span>•</span>
              <span>Vaswani et al. (NeurIPS 2017)</span>
              <span>•</span>
              <span className="text-[#DE5D35] font-bold">
                AIS Research Cohort
              </span>
            </div>
          </header>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 01: TOKENIZER & BPE SUBWORDS
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                01 / Tokenization &amp; Vocabulary
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Byte-Pair Encoding (BPE) &amp; Subword Representation
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                Transformers cannot ingest raw characters or arbitrary-length
                string words directly. Word-level vocabularies suffer from
                out-of-vocabulary (OOV) tokens, while character-level
                tokenization inflates sequence length by 10× (and self-attention
                scales quadratically <MathTex math="O(N^2)" />
                ).
                <strong> Byte-Pair Encoding (BPE)</strong> merges frequent
                character pairs into morphemic subwords:
              </p>

              {/* Interactive Tokenizer Input Box */}
              <div className="p-4 bg-[#141518] text-white rounded-[4px] mb-6 font-mono">
                <div className="text-[11px] text-[#00FFCC] uppercase mb-2 font-bold flex justify-between">
                  <span>INTERACTIVE BPE TOKENIZER STUDIO</span>
                  <span>{tokens.length} TOKENS EXTRACTED</span>
                </div>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomText(val);
                      runTokenizer(val);
                    }}
                    className="grow bg-[#090A0D] border border-white/20 rounded px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#00FFCC]"
                    placeholder="Type any sentence to tokenize..."
                  />
                  <button
                    type="button"
                    onClick={() => runTokenizer(customText)}
                    className="px-4 py-2 bg-[#DE5D35] text-white text-[11px] font-bold uppercase rounded hover:bg-[#DE5D35]/90 cursor-pointer"
                  >
                    TOKENIZE
                  </button>
                </div>

                {/* Extracted Token Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tokens.map((tok) => (
                    <button
                      type="button"
                      key={`token-chip-${tok.id}-${tok.text}`}
                      onClick={() => setInspectedToken(tok)}
                      className={`px-3 py-1.5 rounded text-[12px] border transition-all cursor-pointer ${
                        inspectedToken?.text === tok.text
                          ? "bg-[#00FFCC] text-black border-[#00FFCC] font-bold shadow-md"
                          : "bg-white/10 text-white border-white/10 hover:border-white/40"
                      }`}
                    >
                      <span className="opacity-60 text-[10px] mr-1">
                        #{tok.id}:
                      </span>
                      <span>&ldquo;{tok.text}&rdquo;</span>
                    </button>
                  ))}
                </div>

                {/* Token Byte & Embedding Inspector */}
                {inspectedToken && (
                  <div className="p-3 bg-black/40 border border-white/10 rounded text-[11px] grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[#DE5D35] font-bold block mb-1">
                        TOKEN TEXT
                      </span>
                      <span>&ldquo;{inspectedToken.text}&rdquo;</span>
                    </div>
                    <div>
                      <span className="text-[#00FFCC] font-bold block mb-1">
                        VOCABULARY ID
                      </span>
                      <span>
                        Index {inspectedToken.id} in{" "}
                        <MathTex math="\mathbb{R}^{37000 \times 512}" />
                      </span>
                    </div>
                    <div>
                      <span className="text-[#FFB703] font-bold block mb-1">
                        ASCII / UTF-8 BYTES
                      </span>
                      <span>0x{inspectedToken.bytes}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 02: TOKENS IN 3D VECTOR SPACE & CONTEXT ADDITION
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / Vector Geometry
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Tokens in 3D Vector Space &amp; Context Addition
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                Each token ID is projected into a dense continuous embedding
                space <MathTex math="d_{model} = 512" />. Tokens with similar
                semantic meanings cluster together. Drag to orbit the 3D
                coordinate space, switch between static embeddings and value
                addition, and inspect vector similarities:
              </p>

              {/* 3D Vector Space HUD Container */}
              <div className="bg-[#07090C] border border-white/15 rounded-[4px] p-5 font-mono text-white">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00FFCC] animate-pulse" />
                    <span className="text-[11px] font-bold text-[#00FFCC] tracking-wider uppercase">
                      3D VECTOR SPACE SIMULATOR ·{" "}
                      <MathTex math="\mathbb{R}^{512} \to \mathbb{R}^3" />
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[#FAF9F5]">
                    DRAG TO ROTATE · FULL 3D ORBIT
                  </span>
                </div>

                {/* Mode Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-[11px]">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setVecMode("static")}
                      className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
                        vecMode === "static"
                          ? "bg-[#00FFCC] text-black border-[#00FFCC] font-bold"
                          : "bg-white/5 border-white/20 text-white"
                      }`}
                    >
                      1. STATIC EMBEDDINGS
                    </button>
                    <button
                      type="button"
                      onClick={() => setVecMode("context")}
                      className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
                        vecMode === "context"
                          ? "bg-[#00FFCC] text-black border-[#00FFCC] font-bold"
                          : "bg-white/5 border-white/20 text-white"
                      }`}
                    >
                      2. + VALUE ADDITION (CONTEXT)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVecMode("autoregress")}
                      className={`px-3 py-1.5 rounded border transition-all cursor-pointer ${
                        vecMode === "autoregress"
                          ? "bg-[#DE5D35] text-white border-[#DE5D35] font-bold"
                          : "bg-white/5 border-white/20 text-white"
                      }`}
                    >
                      3. AUTOREGRESSIVE (STEP-BY-STEP)
                    </button>
                  </div>

                  {/* Mode-Specific Sub-Controls */}
                  {vecMode === "context" && (
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-[#00FFCC] font-bold">
                        LAYER DEPTH:
                      </span>
                      <input
                        type="range"
                        min="1"
                        max="6"
                        value={contextLayer}
                        onChange={(e) =>
                          setContextLayer(Number(e.target.value))
                        }
                        className="accent-[#00FFCC]"
                      />
                      <span>LAYER {contextLayer} / 6</span>
                    </div>
                  )}

                  {vecMode === "autoregress" && (
                    <div className="flex items-center gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() =>
                          setAutoStepIdx((prev) => Math.max(0, prev - 1))
                        }
                        className="px-2 py-1 bg-white/10 border border-white/20 rounded cursor-pointer"
                      >
                        ◀ PREV
                      </button>
                      <span className="text-[#DE5D35] font-bold">
                        TOKEN {autoStepIdx + 1} / 8
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setAutoStepIdx((prev) =>
                            Math.min(PRESET_VEC_TOKENS.length - 3, prev + 1),
                          )
                        }
                        className="px-2 py-1 bg-[#DE5D35] text-white rounded font-bold cursor-pointer"
                      >
                        NEXT ▶
                      </button>
                    </div>
                  )}
                </div>

                {/* Canvas Display */}
                <canvas
                  ref={vecCanvasRef}
                  className="w-full h-[320px] sm:h-[360px] rounded cursor-grab block border border-white/10 mb-4 touch-none"
                />

                {/* Token Selector for Cosine Similarity Calculation */}
                <div className="p-3 bg-black/40 border border-white/10 rounded flex flex-wrap items-center justify-between gap-3 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#75716B]">VECTOR A:</span>
                    <select
                      value={selectedTokenA ?? 0}
                      onChange={(e) =>
                        setSelectedTokenA(Number(e.target.value))
                      }
                      className="bg-[#141518] border border-white/20 rounded px-2 py-1 text-white"
                    >
                      {PRESET_VEC_TOKENS.map((t, idx) => (
                        <option key={`vec-token-a-${t.id}`} value={idx}>
                          &ldquo;{t.text}&rdquo;
                        </option>
                      ))}
                    </select>

                    <span className="text-[#75716B] ml-2">VECTOR B:</span>
                    <select
                      value={selectedTokenB ?? 1}
                      onChange={(e) =>
                        setSelectedTokenB(Number(e.target.value))
                      }
                      className="bg-[#141518] border border-white/20 rounded px-2 py-1 text-white"
                    >
                      {PRESET_VEC_TOKENS.map((t, idx) => (
                        <option key={`vec-token-b-${t.id}`} value={idx}>
                          &ldquo;{t.text}&rdquo;
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#DE5D35] font-bold">
                      COSINE SIMILARITY: {cosineSim.toFixed(3)}
                    </span>
                    <span className="text-white/40 text-[10px]">
                      <MathTex math="\frac{u \cdot v}{\|u\| \|v\|}" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 03: POSITIONAL ENCODINGS (HARMONIC SINE/COSINE SPECTRUM)
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                03 / Harmonic Geometry
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Sinusoidal Positional Encoding &amp; Frequency Harmonics
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                Because self-attention operates across all positions in parallel
                with zero recurrence, it is completely permutation-invariant.
                Shuffling input words computes identical outputs. Vaswani et al.
                solved this by adding harmonic sine and cosine waves directly
                into the embedding vectors:
              </p>

              <div className="p-4 bg-[#EFECE6] border border-[#1A1816]/10 rounded font-mono text-[13px] text-center my-4 overflow-x-auto">
                <MathTex
                  math="PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{model}}}\right), \quad PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{model}}}\right)"
                  block
                />
              </div>

              {/* Live Animated Waveform Canvas */}
              <div className="bg-[#07090C] border border-white/15 rounded-[4px] p-5 font-mono text-white mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] text-[#00FFCC] font-bold uppercase">
                    HARMONIC SINE (CYAN) &amp; COSINE (ORANGE) SPECTRUM
                  </span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-white/60">SEQUENCE LENGTH:</span>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      value={posSeqLen}
                      onChange={(e) => setPosSeqLen(Number(e.target.value))}
                      className="accent-[#00FFCC]"
                    />
                    <span className="text-[#00FFCC] font-bold">
                      {posSeqLen} POS
                    </span>
                  </div>
                </div>

                <canvas
                  ref={posCanvasRef}
                  className="w-full h-[160px] sm:h-[180px] rounded block border border-white/10 mb-3"
                />

                <div className="text-[10px] text-white/50 flex justify-between">
                  <span>
                    HIGH FREQUENCIES (Local syntax &amp; immediate neighbours)
                  </span>
                  <span>
                    LOW FREQUENCIES (Long-range global context up to 10,000·2π)
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 04: SCALED DOT-PRODUCT & MULTI-HEAD ATTENTION
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                04 / Attention Mechanics
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Scaled Dot-Product &amp; Multi-Head Projections
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                Queries (<MathTex math="Q" />
                ), Keys (<MathTex math="K" />
                ), and Values (<MathTex math="V" />) are computed via learned
                projections. Scaling by <MathTex math="1/\sqrt{d_k}" /> prevents
                softmax gradients from vanishing for large vector dimensions:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-white border border-[#1A1816]/10 rounded">
                  <h3 className="font-mono text-[12px] font-bold uppercase text-[#DE5D35] mb-2">
                    Scaled Dot-Product Attention
                  </h3>
                  <div className="py-2">
                    <MathTex
                      math="\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V"
                      block
                    />
                  </div>
                </div>

                <div className="p-4 bg-white border border-[#1A1816]/10 rounded">
                  <h3 className="font-mono text-[12px] font-bold uppercase text-[#DE5D35] mb-2">
                    Multi-Head Projections (<MathTex math="h=8" />)
                  </h3>
                  <div className="py-2">
                    <MathTex
                      math="\mathrm{MultiHead}(Q, K, V) = \mathrm{Concat}(\mathrm{head}_1, \dots, \mathrm{head}_h)W^O"
                      block
                    />
                  </div>
                </div>
              </div>

              {/* Coreference Resolution Attention Simulator */}
              <div className="p-5 bg-white border border-[#1A1816]/10 rounded mb-4">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <span className="font-mono text-[11px] font-bold text-[#DE5D35] uppercase">
                    INTERACTIVE COREFERENCE ATTENTION RESOLUTION
                  </span>
                  <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => setActiveHead(1)}
                      className={`px-3 py-1 rounded border transition-all cursor-pointer ${
                        activeHead === 1
                          ? "bg-[#DE5D35] text-white border-[#DE5D35] font-bold"
                          : "bg-[#FAF9F5] border-[#1A1816]/20 text-[#1A1816]"
                      }`}
                    >
                      Head 1 · Coreference (&rarr; animal)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveHead(2)}
                      className={`px-3 py-1 rounded border transition-all cursor-pointer ${
                        activeHead === 2
                          ? "bg-[#DE5D35] text-white border-[#DE5D35] font-bold"
                          : "bg-[#FAF9F5] border-[#1A1816]/20 text-[#1A1816]"
                      }`}
                    >
                      Head 2 · Syntactic (&rarr; street)
                    </button>
                  </div>
                </div>

                {/* Sentence Tokens */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {SENTENCE_TOKENS.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedAttentionIdx(item.idx)}
                      className={`relative px-3 py-2 rounded font-mono text-[12px] transition-all border cursor-pointer ${
                        item.idx === selectedAttentionIdx
                          ? "bg-[#1A1816] text-[#FAF9F5] border-[#1A1816] font-bold shadow-sm"
                          : "bg-[#FAF9F5] border-[#1A1816]/20 text-[#1A1816] hover:border-[#DE5D35]"
                      }`}
                    >
                      {item.text}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#DE5D35] rounded-b transition-all"
                        style={{
                          opacity: weights[item.idx],
                          transform: `scaleX(${weights[item.idx]})`,
                        }}
                      />
                    </button>
                  ))}
                </div>

                {/* Weight Distribution Bars */}
                <div className="space-y-1.5 font-mono text-[12px]">
                  {SENTENCE_TOKENS.map((item) => (
                    <div
                      key={`weight-bar-${item.id}`}
                      className="flex items-center gap-3"
                    >
                      <span className="w-16 text-right font-medium text-[#1A1816]">
                        {item.text}:
                      </span>
                      <div className="grow bg-[#EFECE6] h-3.5 rounded-xs overflow-hidden">
                        <div
                          className="h-full bg-[#DE5D35] transition-all duration-300"
                          style={{ width: `${weights[item.idx] * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-bold text-[#DE5D35]">
                        {(weights[item.idx] * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 05: POSITION-WISE FEED-FORWARD NETWORK
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                05 / Deep Layers
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Position-Wise Feed-Forward Networks as Associative Memories
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                While self-attention connects different tokens across sequence
                space, the <strong>Feed-Forward Network (FFN)</strong> processes
                each token independently. It projects the embedding dimension 4×
                from <MathTex math="d_{model} = 512" /> up to{" "}
                <MathTex math="d_{ff} = 2048" /> with non-linear activation, and
                contracts back:
              </p>

              <div className="p-4 bg-[#EFECE6] border border-[#1A1816]/10 rounded font-mono text-[13px] text-center my-4 overflow-x-auto">
                <MathTex
                  math="\mathrm{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2 = \mathrm{ReLU}(xW_1 + b_1)W_2 + b_2"
                  block
                />
              </div>

              {/* FFN 4x Dimensional Expansion Visualizer */}
              <div className="p-5 bg-[#0C0E12] border border-white/10 rounded-[4px] font-mono text-white mb-6">
                <div className="text-[11px] text-[#00FFCC] uppercase font-bold mb-4 flex justify-between items-center">
                  <span>FFN 4× EXPANSION &amp; NEURON FIRING PIPELINE</span>
                  <span className="text-white/60">
                    2/3 OF MODEL WEIGHTS LIVE IN FFN
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center text-center text-[12px] mb-6">
                  {/* Input Block */}
                  <div className="p-4 bg-[#141820] border border-[#00FFCC]/30 rounded">
                    <span className="text-[#00FFCC] font-bold block mb-1 text-[11px]">
                      INPUT TOKEN x
                    </span>
                    <span className="text-[16px] font-black text-white">
                      d = 512
                    </span>
                    <span className="text-[10px] text-white/50 block mt-1">
                      Contextualized
                    </span>
                  </div>

                  <div className="text-[#DE5D35] font-black text-[18px]">
                    &rarr;{" "}
                    <span className="text-[10px] block text-white/50">
                      W₁ ∈ ℝ^(512×2048)
                    </span>
                  </div>

                  {/* Expanded Hidden Layer */}
                  <div className="p-4 bg-[#141820] border border-[#DE5D35] rounded shadow-md relative overflow-hidden">
                    <div className="absolute top-1 right-2 text-[9px] text-[#00FFCC] animate-pulse">
                      ● FIRING
                    </div>
                    <span className="text-[#DE5D35] font-bold block mb-1 text-[11px]">
                      EXPANDED HIDDEN LAYER
                    </span>
                    <span className="text-[20px] font-black text-white">
                      d_ff = 2048
                    </span>
                    <span className="text-[10px] text-[#52E3A4] block mt-1">
                      {Math.round(ffnInputVal * 280)} / 2048 Neurons Active
                    </span>
                  </div>

                  <div className="text-[#52E3A4] font-black text-[18px]">
                    &rarr;{" "}
                    <span className="text-[10px] block text-white/50">
                      W₂ ∈ ℝ^(2048×512)
                    </span>
                  </div>

                  {/* Contracted Output */}
                  <div className="p-4 bg-[#141820] border border-[#52E3A4]/40 rounded">
                    <span className="text-[#52E3A4] font-bold block mb-1 text-[11px]">
                      PROJECTED OUTPUT
                    </span>
                    <span className="text-[16px] font-black text-white">
                      d = 512
                    </span>
                    <span className="text-[10px] text-white/50 block mt-1">
                      Residual Ready
                    </span>
                  </div>
                </div>

                {/* Input Magnitude Slider */}
                <div className="p-3 bg-black/40 border border-white/10 rounded flex flex-wrap items-center justify-between gap-3 text-[11px]">
                  <span className="text-white/70">
                    SIMULATE INPUT VECTOR MAGNITUDE (x):
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.1"
                      value={ffnInputVal}
                      onChange={(e) => setFfnInputVal(Number(e.target.value))}
                      className="accent-[#DE5D35]"
                    />
                    <span className="text-[#DE5D35] font-bold min-w-[40px]">
                      {ffnInputVal.toFixed(1)}x
                    </span>
                  </div>
                  <span className="text-[#52E3A4]">
                    ReLU Sparsity:{" "}
                    {(100 - ((ffnInputVal * 280) / 2048) * 100).toFixed(1)}%
                    dead neurons
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 06: RESIDUAL CONNECTIONS & GRADIENT HIGHWAYS
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                06 / Stability &amp; Backprop
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Residual Connections &amp; Layer Normalization Gradient Highways
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                Without residual skip connections, gradients vanish
                exponentially in deep architectures. By formulating each
                sub-layer as <MathTex math="x + \mathrm{Sublayer}(x)" />, the
                gradient derivative contains an unbroken identity term{" "}
                <MathTex math="\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \cdot \left(1 + \frac{\partial \mathrm{Sublayer}}{\partial x}\right)" />
                :
              </p>

              <div className="p-4 bg-[#EFECE6] border border-[#1A1816]/10 rounded font-mono text-[13px] text-center my-4 overflow-x-auto">
                <MathTex
                  math="\mathrm{Output} = \mathrm{LayerNorm}\left(x + \mathrm{Sublayer}(x)\right) = \left[\frac{(x + \mathrm{Sublayer}(x)) - \mu}{\sqrt{\sigma^2 + \epsilon}}\right] \odot \gamma + \beta"
                  block
                />
              </div>

              {/* Interactive Residual Connection Comparison Studio */}
              <div className="p-5 bg-white border border-[#1A1816]/10 rounded mb-6 font-mono">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <span className="text-[11px] text-[#DE5D35] uppercase font-bold">
                    SIGNAL RETENTION THROUGH 6 DEEP LAYERS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setResidualEnabled(true)}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all border cursor-pointer ${
                        residualEnabled
                          ? "bg-[#52E3A4] text-black border-[#52E3A4]"
                          : "bg-white border-[#1A1816]/20 text-[#1A1816]"
                      }`}
                    >
                      ✓ RESIDUAL SKIP ENABLED (x + Sublayer(x))
                    </button>
                    <button
                      type="button"
                      onClick={() => setResidualEnabled(false)}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all border cursor-pointer ${
                        !residualEnabled
                          ? "bg-[#DE5D35] text-white border-[#DE5D35]"
                          : "bg-white border-[#1A1816]/20 text-[#1A1816]"
                      }`}
                    >
                      ✗ DISABLE (VANISHING GRADIENT)
                    </button>
                  </div>
                </div>

                {/* Layer Signal Propagation Bar Chart */}
                <div className="space-y-3">
                  {LAYERS.map((layer) => {
                    const signal = residualEnabled
                      ? Math.max(95, 100 - (layer - 1) * 0.8)
                      : Math.round(100 * 0.42 ** (layer - 1));

                    return (
                      <div
                        key={`layer-sig-${layer}`}
                        className="flex items-center gap-3 text-[12px]"
                      >
                        <span className="w-20 font-bold text-[#1A1816]">
                          LAYER {layer}:
                        </span>
                        <div className="grow bg-[#EFECE6] h-4 rounded-xs overflow-hidden relative">
                          <div
                            className={`h-full transition-all duration-500 ${
                              residualEnabled ? "bg-[#52E3A4]" : "bg-[#DE5D35]"
                            }`}
                            style={{ width: `${signal}%` }}
                          />
                        </div>
                        <span
                          className={`w-16 text-right font-bold ${
                            residualEnabled
                              ? "text-emerald-700"
                              : "text-[#DE5D35]"
                          }`}
                        >
                          {signal}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-3 bg-[#FAF9F5] border border-[#1A1816]/10 rounded text-[11px] text-[#75716B]">
                  {residualEnabled ? (
                    <span className="text-emerald-800 font-semibold">
                      ✓ Gradient Highway Active: Signal flows undiminished
                      across all 6 layers via the identity skip path.
                    </span>
                  ) : (
                    <span className="text-[#DE5D35] font-semibold">
                      ✗ Vanishing Gradient Failure: Without skip connections,
                      signal degrades by Layer 4 and vanishes completely by
                      Layer 6.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 07: THE ENCODER & DECODER TOWERS (6 ACTUAL LAYERS)
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                07 / Full Architecture
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Dual 6-Layer Stacks: Encoder &amp; Decoder Towers
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Canonical Paper SVG Blueprint */}
                <div className="flex justify-center p-4 bg-white border border-[#1A1816]/10 rounded">
                  <svg
                    viewBox="0 0 420 540"
                    className="w-full max-w-[340px] h-auto"
                    style={{ fontFamily: "monospace" }}
                    role="img"
                    aria-label="Transformer Architecture Dual Tower Blueprint"
                  >
                    <title>Transformer Architecture Dual Tower Blueprint</title>
                    {/* ENCODER TOWER */}
                    <rect
                      x="30"
                      y="80"
                      width="160"
                      height="380"
                      rx="4"
                      fill="#FAF9F5"
                      stroke="#1A1816"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="38"
                      y="100"
                      fill="#75716B"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      ENCODER (Nx = 6)
                    </text>

                    {/* Feed Forward */}
                    <rect
                      x="45"
                      y="125"
                      width="130"
                      height="42"
                      rx="3"
                      fill="#008080"
                      fillOpacity="0.15"
                      stroke="#008080"
                      strokeWidth="1.5"
                    />
                    <text
                      x="110"
                      y="150"
                      textAnchor="middle"
                      fill="#008080"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      Feed Forward
                    </text>

                    {/* Add & Norm 2 */}
                    <rect
                      x="55"
                      y="180"
                      width="110"
                      height="28"
                      rx="2"
                      fill="#DE5D35"
                      fillOpacity="0.15"
                      stroke="#DE5D35"
                      strokeWidth="1.2"
                    />
                    <text
                      x="110"
                      y="198"
                      textAnchor="middle"
                      fill="#DE5D35"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      Add &amp; Norm
                    </text>

                    {/* Multi-Head Self-Attention */}
                    <rect
                      x="45"
                      y="225"
                      width="130"
                      height="48"
                      rx="3"
                      fill="#F4A261"
                      fillOpacity="0.2"
                      stroke="#F4A261"
                      strokeWidth="1.5"
                    />
                    <text
                      x="110"
                      y="248"
                      textAnchor="middle"
                      fill="#B25E1A"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      Multi-Head
                    </text>
                    <text
                      x="110"
                      y="262"
                      textAnchor="middle"
                      fill="#B25E1A"
                      fontSize="10"
                    >
                      Attention
                    </text>

                    {/* Add & Norm 1 */}
                    <rect
                      x="55"
                      y="290"
                      width="110"
                      height="28"
                      rx="2"
                      fill="#DE5D35"
                      fillOpacity="0.15"
                      stroke="#DE5D35"
                      strokeWidth="1.2"
                    />
                    <text
                      x="110"
                      y="308"
                      textAnchor="middle"
                      fill="#DE5D35"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      Add &amp; Norm
                    </text>

                    {/* Input Positional Encoding */}
                    <circle
                      cx="110"
                      cy="380"
                      r="14"
                      fill="#FAF9F5"
                      stroke="#1A1816"
                      strokeWidth="1.2"
                    />
                    <text
                      x="110"
                      y="384"
                      textAnchor="middle"
                      fill="#1A1816"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      +
                    </text>
                    <rect
                      x="45"
                      y="415"
                      width="130"
                      height="32"
                      rx="2"
                      fill="#EFECE6"
                      stroke="#1A1816"
                      strokeWidth="1.2"
                    />
                    <text
                      x="110"
                      y="435"
                      textAnchor="middle"
                      fill="#1A1816"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      Input Embedding
                    </text>

                    {/* DECODER TOWER */}
                    <rect
                      x="230"
                      y="80"
                      width="160"
                      height="380"
                      rx="4"
                      fill="#FAF9F5"
                      stroke="#1A1816"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="238"
                      y="100"
                      fill="#75716B"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      DECODER (Nx = 6)
                    </text>

                    {/* Decoder Feed Forward */}
                    <rect
                      x="245"
                      y="125"
                      width="130"
                      height="42"
                      rx="3"
                      fill="#008080"
                      fillOpacity="0.15"
                      stroke="#008080"
                      strokeWidth="1.5"
                    />
                    <text
                      x="310"
                      y="150"
                      textAnchor="middle"
                      fill="#008080"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      Feed Forward
                    </text>

                    {/* Add & Norm 3 */}
                    <rect
                      x="255"
                      y="180"
                      width="110"
                      height="28"
                      rx="2"
                      fill="#DE5D35"
                      fillOpacity="0.15"
                      stroke="#DE5D35"
                      strokeWidth="1.2"
                    />
                    <text
                      x="310"
                      y="198"
                      textAnchor="middle"
                      fill="#DE5D35"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      Add &amp; Norm
                    </text>

                    {/* Cross-Attention Bridge */}
                    <rect
                      x="245"
                      y="225"
                      width="130"
                      height="48"
                      rx="3"
                      fill="#E76F51"
                      fillOpacity="0.25"
                      stroke="#E76F51"
                      strokeWidth="1.5"
                    />
                    <text
                      x="310"
                      y="248"
                      textAnchor="middle"
                      fill="#A83218"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      Cross Attention
                    </text>
                    <text
                      x="310"
                      y="262"
                      textAnchor="middle"
                      fill="#A83218"
                      fontSize="10"
                    >
                      (Q: Dec, K,V: Enc)
                    </text>

                    {/* Masked Multi-Head Attention */}
                    <rect
                      x="245"
                      y="295"
                      width="130"
                      height="48"
                      rx="3"
                      fill="#E9C46A"
                      fillOpacity="0.25"
                      stroke="#E9C46A"
                      strokeWidth="1.5"
                    />
                    <text
                      x="310"
                      y="318"
                      textAnchor="middle"
                      fill="#8B6D1B"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      Masked Attention
                    </text>
                    <text
                      x="310"
                      y="332"
                      textAnchor="middle"
                      fill="#8B6D1B"
                      fontSize="10"
                    >
                      Causal Lookahead
                    </text>

                    {/* Cross Attention Bridge Line */}
                    <path
                      d="M 110 120 L 110 110 L 220 110 L 220 249 L 245 249"
                      fill="none"
                      stroke="#DE5D35"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  </svg>
                </div>

                {/* Layer Breakdown */}
                <div className="space-y-4 text-[13px] text-[#4A4742]">
                  <div className="p-4 bg-white border border-[#1A1816]/10 rounded">
                    <span className="font-mono text-[11px] font-bold text-[#DE5D35] uppercase block mb-1">
                      ENCODER (6 LAYERS)
                    </span>
                    <p className="leading-relaxed">
                      Processes the source input sentence bidirectionally. Each
                      layer attends across all input positions simultaneously to
                      create contextualized representations of every token.
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-[#1A1816]/10 rounded">
                    <span className="font-mono text-[11px] font-bold text-[#DE5D35] uppercase block mb-1">
                      CROSS-ATTENTION BRIDGE
                    </span>
                    <p className="leading-relaxed">
                      The decoder queries (<MathTex math="Q" />) attend to the
                      encoder keys (<MathTex math="K" />) and values (
                      <MathTex math="V" />
                      ). This allows the decoder to look back at the source
                      sentence at each step.
                    </p>
                  </div>

                  <div className="p-4 bg-white border border-[#1A1816]/10 rounded">
                    <span className="font-mono text-[11px] font-bold text-[#DE5D35] uppercase block mb-1">
                      DECODER (6 LAYERS)
                    </span>
                    <p className="leading-relaxed">
                      Generates tokens autoregressively. Incorporates masked
                      self-attention to prevent peeking at future tokens during
                      parallel training.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 08: AUTOREGRESSIVE NATURE & CAUSAL MASKING
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                08 / Autoregressive Nature
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Autoregressive Next-Token Generation &amp; Causal Lookahead
                Masking
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                In generation mode, the model predicts one token at a time. The
                causal mask adds <MathTex math="-\infty" /> to future positions
                in the attention matrix so token <MathTex math="t" /> can only
                attend to previous tokens <MathTex math="\le t" />:
              </p>

              {/* Step By Step Generation Box */}
              <div className="p-5 bg-white border border-[#1A1816]/10 rounded mb-6 font-mono">
                <div className="text-[11px] text-[#DE5D35] uppercase font-bold mb-4 flex justify-between items-center">
                  <span>AUTOREGRESSIVE GENERATION SEQUENCE</span>
                  <span>
                    STEP {decoderStep + 1} OF {AR_SEQUENCE.length}
                  </span>
                </div>

                {/* Steps Navigator */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {AR_SEQUENCE.map((step) => (
                    <button
                      type="button"
                      key={step.stepId}
                      onClick={() => setDecoderStep(step.stepIdx)}
                      className={`px-3 py-1.5 rounded text-[11px] font-bold uppercase transition-all border cursor-pointer ${
                        decoderStep === step.stepIdx
                          ? "bg-[#DE5D35] text-white border-[#DE5D35] shadow-xs"
                          : "bg-[#FAF9F5] border-[#1A1816]/20 text-[#1A1816] hover:bg-white"
                      }`}
                    >
                      Step {step.stepIdx + 1}: &ldquo;{step.token}&rdquo;
                    </button>
                  ))}
                </div>

                {/* Context Window & Next Token Probabilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/10 rounded">
                    <div className="text-[10px] text-[#75716B] uppercase mb-2">
                      Context Window (Input to Decoder)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {AR_SEQUENCE.slice(0, decoderStep + 1).map((s) => (
                        <span
                          key={`ctx-tok-${s.stepId}`}
                          className="px-2.5 py-1 bg-white border border-[#1A1816]/20 text-[12px] font-bold rounded"
                        >
                          {s.token}
                        </span>
                      ))}
                      <span className="px-2.5 py-1 bg-[#DE5D35]/15 border border-[#DE5D35] text-[#DE5D35] text-[12px] font-bold rounded animate-pulse">
                        ? &rarr; Next Token
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/10 rounded">
                    <div className="text-[10px] text-[#75716B] uppercase mb-2">
                      Top Softmax Predictions
                    </div>
                    <div className="space-y-1.5 text-[12px]">
                      {AR_SEQUENCE[decoderStep].logits.map((l) => (
                        <div
                          key={`pred-word-${l.word}`}
                          className="flex justify-between items-center py-0.5 border-b border-[#1A1816]/5"
                        >
                          <span className="font-semibold text-[#1A1816]">
                            &ldquo;{l.word}&rdquo;
                          </span>
                          <span className="text-[#DE5D35] font-bold">
                            {l.p}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Triangular Causal Mask Visualizer */}
              <div className="p-5 bg-[#07090C] text-white border border-white/10 rounded font-mono">
                <div className="text-[11px] text-[#00FFCC] uppercase font-bold mb-3 flex justify-between">
                  <span>
                    CAUSAL ATTENTION MASK MATRIX (<MathTex math="M_{ij}" />)
                  </span>
                  <span className="text-[#DE5D35] text-[10px]">
                    -∞ CAUSAL LOCKOUT
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 max-w-sm mx-auto text-center text-[10px]">
                  {CAUSAL_MASK_CELLS.map((cell) => (
                    <div
                      key={cell.id}
                      className={`p-2 rounded border ${
                        cell.isAllowed
                          ? "bg-[#00FFCC]/20 border-[#00FFCC]/40 text-[#00FFCC] font-bold"
                          : "bg-[#DE5D35]/20 border-[#DE5D35]/40 text-[#DE5D35]"
                      }`}
                    >
                      {cell.isAllowed ? "0" : "-∞"}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-white/50 text-center mt-3">
                  Row <MathTex math="i" /> can only attend to columns{" "}
                  <MathTex math="j \le i" />. Future positions receive{" "}
                  <MathTex math="-\infty" /> before softmax.
                </div>
              </div>
            </div>
          </section>

          {/* ──────────────────────────────────────────────────────────────────
              SECTION 09: FINAL LINEAR PROJECTION & SOFTMAX SAMPLING STUDIO
              ────────────────────────────────────────────────────────────────── */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                09 / Output Head
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Final Linear Projection, Softmax Probabilities &amp; Temperature
              </h2>
            </div>

            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-6 sm:p-8 rounded-[2px] mb-8">
              <p className="text-[14px] text-[#4A4742] leading-[1.7] mb-6">
                The top decoder output vector{" "}
                <MathTex math="h_{final} \in \mathbb{R}^{d_{model}}" /> is
                projected by a final linear weight matrix{" "}
                <MathTex math="W_v \in \mathbb{R}^{d_{model} \times |V|}" />{" "}
                into raw vocabulary logits{" "}
                <MathTex math="z \in \mathbb{R}^{|V|}" />. A calibrated softmax
                with{" "}
                <strong>
                  Temperature (<MathTex math="T" />)
                </strong>{" "}
                converts logits into normalized probability distribution{" "}
                <MathTex math="P(w_i)" />:
              </p>

              <div className="p-4 bg-[#EFECE6] border border-[#1A1816]/10 rounded font-mono text-[13px] text-center my-4 overflow-x-auto">
                <MathTex
                  math="P(w_i) = \frac{\exp\left(z_i / T\right)}{\sum_{j=1}^{|V|} \exp\left(z_j / T\right)}"
                  block
                />
              </div>

              {/* Interactive Softmax Temperature Studio Box */}
              <div className="p-5 bg-[#0C0E12] border border-white/10 rounded-[4px] font-mono text-white mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-white/10 pb-4">
                  <span className="text-[11px] text-[#00FFCC] font-bold uppercase">
                    INTERACTIVE SOFTMAX TEMPERATURE &amp; TOP-K STUDIO
                  </span>
                  {/* Sampling Method Radio Buttons */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setSamplingMethod("temperature")}
                      className={`px-3 py-1 rounded border transition-all cursor-pointer ${
                        samplingMethod === "temperature"
                          ? "bg-[#00FFCC] text-black border-[#00FFCC] font-bold"
                          : "bg-white/10 border-white/20 text-white"
                      }`}
                    >
                      Temperature (T)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSamplingMethod("topk")}
                      className={`px-3 py-1 rounded border transition-all cursor-pointer ${
                        samplingMethod === "topk"
                          ? "bg-[#FFB703] text-black border-[#FFB703] font-bold"
                          : "bg-white/10 border-white/20 text-white"
                      }`}
                    >
                      Top-K Truncation
                    </button>
                    <button
                      type="button"
                      onClick={() => setSamplingMethod("greedy")}
                      className={`px-3 py-1 rounded border transition-all cursor-pointer ${
                        samplingMethod === "greedy"
                          ? "bg-[#DE5D35] text-white border-[#DE5D35] font-bold"
                          : "bg-white/10 border-white/20 text-white"
                      }`}
                    >
                      Greedy (ArgMax)
                    </button>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-3 bg-black/40 border border-white/10 rounded">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-[11px]">
                      <span className="text-white/70">TEMPERATURE (T):</span>
                      <span className="text-[#00FFCC] font-bold">
                        {temperature.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2.0"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full accent-[#00FFCC]"
                    />
                    <div className="flex justify-between text-[9px] text-white/40 mt-1">
                      <span>0.1 (Greedy / Deterministic)</span>
                      <span>1.0 (Standard)</span>
                      <span>2.0 (High Entropy / Creative)</span>
                    </div>
                  </div>

                  {samplingMethod === "topk" && (
                    <div>
                      <div className="flex justify-between items-center mb-1 text-[11px]">
                        <span className="text-white/70">TOP-K CUTOFF:</span>
                        <span className="text-[#FFB703] font-bold">
                          K = {topK}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="1"
                        value={topK}
                        onChange={(e) => setTopK(Number(e.target.value))}
                        className="w-full accent-[#FFB703]"
                      />
                      <div className="flex justify-between text-[9px] text-white/40 mt-1">
                        <span>K=1 (Only #1 token)</span>
                        <span>K=5 (Top 5 tokens)</span>
                        <span>K=8 (All tokens)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Softmax Probabilities Bar Chart */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-[10px] text-white/50 uppercase border-b border-white/10 pb-1">
                    <span>CANDIDATE TOKEN (LOGIT z_i)</span>
                    <span>SOFTMAX PROBABILITY P(w_i)</span>
                  </div>

                  {softmaxProbabilities.map((item, i) => (
                    <div
                      key={`soft-item-${item.word}`}
                      className={`flex items-center gap-3 text-[12px] ${item.isFilteredOut ? "opacity-30" : "opacity-100"}`}
                    >
                      <div className="w-36 flex items-center justify-between text-left">
                        <span className="font-bold text-white">
                          &ldquo;{item.word}&rdquo;
                        </span>
                        <span className="text-[10px] text-white/40">
                          (z={item.logit})
                        </span>
                      </div>

                      <div className="grow bg-white/10 h-4 rounded-xs overflow-hidden relative">
                        <div
                          className={`h-full transition-all duration-200 ${
                            item.isFilteredOut
                              ? "bg-white/20"
                              : i === 0
                                ? "bg-[#00FFCC]"
                                : "bg-[#DE5D35]"
                          }`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>

                      <span
                        className={`w-14 text-right font-bold ${item.isFilteredOut ? "text-white/30" : "text-[#00FFCC]"}`}
                      >
                        {item.isFilteredOut ? "CUT" : `${item.percent}%`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-white/50 p-2 bg-black/40 rounded">
                  💡 Notice: Lowering temperature to{" "}
                  <span className="text-[#00FFCC]">T=0.2</span> collapses
                  entropy onto the highest logit (&ldquo;transduction&rdquo;),
                  while raising to <span className="text-[#DE5D35]">T=1.8</span>{" "}
                  flattens the distribution across all candidates.
                </div>
              </div>
            </div>
          </section>

          {/* Reference Citation */}
          <footer className="border-t border-[#1A1816]/15 pt-8 text-[13px] font-mono text-[#75716B]">
            <p className="mb-2">
              <strong>Primary Reference:</strong> Vaswani, A., Shazeer, N.,
              Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł.,
              &amp; Polosukhin, I. (2017). <em>Attention Is All You Need</em>.
              Advances in Neural Information Processing Systems (NeurIPS 2017).
            </p>
            <p>AI Society — Bennett University Research Curriculum Archive.</p>
          </footer>
        </div>
      </main>
    </FoldLayout>
  );
}
