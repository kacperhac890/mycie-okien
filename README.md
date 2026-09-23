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
| Opinie klientów                         | panel `/admin` (zakładka Opinie)                   |
| Realizacje przed/po                     | panel `/admin` (zakładka Realizacje)               |
| Zdjęcia sekcji                          | panel `/admin` (zakładka Zdjęcia sekcji)           |
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

## 3. Panel treści (/admin)

Opinie, zdjęcia sekcji i realizacje edytuje się z przeglądarki, bez dotykania kodu.

**Adres:** https://kacperhac890.github.io/mycie-okien/admin
**Domyślne hasło:** `okna-admin-2026`

### Jak to działa

1. Zmiany zapisują się najpierw jako szkic w Twojej przeglądarce. Nikt inny ich
   nie widzi. Przycisk „Podgląd na stronie" pozwala obejrzeć szkic na prawdziwej
   stronie, dalej tylko u Ciebie.
2. „Opublikuj zmiany" zapisuje plik `public/content.json` (i ewentualne nowe
   zdjęcia do `public/media/`) w repozytorium przez API GitHuba. Push uruchamia
   workflow, więc po około minucie zmiany widzą wszyscy.
3. Strona startuje z treścią wbudowaną w kod, a potem dociąga `content.json`.
   Gdy pliku nie ma albo jest uszkodzony, wraca do wersji domyślnej, zamiast się
   wywalić.

### Token GitHuba

W zakładce „Publikacja" jest przycisk **Utwórz token na GitHubie**. Otwiera
formularz z zaznaczonym z góry zakresem `public_repo`: wystarczy ustawić termin
ważności, kliknąć „Generate token" i wkleić wynik do panelu.

Węższa alternatywa: token drobnoziarnisty (Settings → Developer settings →
Fine-grained tokens) z uprawnieniem **Contents: Read and write** wyłącznie do tego
repozytorium. Panel obsługuje oba rodzaje.

Token zostaje w Twojej przeglądarce i nigdy nie trafia do kodu ani do
repozytorium. Bez tokenu nadal możesz pracować w panelu i pobrać gotowy
`content.json` przyciskiem, a potem wgrać go ręcznie przez stronę GitHuba.

### O bezpieczeństwie, bez owijania

Hasło jest sprawdzane w przeglądarce, a kod strony jest publiczny, więc **nie jest
to zabezpieczenie kryptograficzne**. Chroni przed przypadkowym wejściem, nie przed
kimś, kto zna się na rzeczy. Realną barierą jest token GitHuba: bez niego z panelu
nie da się niczego zmienić na stronie.

Zmiana hasła: policz skrót SHA-256 nowego hasła i ustaw go jako zmienną
repozytorium `VITE_ADMIN_PASS_HASH` (workflow przekaże ją do builda) albo w pliku
`.env`.

```bash
node -e "console.log(require('crypto').createHash('sha256').update('nowe-haslo').digest('hex'))"
```

---

## 4. Cookies i zgody

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

## 5. Podstrony

| Ścieżka                  | Zawartość                    |
| ------------------------ | ---------------------------- |
| `/`                      | Landing page                 |
| `/polityka-prywatnosci`  | Polityka prywatności (RODO)  |
| `/polityka-cookies`      | Polityka cookies + tabela    |
| `/admin`                 | Panel treści (poza indeksem) |
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

## 6. Struktura

```
src/
  components/
    quote/          formularz wyceny: kroki, walidacja, podsumowanie, sukces
    cookies/        baner i centrum preferencji
    admin/          panel treści: edytory opinii, zdjęć i realizacji
    legal/          wspólny layout dokumentów prawnych
    ui/             Button, Reveal, Logo, pola formularza
  content/          model treści edytowalnej, wartości domyślne, publikacja
  data/             treści statyczne i dane firmy (site, images, legal)
  hooks/            IntersectionObserver do animacji wejścia
  lib/              walidacja, wysyłka, zgody, kompresja zdjęć, API GitHuba
  pages/            HomePage, polityki, panel
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

## 7. Dostępność

Formularz da się przejść samą klawiaturą, błędy są ogłaszane przez `role="alert"`,
progres ma `aria-current="step"`, FAQ używa `aria-expanded`, a wszystkie cele dotykowe
mają co najmniej 44 px. Kontrast tekstu i przycisków spełnia WCAG AA w obu motywach.

## 8. Zdjęcia

Materiał zastępczy pochodzi z Unsplash (licencja Unsplash, użycie komercyjne dozwolone).
Własne zdjęcia najprościej wgrać przez panel `/admin`: są automatycznie zmniejszane
i trafiają do `public/media/` w repozytorium. Wartości domyślne (gdy nie ma jeszcze
`content.json`) siedzą w `src/content/defaults.ts`.
