# QuickLaunch Studio — Comprehensive Design System & UI/UX Specification

> **Dokumen Standar Desain Resmi** untuk antarmuka web, builder studio, dashboard pelanggan, konsol operasional admin, dan mesin publikasi landing page.
> **Prinsip Utama:** Mewujudkan visual berkelas bisnis (*Modern SaaS Aesthetic*), elegan, berbobot, dan tidak polos (*not sterile/plain*), dengan tetap mempertahankan skor performa mobile PageSpeed ≥ 90.

---

## 1. Filosofi & Karakter Visual (*Design Language*)

QuickLaunch dirancang dengan gaya **"Modern Business Utility"** — memadukan kemudahan penggunaan alat no-code (ala Notion/Linear) dengan kredibilitas tinggi platform korporat/SaaS modern (ala Stripe/Vercel):

1. **Bukan Sekadar Putih Polos (*Visual Depth & Layering*):**
   - Menggunakan gradasi halus, aksen latar belakang radial (*ambient radial glows*), garis grid mikro, dan batas kontras lembut (*subtle borders*) untuk memberi kedalaman pada setiap seksi.
   - Menghindari halaman datar tanpa bayangan. Gunakan elevasi 3 lapis: *Surface Base* → *Card Canvas* → *Floating Elevation*.
2. **Kredibilitas Bisnis & Rasa Aman (*Enterprise Trust*):**
   - Calon peserta event maupun pembeli UMKM harus merasa sedang bertransaksi di platform resmi dan aman.
   - Terapkan badge status berkode warna (*emerald* untuk terverifikasi, *amber* untuk pending dengan efek denyut halus, *slate* untuk draft).
3. **Tipografi Berwibawa & Hirarki Tajam:**
   - Judul dengan *tracking-tight* (-0.025em), bobot tegas (Font 800/900), dan *micro-copy* pelengkap yang ringkas dan informatif.
   - Data numerik kritis (Kode Unik `QL-XXXX`, Nomor Pesanan, Nomor Rekening) wajib menggunakan font monospaced berjarak rapi.
4. **Mobile-First & Efisiensi Tanpa Bloat:**
   - Seluruh elemen memiliki target sentuh jempol minimum 44×44px.
   - Tanpa pustaka animasi berat pihak ketiga; gunakan transisi native Tailwind (`transition-all duration-200 ease-out`).

---

## 2. Fondasi Token Desain (*Design Tokens*)

### 2.1 Palet Warna Sistem (*Color Palette*)

#### A. Warna Dasar UI Builder & Dashboard (Neutral Slate & Dark Slate)
| Role | Hex | Tailwind Token | Penggunaan |
|---|---|---|---|
| **App Background** | `#F8FAFC` | `bg-slate-50` | Latar belakang seluruh dashboard & halaman |
| **Card Surface** | `#FFFFFF` | `bg-white` | Kontainer kartu, modal, dan formulir utama |
| **Border Neutral** | `#E2E8F0` | `border-slate-200` | Garis pembatas kartu dan separator halus |
| **Text Primary** | `#0F172A` | `text-slate-900` | Judul, heading utama, dan angka nominal |
| **Text Secondary** | `#475569` | `text-slate-600` | Teks paragraf, deskripsi form, dan instruksi |
| **Text Muted** | `#94A3B8` | `text-slate-400` | Label tanggal, footer, dan placeholder form |
| **Dark Header Base** | `#090D16` | `bg-slate-950` | Header kontras tinggi, banner hero gelap |

#### B. Warna Aksen & Status Fungsional
| Kategori | Warna Primer | Warna Latar/Badge | Arti / Penggunaan |
|---|---|---|---|
| **Brand Primary** | `#2563EB` (`blue-600`) | `#EFF6FF` (`blue-50`) | Tombol utama, tab aktif, ring focus, link |
| **Success / Approved** | `#059669` (`emerald-600`)| `#ECFDF5` (`emerald-50`)| Status pesanan disetujui, halaman live, sync sheets |
| **Warning / Pending** | `#D97706` (`amber-600`) | `#FFFBEB` (`amber-50`) | Menunggu konfirmasi admin, status draf |
| **Danger / Rejected** | `#DC2626` (`red-600`) | `#FEF2F2` (`red-50`) | Pesanan ditolak, kuota habis, aksi hapus |

