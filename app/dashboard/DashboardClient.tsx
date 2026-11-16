"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageDetailModal from "@/components/dashboard/PageDetailModal";
import PackageCheckoutModal from "@/components/pricing/PackageCheckoutModal";
import { ADMIN_CONTACT } from "@/lib/payment-config";
import {
  Calendar,
  Users,
  Eye,
  Edit3,
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  FileQuestion,
  Tag,
  Copy,
  BarChart3,
  FileSpreadsheet,
  Clock,
  MessageCircle,
  Sparkles,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface PageItem {
  id: string;
  title: string;
  category: string;
  templateId: string;
  status: string;
  slug: string;
  viewsCount: number;
  schedule?: string | null;
  waNumber?: string | null;
  waMessageTemplate?: string | null;
  googleSheetsWebhookUrl?: string | null;
  submissions?: any[];
  updatedAt: string | Date;
}

export default function DashboardClient({
  initialPages,
  currentUser,
  initialPendingOrder,
}: {
  initialPages: any[];
  currentUser?: any;
  initialPendingOrder?: any;
}) {
  const router = useRouter();
  const [pages, setPages] = useState<PageItem[]>(initialPages);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<PageItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(initialPendingOrder);

  const quota = currentUser?.pageQuota || 0;
  const isAdmin = currentUser?.role === "admin";
  const isQuotaFull = !isAdmin && pages.length >= quota;

  const handleCreateClick = () => {
    if (isQuotaFull) {
      setIsCheckoutOpen(true);
    } else {
      router.push("/builder");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus halaman "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal menghapus halaman");
      }

      setPages((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Terjadi kesalahan saat menghapus");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (id: string, title: string) => {
    if (isQuotaFull) {
      alert("Kuota pembuatan halaman Anda telah habis. Silakan upgrade paket terlebih dahulu.");
      setIsCheckoutOpen(true);
      return;
    }

    setDuplicatingId(id);
    try {
      const res = await fetch(`/api/pages/${id}/duplicate`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menduplikasi halaman");
      }

      setPages((prev) => [data.page, ...prev]);
      router.refresh();
      alert(`Halaman "${title}" berhasil diduplikasi menjadi "${data.page.title}".`);
    } catch (e: any) {
      alert(e.message || "Gagal menduplikasi");
    } finally {
      setDuplicatingId(null);
    }
  };

  const getWaConfirmationUrl = (order: any) => {
    if (!order) return "#";
    const text = `Halo Admin QuickLaunch, saya sudah transfer sebesar Rp${order.price?.toLocaleString("id-ID")} untuk pesanan #${order.orderNumber} (${order.packageName}) atas nama ${order.accountHolder || currentUser?.name}. Mohon segera diverifikasi ya. Terima kasih!`;
    const cleanPhone = ADMIN_CONTACT.waNumber.replace(/[^0-9]/g, "").replace(/^0/, "62");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      {/* Header Section: Title, Quota Indicator, Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard Halaman
            </h1>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs font-bold border border-amber-300">
                <ShieldCheck className="h-3 w-3" />
                Mode Admin
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            Kelola semua landing page dan pendaftaran Anda di satu tempat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quota Counter Badge */}
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold border ${
              isAdmin
                ? "bg-slate-100 text-slate-700 border-slate-200"
                : isQuotaFull
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              {isAdmin
                ? "Kuota: Tanpa Batas (Admin)"
                : `Kuota: ${pages.length} / ${quota} Halaman`}
            </span>
          </div>

          {/* Upgrade / Buy Package Button */}
          {!isAdmin && (
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-blue-600 bg-white px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 shadow-sm transition-colors"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Beli Paket</span>
            </button>
          )}

          {/* Create Page Button */}
          <button
            onClick={handleCreateClick}
            className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-sm transition-all ${
              isQuotaFull
                ? "bg-slate-800 hover:bg-slate-900"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{isQuotaFull ? "Upgrade Kuota untuk Buat Halaman" : "Buat Halaman Baru"}</span>
          </button>
        </div>
      </div>

      {/* Pending Order Banner (If any) */}
      {pendingOrder && pendingOrder.status === "pending" && (
        <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-900">
                  Pesanan #{pendingOrder.orderNumber} Sedang Diverifikasi
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-800 font-semibold px-2 py-0.2 rounded-full">
                  {pendingOrder.packageName}
                </span>
              </div>
              <p className="text-xs text-amber-700 mt-0.5">
                Admin sedang memvalidasi transfer Anda (+{pendingOrder.quotaAdded} kuota halaman). Anda dapat konfirmasi via WhatsApp untuk proses kilat.
              </p>
            </div>
          </div>

          <a
            href={getWaConfirmationUrl(pendingOrder)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm shrink-0"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Konfirmasi ke Admin
          </a>
        </div>
      )}

      {/* Empty State */}
      {pages.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-4">
            <FileQuestion className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Belum ada halaman yang dibuat
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            {isQuotaFull
              ? "Anda belum memiliki kuota pembuatan halaman. Silakan pilih paket hemat untuk mulai membuat landing page pertama Anda."
              : "Mulai buat landing page pertama Anda untuk event kampus, webinar, atau katalog produk dalam hitungan menit."}
          </p>

          <button
            onClick={handleCreateClick}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            {isQuotaFull ? (
              <>
                <CreditCard className="h-4 w-4" />
                Pilih Paket & Aktifkan Kuota
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Buat Halaman Pertama
              </>
            )}
          </button>
        </div>
      ) : (
        /* Pages Grid */
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pages.map((p) => {
            const isDraft = p.status === "draft";

            return (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Card Header: Category & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 capitalize">
                      <Tag className="h-3 w-3" />
                      {p.category}
                    </span>

                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isDraft
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {isDraft ? "Draft" : "Published"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mt-3 text-lg font-bold text-slate-900 line-clamp-1">
                    {p.title}
                  </h2>

                  {p.schedule && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 line-clamp-1">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {p.schedule}
                    </p>
                  )}

                  {/* Stats Bar */}
                  <div className="mt-4 flex items-center gap-4 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-slate-900">
                        {p.submissions?.length || 0}
                      </span>
                      <span>Pendaftar</span>
                    </div>
                    <div className="h-3 w-px bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-slate-500" />
                      <span className="font-semibold text-slate-900">
                        {p.viewsCount || 0}
                      </span>
                      <span>Views</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDetail(p)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                      title="Lihat Detail & Rekap Data"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Rekap Data</span>
                    </button>

                    <Link
                      href={`/builder/${p.id}`}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      title="Edit Halaman"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>

                    {!isDraft && (
                      <a
                        href={`/p/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-colors"
                        title="Buka Halaman Publik"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Duplicate Button */}
                    <button
                      onClick={() => handleDuplicate(p.id, p.title)}
                      disabled={duplicatingId === p.id}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                      title="Duplikasi Halaman"
                    >
                      {duplicatingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Hapus Halaman"
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail & Rekap Modal */}
      <PageDetailModal
        isOpen={Boolean(selectedDetail)}
        onClose={() => setSelectedDetail(null)}
        page={selectedDetail}
      />

      {/* Package Checkout Modal */}
      <PackageCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        currentUser={currentUser}
        onOrderSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
}
