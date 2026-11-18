"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Rocket,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Settings,
  User,
  KeyRound,
  ChevronDown,
} from "lucide-react";
import AccountSettingsModal from "@/components/account/AccountSettingsModal";

interface NavbarProps {
  user?: {
    id?: string;
    name: string;
    email: string;
    role?: string;
    package?: string;
    pageQuota?: number;
    createdAt?: string | Date;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [currentUserState, setCurrentUserState] = useState(user);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [accountModalTab, setAccountModalTab] = useState<"profile" | "password" | "security">("profile");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeUser = currentUserState || user;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
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

  const openSettings = (tab: "profile" | "password" | "security") => {
    setAccountModalTab(tab);
    setIsDropdownOpen(false);
    setIsAccountModalOpen(true);
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

        {activeUser ? (
          <div className="flex items-center gap-2.5 sm:gap-3">
            {activeUser.role === "admin" && (
              <Link
                href="/admin/payments"
                className="hidden sm:inline-flex min-h-[36px] items-center gap-1.5 rounded-xl bg-amber-500/10 text-amber-800 border border-amber-300 px-3 py-1 text-xs font-bold hover:bg-amber-500/20 transition-colors shadow-xs"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>Konsol Operasional</span>
              </Link>
            )}

            {/* User Profile Chip with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border rounded-2xl py-1 px-2.5 transition-all text-left group cursor-pointer ${
                  isDropdownOpen
                    ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20"
                    : "border-slate-200/80 hover:border-slate-300"
                }`}
                title="Menu Pengguna & Pengaturan Akun"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  {getInitials(activeUser.name)}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 max-w-[130px]">
                    {activeUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[130px]">
                    {activeUser.role === "admin" ? "Administrator" : "Pengguna"}
                  </span>
                </div>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-transform duration-200 ml-0.5 ${
                    isDropdownOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              {/* Floating Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* User Info Header */}
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                        {getInitials(activeUser.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {activeUser.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">
                          {activeUser.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          activeUser.role === "admin"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {activeUser.role === "admin" ? "Admin Operasional" : "Pemilik Akun"}
                      </span>
                    </div>
                  </div>

                  {/* Dropdown Items */}
                  <div className="p-1 space-y-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => openSettings("profile")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-colors cursor-pointer text-left font-medium"
                    >
                      <User className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Pengaturan Profil</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openSettings("password")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-colors cursor-pointer text-left font-medium"
                    >
                      <KeyRound className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Ganti Kata Sandi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openSettings("security")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-colors cursor-pointer text-left font-medium"
                    >
                      <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>Pusat Keamanan & Sesi</span>
                    </button>

                    {activeUser.role === "admin" && (
                      <Link
                        href="/admin/payments"
                        onClick={() => setIsDropdownOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-800 bg-amber-50/60 hover:bg-amber-100/70 transition-colors cursor-pointer text-left font-bold"
                      >
                        <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                        <span>Konsol Operasional</span>
                      </Link>
                    )}
                  </div>

                  <div className="my-1 border-t border-slate-100" />

                  {/* Logout Button */}
                  <div className="p-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left font-bold text-xs"
                    >
                      <LogOut className="h-4 w-4 text-red-500 shrink-0" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="hidden sm:flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-xs"
              title="Keluar"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
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

      {activeUser && (
        <AccountSettingsModal
          isOpen={isAccountModalOpen}
          onClose={() => setIsAccountModalOpen(false)}
          currentUser={activeUser as any}
          initialTab={accountModalTab}
          onUserUpdated={(updated) =>
            setCurrentUserState((prev: any) => ({ ...prev, ...updated }))
          }
        />
      )}
    </header>
  );
}
