import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.paymentOrder.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      packagePlan: true,
      packageName: true,
      price: true,
      quotaAdded: true,
      status: true,
      paymentMethod: true,
      accountHolder: true,
      rejectionReason: true,
      createdAt: true,
      verifiedAt: true,
    },
  });

  return NextResponse.json({ orders });
}

