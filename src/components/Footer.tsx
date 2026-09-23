import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { footerLinks } from "../data/site";
import { useContent } from "../content/ContentProvider";
import { formatAddress, isUnset, phoneHref } from "../content/types";
import { Logo } from "./ui/Logo";
import { openCookiePreferences } from "../lib/consent";

export function Footer() {
  const { company } = useContent();
  const year = new Date().getFullYear();
  const address = formatAddress(company);

  return (
    <footer id="kontakt" className="scroll-mt-24 bg-brand pt-14 pb-8 text-on-brand md:pt-20">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Logo onBrand />
            <p className="mt-5 max-w-[38ch] text-[0.9375rem] leading-relaxed text-on-brand-soft">
              Profesjonalne mycie okien, witryn i przeszkleń dla klientów prywatnych i firm.
              Realizacje jednorazowe oraz stała obsługa obiektów.
            </p>
          </div>

          <div className="md:col-span-4">
            <h2 className="text-[0.75rem] font-bold tracking-[0.14em] text-on-brand-soft uppercase">
              Kontakt
            </h2>
            <ul className="mt-5 flex flex-col gap-3.5">
              <li>
                <a
                  href={phoneHref(company.phone)}
                  className="inline-flex items-center gap-2.5 font-semibold transition-colors hover:text-accent-on-brand"
                >
                  <Phone className="h-4 w-4 shrink-0 text-accent-on-brand" aria-hidden="true" />
                  {company.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-2.5 font-semibold transition-colors hover:text-accent-on-brand"
                >
                  <Mail className="h-4 w-4 shrink-0 text-accent-on-brand" aria-hidden="true" />
                  {company.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-[0.9375rem] text-on-brand-soft">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-on-brand" aria-hidden="true" />
                <span>
                  {company.area}
                  <span className="mt-0.5 block text-[0.8125rem]">{company.areaDetail}</span>
                </span>
              </li>
            </ul>
          </div>

          <nav aria-label="Stopka" className="md:col-span-3">
            <h2 className="text-[0.75rem] font-bold tracking-[0.14em] text-on-brand-soft uppercase">
              Serwis
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {footerLinks.serwis.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[0.9375rem] text-on-brand-soft transition-colors hover:text-on-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-brand-line pt-6 text-[0.8125rem] text-on-brand-soft md:flex-row md:items-center md:justify-between">
          <p>
            {year} {company.name}. {company.legalEntity}
            {isUnset(company.nip) ? "" : `, ${company.nip}`}
            {isUnset(address) ? "" : `, ${address}`}.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footerLinks.prawne.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="transition-colors hover:text-on-brand">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              {/* Wymagane, żeby zgodę można było zmienić lub wycofać w każdej chwili. */}
              <button
                type="button"
                onClick={openCookiePreferences}
                className="rounded-pill transition-colors hover:text-on-brand"
              >
                Ustawienia cookies
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
