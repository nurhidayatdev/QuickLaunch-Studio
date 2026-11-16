"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TemplateRenderer, { TEMPLATE_LIST } from "@/components/templates/TemplateRenderer";
import FormFieldBuilder, { FormFieldItem } from "@/components/builder/FormFieldBuilder";
import GoogleSheetsIntegration from "@/components/builder/GoogleSheetsIntegration";
import PublishSuccessModal from "@/components/builder/PublishSuccessModal";
import { DEFAULT_WA_TEMPLATE, fillWhatsAppTemplate } from "@/lib/whatsapp";
import {
  ArrowLeft,
  Save,
  Smartphone,
  Monitor,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  MessageCircle,
  FileText,
  AlertCircle,
  ExternalLink,
  Loader2,
  Eye,
  Sliders,
  ListTodo,
  FileSpreadsheet,
  Globe,
  Share2,
  Sparkles,
} from "lucide-react";

const ACCENT_COLORS = [
  { name: "Biru Modern", hex: "#2563eb" },
  { name: "Indigo Elektrik", hex: "#4f46e5" },
  { name: "Emerald Segar", hex: "#059669" },
  { name: "Amber Hangat", hex: "#d97706" },
  { name: "Rose Elegan", hex: "#e11d48" },
  { name: "Slate Minimalis", hex: "#334155" },
];

