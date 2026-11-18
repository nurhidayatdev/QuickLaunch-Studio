import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getCurrentUser();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
    }

    const order = await prisma.paymentOrder.findUnique({
      where: { id: params.id },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    await prisma.paymentOrder.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: `Pesanan ${order.orderNumber} berhasil dihapus permanen.`,
    });
  } catch (error: any) {
    console.error("Delete order error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus pesanan pembayaran." },
      { status: 500 }
    );
  }
}
