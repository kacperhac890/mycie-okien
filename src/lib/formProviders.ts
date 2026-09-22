import type { QuoteData } from "../components/quote/types";
import { labelOf } from "../components/quote/options";

/* ==================================================================
   DOSTAWCY OBSŁUGI FORMULARZA

   Strona jest statyczna (Vite + React), więc formularz potrzebuje
   zewnętrznej usługi, która przyjmie zgłoszenie i wyśle je mailem.
   Poniżej są gotowe integracje z darmowymi rozwiązaniami. Wybór i klucze
   ustawiasz w pliku .env (wzór w .env.example), bez zmian w kodzie.

   Stan na moment wdrożenia, zweryfikowany w dokumentacji dostawców:

   - formsubmit  FormSubmit (formsubmit.co)
                 Darmowe, bez zakładania konta. Obsługuje załączniki
                 natywnie, suma plików w jednym zgłoszeniu do 10 MB.
                 Przy pierwszym wysłaniu dostajesz mail aktywacyjny.
                 -> najlepszy wybór, jeśli chcesz dostawać zdjęcia.

   - web3forms   Web3Forms (web3forms.com)
                 Darmowy klucz dostępu, bez konta. Załączniki są płatne
                 (plan PRO), dlatego w wersji darmowej wysyłamy tylko
                 nazwy plików.

   - formspree   Formspree (formspree.io)
                 Plan darmowy: 50 zgłoszeń miesięcznie, bez przesyłania
                 plików (to funkcja planów płatnych).

   - netlify     Netlify Forms. Działa tylko przy hostingu na Netlify.
                 Wymaga statycznego formularza w index.html (instrukcja
                 w README) i obsługuje pliki.

   - custom      Własny endpoint (np. funkcja serverless, n8n, Make,
                 webhook do CRM). Wysyłamy multipart/form-data.

   - mock        Domyślny tryb deweloperski: nic nie wysyła, loguje dane
                 w konsoli. Używany, dopóki nie ustawisz dostawcy.
   ================================================================== */

export type ProviderId =
  | "mock"
  | "formsubmit"
  | "web3forms"
  | "formspree"
  | "netlify"
  | "custom";

type Env = {
  provider: ProviderId;
  formsubmitTarget?: string;
  web3formsKey?: string;
  formspreeId?: string;
  customEndpoint?: string;
  netlifyFormName: string;
  attachmentsOverride?: boolean;
};

function readEnv(): Env {
  const env = import.meta.env;
  const provider = (env.VITE_FORM_PROVIDER ?? "mock") as ProviderId;
  const attachments = env.VITE_FORM_ATTACHMENTS;

  return {
    provider,
    formsubmitTarget: env.VITE_FORMSUBMIT_TARGET,
    web3formsKey: env.VITE_WEB3FORMS_KEY,
    formspreeId: env.VITE_FORMSPREE_ID,
    customEndpoint: env.VITE_FORM_ENDPOINT,
    netlifyFormName: env.VITE_NETLIFY_FORM_NAME ?? "wycena",
    attachmentsOverride:
      attachments === undefined ? undefined : attachments === "true" || attachments === "1",
  };
}

/* ------------------------------------------------------------------
   Czytelna treść wiadomości. Dzięki temu w skrzynce ląduje zgłoszenie,
   które da się przeczytać bez odkodowywania JSON-a.
   ------------------------------------------------------------------ */

export function buildFields(data: QuoteData): Record<string, string> {
  const extras =
    data.additionalServices.length === 0 || data.additionalServices.includes("brak")
      ? "samo mycie szyb"
      : data.additionalServices.map(labelOf.extra).join(", ");

  return {
    "Rodzaj usługi": data.serviceType ? labelOf.serviceType(data.serviceType) : "nie wybrano",
    Przeszklenia: data.glazingTypes.map(labelOf.glazing).join(", ") || "nie wybrano",
    Liczba: data.quantity === null ? "trudno określić" : String(data.quantity),
    Rozmiar: data.size ? labelOf.size(data.size) : "nie wybrano",
    "Dodatkowe usługi": extras,
    "Imię / nazwa firmy": data.name.trim(),
    "Osoba kontaktowa / firma": data.company.trim() || "nie podano",
    Telefon: data.phone.replace(/\s/g, ""),
    "E-mail": data.email.trim().toLowerCase(),
    Lokalizacja: [data.postalCode, data.city].filter(Boolean).join(" ") || "nie podano",
    Uwagi: data.notes.trim() || "brak",
    Zdjęcia: data.photos.length ? `${data.photos.length}` : "brak",
    "Zgoda na kontakt": data.consent ? "tak" : "nie",
    "Data zgłoszenia": new Date().toLocaleString("pl-PL"),
  };
}

