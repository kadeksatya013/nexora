# TASKS.md — NEXORA

**Daftar Tugas Implementasi Prototype**

| Field | Nilai |
|---|---|
| Nama aplikasi | NEXORA |
| Versi dokumen | 1.0 |
| Tanggal | 19 November 2026 |
| Status | Rencana kerja, belum dieksekusi |
| Sumber fungsi & data | `SPEC.md` v1.0 (F-01…F-13, AC-01…AC-36, N-01…N-15) |
| Sumber UI | `UI-SPEC.md` v1.0 (D-01…D-05, A-01…A-16, Bagian 2–15) |
| Target | 8 jam efektif (480 menit) untuk 1 hari demonstrasi |

> **Catatan penting:** dokumen ini **hanya rencana tugas**. Tidak ada kode aplikasi yang dibuat atau diubah. `SPEC.md` dan `UI-SPEC.md` juga tidak dimodifikasi di sini.

---

## 0. Konvensi Penulisan

### 0.1 Format Task

```text
TSK-xx | Nama tugas                         [ ]  Estimasi: xx mnt
Dependensi : TSK-yy
Deskripsi  : ...
Acceptance criteria:
  - [ ] ...
Berkas yang mungkin berubah:
  | Berkas | Aksi | Catatan |
```

**Aksi pada berkas:**

| Label | Arti |
|---|---|
| `[B]` | Berkas baru dibuat |
| `[U]` | Berkas sudah ada, dimodifikasi |
| `[A]` | Aset lokal ditambahkan (SVG/woff2) |
| `[G]` | Generated, tidak diedit manual (`dist/`) |

### 0.2 Urutan Eksekusi Disarankan

Urutan bab di bawah mengikuti permintaan milestone. Karena ada ketergantungan data, **urutan pengerjaan yang disarankan** adalah:

```text
M1 Scaffold → M6 localStorage → M2 Katalog → M3 Search/Filter
→ M4 WhatsApp → M5 CRUD Dashboard → M7 Testing → M8 Security
→ M9 Build → M10 Deployment
```

Alasan: komponen katalog dan dashboard membutuhkan `seed.js` + `storage.js` dari M6 lebih dulu. M6 sengaja ditempatkan terpisah sesuai permintaan, bukan di awal.

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

### TSK-01 — Inisialisasi proyek Vite vanilla `[ ]`
**Estimasi:** 10 mnt · **Dependensi:** — · **Deskripsi:** Buat proyek Vite dengan template JavaScript Vanilla (tanpa framework), siapkan script `dev`, `build`, `preview`, dan `.gitignore`.

**Acceptance criteria:**
- [ ] `npm install` dan `npm run dev` berhasil tanpa error.
- [ ] `package.json` hanya berisi dependency `vite` (devDependency); tidak ada framework/library UI.
- [ ] Tidak ada file `.env`, API key, token, atau kredensial.
- [ ] `node_modules/` dan `dist/` masuk `.gitignore`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `package.json` | `[B]` | Script `dev`, `build`, `preview` |
| `vite.config.js` | `[B]` | Opsional; default Vite cukup |
| `.gitignore` | `[B]` | `node_modules`, `dist`, `.env*` |
| `index.html` | `[B]` | Entry HTML dasar |

---

### TSK-02 — Struktur folder modular `[ ]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-01 · **Deskripsi:** Siapkan struktur `src/data`, `src/lib`, `src/ui`, `src/styles`, dan `public/assets` sesuai N-02.

**Acceptance criteria:**
- [ ] Folder `src/data/`, `src/lib/`, `src/ui/`, `src/styles/`, `public/assets/products/` tersedia.
- [ ] `index.html` memuat `src/main.js` sebagai ES module (`type="module"`).
- [ ] Tidak ada logika bisnis ditaruh di `index.html`.
- [ ] Suatu konstanta (kategori, opsi sort, nomor WA) direncanakan di satu berkas `src/lib/constants.js` (N-14).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `index.html` | `[U]` | Tag `<script type="module">` |
| `src/main.js` | `[B]` | Entry point kosong berisi inisialisasi |
| `src/lib/constants.js` | `[B]` | Enum kategori, opsi sort, `WA_NUMBER` |
| `public/assets/products/` | `[B]` | Folder aset lokal |

---

### TSK-03 — Design token & app shell `[ ]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-02 · **Deskripsi:** Terapkan palet, tipografi, spacing, radius, glassmorphism, dan layout dasar dari `UI-SPEC.md` Bagian 2–3.

