import { quality } from "../data/site";
import { IMAGE_RATIOS, responsive } from "../data/images";
import { useContent } from "../content/ContentProvider";
import { Reveal } from "./ui/Reveal";

export function Quality() {
  const photo = responsive(useContent().images.quality, IMAGE_RATIOS.quality, 1440);

  return (
    <section aria-labelledby="jakosc-tytul" className="section-pad bg-surface">
      <div className="shell">
        <Reveal className="max-w-[52ch]">
          <h2 id="jakosc-tytul" className="h-section text-ink">
            {quality.heading}
          </h2>
          <p className="body-lead mt-5">{quality.lead}</p>
        </Reveal>

        <Reveal delay={90} className="mt-10 md:mt-14">
          <div className="overflow-hidden rounded-card border border-line bg-surface-2">
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(min-width: 1280px) 1200px, 100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]"
            />
          </div>
        </Reveal>

        <ul className="mt-10 grid gap-8 md:mt-14 md:grid-cols-3 md:gap-10">
          {quality.points.map(({ title, body, icon: Icon }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 80}
              className="border-t border-line-strong pt-5 md:pt-6"
            >
              <Icon className="h-5 w-5 text-accent" strokeWidth={2} aria-hidden="true" />
              <h3 className="h-card mt-4 text-ink">{title}</h3>
              <p className="body-text mt-2">{body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
