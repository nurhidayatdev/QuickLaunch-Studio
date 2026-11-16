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
  Upload,
  FileCheck,
  Clock,
  Ticket,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Users,
  Store,
  Truck,
} from "lucide-react";
import { FormFieldItem } from "../builder/FormFieldBuilder";
import { buildWhatsAppConfirmationLink } from "@/lib/whatsapp";
import { getFontClassName } from "@/lib/font-config";

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
  fontFamily?: string;
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
  const isUMKM = data.category === "produk";
  const accent = data.accentColor || (isUMKM ? "#059669" : "#2563eb");
  const cleanWaNumber = data.waNumber ? data.waNumber.replace(/[^0-9]/g, "") : "";
  const formattedWa = cleanWaNumber.startsWith("0")
    ? `62${cleanWaNumber.slice(1)}`
    : cleanWaNumber;

  const waLink = formattedWa
    ? `https://wa.me/${formattedWa}?text=${encodeURIComponent(
        isUMKM
          ? `Halo admin ${data.title}, saya ingin menanyakan rincian ketersediaan produk ini.`
          : `Halo panitia ${data.title}, saya ingin bertanya mengenai info event ini.`
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
            nama: formData["Nama Lengkap"] || formData["Nama Pembeli"] || "Pengunjung",
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
      setSubmitError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 text-slate-900 pb-16 ${getFontClassName(data.fontFamily)}`}>
      {/* Top Banner & Header Hero with Ambient Gradient */}
      <div className="relative w-full bg-slate-950 overflow-hidden">
        {data.bannerUrl ? (
          <div className="relative h-56 sm:h-72 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.bannerUrl}
              alt={data.title}
              className="h-full w-full object-cover opacity-85"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>
        ) : (
          <div
            className="h-52 sm:h-64 w-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${accent}66 0%, #090d16 100%)`,
            }}
          >
            {/* Micro grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/95 shadow-md">
              {isUMKM ? <Store className="h-3.5 w-3.5 text-emerald-400" /> : <Ticket className="h-3.5 w-3.5 text-blue-400" />}
              <span>{isUMKM ? "Official Storefront / Katalog UMKM" : "Official Event / Seminar Page"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Container (Mobile-first max-w-xl) */}
      <main className="max-w-xl mx-auto px-4 -mt-12 sm:-mt-16 relative z-10 space-y-4">
        {/* Title & Description Card */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-200/90 relative overflow-hidden">
          {/* Top colored accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: accent }}
          />

          <div className="flex items-center justify-between gap-3 mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: `${accent}15`, color: accent }}
            >
              {isUMKM ? (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  Order & Penawaran Resmi
                </>
              ) : (
                <>
                  <Calendar className="h-3.5 w-3.5" />
                  Pendaftaran Peserta
                </>
              )}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isUMKM ? "Ready Stock" : "Registrasi Dibuka"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight leading-tight">
            {data.title || "Judul Halaman Belum Diisi"}
          </h1>

          {data.description && (
            <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-3">
              {data.description}
            </p>
          )}

          {/* UMKM Specific Highlights */}
          {isUMKM && (
            <div className="mt-5 grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700">
                <Truck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Pengiriman Seluruh ID</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Transaksi Terverifikasi</span>
              </div>
            </div>
          )}
        </section>

        {/* Event / Product Key Info Grid */}
        <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 divide-y divide-slate-100">
          <div className="pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isUMKM ? "Rincian Produk & Pemesanan" : "Rincian Pelaksanaan Event"}
            </h2>
            <span className="text-[10px] text-slate-400 font-mono">ID: {data.id?.slice(-6) || "LIVE"}</span>
          </div>

          <div className="pt-3 space-y-3.5">
            {data.schedule && (
              <div className="flex items-start gap-3.5">
                <div
                  className="p-2.5 rounded-2xl shrink-0 mt-0.5 border"
                  style={{ backgroundColor: `${accent}12`, borderColor: `${accent}30`, color: accent }}
                >
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400">
                    {isUMKM ? "Jadwal Pengiriman / PO" : "Waktu & Tanggal Acara"}
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{data.schedule}</span>
                </div>
              </div>
            )}

            {data.location && (
              <div className="flex items-start gap-3.5">
                <div
                  className="p-2.5 rounded-2xl shrink-0 mt-0.5 border"
                  style={{ backgroundColor: `${accent}12`, borderColor: `${accent}30`, color: accent }}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400">
                    {isUMKM ? "Lokasi Toko / Asal Pengiriman" : "Tempat / Media Pelaksanaan"}
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{data.location}</span>
                </div>
              </div>
            )}

            {data.price && (
              <div className="flex items-start gap-3.5">
                <div
                  className="p-2.5 rounded-2xl shrink-0 mt-0.5 border"
                  style={{ backgroundColor: `${accent}12`, borderColor: `${accent}30`, color: accent }}
                >
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-400">
                    {isUMKM ? "Harga Produk" : "Biaya Tiket / Investasi"}
                  </span>
                  <span className="text-base font-extrabold text-slate-950 mt-0.5 block">{data.price}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Form Pendaftaran / Checkout Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-200/90">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h2 className="text-lg font-extrabold text-slate-900">
              {isUMKM ? "Formulir Pemesanan Langsung" : "Formulir Pendaftaran Peserta"}
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {isUMKM
                ? "Lengkapi detail data pemesan di bawah untuk memproses pesanan dan resi pengiriman."
                : "Silakan isi data diri Anda dengan benar. Bukti pendaftaran & link WA akan muncul setelah dikirim."}
            </p>
          </div>

          {submittedData ? (
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-md shadow-emerald-500/10">
                <CheckCircle2 className="h-9 w-9" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {isUMKM ? "Pesanan Anda Berhasil Dicatat!" : "Pendaftaran Berhasil Dikirim!"}
                </h3>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs">
                  <span>Kode Transaksi:</span>
                  <span className="text-blue-600">#{submittedData.code}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Data Anda telah terenkripsi dan tercatat di database panitia/penjual. Klik tombol di bawah untuk konfirmasi langsung ke WhatsApp.
              </p>

              <div className="pt-2">
                <a
                  href={submittedData.waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 active:scale-98 transition-all"
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                  <span>Kirim Konfirmasi ke WhatsApp</span>
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
                {isUMKM ? "Pesan barang lagi" : "Daftarkan peserta lain"}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="flex items-center gap-2.5 rounded-xl bg-rose-50 p-3.5 text-xs text-rose-700 border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {fields.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Belum ada kolom isian yang diaktifkan oleh pengelola halaman.
                </p>
              ) : (
                fields.map((field, idx) => {
                  const key = field.id || field.label;
                  const value = formData[key] || "";

                  return (
                    <div key={idx} className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800">
                        {field.label}
                        {field.required && (
                          <span className="text-rose-500 ml-1">*</span>
                        )}
                      </label>

                      {field.type === "select" ? (
                        <select
                          required={field.required}
                          value={value}
                          onChange={(e) => handleInputChange(key, e.target.value)}
                          className="w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
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
                          <label className="flex flex-col items-center justify-center w-full min-h-[110px] border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition-all p-3.5">
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
                              <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                                <FileCheck className="h-5 w-5" />
                                <span>Bukti transfer berhasil dilampirkan ✓</span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center text-center">
                                <Upload className="h-6 w-6 text-slate-400 mb-1.5" />
                                <span className="text-xs font-bold text-slate-700">
                                  Unggah Bukti Pembayaran / Struk Transfer
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5">
                                  Mendukung format JPG, PNG (Otomatis dikompresi)
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
                          className="w-full min-h-[46px] rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all"
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
                className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95 active:scale-98 disabled:opacity-50 transition-all"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memproses Pengiriman...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{isUMKM ? "Kirim Pesanan Sekarang" : "Kirim Formulir Pendaftaran"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Contact WhatsApp Card */}
        {data.waNumber && (
          <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 text-center">
            <h3 className="text-sm font-bold text-slate-900">
              {isUMKM ? "Butuh konsultasi produk sebelum order?" : "Punya pertanyaan seputar acara?"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Hubungi langsung pengelola melalui chat WhatsApp resmi.
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <MessageCircle className="h-4 w-4 text-emerald-400" />
              <span>Tanya Langsung ke WhatsApp</span>
            </a>
          </section>
        )}

        {/* Footer Credit & Trust */}
        <div className="pt-4 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <span>Didukung oleh QuickLaunch Studio — Sistem Landing Page Mandiri</span>
          </p>
        </div>
      </main>
    </div>
  );
}
