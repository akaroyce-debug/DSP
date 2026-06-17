import "server-only";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "./index";
import { orders, products, type Order, type Product } from "./schema";

/** All products, ordered for the public collection grid. */
export async function getProducts(): Promise<Product[]> {
  return db
    .select()
    .from(products)
    .orderBy(asc(products.sortOrder), desc(products.createdAt));
}

/** In-stock products only — used by the public site. */
export async function getAvailableProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.inStock);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return rows[0];
}

export async function getProductById(
  id: string,
): Promise<Product | undefined> {
  const rows = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return rows[0];
}

export async function getOrders(): Promise<Order[]> {
  return db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  return rows[0];
}