**Acceptance criteria:**
- [ ] Semua token warna, font, spacing, radius di UI-SPEC Bagian 2 tersedia sebagai CSS custom properties.
- [ ] Latar utama `#070B1A`, teks utama `#F5F7FF`, aksen purple `#A855F7` hanya untuk glow/border, cyan `#22D3EE`.
- [ ] `#C084FC` dipakai untuk teks ungu; tidak ada teks `#FFFFFF` di atas `#A855F7` polos.
- [ ] `prefers-reduced-motion` dinonaktifkan untuk transisi dekoratif.
- [ ] Container `max-width: 1200px`, padding 16/24/32px sesuai breakpoint.
- [ ] Halaman kosong bertema NEXORA tampil tanpa overflow horizontal di 375px.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/styles/tokens.css` | `[B]` | Warna, font, spacing, radius, motion |
| `src/styles/base.css` | `[B]` | Reset, body, typography, focus ring |
| `src/styles/layout.css` | `[B]` | Container, header, main, footer |
| `index.html` | `[U]` | Landmark `<header>`, `<main>`, `<footer>`, skip link |

---

### TSK-04 — Hash router, navbar, dan drawer mobile `[ ]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-03 · **Deskripsi:** Router hash `#/`, `#/explore`, `#/categories`, `#/produk/:id`, `#/dashboard` plus navbar 4 menu dan drawer mobile.

**Acceptance criteria:**
- [ ] Berpindah hash merender view yang benar tanpa reload penuh.
- [ ] Navbar berisi logo NEXORA + `Home`, `Explore`, `Categories`, `Dashboard` (UI-SPEC §3.2).
- [ ] Menu aktif punya underline gradient; fokus keyboard terlihat (ring cyan 2px).
- [ ] Di <768px hamburger 44×44px membuka drawer; `Escape`, overlay, dan tombol close menutupnya; fokus kembali ke hamburger.
- [ ] `Explore` menggulir ke `#katalog`, `Categories` ke panel filter.
- [ ] Tidak ada URL server yang perlu rewrite saat refresh.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/lib/router.js` | `[B]` | Parser hash + event `hashchange` |
| `src/ui/nav.js` | `[B]` | Navbar + drawer + active state |
| `src/ui/render.js` | `[B]` | Dispatcher view |
| `src/main.js` | `[U]` | Inisialisasi router |
| `src/styles/components.css` | `[B]` | Navbar, chip, button, badge |

---

## M2 — Katalog

### TSK-05 — Aset gambar lokal & fallback `[ ]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-02 · **Deskripsi:** Siapkan 8 SVG placeholder produk dan fallback inline untuk gambar gagal dimuat.

**Acceptance criteria:**
- [ ] Tersedia `nx-001.svg` … `nx-008.svg` di `public/assets/products/` dengan gaya navy/purple/cyan.
- [ ] Semua gambar dirujuk via path lokal `assets/products/...`, bukan URL eksternal.
- [ ] Jika file gambar gagal dimuat, muncul placeholder fallback; tidak ada ikon browser rusak.
- [ ] Ikon antarmuka berupa inline SVG lokal (search, star, edit, trash, WA, dll.).
- [ ] Font `Inter`/`Space Grotesk` lokal opsional; jika tidak ada, fallback `system-ui` tetap terbaca.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `public/assets/products/nx-001.svg` … `nx-008.svg` | `[A]` | 8 file placeholder |
| `public/assets/fonts/*.woff2` | `[A]` | Opsional |
| `src/ui/icons.js` | `[B]` | Kumpulan inline SVG |
| `src/ui/catalog.js` | `[B]` | Handler `onerror` gambar |

---

### TSK-06 — Grid & product card `[ ]`
**Estimasi:** 25 mnt · **Dependensi:** TSK-03, TSK-05, TSK-19 · **Deskripsi:** Render katalog default 8 produk dengan kartu sesuai UI-SPEC Bagian 6.

**Acceptance criteria:**
- [ ] **AC-01, AC-02, AC-03:** tepat 8 kartu; nama sesuai `SPEC.md` §4.3; gambar, kategori, `Rp...`, stok, dan 4 badge unggulan tampil.
- [ ] Gambar card ber-`aspect-ratio: 16/9`, radius 12px; card glass radius 16px.
- [ ] Harga diformat `formatRupiah` → `Rp149.000` (bukan `NaN`/`undefined`).
- [ ] Indikator stok: hijau >5, kuning 1–5, merah 0 + teks `Stok habis`.
- [ ] Grid 4/3/2/1 kolom untuk ≥1280 / 1024–1279 / 768–1023 / <768px.
- [ ] Hover kartu `translateY(-2px)` + glow halus; hanya tombol `View Details` yang fokus via keyboard.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/catalog.js` | `[U]` | Render grid + kartu |
| `src/lib/format.js` | `[B]` | `formatRupiah()` |
| `src/lib/constants.js` | `[U]` | Daftar kategori & label chip |
| `src/styles/views.css` | `[B]` | Hero, katalog, kartu |
| `src/styles/responsive.css` | `[B]` | Breakpoint grid |

---

### TSK-07 — Hero section `[ ]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-06 · **Deskripsi:** Bangun hero sesuai UI-SPEC Bagian 4 dengan dekorasi CSS murni.

