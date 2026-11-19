# TASKS.md — NEXORA

**Daftar Tugas Implementasi Prototype**

| Field | Nilai |
|---|---|
| Nama aplikasi | NEXORA |
| Versi dokumen | 1.1 |
| Tanggal | 19 November 2026 |
| Status | Implementasi selesai — tugas ditandai `[x]` dan diselaraskan dengan berkas aktual (Revisi 1.1) |
| Sumber fungsi & data | `SPEC.md` v1.1 (F-01…F-13, AC-01…AC-36, N-01…N-15) |
| Sumber UI | `UI-SPEC.md` v1.1 (D-01…D-05, A-01…A-16, Bagian 2–15) |
| Target | 8 jam efektif (480 menit) untuk 1 hari demonstrasi |

> **Catatan penting:** dokumen ini adalah catatan tugas yang **sudah direalisasikan**. Nama berkas pada tabel di bawah mengikuti struktur aktual aplikasi: `src/main.js` (router & event), `src/products.js` (data, kategori, format, ilustrasi SVG), `src/store.js` (state, validasi, localStorage), `src/ui.js` (seluruh render & escape HTML), `src/style.css` (semua design token), dan `public/assets/products/` (8 SVG produk). `SPEC.md` dan `UI-SPEC.md` telah diselaraskan dengan implementasi ini.

---

## 0. Konvensi Penulisan

### 0.1 Format Task

```text
TSK-xx | Nama tugas                         [ ]  Estimasi: xx mnt
Dependensi : TSK-yy
Deskripsi  : ...
Acceptance criteria:
  - [x] ...
Berkas yang mungkin berubah:
  | Berkas | Aksi | Catatan |
```

**Aksi pada berkas:**

| Label | Arti |
|---|---|
| `[B]` | Berkas baru dibuat |
| `[U]` | Berkas sudah ada, dimodifikasi |
| `[A]` | Aset lokal ditambahkan (SVG) |
| `[G]` | Generated, tidak diedit manual (`dist/`) |

### 0.2 Urutan Eksekusi Disarankan

Urutan bab di bawah mengikuti permintaan milestone. Karena ada ketergantungan data, **urutan pengerjaan yang disarankan** adalah:

```text
M1 Scaffold → M6 localStorage → M2 Katalog → M3 Search/Filter
→ M4 WhatsApp → M5 CRUD Dashboard → M7 Testing → M8 Security
→ M9 Build → M10 Deployment
```

Alasan: komponen katalog dan dashboard membutuhkan data dari `src/products.js` + state/`localStorage` dari `src/store.js` dari M6 lebih dulu. M6 sengaja ditempatkan terpisah sesuai permintaan, bukan di awal.

### 0.3 Ringkasan Milestone & Estimasi

| Milestone | Nama | Tugas | Estimasi | Dependensi utama |
|---|---|---:|---:|---|
| M1 | Scaffold | TSK-01…04 | 60 mnt | — |
| M2 | Katalog | TSK-05…08 | 75 mnt | M1, M6 |
| M3 | Interaksi pencarian/filter | TSK-09…11 | 45 mnt | M2 |
| M4 | WhatsApp | TSK-12…13 | 20 mnt | M2 |
| M5 | CRUD Dashboard | TSK-14…18 | 120 mnt | M6, M2 |
| M6 | localStorage | TSK-19…21 | 45 mnt | M1 |
| M7 | Testing | TSK-22…24 | 45 mnt | M1…M6 |
| M8 | Security | TSK-25…27 | 20 mnt | M1…M6 |
| M9 | Build | TSK-28…29 | 15 mnt | M7, M8 |
| M10 | Deployment | TSK-30…31 | 10 mnt | M9 |
| — | Buffer / perbaikan akhir | — | 25 mnt | — |
| **TOTAL** | | **31 tugas** | **480 mnt** | |

### 0.4 Pemetaan Milestone ke Spesifikasi

| Milestone | Fitur (`SPEC.md`) | AC | Referensi UI (`UI-SPEC.md`) |
|---|---|---|---|
| M1 | N-01, N-02, N-10 | AC-34, AC-36 | Bagian 2, 3.1, 3.2, 3.3 |
| M2 | F-01, F-02, F-03, F-07 | AC-01…04, AC-16, AC-17 | Bagian 6, 7, 12.1–12.3 |
| M3 | F-04, F-05, F-06 | AC-05…15 | Bagian 4, 5, 6.4 |
| M4 | F-08 | AC-18…20 | Bagian 8 |
| M5 | F-09, F-10, F-11, F-13 | AC-21…29, AC-31, AC-32 | Bagian 9, 12.4, 12.5 |
| M6 | F-12, F-13 | AC-01, AC-22, AC-30, AC-31 | Bagian 3.3, `SPEC.md` §4.2 |
| M7 | Semua | AC-01…36 | Bagian 10, 15 |
| M8 | N-03, N-04, N-05, N-13 | AC-04, AC-26…28, AC-36 | Bagian 1.3, 2.2, 8 |
| M9 | N-08 | AC-36 | Bagian 15 |
| M10 | N-15 | AC-36 | Bagian 16 |

