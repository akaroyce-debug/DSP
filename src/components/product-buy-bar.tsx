"use client";

import { useState } from "react";
import { ShoppingBag, Sparkles } from "lucide-react";
import { GlassButton } from "@/components/ui/glass/glass-button";
import { AnimatePresence, motion } from "motion/react";

type BuyProduct = {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
};

/**
 * Buy action. Calls the checkout API which, until Stripe is activated,
 * responds 503 — we surface that as a calm "coming soon" note rather than an
 * error. Once STRIPE_SECRET_KEY is set, this redirects to Stripe Checkout.
 */
export function ProductBuyBar({ product }: { product: BuyProduct }) {
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            { productId: product.id, name: product.name, price: product.price, quantity: 1 },
          ],
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setNotice(
        data.message ?? "Checkout opens soon. Join The Signal to be first to know.",
      );
    } catch {
      setNotice("Something went wrong. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <GlassButton
          onClick={handleBuy}
          size="lg"
          variant="primary"
          disabled={!product.inStock || loading}
          magnetic={false}
        >
          <ShoppingBag className="size-4" strokeWidth={1.75} />
          {loading ? "One moment…" : product.inStock ? "Acquire" : "Sold out"}
        </GlassButton>
        <GlassButton href="/#experience" size="lg" variant="ghost" magnetic={false}>
          Watch the film
        </GlassButton>
      </div>

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-[var(--color-ink-soft)]"
          >
            <Sparkles className="size-3.5 text-[var(--color-bronze)]" />
            {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
