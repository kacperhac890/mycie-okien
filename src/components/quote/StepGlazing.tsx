import { GLAZING_TYPES, SIZES } from "./options";
import { FieldError, NumberStepper, SelectCard } from "./Controls";
import type { FieldErrors, GlazingType, QuoteData, SizeKey } from "./types";

type Props = {
  data: QuoteData;
  update: (patch: Partial<QuoteData>) => void;
  errors: FieldErrors;
};

export function StepGlazing({ data, update, errors }: Props) {
  const unknown = data.quantity === null;

  function toggleGlazing(value: GlazingType) {
    const next = data.glazingTypes.includes(value)
      ? data.glazingTypes.filter((v) => v !== value)
      : [...data.glazingTypes, value];
    update({ glazingTypes: next });
  }

  return (
    <div className="flex flex-col gap-8">
      <fieldset>
        <legend className="text-[0.8125rem] font-semibold text-ink">
          Rodzaj przeszkleń
          <span className="ml-1.5 font-medium text-ink-faint">(można zaznaczyć kilka)</span>
        </legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {GLAZING_TYPES.map((option) => (
            <SelectCard
              key={option.value}
              type="checkbox"
              name="glazingTypes"
              value={option.value}
              checked={data.glazingTypes.includes(option.value)}
              onChange={() => toggleGlazing(option.value)}
              title={option.label}
              icon={option.icon}
            />
          ))}
        </div>

        <FieldError>{errors.glazingTypes}</FieldError>
      </fieldset>

      <div className="border-t border-line pt-8">
        <span className="text-[0.8125rem] font-semibold text-ink">Liczba szyb lub witryn</span>
        <p className="body-text mt-1.5 text-[0.8125rem]">
          Nie wiesz, ile masz szyb? Nie szkodzi, podaj orientacyjną liczbę.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <NumberStepper
            id="ilosc-szyb"
            label="Liczba szyb lub witryn"
            value={data.quantity ?? 10}
            onChange={(next) => update({ quantity: next })}
            min={1}
            max={500}
            disabled={unknown}
          />

          <label className="flex cursor-pointer items-center gap-2.5 text-[0.9375rem] font-medium text-ink">
            <input
              type="checkbox"
              checked={unknown}
              onChange={(e) => update({ quantity: e.target.checked ? null : 10 })}
              className="h-5 w-5 shrink-0 rounded-[6px] border-2 border-line-strong accent-accent"
            />
            Nie wiem / trudno określić
          </label>
        </div>

        <FieldError>{errors.quantity}</FieldError>
      </div>

      <fieldset className="border-t border-line pt-8">
        <legend className="text-[0.8125rem] font-semibold text-ink">Orientacyjny rozmiar</legend>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {SIZES.map((option) => (
            <SelectCard
              key={option.value}
              name="size"
              value={option.value}
              checked={data.size === option.value}
              onChange={() => update({ size: option.value as SizeKey })}
              title={option.label}
              body={option.hint}
              icon={option.icon}
            />
          ))}
        </div>

        <FieldError>{errors.size}</FieldError>
      </fieldset>
    </div>
  );
}
