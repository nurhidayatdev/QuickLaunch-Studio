import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json();

    if (!email || !otpCode) {
      return NextResponse.json(
        { error: "Email dan 6-digit kode OTP verifikasi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = String(otpCode).trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.resetCode || !user.resetExpires) {
      return NextResponse.json(
        { error: "Tidak ada permohonan verifikasi aktif untuk email ini. Silakan ajukan ulang." },
        { status: 400 }
      );
    }

    if (new Date() > user.resetExpires) {
      return NextResponse.json(
        { error: "Kode verifikasi telah kadaluarsa (melebihi 15 menit). Silakan ajukan permohonan baru." },
        { status: 400 }
      );
    }

    if (user.resetCode !== cleanCode) {
      return NextResponse.json(
        { error: "Kode verifikasi 6-digit salah. Pastikan memeriksa kode yang Anda terima." },
        { status: 400 }
      );
    }

    // Kode OTP benar! Buat token sesi satu kali pakai (one-time reset session token)
    const resetSessionToken = crypto.randomBytes(32).toString("hex");
    const sessionExpires = new Date(Date.now() + 15 * 60 * 1000); // Berlaku 15 menit untuk ganti password

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: null, // Hanguskan kode OTP agar tidak bisa dipakai ulang
        resetToken: resetSessionToken,
        resetExpires: sessionExpires,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Verifikasi identitas pemilik akun berhasil!",
      resetSessionToken,
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memverifikasi kode OTP." },
      { status: 500 }
    );
  }
}
