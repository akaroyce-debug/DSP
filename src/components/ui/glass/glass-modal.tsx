"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Centered glass modal with backdrop blur, spring entrance, scroll lock and
 * escape-to-close. Content scrolls within the panel for long forms.
 */
export function GlassModal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6">
          <motion.div
            className="fixed inset-0 bg-[color-mix(in_srgb,var(--color-ink)_28%,transparent)] backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={`glass-strong relative my-auto w-full ${
              size === "lg" ? "max-w-3xl" : "max-w-xl"
            } rounded-[var(--radius-glass)] p-6 sm:p-8`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-5 top-5 grid size-9 place-items-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-ink)_6%,transparent)] hover:text-[var(--color-ink)]"
            >
              <X className="size-4" />
            </button>

            {(title || description) && (
              <header className="mb-6 pr-10">
                {title && (
                  <h2 className="font-display text-2xl font-medium tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1.5 text-sm text-[var(--color-ink-muted)]">
                    {description}
                  </p>
                )}
              </header>
            )}

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
