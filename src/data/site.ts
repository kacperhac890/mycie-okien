import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Clock4,
  Disc3,
  Droplets,
  Layers,
  PanelsTopLeft,
  Rat,
  Recycle,
  Ruler,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Truck,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ==================================================================
   TREŚCI STAŁE SEKCJI

   Dane firmy, opinie, realizacje, zdjęcia i FAQ są edytowalne z panelu
   (/admin) i mieszkają w src/content. Tutaj zostają teksty sekcji, które
   opisują sposób pracy i zmieniają się rzadko.
   ================================================================== */

export const nav = [
  { label: "Usługi", href: "#uslugi" },
  { label: "Realizacje", href: "#realizacje" },
  { label: "Dlaczego my", href: "#dlaczego-my" },
  { label: "Opinie", href: "#opinie" },
  { label: "FAQ", href: "#faq" },
] as const;

/** Jedno główne CTA w całym serwisie. */
export const primaryCta = {
  label: "Darmowa wycena",
  href: "#wycena",
} as const;

export const hero = {
  headline: ["Jedna ekipa.", "Cały porządek."],
  lead: "Mycie okien i elewacji, deratyzacja, przeprowadzki oraz utylizacja odpadów i opon. Dla klientów prywatnych i firm.",
  ctaPrimary: { label: "Poproś o wycenę", href: "#wycena" },
  ctaSecondary: { label: "Zobacz usługi", href: "#uslugi" },
} as const;

export const trustPoints: { label: string; icon: LucideIcon }[] = [
  { label: "Ubezpieczenie OC", icon: ShieldCheck },
  { label: "Profesjonalny sprzęt", icon: Wrench },
  { label: "Bezpieczne środki", icon: Droplets },
  { label: "Klienci prywatni i firmy", icon: Building2 },
  { label: "Szybka wycena", icon: Clock4 },
];

export const whyUs = {
  heading: "Dlaczego klienci zostają z nami na dłużej",
  lead: "Większość z nich zaczyna od jednej usługi, a zostaje, bo nie trzeba szukać kolejnej firmy do następnej sprawy. Ten sam kontakt, ten sam standard.",
  items: [
    {
      title: "Profesjonalny sprzęt",
      body: "Osprzęt dobrany do rodzaju przeszklenia, a nie jedna ściereczka do wszystkiego.",
      icon: Wrench,
    },
    {
      title: "Bezpieczeństwo",
      body: "Pracujemy zgodnie z zasadami bezpieczeństwa również przy trudno dostępnych przeszkleniach.",
      icon: ShieldCheck,
    },
    {
      title: "Ubezpieczenie OC",
      body: "Realizacje objęte ubezpieczeniem odpowiedzialności cywilnej.",
      icon: ClipboardList,
    },
    {
      title: "Dokładność",
      body: "Liczy się nie sam fakt umycia, tylko to, jak szyba wygląda pod światło.",
      icon: Ruler,
    },
    {
      title: "Terminowość",
      body: "Szanujemy czas klienta i wcześniej ustalone terminy.",
      icon: CalendarCheck,
    },
  ],
};

export type ServiceId =
  | "mycie-okien"
  | "mycie-elewacji"
  | "deratyzacja"
  | "przeprowadzki"
  | "utylizacja-odpadow"
  | "utylizacja-opon";

export type ServiceDef = {
  id: ServiceId;
  name: string;
  /** Jedno zdanie o tym, czego usługa dotyczy. */
  lead: string;
  /** Zakres w formie krótkich etykiet. */
  items: string[];
  icon: LucideIcon;
  /** Dla kogo, do oznaczenia na karcie. */
  audience: string;
  /* Usługi wyróżnione dostają duży kafel ze zdjęciem. Reszta kompaktowe
     karty z ikoną: sześć równorzędnych kafli robiłoby ścianę bez hierarchii. */
  imageKey?: "serviceWindows" | "serviceFacade";
};

