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

export type SiteContent = {
  /** Podnoszona przy zmianie kształtu danych, do odrzucania starych wersji. */
  schema: number;
  updatedAt: string;
  testimonials: Testimonial[];
  images: Record<ImageKey, ManagedImage>;
  gallery: Realization[];
};

export const CONTENT_SCHEMA = 1;

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
