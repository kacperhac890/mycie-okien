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
