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

    // Ambil permintaan reset kata sandi aktif
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

    // Ambil verifikasi pendaftaran akun baru yang sedang pending
    const pendingRegistrations = await prisma.pendingRegistration.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        otpCode: true,
        ticketId: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      resets: pendingResets,
      registrations: pendingRegistrations,
    });
  } catch (error: any) {
    console.error("Fetch pending resets error:", error);
    return NextResponse.json(
      { error: "Gagal memuat permohonan verifikasi." },
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

    const { userId, registrationId } = await req.json();

    if (registrationId) {
      await prisma.pendingRegistration.delete({
        where: { id: registrationId },
      }).catch(() => {});
      return NextResponse.json({
        message: "Data pendaftaran tertunda berhasil dibatalkan.",
      });
    }

    if (userId) {
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
    }

    return NextResponse.json({ error: "Parameter tidak lengkap." }, { status: 400 });
  } catch (error: any) {
    console.error("Cancel reset/reg error:", error);
    return NextResponse.json(
      { error: "Gagal membatalkan permohonan." },
      { status: 500 }
    );
  }
}
