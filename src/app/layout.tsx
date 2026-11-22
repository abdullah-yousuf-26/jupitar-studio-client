import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteThemeProvider } from "@/components/site-theme";
import SiteFooter from "@/components/site-footer";
import SiteNavbar from "@/components/site-navbar";
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
          <SiteNavbar />
          {children}
          <SiteFooter />
        </SiteThemeProvider>

      </body>
    </html>
  );
}
