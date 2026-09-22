import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CookieConsent } from "./components/cookies/CookieConsent";
import { Button } from "./components/ui/Button";
import { HomePage } from "./pages/HomePage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";

/**
 * Zmiana trasy przewija na górę, a kotwica (np. /#wycena) do właściwej
 * sekcji. Bez tego React Router zostawiłby użytkownika w połowie strony.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        return;
      }
    }

    /* "auto" oddaje sterowanie CSS-owemu scroll-behavior: smooth, więc przy
       zmianie podstrony przewijanie trwałoby sekundę. Chcemy natychmiast. */
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

function NotFoundPage() {
  return (
    <section className="section-pad pt-36">
      <div className="shell max-w-[44ch]">
        <h1 className="h-section text-ink">Nie znaleźliśmy tej strony</h1>
        <p className="body-text mt-5">
          Adres mógł się zmienić albo zawiera literówkę. Wróć na stronę główną albo od razu poproś o
          wycenę.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button as={Link} to="/" size="lg">
            Strona główna
          </Button>
          <Button as={Link} to="/#wycena" variant="secondary" size="lg">
            Poproś o wycenę
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <a
        href="#tresc"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded-pill focus:bg-cta focus:px-5 focus:py-3 focus:font-semibold focus:text-cta-fg"
      >
        Przejdź do treści
      </a>

      <ScrollManager />
      <Navbar />

      <main id="tresc">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/polityka-prywatnosci" element={<PrivacyPolicyPage />} />
          <Route path="/polityka-cookies" element={<CookiePolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}
