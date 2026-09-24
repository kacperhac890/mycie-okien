import { GENERAL_EXTRAS, NO_EXTRAS, WASHING_EXTRAS } from "./options";
import { SelectCard } from "./Controls";
import { hasWashing } from "./types";
import type { ExtraKey, QuoteData } from "./types";

type Props = {
  data: QuoteData;
  update: (patch: Partial<QuoteData>) => void;
};

export function StepExtras({ data, update }: Props) {
  /* Dodatki związane z myciem mają sens tylko przy usługach mycia.
     Przy samej przeprowadzce byłyby szumem. */
  const washing = hasWashing(data.services);
  const available = washing ? [...WASHING_EXTRAS, ...GENERAL_EXTRAS] : GENERAL_EXTRAS;

  /* „Nie potrzebuję dodatków” wyklucza się z resztą: zaznaczenie go czyści
     pozostałe i odwrotnie. */
  function toggle(value: ExtraKey) {
    if (value === "brak") {
      update({ additionalServices: data.additionalServices.includes("brak") ? [] : ["brak"] });
      return;
    }

    const withoutNone = data.additionalServices.filter((v) => v !== "brak");
    update({
      additionalServices: withoutNone.includes(value)
        ? withoutNone.filter((v) => v !== value)
        : [...withoutNone, value],
    });
  }

  return (
    <fieldset>
      <legend className="sr-only">Dodatkowe usługi</legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {available.map((option) => (
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
        <SelectCard
          type="checkbox"
          name="additionalServices"
          value={NO_EXTRAS.value}
          checked={data.additionalServices.includes("brak")}
          onChange={() => toggle("brak")}
          title={NO_EXTRAS.label}
          body={NO_EXTRAS.hint}
          icon={NO_EXTRAS.icon}
        />
      </div>
    </fieldset>
  );
}
