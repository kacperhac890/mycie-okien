import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { newId } from "../../content/types";
import type { Realization } from "../../content/types";
import { Button } from "../ui/Button";
import { TextAreaField, TextField } from "../ui/Field";
import { ImageField } from "./ImageField";

type Props = {
  items: Realization[];
  onChange: (next: Realization[]) => void;
};

export function GalleryEditor({ items, onChange }: Props) {
  function update(id: string, patch: Partial<Realization>) {
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
        id: newId("realizacja"),
        title: "",
        meta: "",
        summary: "",
        before: { src: "", alt: "" },
        after: { src: "", alt: "" },
        featured: false,
      },
    ]);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-[60ch]">
          <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">Realizacje: przed i po</h2>
          <p className="body-text mt-2 text-[0.875rem]">
            Suwak działa najlepiej, gdy oba zdjęcia są zrobione z tego samego miejsca, w podobnym
            świetle i w tym samym kadrze. Pozycja „wyróżniona” zajmuje pełną szerokość siatki.
          </p>
        </div>
        <Button type="button" onClick={add}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Dodaj realizację
        </Button>
      </div>

      {items.length === 0 ? (
        <p className="mt-8 rounded-card border border-dashed border-line-strong bg-surface-inset p-8 text-center text-[0.9375rem] text-ink-soft">
          Brak realizacji. Sekcja „Realizacje: przed i po” nie pojawi się na stronie.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-6">
          {items.map((item, index) => (
            <li key={item.id} className="rounded-card border border-line bg-bg p-5">
              <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
                <span className="text-[0.8125rem] font-bold text-ink-faint tabular-nums">
                  Realizacja {index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Przesuń realizację ${index + 1} w górę`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface-2 disabled:opacity-35"
                  >
                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Przesuń realizację ${index + 1} w dół`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-surface-2 disabled:opacity-35"
                  >
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    aria-label={`Usuń realizację ${index + 1}`}
                    className="flex h-10 w-10 items-center justify-center rounded-pill text-danger transition-colors hover:bg-danger-soft"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Tytuł realizacji"
                    placeholder="np. Dom jednorodzinny po remoncie"
                    value={item.title}
                    onChange={(e) => update(item.id, { title: e.target.value })}
                    hint="Bez tytułu realizacja nie trafi na stronę."
                  />
                  <TextField
                    label="Miejsce i data"
                    placeholder="np. Szczecin · marzec 2026"
                    optional
                    value={item.meta}
                    onChange={(e) => update(item.id, { meta: e.target.value })}
                  />
                </div>

                <TextAreaField
                  label="Krótki opis"
                  rows={2}
                  optional
                  placeholder="Co dokładnie było do zrobienia."
                  value={item.summary}
                  onChange={(e) => update(item.id, { summary: e.target.value })}
                />

                <div className="grid gap-4 lg:grid-cols-2">
                  <ImageField
                    label="Zdjęcie przed"
                    value={item.before}
                    onChange={(before) => update(item.id, { before })}
                  />
                  <ImageField
                    label="Zdjęcie po"
                    value={item.after}
                    onChange={(after) => update(item.id, { after })}
                  />
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 text-[0.8125rem] font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={item.featured}
                    onChange={(e) => update(item.id, { featured: e.target.checked })}
                    className="h-5 w-5 shrink-0 rounded-[6px] border-2 border-line-strong accent-accent"
                  />
                  Wyróżniona, na całą szerokość
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
