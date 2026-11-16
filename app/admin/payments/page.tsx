import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AdminPaymentsClient from "./AdminPaymentsClient";
import { ShieldAlert, ArrowLeft, ShieldCheck } from "lucide-react";

export default async function AdminPaymentsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mb-4">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Akses Khusus Admin</h1>
        <p className="text-sm text-slate-600 mt-2 max-w-md">
          Halaman verifikasi pembayaran ini hanya dapat diakses oleh administrator QuickLaunch.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>
      </div>
    );
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

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      package: true,
      pageQuota: true,
      createdAt: true,
      _count: {
        select: {
          pages: true,
          paymentOrders: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <AdminPaymentsClient
          initialOrders={orders}
          initialUsers={users}
          currentUser={user}
        />
      </main>
    </div>
  );
}

