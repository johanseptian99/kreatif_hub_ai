// Presets for rapid testing across all 3 features

export const CONTENT_PRESETS = [
  {
    id: "preset-1",
    name: "Kopi Arabika Gayo Aceh",
    category: "Kuliner & Hasil Tani",
    description: "Kopi single origin asli dari dataran tinggi Gayo Aceh, proses semi-washed, aroma fruity floral dengan aftertaste manis gula aren. Roasting level medium, cocok untuk manual brew V60 atau French Press.",
    targetAudience: "Penikmat kopi rumahan, anak muda pekerja kreatif, pencinta kopi nusantara",
    tone: "Santai, Gaul, & Memikat (Gen Z / TikTok)",
    platform: "all" as const,
    keyBenefits: "100% Arabika murni tanpa pengawet, dipetik matang merah (full red cherry), kemasan one-way valve kedap udara.",
    callToAction: "Order sekarang di link bio, mumpung lagi ada promo gratis ongkir!",
  },
  {
    id: "preset-2",
    name: "Tas Anyaman Rotan Etnik",
    category: "Kriya & Kerajinan Tangan",
    description: "Tas jinjing wanita berbahan rotan alami Kalimantan dipadukan dengan aksen kain tenun Dayak asli. Dibuat manual oleh pengrajin lokal dengan sentuhan tali kulit sapi asli.",
    targetAudience: "Wanita karier, pencinta fesyen etnik ramah lingkungan, wisatawan",
    tone: "Elegan, Mewah, & Storytelling Budaya",
    platform: "all" as const,
    keyBenefits: "Eco-friendly, awet tahan rayap, desain otentik khas nusantara yang tidak pasaran.",
    callToAction: "Koleksi sekarang sebelum kehabisan slot pre-order bulan ini!",
  },
  {
    id: "preset-3",
    name: "Sambal Cumi Asap Cabe Ijo",
    category: "Kuliner & Olahan Pangan",
    description: "Sambal basah pedas gurih dengan potongan cumi asin segar yang diasap alami dengan kayu buah. Siap saji langsung makan bersama nasi hangat tanpa perlu dimasak lagi.",
    targetAudience: "Pencinta makanan pedas, anak kos, ibu rumah tangga sibuk",
    tone: "Ceria, Humoris, & Bikin Penasaran",
    platform: "all" as const,
    keyBenefits: "Cuminya melimpah gak pelit, tanpa pengawet kimiawi, masa simpan 3 bulan segel rapat.",
    callToAction: "Klik keranjang kuning / chat admin sekarang juga sebelum kehabisan!",
  },
];

export const CS_PRESETS = [
  {
    id: "cs-1",
    title: "Komplain Paket Pecah / Bocor",
    category: "Produk Rusak / Cacat",
    customerMessage: "Halo min! Saya sangat kecewa, toples sambal pesanan saya sampai dalam kondisi pecah dan minyaknya rembes ke mana-mana sampai mengotori paket lainnya! Ini gimana pertanggungjawabannya? Padahal saya sudah nunggu 4 hari!",
    tone: "Empatis, Menenangkan, & Solutif",
    policy: "Garansi retur/kirim ulang 100% gratis jika produk rusak dalam pengiriman.",
  },
  {
    id: "cs-2",
    title: "Keterlambatan Pengiriman Ekspedisi",
    category: "Keterlambatan Pengiriman",
    customerMessage: "Min, tolong cek dong resi pesanan no JP98712398. Dari hari Senin statusnya 'In Transit' terus gak jalan-jalan di gudang sortir. Padahal barangnya mau saya bawa buat oleh-oleh besok siang!",
    tone: "Cepat, Lugas, & Siap Tanggap",
    policy: "Kami bantu follow up prioritas ke pihak ekspedisi atau siap ganti kurir instan jika area terjangkau.",
  },
  {
    id: "cs-3",
    title: "Tanya Ukuran Custom untuk Kado",
    category: "Tanya Stok / Custom",
    customerMessage: "Kak, tas anyaman rotan motif tenunnya cantik banget! Tapi apakah bisa pesan custom ukuran agak besar untuk laptop 14 inch? Trus bisa ditambah kartu ucapan ulang tahun gak kak? Rencana mau buat kado teman minggu depan.",
    tone: "Hangat, Ramah, & Bersahabat",
    policy: "Bisa custom ukuran dengan estimasi pengerjaan 3-4 hari, gratis kartu ucapan tulisan tangan.",
  },
  {
    id: "cs-4",
    title: "Minta Diskon Reseller / Grosir",
    category: "Negosiasi Harga / Reseller",
    customerMessage: "Halo kak, keripik tempe sagu daun jeruknya laris banget pas saya bawa ke kantor. Kalau saya mau ambil 50 bungkus buat dijual lagi di toko oleh-oleh saya di Malang, ada harga khusus reseller gak kak? Trus minimal order berapa ya?",
    tone: "Sopan, Antusias, & Profesional",
    policy: "Tersedia paket reseller diskon 20% untuk pembelian minimal 30 bungkus, free tester varian baru.",
  },
];

export const EXTRACTOR_PRESETS = [
  {
    id: "ext-1",
    title: "Chat WA Pesanan Camilan (3 Item)",
    rawData: `Kak saya mau order ya:
Nama: Sarah Agustina
No wa: 081287654321
Alamat: Jl. Anggrek Nelimurni No. 18B RT 04 RW 02, Kel. Kemanggisan, Kec. Palmerah, Jakarta Barat 11480.

Pesanannya:
- 3 bungkus Keripik Tempe Sagu Daun Jeruk (20rb)
- 2 toples Sambal Cumi Asap (35rb)
- 1 pouch Kopi Gayo Bubuk 250gr (45rb)

Ongkir ke Jakbar berapa ya kak? Mau bayar transfer lewat rekening BCA ya kak. Tolong dikirim besok pagi ya kak buat acara arisan keluarga. Makasih.`,
    shippingCostDefault: 12000,
  },
  {
    id: "ext-2",
    title: "Chat Pesanan Kain Tenun & Kemeja Batik",
    rawData: `Halo min order dong
Penerima: Bapak Bambang Sutedjo (085611223344)
Kirim ke alamat kantor: Gedung Wisma Antara Lt. 5, Jl. Medan Merdeka Selatan No. 17, Gambir, Jakarta Pusat 10110.

Barang:
1. Kain Tenun Ikat Jepara motif Toraja warna Biru Navy (1 lembar) @ Rp 180.000
2. Kemeja Batik Tulis Pria Lengan Panjang Size XL (1 pcs) @ Rp 275.000

Pake JNE YES ya min biar cepet sampai, ongkir katanya 28rb. Totalnya jadi berapa? Minta nomor rekening Mandiri ya min langsung saya tf sekarang.`,
    shippingCostDefault: 28000,
  },
  {
    id: "ext-3",
    title: "Chat Pesanan Sabun Herbal & Minyak Alami",
    rawData: `Min mau beli paket perawatan herbal:
Sabun Kopi Scrub 4 pcs @ 15.000
Minyak Kelapa Murni Virgin Coconut Oil 250ml 2 botol @ 40.000
Balsem Cengkeh Alami 1 pot @ 25.000
Kirim ke Jl. Kenanga No. 7, RT 01/RW 03, Sukasari, Kec. Sukasari, Kota Bogor, Jawa Barat. Nama penerima: Dewi Sartika, hp 087799881122. Bayar COD aja ya min pas kurir anter ke rumah. Makasih min!`,
    shippingCostDefault: 15000,
  },
];
