import { whyUs } from "../data/site";
import { images, img } from "../data/images";
import { Reveal } from "./ui/Reveal";

export function WhyUs() {
  const photo = img(images.work, 900);

  return (
    <section id="dlaczego-my" className="section-pad scroll-mt-24">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <h2 className="h-section text-ink">{whyUs.heading}</h2>
          <p className="body-text mt-5 max-w-[58ch]">{whyUs.lead}</p>
        </Reveal>

        <Reveal className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div className="overflow-hidden rounded-card border border-line bg-surface-2 lg:sticky lg:top-28">
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(min-width: 1024px) 38vw, 100vw"
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover lg:aspect-[3/4]"
            />
          </div>
        </Reveal>

        <ul className="lg:col-span-7 lg:col-start-6 lg:row-start-2">
          {whyUs.items.map(({ title, body, icon: Icon }, i) => (
            <Reveal
              as="li"
              key={title}
              delay={i * 70}
              className="flex gap-4 border-b border-line py-5 first:pt-0 last:border-b-0 last:pb-0 md:gap-5 md:py-6"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent">
                <Icon className="h-[19px] w-[19px]" strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <h3 className="h-card text-ink">{title}</h3>
                <p className="body-text mt-1.5 max-w-[52ch]">{body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
