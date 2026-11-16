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
    const page = await prisma.page.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!page) {
      return NextResponse.json(
        { error: "Halaman tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const newStatus =
      body.status || (page.status === "published" ? "draft" : "published");

    const updated = await prisma.page.update({
      where: { id: page.id },
      data: { status: newStatus },
    });

    return NextResponse.json({
      message:
        newStatus === "published"
          ? "Halaman berhasil dipublikasikan!"
          : "Halaman berhasil ditarik kembali ke draf.",
      status: updated.status,
      slug: updated.slug,
      publicPath: `/p/${updated.slug}`,
    });
  } catch (error: any) {
    console.error("Publish error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui status publikasi." },
      { status: 500 }
    );
  }
}

