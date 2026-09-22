/* ==================================================================
   ZMNIEJSZANIE ZDJĘĆ PRZED WYSYŁKĄ

   Zdjęcie z telefonu potrafi ważyć 4-6 MB, a do wyceny wystarczy
   podgląd. Skalujemy dłuższy bok do 1600 px i zapisujemy jako JPEG.
   Efekt: szybsza wysyłka, mniejszy transfer u klienta i zmieszczenie
   się w limitach darmowych usług formularzowych.

   Wszystko dzieje się w przeglądarce. Jeśli cokolwiek pójdzie nie tak
   (stara przeglądarka, nietypowy format), zwracamy oryginalny plik.
   ================================================================== */

const MAX_EDGE = 1600;
const QUALITY = 0.82;
/** Poniżej tego progu nie ma czego optymalizować. */
const SKIP_BELOW_BYTES = 400 * 1024;

export async function compressImage(file: File): Promise<File> {
  if (file.size < SKIP_BELOW_BYTES) return file;
  if (typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));

    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY),
    );

    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg", lastModified: file.lastModified });
  } catch {
    return file;
  }
}
