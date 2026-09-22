import type { ElementType, ReactNode } from "react";
import { useReveal } from "../../hooks/useReveal";
import { cn } from "../../lib/cn";

type Props = {
  children: ReactNode;
  /** Opóźnienie kaskady w ms. Trzymaj w okolicach 60-90 ms na element. */
  delay?: number;
  as?: ElementType;
  className?: string;
};

export function Reveal({ children, delay = 0, as, className }: Props) {
  const ref = useReveal<HTMLDivElement>(delay);
  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag ref={ref} className={cn("reveal", className)}>
      {children}
    </Tag>
  );
}
