import React from "react";
import { Sun, Moon, Globe } from "lucide-react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

interface ThemeLanguageControlsProps {
  compact?: boolean;
}

export const ThemeLanguageControls: React.FC<ThemeLanguageControlsProps> = ({ compact = false }) => {
  const { theme, toggleTheme, language, setLanguage, t } = useThemeLanguage();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* Language Switcher Button (ID / EN) */}
      <div className="inline-flex items-center p-0.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs">
        <button
          type="button"
          onClick={() => setLanguage("id")}
          title="Ganti ke Bahasa Indonesia"
          className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
            language === "id"
              ? "bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 shadow-xs"
              : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          }`}
        >
          ID
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          title="Switch to English"
          className={`px-2 py-1 text-[11px] font-bold rounded-lg transition-all ${
            language === "en"
              ? "bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 shadow-xs"
              : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
          }`}
        >
          EN
        </button>
      </div>

      {/* Theme Toggle Button (Light / Dark) */}
      <button
        type="button"
        id="btn-theme-toggle"
        onClick={toggleTheme}
        title={theme === "light" ? t("darkMode") : t("lightMode")}
        className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 transition-colors shadow-2xs flex items-center justify-center"
      >
        {theme === "light" ? (
          <Moon className="w-4 h-4 text-stone-700 transition-transform hover:-rotate-12" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
        )}
        <span className="sr-only">
          {theme === "light" ? t("darkMode") : t("lightMode")}
        </span>
      </button>
    </div>
  );
};
