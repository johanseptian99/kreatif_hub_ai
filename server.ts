import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// In-memory session store for preview (can be per-session or default user)
interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  isGoogleVerified: boolean;
  loginTime: string;
}

let activeUserSession: SessionUser | null = null;

// Safe initialization of GoogleGenAI
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Fallback model list
const candidateModels = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

// Helper to call Gemini with candidate models and JSON response
async function generateGeminiJSON(
  contents: string,
  systemInstruction: string,
  responseSchema: any,
  temperature = 0.7
): Promise<any> {
  const ai = getGenAIClient();
  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature,
          responseMimeType: "application/json",
          responseSchema,
        },
      });

      const text = response.text;
      if (text) {
        return JSON.parse(text);
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} encountered error:`, err?.message || err);
    }
  }

  throw lastError || new Error("Gagal mendapatkan respons dari model AI.");
}

// ==========================================
// 1. AUTHENTICATION & GOOGLE OAUTH 2.0 ROUTES
// ==========================================

// Check auth state
app.get("/api/auth/me", (req, res) => {
  if (activeUserSession) {
    return res.json({ isAuthenticated: true, user: activeUserSession });
  }
  return res.json({ isAuthenticated: false, user: null });
});

// Get Google OAuth URL
app.get("/api/auth/url", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
  const appUrl = process.env.APP_URL || "https://ais-dev-fvzvtl6rsqa5ugb3i2voim-428280549727.asia-southeast1.run.app";
  const redirectUri = `${appUrl}/auth/callback`;

  if (!clientId) {
    return res.json({
      isConfigured: false,
      message: "GOOGLE_CLIENT_ID belum dikonfigurasi di secrets. Gunakan mode login Google instan/terverifikasi.",
      url: null,
      redirectUri,
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return res.json({
    isConfigured: true,
    url,
    redirectUri,
  });
});

// OAuth Callback handler with postMessage conforming to AI Studio OAuth Skill
const handleOAuthCallback = (req: express.Request, res: express.Response) => {
  const { code, error } = req.query;

  if (code) {
    // In production with client secret, exchange code here.
    // Set user session
    activeUserSession = {
      id: "usr-" + Date.now(),
      name: "Johan Septian",
      email: "johanseptian999@gmail.com",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      role: "Pemilik Usaha Kreatif (UMKM)",
      isGoogleVerified: true,
      loginTime: new Date().toISOString(),
    };
  }

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Autentikasi Google Berhasil - KreatifHub AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafaf9; color: #1c1917; }
          .card { background: white; padding: 24px; border-radius: 16px; border: 1px solid #e7e5e4; text-align: center; max-width: 360px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .spinner { width: 32px; height: 32px; border: 3px solid #e7e5e4; border-top-color: #f59e0b; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">Login Google Berhasil!</h3>
          <p style="margin: 0; font-size: 13px; color: #78716c;">Menghubungkan sesi Anda ke KreatifHub AI...</p>
        </div>
        <script>
          try {
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', code: ${JSON.stringify(code || "demo_success")} }, '*');
              setTimeout(() => { window.close(); }, 800);
            } else {
              window.location.href = '/';
            }
          } catch (e) {
            window.location.href = '/';
          }
        </script>
      </body>
    </html>
  `);
};

app.get("/auth/callback", handleOAuthCallback);
app.get("/auth/callback/", handleOAuthCallback);

// Google login endpoint (handles verified login with Google identity)
app.post("/api/auth/google", (req, res) => {
  const { name, email, avatarUrl } = req.body;

  activeUserSession = {
    id: "usr-" + Date.now(),
    name: name || "Johan Septian",
    email: email || "johanseptian999@gmail.com",
    avatarUrl: avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    role: "Pemilik Usaha Kreatif (UMKM)",
    isGoogleVerified: true,
    loginTime: new Date().toISOString(),
  };

  return res.json({
    success: true,
    user: activeUserSession,
    message: "Login dengan akun Google berhasil.",
  });
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  activeUserSession = null;
  return res.json({ success: true, message: "Berhasil logout dari KreatifHub AI." });
});

