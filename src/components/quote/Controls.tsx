import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { AlertCircle, Check, Minus, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

/* ------------------------------------------------------------------
   Komunikat błędu przy polu. Zawsze pod polem, zawsze z ikoną,
   zawsze ogłaszany przez czytnik ekranu.
   ------------------------------------------------------------------ */

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 flex items-start gap-1.5 text-[0.8125rem] leading-snug font-medium text-danger"
    >
      <AlertCircle className="mt-px h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

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
   Pola tekstowe
   ------------------------------------------------------------------ */

const controlBase =
  "w-full rounded-control border bg-surface px-4 text-ink placeholder:text-ink-faint " +
  "transition-[border-color,box-shadow] duration-200 " +
  "focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/18";

type FieldWrapProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
};

export function FieldWrap({
  label,
  htmlFor,
  hint,
  error,
  optional,
  children,
  className,
}: FieldWrapProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-[0.8125rem] font-semibold text-ink">
        {label}
        {optional ? <span className="ml-1.5 font-medium text-ink-faint">(opcjonalne)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="text-[0.8125rem] leading-snug text-ink-soft">
          {hint}
        </p>
      ) : null}
      <FieldError id={`${htmlFor}-error`}>{error}</FieldError>
    </div>
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  wrapClassName?: string;
};

export function TextField({
  label,
  hint,
  error,
  optional,
  wrapClassName,
  className,
  id,
  ...rest
}: TextFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <FieldWrap
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      optional={optional}
      className={wrapClassName}
    >
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(
          controlBase,
          "h-12",
          error && "border-danger focus:border-danger focus:ring-danger/18",
          !error && "border-line-strong",
          className,
        )}
        {...rest}
      />
    </FieldWrap>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  wrapClassName?: string;
};

export function TextAreaField({
  label,
  hint,
  error,
  optional,
  wrapClassName,
  className,
  id,
  ...rest
}: TextAreaProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <FieldWrap
      label={label}
      htmlFor={fieldId}
      hint={hint}
      error={error}
      optional={optional}
      className={wrapClassName}
    >
      <textarea
        id={fieldId}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(controlBase, "resize-y py-3 leading-relaxed", "border-line-strong", className)}
        {...rest}
      />
    </FieldWrap>
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