export const services: {
  heading: string;
  lead: string;
  items: ServiceDef[];
} = {
  heading: "Czym się zajmujemy",
  lead: "Zaczynaliśmy od szyb, dziś obsługujemy cały budynek i to, co trzeba z niego wywieźć. Jedno zapytanie, jeden wykonawca, jedna faktura.",
  items: [
    {
      id: "mycie-okien",
      name: "Mycie okien i przeszkleń",
      lead: "Domy, mieszkania, biura i witryny. Jednorazowo albo w stałym cyklu.",
      items: ["Okna i balkony", "Witryny sklepowe", "Ogrody zimowe", "Ramy i rolety"],
      icon: PanelsTopLeft,
      audience: "Klienci prywatni i firmy",
      imageKey: "serviceWindows",
    },
    {
      id: "mycie-elewacji",
      name: "Mycie elewacji",
      lead: "Ciśnieniowe mycie ścian, cokołów i szklanych fasad, z doborem ciśnienia do materiału.",
      items: ["Tynk i klinkier", "Szklane fasady", "Kostka i cokoły", "Usuwanie nalotów"],
      icon: SprayCan,
      audience: "Wspólnoty, firmy, domy",
      imageKey: "serviceFacade",
    },
    {
      id: "deratyzacja",
      name: "Deratyzacja",
      lead: "Lokale usługowe, gastronomia, mieszkania i piwnice. Jednorazowo lub w stałym nadzorze.",
      items: ["Lokale usługowe", "Mieszkania", "Magazyny", "Stały monitoring"],
      icon: Rat,
      audience: "Firmy i mieszkania",
    },
    {
      id: "przeprowadzki",
      name: "Przeprowadzki",
      lead: "Mieszkania, biura i pojedyncze meble. Z pakowaniem albo samym transportem.",
      items: ["Mieszkania", "Biura", "Pakowanie", "Wnoszenie"],
      icon: Truck,
      audience: "Klienci prywatni i firmy",
    },
    {
      id: "utylizacja-odpadow",
      name: "Utylizacja odpadów",
      lead: "Odbiór i wywóz gruzu, mebli, sprzętu i odpadów mieszanych po remoncie lub porządkach.",
      items: ["Gruz i odpady budowlane", "Meble i AGD", "Odpady mieszane", "Opróżnianie lokali"],
      icon: Recycle,
      audience: "Klienci prywatni i firmy",
    },
    {
      id: "utylizacja-opon",
      name: "Utylizacja opon",
      lead: "Odbiór opon osobowych, dostawczych i ciężarowych, także z felgami i w większych partiach.",
      items: ["Osobowe", "Dostawcze", "Ciężarowe", "Odbiór z serwisu"],
      icon: Disc3,
      audience: "Warsztaty, firmy, klienci prywatni",
    },
  ],
};

export const process = {
  heading: "Jak to wygląda od strony klienta",
  steps: [
    {
      n: "01",
      title: "Wyślij zapytanie",
      body: "Krótki formularz. Zdjęcia opcjonalnie, ale pomagają.",
    },
    {
      n: "02",
      title: "Otrzymaj wycenę",
      body: "Odzywamy się z konkretną kwotą i zakresem prac.",
    },
    {
      n: "03",
      title: "Ustalamy termin",
      body: "Dopasowany do Twojego grafiku lub godzin pracy obiektu.",
    },
    {
      n: "04",
      title: "Realizujemy usługę",
      body: "Przychodzimy ze swoim sprzętem i sprzątamy po sobie.",
    },
  ],
};

/* TREŚĆ DO POTWIERDZENIA Z FIRMĄ: poniższe punkty opisują standard pracy.
   Zostaw tylko to, co faktycznie realizujecie. */
export const quality = {
  heading: "Zrobione znaczy posprzątane po sobie",
  lead: "Różnicę między „zrobione” a „zrobione porządnie” widać w miejscach, o których łatwo zapomnieć.",
  points: [
    {
      title: "Detale, o których się zapomina",
      body: "Ramy, uszczelki i parapety przy myciu, listwy i progi przy przeprowadzce. Inaczej brud wraca po pierwszym deszczu.",
      icon: Layers,
    },
    {
      title: "Kontrola na koniec",
      body: "Sprawdzamy efekt razem z Tobą, zanim spakujemy sprzęt i odjedziemy.",
      icon: Sparkles,
    },
    {
      title: "Porządek po pracy",
      body: "Zabezpieczamy okolicę stanowiska i zostawiamy ją w stanie, w jakim ją zastaliśmy.",
      icon: ShieldCheck,
    },
  ],
};

export const finalCta = {
  heading: "Masz to z głowy jednym zapytaniem",
  lead: "Wypełnij formularz, a wrócimy do Ciebie z konkretną kwotą i terminem. Bez zobowiązań.",
  cta: { label: "Poproś o wycenę", href: "#wycena" },
};

export const footerLinks = {
  serwis: [
    { label: "Strona główna", to: "/" },
    { label: "Usługi", to: "/#uslugi" },
    { label: "Realizacje", to: "/#realizacje" },
    { label: "Wycena", to: "/#wycena" },
    { label: "FAQ", to: "/#faq" },
  ],
  prawne: [
    { label: "Polityka prywatności", to: "/polityka-prywatnosci" },
    { label: "Polityka cookies", to: "/polityka-cookies" },
  ],
};
