import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { setAuthCookie, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json();

    if (!email || !otpCode) {
      return NextResponse.json(
        { error: "Email dan kode OTP 6-digit wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otpCode.trim();

    if (cleanOtp.length !== 6) {
      return NextResponse.json(
        { error: "Kode verifikasi harus terdiri dari 6 angka." },
        { status: 400 }
      );
    }

    const pending = await prisma.pendingRegistration.findUnique({
      where: { email: cleanEmail },
    });

    if (!pending) {
      return NextResponse.json(
        { error: "Data pendaftaran tidak ditemukan atau sudah kadaluarsa. Silakan daftar ulang." },
        { status: 404 }
      );
    }

    if (pending.expiresAt < new Date()) {
      await prisma.pendingRegistration.delete({ where: { id: pending.id } }).catch(() => {});
      return NextResponse.json(
        { error: "Kode verifikasi telah kadaluarsa (lebih dari 15 menit). Silakan minta kode baru." },
        { status: 400 }
      );
    }

    if (pending.otpCode !== cleanOtp) {
      return NextResponse.json(
        { error: "Kode verifikasi 6-digit tidak cocok. Periksa kembali email Anda." },
        { status: 400 }
      );
    }

    // Pastikan user belum terbuat sebelumnya
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    let user;
    if (existing) {
      user = existing;
    } else {
      const isAdminEmail = cleanEmail === (process.env.ADMIN_EMAIL || "demo@quicklaunch.id").toLowerCase();
      user = await prisma.user.create({
        data: {
          name: pending.name,
          email: pending.email,
          phone: pending.phone,
          passwordHash: pending.passwordHash,
          role: isAdminEmail ? "admin" : "user",
          pageQuota: isAdminEmail ? 999 : 0,
          package: isAdminEmail ? "business" : "none",
          emailVerified: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          package: true,
          pageQuota: true,
        },
      });
    }

    // Hapus data pending registration setelah berhasil
    await prisma.pendingRegistration.delete({
      where: { id: pending.id },
    }).catch(() => {});

    // Buat session cookie login otomatis
    const token = signToken({ userId: user.id, email: user.email });
    setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "Verifikasi email berhasil! Selamat datang di QuickLaunch.",
      user,
    });
  } catch (error: any) {
    console.error("Register OTP verify error:", error);
    return NextResponse.json(
      { error: "Gagal memverifikasi akun. Silakan coba kembali." },
      { status: 500 }
    );
  }
}
