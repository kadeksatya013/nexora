# UI-SPEC.md — NEXORA

**Spesifikasi Antarmuka Prototype Marketplace Katalog Produk Digital**

| Field | Nilai |
|---|---|
| Nama aplikasi | NEXORA |
| Versi dokumen | 1.0 |
| Tanggal | 19 November 2026 |
| Status | Draft siap dipakai sebagai pedoman implementasi frontend |
| Dokumen terkait | `SPEC.md` v1.0 (sumber kebenaran fungsi & data) |
| Stack UI | Vite + JavaScript Vanilla + HTML5 + CSS3 |
| Target | Prototype responsif, dark futuristic, dapat didemonstrasikan 1 hari |

> Dokumen ini **hanya spesifikasi visual dan interaksi**. Kode aplikasi belum ditulis.

---

## 0. Penyelarasan dengan `SPEC.md`

Sebelum desain diimplementasi, perhatikan penyesuaian berikut agar UI tidak bertentangan dengan spesifikasi fungsi:

| ID | Penyesuaian | Keputusan |
|---|---|---|
| D-01 | Permintaan filter "Preset" vs enum `SPEC.md` "Preset Foto" | **Label chip boleh "Preset"**, tetapi `value` tetap **`Preset Foto`**. Di halaman detail dan tabel tetap tampil "Preset Foto" |
| D-02 | Dashboard diminta 4 statistik, `SPEC.md` baru 3 | Ditambahkan stat ke-4 **"Jumlah Kategori"** = jumlah kategori unik dari data produk (awal = 6). Perlu pembaruan kecil pada F-11 / AC-21 / AC-31 di `SPEC.md` |
| D-03 | Navbar 4 menu vs route yang ada | `Home → #/`, `Explore → #/explore` (alias katalog + scroll ke `#katalog`), `Categories → #/categories` (anchor ke panel filter), `Dashboard → #/dashboard`. Tidak menambah backend/route server |
| D-04 | Konfirmasi destruktif | hapus produk dan reset wajib memakai dialog konfirmasi (selaras AC-25, AC-31, AC-32) |
| D-05 | Ketergantungan eksternal | Nol CDN: font, ikon, dan gambar harus lokal. Satu-satunya URL eksternal adalah `wa.me` setelah klik tombol |

---

## 1. Identitas dan Konsep Visual

### 1.1 Brand Personality

NEXORA dibayangkan sebagai **"katalog aset digital untuk kreator generasi baru"**: cepat, presisi, bertechnologi, tetapi tetap ramah dan tidak memusingkan.

| Atribut | Arti dalam desain |
|---|---|
| Futuristic | Grid halus, orb cahaya, tipografi tajam, aksen neon |
| Profesional | Ruang kosong yang cukup, hierarchy jelas, tidak ramai |
| Percaya diri | Headline tebal, kontras kuat, CTA yang jelas |
| Ringan | Transisi ≤240ms, tanpa animasi berat, placeholder SVG lokal |

### 1.2 Konsep Visual

- **Metafora:** "control panel kreatif" — permukaan kaca gelap di atas ruang navy, dengan dua sumber cahaya (purple di kiri, cyan di kanan).
- **Komposisi khas:** blok kaca transparan (`glassmorphism`) dengan garis tipis bercahaya, konten dibungkus container 1200px, dan dekorasi radial di latar belakang yang **tidak pernah mengganggu teks**.
- **Hierarchy visual:** headline → search → CTA → filter → kartu. Matanya pengguna bergerak dari kiri-atas ke kanan-bawah di desktop, dan atas-ke-bawah di mobile.
- **Prinsip:**
  1. Mobile-first: semua komponen dirancang untuk 375px dulu, lalu diperlebar.
  2. Satu aksi utama per layar (hero: Explore; detail: WhatsApp; dashboard: Tambah Produk).
  3. Warna adalah penanda, bukan satu-satunya informasi — selalu ada teks/icon.
  4. Keterbacaan > efek: efek glow hanya pada batas elemen, bukan di belakang teks.

### 1.3 Delapan Prinsip Implementasi UI

1. Gunakan token CSS, bukan warna/literal angka yang diulang.
2. Semua data dinamis di-escape (`textContent` / helper `escapeHtml`).
3. Gambar produk memakai `assets/products/nx-00X.svg` lokal dengan fallback.
4. Ikon memakai inline SVG lokal, bukan font/icon CDN.
5. Tombol memiliki target sentuh minimal **44×44px**.
6. Fokus keyboard selalu terlihat (ring cyan 2px, offset 2px).
7. `prefers-reduced-motion` dimatikan untuk animasi dekoratif.
8. Status (kosong, error, sukses) selalu punya teks, bukan hanya warna.

---

## 2. Design System

### 2.1 Color Palette

| Token | Hex / Nilai | Peran |
|---|---|---|
| `--color-bg` | `#070B1A` | Latar utama dark navy |
| `--color-surface` | `#0E1530` | Permukaan panel/kartu solid |
| `--color-surface-raised` | `#141D3D` | Permukaan elevated (modal, dropdown, stat card) |
| `--color-surface-glass` | `rgba(20, 29, 61, 0.58)` | Latar glassmorphism + `backdrop-filter: blur(16px)` |
| `--color-border` | `rgba(148, 163, 255, 0.14)` | Garis halus kartu/panel |
| `--color-border-strong` | `rgba(167, 139, 250, 0.35)` | Garis aktif/fokus dekoratif |
| `--color-text` | `#F5F7FF` | Teks utama & headline |
| `--color-text-muted` | `#B8C4E0` | Teks sekunder, deskripsi |
| `--color-text-subtle` | `#8B9AC4` | Label, metadata, placeholder |
| `--purple-electric` | `#A855F7` | Aksen glow, border, ikon (bukan teks kecil) |
| `--purple-cta-start` | `#6D28D9` | Awal gradient tombol utama |
| `--purple-cta-end` | `#9333EA` | Akhir gradient tombol utama |
| `--purple-text` | `#C084FC` | Teks aksen ungu (aman di atas kaca) |
| `--cyan` | `#22D3EE` | Aksen neon, price, fokus |
| `--cyan-soft` | `#67E8F9` | Teks aksen cyan terang |
| `--success` | `#34D399` | Stok tersedia, status sukses |
| `--warning` | `#FBBF24` | Stok menipis (≤5) |
| `--danger` | `#F87171` | Error validasi, stok habis, hapus |
| `--focus` | `#67E8F9` | Ring fokus keyboard |