#### C. Palet Terkurasi untuk Landing Page Publik (6 Pilihan Aksen)
1. **Biru Modern** (`#2563EB`) — Karakter korporat, teknologi, edukasi.
2. **Indigo Elektrik** (`#4F46E5`) — Karakter startup, webinar inovatif, workshop IT.
3. **Emerald Segar** (`#059669`) — Karakter lingkungan, kesehatan, makanan/minuman, komunitas.
4. **Amber Hangat** (`#D97706`) — Karakter kreatif, festival, kuliner UMKM, workshop seni.
5. **Rose Elegan** (`#E11D48`) — Karakter fashion, kecantikan, wedding, seminar eksklusif.
6. **Slate Minimalis** (`#334155`) — Karakter monokrom, minimalis estetik, arsitektur.

---

### 2.2 Tipografi & Hirarki Teks

Menggunakan sistem tipografi bawaan OS yang cepat dan bebas dari pemblokiran render jaringan (*zero-latency font stack*):
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

| Tingkatan | Kelas Tailwind | Karakteristik Visual | Penerapan |
|---|---|---|---|
| **Display H1** | `text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]` | Huruf ekstra tebal, rapat, tegas | Hero utama landing page, judul halaman publik |
| **Heading H2** | `text-xl sm:text-2xl font-extrabold tracking-tight` | Bobot tinggi, berwibawa | Judul seksi, nama halaman dashboard |
| **Heading H3** | `text-sm sm:text-base font-bold text-slate-900` | Tegas dan jelas | Judul kartu, header modal, subseksi builder |
| **Body Standard** | `text-sm text-slate-600 leading-relaxed` | Terbaca nyaman | Paragraf deskripsi event, benefit produk |
| **Micro Labels** | `text-xs font-semibold text-slate-700` | Huruf kecil namun berbobot | Label input formulir, judul tabel |
| **Monospace Data** | `font-mono text-xs sm:text-sm tracking-wider font-bold` | Spasi angka sama rata | Nomor rekening, kode tiket `#QL-XXXX`, slug |

---

### 2.3 Elevasi, Bayangan & Sudut Lengkung (*Depth & Radius*)

```css
/* Sudut Lengkung Standar */
--radius-input: 0.75rem;     /* 12px - rounded-xl: Input text, select, dropdown */
--radius-card: 1.25rem;      /* 20px - rounded-2xl: Kartu fitur, panel builder */
--radius-modal: 1.75rem;     /* 28px - rounded-3xl: Modal checkout, hero container */
--radius-pill: 9999px;       /* rounded-full: Status badge, chips kategori */

/* Bayangan Bertingkat Modern */
--shadow-subtle: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
--shadow-floating: 0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04);
--shadow-glow-blue: 0 10px 15px -3px rgb(37 99 235 / 0.2);
```

---

## 3. Spesifikasi Tampilan Per Halaman (*Screen Layouts*)

### 3.1 Landing Page Utama (`/`)
- **Hero Section:**
  - Latar belakang gradasi halus dari `bg-slate-50` dengan ambient glow melingkar di belakang headline.
  - Tag pill atas: `Platform Builder Mandiri untuk Panitia Event & UMKM` dengan ikon *Sparkles*.
  - Headline utama dengan garis bawah dekoratif aksen biru (`decoration-blue-200 underline-offset-8`).
  - Tombol CTA ganda: Tombol primer biru berbayangan warna (*glow shadow*) + tombol sekunder putih dengan batas elegan untuk melihat contoh publik.
  - Baris *Trust Badges* di bawah hero dengan ikon ceklis hijau emerald (Sekali Bayar, Transfer Bank/QRIS, Auto-Sync Sheets, WA Generator).
- **Seksi Cara Kerja (*3 Steps Bento*):**
  - Kartu bernomor besar semi-transparan (`01`, `02`, `03`) di sudut atas kartu sebagai aksen visual modern.
  - Ikon fitur dalam wadah persegi bertepi lengkung dengan warna latar belakang senada.
