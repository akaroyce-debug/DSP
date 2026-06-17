import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "./auth";

/** Returns true if the current request carries a valid admin session. */
export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

/** Throws if not authenticated — call at the top of every admin mutation. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }
}