**Acceptance criteria:**
- [ ] Eyebrow, headline `Temukan Aset Digital untuk Karya Berikutnya.`, deskripsi, search bar, tombol `Explore Products →`, dan meta `8 produk • 6 kategori • 100% lokal` tampil.
- [ ] Dekorasi orb/grid memakai CSS `radial-gradient`, `aria-hidden="true"`, `pointer-events: none`.
- [ ] Di mobile dekorasi dipangkas (`opacity: .5`) dan headline tetap menjadi elemen pertama yang dibaca.
- [ ] Tombol `Explore Products` menggulir ke `#katalog` dan fokus ke chip `Semua`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/catalog.js` | `[U]` | Markup hero |
| `src/styles/views.css` | `[U]` | Gradient & dekorasi hero |
| `src/ui/render.js` | `[U]` | Pasang event CTA |

---

### TSK-08 — Halaman detail produk `[ ]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-06 · **Deskripsi:** View `#/produk/:id` dengan informasi lengkap dan empty/not-found state.

**Acceptance criteria:**
- [ ] **AC-16:** detail menampilkan gambar, nama, kategori, harga, stok, deskripsi lengkap, status unggulan, dan ID.
- [ ] **AC-17:** tombol `← Kembali` ke katalog tanpa reload penuh.
- [ ] Breadcrumb `Home / Kategori / Nama` tampil; `<dl>`informasi memakai `<dt>`/`<dd>`.
- [ ] ID tidak ditemukan → panel `Produk tidak ditemukan` + tombol kembali, bukan halaman kosong.
- [ ] Mobile 1 kolom; gambar 4:3; desktop 2 kolom 55/45.
- [ ] `alt` gambar deskriptif sesuai nama produk.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/detail.js` | `[B]` | View detail + not-found |
| `src/ui/render.js` | `[U]` | Route `#/produk/:id` |
| `src/styles/views.css` | `[U]` | Layout detail |
| `src/lib/storage.js` | `[U]` | `getById()` (jika belum ada) |

---

## M3 — Interaksi Pencarian, Filter, dan Sorting

### TSK-09 — Search bar & pencarian live `[ ]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-06, TSK-07 · **Deskripsi:** Search input di hero yang menyaring katalog secara langsung.

**Acceptance criteria:**
- [ ] **AC-05:** `aurora` → hanya Aurora Landing Page (case-insensitive).
- [ ] **AC-06:** `lightroom` → Cinematic Lightroom Set (kata kunci deskripsi).
- [ ] **AC-07:** `preset` → Cinematic Lightroom Set (kata kunci kategori).
- [ ] **AC-08:** input dikosongkan → 8 produk kembali.
- [ ] Field yang dicari: `nama + kategori + deskripsi`; tombol clear `×` muncul saat ada teks dan mengembalikan fokus ke input.
- [ ] `<label class="sr-only">` dan `aria-controls="product-grid"` hadir.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/catalog.js` | `[U]` | Event input & state `search` |
| `src/lib/constants.js` | `[U]` | via enum kategori |
| `src/styles/components.css` | `[U]` | State focus/filled search |
| `src/main.js` | `[U]` | State `filters.search` |

---

### TSK-10 — Filter kategori `[ ]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-09 · **Deskripsi:** Chip filter `Semua` + 6 kategori dengan state aktif.

**Acceptance criteria:**
- [ ] **AC-09:** `E-book` → 1 produk; `Website Template` → 2 produk.
- [ ] **AC-10:** `Semua` → 8 produk.
- [ ] Chip aktif memakai gradient ungu + `aria-pressed="true"`; status aktif tidak hanya warna.
- [ ] Label chip `Preset` memiliki value `Preset Foto` (UI-SPEC D-01).
- [ ] Mobile: chip scroll horizontal, tidak terpotong; desktop: wrap.
- [ ] `role="group" aria-label="Filter kategori produk"` hadir.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/catalog.js` | `[U]` | Render chip + handler |
| `src/lib/constants.js` | `[U]` | `label` vs `value` kategori |
| `src/styles/components.css` | `[U]` | Chip default/active/hover |
| `src/styles/responsive.css` | `[U]` | Scroll-snap mobile |

---

### TSK-11 — Sorting & result counter `[ ]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-09, TSK-10 · **Deskripsi:** Native `<select>` 5 opsi sort, counter, dan reset filter.

