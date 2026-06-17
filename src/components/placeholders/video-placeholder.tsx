"use client";

import { motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cinematic video placeholder with a tactile play affordance.
 *
 * REPLACE: swap the inner backdrop for a <video> element (muted, playsInline,
 * loop, poster) or a streaming embed. Keep the wrapper + aspect ratio.
 *   <video className="absolute inset-0 size-full object-cover" autoPlay muted
 *          loop playsInline poster="/poster.jpg">
 *     <source src="/hero-4k.mp4" type="video/mp4" />
 *   </video>
 */
export function VideoPlaceholder({
  label = "Hero cinematic film (replace with 4K video)",
  aspect = "aspect-video",
  className,
}: {
  label?: string;
  aspect?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden rounded-[var(--radius-glass)] border border-[var(--color-line)]",
        aspect,
        className,
      )}
    >
      {/* Deep, soft cinematic gradient ground */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f3f2ee_0%,#e9e8e3_45%,#dedcd5_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_50%_-10%,rgba(255,255,255,0.9),transparent)]" />

      {/* Slow drifting light to suggest motion behind the frame */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute -inset-[40%] opacity-60"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, transparent, rgba(184,150,106,0.18), transparent 40%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Play control */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <motion.button
          type="button"
          aria-label="Play film"
          className="glass-strong glass-sheen relative grid size-20 place-items-center rounded-full"
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Play
            className="size-6 translate-x-0.5 fill-[var(--color-ink)] text-[var(--color-ink)]"
            strokeWidth={0}
          />
        </motion.button>
        <span className="overline max-w-[80%] text-center">{label}</span>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/40" />
    </div>
  );
}
