import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, Clock4, Loader2, Lock, Phone } from "lucide-react";
import { STEPS } from "./options";
import { QuoteProgress } from "./QuoteProgress";
import { QuoteSuccess } from "./QuoteSuccess";
import { QuoteSummary } from "./QuoteSummary";
import { StepContact } from "./StepContact";
import { StepExtras } from "./StepExtras";
import { StepGlazing } from "./StepGlazing";
import { StepService } from "./StepService";
import { emptyQuote } from "./types";
import type { FieldErrors, QuoteData, ServiceType } from "./types";
import { validateStep } from "../../lib/validation";
import { submitQuote } from "../../lib/submitQuote";
import { useContent } from "../../content/ContentProvider";
import { phoneHref } from "../../content/types";
import { Button } from "../ui/Button";
import { Reveal } from "../ui/Reveal";
import { cn } from "../../lib/cn";

const STEP_INTRO = [
  { heading: "Jaki rodzaj usługi Cię interesuje?", hint: "Całość zajmie około 60 sekund." },
  { heading: "Co mamy umyć?", hint: "Orientacyjne dane w zupełności wystarczą." },
  {
    heading: "Potrzebujesz czegoś poza myciem szyb?",
    hint: "Możesz zaznaczyć kilka pozycji albo pominąć ten krok.",
  },
  {
    heading: "Gdzie i do kogo mamy wrócić z wyceną?",
    hint: "Kontaktujemy się wyłącznie w sprawie tego zapytania.",
  },
  { heading: "Sprawdź zapytanie przed wysłaniem", hint: "Każdą sekcję możesz jeszcze poprawić." },
];

type Status = "idle" | "sending" | "error" | "success";

export type Preselect = { type: ServiceType; nonce: number } | null;

