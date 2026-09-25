import type { MetadataRoute } from "next";

const SITE_URL = "https://ais26-27.vercel.app";

const PAGES = ["", "/events", "/resources", "/team", "/roadmap"];

// Keep in sync with the articles listed in app/resources/page.tsx
const ESSAYS = [
  "linear-regression",
  "logistic-regression",
  "precision-recall",
  "roc-auc",
  "cross-validation",
  "decision-trees",
  "neural-networks",
  "convolutional-networks",
  "recurrent-networks",
  "random-forest",
  "bias-variance",
  "train-test-validation",
  "double-descent",
  "equality-of-odds",
  "reinforcement-learning",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...ESSAYS.map((slug) => ({ url: `${SITE_URL}/resources/${slug}` })),
  ];
}
