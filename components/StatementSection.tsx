export default function StatementSection() {
  return (
    <section id="about" className="py-24 md:py-36">
      <div className="shell">
        <div className="mx-auto flex max-w-[1010px] flex-col items-center text-center">
          <p className="font-display text-[clamp(23px,3vw,38px)] font-bold leading-[1.3] tracking-[-0.028em] text-ink">
            Welcome. We are Bennett University&apos;s{" "}
            <span className="chip">
              <span className="text-accent" aria-hidden>
                ✦
              </span>
              <span>AI Society</span>
            </span>{" "}
            — engineering autonomous systems, neural architectures, and{" "}
            <span className="chip">
              <span className="text-accent" aria-hidden>
                ◉
              </span>
              <span>Real-World Intelligence</span>
            </span>
            .
          </p>

          <a href="#pillars" className="pill mt-11">
            <span>Explore the society</span>
            <span className="pill__medal" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
