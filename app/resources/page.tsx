"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import FoldLayout from "@/components/FoldLayout";

interface ArticleMeta {
  index: string;
  slug: string;
  category: "DEEP LEARNING" | "EVALUATION" | "CLASSIFICATION" | "REGRESSION" | "VALIDATION";
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  author: string;
  featured?: boolean;
}

const PUBLISHED_ARTICLES: ArticleMeta[] = [
  {
    index: "01",
    slug: "neural-networks",
    category: "DEEP LEARNING",
    title: "Neural Networks: A Visual Introduction",
    subtitle:
      "Constructing feed-forward computational graphs from first principles — layer activations, synaptic weights, and backpropagation feedback loops.",
    readTime: "12 min read",
    date: "May 2024",
    author: "AIS Research Cohort",
    featured: true,
  },
  {
    index: "02",
    slug: "roc-auc",
    category: "EVALUATION",
    title: "ROC & AUC: Diagnostic Power",
    subtitle:
      "Mapping the sensitivity vs. specificity tradeoff across continuous decision thresholds with confusion matrix projections.",
    readTime: "8 min read",
    date: "April 2024",
    author: "AIS Research Cohort",
  },
  {
    index: "03",
    slug: "logistic-regression",
    category: "CLASSIFICATION",
    title: "Logistic Regression & The Sigmoid Curve",
    subtitle:
      "Projecting continuous feature combinations onto calibrated probability bounds. Analyzing logit slopes and decision boundaries.",
    readTime: "7 min read",
    date: "March 2024",
    author: "AIS Research Cohort",
  },
  {
    index: "04",
    slug: "linear-regression",
    category: "REGRESSION",
    title: "Linear Regression: Ordinary Least Squares",
    subtitle:
      "Minimizing orthogonal Euclidean residuals in parameter space. Closed-form normal equations versus iterative gradient steps.",
    readTime: "6 min read",
    date: "February 2024",
    author: "AIS Research Cohort",
  },
  {
    index: "05",
    slug: "precision-recall",
    category: "EVALUATION",
    title: "Precision-Recall & F1 Optimization",
    subtitle:
      "Navigating severe class imbalance where accuracy fails. Harmonic balance between false alarms and missed detections.",
    readTime: "9 min read",
    date: "January 2024",
    author: "AIS Research Cohort",
  },
  {
    index: "06",
    slug: "cross-validation",
    category: "VALIDATION",
    title: "K-Fold Partitioning & Generalization",
    subtitle:
      "Mitigating sample bias and estimating performance variance through rotational holdout splits and out-of-fold validation.",
    readTime: "7 min read",
    date: "December 2023",
    author: "AIS Research Cohort",
  },
];

const CATEGORIES = ["ALL", "DEEP LEARNING", "CLASSIFICATION", "EVALUATION", "REGRESSION", "VALIDATION"] as const;

