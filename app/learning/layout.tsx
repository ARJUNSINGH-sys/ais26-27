import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Center | AI Society, Bennett University",
  description:
    "Interactive visual essays, mathematical derivations, and hands-on simulations from first principles. Explore the complete machine learning curriculum.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
