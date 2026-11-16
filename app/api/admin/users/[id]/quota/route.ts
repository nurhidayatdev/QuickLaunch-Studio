import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
    }

    const body = await req.json();
    const { quotaChange } = body; // number (e.g. +1, +3, +5, etc.)

    if (typeof quotaChange !== "number") {
      return NextResponse.json({ error: "Nilai penambahan kuota tidak valid." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        pageQuota: { increment: quotaChange },
      },
    });

    return NextResponse.json({
      message: `Kuota untuk ${updatedUser.name} berhasil diperbarui menjadi ${updatedUser.pageQuota} halaman.`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update quota error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kuota pengguna." },
      { status: 500 }
    );
  }
}

