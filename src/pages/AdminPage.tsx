import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, RotateCcw } from "lucide-react";
import { AdminLock } from "../components/admin/AdminLock";
import { GalleryEditor } from "../components/admin/GalleryEditor";
import { ImagesEditor } from "../components/admin/ImagesEditor";
import { PublishPanel } from "../components/admin/PublishPanel";
import { TestimonialsEditor } from "../components/admin/TestimonialsEditor";
import {
  clearDraft,
  isPreviewOn,
  loadPublishedContent,
  readDraft,
  setPreview,
  writeDraft,
} from "../content/store";
import type { SiteContent } from "../content/types";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/cn";

const UNLOCK_KEY = "admin-unlocked";

const TABS = [
  { id: "opinie", label: "Opinie" },
  { id: "zdjecia", label: "Zdjęcia sekcji" },
  { id: "realizacje", label: "Realizacje" },
  { id: "publikacja", label: "Publikacja" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return window.sessionStorage.getItem(UNLOCK_KEY) === "1";
    } catch {
      return false;
    }
  });

  const [base, setBase] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<TabId>("opinie");
  const [preview, setPreviewState] = useState(() => isPreviewOn());
  const [storageWarning, setStorageWarning] = useState(false);

  /* Panel nie powinien trafiać do wyszukiwarek. */
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Panel treści";

    /* Nadpisujemy istniejący znacznik zamiast dokładać drugi: dwa
       sprzeczne wpisy robots to prosta droga do pomyłki wyszukiwarki. */
    const existing = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const meta = existing ?? document.createElement("meta");
    const previousRobots = existing?.content ?? null;
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    if (!existing) document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;
      if (previousRobots === null) meta.remove();
      else meta.content = previousRobots;
    };
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    let active = true;

    loadPublishedContent().then((published) => {
      if (!active) return;
      setBase(published);
      setDraft(readDraft() ?? published);
    });

    return () => {
      active = false;
    };
  }, [unlocked]);

  const dirty = useMemo(() => {
    if (!base || !draft) return false;
    return JSON.stringify(base) !== JSON.stringify(draft);
  }, [base, draft]);

  function update(next: SiteContent) {
    setDraft(next);
    setStorageWarning(!writeDraft(next));
  }

  function unlock() {
    try {
      window.sessionStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      /* brak storage: panel działa, tylko trzeba wpisać hasło ponownie */
    }
    setUnlocked(true);
  }

  function discard() {
    clearDraft();
    setDraft(base);
    setStorageWarning(false);
  }

  function togglePreview() {
    const next = !preview;
    setPreview(next);
    setPreviewState(next);
  }

  if (!unlocked) return <AdminLock onUnlock={unlock} />;

  if (!draft || !base) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center gap-3 text-ink-soft">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        Wczytuję treść strony
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 md:pt-28">
      <div className="shell">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-ink-soft transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Wróć na stronę
            </Link>
            <h1 className="h-section mt-4 text-ink">Panel treści</h1>
            <p className="body-text mt-2 text-[0.875rem]">
              {dirty
                ? "Masz niezapisane zmiany. Zapisują się w tej przeglądarce, na stronie pojawią się po publikacji."
                : "Wszystko zapisane. Treść na stronie jest zgodna z panelem."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={togglePreview}>
              {preview ? (
                <>
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                  Wyłącz podgląd
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Podgląd na stronie
                </>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={discard} disabled={!dirty}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Odrzuć zmiany
            </Button>
          </div>
        </div>

        {preview ? (
          <p className="mt-5 rounded-control border border-accent bg-accent-soft px-4 py-3 text-[0.8125rem] font-medium text-ink">
            Podgląd włączony: strona główna pokazuje teraz Twój szkic. Widzisz go tylko Ty, w tej
            karcie przeglądarki.
          </p>
        ) : null}

        {storageWarning ? (
          <p
            role="alert"
            className="mt-5 rounded-control border border-danger bg-danger-soft px-4 py-3 text-[0.8125rem] font-medium text-danger"
          >
            Nie udało się zapisać szkicu w przeglądarce, prawdopodobnie przez rozmiar zdjęć.
            Opublikuj zmiany albo usuń część zdjęć, zanim zamkniesz kartę.
          </p>
        ) : null}

        <nav aria-label="Sekcje panelu" className="mt-8 border-b border-line">
          <ul className="-mb-px flex flex-wrap gap-1">
            {TABS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={tab === item.id ? "page" : undefined}
                  className={cn(
                    "border-b-2 px-4 py-3 text-[0.9375rem] font-semibold transition-colors",
                    tab === item.id
                      ? "border-accent text-ink"
                      : "border-transparent text-ink-soft hover:text-ink",
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <form className="mt-8" onSubmit={(e: FormEvent) => e.preventDefault()}>
          {tab === "opinie" ? (
            <TestimonialsEditor
              items={draft.testimonials}
              onChange={(testimonials) => update({ ...draft, testimonials })}
            />
          ) : null}

          {tab === "zdjecia" ? (
            <ImagesEditor images={draft.images} onChange={(images) => update({ ...draft, images })} />
          ) : null}

          {tab === "realizacje" ? (
            <GalleryEditor
              items={draft.gallery}
              onChange={(gallery) => update({ ...draft, gallery })}
            />
          ) : null}

          {tab === "publikacja" ? (
            <PublishPanel
              draft={draft}
              dirty={dirty}
              onPublished={(published) => {
                setBase(published);
                setDraft(published);
                writeDraft(published);
                setStorageWarning(false);
              }}
            />
          ) : null}
        </form>
      </div>
    </div>
  );
}
