import { Link } from "react-router-dom";
import { LegalPage } from "../components/legal/LegalPage";
import { SITE_URL } from "../data/legal";
import { useContent } from "../content/ContentProvider";
import { POLICY_VERSION, openCookiePreferences } from "../lib/consent";

/*
  UWAGA DLA ADMINISTRATORA STRONY
  Tabela poniżej opisuje rzeczywisty stan serwisu: jedyny zapis po stronie
  przeglądarki to klucz `cookie-consent` w localStorage. Serwis nie ładuje
  Google Analytics, Google Ads, Meta Pixela, Clarity ani innych trackerów.

  Po dodaniu takiego narzędzia:
  1. dopisz je do `gatedScripts` w src/lib/consent.ts (uruchomi się dopiero
     po zgodzie na właściwą kategorię),
  2. dopisz jego cookies do tabeli poniżej na podstawie dokumentacji
     dostawcy, bez zgadywania nazw i okresów,
  3. podnieś POLICY_VERSION, żeby użytkownicy podjęli decyzję na nowo.
*/

const cookieRows = (companyName: string) => [
  {
    name: "cookie-consent",
    provider: `${companyName} (localStorage przeglądarki)`,
    type: "Niezbędny",
    purpose: "Zapamiętanie Twojej decyzji dotyczącej cookies i zakresu udzielonych zgód.",
    retention: "Do czasu wyczyszczenia danych witryny przez użytkownika.",
  },
];

