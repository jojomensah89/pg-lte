import { PGlite } from "@electric-sql/pglite";
import { live} from "@electric-sql/pglite/live";



  const db = await PGlite.create({
    extensions: { live },
    dataDir: "idb://test-task-db",
  });
  await db.waitReady;



export default db;
