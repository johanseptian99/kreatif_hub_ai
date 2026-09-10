import React, { useState } from "react";
import {
  MessageSquare,
  Copy,
  Check,
  RotateCcw,
  HeartHandshake,
  Sparkles,
  ClipboardList,
  Lightbulb,
  CheckCircle2,
  Clock
} from "lucide-react";
import { CSResponderPayload, CSResponderResult } from "../../types";
import { CS_PRESETS } from "../../data/samplePresets";
import { useThemeLanguage } from "../../context/ThemeLanguageContext";

export const CSResponder: React.FC = () => {
  const { t } = useThemeLanguage();

  const [customerMessage, setCustomerMessage] = useState("");
  const [issueCategory, setIssueCategory] = useState("Produk Rusak / Cacat");
  const [tone, setTone] = useState("Empatis, Menenangkan, & Solutif");
  const [merchantPolicy, setMerchantPolicy] = useState("Garansi retur/kirim ulang 100% gratis jika produk rusak dalam perjalanan.");
  const [customerName, setCustomerName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CSResponderResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleApplyPreset = (presetId: string) => {
    const p = CS_PRESETS.find((x) => x.id === presetId);
    if (p) {
      setCustomerMessage(p.customerMessage);
      setIssueCategory(p.category);
      setTone(p.tone);
      setMerchantPolicy(p.policy);
      setError(null);
    }
  };

  const handleGenerateResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerMessage.trim()) {
      setError("Pesan atau keluhan pelanggan wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: CSResponderPayload = {
        customerMessage,
        issueCategory,
        tone,
        merchantPolicy,
        customerName,
      };

      const res = await fetch("/api/respond-cs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal memproses balasan CS.");
      }

      const data: CSResponderResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error("CS Responder error:", err);
      setError(err.message || "Terjadi kendala saat meracik balasan CS.");
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
      <div className="bg-blue-500/10 dark:bg-blue-950/40 border border-blue-300/60 dark:border-blue-800/70 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              {t("csBannerTitle")}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {t("csBannerDesc")}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mr-1">
            {t("csQuickCases")}
          </span>
          {CS_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleApplyPreset(p.id)}
              className="px-2.5 py-1 text-xs bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-medium rounded-lg border border-stone-300 dark:border-stone-700 transition-colors shadow-2xs"
            >
              {p.title}
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
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {t("csParamTitle")}
            </h3>
            <button
              type="button"
              onClick={() => {
                setCustomerMessage("");
                setCustomerName("");
                setResult(null);
                setError(null);
              }}
              className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> {t("csClear")}
            </button>
          </div>

          <form onSubmit={handleGenerateResponse} className="space-y-4">
            {/* Customer Message Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("csLabelMsg")} <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="input-customer-msg"
                rows={4}
                placeholder={t("csPhMsg")}
                value={customerMessage}
                onChange={(e) => setCustomerMessage(e.target.value)}
                required
                className="w-full text-xs sm:text-sm p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all resize-y"
              />
            </div>

            {/* Kategori Kendala */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("csLabelCategory")}
              </label>
              <select
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-stone-100 transition-all"
              >
                <option>Produk Rusak / Cacat</option>
                <option>Keterlambatan Pengiriman Ekspedisi</option>
                <option>Salah Kirim Varian / Barang Kurang</option>
                <option>Tanya Stok / Custom Pre-Order</option>
                <option>Komplain Rasa / Kualitas Produk</option>
                <option>Negosiasi Harga / Reseller / Grosir</option>
                <option>Pertanyaan Umum & Jam Operasional</option>
              </select>
            </div>

            {/* Nada Respons */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("csLabelTone")}
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-stone-100 transition-all"
              >
                <option>Empatis, Menenangkan, & Solutif</option>
                <option>Cepat, Lugas, & Siap Tanggap</option>
                <option>Hangat, Ramah, & Bersahabat</option>
                <option>Sopan, Santun, & Profesional Khas Indonesia</option>
              </select>
            </div>

            {/* Kebijakan Toko */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("csLabelPolicy")}
              </label>
              <input
                type="text"
                placeholder={t("csPhPolicy")}
                value={merchantPolicy}
                onChange={(e) => setMerchantPolicy(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all"
              />
            </div>

            {/* Nama Pelanggan */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                {t("csLabelCustomerName")}
              </label>
              <input
                type="text"
                placeholder={t("csPhCustomerName")}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              id="btn-submit-cs-responder"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>{t("csBtnLoading")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-400 dark:text-blue-200" />
                  <span>{t("csBtnSubmit")}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Output Showcase */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !isLoading && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-10 border border-dashed border-stone-300 dark:border-stone-700 text-center space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">{t("csEmptyTitle")}</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                {t("csEmptyDesc")}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-12 border border-stone-200 dark:border-stone-800 shadow-xs text-center space-y-4 transition-colors">
              <div className="w-12 h-12 border-3 border-blue-500/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{t("csLoadingTitle")}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {t("csLoadingDesc")}
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Sentiment & Urgency Card */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{t("csEmotionTitle")}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      result.sentimentAnalysis.sentiment.includes("Marah") || result.sentimentAnalysis.sentiment.includes("Kecewa")
                        ? "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                        : result.sentimentAnalysis.sentiment.includes("Cemas")
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    }`}>
                      {result.sentimentAnalysis.sentiment}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-stone-500 dark:text-stone-400">{t("csUrgencyTitle")}</span>
                    <span className={`px-2 py-0.5 rounded ${
                      result.sentimentAnalysis.urgencyLevel.includes("Tinggi")
                        ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-extrabold border border-rose-200 dark:border-rose-800"
                        : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    }`}>
                      {result.sentimentAnalysis.urgencyLevel}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 dark:text-stone-300">
                  <strong className="text-stone-800 dark:text-stone-100">{t("csCoreIssue")}</strong> {result.issueDetected}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 italic">
                  "{result.sentimentAnalysis.reason}"
                </div>
              </div>

              {/* Main Recommended Reply Card */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden transition-colors">
                <div className="p-4 bg-linear-to-r from-blue-700 to-blue-800 dark:from-blue-800 dark:to-blue-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-200" />
                    <span className="text-sm font-bold">{t("csRecReplyTitle")}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.recommendedReply, "main-reply")}
                    className="px-3 py-1.5 bg-white hover:bg-stone-100 text-blue-900 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    {copiedKey === "main-reply" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> {t("csCopied")}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> {t("csCopyReply")}
                      </>
                    )}
                  </button>
                </div>

                <div className="p-6">
                  <div className="p-4 bg-stone-50 dark:bg-stone-800/70 rounded-xl border border-stone-200 dark:border-stone-700 text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-sans whitespace-pre-wrap leading-relaxed">
                    {result.recommendedReply}
                  </div>
                </div>
              </div>

              {/* Alternative Quick Reply Card */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-500" /> {t("csShortReplyTitle")}
                  </span>
                  <button
                    onClick={() => copyToClipboard(result.alternativeShortReply, "short-reply")}
                    className="px-2.5 py-1 bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-md border border-stone-300 dark:border-stone-700 flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === "short-reply" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> {t("csCopied")}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> {t("csCopyShort")}
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
                  {result.alternativeShortReply}
                </div>
              </div>

              {/* Internal Action Notes & Preventive Tip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 3 Tindakan Internal */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 transition-colors">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    {t("csInternalActions")}
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
                    {result.internalActionNotes?.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-stone-50 dark:bg-stone-800/60 p-2 rounded-lg border border-stone-200 dark:border-stone-700">
                        <span className="w-4 h-4 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips Pencegahan */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 transition-colors">
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    {t("csPreventionTip")}
                  </h4>
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
                    {result.preventiveTip}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
