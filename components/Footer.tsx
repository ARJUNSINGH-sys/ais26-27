const INDEX_LINKS = [
  { href: "#hero", label: "01 / Overview" },
  { href: "#about", label: "02 / About the society" },
  { href: "#pillars", label: "03 / Why AI Society" },
  { href: "#works", label: "04 / Selected works" },
  { href: "#resources", label: "05 / Resource center" },
  { href: "#roadmap", label: "06 / How we build" },
];

const CHANNELS = [
  { href: "https://github.com", label: "GitHub" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "https://www.bennett.edu.in", label: "Bennett University" },
];

export default function Footer() {
  return (
    <footer className="mt-16 rounded-t-[40px] bg-dark pt-20 pb-12 text-white">
      <div className="shell">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-16 md:grid-cols-12">
          {/* Full lockup at its native white — no disc, no crop. Sized so the
              three wordmark lines stay legible. */}
          <div className="flex flex-col justify-between md:col-span-6 md:pr-12">
            <div>
              <span
                aria-hidden
                className="block h-14 w-[220px] bg-left bg-contain bg-no-repeat"
                style={{ backgroundImage: "url('/images/ais-logo.png')" }}
              />

              <p className="mt-7 max-w-[40ch] text-[15px] leading-[1.6] text-white/55">
                Bennett University&apos;s artificial intelligence society.
                Training minds, one epoch at a time.
              </p>
            </div>

            <div className="mt-8 space-y-1.5 text-[13px] text-white/55">
              <div>Bennett University · TechZone II, Greater Noida, UP</div>
              <div>
                Inquiries:{" "}
                <a
                  href="mailto:ais@bennett.edu.in"
                  className="text-white underline-offset-4 hover:underline"
                >
                  ais@bennett.edu.in
                </a>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              Index
            </h2>
            <ul className="mt-5 space-y-3 text-[13px]">
              {INDEX_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
              Channels
            </h2>
            <ul className="mt-5 space-y-3 text-[13px]">
              {CHANNELS.map((channel) => (
                <li key={channel.href}>
                  <a
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-white/70 transition-colors hover:text-white"
                  >
                    <span>{channel.label}</span>
                    <span aria-hidden className="text-white/35">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-[12px] text-white/40 sm:flex-row">
          <div>
            © {new Date().getFullYear()} AI Society. All rights reserved.
          </div>
          <div>Bennett University · Greater Noida</div>
        </div>
      </div>
    </footer>
  );
}
