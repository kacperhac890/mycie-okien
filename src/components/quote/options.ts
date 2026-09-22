import {
  Building,
  Columns2,
  Home,
  Layers,
  Maximize,
  Minus,
  PanelsTopLeft,
  Scaling,
  Slash,
  Sparkles,
  Store,
  Timer,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ExtraKey, GlazingType, ServiceType, SizeKey } from "./types";

export const STEPS = [
  { key: "usluga", label: "Rodzaj usługi" },
  { key: "przeszklenia", label: "Przeszklenia" },
  { key: "dodatki", label: "Dodatkowe usługi" },
  { key: "kontakt", label: "Kontakt" },
  { key: "podsumowanie", label: "Podsumowanie" },
] as const;

export const SERVICE_TYPES: {
  value: ServiceType;
  title: string;
  body: string;
  icon: LucideIcon;
}[] = [
  {
    value: "prywatny",
    title: "Mycie prywatne",
    body: "Domy, mieszkania, ogrody zimowe.",
    icon: Home,
  },
  {
    value: "komercyjny",
    title: "Mycie komercyjne",
    body: "Biura, sklepy, witryny i duże obiekty.",
    icon: Store,
  },
];

export const GLAZING_TYPES: {
  value: GlazingType;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "standardowe", label: "Standardowe okna", icon: PanelsTopLeft },
  { value: "witryny", label: "Witryny sklepowe", icon: Store },
  { value: "fasady", label: "Szklane fasady", icon: Building },
  { value: "ogrody", label: "Ogrody zimowe", icon: Wind },
];

export const SIZES: { value: SizeKey; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "male", label: "Małe okna", hint: "do ok. 1 m²", icon: Minus },
  { value: "srednie", label: "Średnie okna", hint: "ok. 1-2 m²", icon: Columns2 },
  { value: "duze", label: "Duże przeszklenia", hint: "ok. 2-3 m²", icon: Maximize },
  { value: "witryny3m", label: "Witryny powyżej 3 m²", hint: "tafle sklepowe", icon: Scaling },
];

export const EXTRAS: { value: ExtraKey; label: string; hint: string; icon: LucideIcon }[] = [
  {
    value: "ramy",
    label: "Mycie ram i żaluzji / rolet",
    hint: "Ramy, skrzynki rolet, parapety.",
    icon: Layers,
  },
  {
    value: "wysokosc",
    label: "Mycie na wysokościach",
    hint: "Myjka teleskopowa lub podnośnik.",
    icon: Scaling,
  },
  {
    value: "alpinistyczne",
    label: "Prace alpinistyczne",
    hint: "Dostęp linowy na elewacji.",
    icon: Slash,
  },
  {
    value: "ekspres",
    label: "Ekspresowa realizacja",
    hint: "Najbliższy możliwy termin.",
    icon: Timer,
  },
  {
    value: "brak",
    label: "Nie potrzebuję dodatkowych usług",
    hint: "Samo mycie szyb.",
    icon: Sparkles,
  },
];

/* Etykiety używane w podsumowaniu i w treści zapytania. */
export const labelOf = {
  serviceType: (v: ServiceType) => SERVICE_TYPES.find((o) => o.value === v)?.title ?? "",
  glazing: (v: GlazingType) => GLAZING_TYPES.find((o) => o.value === v)?.label ?? "",
  size: (v: SizeKey) => SIZES.find((o) => o.value === v)?.label ?? "",
  extra: (v: ExtraKey) => EXTRAS.find((o) => o.value === v)?.label ?? "",
};
