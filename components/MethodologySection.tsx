import Image from "next/image";

const STEPS = [
  {
    numeral: "01",
    title: "Hypothesis & architecture",
    note: "Literature review on transformer topologies, dataset curation, and defining clear empirical metrics.",
  },
  {
    numeral: "02",
    title: "Training & optimisation",
    note: "Fine-tuning weights, evaluating inference latency, and running adversarial perturbation tests.",
    preview: "/images/event-ai-101.png",
  },
  {
    numeral: "03",
    title: "Demonstration & deployment",
    note: "Releasing open-source packages, presenting live at Project Showcase, and shipping to production.",
  },
];

export default function MethodologySection() {
  return (
    <section id="roadmap" className="py-20 md:py-28">
      <div className="shell">
        <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between md:mb-20">
          <h2 className="font-display text-[clamp(30px,3.6vw,46px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink">
            How We Build
          </h2>
          <p className="max-w-[34ch] text-[14px] leading-[1.6] text-ink-soft sm:text-right">
            Every epoch is structured scientific inquiry — rigorous benchmarking
            and collective development, not merely syntax.
          </p>
        </div>

        <div className="border-t border-line">
          {STEPS.map((step) => (
            <div
              key={step.numeral}
              className="grid gap-6 border-b border-line py-9 md:grid-cols-12 md:items-center"
            >
              <span className="text-[12px] font-medium tracking-[0.14em] text-ink-soft md:col-span-1">
                {step.numeral}
              </span>

              <h3 className="font-display text-[20px] font-bold leading-[1.2] tracking-[-0.025em] text-ink md:col-span-5">
                {step.title}
              </h3>

              {step.preview ? (
                <div className="frame h-[132px] w-full max-w-[248px] rounded-[24px] md:col-span-3">
                  <Image
                    src={step.preview}
                    alt=""
                    fill
                    sizes="248px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="hidden md:col-span-3 md:block" />
              )}

              <p className="text-[13px] leading-[1.6] text-ink-soft md:col-span-3 md:text-right">
                {step.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
