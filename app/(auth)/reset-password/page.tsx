"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Rocket,
  AlertCircle,
  Loader2,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password Strength Calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let strengthScore = 0;
  if (hasMinLength) strengthScore += 1;
  if (hasNumber) strengthScore += 1;
  if (hasLetter) strengthScore += 1;
  if (hasSpecial) strengthScore += 1;

  const getStrengthLabel = () => {
    if (!password) return { label: "", color: "bg-slate-200", textColor: "text-slate-400" };
    if (strengthScore <= 1) return { label: "Sangat Lemah", color: "bg-red-500", textColor: "text-red-500" };
    if (strengthScore === 2) return { label: "Cukup", color: "bg-amber-500", textColor: "text-amber-500" };
    if (strengthScore === 3) return { label: "Kuat", color: "bg-blue-500", textColor: "text-blue-500" };
    return { label: "Sangat Kuat", color: "bg-emerald-500", textColor: "text-emerald-500" };
  };

  const strength = getStrengthLabel();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Token reset tidak ditemukan dalam tautan. Silakan klik tautan dari email/pesan pemulihan Anda.");
      return;
    }

    if (!hasMinLength) {
      setError("Kata sandi baru harus minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengatur ulang kata sandi.");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl shadow-slate-200/60 border border-slate-200/80 rounded-3xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

      {error && (
        <div className="mb-6 rounded-2xl bg-red-50 p-3.5 text-xs text-red-600 border border-red-200 flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="text-center py-6 space-y-4 animate-in fade-in">
          <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Kata Sandi Berhasil Diperbarui!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Akun Anda telah diamankan. Mengalihkan Anda otomatis ke dashboard...
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700"
            >
              <span>Buka Dashboard Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!token && (
            <div className="rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                Perhatian: Tautan ini tidak memiliki token reset yang valid. Silakan ajukan permohonan melalui{" "}
                <Link href="/forgot-password" className="underline font-bold">
                  halaman lupa kata sandi
                </Link>
                .
              </span>
            </div>
          )}

          <div>
            <label
              htmlFor="new-password"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Kata Sandi Baru
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter..."
                className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Indicator Bar */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Kekuatan Sandi:</span>
                  <span className={`font-bold ${strength.textColor}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full flex-1 rounded-full ${strengthScore >= 1 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-full flex-1 rounded-full ${strengthScore >= 2 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-full flex-1 rounded-full ${strengthScore >= 3 ? strength.color : "bg-slate-200"}`} />
                  <div className={`h-full flex-1 rounded-full ${strengthScore >= 4 ? strength.color : "bg-slate-200"}`} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang kata sandi baru..."
                className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
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
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                {password === confirmPassword ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-medium">
                    <Check className="h-3.5 w-3.5" /> Kata sandi cocok
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1 font-medium">
                    <X className="h-3.5 w-3.5" /> Kata sandi belum cocok
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Checklist Syarat Keamanan */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block mb-1">Standar Keamanan Kata Sandi:</span>
            <div className="flex items-center gap-1.5">
              <span className={hasMinLength ? "text-emerald-600" : "text-slate-400"}>
                {hasMinLength ? "✓" : "○"} Minimal 8 karakter
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={hasLetter && hasNumber ? "text-emerald-600" : "text-slate-400"}>
                {hasLetter && hasNumber ? "✓" : "○"} Kombinasi huruf dan angka
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
              className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-none disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memperbarui Sandi...</span>
                </>
              ) : (
                <>
                  <span>Simpan & Masuk ke Akun</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <p className="text-xs text-slate-500">
          Sudah ingat kata sandi lama?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Halaman Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/70 via-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 font-bold text-slate-900 group transition-transform hover:scale-105"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
            <Rocket className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            QuickLaunch
          </span>
          <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-bold text-blue-700">
            Security
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Atur Ulang Kata Sandi
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Buat kata sandi baru yang kuat untuk melindungi akun dan landing page Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense
          fallback={
            <div className="bg-white p-8 rounded-3xl text-center text-slate-400 text-xs">
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2 text-blue-600" />
              Memuat formulir pemulihan...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Password di-hash menggunakan algoritma Bcrypt Salt 10</span>
        </div>
      </div>
    </div>
  );
}
