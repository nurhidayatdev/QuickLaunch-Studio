import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Alamat email wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Akun dengan alamat email ini tidak terdaftar di sistem." },
        { status: 404 }
      );
    }

    // Generate token acak 32 bytes (64 karakter hex) yang sangat aman
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // Berlaku 1 jam

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetExpires,
      },
    });

    // Buat URL reset
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    return NextResponse.json({
      message: "Tautan reset kata sandi berhasil dibuat.",
      resetUrl,
      resetToken,
      expiresAt: resetExpires.toISOString(),
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permintaan reset kata sandi." },
      { status: 500 }
    );
  }
}