**Acceptance criteria:**
- [ ] **AC-11…AC-13:** urutan `harga-asc`, `harga-desc`, `nama-asc`, `nama-desc` sesuai SPEC §3.2.
- [ ] **AC-14:** `terbaru` → `Futuristic Mockup Bundle` lebih dulu; setelah create, produk baru jadi pertama.
- [ ] **AC-15:** search + filter + sort bisa dikombinasikan.
- [ ] Nilai internal: `terbaru`, `harga-asc`, `harga-desc`, `nama-asc`, `nama-desc`; tie-breaker `id`.
- [ ] Counter `Menampilkan X dari 8 produk` dengan `aria-live="polite"`; tombol `Reset filter` muncul saat ada filter aktif dan mengembalikan semua state.
- [ ] Empty state katalog muncul saat hasil 0 (UI-SPEC §6.4).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/catalog.js` | `[U]` | Pipeline search → filter → sort |
| `src/lib/constants.js` | `[U]` | `SORT_OPTIONS` |
| `src/ui/render.js` | `[U]` | `aria-live` counter |
| `src/styles/views.css` | `[U]` | Empty state |

---

## M4 — WhatsApp

### TSK-12 — Helper URL WhatsApp `[ ]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-06 · **Deskripsi:** Satu fungsi `buildWhatsAppUrl(product)` sesuai `SPEC.md` §4.5.

**Acceptance criteria:**
- [ ] `WA_NUMBER` didefinisikan sekali di `src/lib/constants.js` = `6280000000000`.
- [ ] Pesan persis: `Halo NEXORA, saya tertarik dengan *${nama}* (${formatRupiah(harga)}). Apakah stok masih tersedia?`
- [ ] URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`.
- [ ] **AC-19:** setelah di-decode, pesan `nx-001` memuat `Neon Grid Canva Kit` dan `Rp149.000`.
- [ ] Tidak ada request ke WhatsApp sebelum tombol diklik.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/lib/whatsapp.js` | `[B]` | `buildWhatsAppUrl()` |
| `src/lib/constants.js` | `[U]` | `WA_NUMBER` |
| `src/lib/format.js` | `[U]` | Dipakai helper |

---

### TSK-13 — Tombol di halaman detail `[ ]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-12, TSK-08 · **Deskripsi:** Pasang tombol `Pesan via WhatsApp` beserta gaya dan atribut keamanan.

**Acceptance criteria:**
- [ ] **AC-18:** tombol membuka tab baru dengan URL diawali `https://wa.me/6280000000000?text=`.
- [ ] **AC-20:** setelah CRUD, pesan mengikuti nama & harga terbaru.
- [ ] Latar cyan `#22D3EE`, teks navy `#070B1A` (kontras 10.84:1); tinggi 48px; lebar penuh di mobile.
- [ ] `target="_blank" rel="noopener noreferrer"` dan `aria-label` berisi nama + harga.
- [ ] Teks bantuan `Membuka WhatsApp. Tidak ada pembayaran otomatis.` tampil.
- [ ] Stok 0 tetap bisa inquiry (tanpa pembayaran).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/detail.js` | `[U]` | Tombol + teks bantuan |
| `src/styles/views.css` | `[U]` | State hover/active/focus WA |
| `src/lib/whatsapp.js` | `[U]` | Integrasi dengan detail |

---

## M5 — CRUD Dashboard

### TSK-14 — Header dashboard & stat cards `[ ]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-04, TSK-06 · **Deskripsi:** View `#/dashboard` dengan 4 stat card sesuai UI-SPEC §9.1–9.2.

**Acceptance criteria:**
- [ ] **AC-21:** judul `DASHBOARD PENGELOLA`, badge `DEMO`, tombol `+ Tambah Produk` dan `Reset Data` tampil.
- [ ] 4 kartu: Total Produk `8`, Total Stok `382`, Produk Unggulan `4`, **Jumlah Kategori `6`** (UI-SPEC D-02).
- [ ] Angka dihitung dari state produk, bukan hardcode; berubah otomatis setelah create/update/delete/reset.
- [ ] Jumlah kategori = kategori unik yang dipakai produk; 4 aksen kartu sesuai UI-SPEC.
- [ ] Stat 4 kolom desktop, 2 kolom mobile.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/dashboard.js` | `[B]` | Header + stat |
| `src/lib/stats.js` | `[B]` | `computeSummary(products)` |
| `src/styles/views.css` | `[U]` | Stat card |
| `src/styles/responsive.css` | `[U]` | 4/2 kolom |

---

### TSK-15 — Tabel desktop & kartu baris mobile `[ ]`
**Estimasi:** 25 mnt · **Dependensi:** TSK-14 · **Deskripsi:** Read data produk dengan tampilan adaptif.

**Acceptance criteria:**
- [ ] **AC-23:** tabel menampilkan gambar, nama, kategori, harga, stok, unggulan, dan aksi Edit/Hapus untuk tiap produk.
- [ ] Desktop: header sticky; baris hover `rgba(148,163,255,.05)`; tombol aksi 44×44px.
- [ ] Mobile <768px: tabel berubah menjadi kartu baris `[thumb] Nama / kategori · ★ / harga · stok / [Edit][Hapus]`.
- [ ] Nama dan deskripsi dari data di-escape sebelum dirender (N-04).
- [ ] Empty state saat tidak ada produk: teks + tombol `Tambah Produk`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/dashboard.js` | `[U]` | Tabel + row card |
| `src/lib/dom.js` | `[B]` | `escapeHtml()` / helper aman |
| `src/styles/views.css` | `[U]` | Tabel & kartu baris |
| `src/styles/responsive.css` | `[U]` | Switch tabel → kartu |

