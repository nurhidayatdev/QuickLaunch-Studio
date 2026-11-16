# design.md — QuickLaunch Studio Builder

Pendamping `PRD_QuickLaunch_Studio_Builder.md`. Fokus: tampilan, komponen, dan alur layar. Berikan file ini bersama PRD ke AI agent/builder.

---

## 1. Prinsip Desain

- **Cepat & tanpa belajar** — tiap layar harus bisa diselesaikan tanpa instruksi tertulis. Hindari istilah teknis (bukan "deploy", tapi "Publikasikan").
- **Mobile-first** — mayoritas pengguna (panitia/UMKM) akan membuka dari HP. Desain untuk layar 375–414px dulu, baru lebar.
- **Kredibel, bukan norak** — target audiens (calon peserta/pembeli) menilai kepercayaan dari tampilan. Hindari warna neon/font fantasi; gaya bersih seperti Linktree/Notion.
- **Performa di atas estetika** — tanpa animasi berat, tanpa gambar besar tak terkompresi. Setiap pilihan visual harus tetap menjaga skor PageSpeed mobile ≥ 90 (lihat PRD §7).

## 2. Visual Style

| Elemen | Ketentuan |
|---|---|
| **Tipografi** | 1 font sans-serif system (Inter / system-ui) untuk UI builder & dashboard. Landing page hasil publish boleh pilih dari 2–3 pasangan font per template. |
| **Warna dasar (UI builder/dashboard)** | Netral: putih/abu terang sebagai base, 1 warna aksen (biru/indigo) untuk CTA & status aktif. |
| **Warna landing page hasil publish** | Pengguna pilih 1 warna aksen dari palet terbatas (5–6 pilihan) saat setup — jangan beri color picker bebas (risiko kombinasi buruk & file CSS membengkak). |
| **Spacing** | Skala 4/8/12/16/24/32px. Konsisten di semua layar. |
| **Komponen** | Rounded corner sedang (8–12px), shadow tipis, tombol CTA besar & jelas (mobile tap target ≥ 44px). |
| **Ikon** | Set ikon tunggal (mis. Lucide), jangan campur beberapa icon set. |

## 3. Struktur Layar (Screens)

### 3.1 Builder (alur pembuatan halaman)
1. **Pilih kategori** — 2 kartu besar: "Event" vs "Produk/UMKM".
2. **Pilih template** — grid 3 thumbnail template per kategori, preview besar saat tap.
3. **Isi konten** — form 1 kolom (mobile), bertahap per bagian: Info Dasar → Jadwal/Harga → Media → Kontak WA. Progress indicator di atas (mis. "Langkah 2 dari 4").
4. **Susun form pendaftaran** — daftar field dengan toggle aktif/nonaktif + tambah field custom (maks field disederhanakan, bukan builder drag-drop bebas).
5. **Hubungkan Google Sheets** — 1 tombol "Hubungkan akun Google", status jelas (terhubung/belum), opsi "buat sheet baru" vs "pakai sheet lama".
6. **Preview** — toggle mobile/desktop, tombol "Publikasikan" mengambang di bawah.
7. **Berhasil publish** — tampilkan link besar + tombol "Salin link" dan "Bagikan ke WhatsApp" langsung.

### 3.2 Dashboard
- Daftar halaman (card): nama, status (draft/published), jumlah pendaftar, tombol cepat (edit/lihat/Sheets).
- Detail 1 halaman: ringkasan jumlah pendaftar & pengunjung, tombol "Buka Google Sheets", tombol "Salin link WA konfirmasi".

### 3.3 Halaman publik hasil publish (yang dilihat calon peserta)
- Hero (judul, deskripsi singkat, 1 gambar/banner).
- Info jadwal/harga/paket.
- Form pendaftaran (sesuai field yang disusun pemilik).
- Setelah submit → layar konfirmasi + tombol besar "Konfirmasi via WhatsApp".

## 4. Komponen UI Kunci

- **Progress stepper** (builder multi-langkah).
- **Kartu halaman** (dashboard): status badge, angka pendaftar, menu aksi (⋯).
- **Form field builder row**: label, tipe, toggle wajib, drag handle urutan, tombol hapus.
- **Status koneksi** (Google Sheets): badge hijau "Terhubung" / abu "Belum terhubung" + tombol aksi.
- **Tombol WhatsApp CTA**: hijau WA brand, ikon WA, teks jelas ("Konfirmasi via WhatsApp").
- **Preview frame**: bingkai mirip bezel HP untuk preview mobile.

## 5. Yang Dihindari

- Drag-and-drop bebas / canvas kosong (bertentangan dengan prinsip "tanpa belajar").
- Terlalu banyak pilihan font/warna di awal (bikin ragu, bukan cepat).
- Modal bertingkat-tingkat; lebih baik alur linear per langkah.
- Dashboard dengan terlalu banyak angka/grafik di MVP — cukup angka pendaftar & link aksi cepat.
