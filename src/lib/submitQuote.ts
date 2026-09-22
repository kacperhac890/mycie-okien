import type { QuoteData } from "../components/quote/types";
import { buildFields, sendToProvider } from "./formProviders";

/* ==================================================================
   WYSYŁKA ZAPYTANIA

   Cała logika wyboru dostawcy siedzi w formProviders.ts i jest sterowana
   zmiennymi z pliku .env. Tutaj zostaje tylko kształt danych, przydatny
   przy podpinaniu własnego backendu, CRM-u albo webhooka.
   ================================================================== */

export type QuotePayload = Omit<QuoteData, "photos"> & {
  photos: { name: string; size: number; type: string }[];
  submittedAt: string;
};

export function toPayload(data: QuoteData): QuotePayload {
  const { photos, ...rest } = data;
  return {
    ...rest,
    phone: rest.phone.replace(/\s/g, ""),
    email: rest.email.trim().toLowerCase(),
    photos: photos.map((p) => ({ name: p.file.name, size: p.file.size, type: p.file.type })),
    submittedAt: new Date().toISOString(),
  };
}

/** Gotowy multipart, gdyby zapytanie miało trafić do własnego API. */
export function toFormData(data: QuoteData): FormData {
  const fd = new FormData();
  Object.entries(buildFields(data)).forEach(([key, value]) => fd.append(key, value));
  fd.append("zapytanie", JSON.stringify(toPayload(data)));
  data.photos.forEach((p, i) => fd.append(`zdjecie_${i + 1}`, p.file, p.file.name));
  return fd;
}

export async function submitQuote(data: QuoteData): Promise<void> {
  await sendToProvider(data);
}