---

## M1 — Scaffold

### TSK-01 — Inisialisasi proyek Vite vanilla `[x]`
**Estimasi:** 10 mnt · **Dependensi:** — · **Deskripsi:** Buat proyek Vite dengan template JavaScript Vanilla (tanpa framework), siapkan script `dev`, `build`, `preview`, dan `.gitignore`.

**Acceptance criteria:**
- [x] `npm install` dan `npm run dev` berhasil tanpa error.
- [x] `package.json` hanya berisi dependency `vite` (devDependency); tidak ada framework/library UI.
- [x] Tidak ada file `.env`, API key, token, atau kredensial.
- [x] `node_modules/` dan `dist/` masuk `.gitignore`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `package.json` | `[B]` | Script `dev`, `build`, `preview` |
| `vite.config.js` | `[B]` | Opsional; default Vite cukup |
| `.gitignore` | `[B]` | `node_modules`, `dist`, `.env*` |
| `index.html` | `[B]` | Entry HTML dasar |

---

### TSK-02 — Struktur folder modular `[x]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-01 · **Deskripsi:** Siapkan berkas `src/main.js`, `src/products.js`, `src/store.js`, `src/ui.js`, `src/style.css`, dan folder `public/assets/products/` sesuai N-02.

**Acceptance criteria:**
- [x] Berkas `src/main.js`, `src/products.js`, `src/store.js`, `src/ui.js`, `src/style.css` dan folder `public/assets/products/` tersedia.
- [x] `index.html` memuat `src/main.js` sebagai ES module (`type="module"`).
- [x] Tidak ada logika bisnis ditaruh di `index.html`.
- [x] Suatu konstanta (kategori, opsi sort, nomor WA) berada di satu berkas `src/products.js` (N-14).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `index.html` | `[U]` | Tag `<script type="module">` |
| `src/main.js` | `[B]` | Entry point kosong berisi inisialisasi |
| `src/products.js` | `[B]` | Enum kategori, opsi sort, `WA_NUMBER` |
| `public/assets/products/` | `[B]` | Folder aset lokal |

---

### TSK-03 — Design token & app shell `[x]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-02 · **Deskripsi:** Terapkan palet, tipografi, spacing, radius, glassmorphism, dan layout dasar dari `UI-SPEC.md` Bagian 2–3.

**Acceptance criteria:**
- [x] Semua token warna, font, spacing, radius di UI-SPEC Bagian 2 tersedia sebagai CSS custom properties.
- [x] Latar utama `#FFFFFF`, surface `#F4F6F5`, teks utama `#101116`, aksen mint `#10B981` dan teal `#14B8A6` dengan gradient `#5CE7A8 → #4ADABF`.
- [x] `#06231A` dipakai sebagai teks di atas gradient aksen; `#10B981` hanya untuk glow/border/ikon; teks aksen kecil memakai `#047857`.
- [x] `prefers-reduced-motion` dinonaktifkan untuk transisi dekoratif.
- [x] Container `max-width: 1200px`, padding 16px mobile dan 24px mulai 768px.
- [x] Halaman kosong bertema NEXORA tampil tanpa overflow horizontal di 375px.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/style.css` | `[B]` | Warna, font, spacing, radius, motion |
| `src/style.css` | `[B]` | Reset, body, typography, focus ring |
| `src/style.css` | `[B]` | Container, header, main, footer |
| `index.html` | `[U]` | Landmark `<header>`, `<main>`, `<footer>`, skip link |

---

### TSK-04 — Hash router, navbar, dan drawer mobile `[x]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-03 · **Deskripsi:** Router hash `#/`, `#/explore`, `#/categories`, `#/produk/:id`, `#/dashboard` plus navbar 4 menu dan drawer mobile.

**Acceptance criteria:**
- [x] Berpindah hash merender view yang benar tanpa reload penuh.
- [x] Navbar berisi logo NEXORA + `Home`, `Explore`, `Categories`, `Dashboard` (UI-SPEC §3.2).
- [x] Menu aktif punya underline gradient; fokus keyboard terlihat (ring mint 2px).
- [x] Di <768px hamburger 44×44px membuka drawer; `Escape`, overlay, dan tombol close menutupnya; fokus kembali ke hamburger.
- [x] `Explore` menggulir ke `#katalog`, `Categories` ke panel filter.
- [x] Tidak ada URL server yang perlu rewrite saat refresh.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/main.js` | `[B]` | Parser hash + event `hashchange` |
| `src/ui.js` | `[B]` | Navbar + drawer + active state |
| `src/main.js` | `[B]` | Dispatcher view |
| `src/main.js` | `[U]` | Inisialisasi router |
| `src/style.css` | `[B]` | Navbar, chip, button, badge |

---

## M2 — Katalog

### TSK-05 — Aset gambar lokal & fallback `[x]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-02 · **Deskripsi:** Siapkan 8 SVG produk yang mengilustrasikan deskripsi tiap produk dan fallback inline untuk gambar gagal dimuat.

