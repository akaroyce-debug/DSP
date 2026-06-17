"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/motion/reveal";

const STATEMENT =
  "We build instruments, not utilities. Every algorithm is shaped by ear, every interface composed like an object you'd want to hold. RoyceDSP exists for those who believe the tools should be as considered as the work.";

export function Vision() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  const words = STATEMENT.split(" ");

  return (
    <section id="vision" className="relative px-6 py-32 sm:py-44">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="overline">The Vision</span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
          <span className="font-display text-sm text-[var(--color-ink-faint)]">
            01
          </span>
        </Reveal>

        {/* Word-by-word fill as the section passes through view */}
        <div ref={ref}>
          <p className="font-display text-[clamp(1.6rem,4.4vw,3.1rem)] font-light leading-[1.22] tracking-[-0.02em]">
            {words.map((wordText, i) => {
              const start = i / words.length;
              const end = start + 1 / words.length;
              return (
                <Word
                  key={`${wordText}-${i}`}
                  progress={scrollYProgress}
                  range={[start, end]}
                >
                  {wordText}
                </Word>
              );
            })}
          </p>
        </div>

        <Reveal
          delay={0.1}
          className="mt-16 grid gap-10 border-t border-[var(--color-line)] pt-12 sm:grid-cols-3"
        >
          {[
            { k: "Founded", v: "On restraint" },
            { k: "Designed", v: "For the ear" },
            { k: "Built", v: "To last decades" },
          ].map((item) => (
            <div key={item.k}>
              <div className="overline mb-2">{item.k}</div>
              <div className="font-display text-xl font-light text-[var(--color-ink)]">
                {item.v}
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}
