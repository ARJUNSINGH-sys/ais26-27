"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import FoldLayout from "@/components/FoldLayout";
import { Looped, LoopedStyles } from "@/components/looped";
import MathTex from "@/components/MathTex";

// A 4×4 grid world. The agent starts top-left, the goal is bottom-right, and
// one cell is a pit that ends the episode with a negative reward.
const N = 4;
const GOAL = { r: 3, c: 3 };
const PIT = { r: 1, c: 1 };
const GAMMA = 0.9;
const STEP_REWARD = -0.04;
const GOAL_REWARD = 1;
const PIT_REWARD = -1;
const CELL = 64;

const idx = (r: number, c: number) => r * N + c;

/** Value iteration over the fixed reward table — deterministic, no sampling. */
function solveValues(gamma: number) {
  let v = new Array<number>(N * N).fill(0);
  for (let sweep = 0; sweep < 200; sweep++) {
    const next = new Array<number>(N * N).fill(0);
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (r === GOAL.r && c === GOAL.c) {
          next[idx(r, c)] = GOAL_REWARD;
          continue;
        }
        if (r === PIT.r && c === PIT.c) {
          next[idx(r, c)] = PIT_REWARD;
          continue;
        }
        let best = -Infinity;
        const moves = [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ];
        for (const [nr, nc] of moves) {
          // Bumping a wall leaves the agent where it was.
          const tr = nr < 0 || nr >= N ? r : nr;
          const tc = nc < 0 || nc >= N ? c : nc;
          const candidate = STEP_REWARD + gamma * v[idx(tr, tc)];
          if (candidate > best) best = candidate;
        }
        next[idx(r, c)] = best;
      }
    }
    v = next;
  }
  return v;
}

/** Greedy walk from the start under the solved values. */
function optimalPath(v: number[]) {
  const path: { r: number; c: number }[] = [{ r: 0, c: 0 }];
  let { r, c } = { r: 0, c: 0 };
  for (let step = 0; step < 24; step++) {
    if (r === GOAL.r && c === GOAL.c) break;
    if (r === PIT.r && c === PIT.c) break;
    let bestVal = -Infinity;
    let bestMove = { r, c };
    const moves = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];
    for (const [nr, nc] of moves) {
      const tr = nr < 0 || nr >= N ? r : nr;
      const tc = nc < 0 || nc >= N ? c : nc;
      if (tr === PIT.r && tc === PIT.c) continue; // never walk into the pit
      const val = v[idx(tr, tc)];
      if (val > bestVal) {
        bestVal = val;
        bestMove = { r: tr, c: tc };
      }
    }
    if (bestMove.r === r && bestMove.c === c) break;
    r = bestMove.r;
    c = bestMove.c;
    path.push({ r, c });
  }
  return path;
}

