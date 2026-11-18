import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, alamat email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Pastikan email belum terdaftar pada akun aktif
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Alamat email ini sudah terdaftar. Silakan login atau gunakan menu Lupa Sandi." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Buat kode OTP 6-digit & ID Tiket Registrasi
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const ticketId = `REG-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    // Simpan pendaftaran tertunda
    await prisma.pendingRegistration.upsert({
      where: { email: cleanEmail },
      update: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        passwordHash,
        otpCode,
        ticketId,
        expiresAt,
      },
      create: {
        email: cleanEmail,
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        passwordHash,
        otpCode,
        ticketId,
        expiresAt,
      },
    });

    // Kirim email OTP aktivasi
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      name: name.trim(),
      otpCode,
      expiresInMinutes: 15,
      purpose: "register",
    });

    // Masking email untuk tampilan antarmuka aman
    const [localPart, domainPart] = cleanEmail.split("@");
    const maskedEmail =
      localPart.length > 2
        ? `${localPart[0]}***${localPart[localPart.length - 1]}@${domainPart}`
        : `${localPart[0]}***@${domainPart}`;

    const adminWa = process.env.ADMIN_WHATSAPP || "087873520868";

    return NextResponse.json({
      success: true,
      message: "Kode OTP aktivasi akun telah dikirimkan ke email Anda.",
      ticketId,
      email: cleanEmail,
      maskedEmail,
      adminWa,
      isSimulated: Boolean(emailResult.simulated),
    });
  } catch (error: any) {
    console.error("Register request error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pendaftaran." },
      { status: 500 }
    );
  }
}
