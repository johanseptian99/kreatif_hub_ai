import React from "react";
import { Sparkles, HeartHandshake, FileSpreadsheet, CheckCircle2, ShieldCheck } from "lucide-react";
import { AuthUser } from "../types";
import { useThemeLanguage } from "../context/ThemeLanguageContext";
import { ContentGenerator } from "./features/ContentGenerator";
import { CSResponder } from "./features/CSResponder";
import { DataExtractor } from "./features/DataExtractor";
import { TemanUMKMChatModal } from "./features/TemanUMKMChatModal";

interface DashboardProps {
  user: AuthUser;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, activeTab, onSelectTab }) => {
  const { t } = useThemeLanguage();

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        
        {/* User Welcome Banner */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-stone-200 dark:border-stone-700"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-stone-900 rounded-full" title="Online" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold font-serif text-stone-900 dark:text-stone-50">
                  {t("dashWelcome")}, {user.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" /> {t("dashVerified")}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                {t("dashAccessOpen")} • {user.email} • {user.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/80 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t("dashSessionGoogle")}</span>
          </div>
        </div>

        {/* 3 Main Feature Tabs */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-2 border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Tab 1 */}
            <button
              id="tab-generator-konten"
              onClick={() => onSelectTab("content")}
              className={`p-3.5 rounded-xl text-left transition-all flex items-center gap-3 border ${
                activeTab === "content"
                  ? "bg-amber-500/10 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-stone-900 dark:text-stone-50 shadow-2xs"
                  : "bg-transparent border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                activeTab === "content"
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
              }`}>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">{t("dashTab1Title")}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{t("dashTab1Sub")}</div>
              </div>
            </button>

            {/* Tab 2 */}
            <button
              id="tab-responden-cs"
              onClick={() => onSelectTab("cs")}
              className={`p-3.5 rounded-xl text-left transition-all flex items-center gap-3 border ${
                activeTab === "cs"
                  ? "bg-blue-500/10 dark:bg-blue-950/50 border-blue-400 dark:border-blue-600 text-stone-900 dark:text-stone-50 shadow-2xs"
                  : "bg-transparent border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                activeTab === "cs"
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
              }`}>
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">{t("dashTab2Title")}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{t("dashTab2Sub")}</div>
              </div>
            </button>

            {/* Tab 3 */}
            <button
              id="tab-ekstraktor-data"
              onClick={() => onSelectTab("extractor")}
              className={`p-3.5 rounded-xl text-left transition-all flex items-center gap-3 border ${
                activeTab === "extractor"
                  ? "bg-emerald-500/10 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-600 text-stone-900 dark:text-stone-50 shadow-2xs"
                  : "bg-transparent border-transparent hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                activeTab === "extractor"
                  ? "bg-emerald-600 text-white font-bold"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
              }`}>
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">{t("dashTab3Title")}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{t("dashTab3Sub")}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Feature Component Container */}
        <main className="transition-all duration-200">
          {activeTab === "content" && <ContentGenerator />}
          {activeTab === "cs" && <CSResponder />}
          {activeTab === "extractor" && <DataExtractor />}
        </main>

        {/* Floating Chatbot Teman UMKM (Melayang di Sebelah Kanan) */}
        <TemanUMKMChatModal user={user} />

      </div>
    </div>
  );
};
