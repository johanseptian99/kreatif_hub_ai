import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "../i18n/translations";

type Theme = "light" | "dark";

interface ThemeLanguageContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.id) => string;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state with localStorage persistence
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem("kreatifhub_theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  // Language state with localStorage persistence
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem("kreatifhub_lang");
      if (savedLang === "id" || savedLang === "en") {
        return savedLang;
      }
      return "id";
    } catch {
      return "id";
    }
  });

  // Sync dark class on document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("kreatifhub_theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("kreatifhub_lang", lang);
    } catch {
      // ignore
    }
  };

  const t = (key: keyof typeof translations.id): string => {
    const currentLangDict = translations[language];
    return (currentLangDict && currentLangDict[key]) || translations.id[key] || (key as string);
  };

  return (
    <ThemeLanguageContext.Provider value={{ theme, toggleTheme, language, setLanguage, t }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (!context) {
    throw new Error("useThemeLanguage must be used within a ThemeLanguageProvider");
  }
  return context;
};
