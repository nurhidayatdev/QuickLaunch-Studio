import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Akses khusus admin." }, { status: 403 });
  }

  const orders = await prisma.paymentOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          pageQuota: true,
          package: true,
        },
      },
    },
  });

  return NextResponse.json({ orders });
}

