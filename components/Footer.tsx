import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-12 rounded-t-[36px] sm:rounded-t-[48px] mt-12">
      <div className="bw-container">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#262626]">
          {/* Brand Info — Logo Itself ONLY */}
          <div className="md:col-span-6 flex flex-col justify-between pr-0 md:pr-12">
            <div>
              {/* Logo Itself (No text with it) */}
              <div className="w-12 h-12 rounded-full bg-white p-2.5 flex items-center justify-center mb-6">
                <Image
                  src="/images/ais-logo.png"
                  alt="AIS Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>

              <p className="text-[15px] leading-[1.6] text-[#A1A19D] max-w-[40ch] mb-8">
                Bennett University&apos;s premier artificial intelligence student specialization society.
                Training minds, one epoch at a time.
              </p>
            </div>

            <div className="space-y-1.5 text-[13px] text-[#A1A19D]">
              <div>Bennett University · TechZone II, Greater Noida, UP</div>
              <div>
                Inquiries:{" "}
                <a
                  href="mailto:ais@bennett.edu.in"
                  className="text-white hover:underline underline-offset-4"
                >
                  ais@bennett.edu.in
                </a>
              </div>
            </div>
          </div>

          {/* Quick Nav — 3 cols */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#666663] mb-5">
              Index
            </h4>
            <ul className="space-y-3 text-[13px] font-medium">
              <li>
                <a href="#hero" className="text-[#D4D4D0] hover:text-white transition-colors">
                  01 / Overview
                </a>
              </li>
              <li>
                <a href="#statement" className="text-[#D4D4D0] hover:text-white transition-colors">
                  02 / About Society
                </a>
              </li>
              <li>
                <a href="#pillars" className="text-[#D4D4D0] hover:text-white transition-colors">
                  03 / Core Advantages
                </a>
              </li>
              <li>
                <a href="#events" className="text-[#D4D4D0] hover:text-white transition-colors">
                  04 / Works Archive
                </a>
              </li>
              <li>
                <a href="#resources" className="text-[#D4D4D0] hover:text-white transition-colors">
                  05 / Resource Center
                </a>
              </li>
              <li>
                <a href="#methodology" className="text-[#D4D4D0] hover:text-white transition-colors">
                  06 / Methodology
                </a>
              </li>
            </ul>
          </div>

          {/* Channels — 3 cols */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#666663] mb-5">
              Channels
            </h4>
            <ul className="space-y-3 text-[13px] font-medium">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4D4D0] hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>GitHub</span>
                  <span className="text-[11px] font-mono text-[#666663]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4D4D0] hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Instagram</span>
                  <span className="text-[11px] font-mono text-[#666663]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4D4D0] hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>LinkedIn</span>
                  <span className="text-[11px] font-mono text-[#666663]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.bennett.edu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4D4D0] hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Bennett University</span>
                  <span className="text-[11px] font-mono text-[#666663]">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] font-mono text-[#666663]">
          <div>© {new Date().getFullYear()} AI Society. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>MINIMALIST MONOCHROME</span>
            <span>·</span>
            <span>BENNETT UNIVERSITY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
