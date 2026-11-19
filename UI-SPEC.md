# UI-SPEC.md — NEXORA

**Spesifikasi Antarmuka Prototype Marketplace Katalog Produk Digital**

| Field | Nilai |
|---|---|
| Nama aplikasi | NEXORA |
| Versi dokumen | 1.3 |
| Tanggal | 19 November 2026 |
| Status | Implementasi selesai — dokumen diselaraskan dengan tampilan aplikasi (Revisi 1.3: ilustrasi UI lokal) |
| Dokumen terkait | `SPEC.md` v1.3 (sumber kebenaran fungsi & data) |
| Stack UI | Vite + JavaScript Vanilla + HTML5 + CSS3 |
| Target | Prototype responsif, netral terang dengan aksen mint/teal, dapat didemonstrasikan 1 hari |

> Dokumen ini adalah spesifikasi visual dan interaksi yang **sudah diselaraskan dengan kode aplikasi**. Token warna, microcopy, dan aset di bawah mengikuti implementasi akhir.

---

## 0. Penyelarasan dengan `SPEC.md`

Penyesuaian berikut sudah tercermin pada implementasi akhir:

| ID | Penyesuaian | Keputusan |
|---|---|---|
| D-01 | Permintaan filter "Preset" vs enum `SPEC.md` "Preset Foto" | **Label chip boleh "Preset"**, tetapi `value` tetap **`Preset Foto`**. Di halaman detail dan tabel tetap tampil "Preset Foto" |
| D-02 | Dashboard diminta 4 statistik, `SPEC.md` baru 3 | Ditambahkan stat ke-4 **"Jumlah Kategori"** = jumlah kategori unik dari data produk (awal = 6). F-11 / AC-21 / AC-31 di `SPEC.md` sudah disinkronkan |
| D-03 | Navbar 4 menu vs route yang ada | `Home → #/`, `Explore → #/explore` (alias katalog + scroll ke `#katalog`), `Categories → #/categories` (anchor ke panel filter), `Dashboard → #/dashboard`. Tidak menambah backend/route server |
| D-04 | Konfirmasi destruktif | hapus produk dan reset wajib memakai dialog konfirmasi (selaras AC-25, AC-31, AC-32) |
| D-05 | Ketergantungan eksternal | Nol CDN: font, ikon, dan gambar harus lokal. Satu-satunya URL eksternal adalah `wa.me` setelah klik tombol |

---

## 1. Identitas dan Konsep Visual

### 1.1 Brand Personality

NEXORA dibayangkan sebagai **"katalog aset digital untuk kreator generasi baru"**: cepat, presisi, berteknologi, tetapi tetap ramah dan tidak memusingkan.

| Atribut | Arti dalam desain |
|---|---|
| Futuristic | Grid halus, orb cahaya lembut, tipografi tajam, aksen mint/teal |
| Profesional | Ruang kosong yang cukup, hierarchy jelas, tidak ramai |
| Percaya diri | Headline tebal, kontras kuat, CTA yang jelas |
| Ringan | Transisi ≤240ms, tanpa animasi berat, placeholder SVG lokal |

### 1.2 Konsep Visual

- **Metafora:** "control panel kreatif" — permukaan kaca putih di atas latar netral terang, dengan dua sumber cahaya mint di kiri dan teal di kanan.
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
3. Gambar produk memakai `assets/products/nx-00X.svg` lokal dengan fallback; ilustrasi dekoratif memakai `assets/illustrations/*.svg` lokal.
4. Ikon memakai inline SVG lokal, bukan font/icon CDN.
5. Tombol memiliki target sentuh minimal **44×44px**.
6. Fokus keyboard selalu terlihat (ring mint 2px, offset 2px).
7. `prefers-reduced-motion` dimatikan untuk animasi dekoratif.
8. Status (kosong, error, sukses) selalu punya teks, bukan hanya warna.

---

## 2. Design System

### 2.1 Color Palette

| Token | Hex / Nilai | Peran |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Latar utama netral terang |
| `--color-surface` | `#F4F6F5` | Permukaan panel/kartu solid |
| `--color-surface-raised` | `#FFFFFF` | Permukaan elevated (modal, dropdown, stat card) |
| `--color-surface-glass` | `rgba(255, 255, 255, 0.88)` | Latar glassmorphism + `backdrop-filter: blur(16px)` |
| `--color-border` | `rgba(15, 23, 42, 0.09)` | Garis halus kartu/panel |
| `--color-border-strong` | `rgba(15, 23, 42, 0.18)` | Garis aktif/fokus dekoratif |
| `--color-text` | `#101116` | Teks utama & headline |
| `--color-text-muted` | `#52525B` | Teks sekunder, deskripsi |
| `--color-text-subtle` | `#71717A` | Label, metadata, placeholder |
| `--accent-primary` | `#10B981` | Aksen utama mint: glow, border, ikon |
| `--accent-primary-strong` | `#059669` | Teks aksen mint besar & elemen dekoratif |
| `--accent-primary-text` | `#047857` | Teks aksen mint kecil (eyebrow, badge, footer) |
| `--accent-primary-soft` | `#34D399` | Aksen mint lembut |
| `--accent-secondary` | `#14B8A6` | Aksen sekunder teal |
| `--accent-secondary-strong` | `#0F766E` | Teks aksen teal, harga, logo |
| `--accent-secondary-soft` | `#5CE7A8` | Aksen mint terang (dekorasi) |
| `--accent-gradient` | `linear-gradient(135deg, #5CE7A8, #4ADABF)` | Tombol utama & chip aktif |
| `--on-accent` | `#06231A` | Teks di atas gradient aksen |
| `--success` | `#16A34A` | Stok tersedia, status sukses |
| `--warning` | `#D97706` | Stok menipis (≤5) |
| `--star` | `#EAB308` | Ikon bintang unggulan di dashboard |
| `--danger` | `#DC2626` | Error validasi, stok habis, hapus |
| `--focus` | `#059669` | Ring fokus keyboard |

