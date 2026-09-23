import { CONTENT_SCHEMA } from "./types";
import type { SiteContent } from "./types";

/* ==================================================================
   TREŚĆ DOMYŚLNA

   To jest stan startowy strony, wbudowany w kod. Panel /admin nadpisuje
   go plikiem content.json, ale gdy pliku nie ma albo się nie wczyta,
   strona i tak wygląda kompletnie.

   Zdjęcia pochodzą z Unsplash (licencja Unsplash, użycie komercyjne
   dozwolone) i są materiałem zastępczym do podmiany na własne realizacje.
   Opinie są celowo oznaczonymi placeholderami: nie wstawiamy zmyślonych
   wypowiedzi klientów.
   ================================================================== */

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const defaultContent: SiteContent = {
  schema: CONTENT_SCHEMA,
  updatedAt: "",

  /* Wszystko w nawiasach kwadratowych to placeholder do uzupełnienia
     w panelu (/admin, zakładka „Firma”). Nie są to prawdziwe dane. */
  company: {
    name: "[NAZWA FIRMY]",
    phone: "[+48 000 000 000]",
    email: "[kontakt@twojadomena.pl]",
    area: "[MIASTO I OKOLICE]",
    areaDetail: "[np. do 40 km od MIASTO]",
    legalEntity: "[PEŁNA NAZWA DZIAŁALNOŚCI]",
    nip: "[NIP 000-000-00-00]",
    street: "[ul. Przykładowa 1]",
    postalCode: "[00-000]",
    city: "[MIASTO]",
    legalUpdated: "[DD.MM.RRRR]",
    hosting: "[DOSTAWCA HOSTINGU]",
    mailProvider: "[DOSTAWCA POCZTY E-MAIL]",
    accounting: "[BIURO RACHUNKOWE]",
    retention: "[np. 12 miesięcy]",
    dpo: "",
  },

  images: {
    hero: {
      src: u("1524803504179-6d7ae4d283f7"),
      alt: "Dwóch pracowników myjących szklaną fasadę biurowca",
    },
    work: {
      src: u("1421940943431-d392fcc1079f"),
      alt: "Pracownik myjący przeszklenia na elewacji budynku",
    },
    privateClient: {
      src: u("1656122381069-9ec666d95cf1"),
      alt: "Salon domu z dużym przeszkleniem od podłogi do sufitu",
    },
    commercialClient: {
      src: u("1647927397990-1a6a0f1819ce"),
      alt: "Witryna lokalu usługowego widziana od strony ulicy",
    },
    quality: {
      src: u("1486175060817-5663aacc6655"),
      alt: "Szklana fasada biurowca w ujęciu z dołu",
    },
  },

  testimonials: [
    {
      id: "opinia-1",
      quote: "[Miejsce na prawdziwą opinię klienta prywatnego. Dwa, trzy zdania wystarczą.]",
      author: "[Imię klienta]",
      meta: "[Dom jednorodzinny, MIASTO]",
      rating: null,
      isPlaceholder: true,
    },
    {
      id: "opinia-2",
      quote: "[Miejsce na opinię klienta komercyjnego: lokal, biuro lub witryna.]",
      author: "[Imię i nazwisko]",
      meta: "[Nazwa lokalu, MIASTO]",
      rating: null,
      isPlaceholder: true,
    },
    {
      id: "opinia-3",
      quote: "[Miejsce na opinię dotyczącą stałej współpracy lub trudnej realizacji.]",
      author: "[Imię klienta]",
      meta: "[Biurowiec, MIASTO]",
      rating: null,
      isPlaceholder: true,
    },
  ],

  gallery: [
    {
      id: "dom",
      title: "Dom jednorodzinny po remoncie",
      meta: "[MIASTO] · [MIESIĄC ROK]",
      summary:
        "Okna z resztkami zaprawy i folii montażowej, razem z ramami i parapetami zewnętrznymi.",
      before: {
        src: u("1515764371993-7995b2dba0b9"),
        alt: "Zabrudzone okno w drewnianej ramie przed myciem",
      },
      after: {
        src: u("1630699144867-37acec97df5a"),
        alt: "To samo okno po umyciu, czysta szyba i rama",
      },
      featured: true,
    },
    {
      id: "witryna",
      title: "Witryna lokalu usługowego",
      meta: "[MIASTO] · [MIESIĄC ROK]",
      summary: "Mycie od ulicy i od środka, poza godzinami pracy lokalu.",
      before: {
        src: u("1723125189744-c13d54173131"),
        alt: "Zabrudzona witryna sklepowa przed myciem",
      },
      after: {
        src: u("1645937464657-4106e824fb15"),
        alt: "Czysta witryna sklepowa po myciu",
      },
      featured: false,
    },
    {
      id: "ogrod-zimowy",
      title: "Ogród zimowy",
      meta: "[MIASTO] · [MIESIĄC ROK]",
      summary: "Przeszklenia skośne i pionowe, z myciem konstrukcji nośnej.",
      before: {
        src: u("1766305045904-58a011979d7a"),
        alt: "Przeszklenie ogrodu zimowego z osadem przed myciem",
      },
      after: {
        src: u("1465577512280-1c2d41a79862"),
        alt: "Czyste przeszklenie ogrodu zimowego po myciu",
      },
      featured: false,
    },
  ],

  faq: [
    {
      id: "wysokosci",
      q: "Czy myjecie okna na wysokościach?",
      a: "Tak. Realizujemy prace wymagające zastosowania odpowiedniego sprzętu, np. myjki teleskopowej lub podnośnika. Zakres i sposób dostępu ustalamy na etapie wyceny, po zdjęciach lub oględzinach.",
    },
    {
      id: "biura",
      q: "Czy pracujecie w biurach i lokalach usługowych?",
      a: "Tak. Obsługujemy biura, sklepy, witryny i lokale usługowe. Terminy dopasowujemy do godzin pracy obiektu, także wcześnie rano lub po zamknięciu.",
    },
    {
      id: "deszcz",
      q: "Co, jeśli w dniu realizacji będzie padać?",
      a: "Sam deszcz nie brudzi umytej szyby, więc drobne opady zwykle nie są przeszkodą. Przy silnym wietrze, mrozie lub ulewie przekładamy termin, bo w takich warunkach nie da się zagwarantować efektu ani bezpiecznej pracy na wysokości. O przełożeniu informujemy zawsze z wyprzedzeniem.",
    },
    {
      id: "ramy",
      q: "Czy można umyć również ramy i rolety?",
      a: "Tak. Mycie ram, skrzynek rolet i żaluzji to osobna pozycja, którą zaznaczasz w formularzu wyceny.",
    },
    {
      id: "alpinistyczne",
      q: "Czy wykonujecie prace alpinistyczne?",
      a: "[DO POTWIERDZENIA] Prace na linach wymagają osobnych uprawnień i sprzętu. Jeżeli Twoje przeszklenia wymagają dostępu alpinistycznego, zaznacz to w formularzu, a potwierdzimy możliwość realizacji przed wyceną.",
    },
    {
      id: "wycena",
      q: "Czy wycena jest bezpłatna?",
      a: "Tak. Wycena na podstawie formularza i zdjęć jest bezpłatna i niezobowiązująca. Nic nie płacisz do momentu potwierdzenia terminu.",
    },
  ],
};
