import { EXTRAS } from "./options";
import { SelectCard } from "./Controls";
import type { ExtraKey, QuoteData } from "./types";

type Props = {
  data: QuoteData;
  update: (patch: Partial<QuoteData>) => void;
};

export function StepExtras({ data, update }: Props) {
  /* „Nie potrzebuję dodatkowych usług” wyklucza się z resztą: zaznaczenie
     go czyści pozostałe i odwrotnie. */
  function toggle(value: ExtraKey) {
    if (value === "brak") {
      update({ additionalServices: data.additionalServices.includes("brak") ? [] : ["brak"] });
      return;
    }

    const withoutNone = data.additionalServices.filter((v) => v !== "brak");
    const next = withoutNone.includes(value)
      ? withoutNone.filter((v) => v !== value)
      : [...withoutNone, value];
    update({ additionalServices: next });
  }

  return (
    <fieldset>
      <legend className="sr-only">Dodatkowe usługi</legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {EXTRAS.filter((o) => o.value !== "brak").map((option) => (
          <SelectCard
            key={option.value}
            type="checkbox"
            name="additionalServices"
            value={option.value}
            checked={data.additionalServices.includes(option.value)}
            onChange={() => toggle(option.value)}
            title={option.label}
            body={option.hint}
            icon={option.icon}
          />
        ))}
      </div>

      <div className="mt-3">
        {EXTRAS.filter((o) => o.value === "brak").map((option) => (
          <SelectCard
            key={option.value}
            type="checkbox"
            name="additionalServices"
            value={option.value}
            checked={data.additionalServices.includes(option.value)}
            onChange={() => toggle(option.value)}
            title={option.label}
            icon={option.icon}
          />
        ))}
      </div>
    </fieldset>
  );
}
