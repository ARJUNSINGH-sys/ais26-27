import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "AI Society — Bennett University | Training Minds, One Epoch at a Time",
  description:
    "Bennett University's premier artificial intelligence student specialization society. Dedicated to deep learning research, intelligent systems, hackathons, and technical workshops.",
  keywords: [
    "AI Society",
    "Bennett University",
    "Artificial Intelligence",
    "Deep Learning",
    "Machine Learning",
    "Hackathon",
    "Student Club",
    "AIS BU"
  ],
  authors: [{ name: "AI Society Bennett University" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
