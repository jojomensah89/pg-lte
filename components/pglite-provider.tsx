"use client"
import { runMigrations } from "@/db/compile-migrations";
import db from "@/db/db";
import { PGliteProvider } from "@electric-sql/pglite-react"
import { useEffect,  } from "react";


export default function PGliteProviderWrapper({ children }: { children: React.ReactNode }) {

   useEffect(() => {
    const setup = async () => {
     
      await runMigrations(db);
   
    }
      setup();
    
  }, []);
  return (
   <PGliteProvider db={db}>
      {children}
    </PGliteProvider>
  )

}