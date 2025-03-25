import { readMigrationFiles } from "drizzle-orm/migrator";
import { join } from "node:path";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Get current file directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function compileMigrations() {
  const migrations = readMigrationFiles({ migrationsFolder: "./db/migrations" });

  await writeFile(
    join(__dirname, "./migrations.json"),
    JSON.stringify(migrations, null, 2)
  );

  console.log("Migrations compiled!");
}

compileMigrations().catch(console.error);
