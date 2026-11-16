import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check user page quota
    const userPageCount = await prisma.page.count({
      where: { userId: user.id },
    });

    if (user.role !== "admin" && userPageCount >= (user.pageQuota || 0)) {
      return NextResponse.json(
        {
          error: "Kuota pembuatan halaman Anda telah habis. Silakan pilih paket untuk menambah kuota.",
          code: "QUOTA_EXCEEDED",
        },
        { status: 403 }
      );
    }

    const sourcePage = await prisma.page.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        fields: { orderBy: { order: "asc" } },
      },
    });

    if (!sourcePage) {
      return NextResponse.json(
        { error: "Halaman sumber tidak ditemukan." },
        { status: 404 }
      );
    }

    const newSlug = `${sourcePage.slug}-copy-${Date.now().toString().slice(-4)}`;

    const duplicated = await prisma.page.create({
      data: {
        userId: user.id,
        title: `${sourcePage.title} (Salinan)`,
        category: sourcePage.category,
        templateId: sourcePage.templateId,
        description: sourcePage.description,
        schedule: sourcePage.schedule,
        location: sourcePage.location,
        price: sourcePage.price,
        bannerUrl: sourcePage.bannerUrl,
        waNumber: sourcePage.waNumber,
        waMessageTemplate: sourcePage.waMessageTemplate,
        accentColor: sourcePage.accentColor,
        slug: newSlug,
        googleSheetsWebhookUrl: sourcePage.googleSheetsWebhookUrl,
        status: "draft",
        fields: {
          create: sourcePage.fields.map((f) => ({
            label: f.label,
            type: f.type,
            required: f.required,
            order: f.order,
            options: f.options,
          })),
        },
      },
      include: {
        fields: { orderBy: { order: "asc" } },
      },
    });

    return NextResponse.json({
      message: "Halaman berhasil diduplikasi!",
      page: duplicated,
    });
  } catch (error: any) {
    console.error("Duplicate error:", error);
    return NextResponse.json(
      { error: "Gagal menduplikasi halaman." },
      { status: 500 }
    );
  }
}

