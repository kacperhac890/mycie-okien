import type { ServiceId } from "../../data/site";

export type { ServiceId };

/** Kto zamawia. Wpływa tylko na etykiety w kroku kontaktowym. */
export type AudienceType = "prywatny" | "firma";

/* Szczegóły są rozdzielone per usługa. Płaski obiekt zamiast zagnieżdżeń,
   bo dzięki temu walidacja, podsumowanie i wysyłka czytają jedno miejsce,
   a niewypełnione pola po prostu nie trafiają do zapytania. */

export type GlazingType = "standardowe" | "witryny" | "fasady" | "ogrody";
export type SizeKey = "male" | "srednie" | "duze" | "witryny3m";
export type FacadeKey = "tynk" | "klinkier" | "szklana" | "panel";
export type PestPlaceKey = "mieszkanie" | "lokal" | "gastronomia" | "magazyn";
export type PestModeKey = "jednorazowo" | "stala";
export type MoveSizeKey = "kawalerka" | "mieszkanie" | "dom" | "biuro" | "pojedyncze";
export type MoveExtraKey = "pakowanie" | "wnoszenie" | "demontaz" | "przechowanie";
export type WasteKey = "gruz" | "meble" | "agd" | "mieszane" | "oproznienie";
export type WasteAmountKey = "bagaznik" | "przyczepa" | "kontener" | "nie-wiem";
export type TyreKey = "osobowe" | "dostawcze" | "ciezarowe" | "przemyslowe";
export type ExtraKey =
  | "ramy"
  | "wysokosc"
  | "alpinistyczne"
  | "ekspres"
  | "poza-godzinami"
  | "cyklicznie"
  | "faktura"
  | "brak";

export type QuotePhoto = {
  id: string;
  file: File;
  /** Object URL podglądu. Zwalniany przy usuwaniu i przy odmontowaniu. */
  url: string;
};

export type QuoteData = {
  services: ServiceId[];

  /* mycie okien */
  glazingTypes: GlazingType[];
  /** null oznacza „nie wiem / trudno określić”. */
  quantity: number | null;
  size: SizeKey | null;

  /* mycie elewacji */
  facadeType: FacadeKey | null;
  facadeArea: string;
  facadeFloors: string;

  /* deratyzacja */
  pestPlace: PestPlaceKey | null;
  pestArea: string;
  pestMode: PestModeKey | null;

  /* przeprowadzki */
  moveFrom: string;
  moveTo: string;
  moveSize: MoveSizeKey | null;
  moveExtras: MoveExtraKey[];

  /* utylizacja odpadów */
  wasteTypes: WasteKey[];
  wasteAmount: WasteAmountKey | null;

  /* utylizacja opon */
  tyreCount: number;
  tyreTypes: TyreKey[];
  tyreOnRims: boolean;

  /* wspólne */
  additionalServices: ExtraKey[];
  audience: AudienceType;
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
  services: [],

  glazingTypes: [],
  quantity: 10,
  size: null,

  facadeType: null,
  facadeArea: "",
  facadeFloors: "",

  pestPlace: null,
  pestArea: "",
  pestMode: null,

  moveFrom: "",
  moveTo: "",
  moveSize: null,
  moveExtras: [],

  wasteTypes: [],
  wasteAmount: null,

  tyreCount: 4,
  tyreTypes: [],
  tyreOnRims: false,

  additionalServices: [],
  audience: "prywatny",
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

/** Czy wybrano którąkolwiek z usług mycia. Decyduje o dodatkach w kroku 3. */
export function hasWashing(services: ServiceId[]) {
  return services.includes("mycie-okien") || services.includes("mycie-elewacji");
}
