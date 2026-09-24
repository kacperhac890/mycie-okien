import { IMAGE_LABELS } from "../../data/images";
import type { ImageKey, ManagedImage, SiteContent } from "../../content/types";
import { ImageField } from "./ImageField";

type Props = {
  images: SiteContent["images"];
  onChange: (next: SiteContent["images"]) => void;
};

const KEYS = Object.keys(IMAGE_LABELS) as ImageKey[];

/* Klasy proporcji muszą być zapisane dosłownie: Tailwind skanuje kod
   źródłowy i nie wygeneruje klasy sklejanej w czasie działania. */
const RATIO_CLASS: Record<ImageKey, string> = {
  hero: "aspect-[4/5]",
  work: "aspect-[3/4]",
  serviceWindows: "aspect-[16/11]",
  serviceFacade: "aspect-[16/11]",
  quality: "aspect-[16/9]",
};

export function ImagesEditor({ images, onChange }: Props) {
  function update(key: ImageKey, next: ManagedImage) {
    onChange({ ...images, [key]: next });
  }

  return (
    <div>
      <div className="max-w-[60ch]">
        <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">Zdjęcia sekcji</h2>
        <p className="body-text mt-2 text-[0.875rem]">
          Zdjęcia z Unsplash są materiałem zastępczym. Wgraj własne realizacje, a strona od razu
          przestanie wyglądać jak szablon. Duże pliki zmniejszamy automatycznie przed zapisem.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        {KEYS.map((key) => (
          <ImageField
            key={key}
            label={IMAGE_LABELS[key]}
            value={images[key]}
            ratio={RATIO_CLASS[key]}
            onChange={(next) => update(key, next)}
          />
        ))}
      </div>
    </div>
  );
}
