import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Film,
  Instagram,
  MessageCircle,
  ShoppingBag,
  Layers,
  Sliders,
  Clock,
  Music
} from "lucide-react";
import { ContentGeneratorPayload, ContentGeneratorResult } from "../../types";
import { CONTENT_PRESETS } from "../../data/samplePresets";
import { useThemeLanguage } from "../../context/ThemeLanguageContext";

export const ContentGenerator: React.FC = () => {
  const { t } = useThemeLanguage();

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Kuliner Nusantara & Olahan Pangan");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [tone, setTone] = useState("Santai, Gaul, & Memikat (Gen Z / TikTok)");
  const [platform, setPlatform] = useState<"all" | "instagram" | "tiktok" | "whatsapp" | "marketplace">("all");
  const [keyBenefits, setKeyBenefits] = useState("");
  const [callToAction, setCallToAction] = useState("Klik link di bio atau pesan via WhatsApp sekarang!");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ContentGeneratorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<"all" | "instagram" | "tiktok" | "whatsapp" | "marketplace">("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Apply preset
  const handleApplyPreset = (presetId: string) => {
    const p = CONTENT_PRESETS.find((x) => x.id === presetId);
    if (p) {
      setProductName(p.name);
      setCategory(p.category);
      setDescription(p.description);
      setTargetAudience(p.targetAudience);
      setTone(p.tone);
      setPlatform(p.platform);
      setKeyBenefits(p.keyBenefits);
      setCallToAction(p.callToAction);
      setError(null);
    }
  };

  // Submit to backend
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !description.trim()) {
      setError("Nama produk dan deskripsi produk wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: ContentGeneratorPayload = {
        productName,
        category,
        description,
        targetAudience,
        tone,
        platform,
        keyBenefits,
        callToAction,
      };

      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal memproses pembuatan konten.");
      }

      const data: ContentGeneratorResult = await res.json();
      setResult(data);
      if (platform !== "all") {
        setActiveOutputTab(platform);
      } else {
        setActiveOutputTab("all");
      }
    } catch (err: any) {
      console.error("Generator error:", err);
      setError(err.message || "Terjadi kesalahan saat memproses generator konten.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-800/70 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              {t("cgBannerTitle")}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {t("cgBannerDesc")}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mr-1">
            {t("cgQuickExamples")}
          </span>
          {CONTENT_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.id)}
              className="px-2.5 py-1 text-xs bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium rounded-lg border border-stone-300 dark:border-stone-700 transition-colors shadow-2xs"
            >
              {p.name.split(" ")[0]} {p.name.split(" ")[1] || ""}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Input */}
        <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {t("cgParamTitle")}
            </h3>
            <button
              type="button"
              onClick={() => {
                setProductName("");
                setDescription("");
                setKeyBenefits("");
                setTargetAudience("");
                setResult(null);
                setError(null);
              }}
              className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> {t("cgReset")}
            </button>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Nama Produk */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("cgLabelProdName")} <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-product-name"
                type="text"
                placeholder={t("cgPhProdName")}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all"
              />
            </div>

            {/* Kategori Sektor */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("cgLabelSector")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-stone-100 transition-all"
              >
                <option>Kuliner Nusantara & Olahan Pangan</option>
                <option>Kriya & Kerajinan Tangan (Anyaman, Kayu, Keramik)</option>
                <option>Fesyen, Tekstil, & Tenun Tradisional</option>
                <option>Desain Produk & Dekorasi Interior</option>
                <option>Kecantikan Alami & Perawatan Herbal</option>
                <option>Penerbitan & Desain Grafis Kreatif</option>
              </select>
            </div>

            {/* Deskripsi & Cerita Pembuatan */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("cgLabelDesc")} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="input-product-desc"
                rows={3}
                placeholder={t("cgPhDesc")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full text-xs sm:text-sm p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all resize-y"
              />
            </div>

            {/* Keunggulan Utama (USP) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("cgLabelUSP")}
              </label>
              <input
                type="text"
                placeholder={t("cgPhUSP")}
                value={keyBenefits}
                onChange={(e) => setKeyBenefits(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all"
              />
            </div>

            {/* Target Audiens & Gaya Bahasa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {t("cgLabelAudience")}
                </label>
                <input
                  type="text"
                  placeholder={t("cgPhAudience")}
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {t("cgLabelTone")}
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-stone-100 transition-all"
                >
                  <option>Santai, Gaul, & Memikat (Gen Z / TikTok)</option>
                  <option>Elegan, Eksklusif, & Mewah</option>
                  <option>Hangat, Otentik, & Penuh Cerita (Storytelling)</option>
                  <option>Lugas, Informatif, & Terpercaya</option>
                </select>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("cgLabelCTA")}
              </label>
              <input
                type="text"
                placeholder={t("cgPhCTA")}
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              id="btn-submit-content-generator"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 dark:border-stone-900/40 border-t-white dark:border-t-stone-900 rounded-full animate-spin" />
                  <span>{t("cgBtnLoading")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400 dark:text-stone-950" />
                  <span>{t("cgBtnSubmit")}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Output Showcase */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !isLoading && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-10 border border-dashed border-stone-300 dark:border-stone-700 text-center space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">{t("cgEmptyTitle")}</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                {t("cgEmptyDesc")}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-12 border border-stone-200 dark:border-stone-800 shadow-xs text-center space-y-4 transition-colors">
              <div className="w-12 h-12 border-3 border-amber-500/20 border-t-amber-600 rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{t("cgLoadingTitle")}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {t("cgLoadingDesc")}
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Output Sub-Tabs */}
              <div className="bg-white dark:bg-stone-900 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-1.5 flex-wrap transition-colors">
                <button
                  onClick={() => setActiveOutputTab("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeOutputTab === "all"
                      ? "bg-amber-500 text-stone-950 shadow-xs font-bold"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" /> {t("cgTabAll")}
                </button>
                <button
                  onClick={() => setActiveOutputTab("instagram")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeOutputTab === "instagram"
                      ? "bg-amber-500 text-stone-950 shadow-xs font-bold"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  <Instagram className="w-3.5 h-3.5" /> {t("cgTabIG")}
                </button>
                <button
                  onClick={() => setActiveOutputTab("tiktok")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeOutputTab === "tiktok"
                      ? "bg-amber-500 text-stone-950 shadow-xs font-bold"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  <Film className="w-3.5 h-3.5" /> {t("cgTabTikTok")}
                </button>
                <button
                  onClick={() => setActiveOutputTab("whatsapp")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeOutputTab === "whatsapp"
                      ? "bg-amber-500 text-stone-950 shadow-xs font-bold"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" /> {t("cgTabWA")}
                </button>
                <button
                  onClick={() => setActiveOutputTab("marketplace")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeOutputTab === "marketplace"
                      ? "bg-amber-500 text-stone-950 shadow-xs font-bold"
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> {t("cgTabMP")}
                </button>
              </div>

              {/* Headline Banner */}
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 p-4 rounded-2xl font-serif text-sm sm:text-base font-bold shadow-xs">
                "{result.headline}"
              </div>

              {/* SECTION: INSTAGRAM FEED */}
              {(activeOutputTab === "all" || activeOutputTab === "instagram") && (
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 transition-colors">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">1. {t("cgTabIG")}</h4>
                        <span className="text-[10px] text-stone-400">
                          {result.instagram?.wordCount} {t("cgWords")} • Hook + Keunggulan + CTA + Hashtag
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${result.instagram?.hook}\n\n${result.instagram?.body}\n\n${result.instagram?.callToAction}\n\n${result.instagram?.hashtags?.join(" ")}`,
                          "ig"
                        )
                      }
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {copiedKey === "ig" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {t("cgCopied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t("cgCopyCaption")}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700">
                    <p className="font-bold text-stone-900 dark:text-stone-100">
                      {result.instagram?.hook}
                    </p>
                    <p className="whitespace-pre-line text-stone-700 dark:text-stone-300">
                      {result.instagram?.body}
                    </p>
                    <p className="font-semibold text-amber-800 dark:text-amber-400 pt-1">
                      👉 {result.instagram?.callToAction}
                    </p>
                    <div className="pt-2 flex flex-wrap gap-1">
                      {result.instagram?.hashtags?.map((tag, idx) => (
                        <span key={idx} className="text-blue-600 dark:text-blue-400 font-mono text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: TIKTOK / REELS SCRIPT */}
              {(activeOutputTab === "all" || activeOutputTab === "tiktok") && (
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4 transition-colors">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-stone-800 text-white flex items-center justify-center">
                        <Film className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">2. {t("cgTabTikTok")}</h4>
                        <span className="text-[10px] text-stone-400">
                          Durasi {result.tiktok?.durationSeconds || "15-30"} detik • Storyboard Scene-by-Scene
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          `KONSEP VIDEO: ${result.tiktok?.concept}\nAUDIO: ${result.tiktok?.recommendedAudio}\n\nHOOK ALTERNATIF:\n${result.tiktok?.openingHooks?.join("\n")}\n\nSCENE STORYBOARD:\n${result.tiktok?.scenes?.map((s) => `[${s.sceneNumber}] Visual: ${s.visual}\nTeks: ${s.onScreenText}\nVO: ${s.narrationVoiceover}`).join("\n\n")}`,
                          "tiktok"
                        )
                      }
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {copiedKey === "tiktok" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {t("cgCopied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t("cgCopyScript")}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Concept & Audio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                    <div>
                      <strong className="text-stone-900 dark:text-stone-100 block">{t("cgConcept")}</strong>
                      <span className="text-stone-600 dark:text-stone-400">{result.tiktok?.concept}</span>
                    </div>
                    <div>
                      <strong className="text-stone-900 dark:text-stone-100 flex items-center gap-1">
                        <Music className="w-3.5 h-3.5 text-stone-500" /> {t("cgAudio")}
                      </strong>
                      <span className="text-stone-600 dark:text-stone-400">{result.tiktok?.recommendedAudio}</span>
                    </div>
                  </div>

                  {/* 3 Opening Hooks */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      {t("cgHooksTitle")}
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {result.tiktok?.openingHooks?.map((hook, idx) => (
                        <div key={idx} className="p-2.5 bg-amber-50/60 dark:bg-amber-950/40 rounded-lg border border-amber-200/80 dark:border-amber-800/70 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="italic font-medium">"{hook}"</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scenes Storyboard Table */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      {t("cgVisualTitle")}
                    </span>
                    <div className="space-y-2">
                      {result.tiktok?.scenes?.map((scene) => (
                        <div key={scene.sceneNumber} className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
                          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
                            <span className="font-bold text-stone-900 dark:text-stone-100">
                              Adegan {scene.sceneNumber}
                            </span>
                            <span className="font-mono text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {scene.timingSeconds}
                            </span>
                          </div>
                          <div className="text-stone-700 dark:text-stone-300">
                            <strong className="text-stone-900 dark:text-stone-100">{t("cgCameraVisual")}</strong> {scene.visual}
                          </div>
                          <div className="text-stone-700 dark:text-stone-300">
                            <strong className="text-stone-900 dark:text-stone-100">{t("cgOnScreenText")}</strong> "{scene.onScreenText}"
                          </div>
                          <div className="text-stone-700 dark:text-stone-300 italic">
                            <strong className="text-stone-900 dark:text-stone-100 not-italic">{t("cgVoiceover")}</strong> {scene.narrationVoiceover}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: WHATSAPP BROADCAST */}
              {(activeOutputTab === "all" || activeOutputTab === "whatsapp") && result.whatsapp && (
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 transition-colors">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">3. {t("cgTabWA")}</h4>
                        <span className="text-[10px] text-stone-400">Format Broadcast Chat Pelanggan</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${result.whatsapp?.greeting}\n\n${result.whatsapp?.announcement}\n\n${result.whatsapp?.callToAction}`,
                          "wa"
                        )
                      }
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {copiedKey === "wa" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {t("cgCopied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t("cgCopyWA")}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-800/70 text-xs sm:text-sm text-stone-800 dark:text-stone-200 space-y-2 whitespace-pre-wrap leading-relaxed font-sans">
                    <p className="font-bold">{result.whatsapp?.greeting}</p>
                    <p>{result.whatsapp?.announcement}</p>
                    <p className="font-semibold text-emerald-800 dark:text-emerald-400">{result.whatsapp?.callToAction}</p>
                  </div>
                </div>
              )}

              {/* SECTION: MARKETPLACE LISTING */}
              {(activeOutputTab === "all" || activeOutputTab === "marketplace") && result.marketplace && (
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 transition-colors">
                  <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">4. {t("cgTabMP")}</h4>
                        <span className="text-[10px] text-stone-400">Shopee / Tokopedia / TikTok Shop</span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          `JUDUL: ${result.marketplace?.seoTitle}\n\nDESKRIPSI:\n${result.marketplace?.description}\n\nKEUNGGULAN:\n${result.marketplace?.bulletPoints?.join("\n")}`,
                          "mp"
                        )
                      }
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {copiedKey === "mp" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {t("cgCopied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t("cgCopyMP")}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-200 space-y-3">
                    <div>
                      <strong className="text-stone-900 dark:text-stone-100 block text-xs">{t("cgSeoTitle")}</strong>
                      <p className="font-semibold text-amber-800 dark:text-amber-400">{result.marketplace?.seoTitle}</p>
                    </div>
                    <p className="whitespace-pre-line text-stone-700 dark:text-stone-300 leading-relaxed text-xs">
                      {result.marketplace?.description}
                    </p>
                    <div>
                      <strong className="text-stone-900 dark:text-stone-100 block text-xs mb-1">
                        {t("cgBenefitsSpec")}
                      </strong>
                      <ul className="list-disc pl-4 space-y-1 text-xs text-stone-600 dark:text-stone-400">
                        {result.marketplace?.bulletPoints?.map((bp, i) => (
                          <li key={i}>{bp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
