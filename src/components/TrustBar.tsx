import { trustPoints } from "../data/site";
import { Reveal } from "./ui/Reveal";

/**
 * Pasek zaufania tuż pod hero. Świadomie bez kart: hairline + ikona +
 * krótka etykieta. Ma być tłem dla decyzji, nie osobną sekcją do czytania.
 */
export function TrustBar() {
  return (
    <section aria-label="Najważniejsze argumenty" className="border-y border-line bg-surface">
      <div className="shell">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 py-6 sm:grid-cols-3 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:py-5">
          {trustPoints.map(({ label, icon: Icon }, i) => (
            <Reveal as="li" key={label} delay={i * 60} className="flex items-center gap-2.5">
              <Icon className="h-[18px] w-[18px] shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
              <span className="text-[0.8125rem] leading-tight font-semibold text-ink md:text-sm">
                {label}
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