### 2.2 Verifikasi Kontras (WCAG 2.1 — dihitung dari token aktual)

| Kombinasi | Rasio | Status |
|---|---:|---|
| `#101116` di `#FFFFFF` | 18.85:1 | ✅ AAA |
| `#101116` di `#F4F6F5` | 17.37:1 | ✅ AAA |
| `#52525B` di `#FFFFFF` | 7.73:1 | ✅ AAA |
| `#71717A` di `#FFFFFF` | 4.83:1 | ✅ AA |
| `#0F766E` di `#FFFFFF` | 5.47:1 | ✅ AA |
| `#059669` di `#FFFFFF` | 3.77:1 | ⚠️ teks besar/tebal & dekorasi saja |
| `#047857` di `#FFFFFF` | 5.48:1 | ✅ AA — teks aksen kecil |
| `#06231A` di `#5CE7A8` | 10.65:1 | ✅ AAA |
| `#06231A` di `#4ADABF` | 9.56:1 | ✅ AAA |
| `#FFFFFF` di `#DC2626` (tombol danger) | 4.83:1 | ✅ AA |
| `#16A34A` / `#D97706` / `#DC2626` di `#FFFFFF` | 3.30 / 3.19 / 4.83:1 | ⚠️ indikator warna — selalu disertai teks |

**Aturan turunan:** aksen mint `#10B981` hanya untuk glow/border/ikon, bukan teks kecil. Headline besar memakai `#059669`; teks aksen kecil memakai `#047857`; teks & harga memakai `#0F766E`. Tombol utama dan chip aktif memakai gradient `#5CE7A8 → #4ADABF` dengan teks `#06231A`. Warna status selalu dipasangkan dengan teks (`Stok: N`, `Stok habis`, pesan error) sehingga warna bukan satu-satunya penanda.

### 2.3 Typography

| Peran | Font | Ukuran / Line-height | Weight | Letter-spacing |
|---|---|---|---|---|
| Display / headline | Space Grotesk | 48/56 desktop · 36/44 mobile | 700 | `-0.02em` |
| H2 section | Space Grotesk | 28/34 desktop · 24/30 mobile | 600 | `-0.01em` |
| H3 card title | Space Grotesk | 18/26 | 600 | `0` |
| Body | Inter | 16/26 | 400 | `0` |
| Small / metadata | Inter | 14/20 | 400 | `0` |
| Caption / label uppercase | Inter | 12/16 | 600 | `+0.08em` |
| Harga | Space Grotesk | 18/24 | 700 | `-0.01em`, warna `--accent-secondary-strong` |
| Button label | Inter | 14/20 | 600 | `+0.01em` |

**Font stack:**

```text
Headings: "Space Grotesk", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif
Body:     "Inter", system-ui, -apple-system, "Segoe UI", sans-serif
```

Tidak ada `@font-face` atau berkas `woff2`; stack sistem di atas menjaga keterbacaan tanpa CDN.

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
| `space-16` | 64px | Pemisah blok besar & padding hero desktop |

