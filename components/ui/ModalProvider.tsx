"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  HelpCircle,
} from "lucide-react";

export type ModalType = "success" | "error" | "info" | "warning" | "confirm";

interface ModalOptions {
  title?: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ModalContextType {
  showAlert: (message: string, type?: ModalType, title?: string) => Promise<void>;
  showConfirm: (
    message: string,
    title?: string,
    confirmText?: string,
    cancelText?: string
  ) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions>({ message: "" });
  const [resolvePromise, setResolvePromise] = useState<((val: boolean) => void) | null>(null);

  const showAlert = (message: string, type: ModalType = "info", title?: string): Promise<void> => {
    return new Promise((resolve) => {
      setOptions({
        title: title || (type === "success" ? "Berhasil" : type === "error" ? "Terjadi Kesalahan" : type === "warning" ? "Peringatan" : "Informasi"),
        message,
        type,
        confirmText: "Mengerti",
      });
      setResolvePromise(() => () => {
        resolve();
      });
      setIsOpen(true);
    });
  };

  const showConfirm = (
    message: string,
    title: string = "Konfirmasi Tindakan",
    confirmText: string = "Ya, Lanjutkan",
    cancelText: string = "Batal"
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions({
        title,
        message,
        type: "confirm",
        confirmText,
        cancelText,
      });
      setResolvePromise(() => (confirmed: boolean) => {
        resolve(confirmed);
      });
      setIsOpen(true);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(false);
  };

  const getIcon = () => {
    switch (options.type) {
      case "success":
        return <CheckCircle2 className="h-6 w-6 text-emerald-600" />;
      case "error":
        return <AlertCircle className="h-6 w-6 text-rose-600" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-amber-600" />;
      case "confirm":
        return <HelpCircle className="h-6 w-6 text-blue-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getIconBg = () => {
    switch (options.type) {
      case "success":
        return "bg-emerald-50 border-emerald-200/80";
      case "error":
        return "bg-rose-50 border-rose-200/80";
      case "warning":
        return "bg-amber-50 border-amber-200/80";
      default:
        return "bg-blue-50 border-blue-200/80";
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 transition-all transform scale-100 animate-scale-up">
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${getIconBg()}`}>
                {getIcon()}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {options.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {options.message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              {options.type === "confirm" && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="min-h-[42px] px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  {options.cancelText || "Batal"}
                </button>
              )}
              <button
                type="button"
                onClick={handleConfirm}
                className={`min-h-[42px] px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                  options.type === "error"
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25"
                    : options.type === "warning"
                    ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/25"
                    : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/25"
                }`}
              >
                {options.confirmText || "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}

