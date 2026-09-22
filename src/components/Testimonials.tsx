import { Star } from "lucide-react";
import { testimonials } from "../data/site";
import { Reveal } from "./ui/Reveal";
import { cn } from "../lib/cn";

/*
  UWAGA DLA WŁAŚCICIELA STRONY
  Nie wstawiamy zmyślonych opinii. Poniżej jest gotowy układ z wyraźnymi
  placeholderami. Podmień treści w src/data/site.ts (tablica `testimonials`),
  ustaw `rating` i przełącz `isPlaceholder` na false, a karty od razu
  zaczną wyglądać docelowo.
*/

function Stars({ rating }: { rating: number | null }) {
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={rating ? `Ocena ${rating} na 5` : "Ocena do uzupełnienia"}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            rating && i <= rating ? "fill-accent text-accent" : "text-line-strong",
          )}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="opinie" className="section-pad scroll-mt-24">
      <div className="shell">
        <Reveal className="max-w-[40ch]">
          <h2 className="h-section text-ink">Co mówią klienci</h2>
        </Reveal>

        <ul className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {testimonials.map((item, i) => (
            <Reveal
              as="li"
              key={item.author + i}
              delay={i * 80}
              className={cn(
                "flex h-full flex-col rounded-card border border-line bg-surface p-6 md:p-7",
                /* Lekkie przesunięcie środkowej karty łamie siatkę trzech
                   identycznych kafli. */
                i === 1 && "md:-translate-y-4",
              )}
            >
              <Stars rating={item.rating} />

              <blockquote className="mt-5 flex-1">
                <p
                  className={cn(
                    "text-[0.9375rem] leading-relaxed",
                    item.isPlaceholder ? "text-ink-faint italic" : "text-ink",
                  )}
                >
                  {item.quote}
                </p>
              </blockquote>

              <div className="mt-6 border-t border-line pt-4">
                <span className="block text-[0.9375rem] font-bold text-ink">{item.author}</span>
                <span className="mt-0.5 block text-[0.8125rem] text-ink-soft">{item.meta}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
