"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-2xl border border-[var(--color-line)] bg-white/60 px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] backdrop-blur-sm transition-[border,box-shadow,background] duration-300 outline-none focus:border-[color-mix(in_srgb,var(--color-bronze)_50%,transparent)] focus:bg-white/80 focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-bronze)_12%,transparent)]";

export const GlassInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function GlassInput({ className, ...props }, ref) {
  return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
});

export const GlassTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function GlassTextarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldBase, "min-h-28 resize-y leading-relaxed", className)}
      {...props}
    />
  );
});

export const GlassSelect = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function GlassSelect({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(fieldBase, "appearance-none bg-white/60", className)}
      {...props}
    >
      {children}
    </select>
  );
});

/** Accessible field wrapper with refined label + optional error. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-[0.8125rem] font-medium text-[var(--color-ink-soft)]"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-[var(--color-ink-faint)]">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
