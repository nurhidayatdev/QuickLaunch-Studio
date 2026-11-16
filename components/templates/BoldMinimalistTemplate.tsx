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
  const accent = data.accentColor || "#2563eb";
  const cleanWaNumber = data.waNumber ? data.waNumber.replace(/[^0-9]/g, "") : "";
  const formattedWa = cleanWaNumber.startsWith("0")
    ? `62${cleanWaNumber.slice(1)}`
    : cleanWaNumber;

  const waLink = formattedWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(
        `Halo panitia ${data.title}, saya ingin bertanya mengenai info acara ini.`
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
        const mockCode = "QL-BOLD";
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
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 pb-20 font-sans">
      {/* Bold Dark Hero Section */}
      <header className="relative w-full border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 px-4 pt-10 pb-8 text-center sm:px-6 sm:pt-14 sm:pb-12">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <span
              className="h-2 w-2 rounded-full animate-ping"
              style={{ backgroundColor: accent }}
            />
            <span>{data.category === "produk" ? "Produk / Penawaran" : "Event Resmi"}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {data.title || "Judul Halaman Belum Diisi"}
          </h1>

          {data.description && (
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed whitespace-pre-line">
              {data.description}
            </p>
          )}

          {/* Banner Image if available */}
          {data.bannerUrl && (
            <div className="mt-5 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl max-h-64 sm:max-h-80 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.bannerUrl}
                alt={data.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content (Mobile-first max-w-xl) */}
      <main className="max-w-xl mx-auto px-4 py-6 space-y-4">
        {/* Floating Info Pills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {data.schedule && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 flex items-center gap-3">
              <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="truncate">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Jadwal</span>
                <span className="text-xs font-bold text-white truncate block">{data.schedule}</span>
              </div>
            </div>
          )}

          {data.location && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <div className="truncate">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Lokasi</span>
                <span className="text-xs font-bold text-white truncate block">{data.location}</span>
              </div>
            </div>
          )}

          {data.price && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 flex items-center gap-3">
              <Tag className="h-4 w-4 shrink-0 text-emerald-400" />
              <div className="truncate">
                <span className="block text-[10px] text-slate-500 uppercase font-semibold">Biaya</span>
                <span className="text-xs font-bold text-emerald-400 truncate block">{data.price}</span>
              </div>
            </div>
          )}
        </div>

        {/* Registration Form Box */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white tracking-tight">
              {data.category === "produk" ? "Formulir Pemesanan" : "Formulir Pendaftaran"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Isi data berikut untuk menyelesaikan pendaftaran Anda.
            </p>
          </div>

          {submittedData ? (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Pendaftaran Berhasil Dikirim!
                </h3>
                <div className="mt-1.5 inline-block rounded-lg bg-slate-800 px-3 py-1 font-mono text-xs font-bold text-emerald-400 border border-slate-700">
                  Kode: #{submittedData.code}
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Data Anda telah tercatat dengan aman. Silakan klik tombol di bawah untuk mengirim konfirmasi langsung ke WhatsApp panitia.
              </p>

              <div className="pt-2">
                <a
                  href={submittedData.waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition-colors"
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
                className="mt-3 text-xs font-semibold text-slate-400 hover:text-white underline"
              >
                Kirim tanggapan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-900/30 p-3 text-xs text-red-300 border border-red-800">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {fields.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">
                  Belum ada field pendaftaran yang ditambahkan.
                </p>
              ) : (
                fields.map((field, idx) => {
                  const key = field.id || field.label;
                  const value = formData[key] || "";

                  return (
                    <div key={idx} className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        {field.label}
                        {field.required && (
                          <span className="text-red-400 ml-0.5">*</span>
                        )}
                      </label>

                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full min-h-[44px] rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                        >
                          <option value="">-- Pilih salah satu --</option>
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
                          <label className="flex flex-col items-center justify-center w-full min-h-[100px] border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl cursor-pointer bg-slate-800/80 hover:bg-slate-800 transition-all p-3">
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
                              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                                <FileCheck className="h-5 w-5" />
                                <span>Bukti transfer berhasil diunggah ✓</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-center">
                                <Upload className="h-6 w-6 text-slate-400 mb-1" />
                                <span className="text-xs font-semibold text-slate-200">
                                  Klik untuk unggah bukti pembayaran
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5">
                                  Format gambar (JPG, PNG)
                                </span>
                              </div>
                            )}
                          </label>
                          {value && (
                            <div className="relative inline-block">
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
                          placeholder={`Masukkan ${field.label.toLowerCase()}`}
                          className="w-full min-h-[44px] rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
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
                className="mt-3 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <span>Submit & Lanjutkan</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* WhatsApp Footer Contact */}
        {data.waNumber && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-center">
            <span className="text-xs text-slate-400">Punya kendala pendaftaran? </span>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <MessageCircle className="h-3 w-3" />
              Chat Panitia ({data.waNumber})
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

