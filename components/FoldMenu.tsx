"use client";

import RollingLink from "./RollingLink";

interface FoldMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

const navLinks = [
  { prefix: "01", label: "OVERVIEW", href: "/#hero" },
  { prefix: "02", label: "ABOUT", href: "/#statement" },
  { prefix: "03", label: "PILLARS", href: "/#pillars" },
  { prefix: "04", label: "EVENTS", href: "/#events" },
  { prefix: "05", label: "RESOURCE CENTER", href: "/resources" },
  { prefix: "06", label: "ROADMAP", href: "/#methodology" },
];

export default function FoldMenu({ isOpen, onClose, onNavigate }: FoldMenuProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <div
      id="fold-menu-backdrop"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-30 bg-[#0E0D0C] text-white flex flex-col justify-between p-6 sm:p-12 md:p-16 transition-visibility duration-300 ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
      style={{
        perspective: "1200px",
        perspectiveOrigin: "center center",
      }}
    >
      {/* 3D Depth Menu Content Wrapper */}
      <div
        id="menu-content"
        className="w-full h-full flex flex-col justify-between max-w-[1400px] mx-auto"
        style={{
          transform: "translate3d(0, 0, -350px)",
          filter: "blur(25px)",
          opacity: 0,
          transformStyle: "preserve-3d",
          willChange: "transform, opacity, filter",
        }}
      >
        {/* Top Header Label */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10 text-[11px] font-mono tracking-[0.2em] text-white/50 uppercase">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white/80">AI SOCIETY · BENNETT UNIVERSITY</span>
          </div>
          <span className="hidden sm:inline">INDEX 2024–2026</span>
        </div>

        {/* Primary Stacked Links (Large Editorial Type with Rolling Tumbler Hover) */}
        <nav className="my-auto py-8 flex flex-col items-start gap-3 sm:gap-4 md:gap-5">
          {navLinks.map((item) => (
            <div key={item.label} className="menu-nav-item">
              <RollingLink
                numberPrefix={item.prefix}
                text={item.label}
                href={item.href}
                onClick={(e: any) => handleClick(e, item.href)}
                className="text-[34px] sm:text-[52px] md:text-[68px] lg:text-[80px] font-black tracking-[-0.03em] leading-none text-white hover:text-white"
              />
            </div>
          ))}
        </nav>

        {/* Bottom Secondary Links & Coordinates */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-12 gap-6 text-[12px] font-mono text-white/60">
          <div className="sm:col-span-6 flex flex-col justify-end">
            <span className="text-white/40 uppercase tracking-widest text-[10px] block mb-1">
              CAMPUS HEADQUARTERS
            </span>
            <span className="text-white/80">
              Plot Nos 8–11, TechZone II, Greater Noida, Uttar Pradesh 201310
            </span>
          </div>

          <div className="sm:col-span-3 flex flex-col justify-end">
            <span className="text-white/40 uppercase tracking-widest text-[10px] block mb-1">
              OFFICIAL INQUIRIES
            </span>
            <a
              href="mailto:ais@bennett.edu.in"
              className="text-white hover:underline underline-offset-4 transition-colors"
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