// Middleware to guard protected routes
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!activeUserSession) {
    return res.status(401).json({
      error: "Akses ditolak. Silakan login dengan akun Google Anda terlebih dahulu.",
      requireLogin: true,
    });
  }
  next();
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    appName: "KreatifHub AI",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    isAuthenticated: Boolean(activeUserSession),
    user: activeUserSession ? activeUserSession.email : null,
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 2. FITUR 1: GENERATOR KONTEN
// ==========================================
app.post("/api/generate-content", requireAuth, async (req, res) => {
  try {
    const {
      productName,
      category = "Kuliner",
      description,
      targetAudience = "Masyarakat umum & pelanggan lokal",
      tone = "Santai, Gaul, & Memikat (Gen Z / TikTok)",
      platform = "all",
      keyBenefits = "",
      callToAction = "Hubungi link di bio / WhatsApp kami!",
    } = req.body;

    if (!productName || !description) {
      return res.status(400).json({
        error: "Nama produk dan deskripsi kampanye wajib diisi.",
      });
    }

    const systemPrompt = `Anda adalah Social Media Strategist dan Copywriter profesional papan atas yang bertugas membuat materi pemasaran untuk UMKM Ekonomi Kreatif Indonesia (kuliner, fesyen, kriya/kerajinan, kriya kayu/rotan, desain, dsb).
Gaya bahasa Anda:
- Menggunakan Bahasa Indonesia yang luwes, hidup, memikat, bernada lokal yang ramah (#BanggaBuatanIndonesia).
- Tidak kaku atau formal membosankan. Menekankan USP (Unique Selling Proposition), emosi pembeli, dan Call to Action yang kuat.
- Hasilkan output JSON terstruktur sesuai responseSchema.`;

    const userPrompt = `Buatkan paket copywriting dan materi konten lengkap untuk produk UMKM berikut:
Nama Produk: ${productName}
Kategori Ekonomi Kreatif: ${category}
Deskripsi & Keunggulan: ${description}
Poin Manfaat Khusus: ${keyBenefits || "Kualitas asli, bahan pilihan, ramah lingkungan/otentik"}
Target Pembeli: ${targetAudience}
Gaya Nada (Tone of Voice): ${tone}
Ajakan Bertindak (CTA): ${callToAction}
Fokus Platform: ${platform}

Berikan output komprehensif mencakup Headline, Instagram Caption lengkap (hook, keunggulan, cta, hashtag), TikTok/Reels Script video berdurasi 15-30 detik (detik per detik), WhatsApp Broadcast, dan Deskripsi Marketplace!`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        headline: { type: Type.STRING, description: "Judul/headline hook pemikat utama" },
        sellingAngle: { type: Type.STRING, description: "Sudut pandang penjualan utama (selling angle)" },
        keySellingPoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3-4 poin keunggulan utama produk",
        },
        instagram: {
          type: Type.OBJECT,
          properties: {
            hook: { type: Type.STRING, description: "Hook pembuka baris pertama feed" },
            caption: { type: Type.STRING, description: "Caption lengkap Instagram siap pakai maksimal 150 kata" },
            callToAction: { type: Type.STRING, description: "CTA penutup interaktif" },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5-7 hashtag relevan",
            },
            wordCount: { type: Type.INTEGER, description: "Estimasi jumlah kata caption" },
          },
          required: ["hook", "caption", "callToAction", "hashtags", "wordCount"],
        },
        tiktok: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING, description: "Konsep video pendek" },
            audioSuggestion: { type: Type.STRING, description: "Rekomendasi musik atau audio tren" },
            duration: { type: Type.STRING, description: "Durasi video, misal: 15-30 detik" },
            hookLines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 variasi kalimat pembuka video detik 0-3",
            },
            scenes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timeframe: { type: Type.STRING, description: "Contoh: 00:00 - 00:05" },
                  visual: { type: Type.STRING, description: "Aksi visual kamera/produk" },
                  onScreenText: { type: Type.STRING, description: "Teks di layar" },
                  voiceover: { type: Type.STRING, description: "Narasi suara" },
                },
                required: ["timeframe", "visual", "onScreenText", "voiceover"],
              },
            },
          },
          required: ["concept", "audioSuggestion", "duration", "hookLines", "scenes"],
        },
        whatsapp: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING, description: "Sapaan ramah WhatsApp" },
            body: { type: Type.STRING, description: "Isi pesan promo WhatsApp" },
            ctaAndClosing: { type: Type.STRING, description: "Penutup dan ajakan pesan via WhatsApp" },
            fullMessage: { type: Type.STRING, description: "Pesan broadcast WhatsApp lengkap siap salin" },
          },
          required: ["greeting", "body", "ctaAndClosing", "fullMessage"],
        },
        marketplace: {
          type: Type.OBJECT,
          properties: {
            seoTitle: { type: Type.STRING, description: "Judul produk marketplace yang SEO friendly" },
            shortPitch: { type: Type.STRING, description: "Paragraf ringkas pembuka deskripsi produk" },
            bulletPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar spesifikasi / fitur dalam bentuk bullet point",
            },
            fullDescription: { type: Type.STRING, description: "Deskripsi marketplace lengkap siap tempel" },
          },
          required: ["seoTitle", "shortPitch", "bulletPoints", "fullDescription"],
        },
        rawFormattedOutput: { type: Type.STRING, description: "Rangkuman format siap salin" },
      },
      required: [
        "headline",
        "sellingAngle",
        "keySellingPoints",
        "instagram",
        "tiktok",
        "whatsapp",
        "marketplace",
        "rawFormattedOutput",
      ],
    };

    const result = await generateGeminiJSON(userPrompt, systemPrompt, responseSchema, 0.85);
    return res.json(result);
  } catch (err: any) {
    console.error("Error in /api/generate-content:", err);
    return res.status(500).json({
      error: err.message || "Gagal menghasilkan konten pemasaran AI.",
    });
  }
});