**Container:** `max-width: 1200px`, margin auto, padding inline `16px` (mobile) → `24px` (≥768px).

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
| Glassmorphism | `background: var(--color-surface-glass); backdrop-filter: blur(16px) saturate(140%); border: 1px solid var(--color-border); box-shadow: inset 0 1px 0 rgba(15,23,42,.05)` |
| Gradient hero | `radial-gradient(circle at 12% 4%, rgba(92,231,168,.20), transparent 38%)`, `radial-gradient(circle at 88% 2%, rgba(74,218,191,.14), transparent 36%)` di atas `--color-bg` |
| Gradient CTA | `linear-gradient(135deg, #5CE7A8 0%, #4ADABF 100%)`, teks `#06231A` |
| Gradient teks | `#059669` solid pada kata `Karya` di headline; metadata memakai `--color-text-subtle` |
| Glow hover mint | `box-shadow: 0 0 24px rgba(92,231,168,.20); border-color: var(--color-border-strong)` |
| Glow hover teal | `box-shadow: 0 0 20px rgba(20,184,166,.18)` |
| Shadow dasar | `0 10px 30px rgba(15, 23, 42, .10)` (halus, tidak tebal) |
| Transisi | `150ms ease-out` untuk warna/border, `240ms ease-out` untuk transform & card |
| Hover movement | `translateY(-2px)` pada kartu; `translateY(-1px)` pada tombol |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` → `transition: none; animation: none; transform: none` |
| Card entrance | `cardIn` 420ms ease-out, stagger 45ms per kartu via `--card-index` |
| Image zoom | `.card:hover .card-media img` → `scale(1.04)`; panah `View Details` bergeser 3px |
| Toast & dialog | `toastIn` 220ms, `dialogIn` 200ms, `backdropIn` 200ms |
| Orb hero | `orbFloat` 9s/11s alternate, tidak menimpa teks |
| Ilustrasi hero | `heroDrift` 8s alternate (`translateY(-50%)` → `-53%`); SVG lokal, `aria-hidden` |
| Empty state | Ilustrasi `empty-search.svg` `floaty` 2.6s (ikon SVG inline tetap 42px di empty page) |
| Ilustrasi dashboard | `dashboard-management.svg` `floaty` 3.4s, tampil ≥1024px |
| Shortcut `/` | Fokus ke `#search-input` saat tidak ada input/textarea/select aktif |

### 2.7 Ikonografi

- Semua ikon berupa **inline SVG lokal** dengan `stroke="currentColor"`, `width/height: 18–20px`, `stroke-width: 1.8`.
- Set ikon aktual: grid, search, arrow, back, star, box, layers, plus, edit, trash, menu, close, check, reset, dot, whatsapp. Ikon `grid` dipakai ulang untuk sort; tidak ada ikon filter/image-placeholder/alert.
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
  <!-- <dialog> dibuat dinamis saat konfirmasi/form -->
</body>
```

### 3.2 Navbar

| Elemen | Spesifikasi |
|---|---|
| Logo | Ikon `◈` SVG + wordmark **NEXORA**, letter-spacing `0.12em`, weight 700, warna text + aksen teal pada ikon. Klik → `#/` |
| Menu | `Home`, `Explore`, `Categories`, `Dashboard` (urutan tetap) |
| Active state | Teks `--color-text` + underline gradient 2px di bawah menu; menu lain `--color-text-subtle` |
| Hover | Teks → `--accent-secondary-strong`, underline memanjang 150ms |
| Kanan (desktop) | Badge kecil "DEMO" berbentuk pill + tombol ikon `+ Tambah` mengarah ke dashboard |
| Kanan (mobile) | Tombol hamburger 44×44px → drawer |
| Sticky | `position: sticky; top: 0; z-index: 50`; glass + border-bottom tipis |

**Pemetaan menu:**

| Menu | Target | Perilaku |
|---|---|---|
| Home | `#/` | Katalog + hero, scroll ke atas |
| Explore | `#/explore` | Alias katalog; fokus & scroll ke chip `Semua` di toolbar |
| Categories | `#/categories` | Fokus & scroll ke chip `Template Canva` |
| Dashboard | `#/dashboard` | View pengelola (tanpa login) |

### 3.3 Navigasi Mobile

- Hamburger membuka **drawer** dari kanan, lebar `min(84vw, 320px)`, latar `--color-surface-raised` + blur, berisi 4 menu plus badge "DEMO".
- Overlay `rgba(15,23,42,.35)` di belakang drawer; klik overlay / tombol close / `Escape` menutup.
- Saat terbuka: fokus dipindah ke item pertama; saat ditutup fokus kembali ke tombol hamburger.
- Tidak ada bottom tab bar di MVP (disederhanakan, mengurangi tested surface).

### 3.4 Grid Halaman

| Area | Desktop (≥1280) | Tablet (768–1023) | Mobile (<768) |
|---|---|---|---|
| Hero | 1 kolom + dekorasi absolut | 1 kolom + dekorasi absolut | 1 kolom |
| Katalog | 4 kolom | 2 kolom | 1 kolom |
| Dashboard stat | 4 kolom | 2 kolom | 2 kolom |
| Detail produk | 2 kolom 55/45 | 2 kolom 55/45 | 1 kolom |
| Form CRUD | dialog `min(92vw, 520px)` | dialog `min(92vw, 520px)` | dialog hampir penuh |

---

## 4. Spesifikasi Hero Section

### 4.1 Struktur

```text
[ hero panel: glass, radius-2xl, padding 64/48 desktop · 48/24 tablet · 32/24 mobile ]
  ├─ eyebrow badge: "✦ KATALOG ASET DIGITAL · EDISI 2026"
  ├─ headline (display): "Temukan Aset Digital untuk Karya Berikutnya."
  ├─ deskripsi (body, max 52ch): "8 produk digital pilihan — template, e-book,
  │   preset, dan UI kit — siap pakai dalam hitungan menit."
  ├─ baris aksi: [ SearchBar .......... ] [ Explore Products → ]
  └─ meta: "8 produk  •  6 kategori  •  100% lokal"
  [ kanan: dekorasi orb + grid CSS + hero-catalog.svg, aria-hidden="true" ]
```