export function CookiePolicyPage() {
  const { company } = useContent();
  const rows = cookieRows(company.name);

  return (
    <LegalPage
      title="Polityka cookies"
      lead="Opis plików cookies i podobnych technologii wykorzystywanych w tym serwisie oraz tego, jak zarządzać zgodami."
      updated={company.legalUpdated}
      seo={{
        title: `Polityka cookies | ${company.name}`,
        description:
          "Jakie pliki cookies i podobne technologie wykorzystuje serwis, w jakim celu oraz jak zarządzać zgodami.",
        canonical: `${SITE_URL}/polityka-cookies`,
      }}
      related={[
        { label: "Polityka prywatności", to: "/polityka-prywatnosci" },
        { label: "Formularz wyceny", to: "/#wycena" },
      ]}
    >
      <h2 id="czym-sa">1. Czym są pliki cookies</h2>
      <p>
        Pliki cookies to niewielkie pliki tekstowe zapisywane na urządzeniu użytkownika podczas
        korzystania ze strony internetowej. Podobnie działają inne mechanizmy pamięci przeglądarki,
        takie jak localStorage, i w tym dokumencie traktujemy je tak samo.
      </p>

      <h2 id="cele">2. W jakim celu wykorzystujemy cookies</h2>
      <p>Cookies i podobne technologie mogą być wykorzystywane w celu:</p>
      <ul>
        <li>zapewnienia prawidłowego działania strony,</li>
        <li>zapewnienia bezpieczeństwa,</li>
        <li>zapamiętywania ustawień użytkownika,</li>
        <li>obsługi funkcjonalności strony,</li>
        <li>analizy ruchu i tworzenia statystyk,</li>
        <li>prowadzenia działań marketingowych i mierzenia skuteczności kampanii reklamowych.</li>
      </ul>
      <p className="legal-note">
        Stan na dziś: serwis korzysta wyłącznie z mechanizmu niezbędnego, opisanego w tabeli w
        punkcie 7. Kategorie analityczna i marketingowa są przygotowane w systemie zgód, ale nie są
        obecnie używane. Jeżeli to się zmieni, zaktualizujemy ten dokument.
      </p>

      <h2 id="rodzaje">3. Rodzaje cookies</h2>

      <h3>Cookies niezbędne</h3>
      <p>
        Są wymagane do prawidłowego działania podstawowych funkcji strony, w tym do zapamiętania
        Twojej decyzji o cookies. Działają bez zgody, ponieważ bez nich serwis nie mógłby działać
        prawidłowo.
      </p>

      <h3>Cookies funkcjonalne</h3>
      <p>Umożliwiają zapamiętywanie ustawień i preferencji użytkownika.</p>

      <h3>Cookies analityczne</h3>
      <p>
        Pomagają analizować sposób korzystania ze strony, dzięki czemu możemy poprawiać jej
        działanie i zawartość.
      </p>

      <h3>Cookies marketingowe</h3>
      <p>Mogą służyć do mierzenia skuteczności reklam oraz prowadzenia działań marketingowych.</p>

      <h2 id="zarzadzanie">4. Zarządzanie zgodami</h2>
      <p>
        Przy pierwszej wizycie pokazujemy baner, w którym możesz zaakceptować wszystkie cookies,
        odrzucić opcjonalne albo ustawić każdą kategorię osobno. Kategorie opcjonalne są domyślnie
        wyłączone, a samo dalsze korzystanie ze strony nie oznacza zgody.
      </p>
      <p>
        Decyzję możesz zmienić lub wycofać w dowolnym momencie, klikając „Ustawienia cookies” w
        stopce strony albo tutaj:
      </p>
      <p>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="rounded-pill font-semibold text-accent underline underline-offset-2 hover:text-accent-hover"
        >
          Otwórz ustawienia cookies
        </button>
      </p>
      <p>
        Po wycofaniu zgody przestajemy ładować skrypty przypisane do danej kategorii i usuwamy
        cookies opcjonalne w zakresie, w jakim jest to technicznie możliwe po stronie przeglądarki.
      </p>
      <p>
        Cookies możesz też usuwać i blokować w ustawieniach swojej przeglądarki. Zablokowanie
        cookies niezbędnych może utrudnić korzystanie ze strony.
      </p>

      <h2 id="strony-trzecie">5. Cookies stron trzecich</h2>
      <p>
        Serwis nie korzysta z narzędzi analitycznych, reklamowych, map, osadzonych filmów ani
        widgetów zewnętrznych, które ustawiałyby własne cookies.
      </p>
      <p>
        Zdjęcia poglądowe są pobierane z serwera <strong>images.unsplash.com</strong>. Samo pobranie
        pliku graficznego nie zapisuje cookies na Twoim urządzeniu, ale wiąże się z przesłaniem do
        tego dostawcy adresu IP oraz informacji o przeglądarce. Więcej w{" "}
        <Link to="/polityka-prywatnosci">polityce prywatności</Link>.
      </p>

      <h2 id="okres">6. Okres przechowywania</h2>
      <p>
        Cookies mogą być przechowywane przez czas trwania sesji lub przez określony okres zależny od
        ich funkcji i konfiguracji konkretnej usługi. Konkretne okresy podajemy w tabeli poniżej.
      </p>

      <h2 id="tabela">7. Wykaz wykorzystywanych mechanizmów</h2>
      <div className="mt-4 overflow-x-auto rounded-control border border-line">
        <table className="w-full min-w-[40rem] border-collapse text-left text-[0.875rem]">
          <thead>
            <tr className="bg-surface-inset">
              <th scope="col" className="px-4 py-3 font-bold text-ink">
                Nazwa
              </th>
              <th scope="col" className="px-4 py-3 font-bold text-ink">
                Dostawca
              </th>
              <th scope="col" className="px-4 py-3 font-bold text-ink">
                Typ
              </th>
              <th scope="col" className="px-4 py-3 font-bold text-ink">
                Cel
              </th>
              <th scope="col" className="px-4 py-3 font-bold text-ink">
                Okres przechowywania
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-line align-top">
                <td className="px-4 py-3 font-semibold text-ink">{row.name}</td>
                <td className="px-4 py-3">{row.provider}</td>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">{row.purpose}</td>
                <td className="px-4 py-3">{row.retention}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="legal-note">
        Wersja polityki zapisywana razem ze zgodą: {POLICY_VERSION}. Po podniesieniu wersji baner
        zgód pojawi się ponownie, żeby użytkownicy mogli podjąć decyzję na nowo.
      </p>

      <h2 id="kontakt">8. Kontakt</h2>
      <p>
        Pytania dotyczące cookies i danych osobowych: {company.email}, telefon{" "}
        {company.phone}.
      </p>
    </LegalPage>
  );
}
