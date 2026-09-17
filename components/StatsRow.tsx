import { statsData } from "@/lib/data";

export default function StatsRow() {
  return (
    <section id="stats" className="border-b border-[#D9D6CF] bg-[#F2F0EB]">
      <div className="swiss-container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#D9D6CF] -mx-4">
          {statsData.map((stat, idx) => (
            <div
              key={stat.label}
              className={`px-4 sm:px-8 py-6 flex flex-col justify-between group ${
                idx % 2 === 1 && "pl-6 sm:pl-8"
              }`}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-extrabold text-[40px] sm:text-[52px] lg:text-[60px] tracking-[-0.03em] leading-none text-[#111110] transition-colors group-hover:text-[#C8773A]">
                  {stat.value}
                </span>
                <span className="text-[11px] font-mono font-medium text-[#6B6860]/70">
                  0{idx + 1}
                </span>
              </div>

              <div>
                <h3 className="text-[12px] font-bold tracking-[0.14em] text-[#111110] uppercase mb-1">
                  {stat.label}
                </h3>
                <p className="text-[13px] text-[#6B6860] leading-snug">
                  {stat.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
