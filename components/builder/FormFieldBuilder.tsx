"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  AlertCircle,
  HelpCircle,
  Sliders,
  Type,
  Mail,
  Phone,
  ListFilter,
  Save,
  Loader2,
  Upload,
} from "lucide-react";

export interface FormFieldItem {
  id?: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  options?: string | null;
}

const FIELD_TYPES = [
  { value: "text", label: "Teks Singkat", icon: Type },
  { value: "tel", label: "Nomor WhatsApp", icon: Phone },
  { value: "email", label: "Email", icon: Mail },
  { value: "select", label: "Pilihan Dropdown", icon: ListFilter },
  { value: "file", label: "Upload Bukti Bayar / Gambar", icon: Upload },
];

export default function FormFieldBuilder({
  pageId,
  initialFields,
  onFieldsChange,
}: {
  pageId: string;
  initialFields: FormFieldItem[];
  onFieldsChange: (fields: FormFieldItem[]) => void;
}) {
  const [fields, setFields] = useState<FormFieldItem[]>(initialFields);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const updateFieldsState = (newFields: FormFieldItem[]) => {
    const ordered = newFields.map((f, idx) => ({ ...f, order: idx }));
    setFields(ordered);
    onFieldsChange(ordered);
  };

  const handleAddField = () => {
    if (fields.length >= 10) {
      alert("Maksimal 10 field pendaftaran untuk menjaga kecepatan & kemudahan pengisian.");
      return;
    }

    const newField: FormFieldItem = {
      label: `Field Kustom ${fields.length + 1}`,
      type: "text",
      required: false,
      order: fields.length,
      options: "",
    };

    updateFieldsState([...fields, newField]);
  };

  const handleRemoveField = (index: number) => {
    if (fields.length <= 1) {
      alert("Minimal harus ada 1 field pendaftaran.");
      return;
    }
    const filtered = fields.filter((_, idx) => idx !== index);
    updateFieldsState(filtered);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const copy = [...fields];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    updateFieldsState(copy);
  };

  const handleChange = (index: number, key: keyof FormFieldItem, value: any) => {
    const copy = [...fields];
    copy[index] = { ...copy[index], [key]: value };
    updateFieldsState(copy);
  };

  const handleSaveFields = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`/api/pages/${pageId}/fields`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan field form");
      }

      setSaveMessage("Form pendaftaran berhasil disimpan!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (e: any) {
      alert(e.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Susun Form Pendaftaran
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tentukan data apa saja yang wajib diisi oleh peserta saat mendaftar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddField}
          className="flex min-h-[38px] items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Field
        </button>
      </div>

      {saveMessage && (
        <div className="rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-700 border border-emerald-100 flex items-center gap-2">
          <Check className="h-3.5 w-3.5" />
          {saveMessage}
        </div>
      )}

      {/* Field List Rows */}
      <div className="space-y-3">
        {fields.map((field, idx) => {
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Order Handles */}
                <div className="flex items-center gap-1 shrink-0">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-200 text-xs font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <div className="flex flex-row sm:flex-col gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                      title="Geser ke atas"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === fields.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-20"
                      title="Geser ke bawah"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Label Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => handleChange(idx, "label", e.target.value)}
                    placeholder="Nama Label Field"
                    className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-100"
                  />
                </div>

                {/* Type Selector */}
                <div className="w-full sm:w-44 shrink-0">
                  <select
                    value={field.type}
                    onChange={(e) => handleChange(idx, "type", e.target.value)}
                    className="w-full min-h-[40px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Required Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) =>
                        handleChange(idx, "required", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-[11px]">Wajib</span>
                  </label>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveField(idx)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Hapus field"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Options Input for Select Type */}
              {field.type === "select" && (
                <div className="mt-2.5 pt-2 border-t border-slate-200">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pilihan Opsi (Pisahkan dengan koma):
                  </label>
                  <input
                    type="text"
                    value={field.options || ""}
                    onChange={(e) => handleChange(idx, "options", e.target.value)}
                    placeholder="Opsi 1, Opsi 2, Opsi 3"
                    className="w-full min-h-[38px] rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Info for File Upload */}
              {field.type === "file" && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-2 text-[11px] text-blue-700 bg-blue-50/70 px-3 py-2 rounded-lg">
                  <Upload className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    Peserta/pembeli dapat mengunggah file gambar (struk transfer, bukti bayar QRIS/rekening) yang otomatis terkompresi.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSaveFields}
          disabled={saving}
          className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span>Simpan Susunan Form</span>
        </button>
      </div>
    </div>
  );
}

