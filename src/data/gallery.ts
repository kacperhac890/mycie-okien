/* ==================================================================
   GALERIA REALIZACJI

   Zdjęcia „przed” i „po” są na razie materiałem zastępczym (Unsplash),
   a tytuły zawierają placeholdery. Podmiana na własne realizacje:

   1. wrzuć pary zdjęć do /public/realizacje/,
   2. ustaw `local: true` i podaj ścieżki w `before` / `after`,
   3. uzupełnij `title`, `meta` i `summary` prawdziwymi danymi.

   Efekt jest najlepszy, gdy oba zdjęcia są zrobione z tego samego
   miejsca, w zbliżonym świetle i w tym samym kadrze.
   ================================================================== */

export type Realization = {
  id: string;
  title: string;
  meta: string;
  summary: string;
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  local?: boolean;
  /** Większy kafel w siatce. */
  featured?: boolean;
};

export const realizations: Realization[] = [
  {
    id: "dom",
    title: "Dom jednorodzinny po remoncie",
    meta: "[MIASTO] · [MIESIĄC ROK]",
    summary:
      "Okna z resztkami zaprawy i folii montażowej, razem z ramami i parapetami zewnętrznymi.",
    before: "1515764371993-7995b2dba0b9",
    after: "1630699144867-37acec97df5a",
    beforeAlt: "Zabrudzone okno w drewnianej ramie przed myciem",
    afterAlt: "To samo okno po umyciu, czysta szyba i rama",
    featured: true,
  },
  {
    id: "witryna",
    title: "Witryna lokalu usługowego",
    meta: "[MIASTO] · [MIESIĄC ROK]",
    summary: "Mycie od ulicy i od środka, poza godzinami pracy lokalu.",
    before: "1723125189744-c13d54173131",
    after: "1645937464657-4106e824fb15",
    beforeAlt: "Zabrudzona witryna sklepowa przed myciem",
    afterAlt: "Czysta witryna sklepowa po myciu",
  },
  {
    id: "ogrod-zimowy",
    title: "Ogród zimowy",
    meta: "[MIASTO] · [MIESIĄC ROK]",
    summary: "Przeszklenia skośne i pionowe, z myciem konstrukcji nośnej.",
    before: "1766305045904-58a011979d7a",
    after: "1465577512280-1c2d41a79862",
    beforeAlt: "Przeszklenie ogrodu zimowego z osadem przed myciem",
    afterAlt: "Czyste przeszklenie ogrodu zimowego po myciu",
  },
];