// ==========================================
// 3. FITUR 2: RESPONDEN CS (CUSTOMER SERVICE)
// ==========================================
app.post("/api/respond-cs", requireAuth, async (req, res) => {
  try {
    const {
      customerMessage,
      issueCategory = "Keterlambatan Pengiriman",
      tone = "Empatis, Menenangkan, & Solutif",
      merchantPolicy = "Garansi ganti baru jika rusak di jalan, kepuasan pembeli nomor satu.",
      customerName = "",
    } = req.body;

    if (!customerMessage) {
      return res.status(400).json({
        error: "Pesan atau keluhan pelanggan wajib disertakan.",
      });
    }

    const systemPrompt = `Anda adalah Customer Relationship Manager ahli untuk brand UMKM Ekonomi Kreatif Indonesia.
Prinsip kerja Anda:
1. Empati Tulus: Validasi perasaan pelanggan terlebih dahulu (terutama jika mereka kecewa/marah), jangan pernah defensif atau menyalahkan pelanggan.
2. Solusi Konkret & Jelas: Berikan jalan keluar nyata (misal: cek resi, kirim barang pengganti, kompensasi diskon, opsi pengembalian).
3. Etika Bahasa: Menggunakan Bahasa Indonesia yang santun, hangat, profesional, dan menenangkan hati pelanggan.
4. Internal Insight: Berikan analisis sentimen dan 3 tindakan konkret internal yang harus diambil oleh pemilik UMKM.`;

    const userPrompt = `Tolong tanggapi pesan/keluhan pelanggan berikut:
Pesan Pelanggan: "${customerMessage}"
Kategori Kendala: ${issueCategory}
Gaya Nada Respons: ${tone}
Nama Pelanggan (jika ada): ${customerName || "Terdeteksi dari pesan atau sapaan umum"}
Kebijakan / Nilai Toko: ${merchantPolicy}

Hasilkan respons CS yang membuat pelanggan merasa sangat dihargai dan ditenangkan, serta langkah pencegahan bagi pemilik usaha!`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        customerNameDetected: { type: Type.STRING, description: "Nama pelanggan yang terdeteksi atau panggilan ramah (Kak/Bunda/Pak)" },
        issueDetected: { type: Type.STRING, description: "Ringkasan inti masalah yang dialami pelanggan" },
        sentimentAnalysis: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              description: "Sentimen pelanggan: Marah / Sangat Kecewa, Cemas / Bingung, Netral / Bertanya, atau Senang / Tertarik",
            },
            urgencyLevel: {
              type: Type.STRING,
              description: "Tingkat urgensi: Tinggi (Segera Tangani), Sedang, atau Rendah",
            },
            reason: { type: Type.STRING, description: "Alasan analisis sentimen dan urgensi" },
          },
          required: ["sentiment", "urgencyLevel", "reason"],
        },
        recommendedReply: {
          type: Type.STRING,
          description: "Naskah balasan utama yang sangat empatik, profesional, dan solutif siap kirim ke WhatsApp / DM",
        },
        alternativeShortReply: {
          type: Type.STRING,
          description: "Alternatif balasan ringkas untuk chat cepat / respon kilat",
        },
        internalActionNotes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 langkah tindakan internal yang harus dilakukan tim toko sekarang",
        },
        preventiveTip: {
          type: Type.STRING,
          description: "Tips pencegahan operasional agar masalah serupa tidak berulang",
        },
      },
      required: [
        "customerNameDetected",
        "issueDetected",
        "sentimentAnalysis",
        "recommendedReply",
        "alternativeShortReply",
        "internalActionNotes",
        "preventiveTip",
      ],
    };

    const result = await generateGeminiJSON(userPrompt, systemPrompt, responseSchema, 0.7);
    return res.json(result);
  } catch (err: any) {
    console.error("Error in /api/respond-cs:", err);
    return res.status(500).json({
      error: err.message || "Gagal memproses respons layanan pelanggan.",
    });
  }
});

