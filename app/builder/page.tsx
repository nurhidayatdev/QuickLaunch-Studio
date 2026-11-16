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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <StepIndicator currentStep={step} steps={STEPS} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Pilih Jenis Halaman
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Tentukan tujuan landing page yang ingin Anda buat.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Event Card */}
              <button
                type="button"
                onClick={() => setCategory("event")}
                className={`relative flex flex-col p-6 rounded-2xl border-2 text-left transition-all ${
                  category === "event"
                    ? "border-blue-600 bg-blue-50/40 ring-4 ring-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {category === "event" && (
                  <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-4">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Event & Seminar</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Cocok untuk pendaftaran webinar, workshop, konser, lomba, atau kegiatan komunitas.
                </p>
              </button>

              {/* Produk/UMKM Card */}
              <button
                type="button"
                onClick={() => setCategory("produk")}
                className={`relative flex flex-col p-6 rounded-2xl border-2 text-left transition-all ${
                  category === "produk"
                    ? "border-blue-600 bg-blue-50/40 ring-4 ring-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {category === "produk" && (
                  <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Produk / UMKM</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Cocok untuk penawaran produk, pre-order katalog, atau jasa UMKM dengan tombol pesan WhatsApp.
                </p>
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                Lanjutkan
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Pilih Template Desain
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Template dasar yang dioptimalkan untuk kecepatan dan konversi mobile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {/* Template 1: Modern Clean */}
              <div
                onClick={() => setTemplateId("modern-event")}
                className={`cursor-pointer relative rounded-2xl border-2 p-3.5 shadow-sm transition-all text-left ${
                  templateId === "modern-event"
                    ? "border-blue-600 bg-white ring-4 ring-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {templateId === "modern-event" && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white z-10">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-3 text-white flex flex-col justify-end">
                  <span className="text-[9px] font-semibold uppercase text-blue-200">
                    Template 1
                  </span>
                  <h4 className="text-xs font-bold mt-0.5">Modern Clean</h4>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">Modern Clean</h3>
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Populer
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Single page minimalis ala Notion. Cepat dan fokus.
                  </p>
                </div>
              </div>

              {/* Template 2: Bold Minimalist */}
              <div
                onClick={() => setTemplateId("bold-minimalist")}
                className={`cursor-pointer relative rounded-2xl border-2 p-3.5 shadow-sm transition-all text-left ${
                  templateId === "bold-minimalist"
                    ? "border-blue-600 bg-white ring-4 ring-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {templateId === "bold-minimalist" && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white z-10">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-3 text-white flex flex-col justify-end border border-slate-800">
                  <span className="text-[9px] font-semibold uppercase text-emerald-400">
                    Template 2
                  </span>
                  <h4 className="text-xs font-bold mt-0.5">Bold Minimalist</h4>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">Bold Minimalist</h3>
                    <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                      Webinar/Tech
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Tipografi tegas & kontras gelap-terang modern.
                  </p>
                </div>
              </div>

              {/* Template 3: Card Compact */}
              <div
                onClick={() => setTemplateId("card-compact")}
                className={`cursor-pointer relative rounded-2xl border-2 p-3.5 shadow-sm transition-all text-left ${
                  templateId === "card-compact"
                    ? "border-blue-600 bg-white ring-4 ring-blue-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {templateId === "card-compact" && (
                  <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white z-10">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <div className="h-28 rounded-xl bg-slate-100 p-2.5 flex flex-col justify-between border border-slate-200">
                  <div className="flex gap-1.5">
                    <div className="h-4 w-12 rounded bg-slate-300" />
                    <div className="h-4 w-8 rounded bg-emerald-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="h-3 w-20 rounded bg-slate-800" />
                    <div className="h-2 w-28 rounded bg-slate-300" />
                  </div>
                </div>
                <div className="mt-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">Card Compact</h3>
                    <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                      Bento/UMKM
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Format modular bento ala Linktree. Sangat ringkas di HP.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex min-h-[44px] items-center rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={handleCreate}
                disabled={loading}
                className="flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
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

