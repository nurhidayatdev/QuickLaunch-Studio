import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setAuthCookie, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const cleanEmail = email.toLowerCase().trim();
    const isAdminEmail = cleanEmail === (process.env.ADMIN_EMAIL || "demo@quicklaunch.id").toLowerCase();

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: isAdminEmail ? "admin" : "user",
        pageQuota: isAdminEmail ? 999 : 0,
        package: isAdminEmail ? "business" : "none",
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

    const token = signToken({ userId: user.id, email: user.email });
    setAuthCookie(token);

    return NextResponse.json({
      message: "Registrasi berhasil.",
      user,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