### 2.2 Verifikasi Kontras (WCAG 2.1 — dihitung, bukan estimasi)

| Kombinasi | Rasio | Status |
|---|---:|---|
| `#F5F7FF` di `#070B1A` | 18.32:1 | ✅ AAA |
| `#F5F7FF` di `#0E1530` | 16.80:1 | ✅ AAA |
| `#F5F7FF` di `#141D3D` | 15.42:1 | ✅ AAA |
| `#B8C4E0` di `#141D3D` | 9.44:1 | ✅ AAA |
| `#8B9AC4` di `#141D3D` | 5.91:1 | ✅ AA |
| `#C084FC` di `#141D3D` | 6.24:1 | ✅ AA |
| `#22D3EE` di `#070B1A` | 10.84:1 | ✅ AAA |
| `#67E8F9` di `#141D3D` | 11.38:1 | ✅ AAA |
| `#FFFFFF` di gradient `#6D28D9 → #9333EA` | 7.10 → 5.38:1 | ✅ AA di seluruh gradient |
| `#070B1A` di `#22D3EE` (tombol WA) | 10.84:1 | ✅ AAA |
| ⛔ `#A855F7` sebagai teks di `#141D3D` | 4.17:1 | ❌ Gagal AA — gunakan `#C084FC` |
| ⛔ `#FFFFFF` di atas `#A855F7` polos | 3.96:1 | ❌ Gagal AA — gunakan gradient di atas |

**Aturan turunan:** `#A855F7` hanya untuk glow/border/icon dekoratif. Teks ungu memakai `#C084FC`. Tombol ungu memakai gradient `#6D28D9 → #9333EA` dengan teks putih.

### 2.3 Typography

| Peran | Font | Ukuran / Line-height | Weight | Letter-spacing |
|---|---|---|---|---|
| Display / headline | Space Grotesk | 48/56 desktop · 36/44 mobile | 700 | `-0.02em` |
| H2 section | Space Grotesk | 28/34 desktop · 24/30 mobile | 600 | `-0.01em` |
| H3 card title | Space Grotesk | 18/26 | 600 | `0` |
| Body | Inter | 16/26 | 400 | `0` |
| Small / metadata | Inter | 14/20 | 400 | `0` |
| Caption / label uppercase | Inter | 12/16 | 600 | `+0.08em` |
| Harga | Space Grotesk | 18/24 | 700 | `-0.01em`, warna `--cyan-soft` |
| Button label | Inter | 14/20 | 600 | `+0.01em` |

**Font stack:**

```text
Headings: "Space Grotesk", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif
Body:     "Inter", system-ui, -apple-system, "Segoe UI", sans-serif
```

Font dimuat dari `assets/fonts/*.woff2` via `@font-face` (`font-display: swap`). Jika berkas tidak ada, stack sistem tetap menjaga keterbacaan.

### 2.4 Spacing Scale (base 4px)

| Token | Nilai | Pemakaian umum |
|---|---:|---|
| `space-1` | 4px | Gap icon-label |
| `space-2` | 8px | Padding chip, gap kecil |
| `space-3` | 12px | Gap input & label |
| `space-4` | 16px | Padding kartu, gutter mobile |
| `space-5` | 20px | Gap antar elemen form |
| `space-6` | 24px | Padding panel, gutter desktop |
| `space-8` | 32px | Gap section kecil |
| `space-10` | 40px | Gap section mobile |
| `space-12` | 48px | Gap section desktop |
| `space-16` | 64px | Pemisah blok besar |
| `space-20` | 80px | Padding vertikal hero desktop |

**Container:** `max-width: 1200px`, margin auto, padding inline `16px` (mobile) → `24px` (tablet) → `32px` (desktop).

### 2.5 Border Radius

| Token | Nilai | Elemen |
|---|---:|---|
| `radius-sm` | 8px | Input, chip, badge kecil |
| `radius-md` | 12px | Button, toast, dropdown item |
| `radius-lg` | 16px | Product card, stat card |
| `radius-xl` | 20px | Panel/form sheet, modal |
| `radius-2xl` | 24px | Hero panel |
| `radius-pill` | 999px | Badge "Unggulan", filter chip aktif |

### 2.6 Visual Effects

| Efek | Spesifikasi |
|---|---|
| Glassmorphism | `background: var(--color-surface-glass); backdrop-filter: blur(16px) saturate(140%); border: 1px solid var(--color-border); box-shadow: inset 0 1px 0 rgba(255,255,255,.06)` |
| Gradient hero | `radial-gradient(circle at 15% 20%, rgba(168,85,247,.20), transparent 45%)`, `radial-gradient(circle at 85% 10%, rgba(34,211,238,.14), transparent 42%)` di atas `--color-bg` |
| Gradient CTA | `linear-gradient(135deg, #6D28D9 0%, #9333EA 100%)`, teks `#FFFFFF` |
| Gradient teks (opsional) | `#C084FC → #67E8F9`, **hanya pada 1 kata dekoratif**, dengan fallback solid `#F5F7FF` |
| Glow hover purple | `box-shadow: 0 0 24px rgba(168,85,247,.28); border-color: var(--color-border-strong)` |
| Glow hover cyan | `box-shadow: 0 0 20px rgba(34,211,238,.22)` |
| Shadow dasar | `0 10px 30px rgba(2, 6, 23, .45)` (halus, tidak tebal) |
| Transisi | `150ms ease-out` untuk warna/border, `240ms ease-out` untuk transform & card |
| Hover movement | `translateY(-2px)` pada kartu; `translateY(-1px)` pada tombol |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → `transition: none; animation: none; transform: none` |

### 2.7 Ikonografi

- Semua ikon berupa **inline SVG lokal** dengan `stroke="currentColor"`, `width/height: 18–20px`, `stroke-width: 1.8`.
- Set ikon minimal: search, arrow-right, arrow-left, grid, star, box, layers, filter, sort, plus, edit, trash, close, menu, whatsapp, image-placeholder, check, alert.
- Ikon dekoratif diberi `aria-hidden="true"`; ikon yang berdiri sendiri (mis. tombol hapus) diberi `aria-label`.

---

## 3. Struktur Layout dan Navigasi

### 3.1 App Shell

