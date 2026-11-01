import { createContext } from "react";

export type Language = "en" | "hi";

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (englishText: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
