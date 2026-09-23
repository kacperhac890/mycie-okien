import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* GitHub Pages serwuje projekt w podkatalogu (/nazwa-repo/), a lokalny dev
   w katalogu głównym. Ścieżkę bazową ustawia workflow przez BASE_PATH. */
const base = process.env.BASE_PATH ?? '/';

/* ==================================================================
   DANE FIRMY W index.html

   Tytuł, Open Graph i dane strukturalne muszą siedzieć w statycznym HTML,
   bo wyszukiwarki i podglądy linków czytają je przed uruchomieniem
   JavaScriptu. Jednocześnie firma edytuje te dane w panelu.

   Rozwiązanie: panel zapisuje public/content.json, a ten plugin wstawia
   z niego wartości w czasie budowania. Jedno źródło prawdy, bez ręcznego
   dublowania danych w dwóch miejscach.
   ================================================================== */

const FALLBACK = {
  name: '[NAZWA FIRMY]',
  phone: '[+48 000 000 000]',
  email: '[kontakt@twojadomena.pl]',
  street: '[ul. Przykładowa 1]',
  postalCode: '[00-000]',
  city: '[MIASTO]',
};

function readCompany(): Record<string, string> {
  try {
    const raw: unknown = JSON.parse(readFileSync('public/content.json', 'utf8'));
    if (typeof raw === 'object' && raw !== null && 'company' in raw) {
      const company = (raw as { company: unknown }).company;
      if (typeof company === 'object' && company !== null) {
        return company as Record<string, string>;
      }
    }
  } catch {
    /* Brak pliku albo uszkodzony JSON: zostają wartości domyślne. */
  }
  return {};
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* Wewnątrz <script type="application/ld+json"> encje HTML nie są dekodowane,
   więc tam potrzebne jest escapowanie w stylu JSON, a nie HTML. */
const escapeJson = (value: string) => JSON.stringify(value).slice(1, -1);

/** Numer w formie E.164 do danych strukturalnych. */
function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return phone;
  return digits.length === 9 ? `+48${digits}` : `+${digits}`;
}

function companyInHtml(): Plugin {
  return {
    name: 'dane-firmy-w-html',
    transformIndexHtml(html) {
      const company = readCompany();
      const get = (key: keyof typeof FALLBACK) => {
        const value = company[key];
        return typeof value === 'string' && value.trim() ? value : FALLBACK[key];
      };

      const fields: Record<string, string> = {
        NAZWA: get('name'),
        TELEFON: normalizePhone(get('phone')),
        EMAIL: get('email'),
        ULICA: get('street'),
        KOD: get('postalCode'),
        MIASTO: get('city'),
      };

      let out = html;
      for (const [key, value] of Object.entries(fields)) {
        out = out.replaceAll(`%FIRMA_${key}%`, escapeHtml(value));
        out = out.replaceAll(`%JSON_FIRMA_${key}%`, escapeJson(value));
      }
      return out;
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), companyInHtml()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        /* Stałe nazwy plików zamiast nazw z hashem.

           GitHub Pages serwuje KAŻDY plik z Cache-Control: max-age=600,
           także te z hashem, więc hashowanie nic tu nie daje, a szkodzi:
           przez 10 minut po wdrożeniu przeglądarka może mieć w pamięci
           stary index.html wskazujący na plik, który po przebudowie już
           nie istnieje. Efektem jest 404 na skrypcie i pusta strona.

           Przy stałych nazwach stary index.html trafia zawsze w istniejący
           plik. Najgorsze, co się może zdarzyć, to zasoby sprzed 10 minut. */
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
