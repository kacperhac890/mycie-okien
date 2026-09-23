import { ArrowRight } from "lucide-react";
import { hero } from "../data/site";
import { IMAGE_RATIOS, responsive } from "../data/images";
import { useContent } from "../content/ContentProvider";
import { Button } from "./ui/Button";

export function Hero() {
  const photo = responsive(useContent().images.hero, IMAGE_RATIOS.hero, 1024);

  return (
    <section id="gora" className="relative overflow-hidden pt-24 pb-14 md:pt-28 md:pb-20 lg:pt-32">
      {/* Delikatne rozjaśnienie górnej krawędzi. Bez gradientowych plam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-gradient-to-b from-surface to-transparent"
      />

      <div className="shell relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <h1 className="h-display text-ink">
            {hero.headline[0]}
            <br />
            <span className="text-ink-soft">{hero.headline[1]}</span>
          </h1>

          <p className="body-lead mt-6 max-w-[46ch]">{hero.lead}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button as="a" href={hero.ctaPrimary.href} size="lg" className="group">
              {hero.ctaPrimary.label}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
            <Button as="a" href={hero.ctaSecondary.href} variant="secondary" size="lg">
              {hero.ctaSecondary.label}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative overflow-hidden rounded-card border border-line bg-surface-2 shadow-float">
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(min-width: 1024px) 40vw, 100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/5]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
