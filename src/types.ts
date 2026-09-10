// User and Authentication Types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  isGoogleVerified: boolean;
  loginTime: string;
}

// Fitur 1: Generator Konten
export interface ContentGeneratorPayload {
  productName: string;
  category: string;
  description: string;
  targetAudience?: string;
  tone: string;
  platform: "all" | "instagram" | "tiktok" | "whatsapp" | "marketplace";
  keyBenefits?: string;
  callToAction?: string;
}

export interface ContentGeneratorResult {
  headline: string;
  sellingAngle: string;
  keySellingPoints: string[];
  
  // Instagram
  instagram: {
    hook: string;
    caption: string;
    callToAction: string;
    hashtags: string[];
    wordCount: number;
  };

  // TikTok / Reels
  tiktok: {
    concept: string;
    audioSuggestion: string;
    duration: string;
    hookLines: string[];
    scenes: Array<{
      timeframe: string;
      visual: string;
      onScreenText: string;
      voiceover: string;
    }>;
  };

  // WhatsApp Broadcast
  whatsapp: {
    greeting: string;
    body: string;
    ctaAndClosing: string;
    fullMessage: string;
  };

  // Marketplace (Shopee / Tokopedia / TikTok Shop)
  marketplace: {
    seoTitle: string;
    shortPitch: string;
    bulletPoints: string[];
    fullDescription: string;
  };

  rawFormattedOutput: string;
}

// Fitur 2: Responden CS
export interface CSResponderPayload {
  customerMessage: string;
  issueCategory: string;
  tone: string;
  merchantPolicy?: string;
  customerName?: string;
}

export interface CSResponderResult {
  customerNameDetected: string;
  issueDetected: string;
  sentimentAnalysis: {
    sentiment: "Marah / Sangat Kecewa" | "Cemas / Bingung" | "Netral / Bertanya" | "Senang / Tertarik";
    urgencyLevel: "Tinggi (Segera Tangani)" | "Sedang" | "Rendah";
    reason: string;
  };
  recommendedReply: string;
  alternativeShortReply: string;
  internalActionNotes: string[];
  preventiveTip: string;
}

// Fitur 3: Ekstraktor Data
export interface OrderItem {
  itemName: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface DataExtractorPayload {
  rawData: string;
  shippingCostDefault?: number;
  notes?: string;
}

export interface DataExtractorResult {
  customerName: string;
  phoneNumber: string;
  shippingAddress: {
    fullAddress: string;
    recipientName: string;
    street: string;
    district: string; // Kecamatan
    city: string; // Kota/Kabupaten
    province: string;
    postalCode: string;
  };
  orderItems: OrderItem[];
  subtotalPrice: number;
  shippingCost: number;
  discount: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: "Sudah Bayar" | "Belum Bayar / Menunggu Bukti" | "COD (Bayar di Tempat)" | "Perlu Konfirmasi";
  specialNotes?: string;
  formattedWhatsAppConfirmation: string;
}

// History items
export interface HistoryLog {
  id: string;
  type: "content" | "cs" | "extractor";
  title: string;
  timestamp: number;
  summary: string;
  data: any;
}

// Fitur Chatbot: Teman UMKM
export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}
