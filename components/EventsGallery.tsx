"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The gallery is deliberately captionless — the brief calls for photographs
 * with no overlay, badge, or label. Alt text carries the meaning instead.
 */
const COLUMN_ONE = {
  src: "/images/event-club-carnival.png",
  alt: "Members gathered at the Club Carnival induction festival",
};

const COLUMN_TWO = [
  {
    src: "/images/event-ai-101.png",
    alt: "Attendees working through the AI 101 foundations workshop",
  },
  {
    src: "/images/event-ai-hunt.png",
    alt: "Teams competing in the AI Hunt 2.0 algorithmic challenge",
  },
];

const COLUMN_THREE = [
  {
    src: "/images/event-tech-arena.png",
    alt: "The TechArena 2025 symposium hall in session",
  },
  {
    src: "/images/event-project-showcase.png",
    alt: "Student projects on display at the Project Showcase expo",
  },
];

export default function EventsGallery() {
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
            gsap.set([".gallery-col", ".gallery-photo"], {
              opacity: 1,
              y: 0,
              scale: 1,
            });
            return;
          }

          // Staggered column entrance
          gsap.fromTo(
            ".gallery-col",
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.0,
              stagger: 0.14,
              ease: "power3.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );

          // Subtle photo settling effect inside frames
          gsap.fromTo(
            ".gallery-photo",
            { scale: 1.1 },
            {
              scale: 1,
              duration: 1.2,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );

          // Parallax depth on center column for wide screens
          if (window.innerWidth >= 768) {
            gsap.to(".gallery-col-middle", {
              yPercent: -6,
              ease: "none",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            });
          }
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="works"
      className="py-16 md:py-24 overflow-hidden"
    >
      <div className="shell">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
          {/* Column one — title plate stacked over a tall portrait */}
          <div className="gallery-col flex flex-col gap-5">
            <div className="flex items-center justify-between rounded-[32px] bg-dark p-7 text-white sm:p-8">
              <h2 className="font-display text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em]">
                Selected
                <br />
                Works
              </h2>

              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full border border-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </span>
            </div>

            <div className="frame h-[420px] rounded-[32px] overflow-hidden">
              <Image
                src={COLUMN_ONE.src}
                alt={COLUMN_ONE.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="gallery-photo object-cover will-change-transform"
              />
            </div>
          </div>

          {/* Column two — matched pair */}
          <div className="gallery-col gallery-col-middle flex flex-col gap-5 will-change-transform">
            {COLUMN_TWO.map((photo) => (
              <div
                key={photo.src}
                className="frame h-[240px] rounded-[32px] overflow-hidden"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="gallery-photo object-cover will-change-transform"
                />
              </div>
            ))}
          </div>

          {/* Column three — tall portrait over a wide crop */}
          <div className="gallery-col flex flex-col gap-5">
            <div className="frame h-[300px] rounded-[32px] overflow-hidden">
              <Image
                src={COLUMN_THREE[0].src}
                alt={COLUMN_THREE[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="gallery-photo object-cover will-change-transform"
              />
            </div>

            <div className="frame h-[200px] rounded-[32px] overflow-hidden">
              <Image
                src={COLUMN_THREE[1].src}
                alt={COLUMN_THREE[1].alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="gallery-photo object-cover will-change-transform"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
