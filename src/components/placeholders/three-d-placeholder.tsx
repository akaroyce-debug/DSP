"use client";

import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

// Conditionally load the WebGL scene only on the client, and only when needed.
const Soundform = dynamic(() => import("@/components/three/soundform"), {
  ssr: false,
  loading: () => <SceneFallback loading />,
});

function SceneFallback({
  loading = false,
  reduced = false,
}: {
  loading?: boolean;
  reduced?: boolean;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="relative grid size-24 place-items-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-[radial-gradient(circle,var(--color-bronze-tint),transparent_70%)]" />
        <Boxes
          className="size-7 text-[var(--color-ink-faint)]"
          strokeWidth={1.25}
        />
      </div>
      <span className="overline">
        {reduced
          ? "Interactive soundform"
          : loading
            ? "Rendering soundform…"
            : "Soundform"}
      </span>
    </div>
  );
}

/**
 * Premium 3D placeholder. Renders an abstract soundform sculpture via
 * @react-three/fiber once scrolled into view. Falls back to a static,
 * still-beautiful frame for reduced-motion users.
 *
 * REPLACE: see comments in components/three/soundform.tsx for swapping in a
 * real GLTF product model.
 */
export function ThreeDPlaceholder({
  className,
  accent,
  aspect = "aspect-square",
  label,
}: {
  className?: string;
  accent?: string;
  aspect?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.15 });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-glass)]",
        aspect,
        className,
      )}
    >
      {/* Ambient glow ground so the form sits in soft light */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_45%,rgba(255,255,255,0.9),transparent_70%)]" />

      {reduce ? (
        <SceneFallback reduced />
      ) : inView ? (
        <Soundform accent={accent} />
      ) : (
        <SceneFallback />
      )}

      {label && (
        <span className="overline absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}
