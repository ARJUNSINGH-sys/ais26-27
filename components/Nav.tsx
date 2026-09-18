"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavProps {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
}

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Pillars", href: "/#pillars" },
  { label: "Works", href: "/#works" },
  { label: "Resources", href: "/resources" },
  { label: "Roadmap", href: "/#roadmap" },
];

export default function Nav({ isMenuOpen = false, onToggleMenu }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled && !isMenuOpen
          ? "bg-ground/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="shell grid h-[76px] grid-cols-[1fr_auto_1fr] items-center md:h-[92px]">
        {/* Full AIS lockup / logo */}
        <Link
          href="/"
          aria-label="AI Society — Bennett University"
          className="justify-self-start"
        >
          <span
            aria-hidden
            className={`block h-9 w-[136px] bg-left bg-contain bg-no-repeat transition-all duration-300 md:h-12 md:w-[172px] ${
              isMenuOpen ? "invert brightness-0" : "brightness-0"
            }`}
            style={{ backgroundImage: "url('/images/ais-logo.png')" }}
          />
        </Link>

        {/* Empty center column to preserve 3-column grid alignment */}
        <div />

        {/* Right actions: Menu toggle + Icon buttons */}
        <div className="flex items-center gap-3 justify-self-end">
          {/* 3D Folding Menu Trigger Pill Button */}
          {onToggleMenu && (
            <button
              type="button"
              onClick={onToggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              className={`h-[38px] px-5 rounded-full text-[12px] font-mono tracking-wider uppercase font-bold inline-flex items-center gap-2.5 transition-all duration-300 cursor-pointer shadow-xs ${
                isMenuOpen
                  ? "bg-white text-[#0A0A0A] hover:bg-[#E3DFD7]"
                  : "bg-[#0A0A0A] text-white hover:bg-[#262626]"
              }`}
            >
              <span>{isMenuOpen ? "CLOSE" : "MENU"}</span>
              <span className="text-[14px] leading-none">
                {isMenuOpen ? "✕" : "☰"}
              </span>
            </button>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="AI Society on GitHub"
            className={`icon-btn ${
              isMenuOpen
                ? "border-white/20 text-white hover:bg-white hover:text-black"
                : ""
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>

          <a
            href="mailto:ais@bennett.edu.in"
            aria-label="Contact the society"
            className={`icon-btn ${
              isMenuOpen
                ? "border-white/20 text-white hover:bg-white hover:text-black"
                : ""
            }`}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 17 17 7" />
              <path d="M8 7h9v9" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
