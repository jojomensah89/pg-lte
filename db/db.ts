import { PGlite, IdbFs } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";

const db = await PGlite.create({
  extensions: { live },
  fs: new IdbFs("test-task-db"),
});
await db.waitReady;

export default db;