```text
<body>
  <a class="skip-link">Lewati ke konten</a>
  <header class="app-header">  ← sticky, glass, 64px / 56px mobile
    logo + nav + aksi kanan
  </header>
  <main id="main-content">
    [ view: katalog | detail | dashboard ]
  </main>
  <footer class="app-footer">  ← info demo + data lokal
  </footer>
  <div class="toast-region" aria-live="polite"></div>
  <dialog class="confirm-dialog">...</dialog>
</body>
```

### 3.2 Navbar

| Elemen | Spesifikasi |
|---|---|
| Logo | Ikon `◈` SVG + wordmark **NEXORA**, letter-spacing `0.12em`, weight 700, warna text + aksen cyan pada ikon. Klik → `#/` |
| Menu | `Home`, `Explore`, `Categories`, `Dashboard` (urutan tetap) |
| Active state | Teks `--color-text` + underline gradient 2px di bawah menu; menu lain `--color-text-subtle` |
| Hover | Teks → `--color-cyan-soft`, underline memanjang 160ms |
| Kanan (desktop) | Badge kecil "DEMO" berbentuk pill + tombol ikon `+ Tambah` mengarah ke dashboard |
| Kanan (mobile) | Tombol hamburger 44×44px → drawer |
| Sticky | `position: sticky; top: 0; z-index: 50`; glass + border-bottom tipis |

**Pemetaan menu:**

| Menu | Target | Perilaku |
|---|---|---|
| Home | `#/` | Katalog + hero, scroll ke atas |
| Explore | `#/explore` | Alias katalog, scroll halus ke `#katalog` |
| Categories | `#/categories` | Scroll ke panel filter, chip pertama fokus |
| Dashboard | `#/dashboard` | View pengelola (tanpa login) |

### 3.3 Navigasi Mobile

- Hamburger membuka **drawer** dari kanan, lebar `min(84vw, 320px)`, latar `--color-surface-raised` + blur, berisi 4 menu plus badge "DEMO".
- Overlay gelap `rgba(7,11,26,.6)` di belakang drawer; klik overlay / tombol close / `Escape` menutup.
- Saat terbuka: fokus dipindah ke item pertama; saat ditutup fokus kembali ke tombol hamburger.
- Tidak ada bottom tab bar di MVP (disederhanakan, mengurangi tested surface).

### 3.4 Grid Halaman

| Area | Desktop (≥1280) | Tablet (768–1023) | Mobile (<768) |
|---|---|---|---|
| Hero | 2 kolom 60/40 | 2 kolom 65/35 | 1 kolom |
| Katalog | 4 kolom | 2 kolom | 1 kolom |
| Dashboard stat | 4 kolom | 2 kolom | 2 kolom |
| Detail produk | 2 kolom 55/45 | 1 kolom | 1 kolom |
| Form CRUD | panel samping 420px | modal penuh | sheet penuh |

---

## 4. Spesifikasi Hero Section

### 4.1 Struktur

```text
[ hero panel: glass, radius-2xl, padding 80/64 desktop · 32/24 mobile ]
  ├─ eyebrow badge: "✦ KATALOG ASET DIGITAL · EDISI 2026"
  ├─ headline (display): "Temukan Aset Digital untuk Karya Berikutnya."
  ├─ deskripsi (body, max 52ch): "8 produk digital pilihan — template, e-book,
  │   preset, dan UI kit — siap pakai dalam hitungan menit."
  ├─ baris aksi: [ SearchBar .......... ] [ Explore Products → ]
  └─ meta: "8 produk  •  6 kategori  •  data lokal"
  [ kanan: dekorasi orb + grid CSS murni, aria-hidden="true" ]
```

### 4.2 Perilaku

- Search bar di hero **terhubung langsung** ke state pencarian katalog; mengetik langsung menyaring daftar di bawahnya (live filter), `Enter` menggulir ke `#katalog`.
- Tombol **Explore Products** menggulir halus ke `#katalog` dan menaruh fokus ke chip filter "Semua".
- Dekorasi memakai CSS (`radial-gradient`, grid linear, blur), **bukan gambar eksternal**, dan `pointer-events: none`.
- Di mobile dekorasi dipangkas (`opacity: .5`, tinggi dibatasi) agar headline tetap pertama dibaca.

### 4.3 Microcopy

| Elemen | Teks |
|---|---|
| Eyebrow | `✦ KATALOG ASET DIGITAL · EDISI 2026` |
| Headline | `Temukan Aset Digital untuk Karya Berikutnya.` |
| Deskripsi | `8 produk digital pilihan — template, e-book, preset, dan UI kit — siap pakai dalam hitungan menit.` |
| Placeholder search | `Cari nama atau kata kunci, mis. "UI Kit"...` |
| CTA | `Explore Products →` |
| Meta | `8 produk • 6 kategori • 100% lokal` |

---

## 5. Spesifikasi Search Bar, Filter, dan Sorting

### 5.1 Search Bar

| Aspek | Spesifikasi |
|---|---|
| Struktur | Ikon search di kiri + `<input type="search">` + tombol clear `×` (muncul saat ada teks) |
| Ukuran | Tinggi 48px, radius `radius-md`, padding-inline 16px |
| Latar | `--color-surface-glass`; border `--color-border`; fokus border `--cyan` + ring 2px |
| Placeholder | `--color-text-subtle`, kontras 7.01:1 di bg utama |
| Perilaku | Case-insensitive, cocokkan `nama + kategori + deskripsi`; debounce 150ms opsional; hasil langsung diperbarui |
| Clear | Menghapus teks, mengembalikan fokus ke input, hasil kembali semua |
| A11y | `<label class="sr-only">Cari produk</label>`, `aria-controls="product-grid"` |

### 5.2 Filter Kategori

| Aspek | Spesifikasi |
|---|---|
| Bentuk | Chip pill; label: `Semua`, `Template Canva`, `Website Template`, `E-book`, `Preset` (= `Preset Foto`), `UI Kit`, `Digital Assets` |
| Default | Chip `Semua` aktif |
| Aktif | Latar gradient ungu, teks `#FFFFFF`, border glow, `aria-pressed="true"` |
| Nonaktif | Latar `rgba(148,163,255,.06)`, teks `--color-text-muted`, border `--color-border` |
| Hover | Teks `--color-cyan-soft`, border `--color-border-strong`, `translateY(-1px)` |
| Mobile | `overflow-x: auto`, scroll-snap, chip tidak terpotong, scrollbar disembunyikan tapi tetap di-scroll |
| A11y | `role="group" aria-label="Filter kategori produk"`; status aktif tidak hanya warna (ada `aria-pressed` + ikon centang kecil) |

