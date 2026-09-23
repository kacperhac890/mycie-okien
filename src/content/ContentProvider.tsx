import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { defaultContent } from "./defaults";
import { isPreviewOn, loadPublishedContent, readDraft } from "./store";
import type { SiteContent } from "./types";

const ContentContext = createContext<SiteContent>(defaultContent);

/** Treść widoczna na stronie. Komponenty nie importują danych bezpośrednio. */
export function useContent() {
  return useContext(ContentContext);
}

export function ContentProvider({ children }: { children: ReactNode }) {
  /* Start synchroniczny: albo szkic (gdy włączony podgląd), albo domyślne.
     Dzięki temu pierwszy render nigdy nie jest pusty i nie ma przeskoku. */
  const [content, setContent] = useState<SiteContent>(() => {
    if (typeof window !== "undefined" && isPreviewOn()) {
      const draft = readDraft();
      if (draft) return draft;
    }
    return defaultContent;
  });

  useEffect(() => {
    /* W trybie podglądu nie nadpisujemy szkicu treścią opublikowaną. */
    if (isPreviewOn() && readDraft()) return;

    const controller = new AbortController();
    loadPublishedContent(controller.signal).then((published) => {
      if (!controller.signal.aborted) setContent(published);
    });
    return () => controller.abort();
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