---

### TSK-16 — Form create & edit `[ ]`
**Estimasi:** 30 mnt · **Dependensi:** TSK-15 · **Deskripsi:** Modal/sheet form dengan 7 field selon UI-SPEC §9.4.

**Acceptance criteria:**
- [ ] Judul `Tambah Produk` / `Edit Produk`; desktop panel 420px, mobile sheet penuh; overlay gelap.
- [ ] Field: nama, kategori (`select`), harga (`number step 0.01`), stok (`inputmode numeric`), deskripsi (`textarea`), imageUrl, checkbox unggulan.
- [ ] Edit menampilkan ID read-only; create menghasilkan ID otomatis unik (AC-29).
- [ ] Setiap input punya `<label>`; `createdAt` tidak ditampilkan dan tidak bisa diedit.
- [ ] `Escape` menutup form; fokus kembali ke tombol pemicu (A-05, A-16).
- [ ] Tombol `Simpan` primary gradient; `Batal` ghost.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/product-form.js` | `[B]` | Form create/edit |
| `src/lib/storage.js` | `[U]` | `createProduct()` generator id |
| `src/styles/components.css` | `[U]` | Modal/sheet, overlay |
| `src/ui/render.js` | `[U]` | Event buka/tutup form |

---

### TSK-17 — Modul validasi input `[ ]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-16 · **Deskripsi:** Validasi sesuai `SPEC.md` §4.1 dan F-10.

**Acceptance criteria:**
- [ ] **AC-26:** `harga = -1000` ditolak; NaN/Infinity ditolak; maks 2 desimal.
- [ ] **AC-27:** `stok = -5` dan `stok = 2.5` ditolak; `stok = 0` diterima; regex `/^\d+$/`.
- [ ] **AC-28:** nama kosong/<3 karakter, kategori di luar enum, deskripsi kosong/<10 karakter ditolak.
- [ ] `imageUrl` menerima path lokal / `data:image/`, menolak `http(s)://` (D-05).
- [ ] Error tampil di bawah field (12px, `--danger`), `aria-invalid="true"`, `aria-describedby`, pesan spesifik.
- [ ] Data tidak berubah saat validasi gagal (tidak ada mutasi state).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/lib/validation.js` | `[B]` | `validateProduct()` |
| `src/ui/product-form.js` | `[U]` | Tampilkan error inline |
| `src/lib/constants.js` | `[U]` | Enum kategori |
| `src/styles/components.css` | `[U]` | State error field |

---

### TSK-18 — Aksi Create, Update, Delete, dan Reset `[ ]`
**Estimasi:** 30 mnt · **Dependensi:** TSK-16, TSK-17, TSK-19 · **Deskripsi:** Wire aksi CRUD + dialog konfirmasi + toast.

**Acceptance criteria:**
- [ ] **AC-22:** create valid → produk ke-9, total stok bertambah sesuai input.
- [ ] **AC-24:** update harga/stok → tabel **dan** kartu katalog ikut berubah.
- [ ] **AC-25:** delete → jumlah produk turun, stok berkurang; dialog `Hapus produk "${nama}"?` + `[Batal][Hapus]`.
- [ ] **AC-31/AC-32:** reset → dialog konfirmasi; konfirmasi mengembalikan 8/382/4; batal tidak mengubah data.
- [ ] Dialog `<dialog>` native, fokus ke `Batal`, `Escape` = batal, fokus kembali ke pemicu.
- [ ] Toast success/error/info auto-hilang 4 detik dengan `role="status"` / `role="alert"`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/ui/dashboard.js` | `[U]` | Handler CRUD & reset |
| `src/ui/confirm.js` | `[B]` | Dialog konfirmasi |
| `src/ui/toast.js` | `[B]` | Toast region |
| `src/lib/storage.js` | `[U]` | `save/delete/reset` |
| `src/styles/components.css` | `[U]` | Dialog & toast |

