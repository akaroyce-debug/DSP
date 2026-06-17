"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { GlassModal } from "@/components/ui/glass/glass-modal";
import {
  GlassInput,
  GlassTextarea,
  GlassSelect,
  Field,
} from "@/components/ui/glass/glass-input";
import {
  productInputSchema,
  type ProductInput,
  type ProductFormInput,
} from "@/lib/validation";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

export function ProductFormModal({
  open,
  onClose,
  product,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSaved: () => void;
}) {
  const isEdit = Boolean(product);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          description: product.description,
          price: product.price / 100,
          currency: product.currency,
          category: product.category as ProductFormInput["category"],
          media: product.media,
          features: product.features,
          inStock: product.inStock,
          sortOrder: product.sortOrder,
        }
      : {
          name: "",
          slug: "",
          shortDescription: "",
          description: "",
          price: 0,
          currency: "USD",
          category: "Core DSP",
          media: [],
          features: [],
          inStock: true,
          sortOrder: 0,
        },
  });

  const features = useFieldArray({ control, name: "features" });
  const media = useFieldArray({ control, name: "media" });

  async function onSubmit(values: ProductInput) {
    setFormError(null);
    const result = product
      ? await updateProduct(product.id, values)
      : await createProduct(values);

    if (result.ok) {
      reset();
      onSaved();
      onClose();
    } else {
      setFormError(result.error);
    }
  }

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      size="lg"
      title={isEdit ? "Edit product" : "New product"}
      description={
        isEdit
          ? "Update pricing, copy, media and availability."
          : "Add a new product to the collection."
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-h-[68vh] space-y-5 overflow-y-auto pr-1"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="name" error={errors.name?.message}>
            <GlassInput
              id="name"
              {...register("name", {
                onChange: (e) => {
                  if (!isEdit) setValue("slug", slugify(e.target.value));
                },
              })}
              placeholder="Aurum Core"
            />
          </Field>
          <Field label="Slug" htmlFor="slug" error={errors.slug?.message}>
            <GlassInput id="slug" {...register("slug")} placeholder="aurum-core" />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="Price (USD)"
            htmlFor="price"
            error={errors.price?.message}
            hint="In dollars; stored as cents."
          >
            <GlassInput
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register("price")}
            />
          </Field>
          <Field label="Category" htmlFor="category" error={errors.category?.message}>
            <GlassSelect id="category" {...register("category")}>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </GlassSelect>
          </Field>
          <Field
            label="Sort order"
            htmlFor="sortOrder"
            error={errors.sortOrder?.message}
          >
            <GlassInput id="sortOrder" type="number" {...register("sortOrder")} />
          </Field>
        </div>

        <Field
          label="Short description"
          htmlFor="shortDescription"
          error={errors.shortDescription?.message}
        >
          <GlassInput
            id="shortDescription"
            {...register("shortDescription")}
            placeholder="The reference processing engine, distilled."
          />
        </Field>

        <Field
          label="Description"
          htmlFor="description"
          error={errors.description?.message}
          hint="Supports multiple paragraphs; rich-text editor ready."
        >
          <GlassTextarea
            id="description"
            rows={5}
            {...register("description")}
            placeholder="Full product narrative…"
          />
        </Field>

        {/* In stock toggle */}
        <Controller
          control={control}
          name="inStock"
          render={({ field }) => (
            <button
              type="button"
              onClick={() => field.onChange(!field.value)}
              className="flex items-center gap-3"
            >
              <span
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  field.value
                    ? "bg-[var(--color-ink)]"
                    : "bg-[var(--color-line)]"
                }`}
              >
                <span
                  className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                    field.value ? "translate-x-[1.4rem]" : "translate-x-0.5"
                  }`}
                />
              </span>
              <span className="text-sm font-medium text-[var(--color-ink-soft)]">
                {field.value ? "In stock" : "Hidden / sold out"}
              </span>
            </button>
          )}
        />

        {/* Features */}
        <section className="rounded-2xl border border-[var(--color-line)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Features</h3>
            <button
              type="button"
              onClick={() => features.append({ title: "", description: "" })}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[color-mix(in_srgb,var(--color-ink)_4%,transparent)]"
            >
              <Plus className="size-3.5" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {features.fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <div className="grid flex-1 gap-2 sm:grid-cols-[1fr_1.6fr]">
                  <GlassInput
                    placeholder="Title"
                    {...register(`features.${i}.title` as const)}
                  />
                  <GlassInput
                    placeholder="Description"
                    {...register(`features.${i}.description` as const)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => features.remove(i)}
                  aria-label="Remove feature"
                  className="grid size-11 shrink-0 place-items-center rounded-2xl text-[var(--color-ink-faint)] transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            {features.fields.length === 0 && (
              <p className="text-xs text-[var(--color-ink-faint)]">
                No features yet.
              </p>
            )}
          </div>
        </section>

        {/* Media */}
        <section className="rounded-2xl border border-[var(--color-line)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Media</h3>
            <button
              type="button"
              onClick={() => media.append({ kind: "model", url: "", alt: "" })}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-[color-mix(in_srgb,var(--color-ink)_4%,transparent)]"
            >
              <Plus className="size-3.5" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {media.fields.map((m, i) => (
              <div key={m.id} className="flex gap-2">
                <div className="grid flex-1 gap-2 sm:grid-cols-[auto_1.6fr_1fr]">
                  <GlassSelect {...register(`media.${i}.kind` as const)}>
                    <option value="model">3D model</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </GlassSelect>
                  <GlassInput
                    placeholder="URL (leave blank for placeholder)"
                    {...register(`media.${i}.url` as const)}
                  />
                  <GlassInput
                    placeholder="Alt text"
                    {...register(`media.${i}.alt` as const)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => media.remove(i)}
                  aria-label="Remove media"
                  className="grid size-11 shrink-0 place-items-center rounded-2xl text-[var(--color-ink-faint)] transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            {media.fields.length === 0 && (
              <p className="text-xs text-[var(--color-ink-faint)]">
                No media yet — products fall back to the soundform placeholder.
              </p>
            )}
          </div>
        </section>

        {formError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {formError}
          </p>
        )}

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-[var(--color-line)] bg-transparent pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="glass-sheen rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-sm font-medium text-[var(--color-paper)] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </GlassModal>
  );
}