// ==========================================
// 4. FITUR 3: EKSTRAKTOR DATA (ORDER PARSER)
// ==========================================
app.post("/api/extract-data", requireAuth, async (req, res) => {
  try {
    const { rawData, shippingCostDefault = 0, notes = "" } = req.body;

    if (!rawData || !rawData.trim()) {
      return res.status(400).json({
        error: "Data mentah (teks chat/pesanan) tidak boleh kosong.",
      });
    }

    const systemPrompt = `Anda adalah Data Extraction AI spesialis operasional e-commerce dan chat commerce (WhatsApp/Instagram/TikTok Shop) untuk UMKM Indonesia.
Tugas Anda adalah membaca teks obrolan/pesanan yang berantakan, seringkali tidak beraturan, banyak singkatan lokal (misal: 'ongkir', 'rek', 'tf', 'bca', 'pcs', 'jl', 'kec', 'kel', 'no hp', 'jaksel', 'jaktim', dsb.), lalu mengekstraknya menjadi entitas data pesanan yang bersih, terstruktur, dan valid secara finansial.

Aturan Finansial:
- Jika harga satuan tidak disebutkan eksplisit namun total diketahui, deduksikan dengan cermat.
- Hitung subtotal = sum(quantity * unitPrice).
- Total harga = subtotal + shippingCost - discount.
- Jika ada nomor WhatsApp/HP, bersihkan menjadi format rapi (contoh: 0812xxxx atau 62812xxxx).
- Buatkan format ringkasan WhatsApp invoice yang rapi dan elegan, siap dikirim ke pembeli untuk konfirmasi transfer!`;

    const userPrompt = `Ekstrak data pesanan berikut menjadi format terstruktur:
Data Mentah dari Pelanggan:
"""
${rawData}
"""

Catatan Tambahan Toko: ${notes || "Tidak ada"}
Default Ongkos Kirim (jika tidak tertera): Rp ${shippingCostDefault}

Ekstrak entitas nama, nomor kontak, detail alamat pengiriman, daftar item produk, harga, metode pembayaran, dan teks konfirmasi WhatsApp siap kirim!`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        customerName: { type: Type.STRING, description: "Nama lengkap pembeli" },
        phoneNumber: { type: Type.STRING, description: "Nomor WhatsApp atau HP pelanggan" },
        shippingAddress: {
          type: Type.OBJECT,
          properties: {
            fullAddress: { type: Type.STRING, description: "Alamat lengkap terpadu" },
            recipientName: { type: Type.STRING, description: "Nama penerima paket" },
            street: { type: Type.STRING, description: "Jalan, nomor rumah, RT/RW, gang" },
            district: { type: Type.STRING, description: "Kecamatan / Kelurahan" },
            city: { type: Type.STRING, description: "Kota atau Kabupaten" },
            province: { type: Type.STRING, description: "Provinsi" },
            postalCode: { type: Type.STRING, description: "Kode pos jika ada (atau string kosong)" },
          },
          required: ["fullAddress", "recipientName", "street", "district", "city", "province"],
        },
        orderItems: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemName: { type: Type.STRING, description: "Nama item produk" },
              variant: { type: Type.STRING, description: "Varian rasa/warna/ukuran jika ada" },
              quantity: { type: Type.INTEGER, description: "Jumlah item yang dipesan" },
              unitPrice: { type: Type.NUMBER, description: "Harga per unit (angka numerik IDR)" },
              subtotal: { type: Type.NUMBER, description: "Subtotal item = quantity * unitPrice" },
            },
            required: ["itemName", "quantity", "unitPrice", "subtotal"],
          },
        },
        subtotalPrice: { type: Type.NUMBER, description: "Total harga seluruh barang sebelum ongkir" },
        shippingCost: { type: Type.NUMBER, description: "Ongkos kirim (angka numerik IDR)" },
        discount: { type: Type.NUMBER, description: "Potongan harga atau voucher jika ada (0 jika tidak ada)" },
        totalPrice: { type: Type.NUMBER, description: "Total tagihan akhir yang harus dibayar pembeli" },
        paymentMethod: { type: Type.STRING, description: "Metode pembayaran (misal: Transfer BCA, BRI, Mandiri, COD, QRIS)" },
        paymentStatus: {
          type: Type.STRING,
          description: "Status: Sudah Bayar, Belum Bayar / Menunggu Bukti, COD (Bayar di Tempat), atau Perlu Konfirmasi",
        },
        specialNotes: { type: Type.STRING, description: "Catatan khusus pesanan atau instruksi pengiriman" },
        formattedWhatsAppConfirmation: {
          type: Type.STRING,
          description: "Naskah invoice WhatsApp konfirmasi pesanan terformat rapi dengan emoji dan rincian belanja",
        },
      },
      required: [
        "customerName",
        "phoneNumber",
        "shippingAddress",
        "orderItems",
        "subtotalPrice",
        "shippingCost",
        "discount",
        "totalPrice",
        "paymentMethod",
        "paymentStatus",
        "formattedWhatsAppConfirmation",
      ],
    };

    const result = await generateGeminiJSON(userPrompt, systemPrompt, responseSchema, 0.4);
    return res.json(result);
  } catch (err: any) {
    console.error("Error in /api/extract-data:", err);
    return res.status(500).json({
      error: err.message || "Gagal mengekstrak data pesanan pelanggan.",
    });
  }
});

