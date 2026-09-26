"use client";

import Link from "next/link";
import { assetPath } from "@/lib/basePath";

interface NavProps {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
}

const barClass =
  "px-5 sm:px-7 md:px-9 lg:px-10 flex h-[80px] md:h-[96px] items-center";

export default function Nav({ isMenuOpen = false, onToggleMenu }: NavProps) {
  return (
    <header>
      {/* AIS Logo — sits at the top of the page and scrolls away with it */}
      <div className={`absolute left-0 top-0 z-50 ${barClass}`}>
        <Link
          href="/"
          aria-label="AI Society, Bennett University"
          className="flex items-center group py-2"
        >
          <span
            aria-hidden
            className="block h-12 w-[180px] sm:h-14 sm:w-[215px] md:h-16 md:w-[245px] lg:h-[72px] lg:w-[275px] bg-left bg-contain bg-no-repeat transition-all duration-300 brightness-0 group-hover:opacity-80"
            style={{ backgroundImage: `url('${assetPath("/images/ais-logo.png")}')` }}
          />
        </Link>
      </div>

      {/* Right corner: MENU button — stays fixed while scrolling */}
      <div className={`fixed right-0 top-0 z-50 ${barClass}`}>
        {onToggleMenu && !isMenuOpen && (
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label="Open menu"
            aria-expanded={false}
            className="h-[40px] px-5 rounded-full text-[12px] font-mono tracking-wider uppercase font-bold inline-flex items-center gap-2.5 bg-[#0A0A0A] text-white hover:bg-[#262626] transition-all duration-300 cursor-pointer shadow-md select-none active:scale-95"
          >
            <span>MENU</span>
            <span className="text-[13px] leading-none">☰</span>
          </button>
        )}
      </div>
    </header>
  );
}
