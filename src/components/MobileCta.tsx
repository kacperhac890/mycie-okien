import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { company } from "../data/site";
import { useConsent } from "./cookies/CookieConsent";
import { cn } from "../lib/cn";

/**
 * Pasek CTA przy dolnej krawędzi ekranu, tylko na mobile.
 * Pokazuje się po przewinięciu hero i chowa, gdy formularz jest na ekranie,
 * żeby nie zasłaniać jego własnych przycisków.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false);
  /* Dopóki wisi baner zgód, pasek CTA się nie pokazuje: dwa elementy
     przyklejone do dolnej krawędzi zasłaniałyby się nawzajem. */
  const consent = useConsent();
  const show = visible && consent !== null;

  useEffect(() => {
    const hero = document.getElementById("gora");
    const quote = document.getElementById("wycena");
    if (!hero || !quote) return;

    let heroPassed = false;
    let quoteVisible = false;
    const sync = () => setVisible(heroPassed && !quoteVisible);

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        heroPassed = !entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    const quoteObs = new IntersectionObserver(
      ([entry]) => {
        quoteVisible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );

    heroObs.observe(hero);
    quoteObs.observe(quote);
    return () => {
      heroObs.disconnect();
      quoteObs.disconnect();
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden",
        "frost border-t border-line",
        "transition-[transform,opacity] duration-300 ease-out",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
    >
      <div className="flex items-center gap-2.5 px-4 py-3">
        <a
          href="#wycena"
          tabIndex={show ? undefined : -1}
          className="flex h-13 flex-1 items-center justify-center rounded-pill bg-cta px-5 text-base font-semibold text-cta-fg transition-colors hover:bg-cta-hover active:translate-y-px"
        >
          Bezpłatna wycena
        </a>
        <a
          href={company.phoneHref}
          tabIndex={show ? undefined : -1}
          aria-label={`Zadzwoń: ${company.phoneDisplay}`}
          className="flex h-13 w-13 shrink-0 items-center justify-center rounded-pill border border-line-strong bg-surface text-ink transition-colors hover:bg-surface-2"
        >
          <Phone className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
