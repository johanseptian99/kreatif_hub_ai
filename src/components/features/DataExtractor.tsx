import React, { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Upload,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Download,
  ExternalLink,
  MessageCircle,
  User,
  Phone,
  MapPin,
  Receipt
} from "lucide-react";
import { DataExtractorPayload, DataExtractorResult } from "../../types";
import { EXTRACTOR_PRESETS } from "../../data/samplePresets";
import { useThemeLanguage } from "../../context/ThemeLanguageContext";

export const DataExtractor: React.FC = () => {
  const { t } = useThemeLanguage();

  const [rawData, setRawData] = useState("");
  const [shippingCostDefault, setShippingCostDefault] = useState(0);
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DataExtractorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply quick preset
  const handleApplyPreset = (presetId: string) => {
    const p = EXTRACTOR_PRESETS.find((x) => x.id === presetId);
    if (p) {
      setRawData(p.rawData);
      setShippingCostDefault(p.shippingCostDefault);
      setError(null);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawData(text);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError("Gagal membaca file yang diunggah.");
    };
    reader.readAsText(file);
  };

  // Submit to backend
  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawData.trim()) {
      setError("Teks obrolan / data pesanan mentah wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload: DataExtractorPayload = {
        rawData,
        shippingCostDefault: Number(shippingCostDefault) || 0,
        notes: additionalNotes,
      };

      const res = await fetch("/api/extract-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Gagal mengekstrak data pesanan.");
      }

      const data: DataExtractorResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error("Data Extractor error:", err);
      setError(err.message || "Terjadi kesalahan saat memproses ekstraksi data.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  // Download CSV export
  const handleDownloadCSV = () => {
    if (!result) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Pelanggan,Telepon,Alamat,Item,Varian,Qty,Harga Satuan,Subtotal,Ongkir,Total,Metode Bayar,Status\n";

    result.orderItems.forEach((item) => {
      const row = [
        `"${result.customerName}"`,
        `"${result.phoneNumber}"`,
        `"${result.shippingAddress.fullAddress}"`,
        `"${item.itemName}"`,
        `"${item.variant || "-"}"`,
        item.quantity,
        item.unitPrice,
        item.subtotal,
        result.shippingCost,
        result.totalPrice,
        `"${result.paymentMethod}"`,
        `"${result.paymentStatus}"`,
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pesanan_${result.customerName.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 transition-colors duration-200">
      {/* Header Banner */}
      <div className="bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-800/70 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              {t("deBannerTitle")}
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400">
              {t("deBannerDesc")}
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 mr-1">
            {t("deQuickChats")}
          </span>
          {EXTRACTOR_PRESETS.map((p) => (
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
              <Receipt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t("deParamTitle")}
            </h3>
            <button
              type="button"
              onClick={() => {
                setRawData("");
                setResult(null);
                setError(null);
              }}
              className="text-xs text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> {t("deClear")}
            </button>
          </div>

          <form onSubmit={handleExtract} className="space-y-4">
            {/* Raw Chat Textarea */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {t("deLabelRaw")} <span className="text-rose-500">*</span>
                </label>
                
                {/* File Upload Trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> {t("deUploadFile")}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.csv,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <textarea
                id="input-raw-order-data"
                rows={7}
                placeholder={t("dePhRaw")}
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                required
                className="w-full text-xs sm:text-sm p-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all font-sans leading-relaxed resize-y"
              />
            </div>

            {/* Default Shipping Cost & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {t("deLabelShipping")}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-medium">Rp</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={shippingCostDefault || ""}
                    onChange={(e) => setShippingCostDefault(Number(e.target.value))}
                    className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300 block">
                  {t("deLabelNotes")}
                </label>
                <input
                  type="text"
                  placeholder={t("dePhNotes")}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              id="btn-submit-data-extractor"
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>{t("deBtnLoading")}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-200" />
                  <span>{t("deBtnSubmit")}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Structured Output Showcase */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !isLoading && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-10 border border-dashed border-stone-300 dark:border-stone-700 text-center space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">{t("deEmptyTitle")}</h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                {t("deEmptyDesc")}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-12 border border-stone-200 dark:border-stone-800 shadow-xs text-center space-y-4 transition-colors">
              <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{t("deLoadingTitle")}</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {t("deLoadingDesc")}
                </p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Customer & Shipping Summary Card */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{result.customerName}</span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3" /> {result.phoneNumber || t("deNoPhone")}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    result.paymentStatus === "Sudah Bayar"
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300"
                      : result.paymentStatus === "COD (Bayar di Tempat)"
                      ? "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300"
                      : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300"
                  }`}>
                    {result.paymentStatus}
                  </span>
                </div>

                <div className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 dark:text-stone-100 block">{t("deFullAddress")}</strong>
                    <span>{result.shippingAddress.fullAddress}</span>
                    <div className="mt-1 text-[11px] text-stone-500 dark:text-stone-400 flex flex-wrap gap-2">
                      <span>Kec: {result.shippingAddress.district || "-"}</span>
                      <span>•</span>
                      <span>Kota: {result.shippingAddress.city || "-"}</span>
                      <span>•</span>
                      <span>Prov: {result.shippingAddress.province || "-"}</span>
                      {result.shippingAddress.postalCode && (
                        <>
                          <span>•</span>
                          <span>Kode Pos: {result.shippingAddress.postalCode}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items Table Card */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs overflow-hidden transition-colors">
                <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {t("deItemsListTitle")} ({result.orderItems?.length || 0} Barang)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadCSV}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-md border border-stone-700 flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> {t("deExportCSV")}
                    </button>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(result, null, 2), "json-data")}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-md border border-stone-700 flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === "json-data" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> {t("deCopiedJSON")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t("deCopyJSON")}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-2.5">{t("deColNo")}</th>
                        <th className="px-4 py-2.5">{t("deColProduct")}</th>
                        <th className="px-4 py-2.5">{t("deColVariant")}</th>
                        <th className="px-4 py-2.5 text-center">{t("deColQty")}</th>
                        <th className="px-4 py-2.5 text-right">{t("deColPrice")}</th>
                        <th className="px-4 py-2.5 text-right">{t("deColSubtotal")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {result.orderItems?.map((item, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/40">
                          <td className="px-4 py-2.5 font-mono text-stone-400">{idx + 1}</td>
                          <td className="px-4 py-2.5 font-medium text-stone-900 dark:text-stone-100">{item.itemName}</td>
                          <td className="px-4 py-2.5 text-stone-500 dark:text-stone-400">{item.variant || "-"}</td>
                          <td className="px-4 py-2.5 text-center font-bold text-stone-800 dark:text-stone-200">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-right text-stone-700 dark:text-stone-300">{formatIDR(item.unitPrice)}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-stone-900 dark:text-stone-100">{formatIDR(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Breakdown Calculation */}
                <div className="p-4 bg-stone-50/80 dark:bg-stone-800/60 border-t border-stone-200 dark:border-stone-800 space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between">
                    <span>{t("deSubtotalLabel")}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{formatIDR(result.subtotalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("deShippingLabel")}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{formatIDR(result.shippingCost)}</span>
                  </div>
                  {result.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                      <span>{t("deDiscountLabel")}</span>
                      <span>-{formatIDR(result.discount)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center text-sm font-bold text-stone-900 dark:text-stone-100">
                    <span>{t("deTotalLabel")}</span>
                    <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">{formatIDR(result.totalPrice)}</span>
                  </div>
                  <div className="pt-1 flex justify-between text-[11px] text-stone-500 dark:text-stone-400">
                    <span>{t("dePayMethodLabel")} {result.paymentMethod}</span>
                    {result.specialNotes && <span>{t("deNotesLabel")} {result.specialNotes}</span>}
                  </div>
                </div>
              </div>

              {/* Ready-to-Send WhatsApp Invoice Format */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-800/80 shadow-xs space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {t("deWAConfirmTitle")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {result.phoneNumber && (
                      <a
                        href={`https://wa.me/${result.phoneNumber.replace(/[^0-9]/g, "").replace(/^0/, "62")}?text=${encodeURIComponent(result.formattedWhatsAppConfirmation)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> {t("deOpenWA")}
                      </a>
                    )}
                    <button
                      onClick={() => copyToClipboard(result.formattedWhatsAppConfirmation, "wa-invoice")}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold rounded-md border border-stone-300 dark:border-stone-700 flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === "wa-invoice" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> {t("deCopied")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> {t("deCopyWAText")}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed font-sans">
                  {result.formattedWhatsAppConfirmation}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