---

## M6 — localStorage

### TSK-19 — Seed 8 produk & helper format `[ ]`
**Estimasi:** 20 mnt · **Dependensi:** TSK-02 · **Deskripsi:** Data awal fiktif sesuai `SPEC.md` §4.3 dan helper Rupiah.

**Acceptance criteria:**
- [ ] 8 objek dengan field `id, nama, kategori, harga, stok, deskripsi, imageUrl, unggulan, createdAt`.
- [ ] Nama, harga, stok, kategori, dan flag unggulan persis sesuai tabel `SPEC.md` §4.3.
- [ ] `createdAt` menaik dari `nx-001` ke `nx-008` sehingga sort `terbaru` deterministik.
- [ ] Deskripsi memuat kata kunci: `lightroom`, `preset`, `UI Kit`, `glassmorphism`, dll.
- [ ] `formatRupiah(149000)` → `Rp149.000`; tidak ada `NaN`/`undefined`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/data/seed.js` | `[B]` | 8 produk + createdAt |
| `src/lib/format.js` | `[B]` | `formatRupiah()` |

---

### TSK-20 — Modul storage load/save/reset `[ ]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-19 · **Deskripsi:** Persistensi dengan skema `{ version: 1, products: [...] }`.

**Acceptance criteria:**
- [ ] Key localStorage = `nexora.catalog.v1`.
- [ ] `load()` mengembalikan seed bila key belum ada, JSON korup, atau `version !== 1`.
- [ ] Semua akses `getItem`/`setItem` dibungkus `try/catch`; tidak ada console error saat private mode/kuota penuh.
- [ ] `save()` dipanggil setelah setiap create/update/delete/reset.
- [ ] `reset()` mengganti seluruh data dengan deep copy seed (bukan referensi langsung).

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/lib/storage.js` | `[B]` | `load/save/reset/getById` |
| `src/main.js` | `[U]` | Inisialisasi state dari `load()` |

---

### TSK-21 — Persistensi & sinkronisasi state `[ ]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-20, TSK-18 · **Deskripsi:** Satu state produk sebagai sumber kebenaran untuk semua view.

