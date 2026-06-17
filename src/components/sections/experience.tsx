"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { VideoPlaceholder } from "@/components/placeholders/video-placeholder";
import { GlassButton } from "@/components/ui/glass/glass-button";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Frame scales up subtly as it enters — a cinematic "open".
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section id="experience" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-8 flex items-center gap-4">
          <span className="overline">The Experience</span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
          <span className="font-display text-sm text-[var(--color-ink-faint)]">04</span>
        </Reveal>

        <Reveal className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.04] tracking-[-0.03em]">
            See it move. Hear it breathe.
          </h2>
          <p className="text-pretty max-w-sm leading-relaxed text-[var(--color-ink-muted)]">
            A short film on how RoyceDSP reshapes the way sound is made — from
            first listen to final master.
          </p>
        </Reveal>

        <div ref={ref}>
          <motion.div style={{ scale, y }} className="will-change-transform">
            <VideoPlaceholder
              aspect="aspect-[16/9]"
              label="The RoyceDSP film (replace with 4K hero video)"
            />
          </motion.div>
        </div>

        <Reveal className="mt-12 flex justify-center">
          <GlassButton href="#collection" size="lg" variant="bronze">
            Begin with the collection
          </GlassButton>
        </Reveal>
      </div>
    </section>
  );
}
