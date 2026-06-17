import { NextResponse } from "next/server";
import { STRIPE_ENABLED, getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { orders, type OrderItem } from "@/lib/db/schema";

/**
 * Stripe webhook endpoint — SCAFFOLDED, NOT ACTIVE.
 *
 * When STRIPE_ENABLED and STRIPE_WEBHOOK_SECRET are set, this verifies the
 * signature and records paid orders. Until then it acknowledges with 200 so
 * Stripe's endpoint test passes without side effects.
 *
 * Configure the endpoint in the Stripe dashboard to POST to:
 *   {NEXT_PUBLIC_SITE_URL}/api/stripe/webhook
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_ENABLED || !stripe || !webhookSecret) {
    return NextResponse.json({ received: true, active: false });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    let items: OrderItem[] = [];
    try {
      const raw = JSON.parse(session.metadata?.items ?? "[]");
      items = Array.isArray(raw) ? raw : [];
    } catch {
      items = [];
    }

    await db.insert(orders).values({
      customerEmail: session.customer_details?.email ?? "unknown",
      items,
      totalAmount: session.amount_total ?? 0,
      currency: (session.currency ?? "usd").toUpperCase(),
      status: "paid",
      stripeSessionId: session.id,
    });
  }

  return NextResponse.json({ received: true, active: true });
}
