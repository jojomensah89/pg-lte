import { migrate } from "drizzle-orm/pglite/migrator";
import { db } from "./db";

await migrate(db, {
  migrationsFolder: "./migrations/",
});

console.log("Migration complete");
