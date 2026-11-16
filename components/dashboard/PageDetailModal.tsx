"use client";

import { useState } from "react";
import {
  X,
  Users,
  Eye,
  FileSpreadsheet,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Globe,
  Tag,
  ShieldCheck,
  Clock,
  Image,
} from "lucide-react";
import { buildWhatsAppConfirmationLink } from "@/lib/whatsapp";

interface SubmissionItem {
  id: string;
  data: string;
  statusSyncSheet: string;
  createdAt: string | Date;
}

interface PageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: {
    id: string;
    title: string;
    category: string;
    status: string;
    slug: string;
    viewsCount: number;
    waNumber?: string | null;
    waMessageTemplate?: string | null;
    googleSheetsWebhookUrl?: string | null;
    submissions?: SubmissionItem[];
  } | null;
}

export default function PageDetailModal({
  isOpen,
  onClose,
  page,
}: PageDetailModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);
  const [activeProofModal, setActiveProofModal] = useState<string | null>(null);

  if (!isOpen || !page) return null;

  const publicUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/p/${page.slug}`
      : `/p/${page.slug}`;

  const sampleWaLink = buildWhatsAppConfirmationLink(
    page.waNumber,
    page.waMessageTemplate,
    {
      event: page.title,
      nama: "Nama Peserta",
      kode: "QL-SAMPLE",
      tiket: "Reguler",
      kontak: "081234567890",
    }
  );

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyWa = async () => {
    try {
      await navigator.clipboard.writeText(sampleWaLink);
      setCopiedWa(true);
      setTimeout(() => setCopiedWa(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const submissions = page.submissions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 sm:p-7 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 capitalize">
                {page.category}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  page.status === "published"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {page.status === "published" ? "Published" : "Draft"}
              </span>
            </div>
            <h2 className="mt-1.5 text-lg sm:text-xl font-bold text-slate-900 line-clamp-1">
              {page.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Path: /p/{page.slug}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          {/* Stats Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-blue-50/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-700">Total Pendaftar</span>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">
                {submissions.length}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">formulir masuk</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Total Kunjungan</span>
                <Eye className="h-4 w-4 text-slate-500" />
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">
                {page.viewsCount || 0}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">tayangan halaman</p>
            </div>
          </div>

          {/* Quick Action Buttons (PRD §4.1 #6 & design.md §3.2) */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Aksi Cepat:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Google Sheets Link */}
              {page.googleSheetsWebhookUrl ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5 text-xs text-emerald-800">
                  <div className="flex items-center gap-2 truncate">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold truncate">Google Sheets Terhubung</span>
                  </div>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
                    Auto-Sync
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                    <span>Sheets belum dihubungkan</span>
                  </div>
                </div>
              )}

              {/* Copy Public Link */}
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <span>Salin Link Publik</span>
                </div>
                {copiedLink ? (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="h-3 w-3" /> Tersalin!
                  </span>
                ) : (
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>

              {/* Copy Sample WhatsApp Link */}
              <button
                onClick={handleCopyWa}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-emerald-600" />
                  <span>Salin Link WA Konfirmasi</span>
                </div>
                {copiedWa ? (
                  <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="h-3 w-3" /> Tersalin!
                  </span>
                ) : (
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>

              {/* Open Public Page */}
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-slate-600" />
                  <span>Buka Halaman Publik</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">/p/{page.slug}</span>
              </a>
            </div>
          </div>

          {/* Submission List Table (Rekap Ringkas Pendaftar) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                Rekap Pendaftar Terbaru ({submissions.length}):
              </span>
              <span className="text-[11px] text-slate-400">Menampilkan hingga 20 entri</span>
            </div>

            {submissions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                Belum ada peserta yang mendaftar di halaman ini.
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 font-semibold text-slate-600 grid grid-cols-12 gap-2 text-[11px]">
                  <span className="col-span-4">Nama & Kode</span>
                  <span className="col-span-4">Kontak / Pilihan</span>
                  <span className="col-span-2">Sync Sheets</span>
                  <span className="col-span-2 text-right">Waktu</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {submissions.map((sub, idx) => {
                    let parsed: any = {};
                    try {
                      parsed = JSON.parse(sub.data);
                    } catch (e) {}

                    const name =
                      parsed["Nama Lengkap"] ||
                      parsed["Nama Pembeli"] ||
                      parsed["Nama"] ||
                      `Pendaftar #${idx + 1}`;
                    const code = parsed["Kode Pendaftaran"] || sub.id.slice(-6);
                    const contact = parsed["Nomor WhatsApp"] || parsed["Email"] || "-";
                    const ticket =
                      parsed["Kategori Tiket"] ||
                      parsed["Pilihan Tiket / Kategori"] ||
                      "";

                    // Check if there is an uploaded proof image in parsed data
                    let proofImg: string | null = null;
                    Object.entries(parsed).forEach(([k, v]) => {
                      if (typeof v === "string" && v.startsWith("data:image/")) {
                        proofImg = v;
                      }
                    });

                    return (
                      <div
                        key={sub.id}
                        className="px-3 py-2.5 grid grid-cols-12 gap-2 items-center hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="col-span-4">
                          <span className="font-bold text-slate-900 block truncate">
                            {name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            #{code}
                          </span>
                        </div>

                        <div className="col-span-4 truncate">
                          <span className="text-slate-700 block truncate">{contact}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {ticket && (
                              <span className="text-[10px] text-blue-600 font-medium truncate">
                                {ticket}
                              </span>
                            )}
                            {proofImg && (
                              <button
                                type="button"
                                onClick={() => setActiveProofModal(proofImg)}
                                className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md hover:bg-emerald-100 font-semibold shrink-0"
                              >
                                <Image className="h-3 w-3" />
                                <span>Bukti Bayar</span>
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              sub.statusSyncSheet === "synced"
                                ? "bg-emerald-50 text-emerald-700"
                                : sub.statusSyncSheet === "failed"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {sub.statusSyncSheet}
                          </span>
                        </div>

                        <div className="col-span-2 text-right text-[10px] text-slate-400">
                          {new Date(sub.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Lightbox / Preview Bukti Pembayaran */}
      {activeProofModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative max-w-lg w-full bg-slate-900 rounded-2xl overflow-hidden p-4 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Image className="h-4 w-4 text-emerald-400" />
                Bukti Pembayaran Pendaftar
              </span>
              <button
                type="button"
                onClick={() => setActiveProofModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="py-4 flex justify-center">
              <img
                src={activeProofModal}
                alt="Bukti Transfer"
                className="max-h-[70vh] w-auto rounded-xl object-contain shadow-lg"
              />
            </div>
            <div className="text-right">
              <a
                href={activeProofModal}
                download="bukti-transfer.jpg"
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Unduh Gambar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

