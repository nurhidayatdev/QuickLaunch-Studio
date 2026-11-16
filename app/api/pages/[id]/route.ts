import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await prisma.page.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      fields: { orderBy: { order: "asc" } },
      submissions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!page) {
    return NextResponse.json({ error: "Halaman tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ page });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.page.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Halaman tidak ditemukan" }, { status: 404 });
    }

    const body = await req.json();
    const {
      category,
      templateId,
      title,
      description,
      schedule,
      location,
      price,
      bannerUrl,
      waNumber,
      waMessageTemplate,
      accentColor,
      fontFamily,
      slug,
      status,
      googleSheetsWebhookUrl,
    } = body;

    // Check slug collision if slug changed
    let finalSlug = existing.slug;
    if (slug && slug !== existing.slug) {
      const cleanSlug = slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const slugCheck = await prisma.page.findUnique({
        where: { slug: cleanSlug },
      });
      if (slugCheck && slugCheck.id !== existing.id) {
        return NextResponse.json(
          { error: "Slug sudah digunakan oleh halaman lain." },
          { status: 400 }
        );
      }
      finalSlug = cleanSlug;
    }

    const updated = await prisma.page.update({
      where: { id: existing.id },
      data: {
        category: category ?? existing.category,
        templateId: templateId ?? existing.templateId,
        title: title ?? existing.title,
        description: description ?? existing.description,
        schedule: schedule ?? existing.schedule,
        location: location ?? existing.location,
        price: price ?? existing.price,
        bannerUrl: bannerUrl ?? existing.bannerUrl,
        waNumber: waNumber ?? existing.waNumber,
        waMessageTemplate:
          waMessageTemplate !== undefined
            ? waMessageTemplate
            : existing.waMessageTemplate,
        accentColor: accentColor ?? existing.accentColor,
        fontFamily: fontFamily ?? (existing as any).fontFamily ?? "inter",
        slug: finalSlug,
        status: status ?? existing.status,
        googleSheetsWebhookUrl:
          googleSheetsWebhookUrl !== undefined
            ? googleSheetsWebhookUrl
            : existing.googleSheetsWebhookUrl,
      },
    });

    return NextResponse.json({ page: updated });
  } catch (error: any) {
    console.error("Update page error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui halaman." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existing = await prisma.page.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Halaman tidak ditemukan" }, { status: 404 });
    }

    await prisma.page.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ message: "Halaman berhasil dihapus." });
  } catch (error: any) {
    console.error("Delete page error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus halaman." },
      { status: 500 }
    );
  }
}

