import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Props = {
  title: string;
  lead: string;
  updated: string;
  /** Tytuł i opis dla wyszukiwarek. */
  seo: { title: string; description: string; canonical: string };
  children: ReactNode;
  related: { label: string; to: string }[];
};

/** Prosta obsługa meta tagów bez dodatkowej biblioteki. */
function useDocumentMeta(seo: Props["seo"]) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = seo.title;

    const setTag = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
      const previous = el?.getAttribute(attr) ?? null;
      el?.setAttribute(attr, value);
      return () => {
        if (el && previous !== null) el.setAttribute(attr, previous);
      };
    };

    const restoreDescription = setTag('meta[name="description"]', "content", seo.description);
    const restoreCanonical = setTag('link[rel="canonical"]', "href", seo.canonical);
    const restoreOgTitle = setTag('meta[property="og:title"]', "content", seo.title);
    const restoreOgUrl = setTag('meta[property="og:url"]', "content", seo.canonical);

    return () => {
      document.title = previousTitle;
      restoreDescription();
      restoreCanonical();
      restoreOgTitle();
      restoreOgUrl();
    };
  }, [seo]);
}

export function LegalPage({ title, lead, updated, seo, children, related }: Props) {
  useDocumentMeta(seo);

  return (
    <article className="pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="shell">
        <div className="mx-auto max-w-[46rem]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-pill text-[0.875rem] font-semibold text-ink-soft transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Strona główna
          </Link>

          <h1 className="h-section mt-6 text-ink">{title}</h1>
          <p className="body-lead mt-4">{lead}</p>
          <p className="mt-5 text-[0.8125rem] font-semibold text-ink-faint">
            Data ostatniej aktualizacji: {updated}
          </p>

          <hr className="mt-8 border-line" />

          <div className="legal-prose mt-8">{children}</div>

          {related.length > 0 ? (
            <nav
              aria-label="Pozostałe dokumenty"
              className="mt-14 border-t border-line pt-6 text-[0.9375rem]"
            >
              <h2 className="text-[0.75rem] font-bold tracking-[0.14em] text-ink-faint uppercase">
                Zobacz również
              </h2>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {related.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="font-semibold text-accent underline underline-offset-4 hover:text-accent-hover"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </article>
  );
}
