import { featurePillars } from "@/lib/data";

export default function PillarsBento() {
  return (
    <section id="pillars" className="py-16 md:py-24">
      <div className="bw-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Large Card (Mirrors the large light card in image copy 2.png) */}
          <div className="lg:col-span-5 bg-[#EEEEEC] border border-[#E2E2DE] rounded-[32px] sm:rounded-[36px] p-8 sm:p-12 flex flex-col justify-between min-h-[380px] lg:min-h-[460px] group bw-card">
            <div>
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#666663] block mb-4">
                PILLARS & ADVANTAGES
              </span>
              <h2 className="text-[30px] sm:text-[38px] font-extrabold tracking-[-0.02em] text-[#0A0A0A] leading-[1.1] max-w-[12ch]">
                Advantages of Building with Us
              </h2>
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-[#D9D6CF]/70">
              <p className="text-[13px] text-[#666663] max-w-[24ch]">
                From first principles to national hackathon championships.
              </p>
              <div className="w-12 h-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right 2x2 Grid (Mirrors the 4 cards in image copy 2.png) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Card 1 */}
            <div className="bg-[#0D0D0D] text-white rounded-[26px] sm:rounded-[30px] p-7 sm:p-8 flex flex-col justify-between min-h-[220px] bw-card border border-[#262626] group">
              <p className="text-[16px] sm:text-[17px] font-semibold text-white/95 leading-snug">
                Helping members master deep learning without theoretical obscurity.
              </p>
              <div className="pt-6 flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <span className="text-[11px] font-mono text-white/40 tracking-wider">01</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0D0D0D] text-white rounded-[26px] sm:rounded-[30px] p-7 sm:p-8 flex flex-col justify-between min-h-[220px] bw-card border border-[#262626] group">
              <p className="text-[16px] sm:text-[17px] font-semibold text-white/95 leading-snug">
                Architecting autonomous agents and deployable multi-modal systems.
              </p>
              <div className="pt-6 flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <span className="text-[11px] font-mono text-white/40 tracking-wider">02</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0D0D0D] text-white rounded-[26px] sm:rounded-[30px] p-7 sm:p-8 flex flex-col justify-between min-h-[220px] bw-card border border-[#262626] group">
              <p className="text-[16px] sm:text-[17px] font-semibold text-white/95 leading-snug">
                Peer-led intensive sprints, code reviews, and hackathon incubation.
              </p>
              <div className="pt-6 flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <span className="text-[11px] font-mono text-white/40 tracking-wider">03</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0D0D0D] text-white rounded-[26px] sm:rounded-[30px] p-7 sm:p-8 flex flex-col justify-between min-h-[220px] bw-card border border-[#262626] group">
              <p className="text-[16px] sm:text-[17px] font-semibold text-white/95 leading-snug">
                Always on call before and after national competitions & research submissions.
              </p>
              <div className="pt-6 flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <span className="text-[11px] font-mono text-white/40 tracking-wider">04</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
