import { z } from "zod";
import { ORDER_STATUSES, PRODUCT_CATEGORIES } from "./db/schema";

const mediaItemSchema = z.object({
  kind: z.enum(["image", "video", "model"]),
  url: z.string().default(""),
  alt: z.string().optional(),
  poster: z.string().optional(),
});

const featureSchema = z.object({
  title: z.string().min(1, "Feature title is required"),
  description: z.string().min(1, "Feature description is required"),
});

export const productInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers and hyphens"),
  shortDescription: z
    .string()
    .min(4, "Add a short description")
    .max(200, "Keep the short description under 200 characters"),
  description: z.string().default(""),
  // Accept dollars as a string/number from the form, store cents.
  price: z.coerce.number().min(0, "Price cannot be negative"),
  currency: z.string().default("USD"),
  category: z.enum(PRODUCT_CATEGORIES),
  media: z.array(mediaItemSchema).default([]),
  features: z.array(featureSchema).default([]),
  inStock: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

// Output (after coercion/defaults) — what server actions receive.
export type ProductInput = z.output<typeof productInputSchema>;
// Input — what the form fields hold before coercion (e.g. price as string).
export type ProductFormInput = z.input<typeof productInputSchema>;

export const orderStatusSchema = z.enum(ORDER_STATUSES);

export const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
