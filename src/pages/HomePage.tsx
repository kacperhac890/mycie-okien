import { useState } from "react";
import { Hero } from "../components/Hero";
import { TrustBar } from "../components/TrustBar";
import { WhyUs } from "../components/WhyUs";
import { Services } from "../components/Services";
import { Process } from "../components/Process";
import { Gallery } from "../components/Gallery";
import { Quality } from "../components/Quality";
import { QuoteForm } from "../components/quote/QuoteForm";
import type { Preselect } from "../components/quote/QuoteForm";
import { Testimonials } from "../components/Testimonials";
import { Faq } from "../components/Faq";
import { FinalCta } from "../components/FinalCta";
import { MobileCta } from "../components/MobileCta";
import type { ServiceId } from "../components/quote/types";

export function HomePage() {
  /* Kliknięcie „Zamów wycenę” przy usłudze zaznacza ją w formularzu.
     `nonce` pozwala powtórzyć wybór tej samej usługi. */
  const [preselect, setPreselect] = useState<Preselect>(null);

  function pickService(service: ServiceId) {
    setPreselect({ service, nonce: Date.now() });
  }

  return (
    <>
      <Hero />
      <TrustBar />
      <WhyUs />
      <Services onPick={pickService} />
      <Process />
      <Gallery />
      <Quality />
      <QuoteForm preselect={preselect} />
      <Testimonials />
      <Faq />
      <FinalCta />
      <MobileCta />
    </>
  );
}