export function QuoteForm({ preselect }: { preselect: Preselect }) {
  const { company } = useContent();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [data, setData] = useState<QuoteData>(emptyQuote);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const initialRender = useRef(true);

  const isLast = step === STEPS.length - 1;

  /* Wybór typu klienta z sekcji „Oferta” ustawia go w formularzu. */
  useEffect(() => {
    if (!preselect) return;
    setData((prev) => ({ ...prev, serviceType: preselect.type }));
    setErrors({});
    setStep(0);
    setStatus("idle");
  }, [preselect]);

  /* Zmiana kroku: fokus na nagłówek kroku i doscrollowanie panelu, jeśli
     jego górna krawędź wyszła poza ekran. Bez przeskoków przy pierwszym
     renderze. */
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });

    const top = panelRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) {
      panelRef.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  }, [step, status]);

  function update(patch: Partial<QuoteData>) {
    setData((prev) => ({ ...prev, ...patch }));
    /* Błąd znika, gdy tylko użytkownik poprawi dane. Nie karzemy w trakcie pisania. */
    setErrors((prev) => {
      const keys = Object.keys(patch);
      if (!keys.some((k) => k in prev)) return prev;
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return next;
    });
  }

  function focusFirstError() {
    window.requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"], [role="alert"]',
      );
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        target.focus();
      } else {
        target?.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    });
  }

  function goNext() {
    const found = validateStep(step, data);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstError();
      return;
    }
    setErrors({});
    setDirection("forward");
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function goBack() {
    setDirection("back");
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }

  function goToStep(target: number) {
    setDirection(target > step ? "forward" : "back");
    setErrors({});
    setStep(target);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isLast) {
      goNext();
      return;
    }

    /* Ostatnia kontrola przed wysyłką: sprawdzamy wszystkie kroki naraz,
       bo dane mogły zostać zmienione przez „Edytuj”. */
    for (let i = 0; i < STEPS.length - 1; i += 1) {
      const found = validateStep(i, data);
      if (Object.keys(found).length > 0) {
        setErrors(found);
        setDirection("back");
        setStep(i);
        focusFirstError();
        return;
      }
    }

    try {
      setStatus("sending");
      await submitQuote(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    data.photos.forEach((p) => URL.revokeObjectURL(p.url));
    setData(emptyQuote);
    setStep(0);
    setErrors({});
    setStatus("idle");
    initialRender.current = true;
  }

  return (
    <section id="wycena" className="section-pad scroll-mt-20 bg-surface">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Kolumna wartości: po co ten formularz i co się stanie dalej. */}
        <Reveal className="lg:col-span-5 lg:col-start-1">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Wycena</p>
            <h2 className="h-section mt-4 text-ink">Bezpłatna wycena w 60 sekund</h2>
            <p className="body-text mt-5 max-w-[46ch]">
              Cztery krótkie kroki. Nie musisz nic mierzyć ani liczyć co do sztuki. Wrócimy do
              Ciebie z konkretną kwotą i terminem.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Clock4 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span className="body-text text-[0.9375rem]">
                  Możesz wrócić do poprzedniego kroku. Nic nie przepadnie.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Lock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span className="body-text text-[0.9375rem]">
                  Dane wykorzystujemy tylko do przygotowania wyceny.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-[18px] w-[18px] shrink-0 text-accent" aria-hidden="true" />
                <span className="body-text text-[0.9375rem]">
                  Wolisz porozmawiać?{" "}
                  <a
                    href={phoneHref(company.phone)}
                    className="font-semibold text-ink underline underline-offset-4 transition-colors hover:text-accent"
                  >
                    {company.phone}
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </Reveal>

        {/* Panel formularza */}
        <Reveal delay={90} className="lg:col-span-7 lg:col-start-6">
          <div
            ref={panelRef}
            className="scroll-mt-24 overflow-hidden rounded-card border border-line bg-bg shadow-float"
          >
            {status === "success" ? (
              <QuoteSuccess onReset={reset} />
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col">
                <div className="border-b border-line bg-surface px-5 py-5 sm:px-8 sm:py-6">
                  <QuoteProgress step={step} />
                </div>

                <div className="px-5 py-7 sm:px-8 sm:py-8">
                  <h3
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-xl leading-tight font-bold tracking-[-0.02em] text-ink focus:outline-none sm:text-[1.5rem]"
                  >
                    {STEP_INTRO[step].heading}
                  </h3>
                  <p className="body-text mt-2 text-[0.875rem]">{STEP_INTRO[step].hint}</p>

                  <div
                    key={step}
                    className={cn(
                      "mt-7",
                      direction === "forward" ? "step-enter" : "step-enter-back",
                    )}
                  >
                    {step === 0 ? (
                      <StepService data={data} update={update} errors={errors} />
                    ) : null}
                    {step === 1 ? (
                      <StepGlazing data={data} update={update} errors={errors} />
                    ) : null}
                    {step === 2 ? <StepExtras data={data} update={update} /> : null}
                    {step === 3 ? (
                      <StepContact data={data} update={update} errors={errors} />
                    ) : null}
                    {step === 4 ? <QuoteSummary data={data} onEdit={goToStep} /> : null}
                  </div>

                  {status === "error" ? (
                    <p
                      role="alert"
                      className="mt-6 rounded-control border border-danger bg-danger-soft px-4 py-3 text-[0.875rem] font-medium text-danger"
                    >
                      Nie udało się wysłać zapytania. Spróbuj jeszcze raz albo zadzwoń pod{" "}
                      {company.phone}.
                    </p>
                  ) : null}
                </div>

                <div className="border-t border-line bg-surface px-5 py-5 sm:px-8 sm:py-6">
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                      <Button type="button" variant="secondary" size="lg" onClick={goBack}>
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Wstecz
                      </Button>
                    ) : (
                      <span className="hidden sm:block" />
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={status === "sending"}
                      className="group w-full sm:w-auto"
                    >
                      {status === "sending" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          Wysyłanie
                        </>
                      ) : isLast ? (
                        "Poproś o bezpłatną wycenę"
                      ) : (
                        <>
                          Dalej
                          <ArrowRight
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Button>
                  </div>

                  {isLast ? (
                    <p className="mt-4 text-center text-[0.8125rem] text-ink-soft sm:text-right">
                      Bez zobowiązań. Skontaktujemy się w sprawie szczegółów.
                    </p>
                  ) : null}
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