### 4.2 Perilaku

- Search bar di hero **terhubung langsung** ke state pencarian katalog; mengetik langsung menyaring daftar di bawahnya (live filter). Tombol `Explore Products` yang menggulir ke katalog; `Enter` di input tidak ditangani khusus.
- Tombol **Explore Products** membuka `#/explore`, lalu fokus & scroll halus ke chip filter "Semua".
- Dekorasi orb/grid memakai CSS (`radial-gradient`, grid linear, blur); ilustrasi `assets/illustrations/hero-catalog.svg` adalah SVG lokal, **bukan gambar eksternal**, keduanya `pointer-events: none` dan `aria-hidden="true"`.
- Ilustrasi hero berada di kanan panel: `opacity 1` desktop, `0.9` tablet, dan `0.22` di mobile sebagai latar redup; headline tetap pertama dibaca.

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
| Latar | `rgba(244, 246, 245, .9)` (terang, bukan gelap); border `--color-border`; fokus border `--accent-primary` + ring 2px |
| Placeholder | `--color-text-subtle` (`#71717A`), kontras 4.83:1 di bg utama |
| Perilaku | Case-insensitive, cocokkan `nama + kategori + deskripsi`; debounce 150ms opsional; hasil langsung diperbarui |
| Clear | Menghapus teks, mengembalikan fokus ke input, hasil kembali semua |
| A11y | `<label class="sr-only">Cari produk</label>`, `aria-controls="product-grid"` |

### 5.2 Filter Kategori

| Aspek | Spesifikasi |
|---|---|
| Bentuk | Chip pill; label: `Semua`, `Template Canva`, `Website Template`, `E-book`, `Preset` (= `Preset Foto`), `UI Kit`, `Digital Assets` |
| Default | Chip `Semua` aktif |
| Aktif | Latar gradient mint→teal, teks `#06231A`, border glow, `aria-pressed="true"` |
| Nonaktif | Latar `rgba(15,23,42,.04)`, teks `--color-text-muted`, border `--color-border` |
| Hover | Teks `--accent-secondary-strong`, border `--color-border-strong`, `translateY(-1px)` |
| Mobile | `overflow-x: auto`, scroll-snap, chip tidak terpotong, scrollbar disembunyikan tapi tetap di-scroll |
| A11y | `role="group" aria-label="Filter kategori produk"`; status aktif tidak hanya warna (ada `aria-pressed` + ikon centang kecil) |

#### Filter Harga (tambahan F-05)

| Aspek | Spesifikasi |
|---|---|
| Kontrol | `<select>` kedua di toolbar, bersebelahan dengan sort; ikon `layers` berwarna teal |
| Opsi | `Semua harga` (default), `< Rp100.000`, `Rp100.000 – Rp300.000`, `> Rp300.000` |
| Nilai internal | `semua`, `di-bawah-100`, `100-300`, `di-atas-300` |
| Aturan | `< 100000`; `>= 100000 && <= 300000`; `> 300000` |
| A11y | `<label for="harga-select">Rentang harga</label>` (sr-only) + `aria-label="Filter rentang harga"` |
| Reset | Tombol `Reset filter` muncul saat rentang harga aktif dan mengembalikan `semua` |

### 5.3 Sorting

| Aspek | Spesifikasi |
|---|---|
| Kontrol | Native `<select>` ter-styled (paling aksesibel & ringan), lebar mengikuti konten / penuh mobile |
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
| Kategori (chip kecil, teal)    |
| Nama produk (2 baris, clamp)   |
| Rp149.000          Stok: 42    |
| [ View Details → ]             |
+--------------------------------+
```

| Elemen | Spesifikasi |
|---|---|
| Kartu | Latar glass, radius 16px, border 1px, padding 16px, `overflow: hidden` |
| Gambar | `aspect-ratio: 16/9`, `object-fit: cover`, radius 12px; 8 SVG lokal mengilustrasikan deskripsi produk dengan latar terang + aksen mint/teal |
| Badge unggulan | Pill kiri-atas, ikon ★ + teks `Unggulan`, latar `rgba(217,119,6,.10)`, teks `--warning` |
| Chip kategori | Kanan-atas di atas gambar, latar `rgba(20,184,166,.12)`, teks `--accent-secondary-strong` |
| Nama | H3 18/26, 2 baris maksimal (`line-clamp: 2`), warna `--color-text` |
| Harga | 18/24 weight 700, warna `--accent-secondary-strong` |
| Stok | 12/16, ikon titik: hijau (`--success`) jika >5, kuning (`--warning`) jika 1–5, merah (`--danger`) jika 0; teks `Stok: N` atau `Stok habis` |
| Tombol | `View Details →`, lebar penuh, tinggi minimal 44px, secondary style (border teal, teks teal), radius 12px |

### 6.3 Interaksi Kartu

- Hover kartu: `translateY(-2px)`, border `--color-border-strong`, glow mint halus `rgba(92,231,168,.20)`, bayangan naik.
- Hover tombol: latar `rgba(20,184,166,.18)`, glow teal.
- Hanya tombol yang fokus/keyboard-activatable; kartu tidak memakai `onclick` tersembunyi agar tidak ada nested interactive.
- Klik tombol → hash route `#/produk/:id`.