**Acceptance criteria:**
- [ ] **AC-30:** setelah CRUD, Refresh/F5 menampilkan data terubah.
- [ ] Setelah mutasi, katalog + dashboard + detail merender ulang dari state yang sama.
- [ ] Ringkasan dan counter dihitung ulang otomatis setelah render ulang.
- [ ] Tidak ada dua salinan state yang bisa mismatch antar halaman.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/main.js` | `[U]` | State global + subscriber render |
| `src/ui/render.js` | `[U]` | Render ulang semua view aktif |
| `src/lib/storage.js` | `[U]` | Integrasi save |

---

## M7 — Testing (Manual UAT)

> Sesuai `SPEC.md` §7, **testing otomatis berada di luar scope**. Milestone ini adalah uji manual terstruktur, bukan penambahan framework test.

### TSK-22 — UAT fungsional AC-01…AC-32 `[ ]`
**Estimasi:** 20 mnt · **Dependensi:** M1…M6 · **Deskripsi:** Jalankan 32 kriteria fungsional dari `SPEC.md`Bagian 9.1–9.5.

**Acceptance criteria:**
- [ ] AC-01…AC-08 (katalog & pencarian) dicentang semua.
- [ ] AC-09…AC-15 (filter & sorting) dicentang semua.
- [ ] AC-16…AC-20 (detail & WhatsApp) dicentang semua.
- [ ] AC-21…AC-29 (CRUD & validasi) dicentang semua.
- [ ] AC-30…AC-32 (persistensi & reset) dicentang semua.
- [ ] Setiap kegagalan dicatat dengan langkah repro, hasil aktual, dan hasil expected.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `TASKS.md` | `[U]` | Centang status & catatan bug |
| `README.md` | `[B]` | Catatan alur demo (opsional) |

---

### TSK-23 — UAT UI, aksesibilitas & responsif `[ ]`
**Estimasi:** 15 mnt · **Dependensi:** TSK-22 · **Deskripsi:** Uji AC-33…AC-36 dan A-01…A-16 dari `UI-SPEC.md`.

**Acceptance criteria:**
- [ ] AC-33: viewport 375px dan 1440px tanpa overflow horizontal/teks terpotong.
- [ ] AC-34: navy + purple/cyan + glassmorphism + hover halus konsisten di 3 view.
- [ ] AC-35: Tab/Enter menjangkau search, filter, sort, kartu, tombol aksi; fokus terlihat.
- [ ] AC-36: console browser bersih.
- [ ] A-01…A-16 teruji, termasuk kontras tabel `UI-SPEC.md` §2.2 dan `Escape` pada drawer/dialog.
- [ ] Wireframe `UI-SPEC.md` §12.1–12.5 sesuai implementasi tanpa perubahan struktur besar.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `TASKS.md` | `[U]` | Checklist A-01…A-16 |
| `src/styles/responsive.css` | `[U]` | Perbaikan minor jika ada overflow |
| `src/styles/base.css` | `[U]` | Perbaikan focus ring/kontras |

---

### TSK-24 — Regresi akhir & serah terima `[ ]`
**Estimasi:** 10 mnt · **Dependensi:** TSK-23 · **Deskripsi:** Ulangi alur inti setelah perbaikan dan siapkan demo script.

**Acceptance criteria:**
- [ ] Alur demo: reset → cari → filter → sort → detail → WA → CRUD → refresh → reset lolos tanpa error.
- [ ] Tidak ada bug blocker yang tersisa; bug minor dicatat sebagai catatan demo.
- [ ] Ringkasan awal kembali 8 / 382 / 4 / 6 kategori setelah reset.
- [ ] Status semua milestone diperbarui di `TASKS.md`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `TASKS.md` | `[U]` | Status akhir |
| `README.md` | `[U]` | Langkah demonstrasi |

---

## M8 — Security

### TSK-25 — Audit secret & ketergantungan eksternal `[ ]`
**Estimasi:** 8 mnt · **Dependensi:** M1…M6 · **Deskripsi:** Pastikan tidak ada kredensial dan tidak ada request eksternal.

**Acceptance criteria:**
- [ ] Tidak ada string `apiKey`, `token`, `password`, `secret`, atau file `.env` di repo.
- [ ] `index.html`, CSS, dan JS tidak memuat CDN/Google Fonts/link eksternal.
- [ ] Tab Network hanya menampil resource lokal; `wa.me` muncul hanya setelah klik tombol.
- [ ] `package.json` tidak menambah dependency selain Vite.
- [ ] Nomor WA adalah konstanta demo fiktif, bukan data pribadi.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `index.html` | `[U]` | Hapus tag eksternal jika ada |
| `package.json` | `[U]` | Pastikan dependency minimal |
| `README.md` | `[U]` | Catatan "nomor WA demo" |

---

### TSK-26 — Escaping & uji XSS `[ ]`
**Estimasi:** 7 mnt · **Dependensi:** TSK-15, TSK-17 · **Deskripsi:** Cegah injeksi lewat data form/localStorage.

**Acceptance criteria:**
- [ ] Input `<img src=x onerror=alert(1)>` pada nama/deskripsi tampil sebagai **teks**, tidak dieksekusi.
- [ ] Tidak ada `innerHTML` yang menerima string dari form atau localStorage tanpa escape.
- [ ] Payload localStorage yang dimanipulasi tidak menyebabkan error uncaught.
- [ ] Pesan WA tetap ter-encode dengan `encodeURIComponent`.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/lib/dom.js` | `[U]` | `escapeHtml()` konsisten |
| `src/ui/catalog.js` | `[U]` | Render aman kartu |
| `src/ui/detail.js` | `[U]` | Render aman detail |
| `src/ui/dashboard.js` | `[U]` | Render aman tabel/form |

---

### TSK-27 — Validasi & tautan aman `[ ]`
**Estimasi:** 5 mnt · **Dependensi:** TSK-17, TSK-20 · **Deskripsi:** Finalisasi boundary keamanan.

**Acceptance criteria:**
- [ ] `imageUrl` eksternal `http(s)://` ditolak oleh validasi.
- [ ] Tombol WA memakai `rel="noopener noreferrer"`.
- [ ] `localStorage.setItem` gagal → toast error, aplikasi tetap usable.
- [ ] Tidak ada backend, payment gateway, login, atau API call tersembunyi.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `src/lib/validation.js` | `[U]` | Cek imageUrl |
| `src/lib/whatsapp.js` | `[U]` | Atribut rel |
| `src/lib/storage.js` | `[U]` | try/catch setItem |

---

## M9 — Build

### TSK-28 — Build produksi `[ ]`
**Estimasi:** 8 mnt · **Dependensi:** TSK-24, M8 · **Deskripsi:** Jalankan `npm run build` dan pastikan output valid.

**Acceptance criteria:**
- [ ] `npm run build` sukses tanpa error/warning blocking.
- [ ] Folder `dist/` berisi `index.html`, JS, CSS, dan aset SVG lokal.
- [ ] Semua 8 SVG ikut ter-copy ke `dist/assets/products/`.
- [ ] Tidak ada file `.env`/secret yang ikut ter-bundle.
- [ ] Ukuran bundle kecil; tidak ada aset eksternal.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `dist/` | `[G]` | Generated, jangan diedit manual |
| `vite.config.js` | `[U]` | Opsional, jika perlu `base: './'` |
| `README.md` | `[U]` | Perintah build |

