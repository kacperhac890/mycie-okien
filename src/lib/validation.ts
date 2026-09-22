import type { FieldErrors, QuoteData } from "../components/quote/types";

/* Walidacja jest świadomie łagodna: blokuje tylko to, bez czego nie da się
   przygotować wyceny ani oddzwonić. Komunikaty mówią, co zrobić, a nie że
   „pole jest nieprawidłowe”. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

export function normalizePhone(value: string) {
  return value.replace(/[\s()-]/g, "");
}

export function isValidPhone(value: string) {
  const v = normalizePhone(value);
  // 9 cyfr krajowych, opcjonalny prefiks +48 lub 0048.
  return /^(\+48|0048)?\d{9}$/.test(v);
}

export function isValidEmail(value: string) {
  return EMAIL_RE.test(value.trim());
}

export function isValidPostalCode(value: string) {
  return /^\d{2}-\d{3}$/.test(value.trim());
}

/** Formatuje kod pocztowy w trakcie pisania: 70100 -> 70-100 */
export function formatPostalCode(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 5);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}

/** Formatuje telefon w trakcie pisania: 501234567 -> 501 234 567 */
export function formatPhone(value: string) {
  const plus = value.trimStart().startsWith("+");
  const digits = value.replace(/\D/g, "").slice(0, plus ? 11 : 9);
  if (plus) {
    const rest = digits.slice(2);
    const groups = rest.match(/.{1,3}/g) ?? [];
    return `+${digits.slice(0, 2)}${groups.length ? " " + groups.join(" ") : ""}`;
  }
  return (digits.match(/.{1,3}/g) ?? []).join(" ");
}

export function validateStep(step: number, data: QuoteData): FieldErrors {
  const errors: FieldErrors = {};

  if (step === 0 && !data.serviceType) {
    errors.serviceType = "Wybierz rodzaj usługi, żeby przejść dalej.";
  }

  if (step === 1) {
    if (data.glazingTypes.length === 0) {
      errors.glazingTypes = "Zaznacz przynajmniej jeden rodzaj przeszkleń.";
    }
    if (data.quantity !== null && data.quantity < 1) {
      errors.quantity = "Podaj co najmniej 1 albo zaznacz „Nie wiem”.";
    }
    if (!data.size) {
      errors.size = "Wybierz orientacyjny rozmiar. To wystarczy do wstępnej wyceny.";
    }
  }

  if (step === 3) {
    if (data.name.trim().length < 2) {
      errors.name = "Podaj imię lub nazwę firmy.";
    }
    if (!data.phone.trim()) {
      errors.phone = "Podaj numer telefonu, żebyśmy mogli oddzwonić.";
    } else if (!isValidPhone(data.phone)) {
      errors.phone = "Numer powinien mieć 9 cyfr, np. 501 234 567.";
    }
    if (!data.email.trim()) {
      errors.email = "Podaj adres e-mail, wyślemy na niego wycenę.";
    } else if (!isValidEmail(data.email)) {
      errors.email = "Sprawdź adres, brakuje znaku @ albo domeny.";
    }
    if (data.postalCode.trim() && !isValidPostalCode(data.postalCode)) {
      errors.postalCode = "Kod pocztowy w formacie 00-000.";
    }
    if (!data.city.trim()) {
      errors.city = "Podaj miejscowość realizacji.";
    }
    if (!data.consent) {
      errors.consent = "Potrzebujemy zgody na kontakt w sprawie wyceny.";
    }
  }

  return errors;
}
