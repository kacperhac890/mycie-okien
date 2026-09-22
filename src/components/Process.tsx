import { process } from "../data/site";
import { Reveal } from "./ui/Reveal";

export function Process() {
  return (
    <section aria-labelledby="proces-tytul" className="section-pad">
      <div className="shell">
        <Reveal className="max-w-[42ch]">
          <h2 id="proces-tytul" className="h-section text-ink">
            {process.heading}
          </h2>
        </Reveal>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-card bg-line md:mt-14 md:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.n}
              delay={i * 80}
              className="flex flex-col bg-bg p-6 md:p-7 lg:p-8"
            >
              <span
                aria-hidden="true"
                className="text-[2rem] leading-none font-extrabold tracking-[-0.04em] text-accent tabular-nums"
              >
                {step.n}
              </span>
              <h3 className="h-card mt-5 text-ink">{step.title}</h3>
              <p className="body-text mt-2">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
