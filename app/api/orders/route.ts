import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PAYMENT_PACKAGES, PAYMENT_METHODS } from "@/lib/payment-config";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { packageId, paymentMethod, accountHolder, proofImageUrl } = body;

    if (!packageId || !paymentMethod) {
      return NextResponse.json(
        { error: "Pilihan paket dan metode transfer wajib diisi." },
        { status: 400 }
      );
    }

    const selectedPackage = PAYMENT_PACKAGES.find((p) => p.id === packageId);
    if (!selectedPackage) {
      return NextResponse.json({ error: "Paket tidak valid." }, { status: 400 });
    }

    if (!proofImageUrl) {
      return NextResponse.json(
        { error: "Screenshot bukti transfer wajib diunggah." },
        { status: 400 }
      );
    }

    // Generate unique order code: QL-ORD-XXXX
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `QL-${Date.now().toString().slice(-4)}-${randomSuffix}`;

    const order = await prisma.paymentOrder.create({
      data: {
        orderNumber,
        userId: user.id,
        packagePlan: selectedPackage.id,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
        quotaAdded: selectedPackage.quota,
        paymentMethod: paymentMethod,
        accountHolder: accountHolder?.trim() || null,
        proofImageUrl: proofImageUrl,
        status: "pending",
      },
    });

    return NextResponse.json({
      message: "Pesanan berhasil dibuat. Menunggu verifikasi admin.",
      order,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Gagal membuat pesanan. Silakan coba lagi." },
      { status: 500 }
    );
  }
}

