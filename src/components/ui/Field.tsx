import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/cn";

/* Ogólne pola formularza. Używa ich zarówno formularz wyceny, jak i panel
   administracyjny, dlatego leżą w ui/, a nie przy konkretnej funkcji. */

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
          error ? "border-danger focus:border-danger focus:ring-danger/18" : "border-line-strong",
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
        className={cn(
          controlBase,
          "resize-y py-3 leading-relaxed",
          error ? "border-danger focus:border-danger focus:ring-danger/18" : "border-line-strong",
          className,
        )}
        {...rest}
      />
    </FieldWrap>
  );
}
