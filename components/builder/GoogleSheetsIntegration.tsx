"use client";

import { useState } from "react";
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Loader2,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface GoogleSheetsIntegrationProps {
  pageId: string;
  initialWebhookUrl: string;
  onUrlChange: (url: string) => void;
}

const APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    
    // Buat baris judul kolom otomatis jika sheet masih kosong
    if (sheet.getLastRow() === 0 || !headers[0]) {
      headers = Object.keys(data);
      sheet.appendRow(headers);
    }
    
    // Susun isi baris sesuai urutan kolom
    var row = headers.map(function(key) {
      return data[key] !== undefined ? data[key] : "";
    });
    
    sheet.appendRow(row);
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function GoogleSheetsIntegration({
  pageId,
  initialWebhookUrl,
  onUrlChange,
}: GoogleSheetsIntegrationProps) {
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl || "");
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isConnected = Boolean(webhookUrl && webhookUrl.trim().length > 10);

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTestConnection = async () => {
    if (!webhookUrl.trim()) {
      alert("Masukkan URL Web App Google Apps Script terlebih dahulu.");
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`/api/pages/${pageId}/test-sheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ webhookUrl: webhookUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal menghubungi Google Sheets");
      }

      setTestResult({
        success: true,
        message: data.message,
      });
      onUrlChange(webhookUrl.trim());
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Status Badge (design.md §4) */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Integrasi Google Sheets (Auto-Sync)
            </h3>
            <p className="text-xs text-slate-500">
              Setiap pendaftaran baru akan otomatis masuk ke Google Sheets Anda.
            </p>
          </div>
        </div>

        {/* Status Badge (design.md §4) */}
        <div>
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Terhubung
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 border border-slate-200">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              Belum Terhubung
            </span>
          )}
        </div>
      </div>

      {/* Input URL Web App */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          URL Google Apps Script Web App
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={webhookUrl}
            onChange={(e) => {
              setWebhookUrl(e.target.value);
              onUrlChange(e.target.value);
            }}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="flex-1 min-h-[44px] rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing || !webhookUrl.trim()}
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40 transition-colors shrink-0 shadow-sm"
          >
            {testing ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menguji...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Uji Koneksi</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-400">
          URL Web App diperoleh setelah Anda melakukan Deployment di menu Apps Script spreadsheet Anda.
        </p>
      </div>

      {/* Test Result Message */}
      {testResult && (
        <div
          className={`rounded-xl p-3 text-xs flex items-start gap-2 border ${
            testResult.success
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {testResult.success ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          )}
          <span>{testResult.message}</span>
        </div>
      )}

      {/* Accordion / Panduan Cepat 3 Langkah */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Cara Menghubungkan Google Sheets (Gratis & &lt; 2 Menit):</span>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            {showGuide ? "Sembunyikan Panduan" : "Lihat Langkah Detail"}
          </button>
        </div>

        {/* 3 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="rounded-lg bg-white p-3 border border-slate-200 shadow-sm space-y-1">
            <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-center font-bold text-[11px] leading-5">
              1
            </span>
            <div className="font-semibold text-slate-900">Buka Google Sheets</div>
            <p className="text-[11px] text-slate-500">
              Buat spreadsheet baru, lalu klik menu <strong>Ekstensi &gt; Apps Script</strong>.
            </p>
          </div>

          <div className="rounded-lg bg-white p-3 border border-slate-200 shadow-sm space-y-1">
            <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-center font-bold text-[11px] leading-5">
              2
            </span>
            <div className="font-semibold text-slate-900">Salin & Tempel Script</div>
            <p className="text-[11px] text-slate-500">
              Tempelkan kode di bawah ini menggantikan isi file <code>Code.gs</code>.
            </p>
          </div>

          <div className="rounded-lg bg-white p-3 border border-slate-200 shadow-sm space-y-1">
            <span className="inline-block h-5 w-5 rounded-full bg-blue-100 text-blue-700 text-center font-bold text-[11px] leading-5">
              3
            </span>
            <div className="font-semibold text-slate-900">Deploy sebagai Web App</div>
            <p className="text-[11px] text-slate-500">
              Klik <strong>Terapkan &gt; Deployment Baru &gt; Aplikasi Web</strong> (Akses: <em>Siapa saja</em>), lalu salin URL-nya.
            </p>
          </div>
        </div>

        {/* Script Code Block */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-600">
              Kode Google Apps Script:
            </span>
            <button
              type="button"
              onClick={handleCopyScript}
              className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
            >
              {copiedScript ? (
                <>
                  <Check className="h-3 w-3 text-emerald-600" />
                  <span className="text-emerald-700">Kode Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Salin Kode Script</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-36 selection:bg-blue-600">
            {APPS_SCRIPT_TEMPLATE}
          </pre>
        </div>
      </div>
    </div>
  );
}

