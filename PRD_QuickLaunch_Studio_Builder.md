# PRD: QuickLaunch Studio Builder

*Self-service tool untuk panitia event & UMKM bikin landing page + form pendaftaran otomatis + konfirmasi WhatsApp, dalam hitungan menit.*

Versi 0.1 · Draft untuk dikerjakan AI builder/agent · Diturunkan dari Proposal P2MW "QuickLaunch Studio"

---

## 1. Latar Belakang & Masalah

QuickLaunch Studio awalnya adalah **jasa manual**: tim membuatkan landing page untuk klien (panitia event kampus/komunitas, UMKM) secara satu-per-satu, lalu menghubungkannya ke Google Sheets dan menyiapkan draf konfirmasi WhatsApp.

Produk ini mengubah jasa itu menjadi **satu produk software self-service**, supaya:

- Klien bisa bikin landing page + form pendaftaran + tombol WA sendiri, tanpa menunggu tim mengerjakan manual.
- Tim QuickLaunch Studio bisa melayani lebih banyak klien tanpa menambah jam kerja linear.
- Proses yang tadinya 1–3 hari kerja (manual) bisa turun jadi hitungan menit untuk kasus-kasus standar.

**Masalah yang dialami target pengguna (dari riset di proposal):**

1. Promosi event/produk lewat poster + Google Form polos terlihat tidak resmi, calon peserta ragu membayar/mendaftar.
2. Broadcast WhatsApp berantai gampang tenggelam dan sulit dilacak.
3. Panitia kesulitan merekap pendaftaran secara rapi.
4. Jasa agensi web mahal (jutaan rupiah) dan lama (berminggu-minggu); website builder umum (Wix, dsb) butuh waktu belajar yang tidak dimiliki panitia yang kerja mendadak/volunteer.

## 2. Target Pengguna

| Segmen | Kebutuhan utama | Karakteristik |
| --- | --- | --- |
| Panitia event pemuda/kampus | Halaman pendaftaran + publikasi acara yang kredibel | Butuh cepat & murah, deadline mepet, terbiasa WhatsApp & Google Sheets |
| Komunitas/organisasi | Halaman event rutin + rekap peserta otomatis | Event berulang, cocok untuk pemakaian berkala |
| UMKM/pengusaha pemula lokal | Halaman promosi produk + tombol pesan | Anggaran terbatas, belum punya website, aktif di medsos |

**Early adopter prioritas:** panitia event dengan tiket berbayar, tenggat dekat, dan sudah pakai grup WhatsApp untuk promosi — kelompok ini paling cepat mengambil keputusan karena rasa sakitnya paling terasa.

## 3. Tujuan Produk & Metrik Sukses

**Tujuan:**

- Pengguna bisa menghasilkan landing page siap publikasi dalam < 15 menit, tanpa bantuan tim, tanpa perlu bisa coding.
- Setiap pendaftaran masuk otomatis ke Google Sheets milik pengguna (real-time), tanpa integrasi manual oleh tim.
- Setiap pendaftar mendapat draf pesan konfirmasi WhatsApp yang siap dikirim/di-klik.

**Metrik sukses MVP (90 hari pertama):**

- ≥ 90% halaman yang dipublikasikan punya skor PageSpeed (mobile) ≥ 90.
- ≥ 8 landing page aktif dibuat per bulan pada bulan ke-3 (selaras dengan target proposal).
- Rata-rata waktu dari "mulai bikin" sampai "publish" < 15 menit.
- ≥ 30% pengguna kembali membuat halaman kedua (repeat use) atau mereferensikan ke pihak lain.

## 4. Lingkup MVP (Scope)

### 4.1 Harus ada (in-scope MVP)

1. **Onboarding & pembuatan project**
   - Daftar/login (email atau nomor WhatsApp).
   - Pilih jenis halaman: Event (pendaftaran) atau Produk/UMKM (pemesanan).
2. **Page builder sederhana (template-based, bukan drag-and-drop bebas)**
   - Pilih 1 dari beberapa template landing page satu lembar (responsif, mobile-first).
   - Edit konten lewat form terstruktur: judul, deskripsi, jadwal/harga, gambar/logo, warna aksen, CTA.
   - Live preview sebelum publish.