export default function BuilderEditor({
  initialPage,
  user,
}: {
  initialPage: any;
  user: any;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "preview" ? "preview" : "edit";

  const [activeTab, setActiveTab] = useState<"edit" | "preview">(initialTab);
  const [formSection, setFormSection] = useState<number>(1);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [pageStatus, setPageStatus] = useState<string>(initialPage.status || "draft");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [fields, setFields] = useState<FormFieldItem[]>(initialPage.fields || []);

  const [formData, setFormData] = useState({
    title: initialPage.title || "",
    category: initialPage.category || "event",
    templateId: initialPage.templateId || "modern-event",
    description: initialPage.description || "",
    schedule: initialPage.schedule || "",
    location: initialPage.location || "",
    price: initialPage.price || "",
    bannerUrl: initialPage.bannerUrl || "",
    waNumber: initialPage.waNumber || "",
    accentColor: initialPage.accentColor || "#2563eb",
    slug: initialPage.slug || "",
    googleSheetsWebhookUrl: initialPage.googleSheetsWebhookUrl || "",
    waMessageTemplate: initialPage.waMessageTemplate || DEFAULT_WA_TEMPLATE,
  });

  const handlePublishToggle = async () => {
    const isCurrentlyPublished = pageStatus === "published";
    const targetStatus = isCurrentlyPublished ? "draft" : "published";

    if (
      isCurrentlyPublished &&
      !confirm("Tarik kembali halaman ke status Draf? Halaman tidak akan bisa dibuka lagi oleh publik.")
    ) {
      return;
    }

    setPublishing(true);
    try {
      // Auto-save form content first
      await fetch(`/api/pages/${initialPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const res = await fetch(`/api/pages/${initialPage.id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memperbarui status publikasi");
      }

      setPageStatus(targetStatus);
      if (targetStatus === "published") {
        setShowSuccessModal(true);
      } else {
        alert("Halaman berhasil ditarik kembali ke draf.");
      }
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Terjadi kesalahan saat mempublikasikan");
    } finally {
      setPublishing(false);
    }
  };

  const handleSave = async (silent = false) => {
    if (!silent) setSaving(true);
    try {
      const res = await fetch(`/api/pages/${initialPage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan");
      }

      setSaveStatus("Tersimpan sebagai Draft");
      setTimeout(() => setSaveStatus(""), 3000);
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan perubahan");
    } finally {
      if (!silent) setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Builder Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                  {formData.title || "Halaman Baru"}
                </h1>
                {pageStatus === "published" ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Terpublikasi
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                    Draft
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 hidden sm:flex">
                <span>Path: /p/{formData.slug}</span>
                {pageStatus === "published" && (
                  <a
                    href={`/p/${formData.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-0.5 font-medium ml-1"
                  >
                    (Buka Link <ExternalLink className="h-2.5 w-2.5" />)
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus && (
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 hidden md:flex">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {saveStatus}
              </span>
            )}

            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex min-h-[36px] items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === "edit"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex min-h-[36px] items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === "preview"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              ) : (
                <Save className="h-4 w-4 text-slate-600" />
              )}
              <span>Simpan Draft</span>
            </button>

            {/* Publish & Status Action Buttons */}
            {pageStatus === "published" ? (
              <div className="flex items-center gap-1.5">
                <a
                  href={`/p/${formData.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-sm"
                >
                  <Globe className="h-4 w-4 text-emerald-600" />
                  <span className="hidden sm:inline">Lihat Publik</span>
                </a>
                <button
                  onClick={handlePublishToggle}
                  disabled={publishing}
                  className="flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                  title="Tarik kembali ke status Draf"
                >
                  {publishing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                  ) : (
                    "Tarik ke Draf"
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handlePublishToggle}
                disabled={publishing}
                className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors disabled:opacity-50"
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Mempublikasikan...</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    <span>Publikasikan Halaman</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Success Modal */}
      <PublishSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        slug={formData.slug}
        pageTitle={formData.title}
      />

      {/* Main Builder Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Editor (Visible on edit tab on mobile, always visible on large screens) */}
        <div
          className={`lg:col-span-6 flex flex-col space-y-4 ${
            activeTab === "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Sub-steps Navigation */}
          <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-white p-1.5 border border-slate-200 shadow-sm text-xs font-semibold">
            <button
              onClick={() => setFormSection(1)}
              className={`flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                formSection === 1
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              1. Info Dasar
            </button>
            <button
              onClick={() => setFormSection(2)}
              className={`flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                formSection === 2
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              2. Jadwal & Biaya
            </button>
            <button
              onClick={() => setFormSection(3)}
              className={`flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                formSection === 3
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              3. Tampilan & Warna
            </button>
            <button
              onClick={() => setFormSection(4)}
              className={`flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                formSection === 4
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <ListTodo className="h-3.5 w-3.5" />
              4. Susun Form
            </button>
            <button
              onClick={() => setFormSection(5)}
              className={`flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                formSection === 5
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              5. Google Sheets
            </button>
            <button
              onClick={() => setFormSection(6)}
              className={`flex min-h-[40px] items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                formSection === 6
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              6. Kontak WA
            </button>
          </div>

          {/* Form Content Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
            {/* SECTION 1: Info Dasar */}
            {formSection === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  1. Informasi Dasar
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Judul Acara / Nama Produk *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Contoh: Seminar Nasional AI 2026"
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kategori Halaman
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="event">Event & Pendaftaran</option>
                    <option value="produk">Produk / Pemesanan UMKM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Deskripsi Lengkap
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Tuliskan latar belakang, benefit peserta, pembicara, atau rincian produk..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Custom Slug URL
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 px-3 py-1.5 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="text-xs text-slate-400 font-medium">quicklaunch.id/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        })
                      }
                      placeholder="seminar-ai-2026"
                      className="w-full min-h-[36px] bg-transparent pl-1 text-sm text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: Jadwal & Lokasi / Harga */}
            {formSection === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  2. Jadwal, Lokasi & Biaya
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Waktu / Jadwal Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    placeholder="Contoh: Sabtu, 28 November 2026 • 09:00 - 15:00 WIB"
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Lokasi / Tempat
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Contoh: Gedung Rektorat Lt. 3 / Zoom Online"
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Biaya / Tiket / Harga
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="Contoh: Gratis / Early Bird Rp35.000 / Reguler Rp50.000"
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            )}

            {/* SECTION 3: Tampilan & Warna */}
            {formSection === 3 && (
              <div className="space-y-5">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  3. Pilihan Template & Desain
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Format Desain Template (3 Pilihan)
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {TEMPLATE_LIST.map((tmpl) => {
                      const isSelected = (formData.templateId || "modern-event") === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, templateId: tmpl.id })
                          }
                          className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                            isSelected
                              ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30"
                              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "border-blue-600 bg-blue-600"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {tmpl.name}
                              </span>
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                {tmpl.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {tmpl.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    URL Gambar Banner (Opsional)
                  </label>
                  <input
                    type="url"
                    value={formData.bannerUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, bannerUrl: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gunakan link gambar langsung (rasio 16:9 disarankan). Jika kosong, header akan memakai warna aksen atau gradasi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Warna Aksen Halaman (Palet Terkurasi)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {ACCENT_COLORS.map((c) => {
                      const isSelected = formData.accentColor === c.hex;
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, accentColor: c.hex })
                          }
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? "border-slate-800 bg-slate-50 ring-2 ring-slate-800"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <span
                            className="h-5 w-5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-xs font-medium text-slate-800 line-clamp-1">
                            {c.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: Susun Form Pendaftaran (Tahap 2) */}
            {formSection === 4 && (
              <FormFieldBuilder
                pageId={initialPage.id}
                initialFields={fields}
                onFieldsChange={setFields}
              />
            )}

            {/* SECTION 5: Integrasi Google Sheets (Tahap 4) */}
            {formSection === 5 && (
              <GoogleSheetsIntegration
                pageId={initialPage.id}
                initialWebhookUrl={formData.googleSheetsWebhookUrl}
                onUrlChange={(url) =>
                  setFormData({ ...formData, googleSheetsWebhookUrl: url })
                }
              />
            )}

            {/* SECTION 6: Kontak WhatsApp & Generator Template Konfirmasi (Tahap 5) */}
            {formSection === 6 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                  6. Kontak & Template Konfirmasi WhatsApp
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nomor WhatsApp Narahubung / Panitia *
                  </label>
                  <input
                    type="text"
                    value={formData.waNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, waNumber: e.target.value })
                    }
                    placeholder="081234567890 atau 6281234567890"
                    className="w-full min-h-[44px] rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nomor tujuan chat saat peserta mengklik tombol "Konfirmasi via WhatsApp".
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Template Pesan WhatsApp Otomatis
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Klik variabel untuk menyisipkan:
                    </span>
                  </div>

                  {/* Variable Tag Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { tag: "{nama}", label: "Nama Peserta" },
                      { tag: "{event}", label: "Nama Event" },
                      { tag: "{kode}", label: "Kode Unik (QL-...)" },
                      { tag: "{tiket}", label: "Pilihan Tiket/Paket" },
                      { tag: "{kontak}", label: "Nomor WA Peserta" },
                    ].map((v) => (
                      <button
                        key={v.tag}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            waMessageTemplate: `${formData.waMessageTemplate} ${v.tag}`,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <code>{v.tag}</code>
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={formData.waMessageTemplate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        waMessageTemplate: e.target.value,
                      })
                    }
                    placeholder={DEFAULT_WA_TEMPLATE}
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Live Message Sample Preview */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Contoh Tampilan Pesan yang Diterima Panitia:</span>
                  </div>
                  <div className="rounded-lg bg-white p-2.5 text-xs text-slate-700 border border-emerald-100 italic leading-relaxed whitespace-pre-line shadow-xs">
                    "
                    {fillWhatsAppTemplate(formData.waMessageTemplate, {
                      event: formData.title || "Seminar Nasional AI 2026",
                      nama: "Ahmad Subagio",
                      kode: "QL-9482",
                      tiket: "Tiket VIP",
                      kontak: "081234567890",
                    })}
                    "
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons between sections */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={formSection === 1}
                onClick={() => setFormSection((s) => Math.max(1, s - 1))}
                className="flex min-h-[40px] items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-30"
              >
                Sebelumnya
              </button>

              <div className="flex items-center gap-2">
                {formSection < 6 ? (
                  <button
                    type="button"
                    onClick={() => setFormSection((s) => Math.min(6, s + 1))}
                    className="flex min-h-[40px] items-center rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Lanjut Bagian {formSection + 1}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSave(false)}
                    className="flex min-h-[40px] items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <Save className="h-3.5 w-3.5" />
                    Simpan Semua Perubahan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview Frame (design.md §3.1 & §4) */}
        <div
          className={`lg:col-span-6 flex flex-col items-center ${
            activeTab === "edit" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Device Toggle Header */}
          <div className="w-full flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-blue-600" />
              Live Preview
            </span>

            <div className="flex items-center rounded-xl bg-white p-1 border border-slate-200 shadow-sm text-xs">
              <button
                onClick={() => setPreviewDevice("mobile")}
                className={`flex min-h-[36px] items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                  previewDevice === "mobile"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile Bezel
              </button>
              <button
                onClick={() => setPreviewDevice("desktop")}
                className={`flex min-h-[36px] items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                  previewDevice === "desktop"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                Full Width
              </button>
            </div>
          </div>

          {/* Preview Viewport */}
          {previewDevice === "mobile" ? (
            <div className="w-full max-w-[390px] rounded-[40px] border-[10px] border-slate-900 bg-white shadow-2xl overflow-hidden min-h-[640px] max-h-[750px] flex flex-col relative ring-1 ring-slate-900/10">
              {/* Phone Speaker & Camera Notch */}
              <div className="w-full h-6 bg-slate-900 flex items-center justify-center">
                <div className="h-4 w-28 bg-slate-800 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-slate-700" />
                </div>
              </div>

              {/* Scrollable Screen */}
              <div className="flex-1 overflow-y-auto">
                <TemplateRenderer
                  templateId={formData.templateId}
                  data={{ ...formData, id: initialPage.id }}
                  fields={fields}
                  isDraft={true}
                />
              </div>

              {/* Phone Home Bar */}
              <div className="w-full h-4 bg-slate-900 flex items-center justify-center">
                <div className="h-1 w-20 bg-slate-600 rounded-full" />
              </div>
            </div>
          ) : (
            <div className="w-full rounded-2xl border border-slate-300 bg-white shadow-lg overflow-hidden max-h-[750px] overflow-y-auto">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[11px] text-slate-500 font-mono bg-white px-3 py-0.5 rounded-md border border-slate-200">
                    quicklaunch.id/{formData.slug}
                  </span>
                </div>
              </div>
              <TemplateRenderer
                templateId={formData.templateId}
                data={{ ...formData, id: initialPage.id }}
                fields={fields}
                isDraft={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
