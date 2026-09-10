import React from "react";
import {
  Sparkles,
  Clock,
  MessageSquare,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  HeartHandshake,
  Lock,
} from "lucide-react";
import { useThemeLanguage } from "../context/ThemeLanguageContext";

interface LandingPageProps {
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { t } = useThemeLanguage();

  return (
    <div className="w-full bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 overflow-x-hidden transition-colors duration-200">
      {/* 1. HERO & PROFIL APLIKASI */}
      <section id="profil" className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-stone-200 dark:border-stone-800 bg-linear-to-b from-stone-100/70 via-stone-50 to-white dark:from-stone-900/60 dark:via-stone-950 dark:to-stone-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>{t("heroBadge")}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.15]">
                {t("heroHeading1")}{" "}
                <span className="text-amber-800 dark:text-amber-400 underline decoration-amber-400 dark:decoration-amber-500 decoration-wavy decoration-2">
                  {t("heroHeadingHighlight")}
                </span>{" "}
                {t("heroHeading2")}
              </h1>

              {/* Subheading / Profil */}
              <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
                {t("heroDescription")}
              </p>

              {/* Mandatory Auth Lock Notice */}
              <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 rounded-xl flex items-center gap-3 text-xs text-amber-900 dark:text-amber-200">
                <Lock className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>
                  <strong>{t("heroLockNoticeStrong")}</strong> {t("heroLockNoticeText")}
                </span>
              </div>

              {/* Prominent CTA Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  id="btn-hero-google-login"
                  onClick={onOpenAuth}
                  className="py-3.5 px-6 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-sm sm:text-base rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] group"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>{t("signInGoogleBukaAkses")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#kegunaan"
                  className="py-3.5 px-5 bg-white hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-medium text-sm rounded-xl border border-stone-300 dark:border-stone-700 text-center transition-colors"
                >
                  {t("heroBtnLearn")}
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-500 dark:text-stone-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("heroTrustOAuth")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("heroTrustFree")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("heroTrustContext")}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Visual Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-mono font-medium text-stone-400 dark:text-stone-500">
                    {t("heroPreviewTitle")}
                  </span>
                </div>

                {/* Preview Cards Stack */}
                <div className="space-y-3">
                  {/* Item 1 */}
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> 1. {t("cap1Title")}
                      </span>
                      <span className="text-[10px] bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-semibold px-1.5 py-0.5 rounded">
                        Siap Salin
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-sans italic">
                      "Aroma kopi Gayo asli yang langsung bikin melek ide kreatifmu! ☕✨ Beli 2 gratis ongkir se-Jawa!"
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/60 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950 dark:text-blue-200 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> 2. {t("cap2Title")}
                      </span>
                      <span className="text-[10px] bg-blue-200/70 dark:bg-blue-900/60 text-blue-900 dark:text-blue-300 font-semibold px-1.5 py-0.5 rounded">
                        Empati & Solutif
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 font-sans">
                      "Mohon maaf sekali ya Kak atas kendala toples sambalnya. Jangan khawatir, paket pengganti baru langsung kami kirim hari ini..."
                    </p>
                  </div>

