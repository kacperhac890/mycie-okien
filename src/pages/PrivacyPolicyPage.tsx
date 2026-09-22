import { Link } from "react-router-dom";
import { LegalPage } from "../components/legal/LegalPage";
import { company } from "../data/site";
import { LEGAL_UPDATED, SITE_URL } from "../data/legal";
import { openCookiePreferences } from "../lib/consent";

/*
  UWAGA DLA ADMINISTRATORA STRONY
  Dokument opisuje wyłącznie to, co faktycznie robi ten serwis:
  formularz wyceny, zapis zgody cookies w localStorage, dostarczanie zdjęć
  z Unsplash i logi hostingu. Serwis nie ma kont użytkowników, newslettera,
  płatności, analityki ani narzędzi reklamowych. Jeżeli którakolwiek z tych
  rzeczy zostanie dodana, trzeba uzupełnić ten dokument oraz rejestr
  skryptów w src/lib/consent.ts.

  Treść nie stanowi porady prawnej. Dane w nawiasach kwadratowych
  uzupełnia właściciel serwisu.
*/

export function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Polityka prywatności"
      lead="Wyjaśniamy, jakie dane zbieramy przez tę stronę, po co ich potrzebujemy i co możesz z nimi zrobić."
      updated={LEGAL_UPDATED}
      seo={{
        title: `Polityka prywatności | ${company.name}`,
        description:
          "Informacja o przetwarzaniu danych osobowych przekazanych przez formularz wyceny oraz o plikach cookies wykorzystywanych w serwisie.",
        canonical: `${SITE_URL}/polityka-prywatnosci`,
      }}
      related={[
        { label: "Polityka cookies", to: "/polityka-cookies" },
        { label: "Formularz wyceny", to: "/#wycena" },
      ]}
    >
      <h2 id="administrator">1. Kto jest administratorem danych</h2>
      <p>
        Administratorem danych osobowych przekazanych przez tę stronę jest {company.legal.entity},{" "}
        {company.legal.address}, {company.legal.nip} (dalej: „my”).
      </p>
      <p>
        Kontakt w sprawach dotyczących danych osobowych: {company.email}, telefon{" "}
        {company.phoneDisplay}.
      </p>
      <p className="legal-note">
        [DO UZUPEŁNIENIA] Jeżeli został wyznaczony inspektor ochrony danych, podaj tutaj jego dane
        kontaktowe. Jeżeli nie ma takiego obowiązku, usuń ten fragment.
      </p>

      <h2 id="dane">2. Jakie dane zbieramy</h2>
      <p>
        Zbieramy tylko te dane, które sam nam podasz, oraz podstawowe dane techniczne, bez których
        strona nie mogłaby się wyświetlić.
      </p>

      <h3>Formularz wyceny</h3>
      <p>W formularzu prosimy o:</p>
      <ul>
        <li>imię lub nazwę firmy oraz opcjonalnie osobę kontaktową,</li>
        <li>numer telefonu i adres e-mail,</li>
        <li>miejscowość oraz opcjonalnie kod pocztowy,</li>
        <li>
          informacje o zleceniu: rodzaj usługi, rodzaj i liczbę przeszkleń, orientacyjny rozmiar,
          dodatkowe usługi oraz uwagi,
        </li>
        <li>opcjonalnie zdjęcia okien lub przeszkleń, które sam dołączysz.</li>
      </ul>
      <p>
        Pola oznaczone jako opcjonalne możesz pominąć. Nie prosimy o dane wrażliwe i prosimy o
        niepodawanie ich w polu „Uwagi”.
      </p>

      <h3>Zdjęcia</h3>
      <p>
        Zdjęcia dołączone do zapytania służą wyłącznie do przygotowania wyceny. Jeżeli przypadkiem
        znajdą się na nich osoby lub inne dane, prosimy o ich wcześniejsze usunięcie lub
        zasłonięcie.
      </p>

      <h3>Dane techniczne</h3>
      <p>
        Nasz dostawca hostingu zapisuje standardowe logi serwera: adres IP, datę i godzinę
        zapytania, typ przeglądarki oraz adres odwiedzanej podstrony. Służą one wyłącznie
        zapewnieniu działania i bezpieczeństwa serwisu.
      </p>

      <h2 id="cele">3. Po co nam te dane i na jakiej podstawie</h2>
      <ul>
        <li>
          <strong>Przygotowanie wyceny i kontakt w sprawie zapytania</strong> - podstawą jest
          podjęcie działań na Twoje żądanie przed zawarciem umowy (art. 6 ust. 1 lit. b RODO).
        </li>
        <li>
          <strong>Realizacja usługi</strong>, jeżeli zdecydujesz się na zlecenie - wykonanie umowy
          (art. 6 ust. 1 lit. b RODO).
        </li>
        <li>
          <strong>Obowiązki podatkowe i księgowe</strong> związane z wystawieniem dokumentu
          sprzedaży - obowiązek prawny (art. 6 ust. 1 lit. c RODO).
        </li>
        <li>
          <strong>Bezpieczeństwo serwisu oraz ewentualna obrona przed roszczeniami</strong> - nasz
          prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO).
        </li>
        <li>
          <strong>Opcjonalne pliki cookies</strong> - wyłącznie na podstawie Twojej zgody (art. 6
          ust. 1 lit. a RODO), którą możesz w każdej chwili wycofać.
        </li>
      </ul>

      <h2 id="okres">4. Jak długo przechowujemy dane</h2>
      <ul>
        <li>
          Zapytania, które nie zakończyły się zleceniem: [DO UZUPEŁNIENIA: np. 12 miesięcy] od
          ostatniego kontaktu.
        </li>
        <li>
          Dane związane ze zrealizowaną usługą: przez okres przedawnienia roszczeń, a dokumenty
          księgowe przez 5 lat licząc od końca roku podatkowego.
        </li>
        <li>Zdjęcia dołączone do zapytania: usuwamy je razem z zapytaniem.</li>
        <li>Logi serwera: zgodnie z polityką dostawcy hostingu.</li>
      </ul>

      <h2 id="odbiorcy">5. Komu przekazujemy dane</h2>
      <p>Nie sprzedajemy danych i nie udostępniamy ich w celach marketingowych. Odbiorcami mogą być:</p>
      <ul>
        <li>[DOSTAWCA HOSTINGU] - przechowywanie serwisu i logi serwera,</li>
        <li>
          <strong>FormSubmit</strong> (formsubmit.co, operator Devro LABS) - usługa, która przyjmuje
          zgłoszenie z formularza wyceny razem z dołączonymi zdjęciami i przekazuje je na nasz adres
          e-mail,
        </li>
        <li>[DOSTAWCA POCZTY E-MAIL] - obsługa korespondencji z zapytaniami,</li>
        <li>[BIURO RACHUNKOWE], jeżeli doszło do wystawienia dokumentu sprzedaży,</li>
        <li>
          organy publiczne, jeżeli obowiązek przekazania danych wynika z przepisów prawa.
        </li>
      </ul>
      <p className="legal-note">
        [DO UZUPEŁNIENIA] Uzupełnij nazwy hostingu, poczty i biura rachunkowego oraz zawrzyj z tymi
        podmiotami umowy powierzenia przetwarzania danych. Dostawcę obsługi formularza ustawia się
        w pliku .env (zmienna VITE_FORM_PROVIDER).
      </p>

      <h2 id="unsplash">6. Usługi zewnętrzne obecne na stronie</h2>
      <p>
        Zdjęcia poglądowe wykorzystane w serwisie są pobierane z serwera{" "}
        <strong>images.unsplash.com</strong> (Unsplash Inc., USA). Przy wyświetleniu strony Twoja
        przeglądarka wysyła do tego serwera zapytanie zawierające adres IP oraz informacje o
        przeglądarce. Nie przekazujemy tam żadnych danych z formularza.
      </p>
      <p>
        Poza tym serwis nie korzysta z narzędzi analitycznych, reklamowych, map, osadzonych filmów
        ani czatów. Kroje pisma są serwowane z naszego serwera, bez odpytywania zewnętrznych usług.
      </p>
      <p className="legal-note">
        [DO UZUPEŁNIENIA] Po podmianie zdjęć na własne realizacje i wgraniu ich na własny serwer ten
        punkt można usunąć.
      </p>

      <h2 id="eog">7. Przekazywanie danych poza EOG</h2>
      <p>
        Samo wyświetlenie zdjęć z serwera Unsplash może wiązać się z przekazaniem adresu IP poza
        Europejski Obszar Gospodarczy, na zasadach opisanych w polityce prywatności tego dostawcy.
      </p>
      <p>
        Zgłoszenia z formularza wyceny przechodzą przez serwis FormSubmit. Jeżeli jego serwery
        znajdują się poza EOG, przekazanie danych odbywa się na zasadach opisanych w dokumencie
        prywatności tego dostawcy.
      </p>
      <p className="legal-note">
        [DO UZUPEŁNIENIA] Sprawdź w dokumencie prywatności FormSubmit (formsubmit.co) kraj
        przetwarzania i podstawę transferu, a następnie dopisz ją tutaj albo usuń ten akapit,
        jeżeli przejdziesz na dostawcę z Unii Europejskiej.
      </p>

      <h2 id="prawa">8. Twoje prawa</h2>
      <p>W związku z przetwarzaniem danych masz prawo do:</p>
      <ul>
        <li>dostępu do danych i otrzymania ich kopii,</li>
        <li>sprostowania danych, które są nieprawidłowe lub niekompletne,</li>
        <li>usunięcia danych,</li>
        <li>ograniczenia przetwarzania,</li>
        <li>przenoszenia danych przetwarzanych na podstawie umowy lub zgody,</li>
        <li>
          sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,
        </li>
        <li>wycofania zgody w dowolnym momencie, bez wpływu na wcześniejsze przetwarzanie.</li>
      </ul>
      <p>
        Żądanie wystarczy zgłosić na adres {company.email}. Masz też prawo wnieść skargę do Prezesa
        Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa.
      </p>

      <h2 id="dobrowolnosc">9. Czy podanie danych jest obowiązkowe</h2>
      <p>
        Podanie danych jest dobrowolne, ale bez imienia lub nazwy firmy, numeru telefonu, adresu
        e-mail i miejscowości nie przygotujemy wyceny ani nie wrócimy do Ciebie z odpowiedzią.
      </p>

      <h2 id="cookies">10. Pliki cookies i pamięć przeglądarki</h2>
      <p>
        Szczegóły opisaliśmy w osobnym dokumencie:{" "}
        <Link to="/polityka-cookies">Polityka cookies</Link>. Swoją decyzję możesz zmienić w
        dowolnym momencie.
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

      <h2 id="bezpieczenstwo">11. Bezpieczeństwo</h2>
      <p>
        Strona działa po szyfrowanym połączeniu HTTPS. Dostęp do zapytań mają wyłącznie osoby, które
        obsługują wyceny i realizacje.
      </p>

      <h2 id="zmiany">12. Zmiany polityki</h2>
      <p>
        Jeżeli zmienimy zakres zbieranych danych albo dodamy nowe narzędzia, zaktualizujemy ten
        dokument i datę na górze strony.
      </p>
    </LegalPage>
  );
}
