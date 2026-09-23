/**
 * Odczyt zmiennej środowiskowej z wartością zapasową.
 *
 * GitHub Actions podstawia za nieustawioną zmienną repozytorium PUSTY NAPIS,
 * a nie `undefined`. Operator `??` tego nie wyłapie, bo pusty napis nie jest
 * wartością nullish, więc `import.meta.env.X ?? "domyślne"` daje "".
 * Dlatego pustą i samą białą spację traktujemy tu jak brak wartości.
 */
export function envOr(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}