**Acceptance criteria:**
- [x] Tersedia `nx-001.svg` … `nx-008.svg` di `public/assets/products/` dengan ilustrasi sesuai deskripsi produk dan palet mint/teal di atas latar terang.
- [x] Semua gambar dirujuk via path lokal `assets/products/...`, bukan URL eksternal.
- [x] Jika file gambar gagal dimuat, muncul placeholder fallback; tidak ada ikon browser rusak.
- [x] Ikon antarmuka berupa inline SVG lokal (search, star, edit, trash, WA, dll.).
- [x] Font `Inter`/`Space Grotesk` lokal opsional; jika tidak ada, fallback `system-ui` tetap terbaca.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `public/assets/products/nx-001.svg` … `nx-008.svg` | `[A]` | 8 file SVG ilustratif |
| `src/ui.js` | `[B]` | Kumpulan inline SVG & fallback |
| `src/main.js` | `[U]` | Handler `onerror` gambar |

---

### TSK-06 — Grid & product card `[x]`
**Estimasi:** 25 mnt · **Dependensi:** TSK-03, TSK-05, TSK-19 · **Deskripsi:** Render katalog default 8 produk dengan kartu sesuai UI-SPEC Bagian 6.

**Acceptance criteria:**
- [x] **AC-01, AC-02, AC-03:** tepat 8 kartu; nama sesuai `SPEC.md` §4.3; gambar, kategori, `Rp...`, stok, dan 4 badge unggulan tampil.
- [x] Gambar card ber-`aspect-ratio: 16/9`, radius 12px; card glass radius 16px.
- [x] Harga diformat `formatRupiah` → `Rp149.000` (bukan `NaN`/`undefined`).
- [x] Indikator stok: hijau >5, kuning 1–5, merah 0 + teks `Stok habis`.
- [x] Grid 4/3/2/1 kolom untuk ≥1280 / 1024–1279 / 768–1023 / <768px.
- [x] Hover kartu `translateY(-2px)` + glow halus; kartu tidak memakai `onclick`, tombol `View Details` tetap fokus via keyboard.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | Render grid + kartu |
| `src/products.js` | `[B]` | `formatRupiah()` |
| `src/products.js` | `[U]` | Daftar kategori & label chip |
| `src/style.css` | `[B]` | Hero, katalog, kartu |
| `src/style.css` | `[B]` | Breakpoint grid |

---

### TSK-07 — Hero section `[x]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-06 · **Deskripsi:** Bangun hero sesuai UI-SPEC Bagian 4 dengan dekorasi CSS murni.

**Acceptance criteria:**
- [x] Eyebrow, headline `Temukan Aset Digital untuk Karya Berikutnya.`, deskripsi, search bar, tombol `Explore Products →`, dan meta `8 produk • 6 kategori • 100% lokal` tampil.
- [x] Dekorasi orb/grid memakai CSS `radial-gradient`, `aria-hidden="true"`, `pointer-events: none`.
- [x] Di mobile dekorasi disembunyikan (`display: none`) dan headline tetap menjadi elemen pertama yang dibaca.
- [x] Tombol `Explore Products` menggulir ke `#katalog` dan fokus ke chip `Semua`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | Markup hero |
| `src/style.css` | `[U]` | Gradient & dekorasi hero |
| `src/main.js` | `[U]` | Pasang event CTA |

---

### TSK-08 — Halaman detail produk `[x]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-06 · **Deskripsi:** View `#/produk/:id` dengan informasi lengkap dan empty/not-found state.

**Acceptance criteria:**
- [x] **AC-16:** detail menampilkan gambar, nama, kategori, harga, stok, deskripsi lengkap, status unggulan, dan ID.
- [x] **AC-17:** tombol `Kembali ke katalog` ke katalog tanpa reload penuh.
- [x] Breadcrumb `Home / Kategori / Nama` tampil; `<dl>`informasi memakai `<dt>`/`<dd>`.
- [x] ID tidak ditemukan → panel `Produk tidak ditemukan` + tombol kembali, bukan halaman kosong.
- [x] Mobile 1 kolom; gambar 4:3; desktop 2 kolom 55/45.
- [x] `alt` gambar deskriptif sesuai nama produk.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[B]` | View detail + not-found |
| `src/main.js` | `[U]` | Route `#/produk/:id` |
| `src/style.css` | `[U]` | Layout detail |
| `src/store.js` | `[U]` | `getById()` (jika belum ada) |

---

## M3 — Interaksi Pencarian, Filter, dan Sorting

### TSK-09 — Search bar & pencarian live `[x]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-06, TSK-07 · **Deskripsi:** Search input di hero yang menyaring katalog secara langsung.

