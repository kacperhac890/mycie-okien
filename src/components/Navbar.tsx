import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { nav, primaryCta } from "../data/site";
import { useContent } from "../content/ContentProvider";
import { phoneHref } from "../content/types";
import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { cn } from "../lib/cn";

export function Navbar() {
  const { company } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /* Stan „po scrollu” z IntersectionObserver zamiast nasłuchu scrolla. */
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const obs = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      threshold: 0,
    });
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  /* Menu mobilne: blokada scrolla, Escape, zwrot fokusu. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-px w-full" />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
          scrolled
            ? "frost border-b border-line shadow-soft"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Nawigacja główna"
          className="shell flex h-18 items-center justify-between gap-6 md:h-20"
        >
          <Link
            to="/"
            className="rounded-control py-1 transition-opacity hover:opacity-80"
            aria-label={`${company.name}, strona główna`}
          >
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  to={`/${item.href}`}
                  className="rounded-pill px-3 py-2 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={phoneHref(company.phone)}
              className="hidden items-center gap-2 rounded-pill px-3.5 py-2 text-[0.9375rem] font-semibold text-ink transition-colors hover:text-accent md:inline-flex lg:hidden xl:inline-flex"
            >
              <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              <span className="sr-only">Telefon: </span>
              {company.phone}
            </a>

            <div className="hidden sm:block">
              <Button as={Link} to={`/${primaryCta.href}`}>
                {primaryCta.label}
              </Button>
            </div>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line-strong bg-surface text-ink transition-colors hover:bg-surface-2 lg:hidden"
              aria-label="Otwórz menu"
              aria-expanded={open}
              aria-controls="menu-mobilne"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      {/* Menu mobilne */}
      <div
        id="menu-mobilne"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-60 lg:hidden"
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-brand/55 backdrop-blur-sm"
        />

        <div
          ref={panelRef}
          className={cn(
            "absolute inset-x-0 top-0 rounded-b-[1.5rem] bg-surface p-5 shadow-float",
            open && "pop-in",
          )}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleRef.current?.focus();
              }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill border border-line-strong text-ink transition-colors hover:bg-surface-2"
              aria-label="Zamknij menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <ul className="mt-6 flex flex-col">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-line last:border-b-0">
                <Link
                  to={`/${item.href}`}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center text-lg font-semibold text-ink transition-colors hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3">
            <Button
              as={Link}
              to={`/${primaryCta.href}`}
              size="lg"
              full
              onClick={() => setOpen(false)}
            >
              {primaryCta.label}
            </Button>
            <Button as="a" href={phoneHref(company.phone)} variant="secondary" size="lg" full>
              <Phone className="h-4 w-4" aria-hidden="true" />
              {company.phone}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
