import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PAYMENT_METHODS, ADMIN_CONTACT, getDynamicPaymentConfig } from "@/lib/payment-config";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
  }

  const config = await getDynamicPaymentConfig();
  return NextResponse.json(config);
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
    }

    const body = await req.json();
    const { paymentMethods, adminWaNumber } = body;

    if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      return NextResponse.json(
        { error: "Setidaknya harus ada 1 rekening tujuan pembayaran." },
        { status: 400 }
      );
    }

    // Validate that each account has bankName, accountNumber, accountHolder
    for (const acc of paymentMethods) {
      if (!acc.bankName || !acc.accountNumber || !acc.accountHolder) {
        return NextResponse.json(
          { error: "Nama bank, nomor rekening, dan nama pemilik rekening wajib diisi." },
          { status: 400 }
        );
      }
    }

    const cleanWaNumber = (adminWaNumber || ADMIN_CONTACT.waNumber).trim();

    const saved = await prisma.systemSetting.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        bankAccounts: JSON.stringify(paymentMethods),
        adminWaNumber: cleanWaNumber,
      },
      update: {
        bankAccounts: JSON.stringify(paymentMethods),
        adminWaNumber: cleanWaNumber,
      },
    });

    return NextResponse.json({
      message: "Pengaturan rekening dan kontak admin berhasil diperbarui.",
      setting: {
        paymentMethods,
        adminContact: {
          waNumber: saved.adminWaNumber,
          adminEmail: ADMIN_CONTACT.adminEmail,
        },
      },
    });
  } catch (error: any) {
    console.error("Save settings error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan pengaturan." },
      { status: 500 }
    );
  }
}

