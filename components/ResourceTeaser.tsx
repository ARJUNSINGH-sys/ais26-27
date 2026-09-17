import Link from "next/link";

export default function ResourceTeaser() {
  return (
    <section className="py-16 md:py-20 bg-[#F7F7F5]">
      <div className="bw-container">
        <div className="bg-[#0A0A0A] text-white rounded-[32px] sm:rounded-[40px] p-8 sm:p-14 border border-[#262626] flex flex-col lg:flex-row lg:items-center justify-between gap-8 group bw-card">
          <div className="max-w-[48ch]">
            <span className="text-[11px] font-mono tracking-[0.16em] uppercase text-[#A1A19D] block mb-3">
              BENNETT UNIVERSITY · OPEN ARCHIVE
            </span>
            <h2 className="text-[28px] sm:text-[38px] font-black tracking-tight text-white leading-tight mb-4">
              AIS Learning Resource Center
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#A1A19D] leading-relaxed">
              Explore our dedicated interactive lab featuring real-time visualizers and
              PyTorch implementations for Scaled Dot-Product Attention, 2D Convolutions,
              Gradient Descent, Diffusion Schedulers, and Softmax Temperature.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Link
              href="/resources"
              className="px-8 py-4 bg-white text-[#0A0A0A] hover:bg-[#EEEEEC] rounded-full text-[13px] font-bold tracking-wider uppercase inline-flex items-center gap-2.5 transition-all duration-200 group-hover:scale-105"
            >
              <span>Launch Resource Center</span>
              <span className="text-[14px]">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
