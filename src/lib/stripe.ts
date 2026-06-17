import Stripe from "stripe";
import type { OrderItem } from "./db/schema";

/**
 * Stripe scaffolding — PAYMENTS ARE NOT ACTIVE YET.
 *
 * This wires up a typed client and the shapes the checkout/webhook routes use.
 * To go live:
 *   1. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in your env.
 *   2. Flip `STRIPE_ENABLED` by simply providing the secret key.
 *   3. Replace the stub bodies in /api/stripe/* with the commented real flows.
 */
export const STRIPE_ENABLED = Boolean(process.env.STRIPE_SECRET_KEY);

let stripeSingleton: Stripe | null = null;

/** Lazily construct the Stripe client; returns null until a key is set. */
export function getStripe(): Stripe | null {
  if (!STRIPE_ENABLED) return null;
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      // Pin a known API version for stability; update intentionally.
      apiVersion: "2026-05-27.dahlia",
      appInfo: { name: "RoyceDSP", version: "0.1.0" },
    });
  }
  return stripeSingleton;
}

export type CheckoutLineItem = Pick<
  OrderItem,
  "productId" | "name" | "price" | "quantity"
>;

export type CheckoutRequest = {
  email?: string;
  items: CheckoutLineItem[];
};

/** Build Stripe line items from cart items (prices already in cents). */
export function toStripeLineItems(items: CheckoutLineItem[], currency = "usd") {
  return items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency,
      unit_amount: item.price,
      product_data: { name: item.name, metadata: { productId: item.productId } },
    },
  }));
}
