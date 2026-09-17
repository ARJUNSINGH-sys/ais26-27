"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F7F7F5]/90 backdrop-blur-md border-b border-[#E2E2DE] py-3.5"
          : "bg-transparent py-6"
      }`}
    >
      <div className="bw-container flex items-center justify-between">
        {/* Brand / Logo ONLY (No text with it, per user requirement) */}
        <Link
          href="/"
          className="group flex items-center justify-center"
          aria-label="AI Society Bennett University"
        >
          <div className="relative w-10 h-10 rounded-full bg-[#0A0A0A] p-2 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs">
            <Image
              src="/images/ais-logo.png"
              alt="AIS Logo"
              width={26}
              height={26}
              className="object-contain invert brightness-0"
              priority
            />
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#hero"
            className="text-[13px] font-medium text-[#666663] hover:text-[#0A0A0A] transition-colors"
          >
            Overview
          </Link>
          <Link
            href="/#statement"
            className="text-[13px] font-medium text-[#666663] hover:text-[#0A0A0A] transition-colors"
          >
            About
          </Link>
          <Link
            href="/#pillars"
            className="text-[13px] font-medium text-[#666663] hover:text-[#0A0A0A] transition-colors"
          >
            Pillars
          </Link>
          <Link
            href="/#events"
            className="text-[13px] font-medium text-[#666663] hover:text-[#0A0A0A] transition-colors"
          >
            Events
          </Link>
          <Link
            href="/resources"
            className="text-[13px] font-semibold text-[#0A0A0A] hover:text-[#666663] transition-colors px-3 py-1 rounded-full bg-[#EEEEEC]"
          >
            Resource Center ↗
          </Link>
          <Link
            href="/#methodology"
            className="text-[13px] font-medium text-[#666663] hover:text-[#0A0A0A] transition-colors"
          >
            Roadmap
          </Link>
        </nav>

        {/* Right Icon Actions (Mirrors image copy 2.png top right circular icons) */}
        <div className="flex items-center gap-3">
          {/* GitHub Icon Button */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-[#EEEEEC] hover:bg-[#0A0A0A] text-[#0A0A0A] hover:text-white flex items-center justify-center transition-all duration-200"
            aria-label="AIS GitHub"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>

          {/* Contact / Join Action */}
          <a
            href="mailto:ais@bennett.edu.in"
            className="w-9 h-9 rounded-full bg-[#0A0A0A] hover:bg-[#262626] text-white flex items-center justify-center transition-all duration-200"
            aria-label="Contact Society"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
