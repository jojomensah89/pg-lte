"use client"
import { runMigrations } from "@/db/compile-migrations";
import { PGliteProvider } from "@electric-sql/pglite-react"
import { useEffect } from "react";
import { PGlite, IdbFs } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { WelcomeDialog } from "./welcome-dialog";

const db = await PGlite.create({
  extensions: { live },
  fs: new IdbFs("test-task-db"),
});


export default function PGliteProviderWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setup = async () => {
      try {
        await runMigrations(db);
      } catch (error) {
        console.error("Setup error:", error);
      }
    };
    
    setup();
  }, []);
  
  return (
    <PGliteProvider db={db}>
      {children}
      <WelcomeDialog/>
    </PGliteProvider>
  );
}