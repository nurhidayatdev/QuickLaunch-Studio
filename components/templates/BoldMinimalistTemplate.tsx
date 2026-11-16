"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Tag,
  MessageCircle,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Upload,
  FileCheck,
  Zap,
  Terminal,
  ShoppingBag,
  Store,
  ShieldCheck,
  Check,
} from "lucide-react";
import { FormFieldItem } from "../builder/FormFieldBuilder";
import { buildWhatsAppConfirmationLink } from "@/lib/whatsapp";
import { TemplatePageData } from "./ModernEventTemplate";

export default function BoldMinimalistTemplate({
  data,
  fields = [],
  isDraft = true,
}: {
  data: TemplatePageData;
  fields?: FormFieldItem[];
  isDraft?: boolean;
}) {
  const isUMKM = data.category === "produk";
  const accent = data.accentColor || (isUMKM ? "#10b981" : "#3b82f6");
  const cleanWaNumber = data.waNumber ? data.waNumber.replace(/[^0-9]/g, "") : "";
  const formattedWa = cleanWaNumber.startsWith("0")
    ? `62${cleanWaNumber.slice(1)}`
    : cleanWaNumber;

  const waLink = formattedWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(
        isUMKM
          ? `Halo ${data.title}, saya ingin menanyakan ketersediaan produk ini.`
          : `Halo panitia ${data.title}, saya ingin menanyakan info teknis kegiatan ini.`
      )}`
    : "#";

  // Form State
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedData, setSubmittedData] = useState<{
    code: string;
    waLink: string;
  } | null>(null);

  const handleInputChange = (fieldKey: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      if (!data.id) {
        // Mock submission
        await new Promise((res) => setTimeout(res, 600));
        const mockCode = "BM-4421";
        const mockWaLink = buildWhatsAppConfirmationLink(
          data.waNumber,
          data.waMessageTemplate,
          {
            event: data.title,
            nama: formData["Nama Lengkap"] || formData["Nama Pembeli"] || "Peserta",
            kode: mockCode,
            tiket: formData["Pilihan Tiket / Kategori"] || formData["Varian / Jumlah Pesanan"] || "Standar",
            kontak: formData["Nomor WhatsApp"] || "08123456789",
          }
        );
        setSubmittedData({ code: mockCode, waLink: mockWaLink });
        return;
      }

      const res = await fetch(`/api/pages/${data.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: formData }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Gagal mengirimkan formulir.");
      }

      setSubmittedData({
        code: resData.submission.code,
        waLink: resData.submission.waLink,
      });
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans selection:bg-white selection:text-black pb-20">
      {/* High-Contrast Bold Header with Grid and Dark Aura */}
      <header className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-black pt-16 pb-12 px-4 sm:px-6 overflow-hidden">
        {/* Glow ambient background aura */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[110px] pointer-events-none opacity-25"
          style={{ backgroundColor: accent }}
        />
        {/* Micro-dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3.5 py-1 text-xs font-mono font-semibold text-slate-300 shadow-inner">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{ backgroundColor: accent }}
            />
            <span>{isUMKM ? "PREMIUM STOREFRONT // EDISI TERBATAS" : "EXCLUSIVE ACCESS // TICKET REGISTRATION"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] uppercase">
            {data.title || "Nama Event / Produk"}
          </h1>

          {data.description && (
            <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed whitespace-pre-line font-normal">
              {data.description}
            </p>
          )}

          {/* Banner Image if available */}
          {data.bannerUrl && (
            <div className="mt-6 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black max-h-72 w-full relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.bannerUrl}
                alt={data.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>
          )}
        </div>
      </header>

      {/* Main Content (Mobile-first max-w-xl) */}
      <main className="max-w-xl mx-auto px-4 py-8 space-y-5">
        {/* Tech Bento Spec Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.schedule && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-inner flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                {isUMKM ? "[ ESTIMASI / PO ]" : "[ JADWAL ACARA ]"}
              </span>
              <div className="mt-2 text-sm font-bold text-white leading-snug">
                {data.schedule}
              </div>
            </div>
          )}

          {data.location && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-inner flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                {isUMKM ? "[ ASAL PENGIRIMAN ]" : "[ LOKASI VENUE ]"}
              </span>
              <div className="mt-2 text-sm font-bold text-white leading-snug">
                {data.location}
              </div>
            </div>
          )}

          {data.price && (
            <div
              className="rounded-2xl border bg-slate-950 p-4 shadow-inner flex flex-col justify-between"
              style={{ borderColor: `${accent}40` }}
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                {isUMKM ? "[ HARGA UNIT ]" : "[ BIAYA TIKET ]"}
              </span>
              <div
                className="mt-2 text-base font-black leading-snug"
                style={{ color: accent }}
              >
                {data.price}
              </div>
            </div>
          )}
        </div>

        {/* High-Contrast Form Box */}
        <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 sm:p-7 shadow-2xl relative overflow-hidden">
          {/* Subtle top indicator bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: accent }}
          />

          <div className="border-b border-slate-800/80 pb-4 mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight uppercase font-mono">
                {isUMKM ? "> FORM PEMESANAN DIRECT" : "> REGISTRASI PESERTA"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isUMKM
                  ? "Selesaikan formulir untuk rekap pesanan ke WhatsApp resmi."
                  : "Input data diri Anda. Tiket & konfirmasi otomatis diterbitkan."}
              </p>
            </div>
            <Zap className="h-5 w-5 text-amber-400 shrink-0" />
          </div>

          {submittedData ? (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  {isUMKM ? "ORDER BERHASIL DICATAT" : "REGISTRASI BERHASIL"}
                </h3>
                <div className="mt-2 inline-block rounded-xl bg-slate-900 px-4 py-1.5 font-mono text-xs font-bold text-emerald-400 border border-slate-800">
                  REF: #{submittedData.code}
                </div>
              </div>

              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed font-mono">
                Data telah tersimpan di sistem. Klik tombol hijau di bawah untuk mengirim data langsung ke panitia/penjual.
              </p>

              <div className="pt-2">
                <a
                  href={submittedData.waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-xl hover:bg-emerald-500 transition-all font-mono"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span>KONFIRMASI WHATSAPP →</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setFormData({});
                }}
                className="mt-3 text-xs font-mono text-slate-400 hover:text-white underline"
              >
                [ + Isi Formulir Baru ]
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="flex items-center gap-2.5 rounded-xl bg-rose-950/80 p-3.5 text-xs text-rose-300 border border-rose-800 font-mono">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {fields.length === 0 ? (
                <p className="text-xs text-slate-500 font-mono italic py-2">
                  // Tidak ada field pendaftaran aktif.
                </p>
              ) : (
                fields.map((field, idx) => {
                  const key = field.id || field.label;
                  const value = formData[key] || "";

                  return (
                    <div key={idx} className="space-y-1.5">
                      <label className="block text-xs font-mono font-semibold text-slate-300">
                        {field.label}
                        {field.required && (
                          <span className="text-rose-400 ml-1">*</span>
                        )}
                      </label>

                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full min-h-[46px] rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                        >
                          <option value="">-- Pilih opsi --</option>
                          {field.options
                            ?.split(",")
                            .map((opt) => opt.trim())
                            .filter(Boolean)
                            .map((opt, optIdx) => (
                              <option key={optIdx} value={opt} className="bg-slate-900 text-white">
                                {opt}
                              </option>
                            ))}
                        </select>
                      ) : field.type === "file" ? (
                        <div className="space-y-2">
                          <label className="flex flex-col items-center justify-center w-full min-h-[110px] border-2 border-dashed border-slate-800 hover:border-slate-600 rounded-2xl cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-all p-3.5">
                            <input
                              type="file"
                              accept="image/*"
                              required={field.required && !value}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const img = new Image();
                                  img.onload = () => {
                                    const canvas = document.createElement("canvas");
                                    const MAX_WIDTH = 900;
                                    const scaleSize = MAX_WIDTH / img.width;
                                    const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
                                    const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;
                                    canvas.width = width;
                                    canvas.height = height;
                                    const ctx = canvas.getContext("2d");
                                    if (ctx) {
                                      ctx.drawImage(img, 0, 0, width, height);
                                      const compressed = canvas.toDataURL("image/jpeg", 0.7);
                                      handleInputChange(key, compressed);
                                    }
                                  };
                                  img.src = event.target?.result as string;
                                };
                                reader.readAsDataURL(file);
                              }}
                              className="hidden"
                            />
                            {value ? (
                              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs">
                                <FileCheck className="h-5 w-5" />
                                <span>BUKTI PEMBAYARAN TERSIMPAN ✓</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-center">
                                <Upload className="h-6 w-6 text-slate-500 mb-1.5" />
                                <span className="text-xs font-mono font-bold text-slate-300">
                                  UNGGAH BUKTI STRUK / TRANSFER
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 mt-0.5">
                                  PNG, JPG (Auto-compress)
                                </span>
                              </div>
                            )}
                          </label>
                          {value && (
                            <div className="relative inline-block">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={value}
                                alt="Preview Bukti"
                                className="h-16 w-auto rounded-lg border border-slate-700 object-cover shadow-xs"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"}
                          required={field.required}
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          placeholder={`Isi ${field.label.toLowerCase()}`}
                          className="w-full min-h-[46px] rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                        />
                      )}
                    </div>
                  );
                })
              )}

              <button
                type="submit"
                disabled={submitting || fields.length === 0}
                style={{ backgroundColor: accent }}
                className="mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-black uppercase tracking-wider hover:brightness-110 active:scale-98 disabled:opacity-50 transition-all font-mono"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>MENYIMPAN DATA...</span>
                  </>
                ) : (
                  <>
                    <span>{isUMKM ? "KIRIM PESANAN SEKARANG" : "KIRIM PENDAFTARAN SEKARANG"}</span>
                    <ArrowRight className="h-4 w-4 stroke-[3]" />
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* WhatsApp Direct Inquiry */}
        {data.waNumber && (
          <section className="rounded-3xl border border-slate-800 bg-slate-950 p-5 text-center">
            <p className="text-xs font-mono text-slate-400">
              Ada pertanyaan kendala atau info khusus?
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-mono font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>CHAT ADMIN WHATSAPP</span>
            </a>
          </section>
        )}
      </main>
    </div>
  );
}
