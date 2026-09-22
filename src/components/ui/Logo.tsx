import { company } from "../../data/site";
import { cn } from "../../lib/cn";

/**
 * Znak firmowy: prosty geometryczny symbol (kwatera okienna + przetarcie)
 * plus wordmark. Do podmiany na właściwe logo klienta.
 */
export function Logo({ onBrand = false }: { onBrand?: boolean }) {
  /* Na granatowym panelu akcent musi być jasny, inaczej znika w tle. */
  const mark = onBrand ? "var(--accent-on-brand)" : "var(--accent)";

  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <svg
        viewBox="0 0 40 40"
        aria-hidden="true"
        className={cn("h-9 w-9 shrink-0", onBrand ? "text-on-brand" : "text-brand")}
      >
        <rect width="40" height="40" rx="10" fill="currentColor" />
        <rect
          x="10.5"
          y="9.5"
          width="19"
          height="21"
          rx="2.5"
          fill="none"
          stroke={mark}
          strokeWidth="2.2"
        />
        <path
          d="M20 9.5v21M10.5 20h19"
          stroke={mark}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="m13.5 26 12-14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className="flex min-w-0 flex-col leading-none">
        <span
          className={cn(
            "truncate text-[0.9375rem] font-extrabold tracking-[-0.02em]",
            onBrand ? "text-on-brand" : "text-ink",
          )}
        >
          {company.name}
        </span>
        <span
          className={cn(
            "mt-1 hidden truncate text-[0.625rem] font-semibold tracking-[0.1em] uppercase xs:block",
            onBrand ? "text-on-brand-soft" : "text-ink-faint",
          )}
        >
          Mycie okien i przeszkleń
        </span>
      </span>
    </span>
  );
}
