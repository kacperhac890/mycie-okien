import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, Lock, X } from "lucide-react";
import {
  ALL_DENIED,
  ALL_GRANTED,
  NECESSARY_DESCRIPTION,
  OPTIONAL_CATEGORIES,
  applyConsent,
  getConsent,
  onOpenCookiePreferences,
  saveConsent,
  subscribeConsent,
} from "../../lib/consent";
import type { ConsentCategories, ConsentRecord, OptionalCategory } from "../../lib/consent";
import { Button } from "../ui/Button";
import { cn } from "../../lib/cn";

/** Stan zgody na potrzeby innych komponentów (np. ukrycia paska CTA). */
export function useConsent() {
  const [record, setRecord] = useState<ConsentRecord | null>(() => getConsent());
  useEffect(() => subscribeConsent(setRecord), []);
  return record;
}

function Switch({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label className={cn("flex shrink-0 items-center", disabled && "cursor-not-allowed")}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
        aria-label={label}
      />
      <span
        aria-hidden="true"
        className={cn(
          "relative h-7 w-12 rounded-pill border-2 border-line-strong bg-surface-2 transition-colors duration-200",
          "peer-checked:border-accent peer-checked:bg-accent",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent",
          disabled && "opacity-55",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-pill bg-ink-faint transition-transform duration-200",
            checked && "translate-x-5 bg-white",
          )}
        />
      </span>
    </label>
  );
}