### 6.4 Empty State Katalog

```text
   [ empty-search.svg: kartu + kaca pembesar, 132px ]
        Tidak ada produk yang cocok
   Coba kata kunci lain atau reset filter kategori.
          [ Reset filter ]
```

- Teks `--color-text-muted`, judul `--color-text`, ilustrasi dekoratif `aria-hidden="true"`.
- Ilustrasi memakai `assets/illustrations/empty-search.svg`, lebar 132px (`max-width: 60%`), animasi `floaty` 2.6s.
- Halaman “Produk tidak ditemukan” tetap memakai ikon inline 42px (bukan SVG dekoratif).
- Kontainer tetap glass dengan padding 32px, min-height 240px.

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
[ Kembali ke katalog      NEXORA ]
[ Gambar produk 4:3, badge unggulan ]
[ Kategori ]
[ Nama produk ]
[ Harga + Stok ]
[ DESKRIPSI + isi ]
[ INFORMASI PRODUK (definition list) ]
[ Tombol WhatsApp (statik di alur konten, lebar penuh mobile / 260px desktop) ]
```

### 7.3 Aturan Konten

| Elemen | Aturan |
|---|---|
| Breadcrumb | Teks `--color-text-subtle`, pemisah `/`, item terakhir `--color-text` |
| Gambar | `aspect-ratio: 4/3`, radius 20px, fallback SVG, `alt="Ilustrasi produk ${nama}"` |
| Judul | Space Grotesk 32/40 desktop, 26/34 mobile, weight 700 |
| Harga | Space Grotesk 24/32, `--accent-secondary-strong` |
| Stok | Status + warna seperti kartu; teks `Stok: N` atau `Stok habis` |
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
| Warna | Latar `--accent-gradient` (`#5CE7A8 → #4ADABF`), teks `--on-accent` (`#06231A`) → kontras 10.65:1 → 9.56:1 |
| Ukuran | Tinggi 48px, lebar penuh di mobile / 260px di desktop, radius 12px |
| Hover | `translateY(-1px)`, glow mint, sedikit lebih terang |
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
Dashboard Pengelola       [ dashboard-management.svg ] [ + Tambah Produk ] [ Reset Data ]
Kelola katalog NEXORA — semua data tersimpan di perangkat ini.
```

- Badge `DEMO` di sebelah judul sebagai pengingat tanpa login.
- Ilustrasi `assets/illustrations/dashboard-management.svg` (lebar 180px, `aria-hidden="true"`) tampil hanya di ≥1024px; di layar lebih kecil disembunyikan agar tombol tidak terdesak.
- Tombol `Tambah Produk` memakai primary gradient.
- Tombol `Reset Data` memakai ghost dengan ikon rotate; hover memakai `--color-border-strong`, bukan danger.

### 9.2 Stat Cards (4)

| Card | Ikon | Warna aksen | Nilai awal |
|---|---|---|---:|
| Total Produk | box | `--accent-primary-strong` | 8 |
| Total Stok | layers | `--accent-secondary-strong` | 382 |
| Produk Unggulan | star | `--star` (#EAB308) | 4 |
| Jumlah Kategori | grid | `--success` | 6 |

- Angka Space Grotesk 32/38 weight 700; label 12px uppercase.
- Kartu glass, padding 20px, radius 16px, garis atas 2px sesuai aksen.
- Nilai dihitung ulang otomatis setelah create/update/delete/reset (sesuai AC-31).
- Ikon bintang dashboard (kartu stat & kolom tabel) memakai `--star` `#EAB308`, ukurannya 18px dan diisi (`fill`) agar tidak tampak kebesaran; teks `★ Unggulan` pada kartu baris mobile mengikuti warna yang sama.

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
- Baris hover: latar `rgba(15,23,42,.04)`.
- Baris kosong: lihat UI States.
- Di mobile (<768px), tabel berubah menjadi **kartu baris**: `[thumb] Nama / kategori · ★ / harga · stok / [Edit][Hapus]`.

### 9.4 Form Create / Edit

- Bentuk: **dialog `<dialog>`** (mobile: hampir penuh; desktop: panel 520px), latar `--color-surface-raised`, radius 20px, overlay `rgba(15,23,42,.45)` + blur.
- Judul: `Tambah Produk` / `Edit Produk`.
- Field:

| Field | Kontrol | Validasi (from `SPEC.md`) |
|---|---|---|
| Nama | text | wajib, 3–80 karakter |
| Kategori | select | wajib, salah satu 6 enum (label `Preset` = value `Preset Foto`) |
| Harga | number, `step="0.01"` | finite, `>= 0`, maks 2 desimal; tolak negatif |
| Stok | text input mode numeric | `/^\d+$/`, bulat, `>= 0`; tolak `-5`, `2.5` |
| Deskripsi | textarea 3 baris | wajib, 10–500 karakter |
| imageUrl | text | path lokal / `data:image/`; tolak `http(s)://` |
| Unggulan | checkbox | boolean |

- Error tampil **di bawah field** (12px, `--danger`), input `aria-invalid="true"`, `aria-describedby` ke pesan; pesan umum memakai `role="alert"` tanpa ikon khusus.
- Error ringkas dan spesifik: `Stok harus bilangan bulat lebih dari atau sama dengan 0.`
- Tombol: `Simpan` (primary), `Batal` (ghost). Validasi gagal menampilkan toast error `Periksa kembali input Anda.`; tombol tetap aktif; tidak ada state loading/spinner.
- Edit tidak mengizinkan mengubah `id`; field ID ditampilkan read-only.

### 9.5 Konfirmasi & Reset

- Hapus → dialog: `Hapus produk "${nama}"?` + `Tindakan ini tidak dapat dibatalkan.` + `[Batal] [Hapus]`.
- Reset → dialog: `Reset semua produk ke 8 data awal?` + `Perubahan Anda akan hilang.` + `[Batal] [Reset]`.
- Dialog memakai `<dialog>` native; fokus otomatis ke tombol `Batal`; `Escape` = batal.
- Tombol konfirmasi destruktif memakai `--danger` (`#DC2626`) dengan teks putih (kontras 4.83:1).

### 9.6 Toast

- Posisi kanan-bawah desktop, bawah mobile di atas safe-area.
- Tipe: success (border `--success`), error (border `--danger`), info (border `--accent-secondary`).
- Auto-hilang 4 detik, bisa ditutup manual, `role="status"` / `role="alert"`.
- Contoh: `Produk berhasil ditambahkan.`, `Produk berhasil diperbarui.`, `Produk dihapus.`, `Data dikembalikan ke 8 produk awal.`, `Gagal menyimpan data lokal. Perubahan hanya berlaku di sesi ini.`

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
| A-08 | Error validasi: `aria-invalid="true"`, `aria-describedby`, pesan umum diumumkan via `role="alert"` |
| A-09 | `aria-live="polite"` pada result counter & toast; jumlah hasil berubah diumumkan |
| A-10 | Gambar produk punya `alt` deskriptif; gambar dekoratif `aria-hidden="true"` |
| A-11 | Target sentuh minimal 44×44px, jarak antar tombol aksi minimal 8px |
| A-12 | `prefers-reduced-motion: reduce` menonaktifkan transisi/animasi dekoratif |
| A-13 | Zoom browser 200% tidak memotong konten atau menghilangkan aksi |
| A-14 | Urutan DOM mengikuti urutan visual (mobile-first), bukan diatur hanya dengan CSS `order` |
| A-15 | Teks tidak memakai `text-transform` sebagai satu-satunya pembeda makna |
| A-16 | Dialog native `<dialog>` mengembalikan fokus ke elemen pemicu setelah ditutup; drawer memakai fokus eksplisit ke toggle |

---

## 11. Responsive Breakpoints

| Nama | Rentang | Grid katalog | Hero | Dashboard stat | Nav |
|---|---|---:|---|---|---|
| `xs` | <360px | 1 | 1 kolom | 2 | hamburger |
| `sm` | 360–767px | 1 | 1 kolom | 2 | hamburger |
| `md` | 768–1023px | 2 | 1 kolom + dekorasi absolut | 2 | hamburger |
| `lg` | 1024–1279px | 3 | 1 kolom + dekorasi absolut | 4 | menu penuh |
| `xl` | ≥1280px | 4 | 1 kolom + dekorasi absolut | 4 | menu penuh |

**Aturan tambahan:**

- Mobile-first: CSS ditulis dengan `@media (min-width: 768px)` ke atas.
- Container padding: `16px` → `24px` (≥768).
- Hero: blok `32px/40px`; panel `32px/24px` mobile, `48px/24px` tablet, `64px/48px` desktop.
- Filter chip: scroll horizontal di <768px, wrap di ≥768px.
- Tabel dashboard → kartu di <768px.
- Tidak ada `overflow-x` pada `<body>`; satu-satunya scroll horizontal adalah chip filter dan panel tabel.

---

## 12. Wireframe Teks

**Legenda:** `[ ]` = kontrol/button, `...` = konten berulang, `◈` = logo, `★` = unggulan, `→` = aksi navigasi, `▾` = dropdown.

### 12.1 Homepage — Desktop (1280px)

