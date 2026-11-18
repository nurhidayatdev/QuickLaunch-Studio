import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
    }

    const pendingResets = await prisma.user.findMany({
      where: {
        resetCode: { not: null },
        resetExpires: { gt: new Date() },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        resetCode: true,
        resetExpires: true,
        createdAt: true,
      },
      orderBy: {
        resetExpires: "desc",
      },
    });

    return NextResponse.json({
      resets: pendingResets,
    });
  } catch (error: any) {
    console.error("Fetch pending resets error:", error);
    return NextResponse.json(
      { error: "Gagal memuat permintaan reset password." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "User ID diperlukan." }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        resetCode: null,
        resetToken: null,
        resetExpires: null,
      },
    });

    return NextResponse.json({
      message: "Permintaan reset password berhasil dibatalkan / ditolak.",
    });
  } catch (error: any) {
    console.error("Cancel reset error:", error);
    return NextResponse.json(
      { error: "Gagal membatalkan permintaan reset." },
      { status: 500 }
    );
  }
}
