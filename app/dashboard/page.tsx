import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Plus,
  Calendar,
  Users,
  Eye,
  Edit3,
  ExternalLink,
  Sparkles,
  FileText,
} from "lucide-react";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Admin focused purely on operations
  if (user.role === "admin") {
    redirect("/admin/payments");
  }

  const pages = await prisma.page.findMany({
    where: { userId: user.id },
    include: {
      submissions: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const latestPendingOrder = await prisma.paymentOrder.findFirst({
    where: { userId: user.id, status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <DashboardClient
          initialPages={pages}
          currentUser={user}
          initialPendingOrder={latestPendingOrder}
        />
      </main>
    </div>
  );
}

