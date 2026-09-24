import { labelOf } from "./options";
import type { QuoteData, ServiceId } from "./types";

/* Jedno miejsce, w którym szczegóły usług zamieniają się na pary
   „etykieta: wartość”. Używa tego zarówno podsumowanie w formularzu, jak
   i treść zapytania wysyłanego mailem, więc klient i wykonawca widzą
   dokładnie to samo. */

export type DetailRow = { term: string; value: string };

const clean = (rows: (DetailRow | null)[]): DetailRow[] =>
  rows.filter((row): row is DetailRow => row !== null && row.value.trim().length > 0);

const optional = (term: string, value: string): DetailRow | null =>
  value.trim() ? { term, value: value.trim() } : null;

export function formatAddressLine(data: QuoteData) {
  return [data.postalCode, data.city].filter(Boolean).join(" ") || "nie podano";
}

export function serviceDetailRows(id: ServiceId, data: QuoteData): DetailRow[] {
  switch (id) {
    case "mycie-okien":
      return clean([
        {
          term: "Przeszklenia",
          value: data.glazingTypes.map(labelOf.glazing).join(", ") || "nie wybrano",
        },
        {
          term: "Liczba",
          value: data.quantity === null ? "trudno określić" : String(data.quantity),
        },
        { term: "Rozmiar", value: data.size ? labelOf.size(data.size) : "nie wybrano" },
      ]);

    case "mycie-elewacji":
      return clean([
        {
          term: "Rodzaj elewacji",
          value: data.facadeType ? labelOf.facade(data.facadeType) : "nie wybrano",
        },
        optional("Powierzchnia", data.facadeArea),
        optional("Kondygnacje", data.facadeFloors),
      ]);

    case "deratyzacja":
      return clean([
        {
          term: "Obiekt",
          value: data.pestPlace ? labelOf.pestPlace(data.pestPlace) : "nie wybrano",
        },
        data.pestMode ? { term: "Zakres", value: labelOf.pestMode(data.pestMode) } : null,
        optional("Metraż", data.pestArea),
      ]);

    case "przeprowadzki":
      return clean([
        {
          term: "Zakres",
          value: data.moveSize ? labelOf.moveSize(data.moveSize) : "nie wybrano",
        },
        optional("Skąd", data.moveFrom),
        optional("Dokąd", data.moveTo),
        data.moveExtras.length
          ? { term: "Dodatkowo", value: data.moveExtras.map(labelOf.moveExtra).join(", ") }
          : null,
      ]);

    case "utylizacja-odpadow":
      return clean([
        {
          term: "Rodzaj odpadów",
          value: data.wasteTypes.map(labelOf.waste).join(", ") || "nie wybrano",
        },
        data.wasteAmount
          ? { term: "Ilość", value: labelOf.wasteAmount(data.wasteAmount) }
          : null,
      ]);

    case "utylizacja-opon":
      return clean([
        {
          term: "Rodzaj opon",
          value: data.tyreTypes.map(labelOf.tyre).join(", ") || "nie wybrano",
        },
        { term: "Liczba", value: String(data.tyreCount) },
        { term: "Na felgach", value: data.tyreOnRims ? "tak" : "nie" },
      ]);

    default:
      return [];
  }
}
