"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { ThreeDPlaceholder } from "@/components/placeholders/three-d-placeholder";

const PILLARS = [
  {
    n: "01",
    title: "Listening engines",
    body: "Our processors profile program material in real time and adapt — preserving transients, resolving density, never imposing a sound that isn't already there.",
  },
  {
    n: "02",
    title: "Perceptual modeling",
    body: "We model how the ear hears, not just how the signal measures. Every curve, every tail is weighted toward what you actually perceive.",
  },
  {
    n: "03",
    title: "Spatial coherence",
    body: "Sources hold their place in a continuous acoustic field that translates from headphones to immersive formats without a second authoring pass.",
  },
  {
    n: "04",
    title: "Double-precision core",
    body: "A 64-bit floating-point path with oversampled nonlinearities keeps the highs pristine and the headroom effortless, all the way to the master.",
  },
];

export function Technology() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section
      id="technology"
      className="relative bg-[var(--color-paper-pure)] px-6 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-8 flex items-center gap-4">
          <span className="overline">Technology &amp; Craft</span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
          <span className="font-display text-sm text-[var(--color-ink-faint)]">03</span>
        </Reveal>

        <Reveal className="mb-20 max-w-2xl">
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.04] tracking-[-0.03em]">
            Intelligence you hear,
            <br />
            never notice.
          </h2>
        </Reveal>

        <div ref={ref} className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Sticky 3D visual */}
          <div className="lg:sticky lg:top-28 lg:h-[70vh]">
            <motion.div style={{ rotate, y }} className="h-full">
              <ThreeDPlaceholder
                aspect="aspect-square"
                accent="#e6e3da"
                className="h-full"
                label="Replace with GLTF of signature processing core"
              />
            </motion.div>
          </div>

          {/* Scrolling pillars */}
          <div className="flex flex-col gap-px">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.04}>
                <div className="group border-t border-[var(--color-line)] py-10 transition-colors last:border-b">
                  <div className="flex items-baseline gap-5">
                    <span className="font-display text-sm tabular-nums text-[var(--color-bronze)]">
                      {p.n}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-light tracking-tight text-[var(--color-ink)]">
                        {p.title}
                      </h3>
                      <p className="text-pretty mt-3 max-w-md leading-relaxed text-[var(--color-ink-muted)]">
                        {p.body}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