---

### TSK-29 — Verifikasi preview lokal `[ ]`
**Estimasi:** 7 mnt · **Dependensi:** TSK-28 · **Deskripsi:** Uji hasil build dengan `npm run preview`.

**Acceptance criteria:**
- [ ] `npm run preview` menyajikan aplikasi dari `dist/`.
- [ ] Semua hash route berfungsi: `#/`, `#/explore`, `#/categories`, `#/produk/nx-001`, `#/dashboard`.
- [ ] Refresh langsung di `#/produk/nx-001` tidak 404 (karena hash routing).
- [ ] Gambar, font fallback, dan toast tampil normal; console bersih.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `vite.config.js` | `[U]` | `base: './'` jika preview di subpath |
| `TASKS.md` | `[U]` | Status build |

---

## M10 — Deployment

> Sesuai `SPEC.md` §7, **CI/CD dan deployment produksi berada di luar scope**. Milestone ini hanya mencakup **publikasi demo statis** (lokal atau hosting statis manual).

### TSK-30 — Paket demo statis `[ ]`
**Estimasi:** 5 mnt · **Dependensi:** TSK-29 · **Deskripsi:** Pastikan `dist/` bisa dipindah/diunggah apa adanya.

**Acceptance criteria:**
- [ ] `dist/` dapat dibuka langsung melalui server statis tanpa konfigurasi rewrite/backend.
- [ ] Path aset relatif sehingga tidak 404 saat dipindah folder.
- [ ] Tidak ada variabel lingkungan yang dibutuhkan agar aplikasi berjalan.
- [ ] Nomor WA demo didokumentasikan dan mudah diganti sebelum demonstrasi.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `dist/` | `[G]` | Hasil build final |
| `README.md` | `[U]` | Cara sajikan `dist/` |

---

### TSK-31 — Publikasi demo & catatan serah terima `[ ]`
**Estimasi:** 5 mnt · **Dependensi:** TSK-30 · **Deskripsi:** Serahkan paket demo beserta instruksi singkat.

**Acceptance criteria:**
- [ ] Demo dapat diakses dan seluruh AC utama masih lolos di lingkungan publikasi.
- [ ] `README.md` memuat: `npm install`, `npm run dev`, `npm run build`, `npm run preview`, catatan WA demo, dan batasan "tanpa backend/login/pembayaran".
- [ ] Tidak ada API key, token, atau data pribadi di paket publikasi.
- [ ] Status akhir TASKS.md = selesai; DoD `SPEC.md` §11 dan `UI-SPEC.md` §15 terpenuhi.

**Berkas yang mungkin berubah:**

| Berkas | Aksi | Catatan |
|---|---|---|
| `README.md` | `[U]` | Instruksi final |
| `TASKS.md` | `[U]` | Centang semua task |
| `dist/` | `[G]` | Versi final yang diserahkan |

---

## 11. Definition of Done TASKS.md

Rencana kerja ini dianggap selesai sebagai dokumen ketika:

1. ✅ Kesepuluh milestone (scaffold, katalog, interaksi pencarian/filter, WhatsApp, CRUD dashboard, localStorage, testing, security, build, deployment) hadir dan berisi tugas dengan ID unik.
2. ✅ Setiap tugas memiliki **acceptance criteria** yang bisa dicentang manual dan daftar **berkas yang mungkin berubah**.
3. ✅ Seluruh AC-01…AC-36 dari `SPEC.md` terpetakan ke minimal satu tugas.
4. ✅ Seluruh A-01…A-16 dan penyesuaian D-01…D-05 dari `UI-SPEC.md` terakomodasi.
5. ✅ Total estimasi = 480 menit termasuk buffer 25 menit.
6. ✅ Urutan eksekusi yang disarankan memperlihatkan ketergantungan M6 sebelum M2/M5.
7. ✅ Batasan scope dijaga: tanpa backend, login palsu, payment gateway, API key, CDN, testing otomatis, dan CI/CD produksi.
8. ✅ Tidak ada kode aplikasi yang dibuat atau diubah saat dokumen ini disusun.

---

## 12. Catatan Penyerahan

`TASKS.md` adalah **rencana eksekusi**, bukan implementasi. Eksekusi task dimulai setelah `SPEC.md` dan `UI-SPEC.md` disetujui. Setiap perubahan scope (misalnya sinkronisasi D-02 ke F-11/AC-21/AC-31 di `SPEC.md`) harus dicatat sebagai revisi dan disetujui lebih dulu agar target 1 hari tetap realistis.
