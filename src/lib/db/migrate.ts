import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { createClient } from "@libsql/client";

/**
 * Applies generated migrations from ./drizzle. Non-interactive, so it works
 * in CI and remote environments. Run via `npm run db:migrate`.
 */
async function main() {
  const url = process.env.TURSO_DATABASE_URL || "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  const client = createClient({ url, authToken });
  const db = drizzle(client);
  console.log("→ Applying migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migrations applied.");
  process.exit(0);
}

main().catch((err) => {
  console.error("✗ Migration failed:", err);
  process.exit(1);
});