**Acceptance criteria:**
- [x] **AC-05:** `aurora` → hanya Aurora Landing Page (case-insensitive).
- [x] **AC-06:** `lightroom` → Cinematic Lightroom Set (kata kunci deskripsi).
- [x] **AC-07:** `preset` → Cinematic Lightroom Set (kata kunci kategori).
- [x] **AC-08:** input dikosongkan → 8 produk kembali.
- [x] Field yang dicari: `nama + kategori + deskripsi`; tombol clear `×` muncul saat ada teks dan mengembalikan fokus ke input.
- [x] `<label class="sr-only">` dan `aria-controls="product-grid"` hadir.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | Event input & state `search` |
| `src/products.js` | `[U]` | via enum kategori |
| `src/style.css` | `[U]` | State focus/filled search |
| `src/main.js` | `[U]` | State `filters.search` |

---

### TSK-10 — Filter kategori `[x]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-09 · **Deskripsi:** Chip filter `Semua` + 6 kategori dengan state aktif.

**Acceptance criteria:**
- [x] **AC-09:** `E-book` → 1 produk; `Website Template` → 2 produk.
- [x] **AC-10:** `Semua` → 8 produk.
- [x] Chip aktif memakai gradient mint→teal + `aria-pressed="true"`; status aktif tidak hanya warna.
- [x] Label chip `Preset` memiliki value `Preset Foto` (UI-SPEC D-01).
- [x] Mobile: chip scroll horizontal, tidak terpotong; desktop: wrap.
- [x] `role="group" aria-label="Filter kategori produk"` hadir.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | Render chip + handler |
| `src/products.js` | `[U]` | `label` vs `value` kategori |
| `src/style.css` | `[U]` | Chip default/active/hover |
| `src/style.css` | `[U]` | Scroll-snap mobile |

---

### TSK-11 — Sorting & result counter `[x]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-09, TSK-10 · **Deskripsi:** Native `<select>` 5 opsi sort, counter, dan reset filter.

**Acceptance criteria:**
- [x] **AC-11…AC-13:** urutan `harga-asc`, `harga-desc`, `nama-asc`, `nama-desc` sesuai SPEC §3.2.
- [x] **AC-14:** `terbaru` → `Futuristic Mockup Bundle` lebih dulu; setelah create, produk baru jadi pertama.
- [x] **AC-15:** search + filter + sort bisa dikombinasikan.
- [x] Nilai internal: `terbaru`, `harga-asc`, `harga-desc`, `nama-asc`, `nama-desc`; tie-breaker `id`.
- [x] Counter `Menampilkan X dari 8 produk` dengan `aria-live="polite"`; tombol `Reset filter` muncul saat ada filter aktif dan mengembalikan semua state.
- [x] Empty state katalog muncul saat hasil 0 (UI-SPEC §6.4).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | Pipeline search → filter → sort |
| `src/products.js` | `[U]` | `SORT_OPTIONS` |
| `src/main.js` | `[U]` | `aria-live` counter |
| `src/style.css` | `[U]` | Empty state |

---

## M4 — WhatsApp

### TSK-12 — Helper URL WhatsApp `[x]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-06 · **Deskripsi:** Satu fungsi `buildWhatsAppUrl(product)` sesuai `SPEC.md` §4.5.

**Acceptance criteria:**
- [x] `WA_NUMBER` didefinisikan sekali di `src/products.js` = `6280000000000`.
- [x] Pesan persis: `Halo NEXORA, saya tertarik dengan *${nama}* (${formatRupiah(harga)}). Apakah stok masih tersedia?`
- [x] URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`.
- [x] **AC-19:** setelah di-decode, pesan `nx-001` memuat `Neon Grid Canva Kit` dan `Rp149.000`.
- [x] Tidak ada request ke WhatsApp sebelum tombol diklik.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[B]` | `buildWhatsAppUrl()` |
| `src/products.js` | `[U]` | `WA_NUMBER` |
| `src/products.js` | `[U]` | Dipakai helper |

---

### TSK-13 — Tombol di halaman detail `[x]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-12, TSK-08 · **Deskripsi:** Pasang tombol `Pesan via WhatsApp` beserta gaya dan atribut keamanan.

**Acceptance criteria:**
- [x] **AC-18:** tombol membuka tab baru dengan URL diawali `https://wa.me/6280000000000?text=`.
- [x] **AC-20:** setelah CRUD, pesan mengikuti nama & harga terbaru.
- [x] Latar gradient `#5CE7A8 → #4ADABF`, teks `#06231A` (kontras 10.65:1 → 9.56:1); tinggi 48px; lebar penuh di mobile.
- [x] `target="_blank" rel="noopener noreferrer"` dan `aria-label` berisi nama + harga.
- [x] Teks bantuan `Membuka WhatsApp. Tidak ada pembayaran otomatis.` tampil.
- [x] Stok 0 tetap bisa inquiry (tanpa pembayaran).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | Tombol + teks bantuan |
| `src/style.css` | `[U]` | State hover/active/focus WA |
| `src/ui.js` | `[U]` | Integrasi dengan detail |

