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
} from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar user={null} />

      <main className="flex-1 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 mb-6 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Platform Builder Mandiri untuk Panitia Event & UMKM</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Bikin Landing Page Pendaftaran{" "}
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">
              Kredibel & Instan
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tanpa perlu skill coding atau sewa web developer mahal. Cocok untuk seminar kampus, webinar, pendaftaran lomba, komunitas, atau katalog pemesanan UMKM.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-none transition-all"
            >
              Mulai Buat Halaman
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/p/seminar-ai-2026"
              target="_blank"
              className="flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-sm"
            >
              Lihat Contoh Halaman Publik
            </Link>
          </div>

          {/* Value Props Pills */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Sekali Bayar, Tanpa Langganan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Transfer Bank & QRIS Mudah</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Auto-Sync Google Sheets</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Link Konfirmasi WhatsApp Otomatis</span>
            </div>
          </div>
        </section>

        {/* 3 STEPS HOW IT WORKS */}
        <section className="w-full bg-white border-y border-slate-200 py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Alur Praktis & Cepat
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Cara Kerja QuickLaunch
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Tanpa ribet integrasi payment gateway. Cukup transfer manual dan halaman Anda langsung aktif.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between relative overflow-hidden">
                <span className="absolute -top-2 -right-2 text-6xl font-black text-slate-200/50 select-none">
                  01
                </span>
                <div>
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    1. Pilih Paket & Transfer
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Pilih paket kuota sesuai kebutuhan (mulai Rp25.000). Transfer ke BCA, Mandiri, atau QRIS lalu upload bukti screenshot.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                  <span>Verifikasi Kilat oleh Admin</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between relative overflow-hidden">
                <span className="absolute -top-2 -right-2 text-6xl font-black text-slate-200/50 select-none">
                  02
                </span>
                <div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-4">
                    <LayoutTemplate className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    2. Pilih Template & Desain
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Gunakan 3 template profesional (Modern Clean, Bold Minimalist, Bento Card). Sesuaikan formulir pendaftaran sesuai data yang dibutuhkan.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                  <span>Dual Live Preview Mobile & Desktop</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between relative overflow-hidden">
                <span className="absolute -top-2 -right-2 text-6xl font-black text-slate-200/50 select-none">
                  03
                </span>
                <div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
                    <Rocket className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    3. Publikasikan & Sebar Link
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Halaman Anda langsung live di tautan resmi. Data pendaftar tersimpan rapi di dashboard dan otomatis terkirim ke Google Sheets & WhatsApp.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <span>Auto-Sync Sheets & Kode Unik</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PACKAGES SECTION */}
        <section id="pricing" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Investasi Hemat & Terjangkau
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-1">
              Pilihan Paket Kuota QuickLaunch
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Satu kali bayar per kuota halaman. Tidak ada biaya langganan bulanan yang membebani kas kepanitiaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAYMENT_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? "border-blue-600 bg-white ring-2 ring-blue-600/30 shadow-xl relative"
                    : "border-slate-200 bg-white shadow-sm hover:border-slate-300"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md uppercase tracking-wide">
                    Paling Populer
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      {pkg.name}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {pkg.quota} Halaman
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 min-h-[32px]">
                    {pkg.description}
                  </p>

                  <div className="mt-5 pb-5 border-b border-slate-100">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      Rp{pkg.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xs text-slate-400 block font-normal mt-0.5">
                      Sekali bayar • Masa aktif selamanya
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href="/register"
                    className={`flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      pkg.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
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
          <div className="mt-10 rounded-2xl bg-slate-100 border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Mendukung Pembayaran Transfer Fleksibel
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Transfer via <strong>Bank BCA</strong>, <strong>Bank Mandiri</strong>, serta <strong>QRIS (GoPay, OVO, Dana, LinkAja)</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Verifikasi Manual Aman & Terverifikasi</span>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full bg-white border-t border-slate-200 py-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Tanya Jawab
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  Bagaimana cara melakukan pembayaran?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed pl-6">
                  Setelah mendaftar akun, buka Dashboard dan klik &quot;Beli Paket&quot;. Pilih paket yang diinginkan, transfer ke rekening BCA/Mandiri atau scan QRIS yang tertera, lalu upload screenshot bukti transfer Anda.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  Berapa lama proses verifikasi pembayaran?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed pl-6">
                  Admin memverifikasi mutasi rekening setiap hari. Biasanya verifikasi selesai dalam kurun waktu 5–15 menit. Anda juga dapat mengklik tombol &quot;Konfirmasi via WhatsApp&quot; untuk verifikasi kilat langsung dengan admin.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/50">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  Apakah ada batasan jumlah formulir yang masuk?
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed pl-6">
                  Tidak ada batasan! Seluruh formulir pendaftaran dari peserta dapat ditampung tanpa batas dan langsung tersinkronisasi ke Google Sheets spreadsheet Anda secara otomatis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Siap Luncurkan Halaman Event Anda Hari Ini?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Bergabunglah dengan ratusan panitia event dan UMKM yang menghemat waktu dan biaya pembuatan landing page.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-500 transition-all"
              >
                Daftar & Mulai Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Rocket className="h-4 w-4 text-blue-600" />
            <span>QuickLaunch Studio</span>
          </div>
          <p>© {new Date().getFullYear()} QuickLaunch Studio. Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
