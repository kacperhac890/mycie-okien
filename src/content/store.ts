import { defaultContent } from "./defaults";
import { CONTENT_SCHEMA } from "./types";
import type { ImageKey, ManagedImage, Realization, SiteContent, Testimonial } from "./types";

/* ==================================================================
   ŹRÓDŁA TREŚCI

   1. wartości domyślne wbudowane w kod (zawsze dostępne),
   2. content.json opublikowany z panelu (nadpisuje domyślne),
   3. roboczy szkic w localStorage (widoczny tylko w trybie podglądu).

   Plik content.json jest zwykłym zasobem pobieranym przez sieć, więc
   traktujemy go jak dane niepewne: wszystko, co nie pasuje do modelu,
   zastępujemy wartością domyślną, zamiast wywracać stronę.
   ================================================================== */

export const CONTENT_PATH = "content.json";
const DRAFT_KEY = "admin-draft";
const PREVIEW_KEY = "admin-preview";

/* ------------------------------------------------------------------
   Walidacja
   ------------------------------------------------------------------ */

const isString = (v: unknown): v is string => typeof v === "string";

function toImage(value: unknown, fallback: ManagedImage): ManagedImage {
  if (typeof value !== "object" || value === null) return fallback;
  const v = value as Record<string, unknown>;
  return {
    src: isString(v.src) && v.src.trim() ? v.src : fallback.src,
    alt: isString(v.alt) ? v.alt : fallback.alt,
  };
}

function toTestimonials(value: unknown): Testimonial[] | null {
  if (!Array.isArray(value)) return null;
  const list = value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item, i) => ({
      id: isString(item.id) ? item.id : `opinia-${i}`,
      quote: isString(item.quote) ? item.quote : "",
      author: isString(item.author) ? item.author : "",
      meta: isString(item.meta) ? item.meta : "",
      rating:
        typeof item.rating === "number" && item.rating >= 1 && item.rating <= 5
          ? Math.round(item.rating)
          : null,
      isPlaceholder: item.isPlaceholder === true,
    }))
    .filter((item) => item.quote.trim().length > 0);
  return list;
}

function toGallery(value: unknown): Realization[] | null {
  if (!Array.isArray(value)) return null;
  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item, i) => {
      const fallback = defaultContent.gallery[Math.min(i, defaultContent.gallery.length - 1)];
      return {
        id: isString(item.id) ? item.id : `realizacja-${i}`,
        title: isString(item.title) ? item.title : "",
        meta: isString(item.meta) ? item.meta : "",
        summary: isString(item.summary) ? item.summary : "",
        before: toImage(item.before, fallback.before),
        after: toImage(item.after, fallback.after),
        featured: item.featured === true,
      };
    })
    .filter((item) => item.title.trim().length > 0);
}

/** Scala dane z zewnątrz z wartościami domyślnymi. */
export function normalizeContent(value: unknown): SiteContent {
  if (typeof value !== "object" || value === null) return defaultContent;
  const raw = value as Record<string, unknown>;

  if (raw.schema !== CONTENT_SCHEMA) return defaultContent;

  const images = { ...defaultContent.images };
  if (typeof raw.images === "object" && raw.images !== null) {
    const incoming = raw.images as Record<string, unknown>;
    (Object.keys(images) as ImageKey[]).forEach((key) => {
      images[key] = toImage(incoming[key], defaultContent.images[key]);
    });
  }

  const testimonials = toTestimonials(raw.testimonials);
  const gallery = toGallery(raw.gallery);

  return {
    schema: CONTENT_SCHEMA,
    updatedAt: isString(raw.updatedAt) ? raw.updatedAt : "",
    images,
    testimonials: testimonials ?? defaultContent.testimonials,
    gallery: gallery && gallery.length > 0 ? gallery : defaultContent.gallery,
  };
}

/* ------------------------------------------------------------------
   Treść opublikowana
   ------------------------------------------------------------------ */

export async function loadPublishedContent(signal?: AbortSignal): Promise<SiteContent> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}${CONTENT_PATH}?t=${Date.now()}`, {
      signal,
      cache: "no-cache",
    });
    if (!res.ok) return defaultContent;
    return normalizeContent(await res.json());
  } catch {
    /* Brak pliku albo błąd sieci: zostajemy przy wartościach domyślnych. */
    return defaultContent;
  }
}

/* ------------------------------------------------------------------
   Szkic roboczy i podgląd
   ------------------------------------------------------------------ */

export function readDraft(): SiteContent | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return normalizeContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeDraft(content: SiteContent) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(content));
    return true;
  } catch {
    /* Najczęstsza przyczyna: przekroczony limit localStorage przez zdjęcia. */
    return false;
  }
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* brak storage nie jest błędem krytycznym */
  }
}

export function isPreviewOn() {
  try {
    return window.sessionStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
}

export function setPreview(on: boolean) {
  try {
    if (on) window.sessionStorage.setItem(PREVIEW_KEY, "1");
    else window.sessionStorage.removeItem(PREVIEW_KEY);
  } catch {
    /* jak wyżej */
  }
}

/** Przybliżony rozmiar szkicu, do ostrzeżenia przed limitem przeglądarki. */
export function draftSizeKb(content: SiteContent) {
  return Math.round(JSON.stringify(content).length / 1024);
}
