import { realizations } from "../data/gallery";
import { BeforeAfter } from "./BeforeAfter";
import { Reveal } from "./ui/Reveal";
import { cn } from "../lib/cn";

export function Gallery() {
  const [featured, ...rest] = realizations;

  return (
    <section id="realizacje" className="section-pad scroll-mt-24">
      <div className="shell">
        <Reveal className="max-w-[46ch]">
          <h2 className="h-section text-ink">Realizacje: przed i po</h2>
          <p className="body-text mt-5">
            Przesuń suwak na zdjęciu, żeby zobaczyć różnicę. To ten sam kadr przed myciem i po
            zakończeniu pracy.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-7">
          {[featured, ...rest].map((item, i) => (
            <Reveal
              key={item.id}
              delay={i * 80}
              className={cn("flex flex-col", item.featured && "md:col-span-2")}
            >
              <BeforeAfter
                before={item.before}
                after={item.after}
                beforeAlt={item.beforeAlt}
                afterAlt={item.afterAlt}
                local={item.local}
                sizes={
                  item.featured
                    ? "(min-width: 1280px) 1200px, 100vw"
                    : "(min-width: 768px) 46vw, 100vw"
                }
                className={item.featured ? "[&>img:first-child]:md:aspect-[21/9]" : undefined}
              />

              <div className="mt-5">
                <h3 className="h-card text-ink">{item.title}</h3>
                <p className="mt-1 text-[0.8125rem] font-medium text-ink-faint">{item.meta}</p>
                <p className="body-text mt-2 max-w-[54ch] text-[0.9375rem]">{item.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
