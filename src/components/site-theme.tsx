"use client";

import type { ReactNode } from "react";
import { ThemeProvider, useTheme } from "next-themes";

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="jupitar-studio-theme"
    >
      {children}
    </ThemeProvider>
  );
}

export function ThemeSwitch() {
  const { setTheme } = useTheme();

  function toggleTheme() {
    const isLight = document.documentElement.dataset.theme === "light";
    setTheme(isLight ? "dark" : "light");
  }

  return (
    <button type="button" className="theme-switch" onClick={toggleTheme}>
      <span className="show-in-dark">Use light theme</span>
      <span className="show-in-light">Use dark theme</span>
    </button>
  );
}