### 5.3 Sorting

| Aspek | Spesifikasi |
|---|---|
| Kontrol | Native `<select>` ter-styled (paling aksesibel & ringan), lebar 220px desktop / penuh mobile |
| Opsi | `Produk Terbaru` (default), `Harga Termurah`, `Harga Termahal`, `Nama A–Z`, `Nama Z–A` |
| Nilai internal | `terbaru`, `harga-asc`, `harga-desc`, `nama-asc`, `nama-desc` (sama dengan `SPEC.md`) |
| Ikon | Ikon sort di kiri label; panel opsi memakai `--color-surface-raised` |
| A11y | `<label for="sort-select">Urutkan</label>`; perubahan diumumkan lepas `aria-live` pada result counter |

### 5.4 Result Counter & Reset Filter

- Teks: `Menampilkan 8 dari 8 produk` (atau `Menampilkan 1 dari 8 produk`), warna `--color-text-subtle`, `aria-live="polite"`.
- Jika filter/sort/search aktif, muncul tombol ghost `Reset filter` di samping counter.
- Klik reset → search kosong, kategori `Semua`, sort `terbaru`.

---

## 6. Spesifikasi Product Card dan Grid Katalog

### 6.1 Grid

| Breakpoint | Kolom | Gap |
|---|---:|---:|
| ≥1280px | 4 | 24px |
| 1024–1279px | 3 | 20px |
| 768–1023px | 2 | 20px |
| <768px | 1 | 16px |

### 6.2 Anatomi Kartu

```text
+--------------------------------+
| [ Gambar 16:9  object-fit:cover ]  ← fallback SVG lokal
|  ★ Unggulan        [kategori]     ← badge overlay
+--------------------------------+
| Kategori (chip kecil, cyan)    |
| Nama produk (2 baris, clamp)   |
| Rp149.000          Stok: 42    |
| [ View Details → ]             |
+--------------------------------+
```

| Elemen | Spesifikasi |
|---|---|
| Kartu | Latar glass, radius 16px, border 1px, padding 16px, `overflow: hidden` |
| Gambar | `aspect-ratio: 16/9`, `object-fit: cover`, radius 12px, latar fallback gradient navy |
| Badge unggulan | Pill kiri-atas, ikon ★ + teks `Unggulan`, latar `rgba(251,191,36,.16)`, teks `--warning` |
| Chip kategori | Kanan-atas di atas gambar, latar `rgba(34,211,238,.12)`, teks `--cyan-soft` |
| Nama | H3 18/26, 2 baris maksimal (`line-clamp: 2`), warna `--color-text` |
| Harga | 18/24 weight 700, warna `--cyan-soft` |
| Stok | 14/20, ikon titik: hijau (`--success`) jika >5, kuning (`--warning`) jika 1–5, merah (`--danger`) jika 0; teks `Stok: N` atau `Stok habis` |
| Tombol | `View Details →`, lebar penuh, tinggi 40px, secondary style (border cyan, teks cyan), radius 12px |

### 6.3 Interaksi Kartu

- Hover kartu: `translateY(-2px)`, border `--color-border-strong`, glow purple halus, bayangan naik.
- Hover tombol: latar `rgba(34,211,238,.14)`, glow cyan.
- Hanya tombol yang fokus/keyboard-activatable; kartu tidak memakai `onclick` tersembunyi agar tidak ada nested interactive.
- Klik tombol → hash route `#/produk/:id`.

### 6.4 Empty State Katalog

```text
   [ ikon search besar, opacity .5 ]
        Tidak ada produk yang cocok
   Coba kata kunci lain atau reset filter kategori.
          [ Reset filter ]
```

- Teks `--color-text-muted`, judul `--color-text`, ikon dekoratif `aria-hidden`.
- Kontainer tetap glass dengan padding 48px, min-height 240px.

---

## 7. Spesifikasi Halaman Detail Produk

### 7.1 Struktur Desktop (2 kolom 55/45)

```text
[ Breadcrumb: Home / Kategori / Nama Produk ]

+------------------------------------+  +------------------------------+
| Gambar produk besar (4:3)          |  | Kategori chip                |
| fallback lokal                     |  | Nama produk (display 32px)   |
| badge UNGGULAN                     |  | Rp129.000        Stok: 60    |
+------------------------------------+  | ---------------------------- |
| [ ringkasan singkat / info grid ]  |  | DESKRIPSI                    |
|                                    |  | paragraf lengkap             |
|                                    |  | ---------------------------- |
|                                    |  | INFORMASI PRODUK             |
|                                    |  | Kategori / Harga / Stok /    |
|                                    |  | Status / ID                  |
|                                    |  | ---------------------------- |
|                                    |  | [ Pesan via WhatsApp ]       |
|                                    |  | teks bantuan kecil           |
+------------------------------------+  +------------------------------+

[ ← Kembali ke katalog ]  (di bawah breadcrumb)
```

### 7.2 Struktur Mobile (1 kolom)

```text
[ ← Kembali        NEXORA ]
[ Gambar produk 4:3, badge unggulan ]
[ Kategori ]
[ Nama produk ]
[ Harga + Stok ]
[ DESKRIPSI + isi ]
[ INFORMASI PRODUK (definition list) ]
[ Tombol WhatsApp (sticky di bawah, safe-area) ]
```

### 7.3 Aturan Konten

| Elemen | Aturan |
|---|---|
| Breadcrumb | Teks `--color-text-subtle`, pemisah `/`, item terakhir `--color-text` |
| Gambar | `aspect-ratio: 4/3`, radius 20px, fallback SVG, `alt="Ilustrasi produk ${nama}"` |
| Judul | Space Grotesk 32/40 desktop, 26/34 mobile, weight 700 |
| Harga | Space Grotesk 24/32, `--cyan-soft` |
| Stok | Status + warna seperti kartu; teks `Tersedia`, `Stok menipis`, `Stok habis` |
| Deskripsi | Inter 16/26, `--color-text-muted`, `white-space: pre-line` |
| Informasi | `<dl>` dengan `<dt>` uppercase 12px dan `<dd>` 14px; baris pemisah 1px |
| ID produk | Ditampilkan kecil sebagai referensi demo |
| Tombol kembali | Ghost + ikon arrow-left, tinggi 44px |

### 7.4 Empty / Not Found

Jika `id` tidak ditemukan: tampilkan panel glass bertuliskan `Produk tidak ditemukan`, tombol `Kembali ke katalog`. Jangan menampilkan halaman kosong.

