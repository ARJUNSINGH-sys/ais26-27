"use client";

import { useEffect } from "react";
import Link from "next/link";

interface FoldMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

const NAV_LINKS = [
  { prefix: "01", label: "HOME", href: "/" },
  { prefix: "02", label: "ABOUT", href: "/#about" },
  { prefix: "03", label: "EVENTS", href: "/#events" },
  { prefix: "04", label: "RESOURCES", href: "/resources" },
  { prefix: "05", label: "ROADMAP", href: "/#roadmap" },
];

export default function FoldMenu({
  isOpen,
  onClose,
  onNavigate,
}: FoldMenuProps) {
  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when menu is active on mobile & desktop
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <div
      id="fold-menu-backdrop"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 bg-[#0E0D0C] text-[#FAF9F5] flex flex-col justify-between overflow-y-auto overflow-x-hidden ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        opacity: 0,
        visibility: "hidden",
        willChange: "transform, opacity",
      }}
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(250,249,245,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(250,249,245,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Outer Content Shell */}
      <div
        id="menu-content"
        className="relative z-10 w-full min-h-full flex flex-col justify-between p-6 sm:p-10 md:p-14 max-w-[1360px] mx-auto"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 text-[11px] sm:text-[12px] font-mono tracking-widest text-white/60 uppercase">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white font-bold tracking-wider">
              AI SOCIETY · BENNETT UNIVERSITY
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-white/40">EDITION 26-27</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="h-9 px-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-black font-mono text-[11px] uppercase tracking-wider font-bold transition-all duration-200 inline-flex items-center gap-2 border border-white/15 cursor-pointer"
            >
              <span>CLOSE</span>
              <span className="text-[13px] leading-none">✕</span>
            </button>
          </div>
        </div>

        {/* Primary Stacked Navigation Links */}
        <nav className="my-auto py-10 sm:py-14 flex flex-col items-start gap-3 sm:gap-5 md:gap-6">
          {NAV_LINKS.map((item) => (
            <div key={item.label} className="menu-nav-item w-full">
              <a
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className="group flex items-baseline gap-4 sm:gap-6 py-2 transition-all duration-200 cursor-pointer select-none"
              >
                {/* Monospace Topic Index Prefix */}
                <span className="font-mono text-[12px] sm:text-[16px] md:text-[18px] text-[#DE5D35] group-hover:text-white font-semibold tracking-wider transition-colors">
                  {item.prefix} /
                </span>

                {/* Primary Nav Label with Hover Arrow */}
                <span className="text-[28px] sm:text-[44px] md:text-[58px] lg:text-[72px] font-black tracking-[-0.03em] leading-none text-[#FAF9F5] group-hover:text-[#DE5D35] transition-colors flex items-center gap-3">
                  <span>{item.label}</span>
                  <span className="opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#DE5D35] text-[0.8em]">
                    →
                  </span>
                </span>
              </a>
            </div>
          ))}
        </nav>

        {/* Bottom Coordinates & Footer Bar */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-6 text-[12px] font-mono text-white/60">
          <div className="sm:col-span-6 flex flex-col justify-end">
            <span className="text-white/40 uppercase tracking-widest text-[10px] block mb-1">
              CAMPUS HEADQUARTERS
            </span>
            <span className="text-white/85 text-[12px] sm:text-[13px] leading-relaxed">
              Plot Nos 8–11, TechZone II, Greater Noida, Uttar Pradesh 201310
            </span>
          </div>

          <div className="sm:col-span-3 flex flex-col justify-end">
            <span className="text-white/40 uppercase tracking-widest text-[10px] block mb-1">
              OFFICIAL INQUIRIES
            </span>
            <a
              href="mailto:ais@bennett.edu.in"
              className="text-white/90 hover:text-[#DE5D35] hover:underline underline-offset-4 transition-colors text-[12px] sm:text-[13px]"
            >
              ais@bennett.edu.in
            </a>
          </div>

          <div className="sm:col-span-3 flex items-end justify-start sm:justify-end gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors"
            >
              Instagram ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
