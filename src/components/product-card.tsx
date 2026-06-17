"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { GlassCard } from "@/components/ui/glass/glass-card";
import { ThreeDPlaceholder } from "@/components/placeholders/three-d-placeholder";
import { ImagePlaceholder } from "@/components/placeholders/image-placeholder";
import { formatPrice } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import type { Product } from "@/lib/db/schema";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const reduce = useReducedMotion();
  const lead = product.media[0];
  const useModel = !lead || lead.kind === "model";

  return (
    <motion.div
      className="group/card h-full"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.08 }}
    >
      <Link href={`/products/${product.slug}`} className="block h-full">
        <GlassCard interactive className="flex h-full flex-col p-3">
          {/* Media */}
          <div className="relative overflow-hidden rounded-[1.1rem] bg-[var(--color-paper-pure)]">
            {useModel ? (
              <ThreeDPlaceholder aspect="aspect-[5/4]" />
            ) : (
              <ImagePlaceholder
                aspect="aspect-[5/4]"
                label={product.name}
                rounded="rounded-[1.1rem]"
              />
            )}
            {!product.inStock && (
              <span className="glass-strong absolute left-3 top-3 rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                Sold out
              </span>
            )}
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
            <div className="overline mb-2.5">{product.category}</div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-medium tracking-tight text-[var(--color-ink)]">
                {product.name}
              </h3>
              <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-muted)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:bg-[var(--color-ink)] group-hover/card:text-[var(--color-paper)]">
                <ArrowUpRight className="size-4" strokeWidth={1.5} />
              </span>
            </div>
            <p className="text-pretty mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {product.shortDescription}
            </p>
            <div className="mt-5 flex items-baseline justify-between border-t border-[var(--color-line)] pt-4">
              <span className="font-display text-lg font-medium tabular-nums text-[var(--color-ink)]">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="text-xs text-[var(--color-ink-faint)]">
                View details
              </span>
            </div>
          </div>
        </GlassCard>
      </Link>
    </motion.div>
  );
}
