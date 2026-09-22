# Strona firmy myjącej okna i przeszklenia

Landing page zbudowany pod jeden cel: zapytanie o wycenę. React 19 + TypeScript +
Tailwind CSS v4 + Vite, bez zbędnych zależności.

**Podgląd na żywo:** https://kacperhac890.github.io/mycie-okien/

```bash
npm install
npm run dev        # http://localhost:5190
npm run build      # produkcja do ./dist
npm run typecheck
```

---

## 1. Co trzeba uzupełnić przed publikacją

Wszystko, co jest `[W NAWIASACH KWADRATOWYCH]`, to placeholder. Nic z tego nie jest
prawdziwą daną firmy.

| Co                                     | Gdzie                                             |
| -------------------------------------- | ------------------------------------------------- |
| Nazwa, telefon, e-mail, adres, NIP      | `src/data/site.ts` -> `company`                    |
| Obszar działania                        | `src/data/site.ts` -> `company.area`               |
| Dane strukturalne (LocalBusiness) i SEO | `index.html`                                       |
| Domena w canonical, OG, robots, sitemap | `index.html`, `public/robots.txt`, `public/sitemap.xml`, `src/data/legal.ts` |
| Data aktualizacji dokumentów prawnych   | `src/data/legal.ts` -> `LEGAL_UPDATED`             |
| Opinie klientów                         | `src/data/site.ts` -> `testimonials`               |
| Realizacje przed/po                     | `src/data/gallery.ts`                              |
| Zdjęcia sekcji                          | `src/data/images.ts`                               |
| Treści FAQ i sekcji „jakość”            | `src/data/site.ts` -> `faq`, `quality`             |
| Logo                                    | `src/components/ui/Logo.tsx`, `public/favicon.svg` |

Sekcja opinii i galeria celowo zawierają widoczne placeholdery zamiast wymyślonych
treści. Wystarczy podmienić dane w plikach wskazanych wyżej.

---

## 2. Formularz wyceny: podpięcie darmowej usługi

Domyślnie formularz działa w trybie `mock`: waliduje dane, pokazuje podsumowanie i ekran
podziękowania, ale niczego nie wysyła. Żeby zgłoszenia trafiały na maila, skopiuj
`.env.example` do `.env` i wybierz dostawcę.

```bash
cp .env.example .env
```

### Porównanie darmowych opcji

| Dostawca       | Konto      | Limit darmowy          | Zdjęcia w zgłoszeniu                  |
| -------------- | ---------- | ---------------------- | ------------------------------------- |
| **FormSubmit** | niepotrzebne | bez twardego limitu    | **tak**, do 10 MB na zgłoszenie       |
| Web3Forms      | niepotrzebne (klucz mailem) | hojny darmowy plan | nie (załączniki w planie PRO)   |
| Formspree      | tak        | 50 zgłoszeń / miesiąc  | nie (od planu płatnego)               |
| Netlify Forms  | tak        | zależnie od planu      | tak, ale tylko przy hostingu na Netlify |
| Własny endpoint | -         | -                      | tak                                   |

**Rekomendacja: FormSubmit**, bo jako jedyny w wersji darmowej przyjmuje zdjęcia,
a zdjęcia realnie skracają drogę do wyceny.

```env
VITE_FORM_PROVIDER=formsubmit
VITE_FORMSUBMIT_TARGET=twoj@email.pl
```

Przy pierwszym wysłanym zgłoszeniu FormSubmit przyśle mail aktywacyjny. Po jego
kliknięciu kolejne zgłoszenia lecą już normalnie. W panelu możesz wygenerować losowy
ciąg zamiast adresu e-mail i wpisać go w `VITE_FORMSUBMIT_TARGET`, żeby nie publikować
maila w kodzie strony.

Pozostałe warianty (`web3forms`, `formspree`, `netlify`, `custom`) są opisane
w `.env.example`, a ich implementacja siedzi w `src/lib/formProviders.ts`. Dodanie
kolejnego dostawcy to jeden `case` w `sendToProvider`.

### Zdjęcia

Przed wysyłką zdjęcia są skalowane w przeglądarce do 1600 px dłuższego boku i zapisywane
jako JPEG (`src/lib/compressImage.ts`). Zdjęcie z telefonu schodzi z ~5 MB do kilkuset
kilobajtów, więc mieści się w limitach darmowych usług i szybciej się wysyła.
Limity: do 8 zdjęć, maks. 9 MB łącznie po kompresji.

---

## 3. Cookies i zgody

- Baner pojawia się przy pierwszej wizycie. Kategorie opcjonalne są domyślnie wyłączone.
- Wybór zapisujemy w `localStorage` pod kluczem `cookie-consent` razem z datą i wersją
  polityki. Bez danych osobowych.
- „Ustawienia cookies” w stopce otwiera centrum preferencji w dowolnym momencie.
- Podniesienie `POLICY_VERSION` w `src/lib/consent.ts` unieważnia wcześniejsze zgody
  i pokazuje baner ponownie.

