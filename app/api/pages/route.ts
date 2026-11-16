import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = await prisma.page.findMany({
    where: { userId: user.id },
    include: {
      fields: { orderBy: { order: "asc" } },
      submissions: { select: { id: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ pages });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Admin is focused purely on operations
    if (user.role === "admin") {
      return NextResponse.json(
        {
          error: "Akun admin difokuskan untuk operasional sistem dan verifikasi pembayaran. Pembuatan event dilakukan melalui akun pengguna.",
        },
        { status: 403 }
      );
    }

    // Check user page quota
    const userPageCount = await prisma.page.count({
      where: { userId: user.id },
    });

    if (userPageCount >= (user.pageQuota || 0)) {
      return NextResponse.json(
        {
          error: "Kuota pembuatan halaman Anda telah habis. Silakan pilih paket untuk menambah kuota.",
          code: "QUOTA_EXCEEDED",
        },
        { status: 403 }
      );
    }

    const {
      category = "event",
      templateId = "modern-event",
      title = "Event Baru",
      description = "",
      schedule = "",
      location = "",
      price = "",
      bannerUrl = "",
      waNumber = "",
      accentColor = "#2563eb",
      slug,
    } = body;

    // Generate unique slug
    const baseSlug = (slug || title || "page")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let finalSlug = baseSlug || "event";
    const existing = await prisma.page.findUnique({ where: { slug: finalSlug } });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Default form fields based on category
    const defaultFields =
      category === "produk"
        ? [
            { label: "Nama Pembeli", type: "text", required: true, order: 0 },
            { label: "Nomor WhatsApp", type: "tel", required: true, order: 1 },
            { label: "Alamat Pengiriman", type: "text", required: true, order: 2 },
            {
              label: "Varian / Jumlah Pesanan",
              type: "select",
              required: true,
              options: "Paket 1 Item, Paket 2 Item (Hemat), Paket 3 Item (Grosir)",
              order: 3,
            },
          ]
        : [
            { label: "Nama Lengkap", type: "text", required: true, order: 0 },
            { label: "Nomor WhatsApp", type: "tel", required: true, order: 1 },
            { label: "Email Peserta", type: "email", required: false, order: 2 },
            {
              label: "Pilihan Tiket / Kategori",
              type: "select",
              required: false,
              options: "Tiket Reguler, Tiket VIP",
              order: 3,
            },
          ];

    const page = await prisma.page.create({
      data: {
        userId: user.id,
        category,
        templateId,
        title,
        description,
        schedule,
        location,
        price,
        bannerUrl,
        waNumber,
        accentColor,
        slug: finalSlug,
        status: "draft",
        fields: {
          create: defaultFields,
        },
      },
      include: {
        fields: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({ page });
  } catch (error: any) {
    console.error("Create page error:", error);
    return NextResponse.json(
      { error: "Gagal membuat halaman baru." },
      { status: 500 }
    );
  }
}