```text
+----------------------------------------------------------------------------------------------+
| ◈ NEXORA     Home   Explore   Categories   Dashboard                      [DEMO]  [+ Tambah]   |
+----------------------------------------------------------------------------------------------+
|  +----------------------------------------------------------------------------------------+  |
|  | ✦ KATALOG ASET DIGITAL · EDISI 2026                          (glow mint)     (glow teal)|  |
|  |                                                                                        |  |
|  |  Temukan Aset Digital                                        [hero-catalog.svg]         |  |
|  |  untuk Karya Berikutnya.                                     ~ grid + orb kaca ~        |  |
|  |                                                                                        |  |
|  |  8 produk digital pilihan — template, e-book, preset, dan UI kit — siap pakai          |  |
|  |  dalam hitungan menit.                                                                  |  |
|  |                                                                                        |  |
|  |  [ 🔍 Cari nama atau kata kunci...        ]  [ Explore Products → ]                    |  |
|  |  8 produk • 6 kategori • 100% lokal                                                     |  |
|  +----------------------------------------------------------------------------------------+  |
+----------------------------------------------------------------------------------------------+
|  Jelajahi Katalog                                       Menampilkan 8 dari 8 produk           |
|  Kategori: [Semua][Template Canva][Website Template][E-book][Preset][UI Kit][Digital Assets]  |
|  Urutkan: [ Produk Terbaru ▾ ] [ Semua harga ▾ ]                        [ Reset filter ]     |
+----------------------------------------------------------------------------------------------+
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+      |
|  | [ IMG 16:9    ]   | | [ IMG 16:9    ]   | | [ IMG 16:9    ]   | | [ IMG 16:9    ]   |      |
|  |            [Cat]  | |            [Cat]  | |            [Cat]  | | ★Unggulan  [Cat]  |      |
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+      |
|  | Digital Assets    | | Website Template  | | Digital Assets    | | UI Kit            |      |
|  | Futuristic Mock.. | | Minimal Portfo... | | Glassmorphism...  | | Orbit UI Kit ...  |      |
|  | Rp259.000         | | Rp199.000         | | Rp79.000          | | Rp459.000         |      |
|  | ● Stok: 25        | | ● Stok: 30        | | ● Stok: 120       | | ● Stok: 12        |      |
|  | [ View Details → ]| | [ View Details → ]| | [ View Details → ]| | [ View Details → ]|      |
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+      |
|  ... 4 kartu berikutnya (baris 2) ...                                                        |
+----------------------------------------------------------------------------------------------+
|  NEXORA · Prototype demo · Data lokal · WhatsApp = nomor demo · Tanpa pembayaran                |
+----------------------------------------------------------------------------------------------+
```

### 12.2 Homepage — Mobile (375px)

```text
+--------------------------------------+
| ◈ NEXORA                     [ ☰ ]   |
+--------------------------------------+
|  ✦ KATALOG ASET DIGITAL 2026         |
|  ~ ilustrasi hero redup di kanan ~    |
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
|  8 produk • 6 kategori • 100% lokal|
+--------------------------------------+
| Stat card hanya tampil di #/dashboard |
| Jelajahi Katalog      8 dari 8       |
| Kategori (geser →)                   |
| [Semua][Canva][Website][E-book]...   |
| Urutkan: [ Terbaru ▾ ][ Semua harga ▾]|
+--------------------------------------+
| +----------------------------------+ |
| | [      IMG 16:9               ]  | |
| | ★ Unggulan          [Preset]   |  |
| +----------------------------------+ |
| | Digital Assets                |  |
| | Futuristic Mockup Bundle      |  |
| | Rp259.000       ● Stok: 25    |  |
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
| |     ilustrasi SVG lokal          | |
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

### 12.4 Dashboard Pengelola — Desktop (1280px)

```text
+----------------------------------------------------------------------------------------------+
| ◈ NEXORA   Home   Explore   Categories  [Dashboard]                    [DEMO]  [+ Tambah]    |
+----------------------------------------------------------------------------------------------+
|  Dashboard Pengelola   [dashboard-mgmt.svg]   [ + Tambah Produk ]  [ ⟲ Reset Data ]           |
|  Kelola katalog NEXORA — semua data tersimpan di perangkat ini.                                |
+----------------------------------------------------------------------------------------------+
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+       |
|  | TOTAL PRODUK      | | TOTAL STOK        | | PRODUK UNGGULAN   | | JUMLAH KATEGORI   |       |
|  | 8                 | | 382               | | 4                 | | 6                 |       |
|  | [box]             | | [layers]          | | [star]            | | [grid]            |       |
|  +-------------------+ +-------------------+ +-------------------+ +-------------------+       |
+----------------------------------------------------------------------------------------------+
|  DAFTAR PRODUK                                          8 produk tersimpan                    |
|  +--------+---------------------+-------------+----------+--------+-----------+------------+  |
|  | IMG    | Nama                | Kategori    | Harga    | Stok   | Unggulan  | Aksi       |  |
|  +--------+---------------------+-------------+----------+--------+-----------+------------+  |
|  | [img]  | Neon Grid Canva Kit | Template... | Rp149.000| 42     | ★         | [✎] [🗑]   |  |
|  | [img]  | Aurora Landing Page | Website...  | Rp329.000| 18     | ★         | [✎] [🗑]   |  |
|  | ... 6 baris berikutnya ...                                                              |  |
|  +--------+---------------------+-------------+----------+--------+-----------+------------+  |
+----------------------------------------------------------------------------------------------+
|  DIALOG FORM (muncul saat Tambah/Edit)                                                        |
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
| Dashboard Pengelola          [DEMO]  |
| Kelola katalog NEXORA — data lokal.   |
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
| FORM = dialog `<dialog>`              |
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
| `SearchBar` | default, filled, focus | `value, placeholder` | Hero saja |
| `FilterChips` | default, active | `categories, selected` | Katalog |
| `SortSelect` | default | `options, value` | Katalog |
| `ResultCounter` | default | `shown, total` | Katalog |
| `ProductGrid` | 1/2/3/4 kolom | `products, state` | Homepage |
| `ProductCard` | default, featured, hover | `product` | Grid |
| `Breadcrumb` | default | `items` | Detail |
| `DetailPanel` | desktop, mobile | `product` | Detail |
| `InfoList` | definition list | `rows` | Detail |
| `StatCard` | primary, secondary, warning, success | `label, value, icon` | Dashboard |
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
| **Active / Focus** | Chip aktif = gradient mint→teal + `aria-pressed`; fokus keyboard = ring mint 2px offset 2px; nav aktif = underline gradient | Filter "E-book", tombol WA saat fokus |
| **Empty** | Panel glass min-height 240px, ikon search opacity .5, judul + petunjuk + tombol `Reset filter` | Pencarian "zzzz" tanpa hasil |
| **Error** | Border input `--danger`, pesan 12px di bawah field, toast merah | `stok = 2.5` ditolak; localStorage gagal |
| **Success** | Border/toast `--success`, pesan singkat; data langsung ter-refresh | `Produk berhasil ditambahkan.` / `Produk berhasil diperbarui.` |
| **Loading / Disabled / Selected** | Tidak diimplementasikan pada prototype; operasi lokal instan, tombol tetap aktif, tidak ada seleksi baris | — |

