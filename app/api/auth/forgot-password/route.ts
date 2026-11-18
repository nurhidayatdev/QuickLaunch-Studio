import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, phone } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Alamat email terdaftar wajib diisi." },
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

    // Jika pengguna memiliki nomor WhatsApp terdaftar dan requester memasukkan nomor HP, lakukan verifikasi kecocokan
    if (user.phone && phone) {
      const cleanInputPhone = String(phone).replace(/[^0-9]/g, "").replace(/^62/, "0");
      const cleanUserPhone = user.phone.replace(/[^0-9]/g, "").replace(/^62/, "0");
      if (cleanInputPhone !== cleanUserPhone && !cleanUserPhone.endsWith(cleanInputPhone)) {
        return NextResponse.json(
          { error: "Nomor WhatsApp yang Anda masukkan tidak cocok dengan data pemilik akun ini." },
          { status: 400 }
        );
      }
    }

    // Generate kode OTP rahasia 6-digit angka
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const ticketId = "REQ-" + crypto.randomBytes(3).toString("hex").toUpperCase();
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    // Simpan kode OTP rahasia ke database (BUKAN dikembalikan ke browser client!)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetCode: otpCode,
        resetToken: null, // Reset token sesi hanya dibuat setelah kode OTP berhasil diverifikasi
        resetExpires,
      },
    });

    // Kirim email OTP jika SMTP terkonfigurasi
    await sendOtpEmail({
      to: user.email,
      name: user.name,
      otpCode,
      expiresInMinutes: 15,
    });

    // Masking email & nomor telepon untuk keamanan tampilan
    const [localPart, domainPart] = user.email.split("@");
    const maskedEmail =
      localPart.length > 2
        ? `${localPart[0]}***${localPart[localPart.length - 1]}@${domainPart}`
        : `${localPart[0]}***@${domainPart}`;

    const maskedPhone = user.phone
      ? `****${user.phone.slice(-4)}`
      : null;

    const adminWa = process.env.ADMIN_WHATSAPP || "087873520868";

    // PENTING: Jangan pernah mengembalikan `otpCode` ke browser client!
    return NextResponse.json({
      success: true,
      message: "Kode verifikasi 6-digit telah dibuat secara aman.",
      ticketId,
      maskedEmail,
      hasRegisteredPhone: Boolean(user.phone),
      maskedPhone,
      adminWa,
    });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses permohonan verifikasi." },
      { status: 500 }
    );
  }
}
