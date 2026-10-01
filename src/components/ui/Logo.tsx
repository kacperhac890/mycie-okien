import { useContent } from "../../content/ContentProvider";
import { cn } from "../../lib/cn";

type Props = {
  /** Wersja na ciemny panel, np. w stopce. */
  onBrand?: boolean;
  /** Gdy logo siedzi w elemencie, który ma już własną etykietę. */
  decorative?: boolean;
  className?: string;
};

/**
 * Logo firmy.
 *
 * Plik ma przezroczyste tło, ale granatowe elementy znaku zlałyby się
 * z ciemną stopką, dlatego tam kładziemy je na jasnej płytce zamiast
 * trzymać osobny, odwrócony wariant pliku.
 *
 * Podmiana logo: wrzuć nowy plik jako public/logo.png i popraw width
 * oraz height poniżej, żeby przeglądarka znała proporcje przed pobraniem
 * obrazka i nie przesuwała układu.
 */
export function Logo({ onBrand = false, decorative = false, className }: Props) {
  const { company } = useContent();

  const image = (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt={decorative ? "" : company.name}
      width={720}
      height={250}
      decoding="async"
      className={cn("w-auto", onBrand ? "h-11 sm:h-12" : "h-12 md:h-14", className)}
    />
  );

  if (!onBrand) return image;

  return (
    <span className="inline-flex rounded-control bg-white px-4 py-3 shadow-soft">{image}</span>
  );
}
