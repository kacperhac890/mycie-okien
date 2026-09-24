import { ArrowRight } from "lucide-react";
import { services } from "../data/site";
import type { ServiceDef, ServiceId } from "../data/site";
import { IMAGE_RATIOS, responsive } from "../data/images";
import { useContent } from "../content/ContentProvider";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";

/* Sześć równorzędnych kafli zrobiłoby ścianę bez hierarchii, dlatego dwie
   usługi mycia dostają duże kafle ze zdjęciem, a pozostałe cztery zwarte
   karty z ikoną. Siatka ma dokładnie tyle komórek, ile jest usług. */

function FeaturedCard({
  service,
  photo,
  onPick,
  delay,
}: {
  service: ServiceDef;
  photo: ReturnType<typeof responsive>;
  onPick: (id: ServiceId) => void;
  delay: number;
}) {
  const Icon = service.icon;

  return (
    <Reveal
      delay={delay}
      className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-bg"
    >
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes="(min-width: 1024px) 46vw, 100vw"
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        decoding="async"
        className="aspect-[16/10] w-full object-cover md:aspect-[16/9]"
      />

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <span className="eyebrow flex items-center gap-2">
          <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          {service.audience}
        </span>

        <h3 className="mt-3 text-2xl leading-tight font-bold tracking-[-0.02em] text-ink">
          {service.name}
        </h3>
        <p className="body-text mt-3">{service.lead}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {service.items.map((item) => (
            <li
              key={item}
              className="rounded-pill border border-line bg-surface px-3 py-1.5 text-[0.8125rem] font-medium text-ink-soft"
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-2 md:mt-auto">
          <Button as="a" href="#wycena" className="group" onClick={() => onPick(service.id)}>
            Zamów wycenę
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

function CompactCard({
  service,
  onPick,
  delay,
}: {
  service: ServiceDef;
  onPick: (id: ServiceId) => void;
  delay: number;
}) {
  const Icon = service.icon;

  return (
    <Reveal
      as="li"
      delay={delay}
      className="flex h-full flex-col rounded-card border border-line bg-surface p-6"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-control bg-accent-soft text-accent">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
      </span>

      <h3 className="h-card mt-5 text-ink">{service.name}</h3>
      <p className="body-text mt-2 text-[0.9375rem]">{service.lead}</p>

      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
        {service.items.map((item) => (
          <li key={item} className="text-[0.8125rem] text-ink-faint">
            {item}
          </li>
        ))}
      </ul>

      <a
        href="#wycena"
        onClick={() => onPick(service.id)}
        className="group mt-6 inline-flex items-center gap-1.5 pt-1 text-[0.9375rem] font-semibold text-accent transition-colors hover:text-accent-hover md:mt-auto"
      >
        Zamów wycenę
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </Reveal>
  );
}

export function Services({ onPick }: { onPick: (id: ServiceId) => void }) {
  const content = useContent();
  const featured = services.items.filter((s) => s.imageKey);
  const compact = services.items.filter((s) => !s.imageKey);

  return (
    <section id="uslugi" className="section-pad scroll-mt-24 bg-surface">
      <div className="shell">
        <Reveal className="max-w-[52ch]">
          <h2 className="h-section text-ink">{services.heading}</h2>
          <p className="body-lead mt-5">{services.lead}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-2 lg:gap-6">
          {featured.map((service, i) => (
            <FeaturedCard
              key={service.id}
              service={service}
              photo={responsive(
                content.images[service.imageKey!],
                IMAGE_RATIOS[service.imageKey!],
                900,
              )}
              onPick={onPick}
              delay={i * 90}
            />
          ))}
        </div>

        <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4 lg:gap-6">
          {compact.map((service, i) => (
            <CompactCard
              key={service.id}
              service={service}
              onPick={onPick}
              delay={i * 70}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
