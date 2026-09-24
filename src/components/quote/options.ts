import {
  Armchair,
  Boxes,
  Building,
  Building2,
  Columns2,
  Container,
  FileText,
  Home,
  Layers,
  Maximize,
  Minus,
  Moon,
  PackageOpen,
  PanelsTopLeft,
  Repeat,
  Scaling,
  Slash,
  Sofa,
  Sparkles,
  Store,
  Timer,
  Truck,
  Utensils,
  Warehouse,
  Wind,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { services } from "../../data/site";
import type {
  ExtraKey,
  FacadeKey,
  GlazingType,
  MoveExtraKey,
  MoveSizeKey,
  PestModeKey,
  PestPlaceKey,
  ServiceId,
  SizeKey,
  TyreKey,
  WasteAmountKey,
  WasteKey,
} from "./types";

export const STEPS = [
  { key: "zakres", label: "Zakres" },
  { key: "szczegoly", label: "Szczegóły" },
  { key: "dodatki", label: "Dodatki i termin" },
  { key: "kontakt", label: "Kontakt" },
  { key: "podsumowanie", label: "Podsumowanie" },
] as const;

type Option<T extends string> = { value: T; label: string; hint?: string; icon?: LucideIcon };

/** Karty wyboru usług biorą nazwy z katalogu, żeby nie rozjechać się z ofertą. */
export const SERVICE_OPTIONS: Option<ServiceId>[] = services.items.map((service) => ({
  value: service.id,
  label: service.name,
  hint: service.lead,
  icon: service.icon,
}));

export const GLAZING_TYPES: Option<GlazingType>[] = [
  { value: "standardowe", label: "Standardowe okna", icon: PanelsTopLeft },
  { value: "witryny", label: "Witryny sklepowe", icon: Store },
  { value: "fasady", label: "Szklane fasady", icon: Building },
  { value: "ogrody", label: "Ogrody zimowe", icon: Wind },
];

export const SIZES: Option<SizeKey>[] = [
  { value: "male", label: "Małe okna", hint: "do ok. 1 m²", icon: Minus },
  { value: "srednie", label: "Średnie okna", hint: "ok. 1-2 m²", icon: Columns2 },
  { value: "duze", label: "Duże przeszklenia", hint: "ok. 2-3 m²", icon: Maximize },
  { value: "witryny3m", label: "Witryny powyżej 3 m²", hint: "tafle sklepowe", icon: Scaling },
];

export const FACADE_TYPES: Option<FacadeKey>[] = [
  { value: "tynk", label: "Tynk", hint: "elewacja malowana lub strukturalna", icon: Layers },
  { value: "klinkier", label: "Klinkier lub kamień", hint: "cegła, płytki, cokoły", icon: Building2 },
  { value: "szklana", label: "Szklana fasada", hint: "przeszklenia i witryny", icon: Building },
  { value: "panel", label: "Panel lub blacha", hint: "hale i obiekty przemysłowe", icon: Warehouse },
];

export const PEST_PLACES: Option<PestPlaceKey>[] = [
  { value: "mieszkanie", label: "Mieszkanie lub dom", icon: Home },
  { value: "lokal", label: "Lokal usługowy", icon: Store },
  { value: "gastronomia", label: "Gastronomia", hint: "kuchnia, zaplecze", icon: Utensils },
  { value: "magazyn", label: "Magazyn lub piwnica", icon: Warehouse },
];

export const PEST_MODES: Option<PestModeKey>[] = [
  { value: "jednorazowo", label: "Jednorazowa interwencja", icon: Timer },
  { value: "stala", label: "Stały nadzór", hint: "cykliczne kontrole", icon: Repeat },
];

export const MOVE_SIZES: Option<MoveSizeKey>[] = [
  { value: "kawalerka", label: "Kawalerka", icon: Home },
  { value: "mieszkanie", label: "Mieszkanie 2-4 pokoje", icon: Sofa },
  { value: "dom", label: "Dom", icon: Building2 },
  { value: "biuro", label: "Biuro lub lokal", icon: Building },
  { value: "pojedyncze", label: "Pojedyncze meble", hint: "jedna lub kilka sztuk", icon: Armchair },
];

export const MOVE_EXTRAS: Option<MoveExtraKey>[] = [
  { value: "pakowanie", label: "Pakowanie", hint: "kartony i zabezpieczenie", icon: PackageOpen },
  { value: "wnoszenie", label: "Wnoszenie i znoszenie", hint: "piętra bez windy", icon: Boxes },
  { value: "demontaz", label: "Demontaż i montaż mebli", icon: Wrench },
  { value: "przechowanie", label: "Tymczasowe przechowanie", icon: Warehouse },
];

export const WASTE_TYPES: Option<WasteKey>[] = [
  { value: "gruz", label: "Gruz i odpady budowlane", icon: Container },
  { value: "meble", label: "Meble", icon: Sofa },
  { value: "agd", label: "Sprzęt AGD i elektronika", icon: Wrench },
  { value: "mieszane", label: "Odpady mieszane", icon: Boxes },
  { value: "oproznienie", label: "Opróżnienie całego lokalu", icon: Home },
];

export const WASTE_AMOUNTS: Option<WasteAmountKey>[] = [
  { value: "bagaznik", label: "Do bagażnika", hint: "kilka worków", icon: PackageOpen },
  { value: "przyczepa", label: "Przyczepa lub bus", hint: "ok. 3-6 m³", icon: Truck },
  { value: "kontener", label: "Kontener", hint: "powyżej 6 m³", icon: Container },
  { value: "nie-wiem", label: "Trudno określić", hint: "ustalimy na miejscu", icon: Minus },
];

export const TYRE_TYPES: Option<TyreKey>[] = [
  { value: "osobowe", label: "Osobowe", icon: Minus },
  { value: "dostawcze", label: "Dostawcze", icon: Truck },
  { value: "ciezarowe", label: "Ciężarowe", icon: Truck },
  { value: "przemyslowe", label: "Przemysłowe", hint: "maszyny, rolnicze", icon: Warehouse },
];

/* Dodatki związane z myciem pokazujemy tylko wtedy, gdy wybrano usługę
   mycia. Reszta dotyczy każdego zlecenia. */
export const WASHING_EXTRAS: Option<ExtraKey>[] = [
  { value: "ramy", label: "Mycie ram i żaluzji / rolet", hint: "Ramy, skrzynki rolet, parapety.", icon: Layers },
  { value: "wysokosc", label: "Praca na wysokościach", hint: "Myjka teleskopowa lub podnośnik.", icon: Scaling },
  { value: "alpinistyczne", label: "Prace alpinistyczne", hint: "Dostęp linowy na elewacji.", icon: Slash },
];

export const GENERAL_EXTRAS: Option<ExtraKey>[] = [
  { value: "ekspres", label: "Ekspresowa realizacja", hint: "Najbliższy możliwy termin.", icon: Timer },
  { value: "poza-godzinami", label: "Poza godzinami pracy", hint: "Wcześnie rano lub po zamknięciu.", icon: Moon },
  { value: "cyklicznie", label: "Stała współpraca", hint: "Powtarzalny cykl, nie jednorazowo.", icon: Repeat },
  { value: "faktura", label: "Faktura VAT", icon: FileText },
];

export const NO_EXTRAS: Option<ExtraKey> = {
  value: "brak",
  label: "Nie potrzebuję dodatków",
  hint: "Sam zakres podstawowy.",
  icon: Sparkles,
};

/* Etykiety do podsumowania i treści zapytania. */
const lookup =
  <T extends string>(options: Option<T>[]) =>
  (value: T) =>
    options.find((o) => o.value === value)?.label ?? value;

export const labelOf = {
  service: lookup(SERVICE_OPTIONS),
  glazing: lookup(GLAZING_TYPES),
  size: lookup(SIZES),
  facade: lookup(FACADE_TYPES),
  pestPlace: lookup(PEST_PLACES),
  pestMode: lookup(PEST_MODES),
  moveSize: lookup(MOVE_SIZES),
  moveExtra: lookup(MOVE_EXTRAS),
  waste: lookup(WASTE_TYPES),
  wasteAmount: lookup(WASTE_AMOUNTS),
  tyre: lookup(TYRE_TYPES),
  extra: lookup([...WASHING_EXTRAS, ...GENERAL_EXTRAS, NO_EXTRAS]),
};
