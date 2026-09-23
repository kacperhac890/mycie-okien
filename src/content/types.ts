/* ==================================================================
   MODEL TREŚCI EDYTOWALNYCH Z PANELU

   Wszystko, co da się zmienić bez dotykania kodu, opisuje jeden obiekt
   `SiteContent`. Strona startuje z wartościami domyślnymi wbudowanymi
   w kod, a potem dociąga `content.json` z serwera, jeśli istnieje.
   ================================================================== */

export type ImageKey = "hero" | "work" | "privateClient" | "commercialClient" | "quality";

export type ManagedImage = {
  /** Pełny adres URL albo ścieżka względna wobec katalogu strony, np. "media/hero.jpg". */
  src: string;
  alt: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  meta: string;
  /** 1-5 albo null, gdy oceny nie podajemy. */
  rating: number | null;
  /** true = karta jest wyraźnie oznaczona jako miejsce do uzupełnienia. */
  isPlaceholder: boolean;
};

export type Realization = {
  id: string;
  title: string;
  meta: string;
  summary: string;
  before: ManagedImage;
  after: ManagedImage;
  /** Kafel na całą szerokość siatki. */
  featured: boolean;
};

/** Dane firmy. Wszystko, co dotąd było placeholderem w kodzie. */
export type CompanyInfo = {
  name: string;
  /** Numer w formie wyświetlanej. Odnośnik tel: wyliczamy z cyfr. */
  phone: string;
  email: string;
  /** Obszar działania, np. „Szczecin i okolice”. */
  area: string;
  /** Doprecyzowanie zasięgu, np. „do 40 km od Szczecina”. */
  areaDetail: string;
  /** Pełna nazwa działalności do stopki i dokumentów prawnych. */
  legalEntity: string;
  nip: string;
  street: string;
  postalCode: string;
  city: string;
  /** Data ostatniej aktualizacji polityk, w formacie DD.MM.RRRR. */
  legalUpdated: string;
  /* Podmioty wymienione w polityce prywatności jako odbiorcy danych. */
  hosting: string;
  mailProvider: string;
  accounting: string;
  /** Jak długo trzymamy zapytania bez zlecenia, np. „12 miesięcy”. */
  retention: string;
  /** Inspektor ochrony danych. Puste = sekcja się nie pokazuje. */
  dpo: string;
};

export type FaqItem = {
  id: string;
  q: string;
  a: string;
};

export type SiteContent = {
  /** Podnoszona przy zmianie kształtu danych, do odrzucania starych wersji. */
  schema: number;
  updatedAt: string;
  company: CompanyInfo;
  testimonials: Testimonial[];
  images: Record<ImageKey, ManagedImage>;
  gallery: Realization[];
  faq: FaqItem[];
};

export const CONTENT_SCHEMA = 2;

/** Pole wciąż nieuzupełnione, czyli zostawione w nawiasach kwadratowych. */
export function isUnset(value: string) {
  const trimmed = value.trim();
  return trimmed.length === 0 || trimmed.startsWith("[");
}

/** Odnośnik tel: wyliczany z wpisanego numeru. */
export function phoneHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "tel:";
  if (digits.length === 9) return `tel:+48${digits}`;
  return `tel:+${digits}`;
}

/** Adres w jednej linii, z pominięciem pustych części. */
export function formatAddress(company: { street: string; postalCode: string; city: string }) {
  const locality = [company.postalCode, company.city].filter((p) => p.trim()).join(" ");
  return [company.street, locality].filter((p) => p.trim()).join(", ");
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
