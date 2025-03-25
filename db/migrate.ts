import type { MigrationConfig } from "drizzle-orm/migrator";
import { db } from "./db";
import migrations from "./migrations.json";
import { users } from "./schema/users";

export async function migrate() {
  console.log("start migrate function");

  try {
    // @ts-expect-error Types for dialect.migrate and session are not properly exposed
    await db.dialect.migrate(migrations, db.session, {
      migrationsTable: "drizzle_migrations",
    } satisfies Omit<MigrationConfig, "migrationsFolder">);

    console.log("end migrate function");
    await db.insert(users).values({ userName: "jojo", role: "admin" });
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
