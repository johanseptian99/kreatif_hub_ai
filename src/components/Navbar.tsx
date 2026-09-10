import React, { useState } from "react";
import { Sparkles, LogOut, CheckCircle2, Menu, X, Shield, ArrowRight } from "lucide-react";
import { AuthUser } from "../types";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import { ThemeLanguageControls } from "./ThemeLanguageControls";

interface NavbarProps {
  user: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  activeTab?: string;
  onSelectTab?: (tabId: string) => void;
  isDashboard?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onLogout,
  activeTab,
  onSelectTab,
  isDashboard = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useThemeLanguage();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <a href="#profil" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
                K
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                    {t("appName")}
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 rounded border border-amber-200 dark:border-amber-800">
                    {t("brandBadge")}
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 tracking-tight hidden sm:inline">
                  {t("appSubtitle")}
                </span>
              </div>
            </a>
          </div>

          {/* Navigation Links (when in Landing page) */}
          {!isDashboard && (
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600 dark:text-stone-300">
              <a href="#profil" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                {t("navProfile")}
              </a>
              <a href="#kegunaan" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                {t("navUseCases")}
              </a>
              <a href="#keunggulan" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                {t("navAdvantages")}
              </a>
              <a href="#fitur-utama" className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                {t("nav3Capabilities")}
              </a>
            </nav>
          )}

          {/* Dashboard Feature Switcher (when in Dashboard) */}
          {isDashboard && onSelectTab && (
            <div className="hidden md:flex items-center p-1 bg-stone-100 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <button
                id="nav-tab-content"
                onClick={() => onSelectTab("content")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "content"
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {t("navTabContent")}
              </button>
              <button
                id="nav-tab-cs"
                onClick={() => onSelectTab("cs")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "cs"
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {t("navTabCS")}
              </button>
              <button
                id="nav-tab-extractor"
                onClick={() => onSelectTab("extractor")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "extractor"
                    ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white"
                }`}
              >
                {t("navTabExtractor")}
              </button>
            </div>
          )}

          {/* Controls & Auth Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark/Light & Language Toggles */}
            <ThemeLanguageControls />

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-stone-300 dark:border-stone-600"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{user.name}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 font-mono leading-none">
                      {user.email}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-logout"
                  onClick={onLogout}
                  title={t("logout")}
                  className="p-2 text-stone-500 dark:text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-transparent hover:border-rose-100 dark:hover:border-rose-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("logout")}</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-navbar-google-login"
                onClick={onOpenAuth}
                className="py-2 px-3.5 sm:px-4 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2 active:scale-[0.98]"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden xs:inline">{t("signInGoogle")}</span>
                <span className="xs:hidden">Login</span>
              </button>
            )}

            {/* Mobile menu button */}
            {!isDashboard && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {!isDashboard && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-200 dark:border-stone-800 space-y-2 text-sm font-medium text-stone-700 dark:text-stone-300 animate-in slide-in-from-top duration-150">
            <a
              href="#profil"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {t("navProfile")}
            </a>
            <a
              href="#kegunaan"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {t("navUseCases")}
            </a>
            <a
              href="#keunggulan"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {t("navAdvantages")}
            </a>
            <a
              href="#fitur-utama"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              {t("nav3Capabilities")}
            </a>
          </div>
        )}
      </div>
    </header>
  );
};
