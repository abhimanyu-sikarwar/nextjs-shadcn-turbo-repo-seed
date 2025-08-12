"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
// import { useTranslation } from '../context/translation-context';

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${DeepKeys<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

type TranslationKey = DeepKeys<any>;
// type TranslationKey = DeepKeys<typeof import('../lib/i18n.ts').en>;

export function useTranslatedText() {
  const { t } = useTranslation();

  const translate = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      let translation = t(key);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          translation = translation.replace(
            new RegExp(`{{${key}}}`, "g"),
            String(value),
          );
        });
      }

      return translation;
    },
    [t],
  );

  return {
    t: translate,
  };
}
