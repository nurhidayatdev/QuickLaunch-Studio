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
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface PageItem {
  id: string;
  title: string;
  category: string;
  templateId: string;
  status: string;
  slug: string;
  viewsCount: number;
  accentColor?: string | null;
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
  const quotaPercent = isAdmin ? 100 : quota > 0 ? Math.min(100, Math.round((pages.length / quota) * 100)) : 100;

  const totalSubmissions = pages.reduce((acc, p) => acc + (p.submissions?.length || 0), 0);
  const totalViews = pages.reduce((acc, p) => acc + (p.viewsCount || 0), 0);

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
    <div className="space-y-7">
      {/* Welcome & Overview Header */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                Workspace Personal
              </span>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-bold border border-amber-300">
                  <ShieldCheck className="h-3 w-3" />
                  Administrator
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Dashboard Pengguna
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Kelola landing page, pantau pendaftar formulir, dan gandakan acara Anda dengan cepat.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Quota Progress Pill */}
            <div
              className={`flex flex-col justify-center rounded-2xl px-4 py-2.5 border transition-all ${
                isAdmin
                  ? "bg-slate-50 text-slate-700 border-slate-200"
                  : isQuotaFull
                  ? "bg-red-50/70 text-red-700 border-red-200"
                  : "bg-blue-50/60 text-blue-700 border-blue-200"
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  {isAdmin ? "Kuota Admin" : "Sisa Kuota"}
                </span>
                <span className="font-mono">
                  {isAdmin ? "Tak Terbatas" : `${pages.length} / ${quota} Hal`}
                </span>
              </div>
              {!isAdmin && (
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isQuotaFull ? "bg-red-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${quotaPercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* Buy Package Button */}
            {!isAdmin && (
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-2xl border border-blue-600 bg-white px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 shadow-sm transition-colors cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                <span>Beli Paket</span>
              </button>
            )}

            {/* Create Page Button */}
            <button
              onClick={handleCreateClick}
              className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                isQuotaFull
                  ? "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-none"
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>{isQuotaFull ? "Upgrade Kuota untuk Buat Halaman" : "Buat Halaman Baru"}</span>
            </button>
          </div>
        </div>

        {/* Global Stats Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Total Pendaftar</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{totalSubmissions} Peserta</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Eye className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Total Kunjungan</span>
              <span className="text-base font-extrabold text-slate-900 font-mono">{totalViews} Views</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Auto-Sync Sheets</span>
              <span className="text-xs font-bold text-emerald-600">Aktif & Siap Pakai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Order Banner (If any) */}
      {pendingOrder && pendingOrder.status === "pending" && (
        <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-900">
                  Pesanan #{pendingOrder.orderNumber} Sedang Diverifikasi Admin
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {pendingOrder.packageName}
                </span>
              </div>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Admin sedang memvalidasi transfer Anda (+{pendingOrder.quotaAdded} kuota halaman). Anda dapat konfirmasi via WhatsApp untuk verifikasi kilat.
              </p>
            </div>
          </div>

          <a
            href={getWaConfirmationUrl(pendingOrder)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm shrink-0 transition-all hover:scale-102"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Konfirmasi ke Admin</span>
          </a>
        </div>
      )}

      {/* Empty State */}
      {pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-14 text-center shadow-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 mb-4 shadow-sm shadow-blue-500/10">
            <FileQuestion className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Belum ada landing page yang dibuat
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-slate-500 leading-relaxed">
            {isQuotaFull
              ? "Anda belum memiliki kuota pembuatan halaman. Silakan pilih paket hemat untuk mulai membuat landing page pertama Anda."
              : "Mulai buat landing page pertama Anda untuk event kampus, webinar, atau katalog produk dalam hitungan menit."}
          </p>

          <button
            onClick={handleCreateClick}
            className="mt-6 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all cursor-pointer"
          >
            {isQuotaFull ? (
              <>
                <CreditCard className="h-4 w-4" />
                <span>Pilih Paket & Aktifkan Kuota</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Buat Halaman Pertama</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Pages Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((p) => {
            const isDraft = p.status === "draft";
            const accentHex = p.accentColor || "#2563eb";

            return (
              <div
                key={p.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden"
              >
                {/* Top Accent Strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5 transition-all group-hover:h-2"
                  style={{ backgroundColor: accentHex }}
                />

                <div>
                  {/* Card Header: Category & Status */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 capitalize">
                      <Tag className="h-3 w-3 text-slate-500" />
                      {p.category}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isDraft
                          ? "bg-amber-50 text-amber-700 border border-amber-200/80"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isDraft ? "bg-amber-500" : "bg-emerald-500 animate-pulse"
                        }`}
                      />
                      {isDraft ? "Draft" : "Published"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="mt-3.5 text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </h2>

                  {p.schedule ? (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 line-clamp-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {p.schedule}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-slate-400 italic">
                      Jadwal belum ditentukan
                    </p>
                  )}

                  {/* Stats Bar */}
                  <div className="mt-5 flex items-center gap-4 rounded-2xl bg-slate-50/80 p-3 text-xs text-slate-600 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-extrabold text-slate-900 font-mono">
                        {p.submissions?.length || 0}
                      </span>
                      <span className="text-slate-500">Pendaftar</span>
                    </div>
                    <div className="h-3.5 w-px bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4 text-slate-400" />
                      <span className="font-extrabold text-slate-900 font-mono">
                        {p.viewsCount || 0}
                      </span>
                      <span className="text-slate-500">Views</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDetail(p)}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                      title="Lihat Detail & Rekap Data"
                    >
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Rekap</span>
                    </button>

                    <Link
                      href={`/builder/${p.id}`}
                      className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
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
                        className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
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
                      className="inline-flex min-h-[38px] items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                      title="Duplikasi Halaman"
                    >
                      {duplicatingId === p.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      disabled={deletingId === p.id}
                      className="inline-flex min-h-[38px] items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus Halaman"
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