3. **Form pendaftaran/pemesanan otomatis**
   - Builder form sederhana (field standar: nama, WA, email, pilihan tiket/paket + field custom terbatas).
   - Setiap submit form otomatis masuk ke **Google Sheets** milik pengguna (via koneksi akun Google / Apps Script, real-time).
4. **Konfirmasi WhatsApp**
   - Setelah submit, pendaftar diarahkan ke tombol "Konfirmasi via WhatsApp" yang membuka chat ke nomor WA panitia dengan draf pesan terisi otomatis (nama, pilihan, kode pendaftaran).
5. **Publikasi**
   - Publish ke subdomain gratis bawaan produk (mis. `nama-event.quicklaunch.id`) satu klik.
   - (Nice-to-have MVP, bukan wajib) opsi hubungkan domain kustom milik klien.
6. **Dashboard pemilik halaman**
   - Lihat jumlah pengunjung & pendaftar.
   - Lihat/duplikasi/edit/unpublish halaman.
   - Link cepat buka Google Sheets terkait.
7. **Paket & batasan pemakaian (selaras model bisnis di proposal)**
   - Free/Basic: 1 halaman aktif, tanpa domain kustom.
   - Standard: + integrasi Sheets & WA (jika Basic MVP sudah default include ini, Standard bisa jadi soal kuota halaman/traffic).
   - Premium: + media kit otomatis (lihat 4.3) & domain kustom.
   - (Pembayaran paket bisa manual/transfer dulu di MVP — lihat bagian Non-Goals.)

### 4.2 Boleh menyusul, bukan blocking MVP

- E-pass/tiket QR otomatis untuk setiap pendaftar (fitur Premium di proposal).
- Generator media kit visual (Story 9:16, Feed 1:1) + draf copywriting otomatis (bisa dibantu AI text/image generation).
- Mode langganan komunitas (multi-event dalam satu akun, branding komunitas).
- Analytics lanjutan (sumber traffic, funnel).

### 4.3 Di luar lingkup MVP (Non-Goals)

- Payment gateway terintegrasi (pembayaran tiket/produk langsung di halaman) — MVP cukup arahkan ke WA/transfer manual.
- Drag-and-drop page builder bebas (seperti Webflow) — MVP pakai template + form terstruktur saja.
- Multi-bahasa.
- White-label penuh untuk agensi lain.
- Native mobile app — cukup web responsif.

## 5. Alur Pengguna Utama (User Flow)

**Flow A — Bikin halaman event baru:**

1. Pengguna daftar/login.
2. Klik "Buat halaman baru" → pilih kategori (Event/Produk).
3. Pilih template.
4. Isi konten via form (judul, deskripsi, jadwal, harga/tiket, gambar, kontak WA panitia).
5. Susun form pendaftaran (field yang ingin diminta dari peserta).
6. Hubungkan/otorisasi Google Sheets (pilih bikin sheet baru otomatis atau pakai sheet existing).
7. Lihat live preview di tampilan mobile & desktop.
8. Publish → dapat link/subdomain.
9. Bagikan link ke grup WhatsApp/medsos.

**Flow B — Peserta mendaftar lewat halaman:**

1. Buka link landing page.
2. Isi form pendaftaran.
3. Submit → data masuk ke Google Sheets pemilik halaman secara real-time.
4. Peserta diarahkan/diberi tombol untuk konfirmasi ke WhatsApp panitia dengan draf pesan otomatis.

**Flow C — Pemilik memantau pendaftaran:**

1. Login ke dashboard.
2. Lihat ringkasan jumlah pendaftar per halaman.
3. Klik "Buka Google Sheets" untuk rekap detail/eksport.

## 6. Kebutuhan Fungsional (ringkas, siap jadi task untuk AI builder)

- [ ] Autentikasi pengguna (email/password atau OTP WhatsApp).
- [ ] CRUD project/halaman per pengguna.
- [ ] Minimal 3 template landing page responsif (event & produk) dengan slot konten dinamis.
- [ ] Form builder: tambah/hapus/urutkan field dasar (text, pilihan ganda, dropdown), tandai field wajib.
- [ ] Integrasi Google Sheets API: OAuth akun Google pengguna, buat/isi sheet otomatis saat ada submission baru.
- [ ] Generator link WhatsApp (`wa.me/...?text=...`) dengan template pesan yang bisa diisi variabel (nama, event, kode unik).
- [ ] Engine publish: generate halaman statis/SSR di subdomain unik, update saat ada perubahan konten.
- [ ] Dashboard ringkas: jumlah kunjungan (opsional, bisa pakai counter sederhana) & jumlah submission per halaman.
- [ ] Validasi performa dasar: gambar dikompres otomatis, lazy-load, supaya skor PageSpeed mobile terjaga ≥ 90.

