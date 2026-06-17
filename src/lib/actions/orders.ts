"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth-server";
import { orderStatusSchema } from "@/lib/validation";
import type { ActionResult } from "./products";

export async function updateOrderStatus(
  id: string,
  status: string,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = orderStatusSchema.safeParse(status);
  if (!parsed.success) {
    return { ok: false, error: "Invalid status." };
  }
  try {
    await db
      .update(orders)
      .set({ status: parsed.data })
      .where(eq(orders.id, id));
    revalidatePath("/admin");
    return { ok: true, id };
  } catch {
    return { ok: false, error: "Could not update order." };
  }
}
