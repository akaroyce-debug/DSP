"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth-server";
import { productInputSchema } from "@/lib/validation";

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Parse a raw form/object payload into validated product fields (cents). */
function parseProduct(raw: unknown) {
  const parsed = productInputSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false as const,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;
  return {
    success: true as const,
    value: {
      name: data.name,
      slug: data.slug,
      shortDescription: data.shortDescription,
      description: data.description,
      price: Math.round(data.price * 100), // dollars → cents
      currency: data.currency,
      category: data.category,
      media: data.media,
      features: data.features,
      inStock: data.inStock,
      sortOrder: data.sortOrder,
    },
  };
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/products", "layout");
}

export async function createProduct(raw: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseProduct(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", fieldErrors: parsed.fieldErrors };
  }
  try {
    const [row] = await db.insert(products).values(parsed.value).returning();
    revalidate();
    return { ok: true, id: row.id };
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("UNIQUE")
        ? "A product with that slug already exists."
        : "Could not create product.";
    return { ok: false, error: message };
  }
}

export async function updateProduct(
  id: string,
  raw: unknown,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = parseProduct(raw);
  if (!parsed.success) {
    return { ok: false, error: "Validation failed", fieldErrors: parsed.fieldErrors };
  }
  try {
    await db
      .update(products)
      .set({ ...parsed.value, updatedAt: new Date().toISOString() })
      .where(eq(products.id, id));
    revalidate();
    return { ok: true, id };
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("UNIQUE")
        ? "A product with that slug already exists."
        : "Could not update product.";
    return { ok: false, error: message };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await db.delete(products).where(eq(products.id, id));
    revalidate();
    return { ok: true, id };
  } catch {
    return { ok: false, error: "Could not delete product." };
  }
}