---

## M5 — CRUD Dashboard

### TSK-14 — Header dashboard & stat cards `[x]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-04, TSK-06 · **Deskripsi:** View `#/dashboard` dengan 4 stat card sesuai UI-SPEC §9.1–9.2.

**Acceptance criteria:**
- [x] **AC-21:** judul `Dashboard Pengelola`, badge `DEMO`, tombol `+ Tambah Produk` dan `Reset Data` tampil.
- [x] 4 kartu: Total Produk `8`, Total Stok `382`, Produk Unggulan `4`, **Jumlah Kategori `6`** (UI-SPEC D-02).
- [x] Angka dihitung dari state produk, bukan hardcode; berubah otomatis setelah create/update/delete/reset.
- [x] Jumlah kategori = kategori unik yang dipakai produk; 4 aksen kartu sesuai UI-SPEC.
- [x] Stat 4 kolom desktop, 2 kolom mobile.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[B]` | Header + stat |
| `src/store.js` | `[B]` | `getSummary()` |
| `src/style.css` | `[U]` | Stat card |
| `src/style.css` | `[U]` | 4/2 kolom |

---

### TSK-15 — Tabel desktop & kartu baris mobile `[x]`
**Estimasi:** 25 mnt · **Dependensi:** TSK-14 · **Deskripsi:** Read data produk dengan tampilan adaptif.

**Acceptance criteria:**
- [x] **AC-23:** tabel menampilkan gambar, nama, kategori, harga, stok, unggulan, dan aksi Edit/Hapus untuk tiap produk.
- [x] Desktop: header sticky; baris hover `rgba(15,23,42,.04)`; tombol aksi 44×44px.
- [x] Mobile <768px: tabel berubah menjadi kartu baris `[thumb] Nama / kategori · ★ / harga · stok / [Edit][Hapus]`.
- [x] Nama dan deskripsi dari data di-escape sebelum dirender (N-04).
- [x] Saat tidak ada produk, tabel menampilkan header tanpa baris; tombol `Tambah Produk` tetap tersedia di header.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | Tabel + row card |
| `src/ui.js` | `[B]` | `escapeHtml()` / helper aman |
| `src/style.css` | `[U]` | Tabel & kartu baris |
| `src/style.css` | `[U]` | Switch tabel → kartu |

---

### TSK-16 — Form create & edit `[x]`
**Estimasi:** 30 mnt · **Dependensi:** TSK-15 · **Deskripsi:** Modal/sheet form dengan 7 field sesuai UI-SPEC §9.4.

**Acceptance criteria:**
- [x] Judul `Tambah Produk` / `Edit Produk`; dialog `<dialog>` lebar `min(92vw, 520px)`; overlay `rgba(15,23,42,.45)` + blur.
- [x] Field: nama, kategori (`select`), harga (`number step 0.01`), stok (`inputmode numeric`), deskripsi (`textarea`), imageUrl, checkbox unggulan.
- [x] Edit menampilkan ID read-only; create menghasilkan ID otomatis unik (AC-29).
- [x] Setiap input punya `<label>`; `createdAt` tidak ditampilkan dan tidak bisa diedit.
- [x] `Escape` menutup form; fokus kembali ke tombol pemicu memakai perilaku native `<dialog>` (A-05, A-16).
- [x] Tombol `Simpan` primary gradient; `Batal` ghost.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[B]` | Form create/edit |
| `src/products.js` | `[U]` | `buildProduct()` + `generateId()` |
| `src/style.css` | `[U]` | Dialog, overlay |
| `src/main.js` | `[U]` | Event buka/tutup form |

---

### TSK-17 — Modul validasi input `[x]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-16 · **Deskripsi:** Validasi sesuai `SPEC.md` §4.1 dan F-10.

