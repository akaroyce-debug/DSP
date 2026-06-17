"use client";

import { motion, useReducedMotion } from "motion/react";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { EASE_LUXE } from "@/lib/motion";

/**
 * Frosted glass surface with depth. On hover it lifts gently and its shadow
 * evolves — the card feels like a physical pane catching light. Pointer
 * tracking adds a faint specular highlight that follows the cursor.
 */
type GlassCardProps = {
  children: ReactNode;
  className?: string;
  /** Enable hover lift + specular tracking. */
  interactive?: boolean;
  /** Stronger frost for foreground panels (modals, nav). */
  strong?: boolean;
  onClick?: () => void;
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    { children, className, interactive = false, strong = false, onClick },
    ref,
  ) {
    const reduce = useReducedMotion();

    const handlePointer = (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduce) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };

    return (
      <motion.div
        ref={ref}
        onClick={onClick}
        onPointerMove={interactive ? handlePointer : undefined}
        className={cn(
          strong ? "glass-strong" : "glass",
          "relative isolate overflow-hidden rounded-[var(--radius-glass)]",
          interactive && "cursor-pointer",
          className,
        )}
        whileHover={
          interactive && !reduce
            ? { y: -6, transition: { duration: 0.5, ease: EASE_LUXE } }
            : undefined
        }
        style={
          { "--mx": "50%", "--my": "50%" } as React.CSSProperties
        }
      >
        {interactive && !reduce && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--mx) var(--my), color-mix(in srgb, white 60%, transparent), transparent 60%)",
            }}
          />
        )}
        {children}
      </motion.div>
    );
  },
);
