import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";

import { SiteThemeProvider } from "@/components/site-theme";
import SiteNavbar from "@/components/site-navbar";
import SiteFooter from "@/components/site-footer";

import "@fontsource/barlow-condensed/800.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "JUPITAR STUDIO | Creative Studio Rentals",
  description:
    "Discover and book photography studios, podcast rooms, music suites, and creative workspaces by the hour.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SiteThemeProvider>
          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="h-16 border-b border-[var(--border)] bg-[var(--page)]"
              />
            }
          >
            <SiteNavbar />
          </Suspense>

          {children}

          <SiteFooter />
        </SiteThemeProvider>
      </body>
    </html>
  );
}