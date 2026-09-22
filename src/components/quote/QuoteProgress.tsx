import { STEPS } from "./options";
import { cn } from "../../lib/cn";

export function QuoteProgress({ step }: { step: number }) {
  const total = STEPS.length;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[0.9375rem] font-bold text-ink">{STEPS[step].label}</p>
        <p className="text-[0.8125rem] font-semibold text-ink-faint tabular-nums">
          Krok {step + 1} z {total}
        </p>
      </div>

      <ol className="mt-3 flex gap-1.5" aria-label="Postęp formularza">
        {STEPS.map((item, i) => (
          <li
            key={item.key}
            aria-current={i === step ? "step" : undefined}
            className="h-1.5 flex-1 overflow-hidden rounded-pill bg-line"
          >
            <span
              className={cn(
                "block h-full origin-left rounded-pill transition-[transform,background-color] duration-500 ease-out",
                i <= step ? "scale-x-100 bg-accent" : "scale-x-0 bg-accent",
              )}
            />
            <span className="sr-only">
              {item.label}
              {i < step ? " (ukończony)" : i === step ? " (bieżący)" : ""}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
