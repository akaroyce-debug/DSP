import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Structured media reference. `kind` lets the frontend decide how to render
 * (video player, image, or a 3D GLTF viewer) once real assets replace the
 * placeholders.
 */
export type MediaItem = {
  kind: "image" | "video" | "model";
  url: string;
  alt?: string;
  /** For "model": path to a .gltf/.glb once available. */
  poster?: string;
};

export type ProductFeature = {
  title: string;
  description: string;
};

export const PRODUCT_CATEGORIES = [
  "Core DSP",
  "Spatial Intelligence",
  "Creative Tools",
  "Signature Packs",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const products = sqliteTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  // Rich-text-ready: stored as markdown/HTML string for future editor.
  description: text("description").notNull().default(""),
  // Stored in minor units (cents) to avoid floating-point drift.
  price: integer("price").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  category: text("category").notNull().default("Core DSP"),
  media: text("media", { mode: "json" })
    .notNull()
    .$type<MediaItem[]>()
    .default(sql`'[]'`),
  features: text("features", { mode: "json" })
    .notNull()
    .$type<ProductFeature[]>()
    .default(sql`'[]'`),
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type ShippingInfo = {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
};

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "fulfilled",
  "refunded",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orders = sqliteTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerEmail: text("customer_email").notNull(),
  items: text("items", { mode: "json" })
    .notNull()
    .$type<OrderItem[]>()
    .default(sql`'[]'`),
  totalAmount: integer("total_amount").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("pending").$type<OrderStatus>(),
  // Digital products often need no shipping; kept for completeness.
  shippingInfo: text("shipping_info", { mode: "json" }).$type<ShippingInfo | null>(),
  // Stripe linkage, ready for when payments are activated.
  stripeSessionId: text("stripe_session_id"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