**Acceptance criteria:**
- [x] **AC-26:** `harga = -1000` ditolak; NaN/Infinity ditolak; maks 2 desimal.
- [x] **AC-27:** `stok = -5` dan `stok = 2.5` ditolak; `stok = 0` diterima; regex `/^\d+$/`.
- [x] **AC-28:** nama kosong/<3 karakter, kategori di luar enum, deskripsi kosong/<10 karakter ditolak.
- [x] `imageUrl` menerima path lokal / `data:image/`, menolak `http(s)://` (D-05).
- [x] Error tampil di bawah field (12px, `--danger`), `aria-invalid="true"`, `aria-describedby`, pesan spesifik.
- [x] Data tidak berubah saat validasi gagal (tidak ada mutasi state).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/store.js` | `[B]` | `validateProduct()` |
| `src/ui.js` | `[U]` | Tampilkan error inline |
| `src/products.js` | `[U]` | Enum kategori |
| `src/style.css` | `[U]` | State error field |

---

### TSK-18 — Aksi Create, Update, Delete, dan Reset `[x]`
**Estimasi:** 30 mnt · **Dependensi:** TSK-16, TSK-17, TSK-19 · **Deskripsi:** Wire aksi CRUD + dialog konfirmasi + toast.

**Acceptance criteria:**
- [x] **AC-22:** create valid → produk ke-9, total stok bertambah sesuai input.
- [x] **AC-24:** update harga/stok → tabel **dan** kartu katalog ikut berubah.
- [x] **AC-25:** delete → jumlah produk turun, stok berkurang; dialog `Hapus produk "${nama}"?` + `[Batal][Hapus]`.
- [x] **AC-31/AC-32:** reset → dialog konfirmasi; konfirmasi mengembalikan 8/382/4/6; batal tidak mengubah data.
- [x] Dialog `<dialog>` native, fokus ke `Batal`, `Escape` = batal, fokus kembali ke pemicu.
- [x] Toast success/error/info auto-hilang 4 detik dengan `role="status"` / `role="alert"`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | Handler CRUD & reset |
| `src/main.js` | `[B]` | Dialog konfirmasi |
| `src/ui.js` | `[B]` | Toast region |
| `src/store.js` | `[U]` | `save/delete/reset` |
| `src/style.css` | `[U]` | Dialog & toast |

---

## M6 — localStorage

### TSK-19 — Seed 8 produk & helper format `[x]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-02 · **Deskripsi:** Data awal fiktif sesuai `SPEC.md` §4.3 dan helper Rupiah.

**Acceptance criteria:**
- [x] 8 objek dengan field `id, nama, kategori, harga, stok, deskripsi, imageUrl, unggulan, createdAt`.
- [x] Nama, harga, stok, kategori, dan flag unggulan persis sesuai tabel `SPEC.md` §4.3.
- [x] `createdAt` menaik dari `nx-001` ke `nx-008` sehingga sort `terbaru` deterministik.
- [x] Deskripsi memuat kata kunci: `lightroom`, `preset`, `UI Kit`, `glassmorphism`, dll.
- [x] `formatRupiah(149000)` → `Rp149.000`; tidak ada `NaN`/`undefined`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/products.js` | `[B]` | 8 produk + createdAt |
| `src/products.js` | `[B]` | `formatRupiah()` |

---

### TSK-20 — Modul storage load/save/reset `[x]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-19 · **Deskripsi:** Persistensi dengan skema `{ version: 1, products: [...] }`.

**Acceptance criteria:**
- [x] Key localStorage = `nexora.catalog.v1`.
- [x] `load()` mengembalikan seed bila key belum ada, JSON korup, atau `version !== 1`.
- [x] Semua akses `getItem`/`setItem` dibungkus `try/catch`; tidak ada console error saat private mode/kuota penuh.
- [x] `save()` dipanggil setelah setiap create/update/delete/reset.
- [x] `reset()` mengganti seluruh data dengan deep copy seed (bukan referensi langsung).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/store.js` | `[B]` | `load/save/reset/getById` |
| `src/main.js` | `[U]` | Inisialisasi state dari `load()` |

---

### TSK-21 — Persistensi & sinkronisasi state `[x]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-20, TSK-18 · **Deskripsi:** Satu state produk sebagai sumber kebenaran untuk semua view.

**Acceptance criteria:**
- [x] **AC-30:** setelah CRUD, Refresh/F5 menampilkan data terubah.
- [x] Setelah mutasi, katalog + dashboard + detail merender ulang dari state yang sama.
- [x] Ringkasan dan counter dihitung ulang otomatis setelah render ulang.
- [x] Tidak ada dua salinan state yang bisa mismatch antar halaman.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/main.js` | `[U]` | State global + subscriber render |
| `src/main.js` | `[U]` | Render ulang semua view aktif |
| `src/store.js` | `[U]` | Integrasi save |

---

## M7 — Testing (Manual UAT)

> Sesuai `SPEC.md` §7, **testing otomatis berada di luar scope**. Milestone ini adalah uji manual terstruktur, bukan penambahan framework test.

### TSK-22 — UAT fungsional AC-01…AC-32 `[x]`
**Estimasi:** 20 mnt · **Dependensi:** M1…M6 · **Deskripsi:** Jalankan 36 kriteria fungsional dari `SPEC.md` Bagian 9.1–9.5.

**Acceptance criteria:**
- [x] AC-01…AC-08 (katalog & pencarian) dicentang semua.
- [x] AC-09…AC-15 (filter & sorting) dicentang semua.
- [x] AC-16…AC-20 (detail & WhatsApp) dicentang semua.
- [x] AC-21…AC-29 (CRUD & validasi) dicentang semua.
- [x] AC-30…AC-32 (persistensi & reset) dicentang semua.
- [x] Setiap kegagalan dicatat dengan langkah repro, hasil aktual, dan hasil expected.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `TASKS.md` | `[U]` | Centang status & catatan bug |
| `README.md` | `[B]` | Catatan alur demo (opsional) |

---

### TSK-23 — UAT UI, aksesibilitas & responsif `[x]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-22 · **Deskripsi:** Uji AC-33…AC-36 dan A-01…A-16 dari `UI-SPEC.md`.