function buildMessage(fields: Record<string, string>) {
  return Object.entries(fields)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function appendFields(fd: FormData, fields: Record<string, string>) {
  Object.entries(fields).forEach(([key, value]) => fd.append(key, value));
}

function appendPhotos(fd: FormData, data: QuoteData, fieldName: string) {
  data.photos.forEach((photo, i) => {
    fd.append(`${fieldName}_${i + 1}`, photo.file, photo.file.name);
  });
}

async function ensureOk(response: Response, provider: ProviderId) {
  if (response.ok) return;
  let detail = "";
  try {
    detail = (await response.text()).slice(0, 300);
  } catch {
    /* treść błędu jest opcjonalna */
  }
  throw new Error(`[${provider}] ${response.status} ${response.statusText} ${detail}`.trim());
}

/* ------------------------------------------------------------------
   Właściwa wysyłka
   ------------------------------------------------------------------ */

const SUBJECT = "Nowe zapytanie o wycenę ze strony";

export async function sendToProvider(data: QuoteData): Promise<ProviderId> {
  const env = readEnv();
  const fields = buildFields(data);
  const message = buildMessage(fields);

  switch (env.provider) {
    /* ---------------------------------------------------------- */
    case "formsubmit": {
      if (!env.formsubmitTarget) {
        throw new Error("Brak VITE_FORMSUBMIT_TARGET w konfiguracji.");
      }
      const withFiles = env.attachmentsOverride ?? true;
      const fd = new FormData();
      appendFields(fd, fields);
      fd.append("_subject", SUBJECT);
      fd.append("_template", "table");
      fd.append("_captcha", "false");
      fd.append("email", fields["E-mail"]);
      if (withFiles) appendPhotos(fd, data, "attachment");

      const res = await fetch(`https://formsubmit.co/ajax/${env.formsubmitTarget}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      await ensureOk(res, "formsubmit");
      /* FormSubmit potrafi odpowiedzieć kodem 200 z informacją o błędzie
         w treści, dlatego sprawdzamy też samą odpowiedź. Pole `success`
         bywa boolem albo napisem, stąd porównanie do tekstu. */
      const json: { success?: boolean | string; message?: string } = await res
        .json()
        .catch(() => ({}));
      if (json.success !== undefined && String(json.success) !== "true") {
        throw new Error(`[formsubmit] ${json.message ?? "odrzucone zgłoszenie"}`);
      }
      return "formsubmit";
    }

    /* ---------------------------------------------------------- */
    case "web3forms": {
      if (!env.web3formsKey) throw new Error("Brak VITE_WEB3FORMS_KEY w konfiguracji.");
      /* Załączniki są funkcją planu PRO, więc domyślnie ich nie wysyłamy. */
      const withFiles = env.attachmentsOverride ?? false;
      const fd = new FormData();
      fd.append("access_key", env.web3formsKey);
      fd.append("subject", SUBJECT);
      fd.append("from_name", fields["Imię / nazwa firmy"] || "Formularz wyceny");
      fd.append("email", fields["E-mail"]);
      appendFields(fd, fields);
      fd.append("message", message);
      if (withFiles) appendPhotos(fd, data, "attachment");

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      await ensureOk(res, "web3forms");
      const json: { success?: boolean; message?: string } = await res.json();
      if (!json.success) throw new Error(`[web3forms] ${json.message ?? "odrzucone zgłoszenie"}`);
      return "web3forms";
    }

    /* ---------------------------------------------------------- */
    case "formspree": {
      if (!env.formspreeId) throw new Error("Brak VITE_FORMSPREE_ID w konfiguracji.");
      /* Plan darmowy nie obejmuje przesyłania plików. */
      const withFiles = env.attachmentsOverride ?? false;
      const fd = new FormData();
      appendFields(fd, fields);
      fd.append("_subject", SUBJECT);
      fd.append("message", message);
      if (withFiles) appendPhotos(fd, data, "zdjecie");

      const res = await fetch(`https://formspree.io/f/${env.formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      await ensureOk(res, "formspree");
      return "formspree";
    }

    /* ---------------------------------------------------------- */
    case "netlify": {
      const withFiles = env.attachmentsOverride ?? true;
      const fd = new FormData();
      fd.append("form-name", env.netlifyFormName);
      appendFields(fd, fields);
      fd.append("message", message);
      if (withFiles) appendPhotos(fd, data, "zdjecie");

      const res = await fetch("/", { method: "POST", body: fd });
      await ensureOk(res, "netlify");
      return "netlify";
    }

    /* ---------------------------------------------------------- */
    case "custom": {
      if (!env.customEndpoint) throw new Error("Brak VITE_FORM_ENDPOINT w konfiguracji.");
      const withFiles = env.attachmentsOverride ?? true;
      const fd = new FormData();
      appendFields(fd, fields);
      fd.append("message", message);
      if (withFiles) appendPhotos(fd, data, "zdjecie");

      const res = await fetch(env.customEndpoint, { method: "POST", body: fd });
      await ensureOk(res, "custom");
      return "custom";
    }

    /* ---------------------------------------------------------- */
    default: {
      /* Tryb makiety: symulujemy opóźnienie sieci i logujemy dane. */
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.info("[wycena] tryb mock, nic nie wysłano. Dane zgłoszenia:", {
          fields,
          photos: data.photos.map((p) => ({
            name: p.file.name,
            size: p.file.size,
            type: p.file.type,
          })),
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 900));
      return "mock";
    }
  }
}
