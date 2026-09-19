"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useRef, useState } from "react";
import FoldMenu from "@/components/FoldMenu";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SmoothScroll, { resetScrollToTop } from "@/components/SmoothScroll";

interface FoldLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

gsap.registerPlugin(CustomEase);

export default function FoldLayout({
  children,
  showFooter = true,
}: FoldLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isNavigatingRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Awwwards fluid curve: rapid launch, velvety spring deceleration
    if (!CustomEase.get("fluidMenu")) {
      CustomEase.create("fluidMenu", "0.16, 1, 0.3, 1");
    }
    if (!CustomEase.get("fluidItems")) {
      CustomEase.create("fluidItems", "0.22, 1, 0.36, 1");
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Resting closed state:
    // Panel collapsed to 0px circle directly at the corner button position
    gsap.set("#menu-backdrop", { autoAlpha: 0 });
    gsap.set("#menu-panel", {
      autoAlpha: 0,
      scale: 0.88,
      x: 15,
      y: -12,
      overflow: "hidden",
      clipPath: "circle(0px at calc(100% - 48px) 36px)",
      transformOrigin: "top right",
      willChange: "transform, opacity, clip-path",
    });
    gsap.set(".menu-header", {
      y: -10,
      opacity: 0,
    });
    gsap.set(".menu-nav-item", {
      x: 45,
      y: 25,
      opacity: 0,
      rotate: 1.5,
      willChange: "transform, opacity",
    });
    gsap.set(".menu-footer", {
      y: 18,
      opacity: 0,
    });

    // Bi-directional master timeline for fluid opening & closing
    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        document.documentElement.classList.add("menu-open");
        gsap.set("#menu-panel", { overflow: "hidden" });
      },
      onComplete: () => {
        // Enable scrollbar only when animation is fully settled
        gsap.set("#menu-panel", { overflowY: "auto" });
      },
      onReverseComplete: () => {
        document.documentElement.classList.remove("menu-open");
        gsap.set("#menu-backdrop", { autoAlpha: 0 });
        gsap.set("#menu-panel", { autoAlpha: 0, overflow: "hidden" });
        setIsMenuOpen(false);
        isNavigatingRef.current = false;
      },
    });

    if (prefersReduced) {
      // Reduced motion fallback: gentle clean fades
      tl.to("#menu-backdrop", { autoAlpha: 1, duration: 0.2, ease: "none" }, 0)
        .to("#menu-panel", { autoAlpha: 1, duration: 0.2, ease: "none" }, 0)
        .to(
          ".menu-nav-item",
          { opacity: 1, stagger: 0.03, duration: 0.15, ease: "none" },
          0.05,
        );
    } else {
      // Smooth expanding diagonal fluid sequence
      tl.to(
        "#menu-backdrop",
        { autoAlpha: 1, duration: 0.42, ease: "power2.out" },
        0,
      )
        .to(
          "#menu-panel",
          {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            y: 0,
            clipPath: "circle(1800px at calc(100% - 48px) 36px)",
            duration: 0.54,
            ease: "fluidMenu",
          },
          0,
        )
        .to(
          ".menu-header",
          {
            y: 0,
            opacity: 1,
            duration: 0.32,
            ease: "fluidItems",
          },
          0.1,
        )
        .to(
          ".menu-nav-item",
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 0.45,
            stagger: 0.045,
            ease: "fluidItems",
          },
          0.14,
        )
        .to(
          ".menu-footer",
          {
            y: 0,
            opacity: 1,
            duration: 0.36,
            ease: "fluidItems",
          },
          0.28,
        );
    }

    timelineRef.current = tl;
  }, []);

  const handleToggleMenu = () => {
    if (isNavigatingRef.current) return;
    if (isMenuOpen) {
      handleCloseMenu();
    } else {
      setIsMenuOpen(true);
      timelineRef.current?.timeScale(1).play();
    }
  };

  const handleCloseMenu = () => {
    if (isNavigatingRef.current) return;
    if (timelineRef.current) {
      // Hide any internal scrollbar immediately before reverse animation
      gsap.set("#menu-panel", { overflow: "hidden" });
      timelineRef.current.timeScale(1.8).reverse();
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleNavigate = (href: string) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    const performTransition = () => {
      resetScrollToTop();

      if (href.startsWith("/#")) {
        const targetId = href.replace("/#", "");
        if (pathname === "/") {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
          router.push(href);
        }
      } else if (href === pathname || (href === "/" && pathname === "/")) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push(href);
      }
    };

    if (timelineRef.current) {
      const tl = timelineRef.current;
      // Immediately hide internal scrollbar during reverse collapse
      gsap.set("#menu-panel", { overflow: "hidden" });
      tl.timeScale(1.8).reverse();
      tl.eventCallback("onReverseComplete", () => {
        document.documentElement.classList.remove("menu-open");
        gsap.set("#menu-backdrop", { autoAlpha: 0 });
        gsap.set("#menu-panel", { autoAlpha: 0, overflow: "hidden" });
        setIsMenuOpen(false);
        isNavigatingRef.current = false;
        performTransition();
      });
    } else {
      setIsMenuOpen(false);
      isNavigatingRef.current = false;
      performTransition();
    }
  };

  return (
    <SmoothScroll isPaused={isMenuOpen}>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0E0D0C]">
        {/* Nav header sits at root level with z-[60] and corner button at z-[70] */}
        <Nav isMenuOpen={isMenuOpen} onToggleMenu={handleToggleMenu} />

        {/* Fluid diagonal expanding menu */}
        <FoldMenu
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          onNavigate={handleNavigate}
        />

        {/* Underlying page canvas */}
        <div
          id="page-canvas"
          className="relative z-10 flex min-h-screen w-full flex-col bg-ground text-ink"
        >
          <div className="grow flex flex-col">{children}</div>

          {showFooter && <Footer />}
        </div>
      </div>
    </SmoothScroll>
  );
}
