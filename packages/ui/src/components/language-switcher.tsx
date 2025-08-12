import React from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select.tsx";
import i18n from "../lib/i18n.ts";

interface I18nProviderProps {
  children: React.ReactNode;
}

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
  ];

  const handleLanguageChange = (value: any) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="flex items-center gap-2">
      {/* <Globe className="w-4 h-4 text-muted-foreground" /> */}
      <Select defaultValue={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <span className="flex items-center gap-2">
                  <span>{lang.name}</span>
                  <span className="text-muted-foreground font-medium text-sm">
                    ({lang.nativeName})
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};
