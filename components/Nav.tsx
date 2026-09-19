"use client";

import Link from "next/link";

interface NavProps {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
}

export default function Nav({ isMenuOpen = false, onToggleMenu }: NavProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent pointer-events-none">
      <div className="w-full px-5 sm:px-7 md:px-9 lg:px-10 flex h-[80px] md:h-[96px] items-center justify-between">
        {/* AIS Logo — docked in the far left corner, enlarged for bold presence */}
        <Link
          href="/"
          aria-label="AI Society — Bennett University"
          className="flex items-center group py-2 pointer-events-auto"
        >
          <span
            aria-hidden
            className="block h-12 w-[180px] sm:h-14 sm:w-[215px] md:h-16 md:w-[245px] lg:h-[72px] lg:w-[275px] bg-left bg-contain bg-no-repeat transition-all duration-300 brightness-0 group-hover:opacity-80"
            style={{ backgroundImage: "url('/images/ais-logo.png')" }}
          />
        </Link>

        {/* Right corner: MENU button */}
        <div className="flex items-center pointer-events-auto">
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
      </div>
    </header>
  );
}
