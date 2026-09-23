import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { useContent } from "../content/ContentProvider";
import { Reveal } from "./ui/Reveal";
import { cn } from "../lib/cn";

export function Faq() {
  const { faq } = useContent();
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section id="faq" className="section-pad scroll-mt-24 bg-surface">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-4">
          <h2 className="h-section text-ink lg:sticky lg:top-28">Pytania, które dostajemy najczęściej</h2>
        </Reveal>

        <div className="lg:col-span-7 lg:col-start-6">
          <ul>
            {faq.map((item, i) => {
              const isOpen = open === i;
              const panelId = `${baseId}-panel-${i}`;
              const buttonId = `${baseId}-button-${i}`;

              return (
                <Reveal as="li" key={item.id} delay={i * 50} className="border-b border-line">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-start justify-between gap-5 py-5 text-left transition-colors hover:text-accent md:py-6"
                    >
                      <span className="text-[1.0625rem] leading-snug font-bold tracking-[-0.012em] text-ink">
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-pill border border-line-strong text-ink transition-[transform,background-color,border-color] duration-300",
                          isOpen && "rotate-45 border-accent bg-accent text-white",
                        )}
                      >
                        <Plus className="h-4 w-4" strokeWidth={2.4} />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    inert={!isOpen}
                    className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="body-text max-w-[62ch] pb-6">{item.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
