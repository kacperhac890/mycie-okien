import { useRef } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

type Props = {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  local?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

function src(id: string, local: boolean | undefined, w: number, h: number) {
  if (local) return id;
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=72`;
}

/**
 * Porównanie „przed / po”.
 *
 * Pozycję suwaka trzymamy w zmiennej CSS ustawianej bezpośrednio na
 * elemencie, a nie w stanie Reacta: przeciąganie nie wywołuje wtedy
 * żadnego renderu. Pod spodem działa zwykły input[type=range], więc
 * obsługa klawiaturą i czytnikami ekranu jest darmowa.
 */
export function BeforeAfter({
  before,
  after,
  beforeAlt,
  afterAlt,
  local,
  className,
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);

  function setPosition(value: number) {
    wrap.current?.style.setProperty("--pos", `${value}%`);
  }

  return (
    <div
      ref={wrap}
      style={{ ["--pos" as string]: "50%" }}
      className={cn(
        "group relative isolate overflow-hidden rounded-card border border-line bg-surface-2",
        className,
      )}
    >
      {/* Stan docelowy: widoczny domyślnie, pod spodem */}
      <img
        src={src(after, local, 1200, 900)}
        alt={afterAlt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        className="aspect-[4/3] w-full object-cover"
      />

      {/* Stan wyjściowy: przycięty do pozycji suwaka */}
      <img
        src={src(before, local, 1200, 900)}
        alt={beforeAlt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        sizes={sizes}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover [clip-path:inset(0_calc(100%_-_var(--pos))_0_0)]"
      />

      <span className="pointer-events-none absolute top-3 left-3 rounded-pill bg-brand/80 px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.08em] text-on-brand uppercase backdrop-blur-sm">
        Przed
      </span>
      <span className="pointer-events-none absolute top-3 right-3 rounded-pill bg-surface/85 px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.08em] text-ink uppercase backdrop-blur-sm">
        Po
      </span>

      {/* Linia podziału i uchwyt */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[var(--pos)] w-0.5 -translate-x-1/2 bg-white/90 shadow-raise"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-[var(--pos)] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-pill bg-white text-brand shadow-float transition-transform duration-200 group-hover:scale-105"
      >
        <MoveHorizontal className="h-5 w-5" strokeWidth={2.2} />
      </span>

      <input
        type="range"
        min={0}
        max={100}
        defaultValue={50}
        step={1}
        aria-label="Porównanie przed i po. Przesuń, aby odsłonić zdjęcie sprzed mycia."
        onInput={(e) => setPosition(Number(e.currentTarget.value))}
        className={cn(
          "absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent",
          "[&::-webkit-slider-thumb]:h-11 [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-transparent",
          "[&::-moz-range-thumb]:h-11 [&::-moz-range-thumb]:w-11 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        )}
      />
    </div>
  );
}
