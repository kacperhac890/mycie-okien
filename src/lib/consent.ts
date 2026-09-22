/* ==================================================================
   ZGODY NA COOKIES
   Prosty, samodzielny mechanizm zgód. Bez zewnętrznej biblioteki CMP.

   Zasady:
   - kategorie opcjonalne są domyślnie WYŁĄCZONE,
   - brak zgody = brak ładowania skryptów opcjonalnych,
   - dalsze korzystanie ze strony nie oznacza zgody,
   - decyzję zapisujemy lokalnie (localStorage), bez danych osobowych.
   ================================================================== */

export type OptionalCategory = "functional" | "analytics" | "marketing";

export type ConsentCategories = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = ConsentCategories & {
  consentDate: string;
  policyVersion: string;
};

export const POLICY_VERSION = "1.0";
const STORAGE_KEY = "cookie-consent";

/** Nazwy cookies, których NIE kasujemy przy wycofaniu zgody. */
const NECESSARY_COOKIES: string[] = [];

export const ALL_DENIED: ConsentCategories = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

export const ALL_GRANTED: ConsentCategories = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

export const OPTIONAL_CATEGORIES: {
  key: OptionalCategory;
  label: string;
  description: string;
}[] = [
  {
    key: "functional",
    label: "Funkcjonalne",
    description:
      "Pozwalają zapamiętywać wybrane ustawienia użytkownika i zapewniają dodatkowe funkcje strony.",
  },
  {
    key: "analytics",
    label: "Analityczne",
    description:
      "Pomagają analizować sposób korzystania ze strony, dzięki czemu możemy poprawiać jej działanie i zawartość.",
  },
  {
    key: "marketing",
    label: "Marketingowe",
    description:
      "Mogą być wykorzystywane do mierzenia skuteczności reklam oraz prowadzenia działań marketingowych.",
  },
];

export const NECESSARY_DESCRIPTION =
  "Te pliki cookies są niezbędne do prawidłowego działania strony i podstawowych funkcji serwisu.";

/* ------------------------------------------------------------------
   Odczyt i zapis
   ------------------------------------------------------------------ */

function isRecord(value: unknown): value is ConsentRecord {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.functional === "boolean" &&
    typeof v.analytics === "boolean" &&
    typeof v.marketing === "boolean" &&
    typeof v.policyVersion === "string"
  );
}

export function getConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    /* Nowa wersja polityki unieważnia poprzednią zgodę. */
    if (parsed.policyVersion !== POLICY_VERSION) return null;
    return parsed;
  } catch {
    /* Tryb prywatny lub zablokowany storage: traktujemy jak brak zgody. */
    return null;
  }
}

const listeners = new Set<(record: ConsentRecord | null) => void>();

export function subscribeConsent(fn: (record: ConsentRecord | null) => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) fn(getConsent());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    ...categories,
    necessary: true,
    consentDate: new Date().toISOString(),
    policyVersion: POLICY_VERSION,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    /* Brak storage nie może blokować strony. Zgoda obowiązuje wtedy
       tylko w ramach bieżącej sesji przeglądarki. */
  }

  applyConsent(record);
  listeners.forEach((fn) => fn(record));
  return record;
}

/* ------------------------------------------------------------------
   Otwieranie centrum preferencji z dowolnego miejsca w serwisie
   (np. link „Ustawienia cookies” w stopce).
   ------------------------------------------------------------------ */

const OPEN_EVENT = "cookie-preferences:open";

export function openCookiePreferences() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export function onOpenCookiePreferences(fn: () => void) {
  window.addEventListener(OPEN_EVENT, fn);
  return () => window.removeEventListener(OPEN_EVENT, fn);
}

/* ------------------------------------------------------------------
   Realne egzekwowanie zgody
   ------------------------------------------------------------------ */

export type GatedScript = {
  /** Unikalny identyfikator, używany też jako id znacznika <script>. */
  id: string;
  category: OptionalCategory;
  src: string;
  attrs?: Record<string, string>;
  /** Kod wykonywany po załadowaniu pliku, np. inicjalizacja narzędzia. */
  onLoad?: () => void;
};

/* ==================================================================
   REJESTR SKRYPTÓW WARUNKOWYCH

   Stan faktyczny: serwis NIE korzysta obecnie z żadnych narzędzi
   analitycznych ani marketingowych, więc lista jest pusta. Nie wpisujemy
   tu narzędzi „na zapas”.

   Dodając narzędzie, dopisz je poniżej, a system zgód sam zadba o to,
   żeby nie uruchomiło się przed uzyskaniem zgody. Przykład:

   { id: "ga4", category: "analytics",
     src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX",
     onLoad: () => { ... } }

   Pamiętaj też o uzupełnieniu tabeli cookies na /polityka-cookies.
   ================================================================== */
export const gatedScripts: GatedScript[] = [];

function removeScript(id: string) {
  document.getElementById(id)?.remove();
}

/** Best effort: wygaszenie cookies spoza listy niezbędnych. */
function clearOptionalCookies() {
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name) && !NECESSARY_COOKIES.includes(name));

  const host = window.location.hostname;
  const domains = [host, `.${host}`, ""];

  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/${
        domain ? `; domain=${domain}` : ""
      }`;
    }
  }
}

/**
 * Ładuje skrypty, na które użytkownik wyraził zgodę, i usuwa te, na które
 * zgody nie ma. Usunięcie znacznika nie cofa skutków już wykonanego kodu,
 * dlatego dodatkowo czyścimy cookies opcjonalne.
 */
export function applyConsent(record: ConsentRecord | null) {
  if (typeof document === "undefined") return;

  let revoked = false;

  for (const script of gatedScripts) {
    const granted = record ? record[script.category] : false;

    if (!granted) {
      if (document.getElementById(script.id)) revoked = true;
      removeScript(script.id);
      continue;
    }

    if (document.getElementById(script.id)) continue;

    const el = document.createElement("script");
    el.id = script.id;
    el.src = script.src;
    el.async = true;
    Object.entries(script.attrs ?? {}).forEach(([k, v]) => el.setAttribute(k, v));
    if (script.onLoad) el.addEventListener("load", script.onLoad);
    document.head.appendChild(el);
  }

  if (revoked) clearOptionalCookies();
}
