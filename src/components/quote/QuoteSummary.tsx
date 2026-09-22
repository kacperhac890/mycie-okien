import { Pencil } from "lucide-react";
import { labelOf } from "./options";
import type { QuoteData } from "./types";

type Props = {
  data: QuoteData;
  onEdit: (step: number) => void;
};

type Row = { term: string; value: string };

function Block({
  title,
  step,
  rows,
  onEdit,
}: {
  title: string;
  step: number;
  rows: Row[];
  onEdit: (step: number) => void;
}) {
  return (
    <div className="border-b border-line py-5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="text-[0.8125rem] font-bold tracking-[0.08em] text-ink-faint uppercase">
          {title}
        </h4>
        <button
          type="button"
          onClick={() => onEdit(step)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-pill px-2.5 py-1.5 text-[0.8125rem] font-semibold text-accent transition-colors hover:bg-accent-soft"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          Edytuj
          <span className="sr-only"> sekcję {title.toLowerCase()}</span>
        </button>
      </div>

      <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[10rem_1fr]">
        {rows.map((row) => (
          <div key={row.term} className="contents">
            <dt className="text-[0.875rem] text-ink-soft">{row.term}</dt>
            <dd className="text-[0.9375rem] font-semibold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function QuoteSummary({ data, onEdit }: Props) {
  const location = [data.postalCode, data.city].filter(Boolean).join(" ") || "nie podano";

  const contactRows: Row[] = [
    { term: data.serviceType === "komercyjny" ? "Firma" : "Imię", value: data.name || "nie podano" },
  ];
  if (data.company) {
    contactRows.push({
      term: data.serviceType === "komercyjny" ? "Osoba kontaktowa" : "Firma",
      value: data.company,
    });
  }
  contactRows.push(
    { term: "Telefon", value: data.phone || "nie podano" },
    { term: "E-mail", value: data.email || "nie podano" },
    { term: "Lokalizacja", value: location },
  );
  if (data.notes.trim()) contactRows.push({ term: "Uwagi", value: data.notes.trim() });
  if (data.photos.length > 0) {
    contactRows.push({
      term: "Zdjęcia",
      value: `${data.photos.length} ${data.photos.length === 1 ? "plik" : "pliki"}`,
    });
  }

  return (
    <div className="rounded-card border border-line bg-surface-inset p-5 sm:p-6">
      <Block
        title="Rodzaj usługi"
        step={0}
        onEdit={onEdit}
        rows={[
          {
            term: "Typ",
            value: data.serviceType ? labelOf.serviceType(data.serviceType) : "nie wybrano",
          },
        ]}
      />

      <Block
        title="Przeszklenia"
        step={1}
        onEdit={onEdit}
        rows={[
          {
            term: "Rodzaj",
            value: data.glazingTypes.map(labelOf.glazing).join(", ") || "nie wybrano",
          },
          {
            term: "Liczba",
            value: data.quantity === null ? "trudno określić" : String(data.quantity),
          },
          { term: "Rozmiar", value: data.size ? labelOf.size(data.size) : "nie wybrano" },
        ]}
      />

      <Block
        title="Dodatkowe usługi"
        step={2}
        onEdit={onEdit}
        rows={[
          {
            term: "Zakres",
            value:
              data.additionalServices.length === 0 || data.additionalServices.includes("brak")
                ? "samo mycie szyb"
                : data.additionalServices.map(labelOf.extra).join(", "),
          },
        ]}
      />

      <Block title="Kontakt" step={3} onEdit={onEdit} rows={contactRows} />
    </div>
  );
}
