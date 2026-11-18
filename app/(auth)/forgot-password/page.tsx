"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Rocket,
  AlertCircle,
  Loader2,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Lock,
  Phone,
  MessageCircle,
  Eye,
  EyeOff,
  Check,
  X,
  RefreshCw,
  HelpCircle,
  Info,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  // Step 1: Input Email & Optional Phone
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 2: OTP Verification Info
  const [ticketId, setTicketId] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [hasRegisteredPhone, setHasRegisteredPhone] = useState(false);
  const [adminWa, setAdminWa] = useState("087873520868");
  const [otpCode, setOtpCode] = useState("");
  const [isSimulated, setIsSimulated] = useState(false);

  // Step 3: Set New Password
  const [resetSessionToken, setResetSessionToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password Strength Calculation
  const hasMinLength = newPassword.length >= 8;
  const hasNumber = /[0-9]/.test(newPassword);
  const hasLetter = /[a-zA-Z]/.test(newPassword);

  let strengthScore = 0;
  if (hasMinLength) strengthScore += 1;
  if (hasNumber) strengthScore += 1;
  if (hasLetter) strengthScore += 1;
  if (/[^a-zA-Z0-9]/.test(newPassword)) strengthScore += 1;

  // STEP 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses permohonan verifikasi.");
      }

      setTicketId(data.ticketId);
      setMaskedEmail(data.maskedEmail);
      setMaskedPhone(data.maskedPhone);
      setHasRegisteredPhone(data.hasRegisteredPhone);
      if (data.adminWa) setAdminWa(data.adminWa);
      if (data.isSimulated !== undefined) setIsSimulated(Boolean(data.isSimulated));

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpCode || otpCode.trim().length !== 6) {
      setError("Masukkan 6-digit kode verifikasi OTP yang valid.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otpCode: otpCode.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Kode verifikasi salah atau sudah kadaluarsa.");
      }

      setResetSessionToken(data.resetSessionToken);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasMinLength) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: resetSessionToken,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengatur ulang kata sandi.");
      }

      setStep(4);
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

  const getWaVerificationUrl = () => {
    const text = `Halo Admin QuickLaunch, saya pemilik akun terdaftar dengan email: ${email}. Saya mengajukan verifikasi lupa password dengan Tiket #${ticketId}. Mohon verifikasi bahwa ini benar saya dan aktifkan kode OTP saya. Terima kasih!`;
    const cleanPhone = adminWa.replace(/[^0-9]/g, "").replace(/^0/, "62");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
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
            Keamanan Akun
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
          Pemulihan Kata Sandi Aman
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Verifikasi identitas pemilik asli akun untuk melindungi landing page & data Anda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl shadow-slate-200/60 border border-slate-200/80 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 text-[11px] font-bold text-slate-400">
            <span className={step >= 1 ? "text-blue-600 font-extrabold" : ""}>
              1. Identifikasi
            </span>
            <span>→</span>
            <span className={step >= 2 ? "text-blue-600 font-extrabold" : ""}>
              2. Verifikasi OTP
            </span>
            <span>→</span>
            <span className={step >= 3 ? "text-blue-600 font-extrabold" : ""}>
              3. Sandi Baru
            </span>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-3.5 text-xs text-red-600 border border-red-200 flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: REQUEST OTP */}
          {step === 1 && (
            <form className="space-y-4 animate-in fade-in" onSubmit={handleRequestOtp}>
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-blue-900 block mb-0.5">
                  Proteksi Keamanan Berlapis
                </span>
                Sistem tidak menampilkan tautan ganti sandi sembarangan. Kode OTP rahasia 6-digit akan dikirimkan langsung kepada pemilik asli akun terdaftar.
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Alamat Email Akun Terdaftar *
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
                    htmlFor="phone"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Nomor WhatsApp Terdaftar (Opsional)
                  </label>
                  <span className="text-[10px] text-slate-400">Verifikasi Tambahan</span>
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
                <p className="text-[11px] text-slate-400 mt-1">
                  Membantu mencocokkan kepemilikan nomor jika akun Anda telah menautkan WhatsApp.
                </p>
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
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Kode OTP Verifikasi</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: VERIFY OTP */}
          {step === 2 && (
            <form className="space-y-5 animate-in fade-in" onSubmit={handleVerifyOtp}>
              <div className="text-center space-y-1">
                <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Verifikasi Kepemilikan Akun
                </h3>
                <p className="text-xs text-slate-500">
                  Tiket Pemulihan: <strong className="text-slate-800 font-mono">{ticketId}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Email Tujuan:</span>
                  <span className="font-mono font-bold text-slate-900">{maskedEmail}</span>
                </div>
                {maskedPhone && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">WhatsApp Terdaftar:</span>
                    <span className="font-mono font-bold text-slate-900">{maskedPhone}</span>
                  </div>
                )}
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
                    Sistem belum terhubung ke server pengirim email. Anda dapat melihat kode OTP langsung di menu <strong>Konsol Admin</strong> (<span className="font-mono font-bold text-amber-950">/admin/payments &rarr; Reset Sandi</span>) atau konfirmasi via <strong>WhatsApp Admin</strong> di bawah.
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
                  Periksa kotak masuk email Anda untuk melihat kode 6-digit rahasia ini.
                </p>
              </div>

              {/* Kanal Verifikasi Pemilik via WhatsApp Resmi Admin */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Belum menerima email atau butuh bantuan cepat?</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Pemilik asli dapat melakukan verifikasi 1-klik langsung ke WhatsApp Resmi Admin untuk konfirmasi kode OTP Anda secara instan.
                </p>
                <a
                  href={getWaVerificationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Verifikasi Pemilik via WhatsApp Admin</span>
                </a>
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
                      <span>Memvalidasi Kode OTP...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Verifikasi & Lanjut Ganti Sandi</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpCode("");
                    setError("");
                  }}
                  className="w-full text-xs text-slate-500 hover:text-slate-800 text-center py-1 cursor-pointer"
                >
                  ← Ubah email atau ajukan ulang
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CREATE NEW PASSWORD */}
          {step === 3 && (
            <form className="space-y-4 animate-in fade-in" onSubmit={handleResetPassword}>
              <div className="text-center space-y-1 mb-2">
                <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Identitas Terverifikasi!
                </h3>
                <p className="text-xs text-slate-500">
                  Silakan buat kata sandi baru yang kuat untuk akun Anda
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi Baru *
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter..."
                    className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Kekuatan Sandi:</span>
                      <span
                        className={`font-bold ${
                          strengthScore <= 1
                            ? "text-red-500"
                            : strengthScore <= 2
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }`}
                      >
                        {strengthScore <= 1 ? "Lemah" : strengthScore <= 2 ? "Sedang" : "Kuat"}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
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
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Konfirmasi Kata Sandi Baru *
                </label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru..."
                    className="w-full min-h-[44px] pl-10 pr-10 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all bg-slate-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <div className="mt-1 text-[11px] font-medium">
                    {newPassword === confirmPassword ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check className="h-3.5 w-3.5" /> Kata sandi cocok
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <X className="h-3.5 w-3.5" /> Kata sandi belum cocok
                      </span>
                    )}
                  </div>
                )}
              </div>

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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                  className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-none disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Menyimpan Sandi Baru...</span>
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

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Kata Sandi Berhasil Diperbarui!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Akun Anda telah diamankan dengan kata sandi baru. Mengalihkan Anda otomatis ke dashboard...
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
          <span>Autentikasi terproteksi OTP 6-Digit & Kriptografi Hash Bcrypt Salt 10</span>
        </div>
      </div>
    </div>
  );
}