---

## 8. Spesifikasi Tombol WhatsApp

| Aspek | Spesifikasi |
|---|---|
| Label | `Pesan via WhatsApp` + ikon WA lokal |
| Warna | Latar `--cyan` (`#22D3EE`), teks `--color-bg` (`#070B1A`) → kontras 10.84:1 |
| Ukuran | Tinggi 48px, lebar penuh di mobile / 260px di desktop, radius 12px |
| Hover | `translateY(-1px)`, glow cyan, sedikit lebih terang |
| Active | `translateY(0)`, opacity `.9` |
| Fokus | Ring `--focus` 2px offset 2px |
| Atribut | `target="_blank" rel="noopener noreferrer"`, `aria-label="Pesan via WhatsApp tentang ${nama} ${harga}"` |
| Pesan | `Halo NEXORA, saya tertarik dengan *${nama}* (${formatRupiah(harga)}). Apakah stok masih tersedia?` |
| URL | `https://wa.me/6280000000000?text=${encodeURIComponent(pesan)}` |
| Teks bantuan | `Membuka WhatsApp. Tidak ada pembayaran otomatis.` (12px, `--color-text-subtle`) |
| Stok 0 | Tombol tetap aktif (inquiry), label metadata `Stok habis` tetap tampil |

---

## 9. Spesifikasi Dashboard Demo dan CRUD

### 9.1 Header Dashboard

```text
DASHBOARD PENGELOLA                    [ + Tambah Produk ] [ Reset Data ]
Kelola katalog NEXORA — semua data tersimpan di perangkat ini.
```

- Badge `DEMO` di sebelah judul sebagai pengingat tanpa login.
- Tombol `Tambah Produk` memakai primary gradient.
- Tombol `Reset Data` memakai ghost dengan ikon rotate dan border danger saat hover.

### 9.2 Stat Cards (4)

| Card | Ikon | Warna aksen | Nilai awal |
|---|---|---|---:|
| Total Produk | box | `--purple-text` | 8 |
| Total Stok | layers | `--cyan-soft` | 382 |
| Produk Unggulan | star | `--warning` | 4 |
| Jumlah Kategori | grid | `--success` | 6 |

- Angka Space Grotesk 32/38 weight 700; label 12px uppercase.
- Kartu glass, padding 20px, radius 16px, garis atas 2px sesuai aksen.
- Nilai dihitung ulang otomatis setelah create/update/delete/reset (sesuai AC-31).

### 9.3 Tabel Produk (Desktop)

| Kolom | Konten | Lebih |
|---|---|---|
| Gambar | Thumbnail 48×48 radius 8 | 64px |
| Nama | Nama + chip unggulan jika true | flexible |
| Kategori | Teks chip | 150px |
| Harga | `formatRupiah` | 120px |
| Stok | Angka + indikator warna | 100px |
| Unggulan | Ikon ★ / — | 90px |
| Aksi | Tombol ikon `Edit` dan `Hapus` (44×44) | 110px |

- Header sticky di dalam panel, latar `--color-surface-raised`.
- Baris hover: latar `rgba(148,163,255,.05)`.
- Baris kosong: lihat UI States.
- Di mobile (<768px), tabel berubah menjadi **kartu baris**: `[thumb] Nama / kategori · ★ / harga · stok / [Edit][Hapus]`.

### 9.4 Form Create / Edit

- Bentuk: **modal sheet** (mobile: full screen; desktop: panel kanan 420px), latar `--color-surface-raised`, radius 20px, overlay gelap.
- Judul: `Tambah Produk` / `Edit Produk`.
- Field:

| Field | Kontrol | Validasi (from `SPEC.md`) |
|---|---|---|
| Nama | text | wajib, 3–80 karakter |
| Kategori | select | wajib, salah satu 6 enum (label `Preset` = value `Preset Foto`) |
| Harga | number, `step="0.01"` | finite, `>= 0`, maks 2 desimal; tolak negatif |
| Stok | text input mode numeric | `/^\d+$/`, bulat, `>= 0`; tolak `-5`, `2.5` |
| Deskripsi | textarea 4 baris | wajib, 10–500 karakter |
| imageUrl | text | path lokal / `data:image/`; tolak `http(s)://` |
| Unggulan | checkbox | boolean |

- Error tampil **di bawah field** (12px, `--danger`, ikon alert), input border merah, `aria-invalid="true"`, `aria-describedby` ke pesan.
- Error ringkas dan spesifik: `Stok harus bilangan bulat lebih dari atau sama dengan 0.`
- Tombol: `Simpan` (primary), `Batal` (ghost). Simpan menonaktifkan tombol saat validasi gagal dan menampilkan toast sukses saat berhasil.
- Edit tidak mengizinkan mengubah `id`; field ID ditampilkan read-only.

### 9.5 Konfirmasi & Reset

- Hapus → dialog: `Hapus produk "${nama}"?` + `Tindakan ini tidak dapat dibatalkan.` + `[Batal] [Hapus]`.
- Reset → dialog: `Reset semua produk ke 8 data awal?` + `Perubahan Anda akan hilang.` + `[Batal] [Reset]`.
- Dialog memakai `<dialog>` native; fokus otomatis ke tombol `Batal`; `Escape` = batal.
- Tombol konfirmasi destruktif memakai `--danger` dengan teks putih (kontras 7.08:1).

### 9.6 Toast

- Posisi kanan-bawah desktop, bawah mobile di atas safe-area.
- Tipe: success (border `--success`), error (border `--danger`), info (border `--cyan`).
- Auto-hilang 4 detik, bisa ditutup manual, `role="status"` / `role="alert"`.
- Contoh: `Produk berhasil disimpan.`, `Produk dihapus.`, `Data dikembalikan ke 8 produk awal.`, `Gagal menyimpan ke localStorage.`

---

## 10. Accessibility Requirements

Target: **WCAG 2.1 level AA** untuk alur utama.

