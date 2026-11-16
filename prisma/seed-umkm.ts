import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminUser = await prisma.user.findFirst({
    where: { role: "admin" },
  });

  if (!adminUser) {
    console.error("No admin user found.");
    return;
  }

  const slug = "sambal-cumi-juara";

  // Check if already exists
  const existing = await prisma.page.findUnique({
    where: { slug },
  });

  if (existing) {
    await prisma.formField.deleteMany({ where: { pageId: existing.id } });
    await prisma.page.delete({ where: { id: existing.id } });
  }

  const page = await prisma.page.create({
    data: {
      userId: adminUser.id,
      category: "produk",
      templateId: "card-compact", // Bento UMKM
      title: "Sambal Cumi Juara — Pedas Gurih Rempah Nusantara",
      description:
        "🔥 Dibuat dari cumi segar pilihan dan cabai rawit merah asli tanpa bahan pengawet kimia.\n✨ 100% Halal, higienis, dan dimasak perlahan hingga bumbu meresap sempurna ke dalam potongan cumi yang empuk.\n📦 Praktis langsung santap dengan nasi hangat, atau untuk stok lauk harian keluarga di rumah!",
      schedule: "Pengiriman Setiap Hari Kerja • Pesanan sebelum 15:00 WIB dikirim di hari yang sama",
      location: "Dapur Produksi Jakarta Selatan (Kirim Seluruh Indonesia via JNE / Paxel / Instant)",
      price: "Mulai Rp35.000 / botol 200gr (Promo Beli 3 Gratis Ongkir)",
      bannerUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop",
      qrisImageUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126570014ID.LINKAJA.WWW011893600914300000000002081234567851440014ID.DANA.WWW01189360091430000000000208123456785204549953033605802ID5919SAMBAL+CUMI+JUARA6007JAKARTA61051234062070703A016304E2D1",
      waNumber: "087873520868",
      accentColor: "#f59e0b", // Amber warm / kuliner gurih
      fontFamily: "poppins", // Font ramah & cocok untuk UMKM kuliner
      status: "published",
      slug: slug,
      fields: {
        create: [
          {
            label: "Nama Lengkap Pembeli",
            type: "text",
            required: true,
            order: 0,
          },
          {
            label: "Nomor WhatsApp (Aktif)",
            type: "tel",
            required: true,
            order: 1,
          },
          {
            label: "Pilihan Paket Sambal",
            type: "select",
            required: true,
            options: "Paket 1 Botol 200gr (Rp35.000), Paket Duo 2 Botol (Rp65.000 - Hemat), Paket Trio Best Seller 3 Botol (Rp95.000 - Free Ongkir)",
            order: 2,
          },
          {
            label: "Tingkat Kepedasan",
            type: "select",
            required: true,
            options: "Level 1: Pedas Sedang (Santai), Level 2: Pedas Nampol (Favorit), Level 3: Ekstra Pedas Gila",
            order: 3,
          },
          {
            label: "Alamat Lengkap Pengiriman",
            type: "text",
            required: true,
            order: 4,
          },
          {
            label: "Upload Bukti Pembayaran / Transfer",
            type: "file",
            required: false,
            order: 5,
          },
        ],
      },
    },
  });

  console.log("Created demo UMKM page successfully:", page.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