export default function ReinforcementLearningArticlePage() {
  const [gamma, setGamma] = useState<number>(GAMMA);

  const values = useMemo(() => solveValues(gamma), [gamma]);
  const path = useMemo(() => optimalPath(values), [values]);
  const vMin = Math.min(...values);
  const vMax = Math.max(...values);
  const shade = (v: number) => {
    const t = vMax - vMin > 1e-6 ? (v - vMin) / (vMax - vMin) : 0;
    return `rgba(222, 93, 53, ${(t * 0.42).toFixed(3)})`;
  };

  // Section 04 loop: the agent re-walks the greedy path one cell per beat, and
  // the goal pulses each time it arrives. Single fixed 10s clock.
  const pathSteps = Math.max(1, path.length);
  const slot = 100 / pathSteps;
  const agentFrames = path
    .map((p, i) => {
      const from = (i * slot).toFixed(2);
      const to = ((i + 1) * slot).toFixed(2);
      return `${from}%, ${to}% { transform: translate(${p.c * CELL}px, ${p.r * CELL}px); }`;
    })
    .join("\n      ");

  const rlCss = `
    @keyframes rlAgent {
      0%   { opacity: 0; }
      1%   { opacity: 1; }
      96%  { opacity: 1; }
      100% { opacity: 0; }
      ${agentFrames}
    }
    @keyframes rlGoalPulse {
      0%, 88% { opacity: 0.35; }
      93%     { opacity: 1; }
      100%    { opacity: 0.35; }
    }
    .rl-agent { animation: rlAgent 10s steps(1, end) infinite; }
    .rl-goal { animation: rlGoalPulse 10s ease-in-out infinite; }
  `;

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <LoopedStyles
          css={rlCss}
          reduceMotionTargets={[".rl-agent", ".rl-goal"]}
        />
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
                Sequential Decision Making · Reinforcement Learning
              </span>
            </div>
          </div>

          {/* Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 15
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              Reinforcement Learning
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              Every model in this archive learned from a labelled answer key.
              This one gets nothing but consequences — a reward when it does
              well, a cost when it does not, and the job of working out which of
              its own actions put it there.
            </p>
          </header>

          {/* Section 01 */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                01 / No Answer Key
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Learning From Consequences
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  Everything so far in this archive has been{" "}
                  <strong>supervised</strong>: you hand the model rows of
                  features with the correct answer attached, and it learns to
                  reproduce that mapping. The signal is immediate and specific —
                  &ldquo;for <em>this</em> input, the answer was <em>that</em>
                  &rdquo;.
                </p>
                <p>
                  Reinforcement learning removes the answer key. An agent takes
                  an action, the world changes, and it receives a single number
                  — a <strong>reward</strong> — that may arrive long after the
                  decision that caused it. It is never told which action was
                  wrong. It has to infer that from outcomes.
                </p>
                <div className="p-4 bg-[#1A1816] text-[#FAF9F5]">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                    The credit assignment problem
                  </span>
                  <p className="text-[13px] leading-[1.7]">
                    Win a game in 40 moves and which of those 40 moves deserves
                    the credit? The reward is unambiguous; attributing it across
                    a long sequence of decisions is the hard part, and it is
                    what separates RL from everything else in this archive.
                  </p>
                </div>
                <p>
                  That changes the data too. In supervised learning the dataset
                  is fixed before training begins. Here the agent&apos;s own
                  choices determine what data it sees next — explore badly and
                  you train on a distorted view of the world.
                </p>
              </div>

              <div className="lg:col-span-5 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#75716B] mb-4">
                  WHERE THE SIGNAL COMES FROM
                </div>
                <div className="space-y-3">
                  <div className="p-3 border border-[#1A1816]/15">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#1A1816] font-bold mb-1">
                      Supervised
                    </span>
                    <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                      &ldquo;Here is the input; here is the correct
                      output.&rdquo; Dense, immediate, independent per example.
                    </p>
                  </div>
                  <div className="p-3 border border-[#DE5D35] bg-[#DE5D35]/5">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#DE5D35] font-bold mb-1">
                      Reinforcement
                    </span>
                    <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                      &ldquo;You scored 0.7.&rdquo; Sparse, delayed, and
                      correlated with every choice you just made.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 02 */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / The Vocabulary
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Problem Structure
              </h2>
            </div>

            <p className="text-[14px] text-[#4A4742] leading-[1.7] max-w-3xl mb-6">
              Almost every RL problem is formalised the same way — as a{" "}
              <strong>Markov decision process</strong>. Five ingredients, and
              then one rule for choosing what to do.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                  States · S
                </span>
                <p className="text-[13px] text-[#4A4742] leading-[1.6]">
                  Everything the agent can observe about where it currently is.
                  On a board, the position of every piece.
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                  Actions · A
                </span>
                <p className="text-[13px] text-[#4A4742] leading-[1.6]">
                  The moves available in a state. Often shared across states,
                  but not always.
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                  Rewards · R
                </span>
                <p className="text-[13px] text-[#4A4742] leading-[1.6]">
                  The scalar feedback after each transition. This is the whole
                  specification of what you actually want.
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                  Transitions · P
                </span>
                <p className="text-[13px] text-[#4A4742] leading-[1.6]">
                  How the world moves when you act — possibly stochastic, which
                  is why the same action need not give the same result twice.
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                  Discount · γ
                </span>
                <p className="text-[13px] text-[#4A4742] leading-[1.6]">
                  How much a reward now is worth versus the same reward later.
                  In <MathTex math="[0, 1)" />.
                </p>
              </div>
              <div className="p-4 bg-[#1A1816] text-[#FAF9F5]">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1.5">
                  Policy · π
                </span>
                <p className="text-[13px] leading-[1.6]">
                  The thing being learned: a rule mapping states to actions. The
                  goal is the policy that maximises total discounted reward.
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
              <span className="block text-[11px] font-mono uppercase tracking-widest text-[#75716B] mb-2">
                The objective — what &ldquo;good&rdquo; means
              </span>
              <MathTex
                math="G_t = R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \cdots = \sum_{k=0}^{\infty} \gamma^{k} R_{t+k+1}"
                block
              />
              <p className="text-[13px] text-[#4A4742] leading-[1.65] mt-2">
                Not the next reward — the <em>discounted sum</em> of everything
                that follows. That single change is what makes an agent willing
                to accept a small cost now for a large payoff later.
              </p>
            </div>
          </section>

          {/* Section 03 */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                03 / The Simplest Possible Problem
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Bandit: Explore or Exploit?
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  Strip away states and sequences and one hard question remains.
                  You face several slot machines, each with an unknown payout
                  rate. Every pull is either experience or money — never both.
                </p>
                <p>
                  Pull the machine that looks best so far and you collect the
                  reward you already understand (<strong>exploitation</strong>).
                  Pull a different one and you learn something that might change
                  your mind (<strong>exploration</strong>). Spend all your turns
                  exploiting and you may never discover the better machine.
                  Spend them all exploring and you never collect.
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-[#75716B] mb-2">
                    ε-greedy — the simplest answer
                  </span>
                  <MathTex
                    math="\pi(a) = \begin{cases} \arg\max_a Q(a) & \text{w.p. } 1 - \varepsilon \\ \text{uniform random} & \text{w.p. } \varepsilon \end{cases}"
                    block
                  />
                  <p className="text-[12px] text-[#4A4742] leading-[1.6] mt-2">
                    Usually take the best-known action; occasionally, at random,
                    take something else. Crude, and remarkably hard to beat on
                    many problems.
                  </p>
                </div>
                <p>
                  The mechanism that makes this work is the{" "}
                  <strong>running average</strong>. Each machine&apos;s
                  estimated value updates a little toward each new observation,
                  so early noise gets averaged out rather than believed:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <MathTex
                    math="Q_{n+1}(a) = Q_n(a) + \frac{1}{n}\left[R_n - Q_n(a)\right]"
                    block
                  />
                  <p className="text-[12px] text-[#4A4742] leading-[1.6] mt-2">
                    Estimate, plus a fraction of the <em>surprise</em> — the gap
                    between what you expected and what you got. That{" "}
                    <em>prediction error</em> shape reappears in every RL
                    algorithm, right up to the modern deep ones.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-3">
                    The tension, made concrete
                  </span>
                  <div className="space-y-3 text-[12px] text-[#4A4742] leading-[1.6]">
                    <div>
                      <strong className="text-[#1A1816]">Pure greedy</strong>
                      <br />
                      Locks onto whatever looked good in the first few pulls.
                      Often a permanently wrong answer.
                    </div>
                    <div className="pt-3 border-t border-[#1A1816]/10">
                      <strong className="text-[#1A1816]">Pure random</strong>
                      <br />
                      Learns each machine&apos;s true rate perfectly, and cashes
                      in on none of it.
                    </div>
                    <div className="pt-3 border-t border-[#1A1816]/10">
                      <strong className="text-[#DE5D35]">ε-greedy</strong>
                      <br />
                      Buys information at a controlled, decaying price. Neither
                      extreme, and better than both.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#1A1816] text-[#FAF9F5]">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                    Why this matters later
                  </span>
                  <p className="text-[13px] leading-[1.7]">
                    Every RL algorithm inherits this problem. The bandit is
                    where you meet it without the distraction of long sequences
                    and delayed reward.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 04 — looped + interactive */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                04 / From Numbers To Places
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Grid World
              </h2>
            </div>

            <p className="text-[14px] text-[#4A4742] leading-[1.7] max-w-3xl mb-6">
              Now give the agent a body and a map. It starts top-left, wants the
              goal bottom-right, and must avoid the pit. Shading shows how good
              each cell is; the dot re-walks the learned route on a loop. Drag
              the discount factor to see what patience does to the map.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-5">
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <div className="flex justify-between text-[11px] font-mono text-[#75716B] mb-1">
                    <span>DISCOUNT FACTOR γ</span>
                    <span className="font-bold text-[#DE5D35]">
                      {gamma.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.99"
                    step="0.01"
                    value={gamma}
                    onChange={(e) => setGamma(parseFloat(e.target.value))}
                    className="w-full accent-[#DE5D35] cursor-pointer"
                    aria-label="Discount factor"
                  />
                  <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider text-[#75716B] mt-1">
                    <span>impatient</span>
                    <span>far-sighted</span>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[12px] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#75716B]">START VALUE:</span>
                    <span className="font-bold text-[#1A1816]">
                      {values[idx(0, 0)].toFixed(3)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#75716B]">STEPS TO GOAL:</span>
                    <span className="font-bold text-[#DE5D35]">
                      {path.length - 1}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#1A1816]/10 text-[10px] uppercase tracking-wider text-[#75716B]">
                    {gamma < 0.4
                      ? "short horizon · only nearby reward counts"
                      : gamma < 0.8
                        ? "moderate horizon"
                        : "long horizon · distant reward propagates back"}
                  </div>
                </div>

                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15 text-[13px] text-[#4A4742] leading-[1.65]">
                  <strong className="text-[#1A1816]">Watch the map.</strong> At
                  low γ only cells beside the goal look valuable — the shading
                  barely reaches the start. As γ rises, that value propagates
                  backwards one cell at a time until the whole grid knows how to
                  reach the goal.
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <Looped
                  label="A 4 by 4 grid world where shading shows each cell's value and an agent re-walks the optimal route to the goal on a loop"
                  className="border border-[#1A1816]/15 bg-[#FAF9F5] p-5"
                >
                  <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-widest text-[#75716B]">
                    <span>VALUE MAP · GREEDY WALK</span>
                    <span className="text-[#DE5D35] font-bold">
                      γ = {gamma.toFixed(2)}
                    </span>
                  </div>

                  {/* Fixed-pixel grid (no gap) so the agent's translate() lands
                      exactly on cell boundaries. */}
                  <div
                    className="relative"
                    style={{
                      width: N * CELL,
                      height: N * CELL,
                      maxWidth: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${N}, ${CELL}px)`,
                        gridTemplateRows: `repeat(${N}, ${CELL}px)`,
                      }}
                    >
                      {Array.from({ length: N * N }, (_, i) => {
                        const r = Math.floor(i / N);
                        const c = i % N;
                        const isGoal = r === GOAL.r && c === GOAL.c;
                        const isPit = r === PIT.r && c === PIT.c;
                        return (
                          <div
                            key={i}
                            className={`border flex flex-col items-center justify-center ${
                              isGoal
                                ? "rl-goal border-[#DE5D35] bg-[#DE5D35]/20"
                                : isPit
                                  ? "border-[#EF4444] bg-[#EF4444]/15"
                                  : "border-[#1A1816]/15"
                            }`}
                            style={
                              isGoal || isPit
                                ? undefined
                                : { background: shade(values[i]) }
                            }
                          >
                            <span className="text-[9px] font-mono font-bold text-[#1A1816]">
                              {isGoal ? "GOAL" : isPit ? "PIT" : ""}
                            </span>
                            <span className="text-[9px] font-mono text-[#75716B]">
                              {values[i].toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Agent overlay — one cell per beat along the greedy path */}
                    <div
                      className="rl-agent absolute top-0 left-0 flex items-center justify-center pointer-events-none"
                      style={{ width: CELL, height: CELL }}
                    >
                      <span className="block w-4 h-4 rounded-full bg-[#1A1816] border-2 border-[#FAF9F5]" />
                    </div>
                  </div>

                  <p className="text-[11px] font-mono text-[#75716B] mt-3 uppercase tracking-wider">
                    Each cell holds the total reward the agent expects from
                    there onward · the walk never enters the pit
                  </p>
                </Looped>
              </div>
            </div>
          </section>

          {/* Section 05 */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                05 / The Equation Behind The Shading
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Value Iteration
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  Those numbers in the grid were not learned by trial and error.
                  They were computed directly, by sweeping the same update over
                  and over until it stops changing:
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-[#75716B] mb-2">
                    Bellman optimality equation
                  </span>
                  <MathTex
                    math="V(s) \leftarrow \max_{a} \Big[ R(s,a) + \gamma \sum_{s'} P(s' \mid s,a)\, V(s') \Big]"
                    block
                  />
                </div>
                <p>
                  Read it in words:{" "}
                  <em>
                    the value of a state is the best immediate reward available,
                    plus the discounted value of wherever that action lands you.
                  </em>{" "}
                  The definition is <strong>recursive</strong> — value is
                  expressed in terms of value — and that is exactly why
                  iteration works. Start every cell at zero and sweep.
                </p>
                <p>
                  After one sweep, only cells adjacent to the goal have picked
                  up its reward. After two, their neighbours have. Value
                  propagates backward through the grid one ring at a time, which
                  is precisely what the γ slider above lets you watch — a low
                  discount stops the wave early; a high one carries it all the
                  way to the start.
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-[#75716B] mb-2">
                    Then the policy is trivial
                  </span>
                  <MathTex
                    math="\pi^*(s) = \arg\max_a \Big[ R(s,a) + \gamma \sum_{s'} P(s' \mid s,a)\, V(s') \Big]"
                    block
                  />
                  <p className="text-[12px] text-[#4A4742] leading-[1.6] mt-2">
                    Once you know how good every state is, the best move is just
                    the one leading to the best next state. That is the greedy
                    walk the dot is running.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#1A1816] font-bold mb-3">
                    Two ways to get there
                  </span>
                  <div className="space-y-3 text-[12px] text-[#4A4742] leading-[1.6]">
                    <div>
                      <strong className="text-[#1A1816]">Model-based</strong>
                      <br />
                      You know the transition probabilities, so you can iterate
                      the equation directly — what this page does. Needs a model
                      of the world.
                    </div>
                    <div className="pt-3 border-t border-[#1A1816]/10">
                      <strong className="text-[#1A1816]">Model-free</strong>
                      <br />
                      You do not know the transitions, so you estimate values
                      from experience instead — Q-learning and its relatives.
                      Needs only the ability to act and observe.
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#1A1816] text-[#FAF9F5]">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                    The same surprise
                  </span>
                  <p className="text-[13px] leading-[1.7]">
                    Q-learning nudges its estimate by the gap between what it
                    expected and what it got — the identical prediction-error
                    move as the bandit&apos;s running average — only now the
                    target is <em>reward plus the value of the next state</em>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 06 */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                06 / Where This Leads
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                From A Grid To Everything Else
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  The 4×4 grid is where RL is tractable and honest: you can
                  compute the true values and see the agent get it right. Real
                  problems drop both guarantees. State spaces become enormous or
                  continuous, and the transition model is unavailable.
                </p>
                <p>
                  The classical answer is to stop storing a value per state and
                  instead <em>approximate</em> the value function with something
                  that generalises — which is where this archive closes its
                  loop.{" "}
                  <Link
                    href="/resources/neural-networks"
                    className="text-[#DE5D35] font-bold hover:underline"
                  >
                    Topic 07
                  </Link>{" "}
                  built a function approximator that learns from a gradient;
                  swap the supervised loss for the Bellman error and you have
                  deep reinforcement learning.
                </p>
                <p>
                  That combination is powerful and notoriously unstable. The
                  targets move as the network updates, the data is heavily
                  correlated because consecutive states resemble each other, and
                  the exploration/exploitation tension from the bandit never
                  goes away. Most of the engineering in modern RL exists to
                  manage exactly those three problems.
                </p>
                <p>
                  Reward design deserves its own warning. The agent optimises
                  precisely the number you wrote down — not the outcome you
                  intended. Specify it carelessly and it will find the
                  technically-correct, practically-wrong behaviour with
                  unfailing enthusiasm.
                </p>
              </div>

              <div className="lg:col-span-5 p-4 bg-[#1A1816] text-[#FAF9F5]">
                <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-3">
                  Takeaways
                </span>
                <ul className="text-[13px] leading-[1.75] space-y-2">
                  <li>
                    • No answer key — only consequences, often delayed far from
                    the decision that caused them.
                  </li>
                  <li>
                    • An MDP is states, actions, rewards, transitions and a
                    discount; the policy is what you learn.
                  </li>
                  <li>
                    • Exploration buys information; exploitation spends it. You
                    need both, balanced.
                  </li>
                  <li>
                    • Every algorithm here learns from a prediction error — the
                    same idea as the bandit&apos;s running average.
                  </li>
                  <li>
                    • You get exactly the reward you specify, which is rarely
                    exactly the behaviour you wanted.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="border-t border-[#1A1816]/15 pt-8">
            <p className="text-[11px] font-mono text-[#75716B] mb-5">
              Adapted from MLU-Explain (Amazon, CC BY-SA 4.0).
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/resources/equality-of-odds"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
              >
                <span>← Topic 14: Equality of Odds</span>
              </Link>
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-[#DE5D35] font-bold hover:underline"
              >
                <span>Back to the full archive →</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
