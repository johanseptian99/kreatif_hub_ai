import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  HeartHandshake,
  Bot,
  User as UserIcon,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { AuthUser, ChatMessage } from "../../types";
import { useThemeLanguage } from "../../context/ThemeLanguageContext";

interface TemanUMKMChatModalProps {
  user: AuthUser;
}

const QUICK_STARTERS = [
  {
    id: "sepi",
    label: "Penjualan sepi minggu ini, rasanya mau nyerah...",
    prompt: "Kak, akhir-akhir ini penjualanku lagi sepi banget. Udah coba posting di medsos tapi interaksi dikit, rasanya capek mental dan pengen nyerah. Ada saran praktis yang bisa aku lakuin hari ini?",
  },
  {
    id: "nawar",
    label: "Pelanggan nawar sadis banget, cara nolak gimana?",
    prompt: "Halo Kak Teman UMKM, sering banget dapet calon pembeli yang nawar harga sadis banget sampai di bawah modal. Gimana cara nolak yang sopan dan elegan tanpa bikin mereka tersinggung atau kabur ya?",
  },
  {
    id: "keuangan",
    label: "Modal kecampur uang dapur, solusinya apa?",
    prompt: "Kak, aku punya masalah klasik UMKM nih: uang kas usaha sering kecampur sama uang belanja dapur pribadi. Pas mau kulakan barang baru sadar uangnya kurang. Langkah paling gampang buat ngeberesinnya gimana?",
  },
  {
    id: "capek",
    label: "Capek mental ngurus operasional usaha sendirian",
    prompt: "Aku ngerasa burnout banget ngurus usaha sendiri dari produksi, balas chat, packing sampai kirim. Kadang bingung mau curhat ke siapa karena keluarga kurang paham susahnya merintis bisnis.",
  },
];

const STORAGE_KEY = "kreatifhub_teman_umkm_history";

