export type ServiceType = "prywatny" | "komercyjny";
export type GlazingType = "standardowe" | "witryny" | "fasady" | "ogrody";
export type SizeKey = "male" | "srednie" | "duze" | "witryny3m";
export type ExtraKey = "ramy" | "wysokosc" | "alpinistyczne" | "ekspres" | "brak";

export type QuotePhoto = {
  id: string;
  file: File;
  /** Object URL podglądu. Zwalniany przy usuwaniu i przy odmontowaniu. */
  url: string;
};

/** Model danych zapytania. Jeden kształt dla formularza, podsumowania i wysyłki. */
export type QuoteData = {
  serviceType: ServiceType | null;
  glazingTypes: GlazingType[];
  /** null oznacza „nie wiem / trudno określić”. */
  quantity: number | null;
  size: SizeKey | null;
  additionalServices: ExtraKey[];
  name: string;
  company: string;
  phone: string;
  email: string;
  postalCode: string;
  city: string;
  notes: string;
  consent: boolean;
  photos: QuotePhoto[];
};

export const emptyQuote: QuoteData = {
  serviceType: null,
  glazingTypes: [],
  quantity: 10,
  size: null,
  additionalServices: [],
  name: "",
  company: "",
  phone: "",
  email: "",
  postalCode: "",
  city: "",
  notes: "",
  consent: false,
  photos: [],
};

export type FieldErrors = Partial<Record<string, string>>;
