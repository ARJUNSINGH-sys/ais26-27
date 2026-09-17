import Image from "next/image";

export default function MethodologySection() {
  return (
    <section id="methodology" className="py-20 md:py-28 bg-[#F7F7F5] border-t border-[#E2E2DE]">
      <div className="bw-container">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 md:mb-20">
          <h2 className="text-[32px] sm:text-[44px] font-extrabold tracking-[-0.025em] text-[#0A0A0A]">
            How We Build
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#666663] max-w-[34ch] sm:text-right">
            Every epoch is not merely syntax — it is structured scientific inquiry,
            rigorous benchmarking, and collective development.
          </p>
        </div>

        {/* Steps List (Replicating bottom of image copy 2.png) */}
        <div className="space-y-6">
          {/* Step 01 */}
          <div className="py-8 border-b border-[#E2E2DE] flex flex-col md:flex-row md:items-center justify-between gap-6 group">
            <div className="flex items-center gap-6">
              <span className="w-11 h-11 rounded-full border border-[#D9D6CF] flex items-center justify-center font-mono text-[13px] text-[#666663] group-hover:border-[#0A0A0A] group-hover:text-[#0A0A0A] transition-colors">
                01
              </span>
              <h3 className="text-[20px] sm:text-[24px] font-bold text-[#666663] group-hover:text-[#0A0A0A] transition-colors">
                Hypothesis & Architecture Formulation
              </h3>
            </div>
            <p className="text-[14px] text-[#666663] max-w-[40ch] md:text-right">
              Literature review on transformer topologies, dataset curation, and defining clear empirical metrics.
            </p>
          </div>

          {/* Step 02 (Active Stage with Docked Rounded Image Card) */}
          <div className="py-8 border-b border-[#E2E2DE] flex flex-col lg:flex-row lg:items-center justify-between gap-6 group">
            <div className="flex items-center gap-6">
              <span className="w-11 h-11 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center font-mono text-[13px] font-bold">
                02
              </span>
              <div>
                <h3 className="text-[20px] sm:text-[24px] font-bold text-[#0A0A0A]">
                  Distributed Training & Model Optimization
                </h3>
                <span className="text-[12px] font-mono text-[#666663] uppercase tracking-wider block mt-1">
                  Core Engineering Sprint
                </span>
              </div>
            </div>

            {/* Docked Rounded Image Preview (Exact match to image copy 2.png step 2 image) */}
            <div className="relative w-full max-w-[260px] h-[140px] rounded-[22px] overflow-hidden bg-[#EEEEEC] border border-[#E2E2DE] shadow-xs">
              <Image
                src="/images/event-ai-101.png"
                alt="Active Training Epoch"
                fill
                sizes="260px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-2.5 left-3 right-3 text-white text-[10px] font-mono tracking-wider uppercase">
                Active Epoch · 150+ Nodes
              </div>
            </div>

            <p className="text-[14px] text-[#0A0A0A] font-medium max-w-[34ch] lg:text-right">
              Fine-tuning weights, evaluating inference latency, and running adversarial perturbation tests.
            </p>
          </div>

          {/* Step 03 */}
          <div className="py-8 border-b border-[#E2E2DE] flex flex-col md:flex-row md:items-center justify-between gap-6 group">
            <div className="flex items-center gap-6">
              <span className="w-11 h-11 rounded-full border border-[#D9D6CF] flex items-center justify-center font-mono text-[13px] text-[#666663] group-hover:border-[#0A0A0A] group-hover:text-[#0A0A0A] transition-colors">
                03
              </span>
              <h3 className="text-[20px] sm:text-[24px] font-bold text-[#666663] group-hover:text-[#0A0A0A] transition-colors">
                Public Demonstration, Papers & Deployment
              </h3>
            </div>
            <p className="text-[14px] text-[#666663] max-w-[40ch] md:text-right">
              Releasing open-source packages, presenting live at Project Showcase, and shipping to production.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
