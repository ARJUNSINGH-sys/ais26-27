"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface NavProps {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
}

export default function Nav({ isMenuOpen = false, onToggleMenu }: NavProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Hairline under the banner appears once the page leaves the top (DESIGN.md 6.1)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-ground border-b transition-colors duration-200 ${
        isScrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div
        className={`w-full px-5 sm:px-7 md:px-9 lg:px-10 flex items-center justify-between transition-[height] duration-300 ease-quint ${
          isScrolled ? "h-[56px]" : "h-[80px] md:h-[96px]"
        }`}
      >
        {/* AIS Logo — docked in the far left corner, enlarged for bold presence */}
        <Link
          href="/"
          aria-label="AI Society — Bennett University"
          className="flex items-center group py-2"
        >
          <span
            aria-hidden
            className={`block bg-left bg-contain bg-no-repeat transition-all duration-300 ease-quint brightness-0 group-hover:opacity-80 ${
              isScrolled
                ? "h-9 w-[135px] sm:h-10 sm:w-[155px]"
                : "h-12 w-[180px] sm:h-14 sm:w-[215px] md:h-16 md:w-[245px] lg:h-[72px] lg:w-[275px]"
            }`}
            style={{ backgroundImage: "url('/images/ais-logo.png')" }}
          />
        </Link>

        {/* Right corner: MENU button */}
        <div className="flex items-center">
          {onToggleMenu && !isMenuOpen && (
            <button
              type="button"
              onClick={onToggleMenu}
              aria-label="Open menu"
              aria-expanded={false}
              className={`rounded-full text-[12px] font-mono tracking-wider uppercase font-bold inline-flex items-center gap-2.5 bg-[#0A0A0A] text-white hover:bg-[#262626] transition-all duration-300 cursor-pointer shadow-md select-none active:scale-95 ${
                isScrolled ? "h-[34px] px-4" : "h-[40px] px-5"
              }`}
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
