"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PAYMENT_METHODS, ADMIN_CONTACT, BankAccount } from "@/lib/payment-config";
import { useModal } from "@/components/ui/ModalProvider";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  CreditCard,
  Search,
  ExternalLink,
  X,
  MessageCircle,
  Users,
  Settings,
  Plus,
  Copy,
  Check,
  Sparkles,
  Trash2,
  Save,
  RefreshCw,
  KeyRound,
  Phone,
} from "lucide-react";

interface AdminPaymentsClientProps {
  initialOrders: any[];
  initialUsers?: any[];
  currentUser: any;
}

export default function AdminPaymentsClient({
  initialOrders,
  initialUsers = [],
  currentUser,
}: AdminPaymentsClientProps) {
  const router = useRouter();
  const { showAlert, showConfirm } = useModal();
  const [activeTab, setActiveTab] = useState<"orders" | "users" | "settings" | "resets">("orders");
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [pendingResets, setPendingResets] = useState<any[]>([]);
  const [loadingResets, setLoadingResets] = useState(false);
  const [cancellingResetId, setCancellingResetId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [quotaModalUser, setQuotaModalUser] = useState<any | null>(null);
  const [quotaAmount, setQuotaAmount] = useState<number>(1);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Settings State
  const [settingsMethods, setSettingsMethods] = useState<BankAccount[]>(PAYMENT_METHODS);
  const [settingsWa, setSettingsWa] = useState(ADMIN_CONTACT.waNumber);
  const [settingsQris, setSettingsQris] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsNotice, setSettingsNotice] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.paymentMethods && Array.isArray(data.paymentMethods)) {
          setSettingsMethods(data.paymentMethods);
        }
        if (data.adminContact?.waNumber) {
          setSettingsWa(data.adminContact.waNumber);
        }
        if (data.adminContact?.adminQrisImage) {
          setSettingsQris(data.adminContact.adminQrisImage);
        }
      })
      .catch((err) => console.error("Error fetching admin settings:", err));
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsNotice(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethods: settingsMethods,
          adminWaNumber: settingsWa,
          adminQrisImage: settingsQris,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan pengaturan");

      setSettingsNotice({ type: "success", msg: "Nomor rekening, QRIS, dan kontak WhatsApp berhasil diperbarui!" });
      setTimeout(() => setSettingsNotice(null), 4000);
      router.refresh();
    } catch (err: any) {
      setSettingsNotice({ type: "error", msg: err.message || "Terjadi kesalahan" });
    } finally {
      setSavingSettings(false);
    }
  };

  const fetchResets = async () => {
    setLoadingResets(true);
    try {
      const res = await fetch("/api/admin/resets");
      const data = await res.json();
      if (data.resets) {
        setPendingResets(data.resets);
      }
    } catch (e) {
      console.error("Error fetching resets:", e);
    } finally {
      setLoadingResets(false);
    }
  };

  useEffect(() => {
    fetchResets();
  }, []);

  const handleCancelReset = async (userId: string, userName: string) => {
    const confirmed = await showConfirm(
      `Apakah Anda yakin ingin membatalkan permohonan reset sandi untuk "${userName}"? Kode OTP yang sedang aktif akan langsung dihanguskan demi keamanan akun.`,
      "Tolak Permohonan Reset",
      "Ya, Tolak Permohonan",
      "Batal"
    );
    if (!confirmed) return;

    setCancellingResetId(userId);
    try {
      const res = await fetch("/api/admin/resets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membatalkan permohonan");

      setPendingResets((prev) => prev.filter((r) => r.id !== userId));
      await showAlert("Permintaan reset sandi berhasil dibatalkan. Kode OTP telah dihanguskan.", "success");
    } catch (err: any) {
      await showAlert(err.message || "Terjadi kesalahan", "error");
    } finally {
      setCancellingResetId(null);
    }
  };

  const handleAddAccount = () => {
    setSettingsMethods((prev) => [
      ...prev,
      {
        id: `acc-${Date.now()}`,
        bankName: "Bank Baru",
        accountNumber: "",
        accountHolder: "",
        badge: "Transfer Bank",
      },
    ]);
  };

  const handleRemoveAccount = async (index: number) => {
    if (settingsMethods.length <= 1) {
      await showAlert(
        "Minimal harus ada 1 nomor rekening / tujuan pembayaran aktif di sistem.",
        "warning",
        "Rekening Wajib"
      );
      return;
    }
    setSettingsMethods((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAccount = (index: number, field: keyof BankAccount, val: string) => {
    setSettingsMethods((prev) =>
      prev.map((acc, i) => (i === index ? { ...acc, [field]: val } : acc))
    );
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const approvedCount = orders.filter((o) => o.status === "approved").length;
  const totalRevenue = orders
    .filter((o) => o.status === "approved")
    .reduce((acc, cur) => acc + (cur.price || 0), 0);

  const filteredOrders = orders.filter((order) => {
    if (filter !== "all" && order.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = order.orderNumber.toLowerCase().includes(q);
      const matchUser =
        order.user?.name?.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q);
      const matchMethod = order.paymentMethod?.toLowerCase().includes(q);
      return matchNum || matchUser || matchMethod;
    }
    return true;
  });

  const filteredUsers = users.filter((u) => {
    if (!userSearch.trim()) return true;
    const q = userSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const handleApprove = async (order: any) => {
    const confirmed = await showConfirm(
      `Konfirmasi setujui pesanan #${order.orderNumber}?\n\nPengguna: ${order.user.name} (${order.user.email})\nPenambahan Kuota: +${order.quotaAdded} Halaman\nNominal: Rp${order.price.toLocaleString("id-ID")}`,
      "Setujui Pembayaran",
      "Ya, Setujui & Tambah Kuota",
      "Batal"
    );
    if (!confirmed) return;

    setProcessingId(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyetujui pesanan");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === order.id ? { ...o, status: "approved", verifiedAt: new Date() } : o
        )
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === order.userId
            ? { ...u, pageQuota: (u.pageQuota || 0) + order.quotaAdded, package: order.packagePlan }
            : u
        )
      );
      await showAlert(
        `Pesanan #${order.orderNumber} berhasil disetujui! Kuota akun ${order.user.name} telah bertambah +${order.quotaAdded}.`,
        "success",
        "Pembayaran Diverifikasi"
      );
      router.refresh();
    } catch (e: any) {
      await showAlert(e.message || "Terjadi kesalahan", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectingOrder) return;

    setProcessingId(rejectingOrder.id);
    try {
      const res = await fetch(`/api/admin/orders/${rejectingOrder.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reject",
          rejectionReason: rejectReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menolak pesanan");

      setOrders((prev) =>
        prev.map((o) =>
          o.id === rejectingOrder.id
            ? {
                ...o,
                status: "rejected",
                rejectionReason: rejectReason,
                verifiedAt: new Date(),
              }
            : o
        )
      );
      const rejectedNumber = rejectingOrder.orderNumber;
      setRejectingOrder(null);
      setRejectReason("");
      await showAlert(`Pesanan #${rejectedNumber} telah ditolak.`, "info", "Pesanan Ditolak");
      router.refresh();
    } catch (e: any) {
      await showAlert(e.message || "Terjadi kesalahan", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleAdjustQuota = async () => {
    if (!quotaModalUser) return;
    setProcessingId(quotaModalUser.id);
    try {
      const res = await fetch(`/api/admin/users/${quotaModalUser.id}/quota`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quotaChange: quotaAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengubah kuota");

      setUsers((prev) =>
        prev.map((u) =>
          u.id === quotaModalUser.id ? { ...u, pageQuota: data.user.pageQuota } : u
        )
      );
      await showAlert(data.message || "Kuota pengguna berhasil disesuaikan.", "success");
      setQuotaModalUser(null);
      router.refresh();
    } catch (e: any) {
      await showAlert(e.message || "Terjadi kesalahan", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Console Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🛡️
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Konsol Operasional Admin
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pusat operasional QuickLaunch: verifikasi bukti pembayaran, pantau pengguna, dan kelola kuota.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Mode Operasional Aktif
          </span>
        </div>
      </div>

      {/* Main Operational Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === "orders"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Verifikasi Pembayaran</span>
          {pendingCount > 0 && (
            <span className="h-5 px-1.5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Kelola Pengguna ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === "settings"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Settings className="h-4 w-4" />
          <span>Rekening & Kontak</span>
        </button>

        <button
          onClick={() => setActiveTab("resets")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === "resets"
              ? "border-blue-600 text-blue-600 bg-blue-50/30"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span>Reset Sandi</span>
          {pendingResets.length > 0 && (
            <span className="h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingResets.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: VERIFIKASI PEMBAYARAN */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Revenue & Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Perlu Verifikasi</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600">
                {pendingCount}
              </div>
              <span className="text-[11px] text-slate-400">Pesanan menunggu verifikasi</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Total Disetujui</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {approvedCount}
              </div>
              <span className="text-[11px] text-slate-400">Pesanan paket aktif</span>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Total Omzet Diterima</span>
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600">
                Rp{totalRevenue.toLocaleString("id-ID")}
              </div>
              <span className="text-[11px] text-slate-400">Dari mutasi transfer valid</span>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilter("pending")}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  filter === "pending"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>Menunggu ({pendingCount})</span>
              </button>
              <button
                onClick={() => setFilter("all")}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === "all"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Semua ({orders.length})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === "approved"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Disetujui ({approvedCount})
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === "rejected"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                Ditolak ({orders.filter((o) => o.status === "rejected").length})
              </button>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari no. pesanan, nama, bank..."
                className="w-full min-h-[38px] pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
              <p className="text-xs font-medium text-slate-500">
                Tidak ada pesanan pembayaran dalam kategori ini.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredOrders.map((order) => {
                const isPending = order.status === "pending";
                const isApproved = order.status === "approved";
                const isRejected = order.status === "rejected";

                return (
                  <div
                    key={order.id}
                    className={`rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isPending
                        ? "border-amber-200 bg-amber-50/20"
                        : isApproved
                        ? "border-slate-200"
                        : "border-red-200 bg-red-50/20"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      {order.proofImageUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage(order.proofImageUrl)}
                          className="group relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0 hover:ring-2 hover:ring-blue-600 transition-all"
                          title="Klik untuk perbesar bukti transfer"
                        >
                          <img
                            src={order.proofImageUrl}
                            alt="Bukti Transfer"
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                            <Eye className="h-5 w-5" />
                          </div>
                        </button>
                      ) : (
                        <div className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs shrink-0">
                          No Image
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-black text-slate-900 font-mono">
                            #{order.orderNumber}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isPending
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : isApproved
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                            }`}
                          >
                            {isPending && "Menunggu Konfirmasi"}
                            {isApproved && "Disetujui"}
                            {isRejected && "Ditolak"}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700">
                          <strong>{order.user?.name}</strong>{" "}
                          <span className="text-slate-400">({order.user?.email})</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs">
                          <div>
                            <span className="text-slate-400">Paket: </span>
                            <strong className="text-blue-600">{order.packageName}</strong>{" "}
                            <span className="text-[11px] font-semibold text-slate-600">
                              (+{order.quotaAdded} kuota)
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400">Metode: </span>
                            <strong className="text-slate-800">{order.paymentMethod}</strong>
                            {order.accountHolder && (
                              <span className="text-slate-500"> a/n {order.accountHolder}</span>
                            )}
                          </div>

                          <div>
                            <span className="text-slate-400">Nominal: </span>
                            <strong className="text-emerald-600 font-bold">
                              Rp{order.price.toLocaleString("id-ID")}
                            </strong>
                          </div>
                        </div>

                        {isRejected && order.rejectionReason && (
                          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                            Alasan penolakan: {order.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(order.proofImageUrl)}
                        className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Lihat Bukti
                      </button>

                      {isPending && (
                        <>
                          <button
                            type="button"
                            disabled={processingId === order.id}
                            onClick={() => {
                              setRejectingOrder(order);
                              setRejectReason("");
                            }}
                            className="inline-flex min-h-[38px] items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Tolak
                          </button>

                          <button
                            type="button"
                            disabled={processingId === order.id}
                            onClick={() => handleApprove(order)}
                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
                          >
                            {processingId === order.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Setujui Pembayaran
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KELOLA PENGGUNA & MONITORING KUOTA */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-700">
              Daftar Semua Pengguna Terdaftar ({users.length})
            </span>
            <div className="relative min-w-[240px]">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="w-full min-h-[38px] pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Nama & Email</th>
                  <th className="px-4 py-3">Peran (Role)</th>
                  <th className="px-4 py-3">Paket Aktif</th>
                  <th className="px-4 py-3">Kuota Halaman</th>
                  <th className="px-4 py-3">Halaman Dibuat</th>
                  <th className="px-4 py-3 text-right">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isUserAdmin = u.role === "admin";
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isUserAdmin
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isUserAdmin ? "Admin" : "Pelanggan"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 capitalize font-semibold text-blue-600">
                        {u.package || "none"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900">
                          {isUserAdmin ? "Tanpa Batas" : `${u.pageQuota || 0} Halaman`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-slate-600">
                        {u._count?.pages || 0} Halaman
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {!isUserAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setQuotaModalUser(u);
                              setQuotaAmount(1);
                            }}
                            className="inline-flex min-h-[34px] items-center gap-1 rounded-xl bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Tambah Kuota</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: REKENING & KONTAK OPERASIONAL */}
      {activeTab === "settings" && (
        <div className="space-y-6">
          {settingsNotice && (
            <div
              className={`rounded-2xl p-4 text-xs font-semibold flex items-center justify-between border ${
                settingsNotice.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              <span>{settingsNotice.msg}</span>
              <button
                onClick={() => setSettingsNotice(null)}
                className="h-6 w-6 rounded-full hover:bg-black/5 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Bank Accounts Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Kelola Rekening & E-Wallet Tujuan Transfer
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ubah nomor rekening atau tambah rekening baru Anda di sini. Pelanggan akan langsung melihat data ini saat checkout.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAccount}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border border-blue-600 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Tambah Rekening Baru
              </button>
            </div>

            <div className="space-y-4">
              {settingsMethods.map((method, idx) => (
                <div
                  key={method.id || idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 relative space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600">
                      Rekening #{idx + 1}
                    </span>

                    {settingsMethods.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAccount(idx)}
                        className="text-xs text-red-500 hover:text-red-700 p-1 flex items-center gap-1 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Rekening"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nama Bank / E-Wallet *
                      </label>
                      <input
                        type="text"
                        value={method.bankName}
                        onChange={(e) =>
                          handleUpdateAccount(idx, "bankName", e.target.value)
                        }
                        placeholder="Contoh: Bank Central Asia (BCA)"
                        className="w-full min-h-[38px] rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Nomor Rekening / No. HP *
                      </label>
                      <input
                        type="text"
                        value={method.accountNumber}
                        onChange={(e) =>
                          handleUpdateAccount(idx, "accountNumber", e.target.value)
                        }
                        placeholder="Contoh: 8735129840"
                        className="w-full min-h-[38px] rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Atas Nama (Pemilik) *
                      </label>
                      <input
                        type="text"
                        value={method.accountHolder}
                        onChange={(e) =>
                          handleUpdateAccount(idx, "accountHolder", e.target.value)
                        }
                        placeholder="Contoh: Budi Santoso"
                        className="w-full min-h-[38px] rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Label / Badge (Opsional)
                      </label>
                      <input
                        type="text"
                        value={method.badge || ""}
                        onChange={(e) =>
                          handleUpdateAccount(idx, "badge", e.target.value)
                        }
                        placeholder="Transfer Bank / E-Wallet"
                        className="w-full min-h-[38px] rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin WhatsApp Contact Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Kontak WhatsApp Admin untuk Konfirmasi Pelanggan
            </h3>

            <div className="max-w-md space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Nomor WhatsApp Admin (Aktif) *
              </label>
              <div className="relative">
                <MessageCircle className="h-4 w-4 absolute left-3 top-3 text-emerald-600" />
                <input
                  type="text"
                  value={settingsWa}
                  onChange={(e) => setSettingsWa(e.target.value)}
                  placeholder="081234567890 atau 6281234567890"
                  className="w-full min-h-[42px] pl-9 pr-3 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-blue-600 focus:outline-none font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Saat pelanggan selesai mengunggah screenshot bukti transfer, tombol &quot;Konfirmasi via WhatsApp&quot; akan langsung membuka chat ke nomor ini.
              </p>
            </div>

            {/* Admin QR Code QRIS Upload */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gambar QR Code QRIS Admin (Opsional)
              </label>
              <label className="flex flex-col items-center justify-center w-full min-h-[110px] border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition-all p-3.5">
                <input
                  type="file"
                  accept="image/*"
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
                          const compressed = canvas.toDataURL("image/jpeg", 0.75);
                          setSettingsQris(compressed);
                        }
                      };
                      img.src = event.target?.result as string;
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
                {settingsQris ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settingsQris}
                      alt="Admin QRIS"
                      className="h-16 w-16 object-contain rounded-lg border border-slate-200 bg-white p-1"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-emerald-600 block">
                        QRIS Admin Berhasil Diunggah ✓
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Akan ditampilkan di popup checkout pelanggan saat membeli paket kuota
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <span className="text-xs font-semibold text-slate-700">
                      Unggah Barcode QRIS Resmi QuickLaunch
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">
                      Pelanggan dapat scan langsung saat checkout paket kuota halaman.
                    </span>
                  </div>
                )}
              </label>
              {settingsQris && (
                <button
                  type="button"
                  onClick={() => setSettingsQris(null)}
                  className="mt-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-800"
                >
                  Hapus QRIS Admin
                </button>
              )}
            </div>
          </div>

          {/* Save Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={savingSettings}
              onClick={handleSaveSettings}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-600/20 transition-all"
            >
              {savingSettings ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan Pengaturan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Simpan Perubahan Rekening & Kontak</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: VERIFIKASI RESET KATA SANDI */}
      {activeTab === "resets" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  Pusat Verifikasi Pemulihan Kata Sandi
                </h3>
                <p className="text-[11px] text-slate-600">
                  Pantau permohonan lupa password yang aktif. Hanya pemilik asli yang berhak menerima kode OTP 6-digit.
                </p>
              </div>
            </div>
            <button
              onClick={fetchResets}
              disabled={loadingResets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-300 bg-white text-xs font-semibold text-blue-700 hover:bg-blue-50 transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingResets ? "animate-spin" : ""}`} />
              <span>Muat Ulang</span>
            </button>
          </div>

          {loadingResets ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-3xl">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Memeriksa permohonan reset sandi aktif...</p>
            </div>
          ) : pendingResets.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-2">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">
                Tidak Ada Permohonan Reset Sandi yang Menggantung
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Semua akun berada dalam kondisi aman. Permintaan reset password hanya akan muncul di sini saat pengguna mengajukan pemulihan akun.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingResets.map((r) => {
                const expiresAt = new Date(r.resetExpires);
                const isExpired = new Date() > expiresAt;
                const formattedExpiry = expiresAt.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const waNumber = r.phone || "";
                const cleanPhone = waNumber.replace(/[^0-9]/g, "").replace(/^0/, "62");
                const waUrl = cleanPhone
                  ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                      `Halo ${r.name}, ini Admin Resmi QuickLaunch. Berikut kode OTP verifikasi 6-digit untuk reset kata sandi akun Anda: *${r.resetCode}*. Jangan berikan kode ini kepada orang lain.`
                    )}`
                  : null;

                return (
                  <div
                    key={r.id}
                    className="p-5 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-sm font-bold text-slate-900 block">{r.name}</span>
                          <span className="text-xs text-slate-500 font-mono block">{r.email}</span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isExpired
                              ? "bg-slate-100 text-slate-500"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {isExpired ? "Kadaluarsa" : `Aktif s.d ${formattedExpiry}`}
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Nomor WhatsApp:</span>
                          <span className="font-mono font-bold text-slate-800">
                            {r.phone || "Belum ditautkan di profil"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500 font-medium">Kode OTP Rahasia:</span>
                          <span className="font-mono text-base font-black text-blue-700 tracking-wider bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                            {r.resetCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      {waUrl ? (
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Kirim OTP ke WA Pemilik</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(r.resetCode);
                            showAlert("Kode OTP berhasil disalin ke clipboard.", "success");
                          }}
                          className="flex-1 inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin Kode OTP</span>
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={cancellingResetId === r.id}
                        onClick={() => handleCancelReset(r.id, r.name)}
                        className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors cursor-pointer"
                        title="Tolak & Hanguskan OTP"
                      >
                        {cancellingResetId === r.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        <span>Tolak</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-3xl p-4 flex flex-col items-center shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 mb-3 self-start">
              Pratinjau Bukti Transfer
            </h3>
            <div className="flex-1 w-full overflow-auto flex items-center justify-center bg-slate-50 rounded-2xl p-2">
              <img
                src={previewImage}
                alt="Bukti Transfer Penuh"
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Tolak Pesanan #{rejectingOrder.orderNumber}
              </h3>
              <button
                onClick={() => setRejectingOrder(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Tuliskan alasan penolakan agar pelanggan memahami status pembayarannya.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alasan Penolakan
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Contoh: Bukti transfer buram tidak terbaca / Dana belum masuk di mutasi..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:border-red-600 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="min-h-[38px] px-3 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={processingId === rejectingOrder.id}
                onClick={handleRejectSubmit}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-4 rounded-xl bg-red-600 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {processingId === rejectingOrder.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Quota Adjustment Modal */}
      {quotaModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Tambah Kuota Manual
              </h3>
              <button
                onClick={() => setQuotaModalUser(null)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Menambahkan kuota halaman untuk: <strong>{quotaModalUser.name}</strong> ({quotaModalUser.email}).
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jumlah Tambahan Kuota Halaman
              </label>
              <div className="flex items-center gap-2">
                {[1, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuotaAmount(num)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      quotaAmount === num
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-600/20"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setQuotaModalUser(null)}
                className="min-h-[38px] px-3 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={processingId === quotaModalUser.id}
                onClick={handleAdjustQuota}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-4 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm"
              >
                {processingId === quotaModalUser.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                Tambah +{quotaAmount} Kuota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
