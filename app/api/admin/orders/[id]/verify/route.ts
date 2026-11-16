import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
    }

    const body = await req.json();
    const { action, rejectionReason } = body;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Aksi tidak valid." }, { status: 400 });
    }

    const order = await prisma.paymentOrder.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    if (order.status !== "pending") {
      return NextResponse.json(
        { error: `Pesanan sudah pernah diproses (${order.status}).` },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Run in transaction: approve order & increment user quota
      const [updatedOrder, updatedUser] = await prisma.$transaction([
        prisma.paymentOrder.update({
          where: { id: order.id },
          data: {
            status: "approved",
            verifiedAt: new Date(),
          },
        }),
        prisma.user.update({
          where: { id: order.userId },
          data: {
            pageQuota: { increment: order.quotaAdded },
            package: order.packagePlan,
          },
        }),
      ]);

      return NextResponse.json({
        message: `Pesanan #${order.orderNumber} disetujui. Kuota user bertambah +${order.quotaAdded}.`,
        order: updatedOrder,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          pageQuota: updatedUser.pageQuota,
          package: updatedUser.package,
        },
      });
    } else {
      // Reject order
      const updatedOrder = await prisma.paymentOrder.update({
        where: { id: order.id },
        data: {
          status: "rejected",
          rejectionReason: rejectionReason?.trim() || "Bukti transfer tidak valid atau dana belum diterima.",
          verifiedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: `Pesanan #${order.orderNumber} telah ditolak.`,
        order: updatedOrder,
      });
    }
  } catch (error: any) {
    console.error("Verify order error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses verifikasi." },
      { status: 500 }
    );
  }
}

