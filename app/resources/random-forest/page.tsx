"use client";

import Link from "next/link";
import FoldLayout from "@/components/FoldLayout";
import { Looped, LoopedStyles } from "@/components/looped";
import MathTex from "@/components/MathTex";

export default function RandomForestArticlePage() {
  const CYCLE = 8; // seconds for one full grow → vote → reset loop

  // Five trees, five votes. Three yes, two no — a clean 3–2 majority.
  const TREES: { vote: "yes" | "no" }[] = [
    { vote: "yes" },
    { vote: "yes" },
    { vote: "no" },
    { vote: "yes" },
    { vote: "no" },
  ];

  // Landing slot for each chip, so stacked votes in a column never overlap.
  const stack: Record<"yes" | "no", number> = { yes: 0, no: 0 };
  const CHIPS = TREES.map((tree, i) => {
    const slot = stack[tree.vote];
    stack[tree.vote] += 1;
    return { i, vote: tree.vote, slot };
  });

  // Trees sprout one by one across the first quarter of the loop.
  const treeFrames = TREES.map((_, i) => {
    const a = 3 + i * 4;
    return `@keyframes rfGrow${i} {
      0%, ${a}% { opacity: 0; transform: scaleY(0.15); }
      ${a + 5}%, 92% { opacity: 1; transform: scaleY(1); }
      98%, 100% { opacity: 0; transform: scaleY(1); }
    }`;
  }).join("\n  ");

  // Each chip falls from its tree into the yes (28%) or no (66%) column.
  const chipFrames = CHIPS.map((c) => {
    const start = 24 + c.i * 4;
    const land = start + 10;
    const x0 = 10 + c.i * 20;
    const x1 = c.vote === "yes" ? 28 : 66;
    const y1 = 54 + c.slot * 8;
    return `@keyframes rfChip${c.i} {
      0%, ${start}% { opacity: 0; left: ${x0}%; top: 20%; }
      ${start + 3}% { opacity: 1; left: ${x0}%; top: 20%; }
      ${land}%, 92% { opacity: 1; left: ${x1}%; top: ${y1}%; }
      98%, 100% { opacity: 0; left: ${x1}%; top: ${y1}%; }
    }`;
  }).join("\n  ");

  const css = `
    ${treeFrames}
    ${chipFrames}
    @keyframes rfBar {
      0%, 54% { transform: scaleY(0); }
      66%, 92% { transform: scaleY(1); }
      98%, 100% { transform: scaleY(0); }
    }
    @keyframes rfMajority {
      0%, 66% { opacity: 0; }
      72%, 92% { opacity: 1; }
      98%, 100% { opacity: 0; }
    }
    .rf-tree { transform-origin: 50% 100%; }
    ${TREES.map((_, i) => `.rf-tree-${i} { animation: rfGrow${i} ${CYCLE}s linear infinite; }`).join("\n    ")}
    ${CHIPS.map((c) => `.rf-chip-${c.i} { animation: rfChip${c.i} ${CYCLE}s linear infinite; }`).join("\n    ")}
    .rf-bar { transform-origin: 50% 100%; animation: rfBar ${CYCLE}s linear infinite; }
    .rf-majority { animation: rfMajority ${CYCLE}s linear infinite; }
  `;

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
                Ensemble Learning · Random Forests
              </span>
            </div>
          </div>

          {/* Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 10
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              Random Forests: Many Trees, One Verdict
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              A single decision tree is brittle — nudge one row and the whole
              structure redraws itself. Plant a few hundred on resampled data,
              force each to inspect a random slice of the features, and let them
              vote. That is a random forest, and it remains one of the best
              out-of-the-box models in existence.
            </p>
          </header>

          {/* Section 01: Condorcet & the growing forest animation */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                01 / The Wisdom of Crowds
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Why a Committee Beats a Genius
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  In 1785 — before gradient descent, before computers, before
                  &ldquo;algorithm&rdquo; meant anything to anyone — the Marquis
                  de Condorcet proved something quietly radical about groups. If
                  every voter is right more often than a coin flip,{" "}
                  <strong>
                    and their mistakes are not copies of each other
                  </strong>
                  , then adding voters makes the majority more likely to be
                  right. Not slightly. Monotonically, all the way toward
                  certainty.
                </p>
                <p>
                  Translate that into machine learning and the arithmetic is
                  startling. One decision tree at 60% accuracy is barely useful.
                  Three such trees, voting, land near 65%. Eleven reach roughly
                  75%. The trees did not get smarter — the errors simply stopped
                  agreeing.
                </p>
                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <MathTex
                    math="P(\text{majority correct}) \to 1 \quad \text{as } B \to \infty"
                    block
                  />
                  <span className="text-[12px] text-[#75716B]">
                    provided each voter has <MathTex math="p > \tfrac{1}{2}" />{" "}
                    and the errors are (nearly) independent.
                  </span>
                </div>
                <p>
                  Both caveats carry the whole theorem. Voters must beat chance
                  — a committee of worse-than-random members is just confidently
                  wrong. And their votes must be only weakly correlated: if
                  every tree memorises the same quirk, three copies of one
                  opinion add nothing at all. Condorcet supplied the idea; two
                  centuries later Leo Breiman supplied the machinery.
                </p>
              </div>

              {/* Growing forest → vote → tally loop */}
              <div className="lg:col-span-7 border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
                <LoopedStyles
                  css={css}
                  reduceMotionTargets={[
                    ".rf-tree",
                    ".rf-chip",
                    ".rf-bar",
                    ".rf-majority",
                  ]}
                />
                <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#75716B]">
                  <span>FIVE TREES · FIVE VOTES · ONE VERDICT</span>
                  <span className="font-semibold text-[#DE5D35]">8s loop</span>
                </div>
                <div className="bg-[#F4F1EA] border border-[#1A1816]/10 rounded-[2px] p-3">
                  <Looped
                    label="Looping animation: five small trees sprout one at a time, each drops a vote chip into a yes or no column, the two tally bars sweep upward to a three-to-two majority for yes, then the whole scene resets"
                    className="w-full"
                  >
                    <div className="relative h-[380px] w-full select-none">
                      {/* Trees appear one by one */}
                      {TREES.map((_, i) => (
                        <div
                          key={`tree-${i}`}
                          className={`rf-tree rf-tree-${i} absolute top-0 flex justify-center`}
                          style={{ left: `${1 + i * 20}%`, width: "18%" }}
                        >
                          <svg
                            viewBox="0 0 40 64"
                            className="w-[46px] h-[64px]"
                            aria-hidden="true"
                          >
                            <polygon
                              points="20,2 32,24 8,24"
                              fill={i % 2 === 0 ? "#DE5D35" : "#1A1816"}
                            />
                            <polygon
                              points="20,16 34,42 6,42"
                              fill={i % 2 === 0 ? "#DE5D35" : "#1A1816"}
                            />
                            <rect
                              x="17"
                              y="42"
                              width="6"
                              height="18"
                              fill="#1A1816"
                            />
                          </svg>
                        </div>
                      ))}

                      {/* Vote chips falling into the two columns */}
                      {CHIPS.map((c) => (
                        <div
                          key={`chip-${c.i}`}
                          className={`rf-chip rf-chip-${c.i} absolute flex h-[18px] w-[18px] items-center justify-center rounded-[2px] font-mono text-[10px] font-bold`}
                          style={{
                            transform: "translate(-50%, -50%)",
                            background:
                              c.vote === "yes" ? "#DE5D35" : "#1A1816",
                            color: "#FAF9F5",
                          }}
                        >
                          {c.vote === "yes" ? "Y" : "N"}
                        </div>
                      ))}

                      {/* Yes tally column */}
                      <div className="absolute bottom-[26px] left-[28%] flex -translate-x-1/2 flex-col items-center">
                        <div className="relative h-[150px] w-14 overflow-hidden border border-[#1A1816]/20 bg-[#EFECE6]">
                          <div className="rf-bar absolute inset-x-0 bottom-0 h-full bg-[#DE5D35]" />
                        </div>
                        <span className="mt-1 text-[10px] font-mono font-bold text-[#DE5D35]">
                          YES · 3
                        </span>
                      </div>

                      {/* No tally column */}
                      <div className="absolute bottom-[26px] left-[66%] flex -translate-x-1/2 flex-col items-center">
                        <div className="relative h-[120px] w-14 overflow-hidden border border-[#1A1816]/20 bg-[#EFECE6]">
                          <div className="rf-bar absolute inset-x-0 bottom-0 h-full bg-[#1A1816]" />
                        </div>
                        <span className="mt-1 text-[10px] font-mono font-bold text-[#75716B]">
                          NO · 2
                        </span>
                      </div>

                      {/* Majority verdict */}
                      <div className="rf-majority absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#1A1816] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#FAF9F5]">
                        Majority → YES
                      </div>
                    </div>
                  </Looped>
                </div>
                <p className="mt-3 text-center text-[11px] font-mono uppercase tracking-wider text-[#75716B]">
                  trees sprout · no two leave the same way · three chips beat
                  two
                </p>
              </div>
            </div>
          </section>

          {/* Section 02: Bagging */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / Bagging
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Bagging: Many Datasets You Do Not Actually Have
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  A deep decision tree is a low-bias, high-variance learner:
                  hand it a different training set and you get a visibly
                  different tree. Bagging turns that vice into a virtue by{" "}
                  <strong>manufacturing the datasets</strong>. Draw{" "}
                  <MathTex math="n" /> rows from the training set{" "}
                  <em>with replacement</em> — a bootstrap sample — so some rows
                  appear twice and others never appear at all.
                </p>
                <p>
                  Exactly how many never appear? The chance a given row is
                  skipped on a single draw is <MathTex math="1 - 1/n" />; over{" "}
                  <MathTex math="n" /> independent draws that compounds to{" "}
                  <MathTex math="(1 - 1/n)^n" />, which converges to{" "}
                  <MathTex math="1/e \approx 0.368" />. So every bootstrap
                  sample contains about{" "}
                  <strong>63.2% of the original rows</strong> — and the missing
                  third is not waste, as Section 05 will show.
                </p>
                <p>
                  Train one <em>unpruned</em> tree per bootstrap sample. Each is
                  individually noisy, but the noise now points in different
                  directions. Averaging <MathTex math="B" /> such learners
                  leaves the bias roughly untouched and divides the independent
                  part of the variance by <MathTex math="B" />.
                </p>
                <p>
                  Plain bagging looks like the whole story — until you notice
                  the trees still consider <em>every</em> feature at every
                  split. On a dataset with one dominant predictor, all of them
                  make the same first cut and the mistakes re-correlate. That
                  flaw is what the next section fixes.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="mb-2 block text-[11px] font-mono uppercase text-[#75716B]">
                    What the Bootstrap Keeps
                  </span>
                  <MathTex
                    math="\Pr(\text{row included}) = 1 - \left(1 - \frac{1}{n}\right)^{n} \to 1 - \frac{1}{e} \approx 0.632"
                    block
                  />
                </div>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="mb-2 block text-[11px] font-mono uppercase text-[#75716B]">
                    Variance of an Independent Average
                  </span>
                  <MathTex
                    math="\mathrm{Var}\!\left(\frac{1}{B}\sum_{b=1}^{B} h_b(x)\right) = \frac{1}{B}\,\mathrm{Var}(h(x))"
                    block
                  />
                  <span className="text-[12px] text-[#75716B]">
                    The assumption this quietly makes — independence — is the
                    one reality breaks.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 03: Feature subsampling & the variance identity */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                03 / Where the Randomness Goes
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Second Coin Flip: Random Splits
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  A random forest adds one more ingredient. At every split of
                  every tree, only a{" "}
                  <strong>random subset of the features</strong> is considered —
                  typically <MathTex math="\sqrt{p}" /> of them for
                  classification and <MathTex math="p/3" /> for regression. With
                  four features a tree chooses among two; with a hundred it
                  chooses among ten.
                </p>
                <p>
                  Because the candidate set is redrawn at each node, a feature
                  that would have monopolised every split is sometimes not even
                  on the ballot. Trees grown on different bootstrap samples now
                  diverge in <em>structure</em>, not merely in noise — which is
                  exactly the decorrelation Condorcet&apos;s theorem was asking
                  for.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="p-4 bg-[#1A1816] text-[#FAF9F5]">
                  <span className="mb-2 block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold">
                    The One Formula to Remember
                  </span>
                  <MathTex
                    math="\mathrm{Var}\!\left(\frac{1}{B}\sum_{b=1}^{B} h_b(x)\right) = \rho\,\sigma^2 + \frac{1-\rho}{B}\,\sigma^2"
                    block
                  />
                  <span className="mt-2 block text-[12px] text-[#FAF9F5]/70 leading-[1.7]">
                    where <MathTex math="\sigma^2" /> is the variance of a
                    single tree and <MathTex math="\rho" /> is the pairwise
                    correlation between any two trees.
                  </span>
                </div>
                <p className="mt-4 text-[14px] text-[#4A4742] leading-[1.7]">
                  Read it slowly. The second term,{" "}
                  <MathTex math="(1-\rho)\sigma^2/B" />, is the good news: it
                  shrinks toward zero as you add trees, so more trees always
                  help. The first term, <MathTex math="\rho\sigma^2" />, is the
                  ceiling. No matter how many trees you plant, the forest can
                  never beat <MathTex math="\rho\sigma^2" /> — the portion of
                  the error the trees <em>share</em>. Lowering the correlation{" "}
                  <MathTex math="\rho" /> is therefore the only lever that moves
                  the floor, and random feature selection is precisely that
                  lever. Breiman put it bluntly: better forests have lower
                  correlation between trees and individually stronger trees.
                </p>
              </div>
            </div>
          </section>

          {/* Section 04: The vote */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                04 / The Vote
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                One Tree, One Vote
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  For classification each tree returns a class label and the
                  forest returns the plurality. For regression each tree returns
                  a number and the forest returns the mean:
                </p>
                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[13px]">
                  <MathTex
                    math="\hat{y}(x) = \operatorname*{arg\,max}_{c \in \mathcal{C}} \sum_{b=1}^{B} \mathbb{1}\!\left[\, h_b(x) = c \,\right]"
                    block
                  />
                  <MathTex
                    math="\hat{y}(x) = \frac{1}{B} \sum_{b=1}^{B} h_b(x)"
                    block
                  />
                </div>
                <p>
                  Many libraries are subtler than a hard show of hands.
                  scikit-learn averages the predicted{" "}
                  <em>leaf probabilities</em> and takes the argmax — a soft vote
                  that weighs confidence, not just the label. It usually behaves
                  a little better, especially near a decision boundary.
                </p>
                <p>
                  A worked tally: five trees answer a yes/no question and vote{" "}
                  <strong>Y, Y, N, Y, N</strong>. Three to two for yes, so the
                  forest predicts yes — even though two of the five disagree,
                  and one of them is a deep, confident tree. With an even number
                  of trees the vote can tie; the tie is broken by whichever
                  class the averaged probability vector ranks first, which is a
                  good reason to leave the tree count odd and generous.
                </p>
              </div>

              <div className="lg:col-span-5 border border-[#1A1816]/15 bg-[#FAF9F5] p-4">
                <span className="mb-3 block text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                  Five Trees, Five Votes
                </span>
                <div className="space-y-2">
                  {CHIPS.map((c) => (
                    <div
                      key={`tally-${c.i}`}
                      className="flex items-center justify-between border-b border-[#1A1816]/10 pb-2 last:border-b-0 last:pb-0"
                    >
                      <span className="font-mono text-[12px] text-[#75716B]">
                        tree_{c.i + 1}
                      </span>
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-[2px] font-mono text-[11px] font-bold"
                        style={{
                          background: c.vote === "yes" ? "#DE5D35" : "#1A1816",
                          color: "#FAF9F5",
                        }}
                      >
                        {c.vote === "yes" ? "Y" : "N"}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-end gap-3 border-t border-[#1A1816]/15 pt-3">
                  <div className="flex-1">
                    <div className="h-2 w-full bg-[#DE5D35]" />
                    <span className="mt-1 block font-mono text-[10px] text-[#75716B]">
                      YES · 3
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-2/3 bg-[#1A1816]" />
                    <span className="mt-1 block font-mono text-[10px] text-[#75716B]">
                      NO · 2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 05: Feature importance & OOB */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                05 / Reading the Forest
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Feature Importance and a Free Validation Set
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="mb-2 block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold">
                  IMPURITY IMPORTANCE
                </span>
                <p className="text-[13px] text-[#4A4742] leading-[1.7]">
                  Sum the weighted impurity decrease every time a feature is
                  used to split, across every tree, and normalise. It is fast
                  and comes free with training — but it is{" "}
                  <strong>biased toward high-cardinality features</strong>. A
                  feature with many distinct values gets more chances to split
                  and quietly inflates its score; a random ID column can look
                  important.
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="mb-2 block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold">
                  PERMUTATION IMPORTANCE
                </span>
                <p className="text-[13px] text-[#4A4742] leading-[1.7]">
                  Shuffle one feature&apos;s column on held-out data and measure
                  the drop in accuracy. Unbiased and model-agnostic — but it
                  costs a fresh prediction pass per feature, and it{" "}
                  <strong>splits credit between correlated features</strong>:
                  when either of two twins can carry the signal, breaking one
                  barely hurts. Report both and read the disagreement.
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  Then there is the validation set you never had to carve out.
                  Each tree is trained on its bootstrap sample and{" "}
                  <strong>never sees the ~36.8% of rows it left out</strong>.
                  Score every training row using only the trees for which it was
                  out-of-bag, let them vote, and you have an honest error
                  estimate for the price of training:
                </p>
                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[13px]">
                  <MathTex
                    math="\mathrm{OOB\ error} = \frac{1}{n} \sum_{i=1}^{n} \mathbb{1}\!\left[\, \hat{y}^{\,\mathrm{oob}}_i \neq y_i \,\right]"
                    block
                  />
                </div>
                <p>
                  Out-of-bag error tracks test error closely enough to tune
                  hyperparameters without touching the test set — which is why
                  turning bootstrap off is a quiet act of self-harm: it deletes
                  the free validation estimate along with the resampling.
                </p>
              </div>
              <div className="lg:col-span-5 p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="mb-2 block text-[11px] font-mono uppercase tracking-widest text-[#1A1816] font-bold">
                  THE 63 / 37 SPLIT
                </span>
                <div className="flex h-3 w-full overflow-hidden rounded-[1px] border border-[#1A1816]/15">
                  <div className="h-full w-[63.2%] bg-[#DE5D35]" />
                  <div className="h-full w-[36.8%] bg-[#C9C4BA]" />
                </div>
                <p className="mt-3 text-[12px] text-[#4A4742] leading-[1.7]">
                  <strong className="text-[#DE5D35]">63.2%</strong> in the bag:
                  used to grow this tree.{" "}
                  <strong className="text-[#75716B]">36.8%</strong> out of the
                  bag: used to grade it. Every tree brings its own exam paper.
                </p>
              </div>
            </div>
          </section>

          {/* Section 06: Field notes */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                06 / Field Notes
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Knobs That Matter, and When to Reach for Something Else
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  name: "n_estimators",
                  desc: "More trees never overfit. Variance falls monotonically, then plateaus; the only real cost is time. 100–500 is the usual working range.",
                },
                {
                  name: "max_features",
                  desc: "sqrt(p) for classification, p/3 for regression are the defaults. Lower it for more decorrelation, raise it for individually stronger — and more correlated — trees.",
                },
                {
                  name: "max_depth / min_samples_leaf",
                  desc: "The genuine regularisers. Cap depth or grow leaf size when trees are enormous or memory-bound; leave them loose otherwise and let the ensemble do the smoothing.",
                },
                {
                  name: "bootstrap / oob_score",
                  desc: "Keep bootstrap on and OOB scoring enabled. Turning bootstrap off removes both the resampling diversity and the free validation estimate in one stroke.",
                },
              ].map((k) => (
                <div
                  key={k.name}
                  className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15"
                >
                  <span className="mb-2 block font-mono text-[11px] font-bold text-[#DE5D35]">
                    {k.name}
                  </span>
                  <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                    {k.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-[#1A1816] text-[#FAF9F5]">
                <span className="mb-2 block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold">
                  WHERE BOOSTING WINS
                </span>
                <p className="text-[13px] leading-[1.7] text-[#FAF9F5]/85">
                  Gradient boosting grows trees <em>sequentially</em>, each one
                  fitted to the residual errors the ensemble still makes. When
                  the signal is subtle and the data is clean, that focus
                  extracts meaning a forest&apos;s parallel vote never will —
                  which is why boosted trees dominate tabular leaderboards.
                </p>
              </div>
              <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                <span className="mb-2 block text-[11px] font-mono uppercase tracking-widest text-[#1A1816] font-bold">
                  WHERE FORESTS WIN
                </span>
                <ul className="space-y-1 text-[13px] leading-[1.8] text-[#4A4742] list-none">
                  <li>· Noisy labels and heterogeneous features</li>
                  <li>· Training that must parallelise across cores</li>
                  <li>· A strong model before any tuning at all</li>
                  <li>· Free out-of-bag validation as a sanity check</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="border-t border-[#1A1816]/15 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/resources/recurrent-networks"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
              >
                <span>← Topic 09: Recurrent Networks</span>
              </Link>
              <Link
                href="/resources/bias-variance"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
              >
                <span>Topic 11: Bias-Variance Tradeoff →</span>
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-mono text-[#75716B]">
                Adapted from MLU-Explain (Amazon, CC BY-SA 4.0).
              </p>
              <Link
                href="/resources"
                className="text-[11px] font-mono font-bold text-[#DE5D35] hover:underline"
              >
                Back to Archive Index →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
