import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Nama lengkap minimal 2 karakter." },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        package: true,
        pageQuota: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Profil berhasil diperbarui.",
      user: updated,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui profil." },
      { status: 500 }
    );
  }
}