export function CookieConsent() {
  const [record, setRecord] = useState<ConsentRecord | null>(() => getConsent());
  const [showBanner, setShowBanner] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [draft, setDraft] = useState<ConsentCategories>(ALL_DENIED);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  /* Pierwsze wejście: brak zapisanej decyzji = pokazujemy baner.
     Skrypty warunkowe ładujemy dopiero po zgodzie. */
  useEffect(() => {
    const current = getConsent();
    setRecord(current);
    applyConsent(current);
    if (!current) setShowBanner(true);
  }, []);

  useEffect(() => subscribeConsent(setRecord), []);

  const openPrefs = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement;
    setDraft(record ? { ...record } : ALL_DENIED);
    setShowPrefs(true);
  }, [record]);

  /* Link „Ustawienia cookies” w stopce otwiera to samo okno. */
  useEffect(() => onOpenCookiePreferences(openPrefs), [openPrefs]);

  /* Escape, blokada scrolla i zwrot fokusu dla okna preferencji. */
  useEffect(() => {
    if (!showPrefs) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePrefs();
    };
    document.addEventListener("keydown", onKey);
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPrefs]);

  function closePrefs() {
    setShowPrefs(false);
    lastFocused.current?.focus();
  }

  function commit(categories: ConsentCategories) {
    const saved = saveConsent(categories);
    setRecord(saved);
    setShowBanner(false);
    setShowPrefs(false);
    lastFocused.current?.focus();
  }

  const policyLinks = (
    <>
      <Link
        to="/polityka-prywatnosci"
        className="font-semibold text-accent underline underline-offset-2 hover:text-accent-hover"
      >
        Polityka prywatności
      </Link>
      <span aria-hidden="true" className="text-ink-faint">
        /
      </span>
      <Link
        to="/polityka-cookies"
        className="font-semibold text-accent underline underline-offset-2 hover:text-accent-hover"
      >
        Polityka cookies
      </Link>
    </>
  );

  return (
    <>
      {/* ---------------------------------------------------------------
          BANER
          --------------------------------------------------------------- */}
      {showBanner && !showPrefs ? (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="cookie-baner-tytul"
          className="pop-in fixed inset-x-0 bottom-0 z-70 px-3 pb-3 sm:px-5 sm:pb-5"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto max-h-[82dvh] max-w-3xl overflow-y-auto rounded-card border border-line bg-surface p-5 shadow-float sm:p-6">
            <div className="flex items-start gap-3">
              <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-control bg-accent-soft text-accent sm:flex">
                <Cookie className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 id="cookie-baner-tytul" className="h-card text-ink">
                  Szanujemy Twoją prywatność
                </h2>
                <p className="body-text mt-2 text-[0.875rem]">
                  Ta strona korzysta z plików cookies i podobnych technologii w celu zapewnienia jej
                  prawidłowego działania, poprawy jakości korzystania z serwisu oraz, za Twoją
                  zgodą, analizy ruchu i prowadzenia działań marketingowych. Możesz zaakceptować
                  wszystkie cookies, odrzucić opcjonalne cookies lub dostosować swoje preferencje.
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-2 text-[0.8125rem]">
                  {policyLinks}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:justify-end">
              <Button type="button" variant="quiet" onClick={openPrefs} className="sm:order-1">
                Dostosuj
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => commit(ALL_DENIED)}
                className="sm:order-2"
              >
                Odrzuć opcjonalne
              </Button>
              <Button type="button" onClick={() => commit(ALL_GRANTED)} className="sm:order-3">
                Akceptuję wszystkie
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ---------------------------------------------------------------
          CENTRUM PREFERENCJI
          --------------------------------------------------------------- */}
      {showPrefs ? (
        <div
          className="fixed inset-0 z-70 flex items-end justify-center p-0 sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-prefs-tytul"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={closePrefs}
            className="absolute inset-0 bg-brand/55 backdrop-blur-sm"
          />

          <div
            ref={dialogRef}
            className="pop-in relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.5rem] border border-line bg-surface shadow-float sm:rounded-card"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
              <div>
                <h2 id="cookie-prefs-tytul" className="text-xl font-bold tracking-[-0.02em] text-ink">
                  Ustawienia cookies
                </h2>
                <p className="body-text mt-1.5 text-[0.875rem]">
                  Zdecyduj, z czego możemy korzystać. Ustawienia zmienisz w każdej chwili.
                </p>
              </div>
              <button
                type="button"
                onClick={closePrefs}
                aria-label="Zamknij ustawienia cookies"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border border-line-strong text-ink transition-colors hover:bg-surface-2"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-5 rounded-control bg-surface-inset p-4">
                <div>
                  <h3 className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
                    <Lock className="h-4 w-4 text-accent" aria-hidden="true" />
                    Niezbędne
                    <span className="rounded-pill bg-accent-soft px-2 py-0.5 text-[0.6875rem] font-semibold text-accent">
                      Zawsze aktywne
                    </span>
                  </h3>
                  <p className="body-text mt-1.5 text-[0.8125rem]">{NECESSARY_DESCRIPTION}</p>
                </div>
                <Switch checked disabled onChange={() => {}} label="Niezbędne, zawsze aktywne" />
              </div>

              <ul className="mt-2">
                {OPTIONAL_CATEGORIES.map((category) => (
                  <li
                    key={category.key}
                    className="flex items-start justify-between gap-5 border-b border-line p-4 last:border-b-0"
                  >
                    <div>
                      <h3 className="text-[0.9375rem] font-bold text-ink">{category.label}</h3>
                      <p className="body-text mt-1.5 text-[0.8125rem]">{category.description}</p>
                    </div>
                    <Switch
                      checked={draft[category.key]}
                      onChange={(next) =>
                        setDraft((prev) => ({ ...prev, [category.key]: next }) as ConsentCategories)
                      }
                      label={`Cookies ${category.label.toLowerCase()}`}
                    />
                  </li>
                ))}
              </ul>

              <p className="mt-4 flex flex-wrap items-center gap-2 text-[0.8125rem]">
                {policyLinks}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 border-t border-line bg-surface-inset px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
              <Button
                type="button"
                variant="quiet"
                onClick={() => commit(ALL_DENIED)}
                className="sm:order-1"
              >
                Odrzuć opcjonalne
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => commit(ALL_GRANTED)}
                className="sm:order-2"
              >
                Akceptuję wszystkie
              </Button>
              <Button type="button" onClick={() => commit(draft)} className="sm:order-3">
                Zapisz preferencje
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export type { OptionalCategory };
