export interface PackageItem {
  id: string;
  name: string;
  price: number;
  quota: number;
  badge?: string;
  popular?: boolean;
  description: string;
  features: string[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  badge?: string;
}

export const PAYMENT_PACKAGES: PackageItem[] = [
  {
    id: "single",
    name: "Paket Single Event",
    price: 25000,
    quota: 1,
    badge: "Hemat",
    popular: false,
    description: "Sangat pas untuk satu kali penyelenggaraan event, webinar, atau peluncuran produk.",
    features: [
      "1 Landing Page Aktif",
      "Pilihan 3 Template Desain",
      "Formulir Pendaftaran Kustom",
      "Link Konfirmasi WhatsApp Otomatis",
      "Akses Data Pendaftar Tanpa Batas",
    ],
  },
  {
    id: "pro",
    name: "Paket Pro Komunitas",
    price: 50000,
    quota: 3,
    badge: "Paling Populer",
    popular: true,
    description: "Pilihan favorit untuk pengurus komunitas, organisasi, atau pelaku UMKM berkembang.",
    features: [
      "3 Landing Page Aktif",
      "Akses Lengkap Seluruh Template",
      "Integrasi Auto-Sync Google Sheets",
      "Duplikasi Halaman 1-Klik",
      "Prioritas Verifikasi Pembayaran",
    ],
  },
  {
    id: "business",
    name: "Paket Bisnis & Agensi",
    price: 99000,
    quota: 10,
    badge: "Kapasitas Besar",
    popular: false,
    description: "Kapasitas tinggi untuk agensi, konsultan, dan penyelenggara event berulang.",
    features: [
      "10 Landing Page Aktif",
      "Semua Fitur Pro & Auto-Sync Sheets",
      "Penyimpanan Leads Tanpa Batas",
      "Duplikasi Cepat Banyak Acara",
      "Dukungan WhatsApp Prioritas Admin",
    ],
  },
];

export const PAYMENT_METHODS: BankAccount[] = [
  {
    id: "bca",
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "8735129840",
    accountHolder: "QUICKLAUNCH STUDIO",
    badge: "Transfer Bank",
  },
  {
    id: "mandiri",
    bankName: "Bank Mandiri",
    accountNumber: "137002489102",
    accountHolder: "QUICKLAUNCH STUDIO",
    badge: "Transfer Bank",
  },
  {
    id: "qris",
    bankName: "QRIS / GoPay / OVO / Dana",
    accountNumber: "081234567890",
    accountHolder: "QUICKLAUNCH OFFICIAL",
    badge: "E-Wallet / Instant",
  },
];

export const ADMIN_CONTACT = {
  waNumber: process.env.ADMIN_WHATSAPP || "087873520868",
  adminEmail: process.env.ADMIN_EMAIL || "nurhidayat120706@gmail.com",
};

export async function getDynamicPaymentConfig() {
  try {
    const { prisma } = await import("./db");
    const setting = await prisma.systemSetting.findUnique({
      where: { id: "default" },
    });
    if (setting) {
      let bankAccounts = PAYMENT_METHODS;
      try {
        bankAccounts = JSON.parse(setting.bankAccounts);
      } catch (e) {}

      return {
        paymentMethods: bankAccounts,
        adminContact: {
          waNumber: setting.adminWaNumber || ADMIN_CONTACT.waNumber,
          adminEmail: ADMIN_CONTACT.adminEmail,
          adminQrisImage: setting.adminQrisImage || null,
        },
      };
    }
  } catch (err) {
    console.error("Error reading dynamic payment config:", err);
  }

  return {
    paymentMethods: PAYMENT_METHODS,
    adminContact: {
      ...ADMIN_CONTACT,
      adminQrisImage: null as string | null,
    },
  };
}

