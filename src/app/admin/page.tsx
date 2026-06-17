import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getProducts, getOrders } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Console",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);
  return <AdminDashboard products={products} orders={orders} />;
}
