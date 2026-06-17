"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { GlassButton } from "@/components/ui/glass/glass-button";
import { ThreeDPlaceholder } from "@/components/placeholders/three-d-placeholder";
import { EASE } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Layered parallax — copy drifts up, form sinks and scales, all gently.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const formY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const formScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const word = {
    hidden: { opacity: 0, y: "0.45em" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: EASE, delay: 0.35 + i * 0.08 },
    }),
  };

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-28"
    >
      {/* Ambient field behind everything */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-[120vmin] -translate-x-1/2 -translate-y-[55%] rounded-full bg-[radial-gradient(circle,rgba(243,237,226,0.8),transparent_62%)]" />
        <div className="absolute left-1/2 top-1/2 size-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9),transparent_60%)]" />
      </div>

      {/* The soundform sits behind the headline with depth */}
      <motion.div
        style={{ y: formY, scale: formScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 w-[min(86vw,720px)] -translate-x-1/2 -translate-y-1/2"
      >
        <ThreeDPlaceholder aspect="aspect-square" className="opacity-90" />
      </motion.div>

      {/* Copy */}
      <motion.div
        style={{ y: copyY, opacity: fade }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="glass mb-8 rounded-full px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--color-ink-soft)]"
        >
          Audio Intelligence, Refined
        </motion.span>

        <h1 className="font-display text-[clamp(2.75rem,9vw,7rem)] font-light leading-[0.95] tracking-[-0.04em] text-[var(--color-ink)]">
          <span className="block overflow-hidden">
            {["The", "sound"].map((w, i) => (
              <motion.span
                key={w}
                custom={i}
                variants={word}
                initial="hidden"
                animate="show"
                className="mr-[0.22em] inline-block"
              >
                {w}
              </motion.span>
            ))}
          </span>
          <span className="block overflow-hidden">
            {["of", "what's", "next."].map((w, i) => (
              <motion.span
                key={w}
                custom={i + 2}
                variants={word}
                initial="hidden"
                animate="show"
                className="mr-[0.22em] inline-block italic text-[var(--color-bronze)]"
                style={{ fontWeight: 300 }}
              >
                {w}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: EASE }}
          className="text-balance mt-8 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)] sm:text-lg"
        >
          Processing tools and intelligent plugins for the world&apos;s most
          discerning producers. Engineered with obsessive precision. Tuned for
          the ear, not the meter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <GlassButton href="#collection" size="lg" variant="primary">
            Explore the collection
          </GlassButton>
          <GlassButton href="#vision" size="lg" variant="glass">
            The vision
          </GlassButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-[var(--color-ink-faint)]"
        >
          <span className="overline">Scroll</span>
          <ArrowDown className="size-4" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
