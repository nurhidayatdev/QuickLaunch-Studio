"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StepIndicator from "@/components/builder/StepIndicator";
import {
  CalendarDays,
  ShoppingBag,
  Sparkles,
  Check,
  ArrowRight,
  Loader2,
  LayoutTemplate,
} from "lucide-react";

const STEPS = [
  { title: "Pilih Kategori", description: "Event atau Produk" },
  { title: "Pilih Template", description: "Template dasar" },
  { title: "Isi Konten", description: "Detail & Jadwal" },
];

export default function NewBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<"event" | "produk">("event");
  const [templateId, setTemplateId] = useState<string>("modern-event");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.role === "admin") {
          alert("Akun admin difokuskan untuk operasional sistem dan verifikasi pembayaran.");
          router.replace("/admin/payments");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const defaultTitle =
        category === "event" ? "Nama Event Anda" : "Nama Produk Anda";

      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          templateId,
          title: defaultTitle,
          description:
            category === "event"
              ? "Tuliskan deskripsi lengkap mengenai event, benefit peserta, dan rincian acara di sini."
              : "Tuliskan keunggulan produk, spesifikasi, dan cara pemesanan di sini.",
          schedule:
            category === "event" ? "Sabtu, 28 November 2026 • 09:00 - 15:00 WIB" : "",
          location:
            category === "event" ? "Auditorium Utama / Zoom Meeting" : "Pengiriman dari Jakarta",
          price:
            category === "event" ? "Gratis / Early Bird Rp50.000" : "Rp99.000 / paket",
          accentColor: "#2563eb",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.code === "QUOTA_EXCEEDED") {
          alert("Kuota halaman Anda telah habis. Silakan pilih paket di dashboard untuk menambah kuota.");
          router.push("/dashboard");
          return;
        }
        throw new Error(data.error || "Gagal membuat draf halaman");
      }

      router.push(`/builder/${data.page.id}`);
    } catch (e: any) {
      alert(e.message || "Terjadi kesalahan");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[420px] w-[700px] rounded-full bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <StepIndicator currentStep={step} steps={STEPS} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 relative">
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Langkah 1 dari 3
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Pilih Kategori Halaman
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Tentukan format landing page yang paling relevan dengan penawaran Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
              {/* Event Card */}
              <button
                type="button"
                onClick={() => setCategory("event")}
                className={`relative flex flex-col p-7 rounded-2xl border-2 text-left transition-all duration-200 group hover:-translate-y-1 ${
                  category === "event"
                    ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/15"
                    : "border-slate-200/90 bg-white/90 hover:border-blue-300 hover:shadow-lg shadow-sm backdrop-blur-sm"
                }`}
              >
                {category === "event" && (
                  <div className="absolute top-5 right-5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/30">
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  </div>
                )}
                <div className={`flex h-13 w-13 p-3 items-center justify-center rounded-2xl mb-5 transition-transform group-hover:scale-105 ${
                  category === "event" ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" : "bg-blue-50 text-blue-600 border border-blue-100"
                }`}>
                  <CalendarDays className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">Event & Seminar</h3>
                  <span className="rounded-full bg-blue-100/70 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Form Peserta</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Webinar, workshop, tiket konser, temu komunitas, dengan formulir pendaftaran custom dan integrasi Google Sheets.
                </p>
              </button>

              {/* Produk/UMKM Card */}
              <button
                type="button"
                onClick={() => setCategory("produk")}
                className={`relative flex flex-col p-7 rounded-2xl border-2 text-left transition-all duration-200 group hover:-translate-y-1 ${
                  category === "produk"
                    ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/15"
                    : "border-slate-200/90 bg-white/90 hover:border-blue-300 hover:shadow-lg shadow-sm backdrop-blur-sm"
                }`}
              >
                {category === "produk" && (
                  <div className="absolute top-5 right-5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/30">
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  </div>
                )}
                <div className={`flex h-13 w-13 p-3 items-center justify-center rounded-2xl mb-5 transition-transform group-hover:scale-105 ${
                  category === "produk" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                }`}>
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900">Produk / UMKM</h3>
                  <span className="rounded-full bg-emerald-100/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Direct WhatsApp</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Katalog penawaran produk, pre-order, kuliner, fesyen, atau jasa profesional dengan tombol checkout otomatis ke WhatsApp.
                </p>
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex min-h-[46px] items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 active:scale-95 transition-all"
              >
                Lanjutkan ke Template
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-sm">
                <LayoutTemplate className="h-3.5 w-3.5 text-blue-600" />
                Langkah 2 dari 3
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Pilih Template Desain
              </h1>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Arsitektur landing page modern dengan konversi tinggi dan skor kecepatan PageSpeed 90+.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {/* Template 1: Modern Clean */}
              <div
                onClick={() => setTemplateId("modern-event")}
                className={`cursor-pointer relative rounded-2xl border-2 p-4 transition-all duration-200 group hover:-translate-y-1 ${
                  templateId === "modern-event"
                    ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/15"
                    : "border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md shadow-sm"
                }`}
              >
                {templateId === "modern-event" && (
                  <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/30 z-10">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-3 text-white flex flex-col justify-end shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 opacity-50" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-200 relative z-10">
                    Template 1
                  </span>
                  <h4 className="text-xs font-bold mt-0.5 relative z-10">Modern Clean</h4>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">Modern Clean</h3>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      Populer
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Format single page minimalis ala Notion/Linear. Cepat, jernih, dan fokus ke isi.
                  </p>
                </div>
              </div>

              {/* Template 2: Bold Minimalist */}
              <div
                onClick={() => setTemplateId("bold-minimalist")}
                className={`cursor-pointer relative rounded-2xl border-2 p-4 transition-all duration-200 group hover:-translate-y-1 ${
                  templateId === "bold-minimalist"
                    ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/15"
                    : "border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md shadow-sm"
                }`}
              >
                {templateId === "bold-minimalist" && (
                  <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/30 z-10">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-3 text-white flex flex-col justify-end border border-slate-800 shadow-inner">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                    Template 2
                  </span>
                  <h4 className="text-xs font-bold mt-0.5">Bold Minimalist</h4>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">Bold Minimalist</h3>
                    <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      Tech / Pro
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Tipografi tegas & kontras gelap-terang ala Vercel. Cocok untuk tech event & workshop.
                  </p>
                </div>
              </div>

              {/* Template 3: Card Compact */}
              <div
                onClick={() => setTemplateId("card-compact")}
                className={`cursor-pointer relative rounded-2xl border-2 p-4 transition-all duration-200 group hover:-translate-y-1 ${
                  templateId === "card-compact"
                    ? "border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/15"
                    : "border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-md shadow-sm"
                }`}
              >
                {templateId === "card-compact" && (
                  <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/30 z-10">
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-slate-100 p-2.5 flex flex-col justify-between border border-slate-200 shadow-inner">
                  <div className="flex gap-1.5">
                    <div className="h-4 w-12 rounded bg-slate-300" />
                    <div className="h-4 w-8 rounded bg-emerald-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-20 rounded bg-slate-800" />
                    <div className="h-2 w-28 rounded bg-slate-300" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">Card Compact</h3>
                    <span className="rounded-full bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      Bento / UMKM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Format modular bento ala Linktree/Bento.me. Sangat ringkas & responsif di layar ponsel.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex min-h-[44px] items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="flex min-h-[46px] items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyiapkan Halaman...
                  </>
                ) : (
                  <>
                    Mulai Isi Konten
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