**Acceptance criteria:**
- [x] AC-33: viewport 375px dan 1280px tanpa overflow horizontal/teks terpotong.
- [x] AC-34: netral terang + mint/teal + glassmorphism + hover halus konsisten di 3 view.
- [x] AC-35: Tab/Enter menjangkau search, filter, sort, dan tombol aksi; kartu tidak fokus, fokus terlihat.
- [x] AC-36: console browser bersih.
- [x] A-01…A-16 teruji, termasuk kontras tabel `UI-SPEC.md` §2.2 dan `Escape` pada drawer/dialog.
- [x] Wireframe `UI-SPEC.md` §12.1–12.5 sesuai implementasi tanpa perubahan struktur besar.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `TASKS.md` | `[U]` | Checklist A-01…A-16 |
| `src/style.css` | `[U]` | Perbaikan minor jika ada overflow |
| `src/style.css` | `[U]` | Perbaikan focus ring/kontras |

---

### TSK-24 — Regresi akhir & serah terima `[x]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-23 · **Deskripsi:** Ulangi alur inti setelah perbaikan dan siapkan demo script.

**Acceptance criteria:**
- [x] Alur demo: reset → cari → filter → sort → detail → WA → CRUD → refresh → reset lolos tanpa error.
- [x] Tidak ada bug blocker yang tersisa; bug minor dicatat sebagai catatan demo.
- [x] Ringkasan awal kembali 8 / 382 / 4 / 6 kategori setelah reset.
- [x] Status semua milestone diperbarui di `TASKS.md`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `TASKS.md` | `[U]` | Status akhir |
| `README.md` | `[U]` | Langkah demonstrasi |

---

## M8 — Security

### TSK-25 — Audit secret & ketergantungan eksternal `[x]`
**Estimasi:** 8 mnt · **Dependensi:** M1…M6 · **Deskripsi:** Pastikan tidak ada kredensial dan tidak ada request eksternal.

**Acceptance criteria:**
- [x] Tidak ada string `apiKey`, `token`, `password`, `secret`, atau file `.env` di repo.
- [x] `index.html`, CSS, dan JS tidak memuat CDN/Google Fonts/link eksternal.
- [x] Tab Network hanya menampil resource lokal; `wa.me` muncul hanya setelah klik tombol.
- [x] `package.json` tidak menambah dependency selain Vite.
- [x] Nomor WA adalah konstanta demo fiktif, bukan data pribadi.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `index.html` | `[U]` | Hapus tag eksternal jika ada |
| `package.json` | `[U]` | Pastikan dependency minimal |
| `README.md` | `[U]` | Catatan "nomor WA demo" |

---

### TSK-26 — Escaping & uji XSS `[x]`
**Estimasi:** 7 mnt · **Dependensi:** TSK-15, TSK-17 · **Deskripsi:** Cegah injeksi lewat data form/localStorage.

**Acceptance criteria:**
- [x] Input `<img src=x onerror=alert(1)>` pada nama/deskripsi tampil sebagai **teks**, tidak dieksekusi.
- [x] Tidak ada `innerHTML` yang menerima string dari form atau localStorage tanpa escape.
- [x] Payload localStorage yang dimanipulasi tidak menyebabkan error uncaught.
- [x] Pesan WA tetap ter-encode dengan `encodeURIComponent`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui.js` | `[U]` | `escapeHtml()` konsisten |
| `src/ui.js` | `[U]` | Render aman kartu |
| `src/ui.js` | `[U]` | Render aman detail |
| `src/ui.js` | `[U]` | Render aman tabel/form |

---

### TSK-27 — Validasi & tautan aman `[x]`
**Estimasi:** 5 mnt · **Dependensi:** TSK-17, TSK-20 · **Deskripsi:** Finalisasi boundary keamanan.

**Acceptance criteria:**
- [x] `imageUrl` eksternal `http(s)://` ditolak oleh validasi.
- [x] Tombol WA memakai `rel="noopener noreferrer"`.
- [x] `localStorage.setItem` gagal → toast error, aplikasi tetap usable.
- [x] Tidak ada backend, payment gateway, login, atau API call tersembunyi.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/store.js` | `[U]` | Cek imageUrl |
| `src/ui.js` | `[U]` | Atribut rel |
| `src/store.js` | `[U]` | try/catch setItem |

---

## M9 — Build

### TSK-28 — Build produksi `[x]`
**Estimasi:** 8 mnt · **Dependensi:** TSK-24, M8 · **Deskripsi:** Jalankan `npm run build` dan pastikan output valid.

**Acceptance criteria:**
- [x] `npm run build` sukses tanpa error/warning blocking.
- [x] Folder `dist/` berisi `index.html`, JS, CSS, dan aset SVG lokal.
- [x] Semua 8 SVG ikut ter-copy ke `dist/assets/products/`.
- [x] Tidak ada file `.env`/secret yang ikut ter-bundle.
- [x] Ukuran bundle kecil; tidak ada aset eksternal.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `dist/` | `[G]` | Generated, jangan diedit manual |
| `vite.config.js` | `[U]` | `base: './'` sudah diterapkan |
| `README.md` | `[U]` | Perintah build |

---

### TSK-29 — Verifikasi preview lokal `[x]`
**Estimasi:** 7 mnt · **Dependensi:** TSK-28 · **Deskripsi:** Uji hasil build dengan `npm run preview`.

**Acceptance criteria:**
- [x] `npm run preview` menyajikan aplikasi dari `dist/`.
- [x] Semua hash route berfungsi: `#/`, `#/explore`, `#/categories`, `#/produk/nx-001`, `#/dashboard`.
- [x] Refresh langsung di `#/produk/nx-001` tidak 404 (karena hash routing).
- [x] Gambar, font fallback, dan toast tampil normal; console bersih.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `vite.config.js` | `[U]` | `base: './'` untuk preview di subpath |
| `TASKS.md` | `[U]` | Status build |

