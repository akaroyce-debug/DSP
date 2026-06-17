"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Plus, ExternalLink } from "lucide-react";
import { ProductFormModal } from "./product-form-modal";
import { GlassModal } from "@/components/ui/glass/glass-modal";
import { deleteProduct } from "@/lib/actions/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/db/schema";

export function ProductsPanel({ products }: { products: Product[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }
  function handleDelete() {
    if (!confirmDelete) return;
    startTransition(async () => {
      await deleteProduct(confirmDelete.id);
      router.refresh();
      setConfirmDelete(null);
    });
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-[var(--color-ink-muted)]">
          {products.length} product{products.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={openCreate}
          className="glass-sheen inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="size-4" /> New product
        </button>
      </div>

      <div className="glass overflow-hidden rounded-[var(--radius-glass)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] text-left text-[var(--color-ink-muted)]">
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="hidden px-5 py-4 font-medium md:table-cell">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="hidden px-5 py-4 font-medium sm:table-cell">Status</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[var(--color-line)] transition-colors last:border-0 hover:bg-[color-mix(in_srgb,var(--color-ink)_3%,transparent)]"
              >
                <td className="px-5 py-4">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-[var(--color-ink-faint)]">
                    /{product.slug}
                  </div>
                </td>
                <td className="hidden px-5 py-4 text-[var(--color-ink-muted)] md:table-cell">
                  {product.category}
                </td>
                <td className="px-5 py-4 tabular-nums">
                  {formatPrice(product.price, product.currency)}
                </td>
                <td className="hidden px-5 py-4 sm:table-cell">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.inStock
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {product.inStock ? "In stock" : "Hidden"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <a
                      href={`/products/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View on site"
                      className="grid size-9 place-items-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-ink)_6%,transparent)] hover:text-[var(--color-ink)]"
                    >
                      <ExternalLink className="size-4" />
                    </a>
                    <button
                      onClick={() => openEdit(product)}
                      aria-label="Edit"
                      className="grid size-9 place-items-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-ink)_6%,transparent)] hover:text-[var(--color-ink)]"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(product)}
                      aria-label="Delete"
                      className="grid size-9 place-items-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
        onSaved={() => router.refresh()}
      />

      <GlassModal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete product"
        description={`This permanently removes "${confirmDelete?.name}".`}
      >
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full bg-red-500 px-6 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </GlassModal>
    </>
  );
}
