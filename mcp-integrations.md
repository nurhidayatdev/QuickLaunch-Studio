# mcp-integrations.md — QuickLaunch Studio Builder

Catatan ini untuk AI agent/builder yang mendukung **MCP (Model Context Protocol)** — misalnya Claude Code, atau agent lain yang bisa memakai MCP server untuk mengakses layanan eksternal. Kalau builder/AI agent yang kamu pakai **tidak** mendukung MCP, abaikan file ini — fitur Google Sheets & WhatsApp di PRD tetap bisa dibangun lewat API biasa (REST), bukan wajib lewat MCP.

---

## 1. Kenapa MCP relevan di sini

Dua integrasi inti produk ini (lihat PRD §6) adalah:
1. **Google Sheets** — tiap submission form otomatis masuk ke Sheets milik pengguna.
2. **WhatsApp** — draf pesan konfirmasi otomatis lewat link `wa.me`.

Kalau development dilakukan dengan bantuan AI agent yang mendukung MCP, kedua integrasi ini **bisa dipercepat prosesnya saat development** (agent bisa langsung baca/tulis ke Sheets kamu untuk testing) — tapi perlu diingat: **MCP di sini membantu proses development/testing, bukan otomatis jadi arsitektur produk akhir.** Produk akhir (aplikasi yang dipakai klien QuickLaunch Studio) tetap harus punya integrasi Google Sheets API miliknya sendiri (OAuth per pengguna), bukan bergantung ke MCP server milik developer.

## 2. MCP server yang relevan saat development

| Kebutuhan | MCP server yang bisa dipakai saat build/testing | Catatan |
|---|---|---|
| Baca/tulis Google Sheets untuk testing alur submission | Google Drive/Sheets MCP (jika tersedia di tool AI agent kamu) | Dipakai developer untuk verifikasi data masuk dengan benar — bukan dipasang di produk akhir untuk tiap klien. |
| Simulasi notifikasi WhatsApp | Tidak perlu MCP khusus — cukup generate & uji link `wa.me/<nomor>?text=<pesan>` secara manual. | WhatsApp Business API resmi (kalau nanti mau auto-send, bukan cuma draf link) baru butuh integrasi terpisah, di luar MVP (lihat PRD §4.3 Non-Goals). |

## 3. Contoh konfigurasi (`mcp.json`) — opsional, hanya untuk tool AI yang mendukungnya

```json
{
  "mcpServers": {
    "google-drive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CREDENTIALS_PATH": "./credentials/gdrive-dev.json"
      }
    }
  }
}
```

> Ganti `GDRIVE_CREDENTIALS_PATH` dengan path credential Google OAuth milik akun developer (bukan akun klien). Ini murni alat bantu development/testing lokal.

## 4. Arsitektur integrasi di produk akhir (bukan MCP — ini yang dikerjakan AI builder)

- **Google Sheets:** setiap pengguna (panitia/UMKM) menghubungkan akun Google-nya sendiri lewat OAuth 2.0 standar (Google Sheets API + Apps Script atau Sheets API langsung). Token disimpan terenkripsi per pengguna. Lihat PRD §7 (Keamanan data).
- **WhatsApp:** cukup generate link `wa.me/<nomor_panitia>?text=<pesan_terisi_variabel>` di sisi klien (browser), tanpa backend WhatsApp khusus di MVP.

## 5. Catatan untuk AI agent yang mengerjakan proyek ini

Kalau kamu (AI agent) mendukung MCP dan dikasih akses ke MCP server (Google Drive/Sheets), **gunakan itu hanya untuk**:
- Memverifikasi skema data submission benar saat ditulis ke Sheets (kolom sesuai field form).
- Membuat sheet contoh untuk testing alur end-to-end.

**Jangan** merancang arsitektur produk akhir supaya tiap pengguna/klien QuickLaunch Studio butuh MCP server untuk bisa pakai aplikasi — itu tidak scalable untuk produk SaaS multi-tenant. Produk akhir harus pakai Google Sheets API + OAuth standar per pengguna, seperti dijelaskan di bagian 4 di atas.
