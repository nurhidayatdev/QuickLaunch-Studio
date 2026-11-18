import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token dan kata sandi baru wajib diisi." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi baru minimal 8 karakter demi keamanan akun Anda." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Tautan reset kata sandi tidak valid atau sudah kadaluarsa. Silakan ajukan ulang." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetCode: null,
        resetExpires: null,
      },
    });

    // Otomatis login pengguna setelah reset kata sandi berhasil
    const authToken = signToken({ userId: user.id, email: user.email });
    setAuthCookie(authToken);

    return NextResponse.json({
      message: "Kata sandi Anda berhasil diperbarui. Anda telah otomatis masuk.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mereset kata sandi." },
      { status: 500 }
    );
  }
}

