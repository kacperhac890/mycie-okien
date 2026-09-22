import { useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { FieldError } from "./Controls";
import type { QuotePhoto } from "./types";
import { compressImage } from "../../lib/compressImage";
import { cn } from "../../lib/cn";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILES = 8;
const MAX_SIZE_MB = 12;
/* Darmowe usługi formularzowe mają limit na całe zgłoszenie (FormSubmit
   przyjmuje do 10 MB), dlatego pilnujemy też sumy plików po kompresji. */
const MAX_TOTAL_MB = 9;

type Props = {
  photos: QuotePhoto[];
  onChange: (next: QuotePhoto[]) => void;
};

export function PhotoUpload({ photos, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  /* Object URL-e żyją tak długo jak komponent. Zwalniamy je przy odmontowaniu,
     żeby nie zostawiać wycieku pamięci po wysłaniu formularza. */
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => {
    return () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
  }, []);

  async function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    setBusy(true);
    const accepted: QuotePhoto[] = [];
    let message: string | undefined;
    let total = photos.reduce((sum, p) => sum + p.file.size, 0);

    for (const file of Array.from(fileList)) {
      if (!ACCEPTED.includes(file.type)) {
        message = "Przyjmujemy pliki JPG, PNG i WEBP.";
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        message = `Maksymalny rozmiar zdjęcia to ${MAX_SIZE_MB} MB.`;
        continue;
      }
      if (photos.length + accepted.length >= MAX_FILES) {
        message = `Możesz dodać maksymalnie ${MAX_FILES} zdjęć.`;
        break;
      }

      /* Zmniejszamy zdjęcie w przeglądarce: do wyceny wystarczy podgląd,
         a wysyłka jest dzięki temu znacznie szybsza. */
      const optimized = await compressImage(file);

      if (total + optimized.size > MAX_TOTAL_MB * 1024 * 1024) {
        message = `Łączny rozmiar zdjęć nie może przekroczyć ${MAX_TOTAL_MB} MB. Resztę możesz dosłać mailem.`;
        break;
      }

      total += optimized.size;
      accepted.push({
        id: `${optimized.name}-${optimized.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file: optimized,
        url: URL.createObjectURL(optimized),
      });
    }

    setError(message);
    if (accepted.length) onChange([...photos, ...accepted]);
    if (inputRef.current) inputRef.current.value = "";
    setBusy(false);
  }

  function remove(id: string) {
    const target = photos.find((p) => p.id === id);
    if (target) URL.revokeObjectURL(target.url);
    onChange(photos.filter((p) => p.id !== id));
    setError(undefined);
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[0.8125rem] font-semibold text-ink">
        Zdjęcia okien lub przeszkleń
        <span className="ml-1.5 font-medium text-ink-faint">(opcjonalne)</span>
      </span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-card border border-dashed p-5 text-center transition-colors",
          dragging ? "border-accent bg-accent-soft" : "border-line-strong bg-surface-inset",
        )}
      >
        <ImagePlus className="mx-auto h-6 w-6 text-accent" strokeWidth={1.8} aria-hidden="true" />

        <p className="body-text mx-auto mt-3 max-w-[42ch] text-[0.875rem]">
          Możesz dodać zdjęcia okien lub przeszkleń. Pomoże nam to przygotować dokładniejszą
          wycenę.
        </p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-pill border border-line-strong bg-surface px-5 text-[0.875rem] font-semibold text-ink transition-colors hover:bg-surface-2 disabled:opacity-60"
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Przygotowuję zdjęcia
            </>
          ) : (
            "Wybierz zdjęcia"
          )}
        </button>

        <p className="mt-3 text-[0.75rem] text-ink-faint">
          JPG, PNG lub WEBP. Do {MAX_FILES} zdjęć. Duże pliki zmniejszamy automatycznie.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          multiple
          onChange={(e) => void addFiles(e.target.files)}
          className="sr-only"
          aria-label="Dodaj zdjęcia okien lub przeszkleń"
        />
      </div>

      <FieldError>{error}</FieldError>

      {photos.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="pop-in group relative aspect-square overflow-hidden rounded-control border border-line bg-surface-2"
            >
              <img
                src={photo.url}
                alt={`Podgląd: ${photo.file.name}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove(photo.id)}
                aria-label={`Usuń zdjęcie ${photo.file.name}`}
                className="absolute top-1.5 right-1.5 flex h-9 w-9 items-center justify-center rounded-pill bg-brand/75 text-white backdrop-blur-sm transition-colors hover:bg-brand"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
