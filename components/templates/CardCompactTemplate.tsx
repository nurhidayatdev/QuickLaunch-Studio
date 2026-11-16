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
  ShoppingBag,
  Upload,
  FileCheck,
} from "lucide-react";
import { FormFieldItem } from "../builder/FormFieldBuilder";
import { buildWhatsAppConfirmationLink } from "@/lib/whatsapp";
import { TemplatePageData } from "./ModernEventTemplate";

export default function CardCompactTemplate({
  data,
  fields = [],
  isDraft = true,
}: {
  data: TemplatePageData;
  fields?: FormFieldItem[];
  isDraft?: boolean;
}) {
  const accent = data.accentColor || "#059669"; // Emerald default for compact
  const cleanWaNumber = data.waNumber ? data.waNumber.replace(/[^0-9]/g, "") : "";
  const formattedWa = cleanWaNumber.startsWith("0")
    ? `62${cleanWaNumber.slice(1)}`
    : cleanWaNumber;

  const waLink = formattedWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(
        `Halo panitia/penjual ${data.title}, saya ingin info pemesanan/pendaftaran.`
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
        const mockCode = "QL-CARD";
        const mockWaLink = buildWhatsAppConfirmationLink(
          data.waNumber,
          data.waMessageTemplate,
          {
            event: data.title,
            nama: formData["Nama Lengkap"] || formData["Nama Pembeli"] || "Peserta Uji",
            kode: mockCode,
            tiket: formData["Kategori Tiket"] || formData["Varian / Jumlah Pesanan"] || "Paket",
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
    <div className="w-full min-h-screen bg-slate-100/90 text-slate-800 py-8 px-4 sm:px-6 font-sans">
      <main className="max-w-md mx-auto space-y-3.5">
        {/* Card 1: Hero & Media Profile */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 text-center space-y-3">
          {data.bannerUrl ? (
            <div className="rounded-2xl overflow-hidden h-36 w-full border border-slate-100 shadow-inner">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.bannerUrl}
                alt={data.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ) : (
            <div
              className="h-24 w-full rounded-2xl flex items-center justify-center text-white font-bold"
              style={{ background: `linear-gradient(135deg, ${accent}, #0f172a)` }}
            >
              <Sparkles className="h-6 w-6 opacity-80" />
            </div>
          )}

          <div className="space-y-1 pt-1">
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              {data.category === "produk" ? "Katalog & Pemesanan" : "Event & Pendaftaran"}
            </span>

            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {data.title || "Judul Halaman Belum Diisi"}
            </h1>

            {data.description && (
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line pt-1">
                {data.description}
              </p>
            )}
          </div>
        </section>

        {/* Card 2: Modular Bento Details Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {data.schedule && (
            <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <Calendar className="h-4 w-4 mb-2" style={{ color: accent }} />
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Jadwal</span>
                <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                  {data.schedule}
                </span>
              </div>
            </div>
          )}

          {data.location && (
            <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <MapPin className="h-4 w-4 mb-2" style={{ color: accent }} />
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">Lokasi</span>
                <span className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                  {data.location}
                </span>
              </div>
            </div>
          )}

          {data.price && (
            <div className="col-span-2 bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="p-1.5 rounded-xl shrink-0"
                  style={{ backgroundColor: `${accent}15`, color: accent }}
                >
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Biaya / Harga</span>
                  <span className="text-sm font-extrabold text-slate-900">{data.price}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                Tersedia
              </span>
            </div>
          )}
        </div>

        {/* Card 3: Compact Registration Form */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
          <div className="border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900">
              {data.category === "produk" ? "Formulir Pesanan Cepat" : "Formulir Pendaftaran"}
            </h2>
            <p className="text-[11px] text-slate-500">
              Lengkapi kolom di bawah untuk konfirmasi otomatis.
            </p>
          </div>

          {submittedData ? (
            <div className="py-4 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Data Berhasil Terkirim!
                </h3>
                <span className="inline-block mt-1 rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                  Kode: #{submittedData.code}
                </span>
              </div>

              <div className="pt-1">
                <a
                  href={submittedData.waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  <span>Konfirmasi via WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setFormData({});
                }}
                className="text-[11px] font-semibold text-slate-500 underline"
              >
                Kirim tanggapan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-left">
              {submitError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-2.5 text-xs text-red-700 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {fields.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Belum ada field pendaftaran yang ditambahkan.
                </p>
              ) : (
                fields.map((field, idx) => {
                  const key = field.id || field.label;
                  const value = formData[key] || "";

                  return (
                    <div key={idx} className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
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
                          className="w-full min-h-[42px] rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                        >
                          <option value="">-- Pilih --</option>
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
                        <div className="space-y-1.5">
                          <label className="flex flex-col items-center justify-center w-full min-h-[90px] border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-emerald-50/20 transition-all p-2.5">
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
                              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-[11px]">
                                <FileCheck className="h-4 w-4" />
                                <span>Bukti transfer terunggah ✓</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-center">
                                <Upload className="h-5 w-5 text-slate-400 mb-1" />
                                <span className="text-[11px] font-semibold text-slate-700">
                                  Unggah Bukti Bayar / Resi
                                </span>
                                <span className="text-[9px] text-slate-400">
                                  Klik untuk pilih gambar
                                </span>
                              </div>
                            )}
                          </label>
                          {value && (
                            <img
                              src={value}
                              alt="Preview"
                              className="h-14 w-auto rounded border border-slate-200 object-cover shadow-2xs"
                            />
                          )}
                        </div>
                      ) : (
                        <input
                          type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"}
                          required={field.required}
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          placeholder={`Isi ${field.label.toLowerCase()}`}
                          className="w-full min-h-[42px] rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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
                className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50 transition-opacity"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Kirim Sekarang</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Card 4: WhatsApp Chat Button */}
        {data.waNumber && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200/80 p-3 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors text-center"
          >
            <MessageCircle className="h-4 w-4 text-emerald-600" />
            <span>Chat Langsung: {data.waNumber}</span>
          </a>
        )}
      </main>
    </div>
  );
}