export default function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredArticles = useMemo(() => {
    return PUBLISHED_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === "ALL" || article.category === selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <FoldLayout>
      <main className="grow pt-28 sm:pt-36 pb-32 bg-[#EFECE6] text-[#1A1816] min-h-screen">
        <div className="shell relative">
          {/* Hairline Section Numeral Watermark (DESIGN.md signature element) */}
          <div
            aria-hidden="true"
            className="absolute right-0 top-6 text-[clamp(120px,20vw,240px)] font-extralight text-black/[0.04] leading-none select-none pointer-events-none tracking-tighter"
          >
            03
          </div>

          {/* Section Header */}
          <header className="relative z-10 max-w-[56ch] mb-16 sm:mb-20">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D35]" />
              <span className="text-[11px] font-mono font-medium tracking-[0.18em] uppercase text-[#75716B]">
                03 / OPEN ARCHIVE · AIS BENNETT UNIVERSITY
              </span>
            </div>

            <h1 className="text-[40px] sm:text-[64px] font-black tracking-[-0.035em] leading-[0.98] uppercase text-[#1A1816] mb-5 font-display">
              Explore Published Articles.
            </h1>

            <p className="text-[16px] text-[#75716B] leading-[1.65]">
              Visual essays and interactive machine learning simulations. Inspect mathematical formulations, observe
              computational graphs evolve on scroll, and manipulate parameters in real time.
            </p>
          </header>

          {/* Swiss Filter & Search Bar */}
          <div className="border-t border-b border-[#1A1816]/15 py-4 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Text Links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] font-mono tracking-wider uppercase">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`inline-flex items-center gap-1.5 transition-colors duration-200 cursor-pointer ${
                      isActive ? "text-[#1A1816] font-bold" : "text-[#75716B] hover:text-[#1A1816]"
                    }`}
                  >
                    {isActive && <span className="w-1 h-1 rounded-full bg-[#DE5D35]" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search archive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 bg-transparent border-b border-[#1A1816]/20 text-[12px] font-mono placeholder:text-[#75716B] focus:outline-none focus:border-[#1A1816] transition-colors"
              />
            </div>
          </div>

          {/* Grid of Articles (Pure Swiss Grid, sharp 1px borders, zero drop shadows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className={`group flex flex-col justify-between border border-[#1A1816]/15 bg-[#FAF9F5] rounded-[2px] transition-all duration-200 hover:border-[#1A1816] ${
                  article.featured ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                {/* SVG Schematic Canvas */}
                <div className="relative h-48 sm:h-52 border-b border-[#1A1816]/10 p-6 flex items-center justify-center bg-[#F4F1EA] overflow-hidden">
                  {/* Subtle Grid Lines */}
                  <div
                    className="absolute inset-0 opacity-40 pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(26,24,22,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(26,24,22,0.08) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* SVG Schematics by Slug */}
                  {article.slug === "neural-networks" && (
                    <svg viewBox="0 0 340 140" className="w-full max-w-[320px] h-auto select-none relative z-10">
                      {/* Connections */}
                      <path d="M 60 45 C 100 45, 110 70, 150 70" fill="none" stroke="#1A1816" strokeWidth="1.5" />
                      <path d="M 60 95 C 100 95, 110 70, 150 70" fill="none" stroke="#1A1816" strokeWidth="1.5" />
                      <path d="M 210 70 L 260 70" fill="none" stroke="#1A1816" strokeWidth="1.5" />

                      {/* Feedback Loop */}
                      <path d="M 270 55 C 270 20, 150 20, 140 55" fill="none" stroke="#DE5D35" strokeWidth="1.5" strokeDasharray="3 3" />
                      <polygon points="140,60 135,50 145,52" fill="#DE5D35" />
                      <text x="200" y="28" fill="#DE5D35" fontSize="8" fontFamily="monospace" textAnchor="middle">
                        ∂L/∂w
                      </text>

                      {/* Input Nodes */}
                      <g transform="translate(20, 30)">
                        <rect width="42" height="28" rx="2" fill="#FAF9F5" stroke="#1A1816" strokeWidth="1.2" />
                        <text x="21" y="18" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1A1816">x₁</text>
                      </g>
                      <g transform="translate(20, 80)">
                        <rect width="42" height="28" rx="2" fill="#FAF9F5" stroke="#1A1816" strokeWidth="1.2" />
                        <text x="21" y="18" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1A1816">x₂</text>
                      </g>

                      {/* Function Node */}
                      <g transform="translate(150, 56)">
                        <rect width="60" height="28" rx="2" fill="#FAF9F5" stroke="#1A1816" strokeWidth="1.2" />
                        <text x="30" y="18" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1A1816">function</text>
                      </g>

                      {/* Output Node */}
                      <g transform="translate(260, 56)">
                        <rect width="50" height="28" rx="2" fill="#FAF9F5" stroke="#1A1816" strokeWidth="1.2" />
                        <text x="25" y="18" textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#1A1816">output</text>
                      </g>
                    </svg>
                  )}

                  {article.slug === "roc-auc" && (
                    <svg viewBox="0 0 240 120" className="w-full max-w-[200px] h-auto select-none relative z-10">
                      <line x1="25" y1="10" x2="25" y2="105" stroke="#1A1816" strokeWidth="1.2" />
                      <line x1="25" y1="105" x2="220" y2="105" stroke="#1A1816" strokeWidth="1.2" />
                      <line x1="25" y1="105" x2="220" y2="10" stroke="#75716B" strokeWidth="1" strokeDasharray="3 3" />
                      <path d="M 25 105 C 25 35, 60 15, 220 10 L 220 105 Z" fill="rgba(222,93,53,0.08)" />
                      <path d="M 25 105 C 25 35, 60 15, 220 10" fill="none" stroke="#DE5D35" strokeWidth="1.8" />
                      <circle cx="85" cy="35" r="4" fill="#1A1816" />
                      <text x="140" y="65" fill="#1A1816" fontSize="10" fontFamily="monospace">AUC = 0.89</text>
                    </svg>
                  )}

                  {article.slug === "logistic-regression" && (
                    <svg viewBox="0 0 240 120" className="w-full max-w-[200px] h-auto select-none relative z-10">
                      <line x1="20" y1="60" x2="220" y2="60" stroke="#1A1816" strokeWidth="0.8" strokeDasharray="2 2" />
                      <line x1="120" y1="10" x2="120" y2="110" stroke="#1A1816" strokeWidth="1.2" />
                      <path d="M 20 105 C 85 105, 95 15, 220 15" fill="none" stroke="#1A1816" strokeWidth="1.8" />
                      <line x1="120" y1="10" x2="120" y2="110" stroke="#DE5D35" strokeWidth="1.2" strokeDasharray="3 3" />
                      <text x="130" y="30" fill="#DE5D35" fontSize="9" fontFamily="monospace">σ(z)</text>
                    </svg>
                  )}

                  {article.slug === "linear-regression" && (
                    <svg viewBox="0 0 240 120" className="w-full max-w-[200px] h-auto select-none relative z-10">
                      <line x1="25" y1="10" x2="25" y2="105" stroke="#1A1816" strokeWidth="1.2" />
                      <line x1="25" y1="105" x2="220" y2="105" stroke="#1A1816" strokeWidth="1.2" />
                      <line x1="35" y1="95" x2="205" y2="20" stroke="#1A1816" strokeWidth="1.8" />
                      {[
                        { x: 55, y: 70, pred: 85 },
                        { x: 85, y: 80, pred: 72 },
                        { x: 125, y: 45, pred: 55 },
                        { x: 165, y: 35, pred: 38 },
                        { x: 190, y: 15, pred: 26 },
                      ].map((pt, i) => (
                        <g key={i}>
                          <line x1={pt.x} y1={pt.y} x2={pt.x} y2={pt.pred} stroke="#DE5D35" strokeWidth="1" strokeDasharray="2 2" />
                          <circle cx={pt.x} cy={pt.y} r="3" fill="#1A1816" />
                        </g>
                      ))}
                    </svg>
                  )}

                  {article.slug === "precision-recall" && (
                    <svg viewBox="0 0 240 120" className="w-full max-w-[200px] h-auto select-none relative z-10">
                      <line x1="25" y1="10" x2="25" y2="105" stroke="#1A1816" strokeWidth="1.2" />
                      <line x1="25" y1="105" x2="220" y2="105" stroke="#1A1816" strokeWidth="1.2" />
                      <path d="M 25 20 C 130 20, 160 45, 205 105" fill="none" stroke="#1A1816" strokeWidth="1.8" />
                      <circle cx="140" cy="35" r="4" fill="#DE5D35" />
                      <text x="100" y="70" fill="#DE5D35" fontSize="9" fontFamily="monospace">F1 Max</text>
                    </svg>
                  )}

                  {article.slug === "cross-validation" && (
                    <svg viewBox="0 0 240 120" className="w-full max-w-[200px] h-auto select-none relative z-10">
                      {[0, 20, 40, 60, 80].map((yOff, foldIdx) => (
                        <g key={foldIdx} transform={`translate(25, ${15 + yOff})`}>
                          {[0, 1, 2, 3, 4].map((partIdx) => (
                            <rect
                              key={partIdx}
                              x={partIdx * 38}
                              y="0"
                              width="34"
                              height="14"
                              rx="1"
                              fill={partIdx === foldIdx ? "#DE5D35" : "#FAF9F5"}
                              stroke="#1A1816"
                              strokeWidth="1"
                            />
                          ))}
                        </g>
                      ))}
                    </svg>
                  )}

                  {/* Corner Index */}
                  <span className="absolute top-3 left-3 text-[11px] font-mono text-[#75716B]">
                    {article.index} /
                  </span>

                  {/* Read Time */}
                  <span className="absolute top-3 right-3 text-[11px] font-mono text-[#75716B]">
                    {article.readTime}
                  </span>
                </div>

                {/* Article Copy Block */}
                <div className="p-6 sm:p-7 flex flex-col justify-between grow">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-[0.14em] uppercase text-[#75716B] block mb-2">
                      {article.category}
                    </span>

                    <h2 className="text-[20px] sm:text-[22px] font-bold text-[#1A1816] group-hover:text-[#DE5D35] transition-colors leading-[1.2] mb-3">
                      {article.title}
                    </h2>

                    <p className="text-[14px] text-[#75716B] leading-[1.65] line-clamp-2 mb-6">
                      {article.subtitle}
                    </p>
                  </div>

                  {/* Footer Row */}
                  <div className="pt-4 border-t border-[#1A1816]/10 flex items-center justify-between text-[11px] font-mono text-[#75716B]">
                    <span>{article.date}</span>
                    <span className="font-bold text-[#1A1816] group-hover:text-[#DE5D35] transition-colors inline-flex items-center gap-1 group-hover:translate-x-1 duration-200">
                      READ ESSAY →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </FoldLayout>
  );
}
