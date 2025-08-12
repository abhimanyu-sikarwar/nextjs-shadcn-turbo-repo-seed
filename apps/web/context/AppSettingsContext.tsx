"use client";
// context/AppSettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface AppSettings {
  spacing: "compact" | "normal" | "relaxed";
  fontSize: "small" | "base" | "large";
}

interface AppSettingsContextType {
  settings: AppSettings;
  updateSpacing: (spacing: AppSettings["spacing"]) => void;
  updateFontSize: (fontSize: AppSettings["fontSize"]) => void;
}

const STORAGE_KEY = "app-display-settings";

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(
  undefined,
);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    // Load settings from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      spacing: "normal",
      fontSize: "base",
    };
  });

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Apply initial classes
    const root = document.documentElement;
    root.classList.add(
      `spacing-${settings.spacing}`,
      `text-${settings.fontSize}`,
    );

    return () => {
      root.classList.remove(
        `spacing-${settings.spacing}`,
        `text-${settings.fontSize}`,
      );
    };
  }, [settings]);

  const updateSpacing = (spacing: AppSettings["spacing"]) => {
    setSettings((prev) => ({ ...prev, spacing }));
  };

  const updateFontSize = (fontSize: AppSettings["fontSize"]) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  };

  return (
    <AppSettingsContext.Provider
      value={{ settings, updateSpacing, updateFontSize }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useAppSettings must be used within an AppSettingsProvider",
    );
  }
  return context;
};
