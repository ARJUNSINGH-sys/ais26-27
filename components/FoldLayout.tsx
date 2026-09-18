"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import FoldMenu from "@/components/FoldMenu";
import Footer from "@/components/Footer";

interface FoldLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function FoldLayout({
  children,
  showFooter = true,
}: FoldLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    gsap.set("#page-canvas", {
      transformOrigin: "center center",
      scale: 1,
      clipPath: "inset(0% 0% 0% 0% round 0px)",
      willChange: "transform, clip-path",
    });

    gsap.set("#fold-menu-backdrop", {
      autoAlpha: 0,
      pointerEvents: "none",
    });

    gsap.set("#menu-content", {
      transformOrigin: "center center",
      scale: 0.84,
      y: 40,
      z: -220,
      filter: "blur(20px)",
      autoAlpha: 0,
      willChange: "transform, opacity, filter",
    });

    gsap.set(".menu-nav-item", {
      y: 35,
      autoAlpha: 0,
      willChange: "transform, opacity",
    });

    // Master GSAP Timeline expanding and closing from the exact center of screen
    timelineRef.current = gsap
      .timeline({
        paused: true,
        defaults: { ease: "power4.inOut" },
        onReverseComplete: () => {
          gsap.set("#fold-menu-backdrop", {
            autoAlpha: 0,
            pointerEvents: "none",
          });
        },
      })
      // Step 1: Activate backdrop visibility
      .set("#fold-menu-backdrop", { autoAlpha: 1, pointerEvents: "auto" }, 0)

      // Step 2: Fold page canvas inward from screen center
      .to(
        "#page-canvas",
        {
          scale: 0.44,
          clipPath: "inset(46% 46% 46% 46% round 40px)",
          duration: 1.15,
          ease: "power4.inOut",
        },
        0
      )

      // Step 3: Expand menu content outward from center of screen with depth blur clearance
      .to(
        "#menu-content",
        {
          scale: 1,
          y: 0,
          z: 0,
          filter: "blur(0px)",
          autoAlpha: 1,
          duration: 1.05,
          ease: "power3.out",
        },
        "-=0.85"
      )

      // Step 4: Stagger primary navigation links
      .to(
        ".menu-nav-item",
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          stagger: 0.05,
          ease: "power3.out",
        },
        "-=0.75"
      );
  }, []);

  // Bi-directional playback control
  useEffect(() => {
    if (!timelineRef.current) return;
    if (isMenuOpen) {
      timelineRef.current.play();
    } else {
      timelineRef.current.reverse();
    }
  }, [isMenuOpen]);

  const handleNavigate = (href: string) => {
    setIsMenuOpen(false);

    // If navigating to the same route:
    if (href === pathname || (href === "/" && pathname === "/")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (pathname === "/") {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 700);
      } else {
        setTimeout(() => {
          router.push(href);
        }, 600);
      }
    } else {
      setTimeout(() => {
        router.push(href);
      }, 600);
    }
  };

  return (
    <SmoothScroll isPaused={isMenuOpen}>
      <div className="relative min-h-screen w-full overflow-hidden bg-[#0E0D0C]">
        {/* Fixed 3D Perspective Menu Layer (Behind Page Canvas) */}
        <FoldMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Collapsible Page Canvas (Scales from center) */}
        <div
          id="page-canvas"
          className={`relative z-40 flex min-h-screen w-full flex-col bg-ground text-ink transition-shadow duration-500 ${
            isMenuOpen
              ? "cursor-pointer shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)]"
              : ""
          }`}
          onClick={() => {
            if (isMenuOpen) {
              setIsMenuOpen(false);
            }
          }}
        >
          {/* Header Navigation with Menu Trigger */}
          <Nav
            isMenuOpen={isMenuOpen}
            onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
          />

          {/* Page Content */}
          <div className="grow flex flex-col">{children}</div>

          {showFooter && <Footer />}

          {/* Clickable Backdrop Shield over Canvas while Folded */}
          {isMenuOpen && (
            <div
              className="absolute inset-0 z-50 bg-black/20 backdrop-blur-[1px] cursor-pointer flex items-center justify-center transition-opacity"
              title="Click to unfold page"
            >
              <span className="px-4 py-2 rounded-full bg-black/75 text-white font-mono text-[11px] uppercase tracking-widest border border-white/20">
                Click to Resume ✕
              </span>
            </div>
          )}
        </div>
      </div>
    </SmoothScroll>
  );
}
