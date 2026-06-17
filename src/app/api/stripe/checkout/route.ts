import { NextResponse } from "next/server";
import {
  STRIPE_ENABLED,
  getStripe,
  toStripeLineItems,
  type CheckoutRequest,
} from "@/lib/stripe";

/**
 * Checkout session creation — SCAFFOLDED, NOT ACTIVE.
 *
 * While STRIPE_ENABLED is false (no secret key set), this responds 503 so the
 * frontend can show a graceful "coming soon" state. The real implementation
 * is written out below, commented, ready to enable.
 */
export async function POST(request: Request) {
  if (!STRIPE_ENABLED) {
    return NextResponse.json(
      {
        enabled: false,
        message:
          "Checkout is not active yet. Set STRIPE_SECRET_KEY to enable payments.",
      },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe unavailable" }, { status: 503 });
  }

  const body = (await request.json()) as CheckoutRequest;
  if (!body?.items?.length) {
    return NextResponse.json({ error: "No items provided" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // ── Real flow (enable when ready) ──────────────────────────────
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: toStripeLineItems(body.items),
    customer_email: body.email,
    success_url: `${siteUrl}/?checkout=success`,
    cancel_url: `${siteUrl}/?checkout=cancelled`,
    metadata: {
      items: JSON.stringify(
        body.items.map((i) => ({ id: i.productId, q: i.quantity })),
      ),
    },
  });

  return NextResponse.json({ enabled: true, url: session.url, id: session.id });
}
