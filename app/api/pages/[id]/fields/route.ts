import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const fields = await prisma.formField.findMany({
    where: { pageId: params.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ fields });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await prisma.page.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!page) {
    return NextResponse.json({ error: "Halaman tidak ditemukan" }, { status: 404 });
  }

  try {
    const { fields } = await req.json();

    if (!Array.isArray(fields)) {
      return NextResponse.json({ error: "Data fields tidak valid" }, { status: 400 });
    }

    // Atomic transaction: delete existing and replace with updated fields
    await prisma.$transaction(async (tx) => {
      await tx.formField.deleteMany({
        where: { pageId: page.id },
      });

      if (fields.length > 0) {
        await tx.formField.createMany({
          data: fields.map((f: any, idx: number) => ({
            pageId: page.id,
            label: f.label?.trim() || `Field ${idx + 1}`,
            type: f.type || "text",
            required: Boolean(f.required),
            order: idx,
            options: f.options ? String(f.options).trim() : null,
          })),
        });
      }
    });

    const updatedFields = await prisma.formField.findMany({
      where: { pageId: page.id },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ fields: updatedFields });
  } catch (error: any) {
    console.error("Save fields error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan field form" },
      { status: 500 }
    );
  }
}

