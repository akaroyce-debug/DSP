"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, LogOut, Package, Receipt } from "lucide-react";
import { ProductsPanel } from "./products-panel";
import { OrdersPanel } from "./orders-panel";
import { logout } from "@/lib/actions/auth";
import { formatPrice } from "@/lib/utils";
import type { Order, Product } from "@/lib/db/schema";

type Tab = "products" | "orders";

export function AdminDashboard({
  products,
  orders,
}: {
  products: Product[];
  orders: Order[];
}) {
  const [tab, setTab] = useState<Tab>("products");

  const revenue = orders
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    { label: "Products", value: String(products.length) },
    { label: "In stock", value: String(products.filter((p) => p.inStock).length) },
    { label: "Orders", value: String(orders.length) },
    { label: "Revenue", value: formatPrice(revenue) },
  ];

  const tabs: { id: Tab; label: string; icon: typeof Package }[] = [
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: Receipt },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative grid size-9 place-items-center">
            <span className="absolute inset-0 rounded-full bg-[var(--color-ink)]" />
            <span className="absolute inset-[3px] rounded-full bg-[var(--color-paper)]" />
            <span className="absolute inset-[6px] rounded-full bg-[var(--color-ink)]" />
          </span>
          <div>
            <div className="font-display text-lg font-semibold leading-none tracking-tight">
              RoyceDSP
            </div>
            <div className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Management console
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-4 py-2 text-sm font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-ink)_4%,transparent)]"
          >
            View site <ArrowUpRight className="size-3.5" />
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
            >
              <LogOut className="size-3.5" /> Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="overline mb-2">{s.label}</div>
            <div className="font-display text-3xl font-light tabular-nums tracking-tight">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-8 inline-flex gap-1 rounded-full border border-[var(--color-line)] p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors"
          >
            {tab === id && (
              <motion.span
                layoutId="admin-tab"
                className="absolute inset-0 rounded-full bg-[var(--color-ink)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 inline-flex items-center gap-2 ${
                tab === id ? "text-[var(--color-paper)]" : "text-[var(--color-ink-soft)]"
              }`}
            >
              <Icon className="size-4" /> {label}
            </span>
          </button>
        ))}
      </div>

      {tab === "products" ? (
        <ProductsPanel products={products} />
      ) : (
        <OrdersPanel orders={orders} />
      )}
    </div>
  );
}