| ID | Requirement |
|---|---|
| A-01 | Rasio kontras memenuhi tabel Bagian 2.2; tidak ada teks penting di bawah 4.5:1 |
| A-02 | Warna bukan satu-satunya penanda: stok, unggulan, error, dan sukses punya teks/icon |
| A-03 | Skip link `Lewati ke konten` sebagai elemen pertama yang bisa difokus |
| A-04 | Ring fokus 2px `--focus` dengan offset 2px, terlihat di semua kontrol interaktif |
| A-05 | Navigasi keyboard penuh: Tab/Shift+Tab, Enter/Space untuk tombol, Escape untuk modal/drawer |
| A-06 | Struktur semantik: `<header>`, `<main>`, `<footer>`, `<nav aria-label>`, `<h1>`–`<h3>` berurutan |
| A-07 | Setiap input punya `<label>` terhubung; placeholder bukan pengganti label |
| A-08 | Error validasi: `aria-invalid="true"`, `aria-describedby`, diumumkan via `aria-live="assertive"` ringkas |
| A-09 | `aria-live="polite"` pada result counter & toast; jumlah hasil berubah diumumkan |
| A-10 | Gambar produk punya `alt` deskriptif; gambar dekoratif `aria-hidden="true"` |
| A-11 | Target sentuh minimal 44×44px, jarak antar tombol aksi minimal 8px |
| A-12 | `prefers-reduced-motion: reduce` menonaktifkan transisi/animasi dekoratif |
| A-13 | Zoom browser 200% tidak memotong konten atau menghilangkan aksi |
| A-14 | Urutan DOM mengikuti urutan visual (mobile-first), bukan diatur hanya dengan CSS `order` |
| A-15 | Teks tidak memakai `text-transform` sebagai satu-satunya pembeda makna |
| A-16 | Dialog mengembalikan fokus ke elemen pemicu setelah ditutup |

---

## 11. Responsive Breakpoints

| Nama | Rentang | Grid katalog | Hero | Dashboard stat | Nav |
|---|---|---:|---|---|---|
| `xs` | <360px | 1 | 1 kolom | 2 | hamburger |
| `sm` | 360–767px | 1 | 1 kolom | 2 | hamburger |
| `md` | 768–1023px | 2 | 2 kolom (65/35) | 2 | hamburger |
| `lg` | 1024–1279px | 3 | 2 kolom (60/40) | 4 | menu penuh |
| `xl` | ≥1280px | 4 | 2 kolom (60/40) | 4 | menu penuh |

**Aturan tambahan:**

- Mobile-first: CSS ditulis dengan `@media (min-width: 768px)` ke atas.
- Container padding: `16px` → `24px` (≥768) → `32px` (≥1280).
- Hero padding vertikal: `32px` mobile → `64px` tablet → `80px` desktop.
- Filter chip: scroll horizontal di <768px, wrap di ≥768px.
- Tabel dashboard → kartu di <768px.
- Tidak ada `overflow-x` pada `<body>`; satu-satunya scroll horizontal adalah chip filter dan panel tabel.

---

## 12. Wireframe Teks

**Legenda:** `[ ]` = kontrol/button, `...` = konten berulang, `◈` = logo, `★` = unggulan, `→` = aksi navigasi, `▾` = dropdown.

### 12.1 Homepage — Desktop (1440px)

```text
+----------------------------------------------------------------------------------------------+
| ◈ NEXORA     Home   Explore   Categories   Dashboard                      [DEMO]  [+ Tambah]   |
+----------------------------------------------------------------------------------------------+
|  +----------------------------------------------------------------------------------------+  |
|  | ✦ KATALOG ASET DIGITAL · EDISI 2026                          (glow purple)   (glow cyan)|  |
|  |                                                                                        |  |
|  |  Temukan Aset Digital                                        ~ grid halus ~             |  |
|  |  untuk Karya Berikutnya.                                     ~ orb kaca ~               |  |
|  |                                                                                        |  |
|  |  8 produk digital pilihan — template, e-book, preset, dan UI kit, siap pakai            |  |
|  |  dalam hitungan menit.                                                                  |  |
|  |                                                                                        |  |
|  |  [ 🔍 Cari nama atau kata kunci...        ]  [ Explore Products → ]                    |  |
|  |  8 produk • 6 kategori • 100% lokal                                                     |  |
|  +----------------------------------------------------------------------------------------+  |
+----------------------------------------------------------------------------------------------+
|  Jelajahi Katalog                                       Menampilkan 8 dari 8 produk           |
|  Kategori: [Semua][Template Canva][Website Template][E-book][Preset][UI Kit][Digital Assets]  |
|  Urutkan: [ Produk Terbaru ▾ ]                                          [ Reset filter ]     |
+----------------------------------------------------------------------------------------------+
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+      |
|  | [ IMG 16:9    ]   | | [ IMG 16:9    ]   | | [ IMG 16:9    ]   | | [ IMG 16:9    ]   |      |
|  | ★Unggulan  [Cat]  | |            [Cat]  | | ★Unggulan  [Cat]  | |            [Cat]  |      |
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+      |
|  | Template Canva    | | Website Template  | | Preset Foto       | | UI Kit            |      |
|  | Neon Grid Canva.. | | Aurora Landing... | | Cinematic Light.. | | Orbit UI Kit ...  |      |
|  | Rp149.000         | | Rp329.000         | | Rp129.000         | | Rp459.000         |      |
|  | ● Stok: 42        | | ● Stok: 18        | | ● Stok: 60        | | ● Stok: 12        |      |
|  | [ View Details → ]| | [ View Details → ]| | [ View Details → ]| | [ View Details → ]|      |
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+      |
|  ... 4 kartu berikutnya (baris 2) ...                                                        |
+----------------------------------------------------------------------------------------------+
|  NEXORA · Prototype demo · data lokal · WhatsApp = nomor demo                                  |
+----------------------------------------------------------------------------------------------+
```

### 12.2 Homepage — Mobile (375px)

```text
+--------------------------------------+
| ◈ NEXORA                     [ ☰ ]   |
+--------------------------------------+
|  ✦ KATALOG ASET DIGITAL 2026         |
|                                      |
|  Temukan Aset                        |
|  Digital untuk                       |
|  Karya Berikutnya.                   |
|                                      |
|  8 produk digital pilihan,           |
|  siap pakai dalam hitungan           |
|  menit.                              |
|                                      |
| +----------------------------------+ |
| | 🔍 Cari nama atau kata kunci...  | |
| +----------------------------------+ |
| [  Explore Products →            ]  |
|  8 produk • 6 kategori • lokal      |
+--------------------------------------+
| +-----------------+ +-------------+ |
| | 8               | | 382         | |
| | TOTAL PRODUK    | | TOTAL STOK  | |
| +-----------------+ +-------------+ |
| +-----------------+ +-------------+ |
| | 4               | | 6           | |
| | UNGGULAN        | | KATEGORI    | |
| +-----------------+ +-------------+ |
+--------------------------------------+
| Jelajahi Katalog      8 dari 8       |
| Kategori (geser →)                   |
| [Semua][Canva][Website][E-book]...   |
| Urutkan: [ Produk Terbaru ▾        ] |
+--------------------------------------+
| +----------------------------------+ |
| | [      IMG 16:9               ]  | |
| | ★ Unggulan          [Preset]   |  |
| +----------------------------------+ |
| | Preset Foto                   |  |
| | Cinematic Lightroom Set       |  |
| | Rp129.000       ● Stok: 60    |  |
| | [   View Details →           ]  |  |
| +----------------------------------+ |
| ... kartu berikutnya ...             |
+--------------------------------------+
| NEXORA · demo · data lokal            |
+--------------------------------------+
```

