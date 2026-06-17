"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GlassModal } from "@/components/ui/glass/glass-modal";
import { GlassSelect } from "@/components/ui/glass/glass-input";
import { updateOrderStatus } from "@/lib/actions/orders";
import { ORDER_STATUSES, type Order } from "@/lib/db/schema";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-700",
  fulfilled: "bg-sky-50 text-sky-700",
  refunded: "bg-zinc-100 text-zinc-600",
  cancelled: "bg-red-50 text-red-600",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLES[status] ?? "bg-zinc-100 text-zinc-600"}`}
    >
      {status}
    </span>
  );
}

export function OrdersPanel({ orders }: { orders: Order[] }) {
  const [selected, setSelected] = useState<Order | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function changeStatus(id: string, status: string) {
    startTransition(async () => {
      await updateOrderStatus(id, status);
      router.refresh();
      setSelected((prev) =>
        prev && prev.id === id ? { ...prev, status: status as Order["status"] } : prev,
      );
    });
  }

  if (orders.length === 0) {
    return (
      <div className="glass rounded-[var(--radius-glass)] p-16 text-center">
        <p className="font-display text-xl font-light text-[var(--color-ink)]">
          No orders yet
        </p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Orders will appear here once Stripe checkout is activated.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="glass overflow-hidden rounded-[var(--radius-glass)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-left text-[var(--color-ink-muted)]">
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="hidden px-5 py-4 font-medium sm:table-cell">Items</th>
              <th className="px-5 py-4 font-medium">Total</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="hidden px-5 py-4 font-medium md:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => setSelected(order)}
                className="cursor-pointer border-b border-[var(--color-line)] transition-colors last:border-0 hover:bg-[color-mix(in_srgb,var(--color-ink)_3%,transparent)]"
              >
                <td className="px-5 py-4 font-medium">{order.customerEmail}</td>
                <td className="hidden px-5 py-4 text-[var(--color-ink-muted)] sm:table-cell">
                  {order.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                </td>
                <td className="px-5 py-4 tabular-nums">
                  {formatPrice(order.totalAmount, order.currency)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="hidden px-5 py-4 text-[var(--color-ink-muted)] md:table-cell">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GlassModal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Order detail"
        description={selected?.id}
      >
        {selected && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="overline mb-1">Customer</div>
                <div className="font-medium">{selected.customerEmail}</div>
              </div>
              <div>
                <div className="overline mb-1">Placed</div>
                <div className="font-medium">{formatDate(selected.createdAt)}</div>
              </div>
            </div>

            <div>
              <div className="overline mb-3">Items</div>
              <div className="divide-y divide-[var(--color-line)] rounded-2xl border border-[var(--color-line)]">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3">
                    <span>
                      {item.name}{" "}
                      <span className="text-[var(--color-ink-faint)]">
                        × {item.quantity}
                      </span>
                    </span>
                    <span className="tabular-nums">
                      {formatPrice(item.price * item.quantity, selected.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-4">
              <span className="text-sm text-[var(--color-ink-muted)]">Total</span>
              <span className="font-display text-xl font-medium tabular-nums">
                {formatPrice(selected.totalAmount, selected.currency)}
              </span>
            </div>

            <div>
              <div className="overline mb-2">Status</div>
              <GlassSelect
                value={selected.status}
                disabled={isPending}
                onChange={(e) => changeStatus(selected.id, e.target.value)}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s} className="capitalize">
                    {s}
                  </option>
                ))}
              </GlassSelect>
            </div>
          </div>
        )}
      </GlassModal>
    </>
  );
}
