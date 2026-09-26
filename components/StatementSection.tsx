"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StatementSection() {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          standard: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean;
            standard: boolean;
          };

          if (reduceMotion) {
            gsap.set(
              [".statement-text", ".statement-chip", ".statement-pill"],
              {
                opacity: 1,
                y: 0,
                scale: 1,
              },
            );
            return;
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
            defaults: { ease: "power3.out" },
          });

          tl.fromTo(
            ".statement-text",
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.95 },
          )
            .fromTo(
              ".statement-chip",
              { scale: 0.9, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.65,
                stagger: 0.12,
                ease: "back.out(1.6)",
              },
              "-=0.55",
            )
            .fromTo(
              ".statement-pill",
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.7 },
              "-=0.4",
            );
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="about"
      className="py-24 md:py-36 overflow-hidden"
    >
      <div className="shell">
        <div className="mx-auto flex max-w-[1010px] flex-col items-center text-center">
          <p className="statement-text font-display text-[clamp(23px,3vw,38px)] font-bold leading-[1.3] tracking-[-0.028em] text-ink">
            Welcome. We are Bennett University&apos;s{" "}
            <span className="statement-chip chip inline-flex">
              <span className="text-accent" aria-hidden>
                ✦
              </span>
              <span>AI Society</span>
            </span>
            , engineering autonomous systems, neural architectures, and{" "}
            <span className="statement-chip chip inline-flex">
              <span className="text-accent" aria-hidden>
                ◉
              </span>
              <span>Real-World Intelligence</span>
            </span>
            .
          </p>

          <a href="#pillars" className="statement-pill pill mt-11">
            <span>Explore the society</span>
            <span className="pill__medal" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
