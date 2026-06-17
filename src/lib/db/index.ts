import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

/**
 * Turso (libSQL) connection.
 *
 * Local development falls back to a file-based SQLite db (`local.db`) so the
 * site runs with zero external setup. In production set:
 *   TURSO_DATABASE_URL=libsql://<your-db>.turso.io
 *   TURSO_AUTH_TOKEN=<token>
 */
// `||` (not `??`) so an empty-string env var falls back to the local file.
const url = process.env.TURSO_DATABASE_URL || "file:local.db";
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

const client = createClient({ url, authToken });

export const db = drizzle(client, { schema });
export { schema };
