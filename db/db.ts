// db.ts

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { users } from "./schema/users";

// Create the client
const client = new PGlite({
  dataDir: "nextjs-pglite.db" // Use a simple string path instead of URL format
});

// Initialize the database
const db = drizzle(client);

// Export the database instance
export { db, client };

// Initialize the database asynchronously
export async function initializeDb() {
  try {
    // Test the connection
    await db.select().from(users).limit(1);
    console.log("Database connection successful");
  } catch (e) {
    console.log("Database initialization error:", e);
    // Import migrate here to avoid circular dependency
    const { migrate } = await import("./migrate");
    await migrate();
  }
}

// Run initialization in the background
initializeDb().catch(console.error);