                  {/* Item 3 */}
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> 3. {t("cap3Title")}
                      </span>
                      <span className="text-[10px] bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 font-semibold px-1.5 py-0.5 rounded">
                        Tabel Terstruktur
                      </span>
                    </div>
                    <div className="text-[11px] grid grid-cols-2 gap-1 text-stone-700 dark:text-stone-300 font-mono bg-white dark:bg-stone-800/80 p-2 rounded border border-emerald-100 dark:border-emerald-900/50">
                      <div>Pelanggan: Sarah A.</div>
                      <div>Kota: Jakarta Barat</div>
                      <div>Item: 3x Keripik Sagu</div>
                      <div>Total: Rp 165.000</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={onOpenAuth}
                    className="w-full py-2 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3 h-3 text-stone-500" />
                    <span>{t("heroPreviewCopyBtn")}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. KEGUNAAN APLIKASI (3 FUNGSI UTAMA) */}
      <section id="kegunaan" className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              {t("useCasesBadge")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
              {t("useCasesTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              {t("useCasesDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Kegunaan 1: Memangkas Waktu Kerja */}
            <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-7 border border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {t("useCase1Title")}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {t("useCase1Desc")}
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs font-medium text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t("useCase1Point1")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t("useCase1Point2")}</span>
                </li>
              </ul>
            </div>

            {/* Kegunaan 2: Mengotomatisasi Interaksi Pelanggan */}
            <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-7 border border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {t("useCase2Title")}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {t("useCase2Desc")}
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs font-medium text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t("useCase2Point1")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t("useCase2Point2")}</span>
                </li>
              </ul>
            </div>

            {/* Kegunaan 3: Merapikan Data Bisnis */}
            <div className="bg-stone-50 dark:bg-stone-900 rounded-2xl p-7 border border-stone-200 dark:border-stone-800 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-sm transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {t("useCase3Title")}
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {t("useCase3Desc")}
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-stone-200 dark:border-stone-800 space-y-2 text-xs font-medium text-stone-700 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t("useCase3Point1")}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t("useCase3Point2")}</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 3. KEUNGGULAN UTAMA (HANYA KEUNGGULAN) */}
      <section id="keunggulan" className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              {t("advBadge")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
              {t("advTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              {t("advDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Keunggulan 1 */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {t("adv1Title")}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("adv1Desc")}
              </p>
            </div>

            {/* Keunggulan 2 */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {t("adv2Title")}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("adv2Desc")}
              </p>
            </div>

            {/* Keunggulan 3 */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {t("adv3Title")}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("adv3Desc")}
              </p>
            </div>

            {/* Keunggulan 4 */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-400 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5 text-rose-700 dark:text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {t("adv4Title")}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("adv4Desc")}
              </p>
            </div>

            {/* Keunggulan 5 */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-purple-700 dark:text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {t("adv5Title")}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("adv5Desc")}
              </p>
            </div>

            {/* Keunggulan 6 */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {t("adv6Title")}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("adv6Desc")}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SHOWCASE 3 KAPABILITAS UTAMA */}
      <section id="fitur-utama" className="py-16 md:py-24 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              {t("capabilitiesBadge")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
              {t("capabilitiesTitle")}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base">
              {t("capabilitiesDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 hover:border-amber-300 dark:hover:border-amber-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{t("cap1Title")}</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("cap1Desc")}
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-1 rounded border border-amber-200 dark:border-amber-800">
                  {t("cap1Badge")}
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{t("cap2Title")}</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("cap2Desc")}
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
                  {t("cap2Badge")}
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">{t("cap3Title")}</h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {t("cap3Desc")}
              </p>
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800">
                  {t("cap3Badge")}
                </span>
              </div>
            </div>

          </div>

          {/* Final Call To Action Banner */}
          <div className="bg-linear-to-r from-stone-900 via-stone-800 to-stone-900 dark:from-stone-900 dark:via-stone-850 dark:to-stone-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl border border-stone-700 dark:border-stone-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{t("bottomCTABadge")}</span>
            </div>
            
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold max-w-2xl mx-auto leading-tight">
              {t("bottomCTATitle")}
            </h3>
            
            <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              {t("bottomCTADesc")}
            </p>

            <div className="pt-2 flex justify-center">
              <button
                id="btn-bottom-google-login"
                onClick={onOpenAuth}
                className="py-3.5 px-7 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-3 active:scale-[0.98]"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#1c1917"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#1c1917"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#1c1917"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#1c1917"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{t("bottomCTABtn")}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400 text-center space-y-2 transition-colors">
        <p className="font-semibold text-stone-700 dark:text-stone-300">
          {t("footerText")}
        </p>
        <p>
          {t("footerSecurity")}
        </p>
      </footer>
    </div>
  );
};
