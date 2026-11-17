"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Rocket,
  AlertCircle,
  Loader2,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasLength = password.length >= 6;
  const hasStrongLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);

  let strengthScore = 0;
  if (hasLength) strengthScore += 1;
  if (hasStrongLength) strengthScore += 1;
  if (hasNumber) strengthScore += 1;
  if (hasLetter) strengthScore += 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftar.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
            Studio
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Buat Akun Anda
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Mulai luncurkan landing page event & form Anda dalam hitungan menit
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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Nama Lengkap / Nama Panitia
              </label>
              <div className="relative">
                <User className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Pratama / Panitia BEM"
                  className="w-full min-h-[44px] pl-10 pr-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                Alamat Email Aktif
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-700"
                >
                  Kata Sandi
                </label>
                {password.length > 0 && (
                  <span
                    className={`text-[10px] font-bold ${
                      strengthScore <= 1
                        ? "text-red-500"
                        : strengthScore <= 3
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {strengthScore <= 1
                      ? "Lemah"
                      : strengthScore <= 3
                      ? "Sedang"
                      : "Kuat"}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6-8 karakter..."
                  className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {password.length > 0 && (
                <div className="mt-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                  <div
                    className={`h-full flex-1 rounded-full ${
                      strengthScore >= 1
                        ? strengthScore <= 1
                          ? "bg-red-500"
                          : strengthScore <= 3
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full ${
                      strengthScore >= 2
                        ? strengthScore <= 3
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full ${
                      strengthScore >= 3
                        ? strengthScore <= 3
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-full flex-1 rounded-full ${
                      strengthScore >= 4 ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-none disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Sekarang</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Micro-Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Keamanan data pendaftaran terjamin dengan enkripsi bcrypt</span>
        </div>
      </div>
    </div>
  );
}
