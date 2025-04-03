import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import PGliteProviderWrapper from "@/components/pglite-provider";
import { cookies } from "next/headers"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  variable: "--font-pt-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Task Quest",
  description: "An easy to use task manager",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"


  return (
    
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${nunito.variable} ${ptSans.variable} antialiased relative`}
      >
        <PGliteProviderWrapper>
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

        <div className="texture" />
                <SidebarInset>
        <SiteHeader />

        {children}      </SidebarInset>
        </SidebarProvider>
        </PGliteProviderWrapper>

      </body>
    </html>

  );
}