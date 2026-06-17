"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

/**
 * Drives buttery, momentum-based smooth scrolling across the whole site.
 *
 * Lenis is initialised once and ticked via requestAnimationFrame. Framer
 * Motion's `useScroll` reads native scroll position, which Lenis updates,
 * so scroll-linked animations stay perfectly in sync.
 *
 * Honors `prefers-reduced-motion`: when set, we skip Lenis entirely and let
 * the browser handle native scrolling.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      // Long, gentle ease — the deceleration that makes scroll feel expensive.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Smoothly scroll to in-page anchors instead of jumping.
    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      event.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.4 });
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
