# biaya-dan-batasan.md — Batasan Gratis & Mudah Diintegrasikan

Dokumen ini **menimpa** bagian PRD/design yang berpotensi butuh biaya atau setup rumit, supaya MVP ini bisa dibangun dan dijalankan **tanpa biaya** dulu. Berikan file ini ke AI agent/builder bersama dokumen lain, dan minta dia mengikuti batasan di sini kalau bertentangan dengan detail teknis di PRD.

---

## 1. Prinsip

Untuk tahap MVP/prototipe, **pilih opsi gratis dan paling sedikit setup**, walau itu berarti sedikit kurang "custom", daripada opsi yang lebih bagus tapi butuh kartu kredit, verifikasi akun developer, atau domain berbayar.

## 2. Hosting & Database — pakai tier gratis

| Kebutuhan | Rekomendasi gratis | Catatan |
|---|---|---|
| Hosting frontend/halaman hasil publish | Vercel / Netlify (tier gratis) | Subdomain bawaan platform (mis. `quicklaunch-nama.vercel.app`) sudah cukup untuk MVP — **jangan** pakai domain kustom dulu (domain berbayar, ~Rp100–150rb/tahun). |
| Database + Auth | Supabase (tier gratis) atau Firebase (tier gratis) | Keduanya punya auth bawaan (email/password), jadi tidak perlu bangun sistem login dari nol. |
| Penyimpanan gambar/media | Supabase Storage / Cloudinary tier gratis | Hindari layanan yang minta kartu kredit di awal. |

> **Ganti ketentuan subdomain kustom per halaman** di PRD §4.1 poin 5 ("Publikasi") menjadi: tiap halaman dapat **path/slug** di dalam satu domain bawaan platform hosting (mis. `quicklaunch-nama.vercel.app/nama-event`), bukan subdomain wildcard terpisah per halaman. Opsi subdomain custom (`nama-event.quicklaunch.id`) boleh jadi fitur "boleh menyusul" (PRD §4.2) kalau nanti sudah ada pemasukan untuk beli domain.

## 3. Integrasi Google Sheets — versi gratis & mudah (TANPA OAuth app verification)

PRD aslinya minta OAuth Google per pengguna. Untuk MVP ini **terlalu rumit dan berisiko**: Google mewajibkan proses **verifikasi aplikasi** untuk aplikasi yang minta akses Sheets banyak pengguna, prosesnya bisa makan waktu minggu-mingguan.

**Ganti dengan cara ini (gratis, tanpa verifikasi Google):**

1. Setiap pengguna (panitia/UMKM) **membuat sendiri 1 Google Apps Script Web App sederhana** di akun Google mereka (gratis, cuma copy-paste script ~10 baris yang kita sediakan template-nya) yang berfungsi sebagai "webhook" penerima data ke Sheets mereka sendiri.
2. Pengguna paste URL Web App itu ke aplikasi QuickLaunch Studio Builder (1 kolom input, seperti paste link).
3. Setiap ada submission form baru, aplikasi kita cukup `fetch POST` ke URL tersebut — Apps Script yang menuliskan ke Sheets pengguna. Tidak ada OAuth consent screen, tidak ada proses verifikasi dari Google.

**Trade-off:** pengguna perlu 1x setup manual (copy script ke Apps Script, deploy sebagai Web App, copy URL) — kita sediakan panduan bergambar singkat untuk ini. Ini jauh lebih sederhana dibanding alur OAuth penuh, dan **tetap gratis selamanya** (Apps Script gratis tanpa batas wajar untuk pemakaian personal/komunitas).

> AI agent: minta instruksi ini dipakai untuk menggantikan "Integrasi Google Sheets API: OAuth akun Google pengguna" di PRD §6 — ganti jadi "Integrasi via Google Apps Script Web App URL yang di-paste pengguna".

## 4. WhatsApp — sudah gratis, tidak perlu diubah

Link `wa.me/<nomor>?text=<pesan>` murni gratis, tidak butuh API berbayar (WhatsApp Business API baru dibutuhkan kalau nanti mau kirim pesan otomatis tanpa klik manual — itu di luar lingkup MVP, biarkan di PRD §4.3).

## 5. AI builder/agent — kelola pemakaian token/kredit

- Ikuti `prompt-bertahap.md` (kerja bertahap) supaya tidak boros token/kredit AI agent.
- Kalau AI agent/builder yang dipakai beri kredit gratis terbatas (mis. Lovable, bolt.new, Replit Agent), prioritaskan menyelesaikan Tahap 1–3 (PRD §11) dulu dalam kredit gratis itu sebelum lanjut ke tahap yang butuh integrasi eksternal.

## 6. Checklist "tetap gratis" sebelum nambah fitur apa pun

Sebelum AI agent menambahkan library/layanan baru, cek dulu:
- [ ] Apakah ada tier gratis yang cukup untuk skala pemakaian MVP (puluhan halaman, ratusan submission/bulan)?
- [ ] Apakah butuh kartu kredit untuk daftar (banyak "tier gratis" tetap minta kartu kredit — hindari kalau bisa)?
- [ ] Apakah butuh proses verifikasi/approval dari pihak ketiga (seperti OAuth app review) yang makan waktu?

Kalau salah satu jawabannya bikin ragu, pilih alternatif yang lebih sederhana walau fiturnya sedikit berkurang.
