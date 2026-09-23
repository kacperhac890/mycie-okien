import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { isUnset, newId } from "../../content/types";
import type { FaqItem } from "../../content/types";
import { Button } from "../ui/Button";
import { TextAreaField, TextField } from "../ui/Field";

type Props = {
  items: FaqItem[];
  onChange: (next: FaqItem[]) => void;
};

export function FaqEditor({ items, onChange }: Props) {
  function update(id: string, patch: Partial<FaqItem>) {
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
    onChange([...items, { id: newId("pytanie"), q: "", a: "" }]);
  }

  const unconfirmed = items.filter((item) => isUnset(item.a) || item.a.includes("[")).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[60ch]">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">Pytania i odpowiedzi</h2>
          <p className="body-text mt-2 text-[0.875rem]">
            Odpowiadaj na to, o co klienci faktycznie pytają przed zamówieniem. Puste pytania nie
            trafiają na stronę.
          </p>
        </div>
        <Button type="button" onClick={add}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Dodaj pytanie
        </Button>
      </div>

      {unconfirmed > 0 ? (
        <p className="mt-5 rounded-control border border-line bg-surface-inset px-4 py-3 text-[0.8125rem] text-ink">
          W odpowiedziach zostały jeszcze fragmenty w nawiasach kwadratowych ({unconfirmed}). Widzą
          je odwiedzający stronę.
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line-strong bg-surface-inset p-8 text-center text-[0.9375rem] text-ink-soft">
          Brak pytań. Sekcja FAQ nie pojawi się na stronie.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-5">
          {items.map((item, index) => (
            <li key={item.id} className="rounded-card border border-line bg-surface p-5">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <span className="text-[0.8125rem] font-bold text-ink-faint tabular-nums">
                  Pytanie {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Przesuń pytanie ${index + 1} w górę`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface-2 disabled:opacity-35"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Przesuń pytanie ${index + 1} w dół`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface-2 disabled:opacity-35"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Usuń pytanie ${index + 1}`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-danger transition-colors hover:bg-danger-soft"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <TextField
                  label="Pytanie"
                  placeholder="np. Czy myjecie okna na wysokościach?"
                  value={item.q}
                  onChange={(e) => update(item.id, { q: e.target.value })}
                />
                <TextAreaField
                  label="Odpowiedź"
                  rows={3}
                  value={item.a}
                  onChange={(e) => update(item.id, { a: e.target.value })}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