## 7. Kebutuhan Non-Fungsional

- **Performa:** target skor PageSpeed (mobile) ≥ 90 untuk setiap halaman yang dipublikasikan — ini jadi nilai jual utama ("Canva-nya landing page event"), jangan dikompromikan demi fitur tambahan.
- **Biaya infrastruktur rendah:** gunakan hosting statis/serverless tier gratis-murah agar sejalan dengan model bisnis (biaya server nyaris nol).
- **Mobile-first:** mayoritas calon peserta/pembeli akan membuka link dari HP via WhatsApp/Instagram.
- **Kemudahan non-teknis:** pengguna target (panitia volunteer, UMKM) tidak boleh butuh skill coding/desain sama sekali.
- **Keamanan data:** data pendaftar (nama, kontak) cukup sensitif → koneksi ke Google Sheets harus pakai OAuth resmi, bukan simpan kredensial Google pengguna di server sendiri.

## 8. Model Data (garis besar)

- **User**: id, nama, email/WA, paket (basic/standard/premium).
- **Page/Project**: id, owner\_id, kategori (event/produk), template\_id, konten (judul, deskripsi, jadwal, harga, media), status (draft/published), subdomain/slug, custom\_domain (opsional), google\_sheet\_id.
- **FormField**: id, page\_id, label, tipe, wajib (boolean), urutan.
- **Submission**: id, page\_id, data (JSON sesuai field), timestamp, status\_sync\_sheet.
- **WhatsAppTemplate**: id, page\_id, isi\_pesan\_dengan\_variabel.

## 9. Kaitan dengan Model Bisnis (dari proposal, untuk konteks AI builder)

| Paket | Harga acuan proposal | Pemetaan ke fitur produk |
| --- | --- | --- |
| Basic | Rp250.000 | 1 landing page + domain kustom (di proposal; di produk self-service bisa jadi: halaman + subdomain gratis) |
| Standard | Rp500.000 | + integrasi Google Sheets real-time + tombol konfirmasi WA |
| Premium | Rp900.000 | + media kit (Story/Feed) + e-pass QR |
| Add-on | sesuai item | revisi tambahan, desain tambahan, pengerjaan kilat |
| Langganan komunitas | Rp150.000/bulan | multi-event dalam satu akun |

*Catatan: di versi self-service, sebagian batas paket ini akan jadi kuota/fitur-gate di aplikasi, bukan dikerjakan manual oleh tim lagi.*

## 10. Risiko & Pertanyaan Terbuka

- **Risiko performa vs kemudahan:** makin fleksibel editor, makin besar risiko skor PageSpeed turun — mitigasi: batasi pilihan ke template yang sudah dioptimasi, bukan editor bebas.
- **Ketergantungan Google Sheets API:** perlu pengguna meng-otorisasi akses Google — perlu alur OAuth yang jelas dan fallback jika otorisasi gagal/dicabut.
- **Verifikasi nomor WhatsApp panitia:** memastikan link `wa.me` mengarah ke nomor yang benar dan aktif.
- **Pertanyaan terbuka:** apakah MVP perlu sistem pembayaran paket di dalam aplikasi, atau cukup manual (transfer + aktivasi manual oleh tim) dulu untuk tahap awal?

## 11. Urutan Pengembangan yang Disarankan (untuk AI agent/builder)

1. Auth + CRUD halaman (tanpa publish dulu) dengan 1 template dasar.
2. Form builder + penyimpanan submission di database internal (belum ke Sheets).
3. Publish engine ke subdomain + live preview.
4. Integrasi Google Sheets (OAuth + auto-sync submission).
5. Generator link konfirmasi WhatsApp.
6. Dashboard ringkas pemilik halaman.
7. Tambah template ke-2 dan ke-3 + polish performa (PageSpeed).
