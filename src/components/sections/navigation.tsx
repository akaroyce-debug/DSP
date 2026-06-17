"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X } from "lucide-react";
import { GlassButton } from "@/components/ui/glass/glass-button";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

const LINKS = [
  { label: "Vision", href: "#vision" },
  { label: "Collection", href: "#collection" },
  { label: "Technology", href: "#technology" },
  { label: "Experience", href: "#experience" },
];

export function Navigation() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
  });

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav
          className={cn(
            "flex w-full max-w-6xl items-center justify-between rounded-full px-3 py-2.5 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5",
            scrolled
              ? "glass-strong"
              : "border border-transparent bg-transparent",
          )}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 pl-1.5"
            aria-label="RoyceDSP home"
          >
            <span className="relative grid size-8 place-items-center">
              <span className="absolute inset-0 rounded-full bg-[var(--color-ink)]" />
              <span className="absolute inset-[3px] rounded-full bg-[var(--color-paper)]" />
              <span className="absolute inset-[6px] rounded-full bg-[var(--color-ink)] transition-transform duration-700 group-hover:scale-75" />
            </span>
            <span className="font-display text-[1.05rem] font-semibold tracking-tight">
              Royce<span className="text-[var(--color-ink-muted)]">DSP</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative rounded-full px-4 py-2 text-sm text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-ink)]"
                >
                  {link.label}
                  <span className="absolute inset-x-4 bottom-1.5 h-px origin-left scale-x-0 bg-[var(--color-ink)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Cart (coming soon)"
              className="relative grid size-10 place-items-center rounded-full text-[var(--color-ink-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-ink)_5%,transparent)] hover:text-[var(--color-ink)]"
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-[var(--color-bronze)]" />
            </button>

            <div className="hidden sm:block">
              <GlassButton href="#collection" size="sm" variant="primary" magnetic={false}>
                Explore
              </GlassButton>
            </div>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-full text-[var(--color-ink)] md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 md:hidden"
          >
            <div className="glass-strong absolute inset-0" />
            <div className="relative flex flex-col items-center gap-6">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, ease: EASE }}
                  className="font-display text-3xl font-light tracking-tight text-[var(--color-ink)]"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