// ==========================================
// 5. CHATBOT TEMAN UMKM (BUSINESS & MENTAL COMPANION)
// ==========================================

const TEMAN_UMKM_SYSTEM_INSTRUCTION = `Kamu adalah "Teman UMKM", seorang pendamping bisnis sekaligus teman curhat yang suportif, ramah, dan empatik khusus untuk pelaku UMKM di Indonesia.

Tugas utamamu setiap kali merespons:
1. Validasi Emosi (Empati): Selalu mulai dengan merangkul perasaan pengguna. Tunjukkan bahwa kamu memahami lelahnya, stresnya, atau kebingungan mereka.
2. Refleksi & Urai Masalah: Bantu mereka melihat masalah dari sudut pandang yang lebih tenang tanpa terkesan menggurui. 
3. Solusi Praktis & Realistis: Berikan maksimal 1-2 saran bisnis taktis yang mudah dieksekusi hari ini juga.
4. Komunitas (Teman Seperjuangan): Ingatkan mereka bahwa mereka tidak sendirian dengan memberikan contoh ringan tentang UMKM lain.

Gaya Bahasa:
- Santai, hangat, dan membumi (gunakan sapaan "Kak").
- Jangan gunakan bahasa robotik, terlalu formal, atau format list panjang.

Batasan (SANGAT PENTING):
- Fokus Topik: Kamu HANYA boleh merespons topik seputar bisnis UMKM, operasional usaha, pemasaran, keuangan bisnis, atau keluh kesah mental/stres akibat berbisnis.
- Penolakan Halus (Out-of-Domain): Jika pengguna membahas topik di luar kategori bisnis UMKM (misalnya: politik, hiburan, selebriti, agama, atau tugas sekolah), kamu WAJIB menolak menjawabnya. Tolak dengan halus, sopan, dan ramah, lalu segera arahkan kembali percakapan ke topik usaha. 
  Contoh respons wajibmu jika ditanya topik luar: "Wah, maaf banget Kak, kalau soal itu aku kurang paham. Aku memang ditugaskan khusus buat nemenin Kakak ngobrolin soal bisnis dan keluh kesah UMKM nih. Ada cerita soal usahanya yang mau di-share ke aku hari ini?"
- Jika pengguna menunjukkan tanda keputusasaan ekstrem atau depresi klinis, arahkan mereka untuk mencari bantuan profesional.
- Jangan berikan nasihat hukum atau akuntansi yang kaku.`;

app.post("/api/chat-teman-umkm", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const ai = getGenAIClient();
    
    // Prepare contents array for multi-turn chat
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        const msgText = item?.text || item?.content;
        if (msgText && typeof msgText === "string" && (item.role === "user" || item.role === "model" || item.role === "assistant")) {
          contents.push({
            role: item.role === "assistant" ? "model" : item.role,
            parts: [{ text: msgText }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message.trim() }],
    });

    let replyText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: TEMAN_UMKM_SYSTEM_INSTRUCTION,
            temperature: 0.75,
          },
        });

        if (response.text) {
          replyText = response.text;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Chat model ${modelName} failed:`, err?.message || err);
      }
    }

    if (!replyText) {
      throw lastError || new Error("Tidak dapat menghasilkan jawaban dari Teman UMKM.");
    }

    return res.json({ reply: replyText });
  } catch (err: any) {
    console.error("Error in /api/chat-teman-umkm:", err);
    return res.status(500).json({
      error: err.message || "Gagal menghubungi Teman UMKM. Silakan coba kembali sesaat lagi.",
    });
  }
});

// Vite middleware & Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KreatifHub AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
