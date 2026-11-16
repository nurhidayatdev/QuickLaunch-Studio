"use client";

import { useState, useEffect } from "react";
import {
  PAYMENT_PACKAGES,
  PAYMENT_METHODS,
  ADMIN_CONTACT,
  PackageItem,
  BankAccount,
} from "@/lib/payment-config";
import {
  X,
  Check,
  CreditCard,
  Upload,
  Copy,
  CheckCircle2,
  Clock,
  MessageCircle,
  Sparkles,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onOrderSuccess?: () => void;
}

export default function PackageCheckoutModal({
  isOpen,
  onClose,
  currentUser,
  onOrderSuccess,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [methods, setMethods] = useState<BankAccount[]>(PAYMENT_METHODS);
  const [adminContact, setAdminContact] = useState(ADMIN_CONTACT);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem>(
    PAYMENT_PACKAGES[1] // Pro as default
  );
  const [selectedMethod, setSelectedMethod] = useState<BankAccount>(
    PAYMENT_METHODS[0]
  );
  const [accountHolder, setAccountHolder] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState("");
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/packages")
        .then((r) => r.json())
        .then((data) => {
          if (data.paymentMethods && data.paymentMethods.length > 0) {
            setMethods(data.paymentMethods);
            setSelectedMethod(data.paymentMethods[0]);
          }
          if (data.adminContact) {
            setAdminContact(data.adminContact);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar (PNG, JPG, atau JPEG).");
      return;
    }

    setProofFileName(file.name);
    setErrorMsg("");

    // Read and compress image client-side
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        const scaleSize = MAX_WIDTH / img.width;
        const width = img.width > MAX_WIDTH ? MAX_WIDTH : img.width;
        const height = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
          setProofImage(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async () => {
    if (!proofImage) {
      setErrorMsg("Harap unggah screenshot bukti transfer terlebih dahulu.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          paymentMethod: selectedMethod.bankName,
          accountHolder,
          proofImageUrl: proofImage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      setCompletedOrder(data.order);
      setStep(3);
      if (onOrderSuccess) onOrderSuccess();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getWaConfirmationUrl = () => {
    if (!completedOrder) return "#";
    const text = `Halo Admin QuickLaunch, saya sudah transfer sebesar Rp${completedOrder.price.toLocaleString("id-ID")} untuk pesanan ${completedOrder.orderNumber} (${completedOrder.packageName}) atas nama ${completedOrder.accountHolder || currentUser?.name}. Mohon segera diverifikasi ya. Terima kasih!`;
    const cleanPhone = (adminContact.waNumber || ADMIN_CONTACT.waNumber).replace(/[^0-9]/g, "").replace(/^0/, "62");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {step === 3 ? "Pesanan Diterima" : "Upgrade Kuota Halaman"}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {step === 1 && "Pilih Paket QuickLaunch Anda"}
              {step === 2 && "Pembayaran Transfer & Konfirmasi"}
              {step === 3 && "Menunggu Verifikasi Admin"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: PILIH PAKET */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Pilih paket kuota yang sesuai dengan kebutuhan acara atau bisnis Anda. Tanpa biaya langganan bulanan tersembunyi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PAYMENT_PACKAGES.map((pkg) => {
                  const isSelected = selectedPackage.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`relative rounded-2xl p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/30 shadow-md"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {pkg.badge && (
                        <span
                          className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                            pkg.popular
                              ? "bg-blue-600 text-white"
                              : "bg-slate-800 text-white"
                          }`}
                        >
                          {pkg.badge}
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-xs font-bold text-slate-900">
                            {pkg.name}
                          </h3>
                        </div>
                        <div className="mt-2 mb-3">
                          <span className="text-lg font-black text-slate-900">
                            Rp{pkg.price.toLocaleString("id-ID")}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-normal">
                            sekali bayar ({pkg.quota} halaman)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">
                          {pkg.description}
                        </p>
                      </div>

                      <ul className="space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    Paket Terpilih: {selectedPackage.name}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Total Pembayaran: <strong>Rp{selectedPackage.price.toLocaleString("id-ID")}</strong> untuk <strong>+{selectedPackage.quota} Kuota Halaman</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                >
                  Lanjut Pembayaran
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TRANSFER & UPLOAD BUKTI */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  1. Pilih Rekening Tujuan Transfer
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {methods.map((method) => {
                    const isSelected = selectedMethod.id === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/30"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold text-blue-600 block mb-0.5">
                          {method.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-900 block line-clamp-1">
                          {method.bankName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank Detail Card with Copy Button */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 sm:p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3 text-xs text-slate-300">
                  <span>Nomor Rekening / Tujuan</span>
                  <span className="text-[11px] bg-slate-700/80 px-2 py-0.5 rounded-md font-mono">
                    {selectedMethod.bankName}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-wider">
                    {selectedMethod.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyAccount(selectedMethod.accountNumber)}
                    className="inline-flex min-h-[36px] items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                  >
                    {copiedAccount ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Salin No. Rek
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs text-slate-300">
                  Atas Nama: <strong className="text-white">{selectedMethod.accountHolder}</strong>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Total yang harus ditransfer:</span>
                  <span className="text-base font-black text-emerald-400">
                    Rp{selectedPackage.price.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Upload Proof Form */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">
                  2. Konfirmasi & Upload Bukti Transfer
                </label>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Nama Pemilik Rekening Pengirim (Opsional)
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full min-h-[40px] rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Screenshot Bukti Transfer *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:bg-slate-50 transition-colors">
                    {proofImage ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={proofImage}
                          alt="Bukti Transfer"
                          className="h-28 max-w-full rounded-lg object-contain border border-slate-200 mb-2"
                        />
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {proofFileName || "Gambar berhasil diunggah"}
                        </span>
                        <label className="mt-2 text-[11px] text-blue-600 underline cursor-pointer">
                          Ganti gambar
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <Upload className="h-8 w-8 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-800">
                          Klik untuk upload screenshot bukti transfer
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          Format PNG, JPG, JPEG (maks. 5MB)
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="min-h-[40px] text-xs font-semibold text-slate-600 hover:text-slate-900 px-3"
                >
                  Kembali ke Pilihan Paket
                </button>

                <button
                  type="button"
                  disabled={loading || !proofImage}
                  onClick={handleSubmitOrder}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses Pesanan...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Kirim Bukti Pembayaran
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUKSES SUBMIT & KONFIRMASI WA */}
          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="h-8 w-8" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
                  <Clock className="h-3 w-3" />
                  Menunggu Konfirmasi Admin
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  Bukti Pembayaran Berhasil Diterima!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Nomor Pesanan: <strong className="text-slate-800">{completedOrder?.orderNumber}</strong>.
                  Admin QuickLaunch akan segera memverifikasi mutasi rekening dan kuota halaman Anda akan langsung aktif.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Paket:</span>
                  <span className="font-semibold text-slate-800">{completedOrder?.packageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Penambahan Kuota:</span>
                  <span className="font-bold text-blue-600">+{completedOrder?.quotaAdded} Halaman Aktif</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Nominal:</span>
                  <span className="font-bold text-emerald-600">Rp{completedOrder?.price?.toLocaleString("id-ID")}</span>
                </div>
              </div>

              {/* Fast WhatsApp Confirmation Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <a
                  href={getWaConfirmationUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Konfirmasi Cepat via WhatsApp Admin
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tutup & Kembali ke Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

