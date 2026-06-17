import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

/**
 * Elegant image placeholder.
 *
 * REPLACE: drop in a <next/image> (or <Image fill />) pointing at the real
 * asset, keeping the same wrapper aspect ratio and rounded corners.
 */
export function ImagePlaceholder({
  label = "Photography",
  aspect = "aspect-[4/3]",
  className,
  grain = true,
  rounded = "rounded-[var(--radius-glass)]",
}: {
  label?: string;
  aspect?: string;
  className?: string;
  grain?: boolean;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "group relative w-full overflow-hidden border border-[var(--color-line)]",
        aspect,
        rounded,
        className,
      )}
    >
      {/* Soft light-leak gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_20%_0%,#ffffff,transparent),radial-gradient(120%_120%_at_100%_100%,var(--color-bronze-tint),transparent)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#f6f5f1] to-[#ecebe6]" style={{ mixBlendMode: "multiply" }} />

      {grain && (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--color-ink-faint)]">
        <ImageIcon
          className="size-6 transition-transform duration-700 group-hover:scale-110"
          strokeWidth={1.25}
        />
        <span className="overline">{label}</span>
      </div>

      {/* Thin inner frame for crispness */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/40" />
    </div>
  );
}
