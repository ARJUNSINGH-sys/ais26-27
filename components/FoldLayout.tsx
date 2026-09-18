"use client";

import { useState, useRef, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SmoothScroll, { resetScrollToTop } from "@/components/SmoothScroll";
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
  const isNavigatingRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(() => {
    // Initial GPU accelerated states
    gsap.set("#page-canvas", {
      transformOrigin: "center top",
      scale: 1,
      opacity: 1,
      willChange: "transform, opacity",
    });

    gsap.set("#fold-menu-backdrop", {
      autoAlpha: 0,
      pointerEvents: "none",
    });

    gsap.set("#menu-content", {
      y: -20,
      opacity: 0,
      willChange: "transform, opacity",
    });

    gsap.set(".menu-nav-item", {
      y: 20,
      opacity: 0,
      willChange: "transform, opacity",
    });

    // Master bi-directional timeline for smooth opening & reverse closing
    timelineRef.current = gsap
      .timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
        onReverseComplete: () => {
          gsap.set("#fold-menu-backdrop", {
            autoAlpha: 0,
            pointerEvents: "none",
          });
          setIsMenuOpen(false);
          isNavigatingRef.current = false;
        },
      })
      // 1. Activate backdrop overlay
      .set("#fold-menu-backdrop", { autoAlpha: 1, pointerEvents: "auto" }, 0)

      // 2. Gentle canvas breath (zero clip-path overhead for phone 60/120fps)
      .to(
        "#page-canvas",
        {
          scale: 0.985,
          opacity: 0.85,
          duration: 0.35,
          ease: "power2.out",
        },
        0,
      )

      // 3. Slide in menu content
      .to(
        "#menu-content",
        {
          y: 0,
          opacity: 1,
          duration: 0.36,
          ease: "power3.out",
        },
        "-=0.22",
      )

      // 4. Stagger primary navigation links
      .to(
        ".menu-nav-item",
        {
          y: 0,
          opacity: 1,
          duration: 0.28,
          stagger: 0.04,
          ease: "power2.out",
        },
        "-=0.2",
      );
  }, []);

  const handleToggleMenu = () => {
    if (isNavigatingRef.current) return;
    if (isMenuOpen) {
      handleCloseMenu();
    } else {
      setIsMenuOpen(true);
      if (timelineRef.current) {
        timelineRef.current.timeScale(1).play();
      }
    }
  };

  const handleCloseMenu = () => {
    if (isNavigatingRef.current) return;
    if (timelineRef.current) {
      timelineRef.current.timeScale(1.15).reverse();
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleNavigate = (href: string) => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;

    const performTransition = () => {
      // 1. Reset scroll immediately before loading the new page
      resetScrollToTop();

      // 2. Perform navigation
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
      // Execute the exact same timeline in reverse smoothly
      timelineRef.current.timeScale(1.2).reverse();

      timelineRef.current.eventCallback("onReverseComplete", () => {
        gsap.set("#fold-menu-backdrop", {
          autoAlpha: 0,
          pointerEvents: "none",
        });
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
        {/* Simple, Smooth, High-Performance Menu Overlay */}
        <FoldMenu
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          onNavigate={handleNavigate}
        />

        {/* Main Page Canvas */}
        <div
          id="page-canvas"
          className="relative z-10 flex min-h-screen w-full flex-col bg-ground text-ink"
        >
          {/* Header Navigation with Menu Trigger */}
          <Nav
            isMenuOpen={isMenuOpen}
            onToggleMenu={handleToggleMenu}
          />

          {/* Page Content */}
          <div className="grow flex flex-col">{children}</div>

          {showFooter && <Footer />}
        </div>
      </div>
    </SmoothScroll>
  );
}
