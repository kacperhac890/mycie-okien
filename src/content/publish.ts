import { CONTENT_FILE, MEDIA_DIR, MEDIA_PREFIX } from "./adminConfig";
import { CONTENT_SCHEMA } from "./types";
import type { ManagedImage, SiteContent } from "./types";
import { parseDataUrl, putFile, utf8ToBase64 } from "../lib/github";

/* ==================================================================
   PUBLIKACJA ZMIAN

   Kolejność ma znaczenie: najpierw wgrywamy zdjęcia, bo dopiero wtedy
   znamy ich docelowe ścieżki, a potem zapisujemy content.json, który
   już się do tych ścieżek odwołuje. Gdyby coś padło w połowie, w repo
   zostaną wgrane pliki, ale content.json nadal wskaże stare zdjęcia,
   więc strona się nie rozsypie.
   ================================================================== */

export type PublishProgress = { step: string; done: number; total: number };

/* ------------------------------------------------------------------
   Czekanie na wdrożenie

   Zapis do repozytorium to dopiero polowa drogi: strona jest
   przebudowywana przez GitHub Actions i nowa tresc pojawia sie po okolo
   minucie. Bez tego kroku panel mowilby "zapisane", a uzytkownik
   patrzylby na stara wersje i nie wiedzial dlaczego.
   ------------------------------------------------------------------ */

const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

/** Odpytuje opublikowany plik, aż zobaczy w nim nasz znacznik czasu. */
export async function waitForDeployment(
  expectedUpdatedAt: string,
  onTick?: (secondsWaiting: number) => void,
): Promise<boolean> {
  const started = Date.now();

  while (Date.now() - started < POLL_TIMEOUT_MS) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    onTick?.(Math.round((Date.now() - started) / 1000));

    try {
      const res = await fetch(`${import.meta.env.BASE_URL}content.json?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const live = (await res.json()) as { updatedAt?: string };
        if (live.updatedAt === expectedUpdatedAt) return true;
      }
    } catch {
      /* Chwilowy blad sieci w trakcie wdrozenia nie jest powodem do paniki. */
    }
  }

  return false;
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ł/g, "l")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "zdjecie"
  );
}

/** Zbiera wszystkie zdjęcia wgrane w panelu, czyli te w formie data URL. */
function collectUploads(content: SiteContent) {
  const uploads: { image: ManagedImage; hint: string }[] = [];

  (Object.keys(content.images) as (keyof SiteContent["images"])[]).forEach((key) => {
    const image = content.images[key];
    if (image.src.startsWith("data:")) uploads.push({ image, hint: key });
  });

  content.gallery.forEach((item) => {
    if (item.before.src.startsWith("data:")) {
      uploads.push({ image: item.before, hint: `${item.title}-przed` });
    }
    if (item.after.src.startsWith("data:")) {
      uploads.push({ image: item.after, hint: `${item.title}-po` });
    }
  });

  return uploads;
}

export async function publishContent(
  content: SiteContent,
  token: string,
  onProgress?: (progress: PublishProgress) => void,
): Promise<SiteContent> {
  /* Kopia do modyfikacji, żeby nie ruszać stanu Reacta w miejscu. */
  const next: SiteContent = JSON.parse(JSON.stringify(content));
  const uploads = collectUploads(next);
  const total = uploads.length + 1;
  let done = 0;

  for (const { image, hint } of uploads) {
    onProgress?.({ step: `Wgrywam zdjęcie: ${hint}`, done, total });

    const parsed = parseDataUrl(image.src);
    if (!parsed) {
      throw new Error(`Nie rozpoznano formatu wgranego zdjęcia (${hint}).`);
    }

    const name = `${slugify(hint)}-${Date.now().toString(36)}.${parsed.ext}`;
    await putFile({
      path: `${MEDIA_DIR}/${name}`,
      base64: parsed.base64,
      message: `Panel: dodaje zdjecie ${name}`,
      token,
    });

    image.src = `${MEDIA_PREFIX}/${name}`;
    done += 1;
  }

  onProgress?.({ step: "Zapisuję treść strony", done, total });

  next.schema = CONTENT_SCHEMA;
  next.updatedAt = new Date().toISOString();

  await putFile({
    path: CONTENT_FILE,
    base64: utf8ToBase64(`${JSON.stringify(next, null, 2)}\n`),
    message: "Panel: aktualizacja tresci strony",
    token,
  });

  onProgress?.({ step: "Gotowe", done: total, total });
  return next;
}
