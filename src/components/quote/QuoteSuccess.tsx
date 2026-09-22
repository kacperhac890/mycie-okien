import { useEffect, useRef } from "react";
import { company } from "../../data/site";
import { Button } from "../ui/Button";

export function QuoteSuccess({ onReset }: { onReset: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center px-2 py-10 text-center sm:py-14">
      <span
        aria-hidden="true"
        className="pop-in flex h-16 w-16 items-center justify-center rounded-pill bg-accent-soft"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-accent">
          <path
            d="m5 12.5 4.5 4.5L19 7.5"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="draw-check"
          />
        </svg>
      </span>

      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-6 text-2xl font-bold tracking-[-0.025em] text-ink focus:outline-none sm:text-3xl"
      >
        Dziękujemy za zapytanie
      </h3>

      <p className="body-text mt-4 max-w-[44ch]">
        Otrzymaliśmy Twoje dane. Skontaktujemy się z Tobą w sprawie szczegółów wyceny. Jeśli sprawa
        jest pilna, zadzwoń.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button as="a" href={company.phoneHref} size="lg">
          {company.phoneDisplay}
        </Button>
        <Button as="a" href="#gora" variant="secondary" size="lg" onClick={onReset}>
          Wróć na stronę główną
        </Button>
      </div>
    </div>
  );
}
