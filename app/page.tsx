import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { PAYMENT_PACKAGES } from "@/lib/payment-config";
import {
  Rocket,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  FileSpreadsheet,
  Smartphone,
  Copy,
  Zap,
  Check,
  HelpCircle,
  LayoutTemplate,
  Lock,
  Star,
  Users,
  Clock,
  Layers,
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar user={null} />

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION WITH AMBIENT RADIAL GLOW */}
        <section className="relative w-full overflow-hidden pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(59,130,246,0.18),rgba(255,255,255,0))]">
          {/* Subtle Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f015_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="relative max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-blue-700 shadow-sm shadow-blue-500/10">
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              <span>Platform Builder Mandiri untuk Panitia Event & UMKM</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
              Bikin Landing Page Pendaftaran{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  Kredibel & Instan
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-blue-100 -rotate-1 rounded-sm -z-0" />
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Format cepat, mobile-first, dan rapi untuk event kampus, webinar, pendaftaran lomba, komunitas, atau katalog produk UMKM tanpa perlu skill coding atau sewa developer mahal.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/register"
                className="flex min-h-[50px] w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:shadow-none hover:-translate-y-0.5 transition-all"
              >
                <span>Mulai Buat Halaman</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/p/seminar-ai-2026"
                target="_blank"
                className="flex min-h-[50px] w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white/90 backdrop-blur-sm px-7 py-3.5 text-sm font-bold text-slate-700 hover:bg-white hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm"
              >
                <span>Lihat Contoh Halaman Publik</span>
              </Link>
            </div>

            {/* Value Props Micro-Pills */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs font-bold text-slate-600">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Sekali Bayar (Tanpa Langganan)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Transfer Bank & QRIS Mudah</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Auto-Sync Google Sheets</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Link WhatsApp Otomatis</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 STEPS HOW IT WORKS (BENTO CARDS) */}
        <section className="w-full bg-white border-y border-slate-200/80 py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-14">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                Alur Praktis & Cepat
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
                Cara Kerja QuickLaunch
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Tanpa ribet integrasi payment gateway. Cukup transfer manual dan halaman Anda langsung aktif siap pakai.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group rounded-3xl border border-slate-200/80 bg-slate-50/60 p-7 flex flex-col justify-between relative overflow-hidden hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-200">
                <span className="absolute -top-3 -right-2 text-7xl font-black text-slate-200/40 select-none group-hover:text-blue-100/60 transition-colors">
                  01
                </span>
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm mb-5 shadow-md shadow-blue-500/20">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    1. Pilih Paket & Transfer
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Pilih paket kuota sesuai kebutuhan (mulai Rp25.000). Transfer ke BCA, Mandiri, atau QRIS lalu upload bukti screenshot.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/80 text-[11px] font-bold text-blue-600 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verifikasi Kilat oleh Admin</span>
                </div>
              </div>

              <div className="group rounded-3xl border border-slate-200/80 bg-slate-50/60 p-7 flex flex-col justify-between relative overflow-hidden hover:bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-200">
                <span className="absolute -top-3 -right-2 text-7xl font-black text-slate-200/40 select-none group-hover:text-indigo-100/60 transition-colors">
                  02
                </span>
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm mb-5 shadow-md shadow-indigo-500/20">
                    <LayoutTemplate className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    2. Pilih Template & Desain
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Gunakan 3 template profesional (Modern Clean, Bold Minimalist, Bento Card). Sesuaikan formulir pendaftaran sesuai data peserta.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/80 text-[11px] font-bold text-indigo-600 flex items-center gap-1.5">
                  <Smartphone className="h-4 w-4 text-indigo-600" />
                  <span>Dual Live Preview Mobile & Desktop</span>
                </div>
              </div>

              <div className="group rounded-3xl border border-slate-200/80 bg-slate-50/60 p-7 flex flex-col justify-between relative overflow-hidden hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-200">
                <span className="absolute -top-3 -right-2 text-7xl font-black text-slate-200/40 select-none group-hover:text-emerald-100/60 transition-colors">
                  03
                </span>
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold text-sm mb-5 shadow-md shadow-emerald-500/20">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    3. Publikasikan & Sebar Link
                  </h3>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    Halaman Anda langsung live di tautan resmi. Data pendaftar tersimpan rapi dan otomatis tersinkronisasi ke Google Sheets & WhatsApp.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/80 text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                  <span>Auto-Sync Sheets & Kode Unik</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PACKAGES SECTION */}
        <section id="pricing" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-24">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              Investasi Hemat & Terjangkau
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-3">
              Pilihan Paket Kuota QuickLaunch
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Satu kali bayar per kuota halaman. Tidak ada biaya langganan bulanan yang membebani kas kepanitiaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PAYMENT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-7 border flex flex-col justify-between transition-all duration-200 ${
                  pkg.popular
                    ? "border-blue-600 bg-white ring-4 ring-blue-600/10 shadow-2xl shadow-blue-600/15 relative md:-translate-y-2 z-10"
                    : "border-slate-200/90 bg-white shadow-sm hover:border-slate-300 hover:shadow-md"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    <span>Paling Populer</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {pkg.name}
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {pkg.quota} Halaman
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 min-h-[32px] leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="mt-5 pb-5 border-b border-slate-100">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      Rp{pkg.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-normal mt-1">
                      Sekali bayar • Masa aktif selamanya
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-3 text-xs text-slate-600">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/register"
                    className={`flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      pkg.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    <span>Pilih {pkg.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods Notice Banner */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
                <CreditCard className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Mendukung Pembayaran Transfer Fleksibel
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Transfer via <strong>Bank BCA</strong>, <strong>Bank Mandiri</strong>, serta <strong>QRIS (GoPay, OVO, Dana, LinkAja)</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl shrink-0">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Verifikasi Manual Aman & Terverifikasi</span>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full bg-white border-t border-slate-200/80 py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                Tanya Jawab
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <div className="space-y-3.5">
              <div className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  Bagaimana cara melakukan pembayaran?
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">
                  Setelah mendaftar akun, buka Dashboard dan klik &quot;Beli Paket&quot;. Pilih paket yang diinginkan, transfer ke rekening BCA/Mandiri atau scan QRIS yang tertera, lalu upload screenshot bukti transfer Anda.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  Berapa lama proses verifikasi pembayaran?
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">
                  Admin memverifikasi mutasi rekening setiap hari. Biasanya verifikasi selesai dalam kurun waktu 5–15 menit. Anda juga dapat mengklik tombol &quot;Konfirmasi via WhatsApp&quot; untuk verifikasi kilat langsung dengan admin.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                  <HelpCircle className="h-4 w-4 text-blue-600 shrink-0" />
                  Apakah ada batasan jumlah formulir yang masuk?
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6">
                  Tidak ada batasan! Seluruh formulir pendaftaran dari peserta dapat ditampung tanpa batas dan langsung tersinkronisasi ke Google Sheets spreadsheet Anda secara otomatis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-20 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Siap Luncurkan Halaman Event Anda Hari Ini?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Bergabunglah dengan ratusan panitia event dan UMKM yang menghemat waktu dan biaya pembuatan landing page.
            </p>
            <div className="pt-3">
              <Link
                href="/register"
                className="inline-flex min-h-[50px] items-center gap-2 rounded-2xl bg-blue-600 px-9 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/40 hover:bg-blue-500 hover:-translate-y-0.5 transition-all"
              >
                <span>Daftar & Mulai Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Rocket className="h-4 w-4" />
            </div>
            <span className="text-sm font-black">QuickLaunch Studio</span>
          </div>
          <p>© {new Date().getFullYear()} QuickLaunch Studio. Seluruh hak cipta dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
