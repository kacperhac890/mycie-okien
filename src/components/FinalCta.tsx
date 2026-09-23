import { ArrowRight, Phone } from "lucide-react";
import { finalCta } from "../data/site";
import { useContent } from "../content/ContentProvider";
import { phoneHref } from "../content/types";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

export function FinalCta() {
  const { company } = useContent();

  return (
    <section aria-labelledby="final-cta-tytul" className="pb-16 md:pb-24">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-card bg-brand px-6 py-14 text-center md:px-16 md:py-20">
            {/* Jedyny gradient na stronie: delikatne rozjaśnienie od góry,
                żeby ciemny panel nie był płaską plamą. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(92,180,242,0.18),transparent_60%)]"
            />

            <div className="relative mx-auto max-w-[36ch]">
              <h2 id="final-cta-tytul" className="h-section text-on-brand">
                {finalCta.heading}
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-on-brand-soft">
                {finalCta.lead}
              </p>
            </div>

            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                as="a"
                href={finalCta.cta.href}
                variant="onBrand"
                size="lg"
                className="group w-full sm:w-auto"
              >
                {finalCta.cta.label}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Button>

              <a
                href={phoneHref(company.phone)}
                className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-pill border border-brand-line px-7 text-base font-semibold text-on-brand transition-colors hover:bg-white/10 sm:w-auto"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {company.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
