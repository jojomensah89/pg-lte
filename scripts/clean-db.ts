import { PGlite, IdbFs } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { runMigrations } from "../db/compile-migrations";

async function cleanDatabase() {
  console.log("Starting database cleanup...");
  
  try {
    // Initialize the database connection
    const db = await PGlite.create({
      extensions: { live },
      fs: new IdbFs("test-task-db"),
    });
    
    console.log("Connected to database");
    
    // Drop all tables
    console.log("Dropping all tables...");
    await db.query(`
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS tags CASCADE;
      DROP TABLE IF EXISTS task_tags CASCADE;
    `);
    
    console.log("All tables dropped successfully");
    
    // Run migrations to recreate tables
    console.log("Running migrations to recreate tables...");
    await runMigrations(db);
    
    console.log("Database cleaned and reset successfully!");
    
    // Close the connection
    await db.close();
    console.log("Database connection closed");
    
    return { success: true };
  } catch (error) {
    console.error("Error cleaning database:", error);
    return { success: false, error };
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  cleanDatabase()
    .then((result) => {
      if (result.success) {
        console.log("Database cleanup completed successfully");
        process.exit(0);
      } else {
        console.error("Database cleanup failed");
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Unexpected error:", error);
      process.exit(1);
    });
}

export { cleanDatabase };