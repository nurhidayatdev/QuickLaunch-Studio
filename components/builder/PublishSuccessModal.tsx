"use client";

import { useState, useEffect } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  X,
  Sparkles,
  Globe,
} from "lucide-react";

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  pageTitle: string;
}

export default function PublishSuccessModal({
  isOpen,
  onClose,
  slug,
  pageTitle,
}: PublishSuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFullUrl(`${window.location.origin}/p/${slug}`);
    }
  }, [slug]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Gagal menyalin link:", e);
    }
  };

  const shareText = `Halo! Pendaftaran resmi untuk *${pageTitle}* telah dibuka. Silakan daftar dan lihat informasi lengkapnya di sini:\n${fullUrl}`;
  const waShareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          title="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
          <Sparkles className="h-8 w-8 text-emerald-600" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Halaman Berhasil Dipublikasikan!
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Halaman Anda sekarang sudah aktif dan dapat diakses secara publik oleh calon peserta atau pembeli.
          </p>
        </div>

        {/* Link Box */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 sm:p-4 text-left space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span>Alamat Link Publik Anda:</span>
          </div>
          <div className="flex items-center justify-between gap-2 bg-white rounded-lg border border-slate-200 p-2">
            <span className="text-xs font-mono font-medium text-slate-800 truncate select-all">
              {fullUrl}
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors shrink-0 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <a
            href={waShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Bagikan ke WhatsApp Sekarang
          </a>

          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Buka Halaman Publik di Tab Baru
          </a>
        </div>
      </div>
    </div>
  );
}

