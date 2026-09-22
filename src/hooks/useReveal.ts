import { useEffect, useRef } from "react";

/**
 * Jeden współdzielony IntersectionObserver dla całej strony.
 * Żadnych nasłuchiwaczy scrolla: element dostaje klasę `reveal-in`
 * przy wejściu w widok i od razu przestaje być obserwowany.
 */

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (typeof window === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            obs.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
  }
  return observer;
}

export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      node.classList.add("reveal-in");
      return;
    }

    if (delayMs) node.style.setProperty("--reveal-delay", `${delayMs}ms`);

    const obs = getObserver();
    obs?.observe(node);
    return () => obs?.unobserve(node);
  }, [delayMs]);

  return ref;
}
