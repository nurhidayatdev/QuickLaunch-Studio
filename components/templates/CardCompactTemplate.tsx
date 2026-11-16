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
  Package,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Store,
  BadgeCheck,
} from "lucide-react";
import { FormFieldItem } from "../builder/FormFieldBuilder";
import { buildWhatsAppConfirmationLink } from "@/lib/whatsapp";
import { TemplatePageData } from "./ModernEventTemplate";
import { getFontClassName } from "@/lib/font-config";

export default function CardCompactTemplate({
  data,
  fields = [],
  isDraft = true,
}: {
  data: TemplatePageData;
  fields?: FormFieldItem[];
  isDraft?: boolean;
}) {
  const isUMKM = data.category === "produk";
  const accent = data.accentColor || (isUMKM ? "#f59e0b" : "#6366f1");
  const cleanWaNumber = data.waNumber ? data.waNumber.replace(/[^0-9]/g, "") : "";
  const formattedWa = cleanWaNumber.startsWith("0")
    ? `62${cleanWaNumber.slice(1)}`
    : cleanWaNumber;

  const waLink = formattedWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(
        isUMKM
          ? `Halo penjual ${data.title}, saya ingin memesan/tanya stok produk ini.`
          : `Halo panitia ${data.title}, saya ingin info pendaftaran acara ini.`
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
        const mockCode = "BT-9920";
        const mockWaLink = buildWhatsAppConfirmationLink(
          data.waNumber,
          data.waMessageTemplate,
          {
            event: data.title,
            nama: formData["Nama Lengkap"] || formData["Nama Pembeli"] || "Pengguna",
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
    <div className={`min-h-screen bg-slate-100 text-slate-800 p-3.5 sm:p-6 pb-20 ${getFontClassName(data.fontFamily)}`}>
      <main className="max-w-md mx-auto space-y-3.5">
        {/* Card 1: Top Bento Profile / Hero */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-lg shadow-slate-200/50 space-y-4">
          {data.bannerUrl ? (
            <div className="relative h-44 sm:h-52 w-full rounded-2xl overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.bannerUrl}
                alt={data.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 border border-white/60 shadow-xs flex items-center gap-1.5">
                {isUMKM ? <Store className="h-3.5 w-3.5 text-amber-600" /> : <Calendar className="h-3.5 w-3.5 text-indigo-600" />}
                <span>{isUMKM ? "Toko / Merchant Terverifikasi" : "Event Resmi"}</span>
              </div>
            </div>
          ) : (
            <div
              className="h-28 w-full rounded-2xl flex items-center justify-between px-5 text-white shadow-inner relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${accent}, #1e293b)` }}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">
                  {isUMKM ? "KATALOG PRODUK & JASA" : "LANDING PAGE EVENT"}
                </span>
                <h2 className="text-base font-extrabold text-white mt-0.5 line-clamp-1">
                  {data.title || "QuickLaunch"}
                </h2>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                {isUMKM ? <ShoppingBag className="h-6 w-6 text-white" /> : <Sparkles className="h-6 w-6 text-white" />}
              </div>
            </div>
          )}

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${accent}18`, color: accent }}
              >
                {isUMKM ? "Katalog & Order Instan" : "Pendaftaran Peserta"}
              </span>

              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Terverifikasi</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-950 tracking-tight leading-snug">
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
        <div className="grid grid-cols-2 gap-3">
          {data.schedule && (
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div
                className="h-8 w-8 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${accent}15`, color: accent }}
              >
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">
                  {isUMKM ? "Estimasi / Jam Kerja" : "Waktu & Tanggal"}
                </span>
                <span className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mt-0.5">
                  {data.schedule}
                </span>
              </div>
            </div>
          )}

          {data.location && (
            <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div
                className="h-8 w-8 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${accent}15`, color: accent }}
              >
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[9px] uppercase font-bold text-slate-400">
                  {isUMKM ? "Asal Pengiriman" : "Lokasi / Link"}
                </span>
                <span className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mt-0.5">
                  {data.location}
                </span>
              </div>
            </div>
          )}

          {data.price && (
            <div className="col-span-2 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border"
                  style={{ backgroundColor: `${accent}15`, borderColor: `${accent}30`, color: accent }}
                >
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">
                    {isUMKM ? "Harga Resmi" : "Biaya Tiket"}
                  </span>
                  <span className="text-base font-black text-slate-950 block mt-0.5">{data.price}</span>
                </div>
              </div>

              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                {isUMKM ? "Stok Siap" : "Seat Tersedia"}
              </span>
            </div>
          )}
        </div>

        {/* Card 3: Compact Registration / Order Form */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/60 border border-slate-200/90 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-950">
              {isUMKM ? "Formulir Pemesanan Cepat" : "Formulir Registrasi Cepat"}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isUMKM ? "Kirim detail pesanan Anda langsung ke penjual." : "Isi biodata untuk mendapatkan tiket resmi."}
            </p>
          </div>

          {submittedData ? (
            <div className="py-4 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isUMKM ? "Data Pesanan Terkirim!" : "Pendaftaran Berhasil!"}
                </h3>
                <span className="inline-block mt-1.5 rounded-lg bg-slate-100 px-3 py-1 font-mono text-xs font-bold text-slate-700 border border-slate-200">
                  Kode: #{submittedData.code}
                </span>
              </div>

              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Data Anda telah tersimpan rapi. Klik tombol WhatsApp untuk menyelesaikan pemesanan.
              </p>

              <div className="pt-2">
                <a
                  href={submittedData.waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 fill-current" />
                  <span>Kirim ke WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmittedData(null);
                  setFormData({});
                }}
                className="text-[11px] font-semibold text-slate-500 underline block mx-auto mt-2"
              >
                {isUMKM ? "Beli pesanan lagi" : "Daftarkan nama lain"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {submitError && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {fields.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Belum ada kolom isian yang diatur oleh pengelola.
                </p>
              ) : (
                fields.map((field, idx) => {
                  const key = field.id || field.label;
                  const value = formData[key] || "";

                  return (
                    <div key={idx} className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-800">
                        {field.label}
                        {field.required && (
                          <span className="text-rose-500 ml-0.5">*</span>
                        )}
                      </label>

                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full min-h-[44px] rounded-2xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
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
                        <div className="space-y-1.5">
                          <label className="flex flex-col items-center justify-center w-full min-h-[96px] border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-emerald-50/20 transition-all p-3">
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
                              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                                <FileCheck className="h-4 w-4" />
                                <span>Bukti transfer terlampir ✓</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-center">
                                <Upload className="h-5 w-5 text-slate-400 mb-1" />
                                <span className="text-xs font-bold text-slate-700">
                                  Unggah Bukti Bayar / Resi
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  Format gambar JPG/PNG
                                </span>
                              </div>
                            )}
                          </label>
                          {value && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={value}
                              alt="Preview"
                              className="h-14 w-auto rounded-lg border border-slate-200 object-cover shadow-2xs"
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
                          className="w-full min-h-[44px] rounded-2xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-100"
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
                className="mt-3 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black text-white shadow-md hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all uppercase tracking-wider"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses Data...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{isUMKM ? "Kirim Pesanan" : "Kirim Formulir"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* WhatsApp Card */}
        {data.waNumber && (
          <section className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Tanya Panitia / Penjual</h4>
                <p className="text-[10px] text-slate-500">Respon cepat via WhatsApp</p>
              </div>
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[36px] items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-slate-800 shrink-0"
            >
              <span>Chat</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          </section>
        )}
      </main>
    </div>
  );
}