### 12.3 Halaman Detail Produk — Mobile (375px)

```text
+--------------------------------------+
| ← Kembali            NEXORA   [ ⋯ ]  |
+--------------------------------------+
| +----------------------------------+ |
| | [     GAMBAR PRODUK 4:3        ]  | |
| |     placeholder lokal           | |
| | ★ Unggulan                      | |
| +----------------------------------+ |
| [Preset Foto]                        |
| Cinematic Lightroom Set              |
| Rp129.000              ● Stok: 60    |
| ────────────────────────────────────  |
| DESKRIPSI                            |
| Preset foto Lightroom bergaya        |
| cinematic dengan tone hangat dan     |
| kontras tinggi, cocok untuk foto     |
| urban.                               |
| ────────────────────────────────────  |
| INFORMASI PRODUK                     |
| Kategori     Preset Foto             |
| Harga        Rp129.000               |
| Stok         60 tersedia             |
| Status       Unggulan                |
| ID           nx-004                  |
+--------------------------------------+
| +----------------------------------+ |
| |  ◉  Pesan via WhatsApp         |  |
| +----------------------------------+ |
| Membuka WhatsApp. Tidak ada          |
| pembayaran otomatis.                 |
+--------------------------------------+
```

### 12.4 Dashboard Pengelola — Desktop (1440px)

```text
+----------------------------------------------------------------------------------------------+
| ◈ NEXORA   Home   Explore   Categories  [Dashboard]                    [DEMO]  [+ Tambah]    |
+----------------------------------------------------------------------------------------------+
|  DASHBOARD PENGELOLA                          [ + Tambah Produk ]  [ ⟲ Reset Data ]           |
|  Kelola katalog NEXORA — semua data tersimpan di perangkat ini.                                |
+----------------------------------------------------------------------------------------------+
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+       |
|  | TOTAL PRODUK      | | TOTAL STOK        | | PRODUK UNGGULAN   | | JUMLAH KATEGORI   |       |
|  | 8                 | | 382               | | 4                 | | 6                 |       |
|  | [box]             | | [layers]          | | [star]            | | [grid]            |       |
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+       |
+----------------------------------------------------------------------------------------------+
|  DAFTAR PRODUK                     [ 🔍 Cari produk ]  [ Semua kategori ▾ ]                   |
|  +--------+---------------------+-------------+----------+--------+-----------+------------+  |
|  | IMG    | Nama                | Kategori    | Harga    | Stok   | Unggulan  | Aksi       |  |
|  +--------+---------------------+-------------+----------+--------+-----------+------------+  |
|  | [img]  | Neon Grid Canva Kit | Template... | Rp149.000| 42     | ★         | [✎] [🗑]   |  |
|  | [img]  | Aurora Landing Page | Website...  | Rp329.000| 18     | ★         | [✎] [🗑]   |  |
|  | ... 6 baris berikutnya ...                                                              |  |
|  +--------+---------------------+-------------+----------+--------+-----------+------------+  |
+----------------------------------------------------------------------------------------------+
|  PANEL FORM (muncul saat Tambah/Edit)                                                         |
|  +------------------------------------------------------+                                    |
|  | Tambah Produk                                 [ × ]  |                                    |
|  | Nama       [_________________________________]       |                                    |
|  | Kategori   [ Template Canva                 ▾ ]      |                                    |
|  | Harga      [_________]  Stok [________]              |                                    |
|  | Deskripsi  [_________________________________]       |                                    |
|  | Gambar     [assets/products/nx-00X.svg]              |                                    |
|  | ☑ Unggulan                                           |                                    |
|  | [ Simpan ]  [ Batal ]                                |                                    |
|  +------------------------------------------------------+                                    |
+----------------------------------------------------------------------------------------------+
```

### 12.5 Dashboard Pengelola — Mobile (375px)

```text
+--------------------------------------+
| ◈ NEXORA                     [ ☰ ]   |
+--------------------------------------+
| DASHBOARD                    [DEMO]  |
| Kelola katalog lokal Anda.           |
| [ + Tambah Produk ]  [ ⟲ Reset ]     |
+--------------------------------------+
| +-----------------+ +-------------+ |
| | TOTAL PRODUK    | | TOTAL STOK  | |
| | 8               | | 382         | |
| +-----------------+ +-------------+ |
| +-----------------+ +-------------+ |
| | UNGGULAN        | | KATEGORI    | |
| | 4               | | 6           | |
| +-----------------+ +-------------+ |
+--------------------------------------+
| DAFTAR PRODUK (kartu, bukan tabel)    |
| [ 🔍 Cari produk...               ]   |
| +----------------------------------+ |
| | [img] Neon Grid Canva Kit  ★    | |
| |       Template Canva            | |
| |       Rp149.000   ● Stok: 42    | |
| |       [ Edit ]   [ Hapus ]      | |
| +----------------------------------+ |
| | [img] Aurora Landing Page  ★    | |
| |       Website Template          | |
| |       Rp329.000   ● Stok: 18    | |
| |       [ Edit ]   [ Hapus ]      | |
| +----------------------------------+ |
| ... kartu berikutnya ...             |
+--------------------------------------+
| FORM = sheet penuh layar             |
| Nama       [_____________________]   |
| Kategori   [ Template Canva    ▾ ]   |
| Harga      [_______] Stok [_____]    |
| Deskripsi  [_____________________]   |
| Gambar     [_____________________]   |
| ☑ Unggulan                           |
| [ Simpan ]        [ Batal ]          |
+--------------------------------------+
| [dialog konfirmasi muncul di atas]    |
+--------------------------------------+
```

---

