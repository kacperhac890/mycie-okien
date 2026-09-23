import type { ImageKey, ManagedImage } from "../content/types";

/* ==================================================================
   ZDJĘCIA

   Adresy i opisy alternatywne są edytowalne z panelu (/admin) i lądują
   w content.json. Tutaj zostają tylko proporcje kadru, bo to decyzja
   layoutu, a nie treści.

   Obsługiwane źródła:
   - pełny URL Unsplash -> dokładamy parametry rozmiaru i srcset,
   - ścieżka względna, np. "media/hero.jpg" -> plik z katalogu public/,
     wgrany przez panel,
   - dowolny inny pełny URL -> wstawiamy bez zmian.
   ================================================================== */

export const IMAGE_RATIOS: Record<ImageKey, [number, number]> = {
  hero: [4, 5],
  work: [3, 4],
  privateClient: [16, 11],
  commercialClient: [16, 11],
  quality: [16, 9],
};

export const IMAGE_LABELS: Record<ImageKey, string> = {
  hero: "Hero, sekcja główna",
  work: "Dlaczego my",
  privateClient: "Oferta: klient prywatny",
  commercialClient: "Oferta: klient komercyjny",
  quality: "Sekcja jakości",
};

const WIDTHS = [480, 768, 1024, 1440, 1920];
const UNSPLASH = "images.unsplash.com";

export type ResponsiveImage = {
  src: string;
  srcSet?: string;
  alt: string;
  width: number;
  height: number;
};

/** Ścieżki względne działają też wtedy, gdy strona stoi w podkatalogu. */
export function resolveSrc(src: string) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith("data:") || src.startsWith("/")) return src;
  return `${import.meta.env.BASE_URL}${src}`;
}

function unsplashAt(src: string, w: number, ratio: [number, number]) {
  const base = src.split("?")[0];
  const h = Math.round((w * ratio[1]) / ratio[0]);
  return `${base}?auto=format&fit=crop&w=${w}&h=${h}&q=72`;
}

/** Zwraca gotowy zestaw atrybutów dla <img>. */
export function responsive(
  image: ManagedImage,
  ratio: [number, number],
  baseWidth = 1200,
): ResponsiveImage {
  const height = Math.round((baseWidth * ratio[1]) / ratio[0]);

  if (!image.src.includes(UNSPLASH)) {
    return { src: resolveSrc(image.src), alt: image.alt, width: baseWidth, height };
  }

  return {
    src: unsplashAt(image.src, baseWidth, ratio),
    srcSet: WIDTHS.map((w) => `${unsplashAt(image.src, w, ratio)} ${w}w`).join(", "),
    alt: image.alt,
    width: baseWidth,
    height,
  };
}