### Dodanie narzędzia analitycznego lub reklamowego

Serwis nie ładuje obecnie żadnych trackerów. Nowe narzędzie dopisz do tablicy
`gatedScripts` w `src/lib/consent.ts`:

```ts
export const gatedScripts: GatedScript[] = [
  {
    id: "ga4",
    category: "analytics",
    src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX",
    onLoad: () => {
      /* inicjalizacja */
    },
  },
];
```

Skrypt zostanie wstrzyknięty dopiero po zgodzie na daną kategorię, a po jej wycofaniu
znacznik jest usuwany i czyszczone są cookies opcjonalne. Pamiętaj o uzupełnieniu tabeli
na `/polityka-cookies` oraz listy odbiorców w polityce prywatności.

---

## 4. Podstrony

| Ścieżka                  | Zawartość                    |
| ------------------------ | ---------------------------- |
| `/`                      | Landing page                 |
| `/polityka-prywatnosci`  | Polityka prywatności (RODO)  |
| `/polityka-cookies`      | Polityka cookies + tabela    |
| dowolna inna             | Strona 404 z powrotem do CTA |

Routing opiera się na `react-router-dom` w trybie `BrowserRouter`, więc serwer musi
kierować wszystkie ścieżki do `index.html`:

- **GitHub Pages:** brak przepisywania po stronie serwera, dlatego `npm run build`
  tworzy kopię `dist/404.html` (skrypt `scripts/postbuild.mjs`). Podstrony działają,
  ale serwer zwraca przy nich status 404. Do indeksowania w Google lepszy jest
  hosting z prawdziwym przepisywaniem adresów.
- **Netlify:** plik `public/_redirects` z wpisem `/* /index.html 200`
- **Vercel:** `vercel.json` z `rewrites` na `/index.html`
- **Apache:** reguła `FallbackResource /index.html`
- **nginx:** `try_files $uri $uri/ /index.html;`

### Wdrożenie na GitHub Pages

Push do `main` uruchamia `.github/workflows/deploy.yml`, który buduje projekt
i publikuje go przez GitHub Actions.

- Ścieżkę bazową ustawia zmienna `BASE_PATH` w workflow (`/mycie-okien/`). Przy
  zmianie nazwy repozytorium trzeba ją poprawić.
- Konfiguracja formularza pochodzi ze **zmiennych repozytorium**
  (Settings → Secrets and variables → Actions → Variables):
  `VITE_FORM_PROVIDER` i `VITE_FORMSUBMIT_TARGET`. Plik `.env` nie trafia do
  repozytorium, więc bez tych zmiennych build wróci do trybu `mock`.
- Pages musi mieć ustawione źródło **GitHub Actions** (Settings → Pages).

Po podpięciu własnej domeny podmień adres w `index.html` (canonical, Open Graph,
dane strukturalne), `public/robots.txt`, `public/sitemap.xml` i `src/data/legal.ts`.

Dokumenty prawne to materiał wyjściowy, nie porada prawna. Fragmenty oznaczone
`[DO UZUPEŁNIENIA]` wymagają decyzji właściciela serwisu.

---

## 5. Struktura

```
src/
  components/
    quote/          formularz wyceny: kroki, walidacja, podsumowanie, sukces
    cookies/        baner i centrum preferencji
    legal/          wspólny layout dokumentów prawnych
    ui/             Button, Reveal, Logo
  data/             treści i dane firmy (site, images, gallery, legal)
  hooks/            IntersectionObserver do animacji wejścia
  lib/              walidacja, wysyłka, zgody, kompresja zdjęć
  pages/            HomePage, polityki
  styles/index.css  tokeny designu, typografia, animacje
```

### Zasady, które warto utrzymać

- **Kolory tylko przez tokeny** z `:root` w `src/styles/index.css`. Żadnych hexów
  w komponentach. Tryb ciemny działa automatycznie przez `prefers-color-scheme`.
- **Jeden akcent** (azure) i jeden system zaokrągleń: przyciski pill, karty 16 px,
  pola formularza 12 px.
- **Animacje tylko na `opacity` i `transform`**, wygaszane przez
  `prefers-reduced-motion`. Zero nasłuchiwaczy `scroll`, wszędzie IntersectionObserver.
- **Treści w `src/data/`**, komponenty zostają czyste.

---

## 6. Dostępność

Formularz da się przejść samą klawiaturą, błędy są ogłaszane przez `role="alert"`,
progres ma `aria-current="step"`, FAQ używa `aria-expanded`, a wszystkie cele dotykowe
mają co najmniej 44 px. Kontrast tekstu i przycisków spełnia WCAG AA w obu motywach.

## 7. Zdjęcia

Materiał zastępczy pochodzi z Unsplash (licencja Unsplash, użycie komercyjne dozwolone).
Po podmianie na własne zdjęcia realizacji wgraj pliki do `public/` i ustaw `local: true`
w `src/data/images.ts` oraz `src/data/gallery.ts`.
