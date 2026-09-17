"use client";

import { useRef } from "react";
import gsap from "gsap";

interface RollingLinkProps {
  text: string;
  href: string;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  numberPrefix?: string;
}

export default function RollingLink({
  text,
  href,
  onClick,
  className = "",
  numberPrefix,
}: RollingLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const chars = text.split("");

  const handleMouseEnter = () => {
    if (!linkRef.current) return;
    const origChars = linkRef.current.querySelectorAll(".char-orig");
    const cloneChars = linkRef.current.querySelectorAll(".char-clone");

    gsap.to(origChars, {
      yPercent: -100,
      duration: 0.42,
      ease: "power3.inOut",
      stagger: 0.02,
      overwrite: true,
    });
    gsap.to(cloneChars, {
      yPercent: -100,
      duration: 0.42,
      ease: "power3.inOut",
      stagger: 0.02,
      overwrite: true,
    });
  };

  const handleMouseLeave = () => {
    if (!linkRef.current) return;
    const origChars = linkRef.current.querySelectorAll(".char-orig");
    const cloneChars = linkRef.current.querySelectorAll(".char-clone");

    gsap.to(origChars, {
      yPercent: 0,
      duration: 0.42,
      ease: "power3.inOut",
      stagger: { each: 0.02, from: "end" },
      overwrite: true,
    });
    gsap.to(cloneChars, {
      yPercent: 0,
      duration: 0.42,
      ease: "power3.inOut",
      stagger: { each: 0.02, from: "end" },
      overwrite: true,
    });
  };

  return (
    <a
      ref={linkRef}
      href={href}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative inline-flex items-baseline gap-4 py-1.5 overflow-hidden select-none no-underline cursor-pointer ${className}`}
    >
      {numberPrefix && (
        <span className="font-mono text-[13px] sm:text-[16px] text-white/40 tracking-wider transition-colors group-hover:text-white">
          {numberPrefix}
        </span>
      )}

      <span className="relative block overflow-hidden">
        {/* Layer 1: Original visible characters */}
        <span className="flex">
          {chars.map((char, idx) => (
            <span
              key={idx}
              className="char-orig inline-block"
              style={{ willChange: "transform" }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>

        {/* Layer 2: Duplicate clone characters resting underneath */}
        <span
          className="flex absolute top-0 left-0 pointer-events-none"
          aria-hidden="true"
        >
          {chars.map((char, idx) => (
            <span
              key={idx}
              className="char-clone inline-block"
              style={{
                transform: "translateY(100%)",
                willChange: "transform",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
    </a>
  );
}
