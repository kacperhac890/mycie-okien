import {
  Building2,
  CalendarCheck,
  ClipboardList,
  Clock4,
  Droplets,
  Home,
  Layers,
  Ruler,
  ShieldCheck,
  Sparkles,
  Store,
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
  headline: ["Czyste szyby.", "Widoczna różnica."],
  lead: "Profesjonalne mycie okien, witryn i dużych przeszkleń dla klientów prywatnych i firm.",
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
  lead: "Mycie szyb wygląda prosto do momentu, w którym po wyschnięciu zostają zacieki. Pracujemy tak, żeby efekt był widoczny także następnego dnia.",
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

export const services = {
  heading: "Dwa tryby pracy, jeden standard wykonania",
  groups: [
    {
      id: "prywatny" as const,
      kicker: "Klient prywatny",
      title: "Domy i mieszkania",
      body: "Jednorazowe mycie po remoncie, sezonowe porządki albo stały termin dwa razy w roku.",
      items: [
        "Domy",
        "Mieszkania",
        "Ogrody zimowe",
        "Duże przeszklenia",
        "Okna balkonowe",
        "Ramy i rolety",
      ],
      cta: "Zamów wycenę",
      icon: Home,
    },
    {
      id: "komercyjny" as const,
      kicker: "Klient komercyjny",
      title: "Lokale, biura i fasady",
      body: "Realizacje jednorazowe oraz stała obsługa w ustalonym cyklu, poza godzinami pracy obiektu.",
      items: [
        "Biura",
        "Sklepy i witryny",
        "Lokale usługowe",
        "Szklane fasady",
        "Obiekty wielkopowierzchniowe",
        "Regularne utrzymanie czystości",
      ],
      cta: "Zapytaj o współpracę",
      icon: Store,
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
  heading: "Umyta szyba to dopiero połowa roboty",
  lead: "Różnicę między „umyte” a „zrobione porządnie” widać w miejscach, o których łatwo zapomnieć.",
  points: [
    {
      title: "Ramy, uszczelki i parapety",
      body: "Przecieramy je przy okazji mycia szyby, bo inaczej brud wraca po pierwszym deszczu.",
      icon: Layers,
    },
    {
      title: "Kontrola pod światło",
      body: "Sprawdzamy efekt końcowy z obu stron, zanim spakujemy sprzęt.",
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
  heading: "Potrzebujesz czystych szyb bez tracenia czasu?",
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
