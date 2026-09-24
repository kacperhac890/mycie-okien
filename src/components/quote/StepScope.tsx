import { SERVICE_OPTIONS } from "./options";
import { FieldError, SelectCard } from "./Controls";
import type { FieldErrors, QuoteData, ServiceId } from "./types";

type Props = {
  data: QuoteData;
  update: (patch: Partial<QuoteData>) => void;
  errors: FieldErrors;
};

export function StepScope({ data, update, errors }: Props) {
  function toggle(value: ServiceId) {
    const next = data.services.includes(value)
      ? data.services.filter((v) => v !== value)
      : [...data.services, value];
    update({ services: next });
  }

  return (
    <fieldset>
      <legend className="sr-only">Zakres zlecenia</legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICE_OPTIONS.map((option) => (
          <SelectCard
            key={option.value}
            type="checkbox"
            name="services"
            value={option.value}
            checked={data.services.includes(option.value)}
            onChange={() => toggle(option.value)}
            title={option.label}
            body={option.hint}
            icon={option.icon}
          />
        ))}
      </div>

      <FieldError>{errors.services}</FieldError>

      <p className="body-text mt-5 text-[0.875rem]">
        Możesz zaznaczyć kilka usług naraz. O szczegóły każdej zapytamy w następnym kroku.
      </p>
    </fieldset>
  );
}
