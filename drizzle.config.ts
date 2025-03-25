import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", 
  schema: "./db/schema",
  out: "./db/migrations",
  driver: "pglite",
  dbCredentials: {
    url: "idb://nextjs-pglite",
  },
});