---

## 15. Definition of Done (UI)

UI NEXORA dinyatakan selesai jika:

1. ✅ Seluruh komponen dalam inventory Bagian 13 tersedia dan dipakai konsisten.
2. ✅ Palet, tipografi, spacing, radius, dan efek mengikuti token Bagian 2 tanpa warna hardcode yang berulang.
3. ✅ Rasio kontras dihitung dari token aktual (Bagian 2.2); aksen `#10B981` tidak dipakai sebagai teks kecil dan status selalu disertai teks.
4. ✅ Navbar berisi logo + 4 menu (Home, Explore, Categories, Dashboard) dan berfungsi di desktop serta drawer mobile.
5. ✅ Hero menampilkan headline, deskripsi, search bar, dan tombol Explore Products dengan perilaku sesuai Bagian 4.
6. ✅ Filter 6 kategori + sorting 5 opsi + result counter bekerja dan statusnya terbaca (bukan hanya warna).
7. ✅ Product card menampilkan gambar lokal, nama, kategori, harga Rupiah, stok, dan tombol View Details.
8. ✅ Halaman detail menampilkan seluruh informasi produk dan tombol WhatsApp dengan pesan ter-encode sesuai `SPEC.md`.
9. ✅ Dashboard menampilkan 4 stat card (termasuk Jumlah Kategori), tabel/kartu produk, dan form CRUD valid.
10. ✅ Empty, error, success, hover, dan active state diuji minimal sekali pada katalog, detail, dan dashboard.
11. ✅ 5 wireframe (homepage desktop, homepage mobile, detail mobile, dashboard desktop, dashboard mobile) terealisasi tanpa perubahan struktur besar.
12. ✅ Diuji di viewport 375px dan 1280px: tidak ada overflow horizontal di `<body>`, teks tidak terpotong.
13. ✅ A-01…A-16 terpenuhi; fokus keyboard terlihat dan dialog/drawer bisa ditutup dengan `Escape`.
14. ✅ Nol aset/CDN eksternal; satu-satunya URL keluar adalah `wa.me` setelah klik.
15. ✅ `prefers-reduced-motion` dihormati; transisi ≤240ms, animasi dekoratif masuk paling lama 420ms (card entrance).
16. ✅ Konsisten dengan `SPEC.md` v1.3, termasuk penyesuaian D-01…D-05 yang sudah dicatat.

---

## 16. Catatan Penyerahan

Dokumen ini adalah spesifikasi UI yang **telah diselaraskan dengan implementasi akhir**. Token warna, microcopy, delapan ilustrasi produk, dan tiga ilustrasi dekoratif (`hero-catalog`, `empty-search`, `dashboard-management`) mengikuti aplikasi yang berjalan. `SPEC.md` tetap menjadi acuan logika/data; penyimpangan visual selanjutnya dicatat sebagai revisi versi.