---

## M10 — Deployment

> Sesuai `SPEC.md` §7, **CI/CD dan deployment produksi berada di luar scope**. Milestone ini hanya mencakup **publikasi demo statis** (lokal atau hosting statis manual).

### TSK-30 — Paket demo statis `[x]`
**Estimasi:** 5 mnt · **Dependensi:** TSK-29 · **Deskripsi:** Pastikan `dist/` bisa dipindah/diunggah apa adanya.

**Acceptance criteria:**
- [x] `dist/` dapat dibuka langsung melalui server statis tanpa konfigurasi rewrite/backend.
- [x] Path aset relatif sehingga tidak 404 saat dipindah folder.
- [x] Tidak ada variabel lingkungan yang dibutuhkan agar aplikasi berjalan.
- [x] Nomor WA demo didokumentasikan dan mudah diganti sebelum demonstrasi.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `dist/` | `[G]` | Hasil build final |
| `README.md` | `[U]` | Cara sajikan `dist/` |

---

### TSK-31 — Publikasi demo & catatan serah terima `[x]`
**Estimasi:** 5 mnt · **Dependensi:** TSK-30 · **Deskripsi:** Serahkan paket demo beserta instruksi singkat.

**Acceptance criteria:**
- [x] Demo dapat diakses dan seluruh AC utama masih lolos di lingkungan publikasi.
- [x] `README.md` memuat: `npm install`, `npm run dev`, `npm run build`, `npm run preview`, catatan WA demo, dan batasan "tanpa backend/login/pembayaran".
- [x] Tidak ada API key, token, atau data pribadi di paket publikasi.
- [x] Status akhir TASKS.md = selesai; DoD `SPEC.md` §11 dan `UI-SPEC.md` §15 terpenuhi.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `README.md` | `[U]` | Instruksi final |
| `TASKS.md` | `[U]` | Centang semua task |
| `dist/` | `[G]` | Versi final yang diserahkan |

---

## 11. Definition of Done TASKS.md

Dokumen tugas ini dianggap selesai ketika:

1. ✅ Kesepuluh milestone (scaffold, katalog, interaksi pencarian/filter, WhatsApp, CRUD dashboard, localStorage, testing, security, build, deployment) hadir dan berisi tugas dengan ID unik.
2. ✅ Setiap tugas memiliki **acceptance criteria** yang bisa dicentang manual dan daftar **berkas yang mungkin berubah**.
3. ✅ Seluruh AC-01…AC-36 dari `SPEC.md` terpetakan ke minimal satu tugas.
4. ✅ Seluruh A-01…A-16 dan penyesuaian D-01…D-05 dari `UI-SPEC.md` terakomodasi.
5. ✅ Total estimasi = 480 menit termasuk buffer 25 menit.
6. ✅ Urutan eksekusi yang disarankan memperlihatkan ketergantungan M6 sebelum M2/M5.
7. ✅ Batasan scope dijaga: tanpa backend, login palsu, payment gateway, API key, CDN, testing otomatis, dan CI/CD produksi.
8. ✅ Seluruh task telah direalisasikan di kode aplikasi dan tabel berkas mengikuti struktur aktual.

---

## 12. Catatan Penyerahan

`TASKS.md` adalah **catatan eksekusi yang sudah direalisasikan**. Sinkronisasi D-02 ke F-11/AC-21/AC-31 di `SPEC.md` telah dilakukan. Setiap perubahan scope selanjutnya dicatat sebagai revisi versi sebelum dikerjakan.
