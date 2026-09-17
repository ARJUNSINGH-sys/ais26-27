export default function StatementSection() {
  return (
    <section id="statement" className="py-20 md:py-28 bg-[#F7F7F5]">
      <div className="bw-container max-w-[980px] mx-auto text-center flex flex-col items-center">
        {/* Editorial Statement with Inline Chips */}
        <p className="text-[24px] sm:text-[32px] md:text-[40px] font-bold text-[#0A0A0A] leading-[1.35] tracking-[-0.02em] mb-10">
          Welcome. We are Bennett University&apos;s{" "}
          <span className="statement-chip mx-1">
            <span className="text-[#0A0A0A]">✦</span>
            <span>AI Society</span>
          </span>
          . When collaborating with us, you gain the technical mastery to decode
          deep neural foundations and deploy{" "}
          <span className="statement-chip mx-1">
            <span className="w-2 h-2 rounded-full bg-[#0A0A0A] inline-block" />
            <span>Autonomous Intelligence</span>
          </span>
          .
        </p>

        {/* Minimalist Pill CTA */}
        <a href="#events" className="btn-pill-dark group">
          <span>Explore Society Work</span>
          <span className="btn-arrow-circle">
            <svg
              width="11"
              height="11"
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
          </span>
        </a>
      </div>
    </section>
  );
}
