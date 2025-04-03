
export async function runMigrations(db) {
  console.log("Migrating database...");
  await db?.exec(`
    CREATE TABLE IF NOT EXISTS task (
      id SERIAL PRIMARY KEY,
      task TEXT,
      done BOOLEAN DEFAULT false
    );
   
  `);

  console.log("Migrations Done!");
}
