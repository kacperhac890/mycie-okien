import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "onBrand" | "quiet";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap " +
  "transition-[background-color,color,box-shadow,transform] duration-200 ease-out " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-55";

const variants: Record<Variant, string> = {
  // Granat na jasnym tle, jasny błękit w trybie ciemnym. Kontrast > 8:1 w obu.
  primary: "bg-cta text-cta-fg hover:bg-cta-hover shadow-raise",
  secondary:
    "bg-surface text-ink border border-line-strong hover:border-ink-faint hover:bg-surface-2",
  // Na ciemnych panelach: biel na granacie.
  onBrand: "bg-cta-on-brand text-cta-on-brand-fg hover:bg-cta-on-brand-hover",
  quiet: "text-ink hover:text-accent",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  full = false,
  className,
  children,
  ...rest
}: ButtonProps<T>) {
  const Tag = (as ?? "button") as ElementType;
  return (
    <Tag
      className={cn(base, variants[variant], sizes[size], full && "w-full", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
