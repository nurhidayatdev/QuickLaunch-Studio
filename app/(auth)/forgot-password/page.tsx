"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Rocket,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  KeyRound,
  ExternalLink,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetData, setResetData] = useState<{
    resetUrl: string;
    resetToken: string;
    userName?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses permohonan reset.");
      }

      setResetData({
        resetUrl: data.resetUrl,
        resetToken: data.resetToken,
        userName: data.user?.name,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resetData?.resetUrl) return;
    navigator.clipboard.writeText(resetData.resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
          Pemulihan Kata Sandi
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Masukkan email terdaftar untuk mengatur ulang kata sandi akun Anda secara aman
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl shadow-slate-200/60 border border-slate-200/80 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-3.5 text-xs text-red-600 border border-red-200 flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {resetData ? (
            <div className="space-y-5 animate-in fade-in text-center">
              <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Tautan Pemulihan Siap!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Halo <strong>{resetData.userName || "Pengguna"}</strong>, tautan reset kata sandi Anda telah berhasil dibuat secara aman.
                </p>
              </div>

              {/* Box Tautan Reset */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Tautan Verifikasi:</span>
                  <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Aktif 60 Menit
                  </span>
                </div>
                <div className="text-[11px] font-mono bg-white p-2.5 rounded-xl border border-slate-200 break-all text-slate-600 select-all">
                  {resetData.resetUrl}
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <Link
                  href={resetData.resetUrl}
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-all"
                >
                  <KeyRound className="h-4 w-4" />
                  <span>Atur Ulang Kata Sandi Sekarang</span>
                </Link>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-emerald-600 font-bold">Tautan Berhasil Disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-slate-500" />
                      <span>Salin Tautan Pemulihan</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setResetData(null);
                    setEmail("");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Gunakan email lain
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Alamat Email Terdaftar
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full min-h-[44px] pl-10 pr-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-none disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memverifikasi Email...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Tautan Pemulihan</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Ingat kata sandi Anda?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Kembali ke halaman masuk
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Micro-Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Keamanan dilindungi enkripsi kriptografis tingkat tinggi</span>
        </div>
      </div>
    </div>
  );
}
