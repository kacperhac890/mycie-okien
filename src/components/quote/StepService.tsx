import { SERVICE_TYPES } from "./options";
import { FieldError, SelectCard } from "./Controls";
import type { FieldErrors, QuoteData, ServiceType } from "./types";

type Props = {
  data: QuoteData;
  update: (patch: Partial<QuoteData>) => void;
  errors: FieldErrors;
};

export function StepService({ data, update, errors }: Props) {
  return (
    <fieldset>
      <legend className="sr-only">Rodzaj usługi</legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICE_TYPES.map((option) => (
          <SelectCard
            key={option.value}
            name="serviceType"
            value={option.value}
            checked={data.serviceType === option.value}
            onChange={() => update({ serviceType: option.value as ServiceType })}
            title={option.title}
            body={option.body}
            icon={option.icon}
          />
        ))}
      </div>

      <FieldError>{errors.serviceType}</FieldError>
    </fieldset>
  );
}
