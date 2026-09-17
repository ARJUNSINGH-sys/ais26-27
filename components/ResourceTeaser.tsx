import Link from "next/link";

export default function ResourceTeaser() {
  return (
    <section id="resources" className="py-12 md:py-16">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 rounded-[32px] bg-dark p-9 text-white sm:p-14 lg:flex-row lg:items-center">
          <div className="max-w-[48ch]">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">
              Bennett University · Open archive
            </span>
            <h2 className="mt-4 font-display text-[clamp(26px,3.2vw,40px)] font-extrabold leading-[1.08] tracking-[-0.035em]">
              AIS Learning Resource Center
            </h2>
            <p className="mt-4 text-[14px] leading-[1.6] text-white/60">
              An interactive lab of real-time visualisers and PyTorch
              implementations for scaled dot-product attention, 2D convolutions,
              gradient descent, diffusion schedulers, and softmax temperature.
            </p>
          </div>

          <Link
            href="/resources"
            className="inline-flex shrink-0 items-center gap-3.5 self-start rounded-full bg-white py-2 pr-2 pl-6 text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-panel lg:self-auto"
          >
            <span>Open the lab</span>
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-ink/10"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7" />
                <path d="M8 7h9v9" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
