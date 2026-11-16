"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Rocket, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

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

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md shadow-xs transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={user?.role === "admin" ? "/admin/payments" : user ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 font-bold text-slate-900 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <Rocket className="h-5 w-5" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-900">
            QuickLaunch
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              user?.role === "admin"
                ? "bg-amber-100 text-amber-800 border border-amber-300 shadow-xs"
                : "bg-blue-50 text-blue-700 border border-blue-200/60"
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
                className="hidden sm:inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-300 px-3 py-1 text-xs font-bold hover:bg-amber-500/20 transition-colors shadow-xs"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>Konsol Operasional</span>
              </Link>
            )}

            {/* User Profile Chip */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl py-1 px-2.5">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs shrink-0">
                {getInitials(user.name)}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[140px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[140px]">
                  {user.role === "admin" ? "Administrator" : user.email}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-xs"
              title="Keluar"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="flex min-h-[40px] items-center rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:shadow-none"
            >
              <span>Daftar Gratis</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