## 13. UI Component Inventory

| Komponen | Varian | Props / State | Dipakai di |
|---|---|---|---|
| `Logo` | default, compact | `href` | Navbar, footer |
| `Navbar` | desktop, mobile(drawer) | `activeMenu` | Semua halaman |
| `NavLink` | default, hover, active | `label, href, active` | Navbar, drawer |
| `IconButton` | menu, close, edit, delete, add | `icon, ariaLabel, tone` | Navbar, dashboard |
| `Button` | primary, secondary, ghost, danger | `label, icon, disabled, fullWidth` | Hero, kartu, detail, form |
| `WhatsAppButton` | default | `nama, harga, waNumber` | Detail produk |
| `Badge` | featured, category, demo, stock | `label, tone, icon` | Kartu, detail, tabel, navbar |
| `Hero` | desktop, mobile | `searchValue` | Homepage |
| `SearchBar` | default, filled, focus | `value, placeholder` | Hero, dashboard |
| `FilterChips` | default, active | `categories, selected` | Katalog |
| `SortSelect` | default | `options, value` | Katalog |
| `ResultCounter` | default | `shown, total` | Katalog |
| `ProductGrid` | 1/2/3/4 kolom | `products, state` | Homepage |
| `ProductCard` | default, featured, hover | `product` | Grid |
| `Breadcrumb` | default | `items` | Detail |
| `DetailPanel` | desktop, mobile | `product` | Detail |
| `InfoList` | definition list | `rows` | Detail |
| `StatCard` | purple, cyan, warning, success | `label, value, icon` | Dashboard |
| `DataTable` | desktop | `products` | Dashboard |
| `ProductRowCard` | mobile | `product` | Dashboard |
| `ProductForm` | create, edit | `mode, product, errors` | Modal dashboard |
| `FormField` | text, number, select, textarea, checkbox | `label, error, required` | Form |
| `ConfirmDialog` | delete, reset | `title, message, confirmLabel` | Dashboard |
| `Toast` | success, error, info | `message, tone` | Global |
| `EmptyState` | katalog, tabel, not-found | `title, description, action` | Katalog, dashboard, detail |
| `Footer` | default | — | Semua halaman |
| `SkipLink` | default | — | Global |

---

## 14. UI States

| State | Karakteristik Visual | Contoh |
|---|---|---|
| **Default** | Kartu glass, border tipis, teks `--color-text`/`--color-text-muted`, tidak ada glow | Katalog 8 produk tampil normal |
| **Hover** | `translateY(-1/-2px)`, border `--color-border-strong`, glow halus, warna teks aksen | Kartu produk, chip filter, tombol |
| **Active / Focus** | Chip aktif = gradient ungu + `aria-pressed`; fokus keyboard = ring cyan 2px offset 2px; nav aktif = underline gradient | Filter "E-book", tombol WA saat fokus |
| **Empty** | Panel glass min-height 240px, ikon search opacity .5, judul + petunjuk + tombol `Reset filter` | Pencarian "zzzz" tanpa hasil |
| **Error** | Border input `--danger`, pesan 12px di bawah field, ikon alert, toast merah | `stok = 2.5` ditolak; localStorage gagal |
| **Success** | Border/toast `--success`, ikon check, pesan singkat; data langsung ter-refresh | `Produk berhasil disimpan.` |
| **Loading** *(tambahan)* | Tombol menampilkan spinner + label `Menyimpan...`, non-interactive selama <300ms operasi lokal | Submit form |
| **Disabled** *(tambahan)* | Opacity `.45`, `cursor: not-allowed`, tanpa hover effect | Tombol Simpan saat form belum valid |
| **Selected** *(tambahan)* | Baris tabel latar `rgba(148,163,255,.05)`, checkbox tercentang | Baris dipilih untuk edit |

---

## 15. Definition of Done (UI)

UI NEXORA dinyatakan selesai jika:

1. ✅ Seluruh komponen dalam inventory Bagian 13 tersedia dan dipakai konsisten.
2. ✅ Palet, tipografi, spacing, radius, dan efek mengikuti token Bagian 2 tanpa warna hardcode yang berulang.
3. ✅ Rasio kontras terverifikasi (Bagian 2.2); tidak ada kombinasi yang dilarang (`#A855F7` sebagai teks kecil / teks putih di atasnya).
4. ✅ Navbar berisi logo + 4 menu (Home, Explore, Categories, Dashboard) dan berfungsi di desktop serta drawer mobile.
5. ✅ Hero menampilkan headline, deskripsi, search bar, dan tombol Explore Products dengan perilaku sesuai Bagian 4.
6. ✅ Filter 6 kategori + sorting 5 opsi + result counter bekerja dan statusnya terbaca (bukan hanya warna).
7. ✅ Product card menampilkan gambar lokal, nama, kategori, harga Rupiah, stok, dan tombol View Details.
8. ✅ Halaman detail menampilkan seluruh informasi produk dan tombol WhatsApp dengan pesan ter-encode sesuai `SPEC.md`.
9. ✅ Dashboard menampilkan 4 stat card (termasuk Jumlah Kategori), tabel/kartu produk, dan form CRUD valid.
10. ✅ Empty, error, success, hover, dan active state diuji minimal sekali pada katalog, detail, dan dashboard.
11. ✅ 5 wireframe (homepage desktop, homepage mobile, detail mobile, dashboard desktop, dashboard mobile) terealisasi tanpa perubahan struktur besar.
12. ✅ Diuji di viewport 375px dan 1440px: tidak ada overflow horizontal di `<body>`, teks tidak terpotong.
13. ✅ A-01…A-16 terpenuhi; fokus keyboard terlihat dan dialog/drawer bisa ditutup dengan `Escape`.
14. ✅ Nol aset/CDN eksternal; satu-satunya URL keluar adalah `wa.me` setelah klik.
15. ✅ `prefers-reduced-motion` dihormati dan animasi tidak melebihi 240ms.
16. ✅ Konsisten dengan `SPEC.md` v1.0, termasuk penyesuaian D-01…D-05 yang sudah dicatat.

---

## 16. Catatan Penyerahan

Dokumen ini adalah **spesifikasi UI saja**; belum ada kode aplikasi yang dibuat. Implementasi frontend harus mengacu pada `SPEC.md` untuk logika/data dan pada `UI-SPEC.md` ini untuk tampilan & interaksi. Setiap penyimpangan visual dicatat sebagai revisi versi sebelum dikerjakan.