export const TemanUMKMChatModal: React.FC<TemanUMKMChatModalProps> = ({ user }) => {
  const { t, language } = useThemeLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
    return [];
  });
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize initial welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      const firstName = user?.name ? user.name.split(" ")[0] : "Kakak";
      const welcomeMsg: ChatMessage = {
        id: "msg-welcome",
        role: "model",
        content: `Halo Kak ${firstName}! 👋 Aku Teman UMKM, pendamping setia sekaligus teman curhat khusus buat pejuang usaha seperti Kakak.\n\nLagi ada kendala penjualan, pusing komplain pelanggan, bingung modal, atau capek mental ngurus usaha sendirian? Ceritain aja, aku siap dengarkan dan cari solusi praktis bareng tanpa menghakimi!`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([welcomeMsg]);
    }
  }, [user?.name, messages.length]);

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (e) {
        console.error("Failed to save chat history:", e);
      }
    }
  }, [messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputText;
    if (!rawText.trim() || isLoading) return;

    setHasInteracted(true);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: rawText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText("");
    setError(null);
    setIsLoading(true);

    try {
      // Prepare history payload for API (exclude the first local welcome message)
      const apiHistory = newHistory
        .filter((m) => m.id !== "msg-welcome")
        .slice(-8) // keep last 8 turns for focused context
        .map((m) => ({
          role: m.role,
          text: m.content,
        }));

      const res = await fetch("/api/chat-teman-umkm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: rawText.trim(),
          history: apiHistory.slice(0, -1), // prior history before current user message
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || t("tuError"));
      }

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.reply || "Maaf Kak, aku belum bisa merespons dengan baik saat ini.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("Chat Teman UMKM error:", err);
      setError(err.message || t("tuError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Clear / Reset Chat
  const handleResetChat = () => {
    const firstName = user?.name ? user.name.split(" ")[0] : "Kakak";
    const welcomeMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      role: "model",
      content: `Halo Kak ${firstName}! 👋 Aku Teman UMKM, pendamping setia sekaligus teman curhat khusus buat pejuang usaha seperti Kakak.\n\nLagi ada kendala penjualan, pusing komplain pelanggan, bingung modal, atau capek mental ngurus usaha sendirian? Ceritain aja, aku siap dengarkan dan cari solusi praktis bareng tanpa menghakimi!`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([welcomeMsg]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear chat storage", e);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button on the RIGHT side */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          id="btn-floating-teman-umkm"
          onClick={() => setIsOpen((prev) => !prev)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-amber-400/40"
          title={t("tuFloatingTooltip")}
        >
          {/* Pulsing online ring */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>

          <HeartHandshake className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform duration-200" />
          
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-extrabold tracking-wide uppercase text-amber-100 flex items-center gap-1">
              {t("tuFloatingLabel")}
              <Sparkles className="w-3 h-3 text-amber-300 inline" />
            </span>
            <span className="text-[10px] text-amber-200 font-normal hidden sm:inline">
              {t("tuSubtitle")}
            </span>
          </div>

          {/* Unread / Notification indicator if not interacted yet */}
          {!hasInteracted && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
                1
              </span>
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Modal / Drawer - Docked Right */}
      {isOpen && (
        <div
          id="modal-teman-umkm-chat"
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[600px] max-h-[calc(100vh-7.5rem)] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Modal Header */}
          <div className="p-4 bg-gradient-to-r from-amber-600 via-amber-700 to-stone-900 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center text-amber-200 shadow-inner">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-stone-900 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white tracking-wide">
                    {t("tuTitle")}
                  </h3>
                  <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-200 text-[10px] font-bold rounded-md border border-amber-300/30">
                    AI Curhat
                  </span>
                </div>
                <p className="text-[11px] text-amber-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  {t("tuStatus")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-reset-chat-teman-umkm"
                type="button"
                onClick={handleResetChat}
                className="p-1.5 text-amber-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={t("tuClear")}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                id="btn-close-chat-teman-umkm"
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-amber-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation History Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50/50 dark:bg-stone-950/40 text-xs">
            {/* Disclaimer pill */}
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <p className="leading-snug">{t("tuDisclaimer")}</p>
            </div>

            {/* Render Messages */}
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${
                      isUser
                        ? "bg-stone-900 text-white dark:bg-amber-600"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {isUser ? (
                      user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserIcon className="w-4 h-4" />
                      )
                    ) : (
                      <HeartHandshake className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[82%] rounded-2xl p-3.5 space-y-1 shadow-2xs leading-relaxed transition-all ${
                      isUser
                        ? "bg-stone-900 text-white dark:bg-stone-800 rounded-tr-xs"
                        : "bg-white dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 border border-stone-200/80 dark:border-stone-700/80 rounded-tl-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 dark:border-stone-700/50 pb-1 mb-1 text-[10px] text-stone-400 dark:text-stone-400">
                      <span className="font-semibold">
                        {isUser ? user.name || "Kakak" : "Teman UMKM"}
                      </span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-wrap text-xs sm:text-[13px] leading-relaxed">
                      {m.content}
                    </div>

                    {!isUser && m.id !== "msg-welcome" && (
                      <div className="pt-1.5 flex justify-end">
                        <button
                          onClick={() => copyToClipboard(m.content, m.id)}
                          className="text-[10px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 flex items-center gap-1 transition-colors"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{t("tuCopied")}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>{t("tuCopy")}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Thinking indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 rounded-2xl rounded-tl-xs p-3 shadow-2xs space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                    {t("tuThinking")}
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Starters (shown if only welcome msg or conversation is short) */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2 space-y-2">
                <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {t("tuQuickTitle")}
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {QUICK_STARTERS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSendMessage(s.prompt)}
                      className="text-left px-3 py-2 bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-700/60 rounded-xl text-[11px] text-stone-700 dark:text-stone-200 transition-colors shadow-2xs font-medium"
                    >
                      💬 {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Modal Footer / Input Area */}
          <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={textareaRef}
                id="input-chat-teman-umkm"
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("tuInputPlaceholder")}
                disabled={isLoading}
                className="flex-1 p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs sm:text-sm focus:bg-white dark:focus:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 resize-none leading-relaxed transition-all"
              />

              <button
                id="btn-send-chat-teman-umkm"
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="h-10 px-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl font-bold flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0"
                title="Kirim Pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-stone-400 px-1">
              <span>Shift + Enter untuk baris baru</span>
              <span>Teman UMKM Indonesia 🇮🇩</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
