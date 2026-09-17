import Image from "next/image";

/**
 * The gallery is deliberately captionless — the brief calls for photographs
 * with no overlay, badge, or label. Alt text carries the meaning instead.
 */
const COLUMN_ONE = {
  src: "/images/event-club-carnival.png",
  alt: "Members gathered at the Club Carnival induction festival",
};

const COLUMN_TWO = [
  {
    src: "/images/event-ai-101.png",
    alt: "Attendees working through the AI 101 foundations workshop",
  },
  {
    src: "/images/event-ai-hunt.png",
    alt: "Teams competing in the AI Hunt 2.0 algorithmic challenge",
  },
];

const COLUMN_THREE = [
  {
    src: "/images/event-tech-arena.png",
    alt: "The TechArena 2025 symposium hall in session",
  },
  {
    src: "/images/event-project-showcase.png",
    alt: "Student projects on display at the Project Showcase expo",
  },
];

export default function EventsGallery() {
  return (
    <section id="works" className="py-16 md:py-24">
      <div className="shell">
        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-3">
          {/* Column one — title plate stacked over a tall portrait */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between rounded-[32px] bg-dark p-7 text-white sm:p-8">
              <h2 className="font-display text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em]">
                Selected
                <br />
                Works
              </h2>

              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full border border-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              </span>
            </div>

            <div className="frame h-[420px] rounded-[32px]">
              <Image
                src={COLUMN_ONE.src}
                alt={COLUMN_ONE.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Column two — matched pair */}
          <div className="flex flex-col gap-5">
            {COLUMN_TWO.map((photo) => (
              <div key={photo.src} className="frame h-[240px] rounded-[32px]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Column three — tall portrait over a wide crop */}
          <div className="flex flex-col gap-5">
            <div className="frame h-[300px] rounded-[32px]">
              <Image
                src={COLUMN_THREE[0].src}
                alt={COLUMN_THREE[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="frame h-[200px] rounded-[32px]">
              <Image
                src={COLUMN_THREE[1].src}
                alt={COLUMN_THREE[1].alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
