import { AlertTriangle } from "lucide-react";
import { formatAddress, isUnset } from "../../content/types";
import type { CompanyInfo } from "../../content/types";
import { TextField } from "../ui/Field";
import { isValidEmail, isValidPhone, isValidPostalCode } from "../../lib/validation";

type Props = {
  company: CompanyInfo;
  onChange: (next: CompanyInfo) => void;
};

function Group({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-5 sm:p-6">
      <h3 className="text-[0.9375rem] font-bold text-ink">{title}</h3>
      <p className="body-text mt-1.5 max-w-[62ch] text-[0.8125rem]">{description}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function CompanyEditor({ company, onChange }: Props) {
  const set = (key: keyof CompanyInfo) => (value: string) =>
    onChange({ ...company, [key]: value });

  const unfilled = (Object.keys(company) as (keyof CompanyInfo)[]).filter(
    (key) => key !== "dpo" && isUnset(company[key]),
  );

  /* Walidacja tylko podpowiada. Nie blokujemy zapisu, bo pola celowo mogą
     zostać w formie placeholdera, dopóki dane nie są znane. */
  const emailError =
    isUnset(company.email) || isValidEmail(company.email)
      ? undefined
      : "Sprawdź adres, brakuje znaku @ albo domeny.";
  const phoneError =
    isUnset(company.phone) || isValidPhone(company.phone)
      ? undefined
      : "Numer powinien mieć 9 cyfr, np. 501 234 567.";
  const postalError =
    isUnset(company.postalCode) || isValidPostalCode(company.postalCode)
      ? undefined
      : "Kod pocztowy w formacie 00-000.";

  return (
    <div>
      <div className="max-w-[60ch]">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">Dane firmy</h2>
        <p className="body-text mt-2 text-[0.875rem]">
          Te pola wypełniają nagłówek, stopkę, formularz wyceny oraz dokumenty prawne. Wartości w
          nawiasach kwadratowych to placeholdery, które widać na stronie, dopóki ich nie zmienisz.
        </p>
      </div>

      {unfilled.length > 0 ? (
        <p className="mt-5 flex items-start gap-2.5 rounded-control border border-line bg-surface-inset px-4 py-3 text-[0.8125rem] text-ink">
          <AlertTriangle className="mt-px h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <span>
            Do uzupełnienia: <strong>{unfilled.length}</strong>{" "}
            {unfilled.length === 1 ? "pole" : "pól"}. Dopóki zostają w nawiasach kwadratowych, widzą
            je odwiedzający stronę.
          </span>
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-5">
        <Group
          title="Podstawowe"
          description="Nazwa pojawia się w logo, tytule strony i stopce."
        >
          <TextField
            label="Nazwa firmy"
            value={company.name}
            onChange={(e) => set("name")(e.target.value)}
            wrapClassName="sm:col-span-2"
          />
        </Group>

        <Group
          title="Kontakt"
          description="Numer telefonu jest jednocześnie odnośnikiem do dzwonienia, więc wystarczy wpisać go w czytelnej formie."
        >
          <TextField
            label="Telefon"
            value={company.phone}
            error={phoneError}
            placeholder="501 234 567"
            onChange={(e) => set("phone")(e.target.value)}
          />
          <TextField
            label="E-mail"
            value={company.email}
            error={emailError}
            placeholder="kontakt@twojadomena.pl"
            onChange={(e) => set("email")(e.target.value)}
          />
        </Group>

        <Group
          title="Obszar działania"
          description="Widoczne w stopce. Przyda się też później, gdyby doszły podstrony dla poszczególnych miast."
        >
          <TextField
            label="Obszar"
            placeholder="np. Szczecin i okolice"
            value={company.area}
            onChange={(e) => set("area")(e.target.value)}
          />
          <TextField
            label="Doprecyzowanie zasięgu"
            placeholder="np. do 40 km od Szczecina"
            value={company.areaDetail}
            onChange={(e) => set("areaDetail")(e.target.value)}
          />
        </Group>

        <Group
          title="Dane rejestrowe"
          description={`Trafiają do stopki i polityki prywatności. Adres w jednej linii: ${
            formatAddress(company) || "brak"
          }`}
        >
          <TextField
            label="Pełna nazwa działalności"
            placeholder="np. Jan Kowalski Myjemy Okna"
            value={company.legalEntity}
            onChange={(e) => set("legalEntity")(e.target.value)}
            wrapClassName="sm:col-span-2"
          />
          <TextField
            label="NIP"
            placeholder="NIP 000-000-00-00"
            value={company.nip}
            onChange={(e) => set("nip")(e.target.value)}
          />
          <TextField
            label="Ulica i numer"
            placeholder="ul. Przykładowa 1"
            value={company.street}
            onChange={(e) => set("street")(e.target.value)}
          />
          <TextField
            label="Kod pocztowy"
            placeholder="00-000"
            value={company.postalCode}
            error={postalError}
            onChange={(e) => set("postalCode")(e.target.value)}
          />
          <TextField
            label="Miejscowość"
            placeholder="Szczecin"
            value={company.city}
            onChange={(e) => set("city")(e.target.value)}
          />
        </Group>

        <Group
          title="Dokumenty prawne"
          description="Pola używane w polityce prywatności. Wpisuj tylko podmioty, z których naprawdę korzystasz."
        >
          <TextField
            label="Data aktualizacji polityk"
            placeholder="DD.MM.RRRR"
            value={company.legalUpdated}
            onChange={(e) => set("legalUpdated")(e.target.value)}
          />
          <TextField
            label="Przechowywanie zapytań"
            placeholder="np. 12 miesięcy"
            value={company.retention}
            onChange={(e) => set("retention")(e.target.value)}
          />
          <TextField
            label="Dostawca hostingu"
            value={company.hosting}
            onChange={(e) => set("hosting")(e.target.value)}
          />
          <TextField
            label="Dostawca poczty e-mail"
            value={company.mailProvider}
            onChange={(e) => set("mailProvider")(e.target.value)}
          />
          <TextField
            label="Biuro rachunkowe"
            value={company.accounting}
            onChange={(e) => set("accounting")(e.target.value)}
          />
          <TextField
            label="Inspektor ochrony danych"
            optional
            hint="Zostaw puste, jeżeli nie masz obowiązku wyznaczenia IOD."
            value={company.dpo}
            onChange={(e) => set("dpo")(e.target.value)}
          />
        </Group>
      </div>
    </div>
  );
}
