"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import "lenis/dist/lenis.css";

interface SmoothScrollProps {
  children: React.ReactNode;
  isPaused?: boolean;
}

export function resetScrollToTop() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }
}

export default function SmoothScroll({
  children,
  isPaused = false,
}: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Ensure scroll restoration is manual and scroll resets to 0 on every route change
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    resetScrollToTop();
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]);

  useEffect(() => {
    // Detect touch device for optimal phone performance
    const isTouch =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
      syncTouch: false,
      anchors: { offset: -104 },
    });

    lenisRef.current = lenis;

    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (isPaused) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isPaused]);

  return <>{children}</>;
}