- **Seksi Harga & Pilihan Paket (*Pricing Cards*):**
  - Desain 3 kolom kartu berorientasi vertikal.
  - Kartu "Paling Populer" (Paket Pro) diberi garis tepi biru 2px, sedikit terangkat, dengan badge atas yang menonjol.
  - Tanda ceklis hijau pada setiap item benefit yang disertakan.
  - Banner metode pembayaran pendukung di bawah tabel harga (BCA, Mandiri, QRIS).
- **Seksi FAQ & Footer:**
  - Tampilan akordeon kartu bersih dengan ikon tanda tanya melingkar.
  - Footer profesional dengan nama studio, tautan navigasi, dan tahun hak cipta.

---

### 3.2 Dashboard Pengguna (`/dashboard`)
- **Top Utility Bar:**
  - Header yang menyatukan judul dashboard, badge kuota halaman (`Kuota: X / Y Halaman Terpakai`), dan tombol aksi cepat.
  - Indikator kuota berubah warna otomatis (Biru jika kuota tersedia, Merah lembut jika kuota habis dengan teks *"Upgrade Kuota"*).
- **Banner Pesanan Pending (Jika Sedang Transaksi):**
  - Komponen strip peringatan berlatar `amber-50` berbatas `amber-200` dengan ikon jam berdenyut lembut (*pulse*).
  - Teks rincian nomor pesanan, kuota yang akan didapat, serta tombol instan: `Konfirmasi ke Admin via WhatsApp`.
- **Grid Kartu Halaman (*Page Cards*):**
  - Badge kategori (Event/Produk) dan Badge status publikasi (*Draft* berwarna kuning amber, *Published* berwarna hijau emerald).
  - Judul halaman berbobot `font-bold` dengan *line-clamp* rapi.
  - Bar statistik ringkas: Jumlah pendaftar aktif (ikon pendaftar biru) dan total views kunjungan.
  - Footer kartu dengan aksi terkelompok: Tombol *"Rekap Data"*, Tombol *"Edit"*, Tombol *"Buka Link Publik"*, Tombol *"Duplikasi 1-Klik"*, dan Tombol Hapus dengan konfirmasi modal.

---

### 3.3 Konsol Operasional Admin (`/admin/payments`)
- **Header Operasional:**
  - Disertai lencana verifikasi: `🟢 Mode Operasional Aktif`.
  - Terbagi menjadi 3 tab navigasi utama:
    1. **Tab 1: Verifikasi Pembayaran** (dengan badge counter pesanan yang butuh tindakan).
    2. **Tab 2: Kelola Pengguna & Kuota** (pemantauan akun & tombol top-up kuota manual).
    3. **Tab 3: Rekening & Kontak** (editor dinamis nomor rekening bank & nomor WA admin).
- **Kartu Metrik Omzet:**
  - 3 kartu ringkasan visual: Pesanan Perlu Tindakan (Amber), Total Disetujui (Dark Slate), dan Total Omzet Rupiah (Emerald).
- **Daftar Pesanan & Bukti Transfer:**
  - Thumbnail screenshot bukti pembayaran dengan efek *hover zoom* dan ikon mata untuk membuka jendela preview ukuran penuh (*Image Zoom Modal*).
  - Tombol aksi berdampingan: Tombol merah lembut untuk *"Tolak"* (membuka modal input alasan) dan tombol hijau untuk *"Setujui Pembayaran"*.

---

### 3.4 Modal Checkout & Pembayaran Pelanggan (`PackageCheckoutModal`)
- **Alur 3 Langkah Tanpa Pindah Halaman (*In-Modal Stepper*):**
  - **Langkah 1: Pilih Paket:** Membandingkan kuota dan harga (Rp25rb, Rp50rb, Rp99rb).
  - **Langkah 2: Rincian Transfer & Bukti:**
    - Kartu virtual elegan berwarna gelap (`bg-gradient-to-br from-slate-900 to-slate-800`) yang menampilkan nomor rekening dengan tombol satu-klik **"Salin No. Rekening"** yang memberikan feedback checklist hijau.
    - Area *drag-and-drop* / klik untuk upload screenshot dengan pratinjau instan gambar dan nama file.
  - **Langkah 3: Sukses & Tombol WA Kilat:**
    - Ikon centang hijau besar, ringkasan nomor pesanan `#QL-XXXX-XXXX`, dan tombol hijau WhatsApp yang langsung membuka chat terformat ke nomor admin.

