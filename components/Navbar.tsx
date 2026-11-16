"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Rocket, User as UserIcon } from "lucide-react";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role?: string;
    package?: string;
    pageQuota?: number;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={user?.role === "admin" ? "/admin/payments" : "/dashboard"}
          className="flex items-center gap-2 font-semibold text-slate-900"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="text-lg tracking-tight">QuickLaunch</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
              user?.role === "admin"
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {user?.role === "admin" ? "Operasional" : "Studio"}
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            {user.role === "admin" && (
              <Link
                href="/admin/payments"
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-amber-500/10 text-amber-800 border border-amber-300 px-3 py-1 text-xs font-bold hover:bg-amber-500/20 transition-colors"
              >
                <span>🛡️ Admin Panel</span>
              </Link>
            )}
            <div className="hidden sm:flex flex-col text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-sm font-medium text-slate-800">{user.name}</span>
                {user.role === "admin" && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-200">
                    Admin
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Keluar"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex min-h-[44px] items-center rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="flex min-h-[44px] items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm"
            >
              Daftar Gratis
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

