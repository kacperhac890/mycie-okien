import { ArrowRight } from "lucide-react";
import { services } from "../data/site";
import { images, img } from "../data/images";
import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import type { ServiceType } from "./quote/types";

const photos = {
  prywatny: img(images.privateClient, 900),
  komercyjny: img(images.commercialClient, 900),
} as const;

export function Services({ onPick }: { onPick: (type: ServiceType) => void }) {
  return (
    <section id="uslugi" className="section-pad scroll-mt-24 bg-surface">
      <div className="shell">
        <Reveal className="max-w-[46ch]">
          <h2 className="h-section text-ink">{services.heading}</h2>
        </Reveal>

        <div className="mt-10 grid gap-5 md:mt-14 lg:grid-cols-2 lg:gap-6">
          {services.groups.map((group, i) => {
            const photo = photos[group.id];
            const Icon = group.icon;
            return (
              <Reveal
                key={group.id}
                delay={i * 90}
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
                    {group.kicker}
                  </span>

                  <h3 className="mt-3 text-2xl leading-tight font-bold tracking-[-0.02em] text-ink">
                    {group.title}
                  </h3>
                  <p className="body-text mt-3">{group.body}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-pill border border-line bg-surface px-3 py-1.5 text-[0.8125rem] font-medium text-ink-soft"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-2 md:mt-auto">
                    <Button
                      as="a"
                      href="#wycena"
                      variant={i === 0 ? "primary" : "secondary"}
                      className="group"
                      onClick={() => onPick(group.id)}
                    >
                      {group.cta}
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
