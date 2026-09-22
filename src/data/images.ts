/* ==================================================================
   ZDJĘCIA
   Na czas budowy strony korzystamy ze zdjęć Unsplash (licencja Unsplash,
   użycie komercyjne dozwolone). To materiał zastępczy.

   PODMIANA NA WŁASNE ZDJĘCIA REALIZACJI:
   1. wrzuć pliki do /public/zdjecia/,
   2. w obiekcie `images` podmień `id` na ścieżkę, np. "/zdjecia/hero.jpg",
      i ustaw `local: true`,
   3. alt-teksty zostaw opisowe, są używane przez SEO i czytniki ekranu.
   Nic więcej nie trzeba zmieniać: komponenty czytają tylko ten plik.
   ================================================================== */

type ImageDef = {
  /** Identyfikator zdjęcia Unsplash albo lokalna ścieżka, gdy local = true. */
  id: string;
  alt: string;
  local?: boolean;
  /** Proporcje kadru używane przez Unsplash (w:h). */
  ratio: [number, number];
};

const WIDTHS = [480, 768, 1024, 1440, 1920];

function unsplashUrl(id: string, w: number, ratio: [number, number]) {
  const h = Math.round((w * ratio[1]) / ratio[0]);
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=72`;
}

export type ResponsiveImage = {
  src: string;
  srcSet?: string;
  alt: string;
  width: number;
  height: number;
};

/** Zwraca gotowy zestaw atrybutów dla <img>. */
export function img(def: ImageDef, baseWidth = 1200): ResponsiveImage {
  const height = Math.round((baseWidth * def.ratio[1]) / def.ratio[0]);

  if (def.local) {
    return { src: def.id, alt: def.alt, width: baseWidth, height };
  }

  return {
    src: unsplashUrl(def.id, baseWidth, def.ratio),
    srcSet: WIDTHS.map((w) => `${unsplashUrl(def.id, w, def.ratio)} ${w}w`).join(", "),
    alt: def.alt,
    width: baseWidth,
    height,
  };
}

export const images = {
  hero: {
    id: "1524803504179-6d7ae4d283f7",
    alt: "Dwóch pracowników myjących szklaną fasadę biurowca",
    ratio: [4, 5],
  },
  work: {
    id: "1421940943431-d392fcc1079f",
    alt: "Pracownik myjący przeszklenia na elewacji budynku",
    ratio: [3, 4],
  },
  privateClient: {
    id: "1656122381069-9ec666d95cf1",
    alt: "Salon domu z dużym przeszkleniem od podłogi do sufitu",
    ratio: [16, 11],
  },
  commercialClient: {
    id: "1647927397990-1a6a0f1819ce",
    alt: "Witryna lokalu usługowego widziana od strony ulicy",
    ratio: [16, 11],
  },
  quality: {
    id: "1486175060817-5663aacc6655",
    alt: "Szklana fasada biurowca w ujęciu z dołu",
    ratio: [16, 9],
  },
} satisfies Record<string, ImageDef>;
