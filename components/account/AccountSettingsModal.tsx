"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  X,
  User,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Calendar,
  Mail,
  Check,
  LogOut,
  Laptop,
} from "lucide-react";

interface AccountUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  package?: string;
  pageQuota?: number;
  createdAt?: string | Date;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AccountUser;
  onUserUpdated?: (updated: AccountUser) => void;
  initialTab?: "profile" | "password" | "security";
}

export default function AccountSettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  initialTab = "profile",
}: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "security">(initialTab);

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileNotice, setProfileNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentUser?.name) {
      setName(currentUser.name);
    }
  }, [currentUser?.name]);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  // Password Strength Calculation
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /[0-9]/.test(newPassword);
  const hasLetter = /[a-zA-Z]/.test(newPassword);

  let strengthScore = 0;
  if (hasMinLength) strengthScore += 1;
  if (hasNumber) strengthScore += 1;
  if (hasLetter) strengthScore += 1;
  if (/[^a-zA-Z0-9]/.test(newPassword)) strengthScore += 1;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileNotice(null);

    if (!name.trim()) {
      setProfileNotice({ type: "error", text: "Nama tidak boleh kosong." });
      return;
    }

    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui profil.");

      setProfileNotice({ type: "success", text: "Nama profil Anda berhasil disimpan." });
      if (onUserUpdated && data.user) {
        onUserUpdated(data.user);
      }
      router.refresh();
    } catch (err: any) {
      setProfileNotice({ type: "error", text: err.message });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);

    if (!currentPassword) {
      setPasswordNotice({ type: "error", text: "Masukkan kata sandi saat ini." });
      return;
    }

    if (!hasMinLength) {
      setPasswordNotice({ type: "error", text: "Kata sandi baru minimal 8 karakter." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordNotice({ type: "error", text: "Konfirmasi kata sandi baru tidak cocok." });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui kata sandi.");

      setPasswordNotice({ type: "success", text: "Kata sandi berhasil diperbarui! Akun Anda kini lebih aman." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordNotice({ type: "error", text: err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      onClose();
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const getInitials = (n: string) => {
    if (!n) return "U";
    return n
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formattedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Baru saja";

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Pengelolaan & Keamanan Akun
              </h2>
              <p className="text-xs text-slate-500">
                Kelola identitas, tingkatkan proteksi sandi, dan pantau sesi akun Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 gap-2 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "profile"
                ? "border-blue-600 text-blue-600 bg-white/80"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profil Akun</span>
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "password"
                ? "border-blue-600 text-blue-600 bg-white/80"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>Ganti Kata Sandi</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "security"
                ? "border-blue-600 text-blue-600 bg-white/80"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Pusat Keamanan & Sesi</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PROFIL AKUN */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in">
              {profileNotice && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 border ${
                    profileNotice.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {profileNotice.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{profileNotice.text}</span>
                </div>
              )}

              {/* Account Identity Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="h-14 w-14 rounded-2xl bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                    {getInitials(name || currentUser.name)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">
                        {name || currentUser.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          currentUser.role === "admin"
                            ? "bg-amber-400 text-slate-900"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        {currentUser.role === "admin" ? "Admin Operasional" : "Pemilik Akun"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 font-mono block mt-0.5">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300 sm:text-right border-t sm:border-t-0 border-slate-700/60 pt-2 sm:pt-0">
                  <span className="block text-[11px] text-slate-400">Terdaftar Sejak</span>
                  <strong className="text-white font-medium">{formattedDate}</strong>
                </div>
              </div>

              {/* Edit Name Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Muhammad Rizky"
                    className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nama ini ditampilkan pada dashboard dan dokumen pendaftaran Anda.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Alamat Email (Login)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={currentUser.email}
                      className="w-full min-h-[44px] px-3.5 rounded-xl border border-slate-200 text-sm text-slate-500 bg-slate-50 cursor-not-allowed"
                    />
                    <span className="absolute right-3 top-3 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Terverifikasi
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Email digunakan sebagai identitas akun utama dan penerima verifikasi.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile || name === currentUser.name}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                  >
                    {savingProfile ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Simpan Perubahan Nama</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: GANTI KATA SANDI */}
          {activeTab === "password" && (
            <div className="space-y-6 animate-in fade-in">
              {passwordNotice && (
                <div
                  className={`p-3.5 rounded-2xl text-xs flex items-center gap-2.5 border ${
                    passwordNotice.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  {passwordNotice.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{passwordNotice.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Kata Sandi Saat Ini */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Kata Sandi Saat Ini
                    </label>
                    <a
                      href="/forgot-password"
                      target="_blank"
                      className="text-[11px] text-blue-600 hover:underline font-semibold"
                    >
                      Lupa kata sandi?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type={showCurrent ? "text" : "password"}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Masukkan kata sandi lama Anda"
                      className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Kata Sandi Baru */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Kata Sandi Baru
                    </label>
                    {newPassword.length > 0 && (
                      <span
                        className={`text-[10px] font-bold ${
                          strengthScore <= 1
                            ? "text-red-500"
                            : strengthScore <= 2
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {strengthScore <= 1 ? "Lemah" : strengthScore <= 2 ? "Sedang" : "Kuat"}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type={showNew ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 8 karakter..."
                      className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {newPassword.length > 0 && (
                    <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full flex-1 rounded-full ${
                          strengthScore >= 1
                            ? strengthScore <= 1
                              ? "bg-red-500"
                              : strengthScore <= 2
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${
                          strengthScore >= 2
                            ? strengthScore <= 2
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                            : "bg-slate-200"
                        }`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${
                          strengthScore >= 3 ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                    </div>
                  )}
                </div>

                {/* Konfirmasi Kata Sandi Baru */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi kata sandi baru"
                      className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className="mt-1 text-[11px] font-medium">
                      {newPassword === confirmPassword ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Kata sandi cocok
                        </span>
                      ) : (
                        <span className="text-red-500">Kata sandi belum cocok</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Rekomendasi Keamanan */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-800 block">Kriteria Sandi Aman:</span>
                  <div className="flex items-center gap-1.5">
                    <span className={hasMinLength ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {hasMinLength ? "✓" : "○"} Minimal 8 karakter
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={hasLetter && hasNumber ? "text-emerald-600 font-bold" : "text-slate-400"}>
                      {hasLetter && hasNumber ? "✓" : "○"} Kombinasi huruf dan angka
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
                    className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                  >
                    {savingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Mengamankan Sandi...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="h-4 w-4" />
                        <span>Perbarui Kata Sandi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: PUSAT KEAMANAN & SESI */}
          {activeTab === "security" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Proteksi Akun Aktif & Terlindungi</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Akun Anda diamankan dengan enkripsi satu arah Bcrypt (10 salt rounds) untuk kata sandi, serta token JWT terenkripsi dengan proteksi cookie HTTP-Only yang kebal dari serangan XSS.
                </p>
              </div>

              {/* Sesi Aktif Saat Ini */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Sesi Login yang Sedang Aktif
                </span>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Perangkat Saat Ini</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Sesi Aktif
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Browser Web • Autentikasi Cookie JWT Terproteksi
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 text-red-600 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Keluar Sesi</span>
                  </button>
                </div>
              </div>

              {/* Panduan Keamanan Akun */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 block">
                  Tips Keamanan Akun Tambahan:
                </span>
                <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4">
                  <li>Jangan membagikan tautan reset kata sandi kepada orang lain.</li>
                  <li>Gunakan kata sandi unik yang tidak sama dengan akun email pribadi Anda.</li>
                  <li>Jika mencurigai aktivitas mencurigakan, segera ganti kata sandi atau hubungi admin resmi QuickLaunch.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

