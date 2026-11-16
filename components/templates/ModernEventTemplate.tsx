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
  Share2,
  Upload,
  FileCheck,
} from "lucide-react";
import { FormFieldItem } from "../builder/FormFieldBuilder";
import { buildWhatsAppConfirmationLink } from "@/lib/whatsapp";

export interface TemplatePageData {
  id?: string;
  title: string;
  description?: string | null;
  schedule?: string | null;
  location?: string | null;
  price?: string | null;
  bannerUrl?: string | null;
  waNumber?: string | null;
  waMessageTemplate?: string | null;
  accentColor?: string;
  category?: string;
}

export default function ModernEventTemplate({
  data,
  fields = [],
  isDraft = true,
}: {
  data: TemplatePageData;
  fields?: FormFieldItem[];
  isDraft?: boolean;
}) {
  const accent = data.accentColor || "#2563eb";
  const cleanWaNumber = data.waNumber ? data.waNumber.replace(/[^0-9]/g, "") : "";
  const formattedWa = cleanWaNumber.startsWith("0")
    ? `62${cleanWaNumber.slice(1)}`
    : cleanWaNumber;

  const waLink = formattedWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(
        `Halo panitia ${data.title}, saya ingin bertanya mengenai info event ini.`
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
        // Mock submission in sandbox preview
        await new Promise((res) => setTimeout(res, 600));
        const mockCode = "QL-8899";
        const mockWaLink = buildWhatsAppConfirmationLink(
          data.waNumber,
          data.waMessageTemplate,
          {
            event: data.title,
            nama: formData["Nama Lengkap"] || formData["Nama"] || "Peserta Uji",
            kode: mockCode,
            tiket: formData["Kategori Tiket"] || "Reguler",
            kontak: formData["Nomor WhatsApp"] || "",
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

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || "Gagal mengirim formulir");
      }

      setSubmittedData({
        code: resJson.registrationCode || "QL-SUKSES",
        waLink: resJson.waConfirmationLink || waLink,
      });
    } catch (err: any) {
      setSubmitError(err.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Banner / Header */}
      <div className="relative w-full overflow-hidden bg-slate-900 text-white">
        {data.bannerUrl ? (
          <div className="relative h-48 sm:h-72 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.bannerUrl}
              alt={data.title}
              className="h-full w-full object-cover opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          </div>
        ) : (
          <div
            className="h-44 sm:h-56 w-full flex items-center justify-center p-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${accent}dd, #0f172a)`,
            }}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                {data.category === "produk" ? "Produk / UMKM" : "Official Event Page"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Container (Mobile-first max-w-lg) */}
      <main className="max-w-xl mx-auto px-4 -mt-10 sm:-mt-14 relative z-10 space-y-4">
        {/* Title & Description Card */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div
            className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ backgroundColor: `${accent}15`, color: accent }}
          >
            {data.category === "produk" ? "Pemesanan Produk" : "Pendaftaran Event"}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            {data.title || "Judul Halaman Belum Diisi"}
          </h1>

          {data.description && (
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          )}
        </section>

        {/* Event Key Info Grid */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-3.5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Detail Informasi
          </h2>

          {data.schedule && (
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-xl shrink-0 mt-0.5"
                style={{ backgroundColor: `${accent}15`, color: accent }}
              >
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400">Waktu / Jadwal</span>
                <span className="text-sm font-semibold text-slate-800">{data.schedule}</span>
              </div>
            </div>
          )}

          {data.location && (
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-xl shrink-0 mt-0.5"
                style={{ backgroundColor: `${accent}15`, color: accent }}
              >
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400">Lokasi</span>
                <span className="text-sm font-semibold text-slate-800">{data.location}</span>
              </div>
            </div>
          )}

          {data.price && (
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-xl shrink-0 mt-0.5"
                style={{ backgroundColor: `${accent}15`, color: accent }}
              >
                <Tag className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400">Biaya / Harga</span>
                <span className="text-sm font-semibold text-slate-800">{data.price}</span>
              </div>
            </div>
          )}
        </section>

        {/* Form Pendaftaran Section */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-base font-bold text-slate-900">
              {data.category === "produk" ? "Formulir Pemesanan" : "Formulir Pendaftaran"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Silakan lengkapi data di bawah ini dengan benar.
            </p>
          </div>

          {submittedData ? (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-xs">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Pendaftaran Berhasil Dikirim!
                </h3>
                <div className="mt-1.5 inline-block rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-700 border border-slate-200">
                  Kode: #{submittedData.code}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Data Anda telah tersimpan dengan aman di sistem. Silakan klik tombol di bawah untuk mengirimkan konfirmasi langsung ke WhatsApp panitia.
              </p>

              {/* Large WhatsApp CTA Button (design.md §4: hijau WA brand, ikon WA, teks jelas) */}
              <div className="pt-2">
                <a
                  href={submittedData.waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span>Konfirmasi via WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setFormData({});
                }}
                className="mt-3 text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
              >
                Kirim tanggapan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {fields.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Belum ada field pendaftaran yang ditambahkan di form builder.
                </p>
              ) : (
                fields.map((field, idx) => {
                  const key = field.id || field.label;
                  const value = formData[key] || "";

                  return (
                    <div key={idx} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-0.5">*</span>
                        )}
                      </label>

                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="">-- Pilih salah satu --</option>
                          {field.options
                            ?.split(",")
                            .map((opt) => opt.trim())
                            .filter(Boolean)
                            .map((opt, optIdx) => (
                              <option key={optIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                        </select>
                      ) : field.type === "file" ? (
                        <div className="space-y-2">
                          <label className="flex flex-col items-center justify-center w-full min-h-[100px] border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-blue-50/30 transition-all p-3">
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
                              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                                <FileCheck className="h-5 w-5" />
                                <span>Bukti pembayaran berhasil diunggah ✓</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-center">
                                <Upload className="h-6 w-6 text-slate-400 mb-1" />
                                <span className="text-xs font-semibold text-slate-700">
                                  Klik untuk unggah bukti transfer / resi bayar
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5">
                                  Format JPG, PNG (Otomatis dikompresi)
                                </span>
                              </div>
                            )}
                          </label>
                          {value && (
                            <div className="relative inline-block">
                              <img
                                src={value}
                                alt="Preview Bukti"
                                className="h-16 w-auto rounded-lg border border-slate-200 object-cover shadow-xs"
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
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                          className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Kirim Pendaftaran</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Contact WhatsApp Card */}
        {data.waNumber && (
          <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 text-center">
            <h3 className="text-sm font-semibold text-slate-800">
              Punya pertanyaan seputar acara?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hubungi langsung narahubung melalui WhatsApp.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Tanya via WhatsApp ({data.waNumber})
            </a>
          </section>
        )}
      </main>
    </div>
  );
}
