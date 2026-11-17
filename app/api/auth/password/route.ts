import { NextResponse } from "next/server";
import { getCurrentUser, comparePassword, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Kata sandi saat ini dan kata sandi baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal 8 karakter." },
        { status: 400 }
      );
    }

    // Ambil user lengkap beserta passwordHash
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!fullUser) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Verifikasi kata sandi lama
    const isCurrentValid = await comparePassword(currentPassword, fullUser.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Kata sandi saat ini tidak cocok." },
        { status: 400 }
      );
    }

    // Pastikan kata sandi baru berbeda dari yang lama
    const isSamePassword = await comparePassword(newPassword, fullUser.passwordHash);
    if (isSamePassword) {
      return NextResponse.json(
        { error: "Kata sandi baru tidak boleh sama dengan kata sandi saat ini." },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetToken: null,
        resetExpires: null,
      },
    });

    return NextResponse.json({
      message: "Kata sandi berhasil diperbarui. Akun Anda kini lebih aman.",
    });
  } catch (error: any) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengganti kata sandi." },
      { status: 500 }
    );
  }
}
