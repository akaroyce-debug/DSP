"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "motion/react";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/motion/reveal";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/db/schema";
import { EASE } from "@/lib/motion";

const ALL = "All" as const;

export function Collection({ products }: { products: Product[] }) {
  const [active, setActive] = useState<string>(ALL);

  // Only show category pills that actually have products.
  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    return [ALL, ...PRODUCT_CATEGORIES.filter((c) => present.has(c))];
  }, [products]);

  const filtered = useMemo(
    () =>
      active === ALL
        ? products
        : products.filter((p) => p.category === active),
    [active, products],
  );

  return (
    <section id="collection" className="relative px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mb-8 flex items-center gap-4">
          <span className="overline">The Collection</span>
          <span className="h-px flex-1 bg-[var(--color-line)]" />
          <span className="font-display text-sm text-[var(--color-ink-faint)]">02</span>
        </Reveal>

        <Reveal className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display max-w-xl text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.03em]">
            Tools, considered
            <br />
            down to the sample.
          </h2>

          {/* Category pills */}
          <LayoutGroup>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isActive = active === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActive(cat)}
                    className="relative rounded-full px-4 py-2 text-[0.8125rem] font-medium transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="pill"
                        className="glass-strong absolute inset-0 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span
                      className={`relative z-10 ${
                        isActive
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                      }`}
                    >
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-20 text-center text-[var(--color-ink-muted)]">
            Nothing in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
