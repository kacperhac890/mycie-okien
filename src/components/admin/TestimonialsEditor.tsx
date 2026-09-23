import { ChevronDown, ChevronUp, Plus, Star, Trash2 } from "lucide-react";
import { newId } from "../../content/types";
import type { Testimonial } from "../../content/types";
import { Button } from "../ui/Button";
import { TextAreaField, TextField } from "../ui/Field";
import { cn } from "../../lib/cn";

type Props = {
  items: Testimonial[];
  onChange: (next: Testimonial[]) => void;
};

function RatingPicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (next: number | null) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.8125rem] font-semibold text-ink">Ocena</span>
      <div className="flex flex-wrap items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`Ustaw ocenę ${n} na 5`}
            aria-pressed={value === n}
            className="flex h-11 w-9 items-center justify-center rounded-control transition-colors hover:bg-surface-2"
          >
            <Star
              className={cn(
                "h-5 w-5",
                value && n <= value ? "fill-accent text-accent" : "text-line-strong",
              )}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(null)}
          className={cn(
            "ml-2 rounded-pill px-3 py-2 text-[0.8125rem] font-semibold transition-colors",
            value === null ? "bg-accent-soft text-accent" : "text-ink-soft hover:bg-surface-2",
          )}
        >
          bez oceny
        </button>
      </div>
    </div>
  );
}

export function TestimonialsEditor({ items, onChange }: Props) {
  function update(id: string, patch: Partial<Testimonial>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function add() {
    onChange([
      ...items,
      {
        id: newId("opinia"),
        quote: "",
        author: "",
        meta: "",
        rating: 5,
        isPlaceholder: false,
      },
    ]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[60ch]">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">Opinie klientów</h2>
          <p className="body-text mt-2 text-[0.875rem]">
            Publikuj tylko wypowiedzi, które faktycznie dostałeś. Karty oznaczone jako
            „placeholder” wyświetlają się kursywą i wyraźnie sygnalizują, że czekają na treść.
          </p>
        </div>
        <Button type="button" onClick={add}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Dodaj opinię
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line-strong bg-surface-inset p-8 text-center text-[0.9375rem] text-ink-soft">
          Brak opinii. Sekcja „Co mówią klienci” nie pojawi się na stronie, dopóki nie dodasz
          pierwszej.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-5">
          {items.map((item, index) => (
            <li key={item.id} className="rounded-card border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <span className="text-[0.8125rem] font-bold text-ink-faint tabular-nums">
                  Opinia {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Przesuń opinię ${index + 1} w górę`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface-2 disabled:opacity-35"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Przesuń opinię ${index + 1} w dół`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface-2 disabled:opacity-35"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Usuń opinię ${index + 1}`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-danger transition-colors hover:bg-danger-soft"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <TextAreaField
                  label="Treść opinii"
                  rows={3}
                  value={item.quote}
                  onChange={(e) => update(item.id, { quote: e.target.value })}
                  hint="Dwa, trzy zdania czytają się najlepiej. Puste opinie nie trafiają na stronę."
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Podpis"
                    placeholder="np. Anna z Pogodna"
                    value={item.author}
                    onChange={(e) => update(item.id, { author: e.target.value })}
                  />
                  <TextField
                    label="Kontekst"
                    placeholder="np. Dom jednorodzinny, Szczecin"
                    optional
                    value={item.meta}
                    onChange={(e) => update(item.id, { meta: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <RatingPicker
                    value={item.rating}
                    onChange={(rating) => update(item.id, { rating })}
                  />

                  <label className="flex cursor-pointer items-center gap-2.5 text-[0.8125rem] font-medium text-ink">
                    <input
                      type="checkbox"
                      checked={item.isPlaceholder}
                      onChange={(e) => update(item.id, { isPlaceholder: e.target.checked })}
                      className="h-5 w-5 shrink-0 rounded-[6px] border-2 border-line-strong accent-accent"
                    />
                    To tylko placeholder
                  </label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
