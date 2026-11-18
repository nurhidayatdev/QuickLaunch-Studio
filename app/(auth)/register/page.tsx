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
  KeyRound,
  Phone,
  MessageCircle,
  RefreshCw,
  Info,
  ChevronLeft,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Multi-step state: 1 = Form Pendaftaran, 2 = Verifikasi OTP Email, 3 = Sukses
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otpCode, setOtpCode] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [adminWa, setAdminWa] = useState("087873520868");
  const [isSimulated, setIsSimulated] = useState(false);

  // UI State
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Password Strength Calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);

  let strengthScore = 0;
  if (password.length >= 6) strengthScore += 1;
  if (hasMinLength) strengthScore += 1;
  if (hasNumber && hasLetter) strengthScore += 1;
  if (hasSpecial) strengthScore += 1;

  // STEP 1: Submit Register Form & Request OTP
  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftarkan akun.");
      }

      setTicketId(data.ticketId);
      setMaskedEmail(data.maskedEmail);
      if (data.adminWa) setAdminWa(data.adminWa);
      if (data.isSimulated !== undefined) setIsSimulated(Boolean(data.isSimulated));

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify Registration OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode || otpCode.trim().length !== 6) {
      setError("Masukkan 6-digit kode verifikasi OTP yang valid.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otpCode: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kode verifikasi salah atau sudah kadaluarsa.");
      }

      setStep(3);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend Registration OTP
  const handleResendOtp = async () => {
    setError("");
    setResending(true);
    setResendSuccess(false);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim ulang kode OTP.");
      }

      setTicketId(data.ticketId);
      if (data.isSimulated !== undefined) setIsSimulated(Boolean(data.isSimulated));
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  // WhatsApp Admin Link Generator
  const getWaVerificationUrl = () => {
    const cleanWa = adminWa.replace(/\D/g, "");
    const formattedWa = cleanWa.startsWith("0")
      ? "62" + cleanWa.slice(1)
      : cleanWa.startsWith("62")
      ? cleanWa
      : "62" + cleanWa;

    const message = `Halo Admin QuickLaunch Studio, saya sedang mendaftarkan akun baru:
- Nama: ${name.trim()}
- Email: ${email.trim().toLowerCase()}
- No Tiket: ${ticketId}

Mohon bantu konfirmasi kode OTP verifikasi aktivasi akun saya. Terima kasih.`;

    return `https://wa.me/${formattedWa}?text=${encodeURIComponent(message)}`;
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
          {step === 1 && "Buat Akun Anda"}
          {step === 2 && "Verifikasi Email Anda"}
          {step === 3 && "Pendaftaran Berhasil!"}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          {step === 1 && "Mulai luncurkan landing page event & form Anda dalam hitungan menit"}
          {step === 2 && "Sistem keamanan mengirimkan kode OTP untuk memvalidasi kepemilikan email"}
          {step === 3 && "Akun Anda telah aktif dan siap digunakan"}
        </p>

        {/* Step Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 1 ? "w-8 bg-blue-600" : "w-2 bg-blue-200"
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 2 ? "w-8 bg-blue-600" : step > 2 ? "w-2 bg-emerald-500" : "w-2 bg-slate-200"
            }`}
          />
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${
              step === 3 ? "w-8 bg-emerald-600" : "w-2 bg-slate-200"
            }`}
          />
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl shadow-slate-200/60 border border-slate-200/80 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-3.5 text-xs text-red-600 border border-red-200 flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="mb-6 rounded-2xl bg-emerald-50 p-3.5 text-xs text-emerald-700 border border-emerald-200 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Kode OTP baru telah berhasil dikirimkan ke email Anda.</span>
            </div>
          )}

          {/* STEP 1: REGISTRATION FORM */}
          {step === 1 && (
            <form className="space-y-4 animate-in fade-in" onSubmit={handleSubmitRegister}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Nama Lengkap / Nama Bisnis / Panitia *
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
                    placeholder="Contoh: Nur Hidayat"
                    className="w-full min-h-[44px] pl-10 pr-3.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Alamat Email Aktif *
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
                <p className="text-[11px] text-slate-400 mt-1">
                  Kode verifikasi OTP 6-digit akan dikirimkan ke email ini.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="phone"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Nomor WhatsApp (Opsional)
                  </label>
                  <span className="text-[10px] text-slate-400">Pemulihan Akun</span>
                </div>
                <div className="relative">
                  <Phone className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
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
                    Kata Sandi *
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
                    placeholder="Minimal 6 karakter..."
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
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Ulangi Kata Sandi *
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi Anda..."
                    className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                      <span>Mengirim Kode Verifikasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Lanjut Verifikasi Email</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VERIFY REGISTRATION OTP */}
          {step === 2 && (
            <form className="space-y-5 animate-in fade-in" onSubmit={handleVerifyOtp}>
              <div className="text-center space-y-1">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Masukkan Kode OTP Verifikasi
                </h3>
                <p className="text-xs text-slate-500">
                  Tiket Pendaftaran: <strong className="text-slate-800 font-mono">{ticketId}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Email Tujuan:</span>
                  <span className="font-mono font-bold text-slate-900">{maskedEmail || email}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Masa Berlaku:</span>
                  <span className="text-emerald-600 font-bold">15 Menit</span>
                </div>
              </div>

              {isSimulated && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900 space-y-1.5 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Info className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Server Email (SMTP) Belum Dikonfigurasi</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    Sistem belum terhubung ke pengirim email keluar. Anda dapat melihat kode OTP pendaftaran di menu <strong>Konsol Admin</strong> (<span className="font-mono font-bold text-amber-950">/admin/payments &rarr; Reset Sandi</span>) atau konfirmasi via <strong>WhatsApp Admin</strong> di bawah.
                  </p>
                </div>
              )}

              {/* Input OTP 6 Digit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  Masukkan 6-Digit Kode Verifikasi OTP *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="------"
                  className="w-full min-h-[52px] text-center tracking-[12px] font-mono text-2xl font-black rounded-2xl border-2 border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-white"
                />
                <p className="text-[11px] text-center text-slate-400 mt-1.5">
                  Periksa kotak masuk email Anda untuk melihat 6 digit kode ini.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-none disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memverifikasi Kode OTP...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Verifikasi & Aktifkan Akun</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Ubah Email / Data</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {resending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    <span>Kirim Ulang OTP</span>
                  </button>
                </div>
              </div>

              {/* Bantuan via WhatsApp Admin */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Belum menerima email atau butuh bantuan aktivasi?</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Hubungi WhatsApp Admin untuk menerima kode OTP pendaftaran Anda secara langsung:
                </p>
                <a
                  href={getWaVerificationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Bantuan Aktivasi via WhatsApp Admin</span>
                </a>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Email Berhasil Diverifikasi!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Selamat datang di QuickLaunch Studio. Akun Anda telah aktif dan sedang dialihkan ke dashboard...
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 pt-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Membuka Dashboard...</span>
              </div>
            </div>
          )}

          {step === 1 && (
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
          )}
        </div>

        {/* Security Trust Micro-Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Keamanan verifikasi email resmi dengan perlindungan OTP QuickLaunch</span>
        </div>
      </div>
    </div>
  );
}
