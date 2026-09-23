import { Check, Minus, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

/* Pola tekstowe są wspólne dla całego serwisu i mieszkają w ui/Field.
   Tutaj zostają kontrolki specyficzne dla formularza wyceny. */
export { FieldError, FieldWrap, TextField, TextAreaField } from "../ui/Field";

/* ------------------------------------------------------------------
   Karta wyboru (radio) i karta wielokrotnego wyboru (checkbox).
   Pod spodem prawdziwe inputy, więc klawiatura i czytniki działają
   bez dodatkowej obsługi.
   ------------------------------------------------------------------ */

const cardBase =
  "group relative flex cursor-pointer gap-4 rounded-card border bg-surface p-4 text-left " +
  "transition-[border-color,background-color,box-shadow] duration-200 sm:p-5 " +
  "hover:border-line-strong has-[:checked]:border-accent has-[:checked]:bg-accent-soft " +
  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 " +
  "has-[:focus-visible]:outline-accent";

function Indicator({ shape }: { shape: "circle" | "square" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-line-strong bg-surface transition-colors",
        shape === "circle" ? "rounded-full" : "rounded-[6px]",
        "group-has-[:checked]:border-accent group-has-[:checked]:bg-accent",
      )}
    >
      <Check
        className="h-3 w-3 text-white opacity-0 transition-opacity group-has-[:checked]:opacity-100"
        strokeWidth={3.5}
      />
    </span>
  );
}

type SelectCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  title: string;
  body?: string;
  icon?: LucideIcon;
  type?: "radio" | "checkbox";
  describedBy?: string;
};

export function SelectCard({
  name,
  value,
  checked,
  onChange,
  title,
  body,
  icon: Icon,
  type = "radio",
  describedBy,
}: SelectCardProps) {
  return (
    <label className={cardBase}>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        aria-describedby={describedBy}
        className="sr-only"
      />

      <Indicator shape={type === "radio" ? "circle" : "square"} />

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          {Icon ? (
            <Icon
              className="h-[18px] w-[18px] shrink-0 text-ink-faint transition-colors group-has-[:checked]:text-accent"
              strokeWidth={2}
              aria-hidden="true"
            />
          ) : null}
          <span className="h-card block text-ink">{title}</span>
        </span>
        {body ? (
          <span className="body-text mt-1 block text-[0.875rem] leading-snug">{body}</span>
        ) : null}
      </span>
    </label>
  );
}

/* ------------------------------------------------------------------
   Licznik ilości. Duże cele dotykowe, wartość wpisywalna z klawiatury.
   ------------------------------------------------------------------ */

type StepperProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label: string;
  disabled?: boolean;
  id: string;
};

export function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 999,
  label,
  disabled,
  id,
}: StepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-pill border border-line-strong bg-surface p-1",
        disabled && "pointer-events-none opacity-45",
      )}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label={`Zmniejsz: ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface-2 disabled:opacity-40"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>

      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => {
          const next = Number.parseInt(e.target.value, 10);
          onChange(Number.isNaN(next) ? min : clamp(next));
        }}
        className="h-11 w-16 border-0 bg-transparent text-center text-lg font-bold text-ink tabular-nums focus:outline-none"
      />

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label={`Zwiększ: ${label}`}
        className="flex h-11 w-11 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface-2 disabled:opacity-40"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
