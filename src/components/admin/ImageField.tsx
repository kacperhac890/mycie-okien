import { useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { resolveSrc } from "../../data/images";
import { compressImage } from "../../lib/compressImage";
import { FieldError, TextField } from "../ui/Field";
import type { ManagedImage } from "../../content/types";
import { cn } from "../../lib/cn";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

/* Miniatura w panelu nie musi ciągnąć oryginału w pełnej rozdzielczości. */
function thumbUrl(src: string) {
  if (!src) return "";
  if (src.includes("images.unsplash.com")) {
    return `${src.split("?")[0]}?auto=format&fit=crop&w=400&q=60`;
  }
  return resolveSrc(src);
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Nie udało się odczytać pliku."));
    reader.readAsDataURL(file);
  });
}

type Props = {
  label: string;
  value: ManagedImage;
  onChange: (next: ManagedImage) => void;
  /** Proporcje miniatury, żeby od razu było widać kadrowanie. */
  ratio?: string;
};

export function ImageField({ label, value, onChange, ratio = "aspect-[4/3]" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      setError("Przyjmujemy pliki JPG, PNG i WEBP.");
      return;
    }

    setError(undefined);
    setBusy(true);
    try {
      /* Zmniejszamy zdjęcie przed zapisem: szkic siedzi w localStorage,
         a pełnowymiarowe zdjęcia z telefonu szybko wyczerpałyby limit. */
      const optimized = await compressImage(file);
      const dataUrl = await fileToDataUrl(optimized);
      onChange({ ...value, src: dataUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nie udało się wczytać zdjęcia.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isUploaded = value.src.startsWith("data:");
  const isLocal = !isUploaded && !/^https?:/i.test(value.src);

  return (
    <div className="rounded-card border border-line bg-surface p-4">
      <p className="text-[0.8125rem] font-bold text-ink">{label}</p>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row">
        <div className={cn("w-full shrink-0 sm:w-44", ratio)}>
          {value.src ? (
            <img
              src={thumbUrl(value.src)}
              alt=""
              className="h-full w-full rounded-control border border-line object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-control border border-dashed border-line-strong bg-surface-inset text-[0.75rem] text-ink-faint">
              brak zdjęcia
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex h-11 items-center gap-2 rounded-pill border border-line-strong bg-surface px-4 text-[0.875rem] font-semibold text-ink transition-colors hover:bg-surface-2 disabled:opacity-60"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Przetwarzam
                </>
              ) : (
                <>
                  <ImageUp className="h-4 w-4" aria-hidden="true" />
                  Wgraj zdjęcie
                </>
              )}
            </button>

            <span className="text-[0.75rem] text-ink-faint">
              {isUploaded
                ? "nowe zdjęcie, trafi do repozytorium przy publikacji"
                : isLocal
                  ? "plik z katalogu strony"
                  : "adres zewnętrzny"}
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="sr-only"
            aria-label={`Wgraj zdjęcie: ${label}`}
            onChange={(e) => void handleFile(e.target.files?.[0])}
          />

          <TextField
            label="Adres zdjęcia"
            value={isUploaded ? "" : value.src}
            placeholder={isUploaded ? "nowe zdjęcie wgrane z dysku" : "https://... albo media/plik.jpg"}
            disabled={isUploaded}
            onChange={(e) => onChange({ ...value, src: e.target.value })}
          />

          <TextField
            label="Opis alternatywny"
            hint="Czyta go wyszukiwarka i czytnik ekranu. Opisz, co widać na zdjęciu."
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
          />

          <FieldError>{error}</FieldError>
        </div>
      </div>
    </div>
  );
}
