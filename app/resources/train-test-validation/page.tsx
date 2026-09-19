"use client";

import Link from "next/link";
import FoldLayout from "@/components/FoldLayout";
import { Looped, LoopedStyles, PALETTE } from "@/components/looped";
import MathTex from "@/components/MathTex";

export default function TrainTestValidationArticlePage() {
  // Section 02 diagram: one dataset bar separates into three blocks, validation
  // is consulted repeatedly, test is read once. Single deterministic 8s loop.
  const css = `
    @keyframes ttvTrainBlock {
      0%, 10%   { left: 0%;  width: 60%; background: #1A1816; color: #FAF9F5; }
      22%, 88%  { left: 0%;  width: 54%; background: #1A1816; color: #FAF9F5; }
      100%      { left: 0%;  width: 60%; background: #1A1816; color: #FAF9F5; }
    }
    @keyframes ttvValBlock {
      0%, 10%   { left: 60%; width: 20%; background: #1A1816; color: #FAF9F5; box-shadow: none; }
      22%       { left: 59%; width: 18%; background: #FAF9F5; color: #1A1816; box-shadow: none; }
      28%       { background: #DE5D35; color: #FAF9F5; box-shadow: 0 0 0 3px rgba(222,93,53,0.30); }
      33%       { background: #FAF9F5; color: #1A1816; box-shadow: none; }
      38%       { background: #DE5D35; color: #FAF9F5; box-shadow: 0 0 0 3px rgba(222,93,53,0.30); }
      43%       { background: #FAF9F5; color: #1A1816; box-shadow: none; }
      48%       { background: #DE5D35; color: #FAF9F5; box-shadow: 0 0 0 3px rgba(222,93,53,0.30); }
      53%       { background: #FAF9F5; color: #1A1816; box-shadow: none; }
      58%       { background: #DE5D35; color: #FAF9F5; box-shadow: 0 0 0 3px rgba(222,93,53,0.30); }
      63%       { background: #FAF9F5; color: #1A1816; box-shadow: none; }
      68%       { background: #DE5D35; color: #FAF9F5; box-shadow: 0 0 0 3px rgba(222,93,53,0.30); }
      73%, 88%  { left: 59%; width: 18%; background: #FAF9F5; color: #1A1816; box-shadow: none; }
      100%      { left: 60%; width: 20%; background: #1A1816; color: #FAF9F5; box-shadow: none; }
    }
    @keyframes ttvTestBlock {
      0%, 10%   { left: 80%; width: 20%; background: #1A1816; color: #FAF9F5; }
      22%, 86%  { left: 82%; width: 18%; background: #C9C4BA; color: #1A1816; }
      92%       { background: #DE5D35; color: #FAF9F5; }
      100%      { left: 80%; width: 20%; background: #1A1816; color: #FAF9F5; }
    }
    @keyframes ttvLabelIn {
      0%, 12%   { opacity: 0; }
      24%, 90%  { opacity: 1; }
      100%      { opacity: 0; }
    }
    .ttv-train, .ttv-val, .ttv-test { position: absolute; border: 1px solid rgba(26,24,22,0.15); }
    .ttv-train { left: 0%; width: 54%; background: #1A1816; color: #FAF9F5; }
    .ttv-val   { left: 59%; width: 18%; background: #FAF9F5; color: #1A1816; }
    .ttv-test  { left: 82%; width: 18%; background: #C9C4BA; color: #1A1816; }
    .ttv-train { animation: ttvTrainBlock 8s linear infinite; }
    .ttv-val   { animation: ttvValBlock 8s linear infinite; }
    .ttv-test  { animation: ttvTestBlock 8s linear infinite; }
    .ttv-label { animation: ttvLabelIn 8s linear infinite; }
  `;

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
                Foundations · Train, Test &amp; Validation
              </span>
            </div>
          </div>

          {/* Header */}
          <header className="mb-14 border-b border-[#1A1816]/15 pb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#75716B]">
                Interactive Diagnostic Essay · Topic 12
              </span>
            </div>
            <h1 className="text-[38px] sm:text-[56px] font-black tracking-[-0.035em] leading-[1.02] uppercase font-display text-[#1A1816] mb-5">
              Train, Test &amp; Validation: The Honest Split
            </h1>
            <p className="text-[16px] sm:text-[18px] text-[#75716B] max-w-2xl leading-[1.6]">
              A model graded on the rows it memorised always looks brilliant.
              This essay shows why one dataset must become three — and how a
              single careless peek can quietly turn your final number into a
              fiction.
            </p>
          </header>

          {/* Section 01: The cardinal sin */}
          <section className="mb-16">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                01 / The Cardinal Sin
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Never Grade The Exam You Taught
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  A model earns its keep by being right about data it has{" "}
                  <em>never seen</em>. Train and evaluate it on the same rows
                  and that question silently disappears — you are no longer
                  asking whether it generalises, only whether it can recognise
                  what it was already handed.
                </p>
                <p>
                  The degenerate extreme makes this obvious. A{" "}
                  <strong>1-nearest-neighbour</strong> classifier simply stores
                  every training point. Ask it to predict a stored point and its
                  nearest neighbour is itself, at distance zero:
                </p>
                <div className="p-3 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[13px]">
                  <MathTex
                    math="\text{Train accuracy}(k{=}1) = \frac{1}{n}\sum_{i=1}^{n} \mathbb{1}\!\left[\hat{y}(x_i) = y_i\right] = 1"
                    block
                  />
                </div>
                <p>
                  A degree-12 polynomial threaded through 13 points is the same
                  trick in a different costume: zero training error, and wild
                  oscillation in the gaps between the points. Neither model has
                  learned anything about cats, dogs, or digits. Each has only
                  learned the answer key.
                </p>
              </div>

              <div className="lg:col-span-5 p-4 bg-[#1A1816] text-[#FAF9F5]">
                <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-3">
                  The tell
                </span>
                <p className="text-[13px] leading-[1.7]">
                  If your score keeps climbing every time you add capacity, that
                  is not progress — it is the definition of memorisation. The
                  only honest question is what happens <em>off-book</em>, on
                  rows the model has never had the chance to store.
                </p>
              </div>
            </div>
          </section>

          {/* Section 02: The three sets + looped diagram */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                02 / The Three Sets
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Three Jobs, Three Datasets
              </h2>
            </div>

            <p className="text-[14px] text-[#4A4742] leading-[1.7] max-w-3xl mb-6">
              So we split the data. Not into two parts but three, each with a
              different job and a different rule for when it may be read. The
              discipline is deliberately asymmetric: training and validation are
              working sets, while the test set is a sealed envelope opened once.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {[
                {
                  name: "Training Set",
                  share: "60–80%",
                  desc: "The model fits its parameters here. Read it as often as you like — it is the only set whose feedback is allowed to change the model.",
                },
                {
                  name: "Validation Set",
                  share: "10–20%",
                  desc: "Used to compare models and choose hyperparameters. Consulted many times; after each look you may change your mind. This is the set that does model selection.",
                },
                {
                  name: "Test Set",
                  share: "10–20%",
                  desc: "Locked away until the very end. Read exactly once, after every choice is frozen. The number you report comes from here.",
                },
              ].map((s) => (
                <div
                  key={s.name}
                  className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold">
                      {s.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#75716B]">
                      {s.share}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Looped split diagram */}
            <div className="border border-[#1A1816]/15 bg-[#FAF9F5] p-5">
              <LoopedStyles
                css={css}
                reduceMotionTargets={[
                  ".ttv-train",
                  ".ttv-val",
                  ".ttv-test",
                  ".ttv-label",
                ]}
              />
              <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#75716B]">
                <span>ONE DATASET → THREE SETS</span>
                <span className="font-semibold text-[#DE5D35]">8s loop</span>
              </div>
              <div className="bg-[#F4F1EA] border border-[#1A1816]/10 p-4 rounded-[2px]">
                <Looped label="Animation of a single dataset bar splitting into training, validation and test blocks. The validation block flashes repeatedly as it is consulted again and again, while the test block stays dim and untouched until a single final flash at the end of the cycle.">
                  <div className="relative h-32 w-full">
                    <div className="ttv-train top-8 h-11 flex items-center justify-center font-mono text-[10px] font-bold tracking-wider">
                      <span className="ttv-label">TRAIN</span>
                    </div>
                    <div className="ttv-val top-8 h-11 flex items-center justify-center font-mono text-[10px] font-bold tracking-wider">
                      <span className="ttv-label">VAL</span>
                    </div>
                    <div className="ttv-test top-8 h-11 flex items-center justify-center font-mono text-[10px] font-bold tracking-wider">
                      <span className="ttv-label">TEST</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-mono text-[#75716B]">
                      <span>fit parameters</span>
                      <span>consult freely</span>
                      <span>read once</span>
                    </div>
                  </div>
                </Looped>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-[11px] font-mono text-[#75716B]">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 border border-[#1A1816]/20"
                    style={{ background: PALETTE.ink }}
                  />
                  train
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 border border-[#1A1816]/20"
                    style={{ background: PALETTE.accent }}
                  />
                  validation · many looks
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 border border-[#1A1816]/20"
                    style={{ background: PALETTE.muted }}
                  />
                  test · one reading
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#75716B] text-center mt-3 uppercase tracking-wider">
                validation flickers — it is consulted repeatedly · test stays
                dim until the final flash
              </p>
            </div>
          </section>

          {/* Section 03: Why validation is not optional */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                03 / Why Validation Is Not Optional
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Two Kinds Of Parameters
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  A model holds two kinds of parameters. The first — weights and
                  biases — the optimiser fits for you by descending the loss on
                  the training set. The second you choose by hand before
                  training begins: tree depth, the regularisation strength{" "}
                  <MathTex math="\lambda" />, the number of neighbours{" "}
                  <MathTex math="k" />, the number of layers. Call these{" "}
                  <strong>hyperparameters</strong>.
                </p>
                <p>
                  Now ask how you pick them. If you compare candidates on the
                  test set and keep the winner, the test set has been used as a
                  training signal. Each comparison teaches you something about
                  its noise, and the number you report becomes the best of many
                  tries rather than an unbiased reading of one frozen model.
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    Select On Validation, Report On Test
                  </span>
                  <MathTex
                    math="\theta^\star = \arg\min_{\theta \in \Theta} \text{Err}_{\text{val}}(h_\theta), \qquad \text{report } \text{Err}_{\text{test}}(h_{\theta^\star})"
                    block
                  />
                </div>
                <p>
                  This is the core of the article: choosing hyperparameters by
                  test performance quietly promotes the test set into a{" "}
                  <strong>second training set</strong>. The final number then
                  measures how well you fitted the test set, not how well the
                  model will travel.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#75716B] font-bold mb-2">
                    Fit by the optimiser
                  </span>
                  <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                    Weights and biases, learned by gradient descent. The
                    training set exists to shape these.
                  </p>
                </div>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-2">
                    Chosen by you
                  </span>
                  <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                    Depth, <MathTex math="\lambda" />, <MathTex math="k" />,
                    learning rate. The validation set exists to rank{" "}
                    <em>these</em> — never the test set.
                  </p>
                </div>
                <div className="p-4 bg-[#1A1816] text-[#FAF9F5]">
                  <p className="text-[12px] leading-[1.7]">
                    Every configuration you try on the test set leaks a little
                    information out of it. Try enough of them and the best test
                    score is optimistic by construction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 04: Splitting in practice */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                04 / Splitting in Practice
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Random — Until It Must Not Be
              </h2>
            </div>

            <p className="text-[14px] text-[#4A4742] leading-[1.7] max-w-3xl mb-6">
              The common conventions are a <strong>60 / 20 / 20</strong> split
              for large datasets and <strong>70 / 15 / 15</strong> when data is
              tighter. The exact ratio matters less than keeping the test set
              big enough for a stable estimate and the validation set big enough
              to tell candidates apart. And the split must be <em>random</em> —
              except in the three cases below, where randomness is exactly the
              bug.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  name: "Stratified",
                  tag: "class imbalance",
                  desc: "With a rare class — fraud, disease — a plain random split can leave almost none of it in validation. Sample each class in proportion within every split.",
                },
                {
                  name: "Grouped",
                  tag: "rows are not independent",
                  desc: "Several visits per patient, many sessions per user. Keep every group entirely inside one split, or the model recognises the patient instead of the pattern.",
                },
                {
                  name: "Time-ordered",
                  tag: "temporal data",
                  desc: "Shuffle nothing. Train on the past, validate and test on the future. A random split lets the model peek at tomorrow to predict yesterday.",
                },
              ].map((s) => (
                <div
                  key={s.name}
                  className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15"
                >
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-1">
                    {s.name}
                  </span>
                  <span className="block text-[10px] font-mono text-[#75716B] mb-2">
                    {s.tag}
                  </span>
                  <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
              <p className="text-[13px] text-[#4A4742] leading-[1.7]">
                The rule behind all three: your split must mimic how the model
                will meet the world in production. If the future never appears
                in training once deployed, it must not appear in training here
                either.
              </p>
            </div>
          </section>

          {/* Section 05: Leakage */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                05 / Leakage
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                The Doors Information Sneaks Through
              </h2>
            </div>

            <p className="text-[14px] text-[#4A4742] leading-[1.7] max-w-3xl mb-6">
              Even with three clean sets, information leaks. Leakage is any path
              by which knowledge of the test data reaches training. It almost
              always inflates the score, and it is almost always invisible until
              production.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  name: "Scaling before splitting",
                  desc: "Computing the mean and standard deviation over the whole dataset leaks test statistics into training. Fit the scaler on the training split, then apply that same transform to validation and test.",
                },
                {
                  name: "Target leakage",
                  desc: "A feature that secretly encodes the label — account_closed_date predicting churn, or a field filled in only after the outcome was known.",
                },
                {
                  name: "Duplicate rows",
                  desc: "The same record lands in both train and test, so the model has effectively already seen the test point. De-duplicate before you split.",
                },
                {
                  name: "Tuning on the test set",
                  desc: "Trying many hyperparameter settings and reporting the best test score. Each peek nudges the model toward the test set and the reported number upward.",
                },
              ].map((l) => (
                <div
                  key={l.name}
                  className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15"
                >
                  <span className="block text-[11px] font-mono uppercase tracking-widest text-[#EF4444] font-bold mb-2">
                    {l.name}
                  </span>
                  <p className="text-[12px] text-[#4A4742] leading-[1.6]">
                    {l.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
              <div className="lg:col-span-5 p-4 bg-[#FAF9F5] border border-[#1A1816]/15 font-mono text-[12px]">
                <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                  The scaling rule
                </span>
                <MathTex
                  math="z = \frac{x - \mu_{\text{train}}}{\sigma_{\text{train}}}"
                  block
                />
                <p className="text-[11px] text-[#75716B] leading-[1.6] mt-1">
                  <MathTex math="\mu" /> and <MathTex math="\sigma" /> come from
                  training rows only.
                </p>
              </div>
              <div className="lg:col-span-7 p-4 bg-[#1A1816] text-[#FAF9F5]">
                <p className="text-[13px] leading-[1.7]">
                  A useful audit for any pipeline: could a single test row have
                  influenced <em>anything</em> in training — a mean, a feature,
                  a hyperparameter, a duplicate? If yes, the estimate is
                  optimistic.
                </p>
              </div>
            </div>
          </section>

          {/* Section 06: When data is scarce */}
          <section className="mb-16 border-t border-[#1A1816]/15 pt-12">
            <div className="mb-6">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#75716B]">
                06 / When Data Is Scarce
              </span>
              <h2 className="text-[22px] font-bold text-[#1A1816] mt-0.5">
                Borrowing From Yourself
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 text-[14px] text-[#4A4742] leading-[1.7] space-y-4">
                <p>
                  A single split carries a hidden cost: the model never trains
                  on the validation rows, and you never learn how sensitive the
                  score is to which rows landed where. On small datasets that
                  waste is real, and the estimate is noisy.
                </p>
                <p>
                  <strong>Cross-validation</strong> answers this by rotating the
                  job. Split the data into <MathTex math="k" /> folds; train on{" "}
                  <MathTex math="k-1" /> and validate on the held-out fold;
                  repeat <MathTex math="k" /> times so every row takes a turn as
                  validation. The average is a more stable estimate, and the
                  spread across folds is one you can actually quote.
                </p>
                <div className="p-4 bg-[#FAF9F5] border border-[#1A1816]/15">
                  <span className="block text-[11px] font-mono uppercase text-[#75716B] mb-2">
                    Rotate The Validation Role
                  </span>
                  <MathTex
                    math="\text{CV}_k = \frac{1}{k}\sum_{i=1}^{k} \text{Err}_{\text{val}}^{(i)}"
                    block
                  />
                </div>
                <p>
                  The test set still stays sealed — cross-validation replaces
                  the validation role, not the final exam.{" "}
                  <strong>Topic 05</strong> works through the mechanics, the
                  choice of <MathTex math="k" />, and the grouped and
                  time-series variants that keep the folds honest.
                </p>
              </div>

              <div className="lg:col-span-5 p-4 bg-[#1A1816] text-[#FAF9F5]">
                <span className="block text-[11px] font-mono uppercase tracking-widest text-[#DE5D35] font-bold mb-3">
                  Rule of thumb
                </span>
                <p className="text-[13px] leading-[1.7]">
                  Small data, many candidates → cross-validation. Large data,
                  few candidates → a single 60 / 20 / 20 split is simpler and
                  just as honest. Either way, the test set is read once.
                </p>
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
                href="/resources/bias-variance"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-[#75716B] hover:text-[#1A1816] transition-colors"
              >
                <span>← Topic 11: Bias-Variance Tradeoff</span>
              </Link>
              <Link
                href="/resources/double-descent"
                className="inline-flex items-center gap-2 text-[12px] font-mono text-[#DE5D35] font-bold hover:underline"
              >
                <span>Topic 13: Double Descent →</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
