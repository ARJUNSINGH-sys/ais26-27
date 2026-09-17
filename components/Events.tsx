import Image from "next/image";
import { eventsData, type EventItem } from "@/lib/data";

interface EventCardProps {
  event: EventItem;
  large?: boolean;
}

function EventCard({ event, large = false }: EventCardProps) {
  return (
    <div className="event-card-hover group flex flex-col bg-[#F2F0EB] border border-[#D9D6CF] rounded-[4px] overflow-hidden">
      {/* Photograph Container */}
      <div
        className={`relative w-full overflow-hidden bg-[#E8E5DF] ${
          large ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-[4/3]"
        }`}
      >
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes={
            large
              ? "(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 750px"
              : "(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 500px"
          }
          className="event-card-image object-cover object-center"
        />

        {/* Crisp Dark Gradient for High-Contrast Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono tracking-widest uppercase rounded-[2px] border border-white/10">
            {event.id} · {event.category}
          </span>
          <span className="px-2.5 py-1 bg-[#C8773A] text-white text-[11px] font-mono font-bold tracking-wider rounded-[2px]">
            {event.date}
          </span>
        </div>

        {/* Bottom In-Image Metadata */}
        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
          <div className="flex items-center gap-2 text-[11px] font-mono text-white/80 uppercase tracking-widest mb-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{event.location}</span>
          </div>
          <h3 className="text-[20px] sm:text-[24px] font-bold tracking-[-0.01em] text-white leading-tight">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Card Details & Caption */}
      <div className="p-5 sm:p-6 flex flex-col justify-between grow border-t border-[#D9D6CF] bg-[#FAFAF8]">
        <p className="text-[14px] leading-[1.65] text-[#6B6860] mb-4">
          {event.shortDesc}
        </p>

        <div className="pt-3 border-t border-[#D9D6CF]/60 flex items-center justify-between text-[11px] font-bold tracking-[0.12em] uppercase text-[#111110]">
          <span className="text-[#6B6860] group-hover:text-[#111110] transition-colors">
            Archived Milestone
          </span>
          <span className="inline-flex items-center gap-1 group-hover:text-[#C8773A] transition-colors">
            Details
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [e1, e2, e3, e4, e5, e6] = eventsData;

  return (
    <section id="events" className="swiss-section relative bg-[#F2F0EB]">
      {/* Watermark Section Number */}
      <span className="section-numeral select-none pr-8">03</span>

      <div className="swiss-container relative z-10">
        {/* Section Header */}
        <div className="swiss-section-header">
          <div className="eyebrow-label">
            <span className="eyebrow-dot" />
            <span>ANNUAL RETROSPECTIVE · 2024–2025</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="section-title text-[#111110]">
                A Year of Relentless Building.
              </h2>
              <p className="text-[16px] text-[#6B6860] max-w-[55ch] mt-3">
                Six marquee events across hackathons, induction workshops, and
                computational showcases engineered by the AI Society student cohort.
              </p>
            </div>

            <div className="text-[12px] font-mono tracking-widest text-[#6B6860] uppercase border-b border-[#111110] pb-1 self-start md:self-end">
              [ 06 RECORDED INITIATIVES ]
            </div>
          </div>
        </div>

        {/* Editorial Asymmetric Grid */}
        <div className="space-y-8">
          {/* Row 1: Large (7 cols) + Small (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <EventCard event={e1} large={true} />
            </div>
            <div className="lg:col-span-5">
              <EventCard event={e2} large={false} />
            </div>
          </div>

          {/* Row 2: Small (5 cols) + Large (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <EventCard event={e3} large={false} />
            </div>
            <div className="lg:col-span-7">
              <EventCard event={e4} large={true} />
            </div>
          </div>

          {/* Row 3: Large (7 cols) + Small (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <EventCard event={e5} large={true} />
            </div>
            <div className="lg:col-span-5">
              <EventCard event={e6} large={false} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
