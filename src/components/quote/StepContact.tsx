import { Building2, User } from "lucide-react";
import { FieldError, SelectCard, TextAreaField, TextField } from "./Controls";
import { PhotoUpload } from "./PhotoUpload";
import { formatPhone, formatPostalCode } from "../../lib/validation";
import type { AudienceType, FieldErrors, QuoteData } from "./types";
import { cn } from "../../lib/cn";

type Props = {
  data: QuoteData;
  update: (patch: Partial<QuoteData>) => void;
  errors: FieldErrors;
};

export function StepContact({ data, update, errors }: Props) {
  const isCompany = data.audience === "firma";

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="text-[0.8125rem] font-semibold text-ink">Zamawiam jako</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <SelectCard
            name="audience"
            value="prywatny"
            checked={data.audience === "prywatny"}
            onChange={() => update({ audience: "prywatny" as AudienceType })}
            title="Osoba prywatna"
            icon={User}
          />
          <SelectCard
            name="audience"
            value="firma"
            checked={data.audience === "firma"}
            onChange={() => update({ audience: "firma" as AudienceType })}
            title="Firma"
            icon={Building2}
          />
        </div>
      </fieldset>

      <div className="grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
        <TextField
          label={isCompany ? "Nazwa firmy" : "Imię"}
          name="name"
          autoComplete={isCompany ? "organization" : "given-name"}
          placeholder={isCompany ? "Nazwa firmy lub lokalu" : "Jak się do Ciebie zwracać"}
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          error={errors.name}
          required
        />

        <TextField
          label={isCompany ? "Osoba kontaktowa" : "Nazwa firmy"}
          name="company"
          autoComplete={isCompany ? "name" : "organization"}
          placeholder={isCompany ? "Imię i nazwisko" : "Jeśli wystawiamy fakturę"}
          value={data.company}
          onChange={(e) => update({ company: e.target.value })}
          optional
        />

        <TextField
          label="Telefon"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="501 234 567"
          value={data.phone}
          onChange={(e) => update({ phone: formatPhone(e.target.value) })}
          error={errors.phone}
          required
        />

        <TextField
          label="E-mail"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="adres@poczta.pl"
          value={data.email}
          onChange={(e) => update({ email: e.target.value })}
          error={errors.email}
          required
        />

        <TextField
          label="Kod pocztowy"
          name="postalCode"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00-000"
          maxLength={6}
          value={data.postalCode}
          onChange={(e) => update({ postalCode: formatPostalCode(e.target.value) })}
          error={errors.postalCode}
          optional
        />

        <TextField
          label="Miejscowość"
          name="city"
          autoComplete="address-level2"
          placeholder="Gdzie realizujemy usługę"
          value={data.city}
          onChange={(e) => update({ city: e.target.value })}
          error={errors.city}
          required
        />
      </div>

      <TextAreaField
        label="Uwagi"
        name="notes"
        placeholder="Piętro, dostęp do okien, preferowany termin, cokolwiek co ma znaczenie."
        value={data.notes}
        onChange={(e) => update({ notes: e.target.value })}
        optional
      />

      <div className="border-t border-line pt-6">
        <PhotoUpload photos={data.photos} onChange={(photos) => update({ photos })} />
      </div>

      <div className="border-t border-line pt-6">
        <label
          className={cn(
            "flex cursor-pointer gap-3 rounded-control p-3 transition-colors hover:bg-surface-inset",
            errors.consent && "bg-danger-soft hover:bg-danger-soft",
          )}
        >
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => update({ consent: e.target.checked })}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 rounded-[6px] border-2 border-line-strong accent-accent"
            required
          />
          <span className="text-[0.8125rem] leading-relaxed text-ink-soft">
            Zgadzam się na kontakt w sprawie tego zapytania i na przetwarzanie podanych danych w
            celu przygotowania wyceny. Szczegóły w{" "}
            <a href="/polityka-prywatnosci" className="font-semibold text-accent underline underline-offset-2">
              polityce prywatności
            </a>
            .
          </span>
        </label>
        <FieldError id="consent-error">{errors.consent}</FieldError>
      </div>
    </div>
  );
}
