"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { I18nProvider } from "@workspace/ui"
import { AppSettingsProvider } from "../context/AppSettingsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <NextThemesProvider
    //   attribute="class"
    //   defaultTheme="system"
    //   // enableSystem
    //   disableTransitionOnChange
    //   // enableColorScheme
    // >
    // </NextThemesProvider>

    <AppSettingsProvider>
      {/* <I18nProvider> */}
      {children}
      {/* </I18nProvider> */}
    </AppSettingsProvider>
  );
}