---

## 4. Desain 3 Template Halaman Publik (`/p/[slug]`)

Setiap template dibuat dengan struktur dan nuansa berbeda sesuai kebutuhan audiens:

| Template | Karakter Visual | Cocok Untuk | Detail Elemen Khas |
|---|---|---|---|
| **1. Modern Clean** | Gaya Notion & Linktree minimalis | Seminar kampus, pendaftaran umum | Latar putih bersih, card terpusat rapi, aksen warna pada garis atas dan tombol formulir |
| **2. Bold Minimalist** | Kontras tinggi gelap-terang (Dark Mode Header) | Webinar IT, tech workshop, hackathon | Header hitam pekat (`bg-slate-950`), tipografi tebal tegas, kartu form terapung dengan bayangan kontras |
| **3. Card Compact (Bento)** | Kartu modular terpisah ala Bento Grid | Katalog UMKM, komunitas, lomba | Hero info, rincian jadwal/harga, dan formulir pendaftaran terpisah dalam kartu-kartu ber-radius tinggi |

---

## 5. Standar Komponen Formulir & Input (*Form UX Standards*)

1. **State Input Terstandarisasi:**
   - **Default:** `border-slate-300 bg-white text-slate-900 placeholder:text-slate-400`
   - **Focus:** `focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100` (memberikan *glow ring* profesional yang jelas terlihat saat mengetik).
   - **Disabled:** `bg-slate-100 text-slate-400 cursor-not-allowed`
   - **Error / Invalid:** `border-red-500 focus:border-red-600 focus:ring-red-100 text-red-900`
2. **Keterbacaan Label:**
   - Selalu tempatkan label di atas input (bukan di dalam sebagai placeholder saja).
   - Berikan tanda bintang merah `*` untuk kolom yang wajib diisi.
3. **Penyusunan Form Pendaftaran Kustom (Builder Bagian 4):**
   - Setiap baris field pendaftaran memiliki grip handle pemindah urutan, label tipe data (*Teks, Email, WhatsApp, Pilihan Dropdown*), toggle status *Wajib Diisi*, dan tombol hapus cepat.

---

## 6. Audit Anti-Polos (*Polished vs Plain Checklist*)

Untuk memastikan seluruh tampilan selalu terlihat premium dan siap untuk bisnis komersial:

- [x] **Hindari Teks Gelap Murni `#000000`:** Gunakan `#0F172A` (`slate-900`) agar tipografi terasa lebih halus dan tidak kaku.
- [x] **Gunakan Border Halus Pada Setiap Kartu:** Tambahkan `border border-slate-200/80` di setiap kartu putih di atas latar abu-abu untuk memberi kontur tegas.
- [x] **Gunakan Ikon Semantik Berwarna Tonal:** Letakkan ikon di dalam kontainer kecil dengan latar belakang warna pastel senada (misal ikon biru di dalam `bg-blue-50`, ikon hijau di dalam `bg-emerald-50`).
- [x] **Tambahkan Indikator Status Hidup (*Live Pulsing Indicator*):** Gunakan bulatan kecil animasi denyut (`animate-pulse`) untuk status pesanan yang sedang menunggu atau status server live.
- [x] **Feedback Interaktif Pada Tombol Salin (*Copy Button Feedback*):** Saat nomor rekening atau tautan halaman disalin, tombol wajib berubah seketika menjadi ikon ceklis hijau bertuliskan *"Disalin!"* selama 2 detik.
- [x] **Frame Bezel Mobile Realistis:** Pratinjau mobile di editor menyertakan takik kamera atas (*notch*), slot speaker, dan bilah bawah layar HP (*home bar*).
