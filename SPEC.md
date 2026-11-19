# SPEC.md — NEXORA

**Spesifikasi Prototype Marketplace Katalog Produk Digital**

| Field | Nilai |
|---|---|
| Nama aplikasi | NEXORA |
| Versi dokumen | 1.1 |
| Tanggal | 19 November 2026 |
| Status | Implementasi selesai — dokumen diselaraskan dengan aplikasi (Revisi 1.1) |
| Target pengerjaan | Prototype dapat didemonstrasikan dalam **1 hari kerja (≈8 jam efektif)** |
| Peran penulis | System Analyst + Software Engineer |
| Platform | Web, satu perangkat, tanpa backend |

---

## 1. Tujuan Aplikasi

NEXORA adalah prototype marketplace katalog produk digital berbasis web yang bertujuan:

1. Menyajikan katalog **8 produk digital contoh** dalam tampilan modern terang dengan aksen mint/teal sebagai media latihan pengembangan.
2. Memungkinkan calon pembeli menemukan produk melalui **pencarian, filter kategori, dan sorting** tanpa bantuan server.
3. Memberikan halaman **detail produk** dan tombol **WhatsApp** untuk melakukan inquiry penjualan secara manual.
4. Menyediakan **dashboard demo CRUD** bagi pengelola toko untuk mengelola data produk secara lokal.
5. Menjadi contoh implementasi frontend vanilla yang rapi: state management sederhana, validasi, persistensi `localStorage`, dan UI responsif.

**Nilai yang diutamakan:** kejelasan alur data, kemudahan verifikasi manual, dan konsistensi desain—bukan kelengkapan fitur produksi.

---

## 2. Pengguna dan Hak Akses

Aplikasi berjalan pada **satu perangkat** dan **tidak memiliki sistem autentikasi**. Peran berikut adalah peran fungsional (cara pakai), bukan pembatas keamanan.

| Peran | Hak / Kemampuan | Catatan |
|---|---|---|
| **Calon Pembeli** | Melihat katalog, mencari, memfilter, mengurutkan, membuka detail produk, membuka tautan WhatsApp dengan pesan otomatis | Hak default saat membuka aplikasi |
| **Pengelola Toko** | Semua kemampuan pembeli + melihat dashboard, menambah, membaca, mengedit, menghapus produk, melihat ringkasan, menekan tombol reset | Diakses lewat navigasi `#/dashboard` |

**Keputusan desain terkait akses:**

- Tidak ada login, tidak ada "login palsu", tidak ada simulasi peran berbasis kata sandi.
- Tombol navigasi ke dashboard tersedia terbuka (demo). Risiko ini dicatat di Bagian 8.
- Semua perubahan data langsung memengaruhi katalog pada perangkat yang sama.

---

## 3. Daftar Fitur MVP (Kebutuhan Fungsional)

| ID | Fitur | Deskripsi Singkat |
|---|---|---|
| F-01 | Katalog awal | Menampilkan tepat 8 produk digital contoh saat pertama kali dibuka |
| F-02 | Aset gambar lokal | Setiap produk memakai gambar lokal/placeholder lokal, tanpa request ke API eksternal |
| F-03 | Informasi produk | Kartu & detail menampilkan nama, kategori, harga Rupiah, stok, deskripsi, gambar, status unggulan |
| F-04 | Pencarian | Pencarian case-insensitive pada `nama`, `kategori`, dan `deskripsi`/kata kunci |
| F-05 | Filter kategori | Filter: Semua + 6 kategori digital |
| F-06 | Sorting | 5 opsi: harga termurah, harga termahal, nama A–Z, nama Z–A, produk terbaru |
| F-07 | Halaman detail | Tampilan lengkap satu produk berdasarkan `id`, bisa diakses lewat hash route |
| F-08 | Tombol WhatsApp | Membuka `https://wa.me/<nomor>?text=...` berisi nama produk dan harga Rupiah |
| F-09 | Dashboard CRUD | Create, Read, Update, Delete produk melalui form dan tabel |
| F-10 | Validasi form | Menolak harga negatif, stok negatif/desimal, field wajib kosong, kategori di luar enum |
| F-11 | Ringkasan | Menampilkan total produk, total stok, jumlah produk unggulan, dan jumlah kategori unik (live setelah perubahan) |
| F-12 | localStorage | Seluruh data tersimpan lokal dan bertahan setelah reload |
| F-13 | Reset data | Mengembalikan data ke 8 produk awal dengan konfirmasi |

### 3.1 Kategori Produk Digital (enum tetap)

1. Template Canva
2. Website Template
3. E-book
4. Preset Foto
5. UI Kit
6. Digital Assets

### 3.2 Opsi Sorting (nilai internal)

| Label UI | Nilai `sort` | Aturan urutan |
|---|---|---|
| Produk Terbaru | `terbaru` | `createdAt` descending; produk baru otomatis di urutan pertama (default) |
| Harga Termurah | `harga-asc` | `harga` ascending |
| Harga Termahal | `harga-desc` | `harga` descending |
| Nama A–Z | `nama-asc` | `nama.localeCompare` ascending, `id` sebagai tie-breaker |
| Nama Z–A | `nama-desc` | `nama.localeCompare` descending, `id` sebagai tie-breaker |

> **Keputusan analis:** model field dari pemilik kebutuhan tidak memuat penanda waktu, tetapi sorting "produk terbaru" memerlukan sinyal urutan. Ditambahkan field internal **`createdAt`** (ISO 8601 string) yang dikelola otomatis oleh aplikasi, **tidak ditampilkan/ tidak diedit** di form CRUD. Field wajib tetap 8 field seperti yang ditentukan; `createdAt` adalah metadata tambahan.

### 3.3 Alur Data Ringkas

```
src/products.js (SEED 8 produk + helper murni)
   → src/store.js init()  [baca nexora.catalog.v1; jika kosong/rusak → seed & tulis]
   → state.products[]
   → src/main.js: search → filter → sort → src/ui.js render katalog / dashboard
   → aksi CRUD → validateProduct() → mutate state → save() → render ulang + update ringkasan
```

---

## 4. Data Model

### 4.1 Model Produk

| Field | Tipe | Wajib | Aturan / Validasi |
|---|---|---|---|
| `id` | string | Ya | Unik. Format `nx-<base36 timestamp><random 3 digit>`; tidak bisa diedit lewat UI |
| `nama` | string | Ya | Trim; panjang 3–80 karakter |
| `kategori` | string | Ya | Harus salah satu dari 6 kategori di Bagian 3.1 |
| `harga` | number | Ya | Finite, `>= 0`; maksimal 2 digit desimal; ditolak jika negatif/NaN/Infinity |
| `stok` | integer | Ya | `>= 0`, **bulat**, ditolak jika desimal atau negatif; cocokkan `/^\d+$/` pada input string |
| `deskripsi` | string | Ya | Trim; panjang 10–500 karakter; dipakai juga sebagai kata kunci pencarian |
| `imageUrl` | string | Ya | Path lokal (`./assets/...`, `assets/...`) atau `data:image/...`; URL `http(s)://` eksternal ditolak agar tetap offline |
| `unggulan` | boolean | Ya | Checkbox di form; true = tampil badge "Unggulan" |
| `createdAt` | string (ISO 8601) | Ya (internal) | Di-set otomatis saat create; tidak diedit pengguna; dipakai sorting `terbaru` |

### 4.2 Skema localStorage

- **Key:** `nexora.catalog.v1`
- **Value (JSON):**

```json
{
  "version": 1,
  "products": [ "<objek produk seperti Bagian 4.1>" ]
}
```

- Jika `version` bukan `1` atau JSON gagal di-parse → anggap korup, kembalikan ke seed 8 produk.
- Semua akses `localStorage` dibungkus `try/catch` (mode private/kuota penuh tidak boleh membuat aplikasi blank).

### 4.3 Data Awal (8 Produk Fiktif)

> Seluruh nama, harga, dan deskripsi bersifat **fiktif dan nonpribadi**. `createdAt` diberi urutan menaik dari `nx-001` (paling lama) sampai `nx-008` (paling baru), sehingga sorting "terbaru" menghasilkan `nx-008` lebih dulu.

| id | nama | kategori | harga | stok | unggulan | imageUrl |
|---|---|---|---:|---:|---|---|
| `nx-001` | Neon Grid Canva Kit | Template Canva | 149000 | 42 | true | `assets/products/nx-001.svg` |
| `nx-002` | Aurora Landing Page | Website Template | 329000 | 18 | true | `assets/products/nx-002.svg` |
| `nx-003` | Panduan Desain Typography | E-book | 99000 | 75 | false | `assets/products/nx-003.svg` |
| `nx-004` | Cinematic Lightroom Set | Preset Foto | 129000 | 60 | true | `assets/products/nx-004.svg` |
| `nx-005` | Orbit UI Kit Figma | UI Kit | 459000 | 12 | true | `assets/products/nx-005.svg` |
| `nx-006` | Glassmorphism Icon Pack | Digital Assets | 79000 | 120 | false | `assets/products/nx-006.svg` |
| `nx-007` | Minimal Portfolio Canvas | Website Template | 199000 | 30 | false | `assets/products/nx-007.svg` |
| `nx-008` | Futuristic Mockup Bundle | Digital Assets | 259000 | 25 | false | `assets/products/nx-008.svg` |

**Ringkasan awal yang diharapkan:** total produk **8**, total stok **382**, produk unggulan **4**, kategori unik **6**.

**Deskripsi contoh (boleh diringkas saat implementasi, tetap memuat kata kunci):**

- `nx-001`: "Template Canva neon grid untuk poster, feed Instagram, dan banner digital. Warna futuristic ungu dan cyan, mudah diedit."
- `nx-002`: "Website template landing page satu halaman, responsif, cocok untuk portfolio dan product launch."
- `nx-003`: "E-book panduan tipografi modern: hierarchy, pairing font, dan tips layout untuk desainer pemula."
- `nx-004`: "Preset foto Lightroom bergaya cinematic dengan tone hangat dan kontras tinggi, cocok untuk foto urban."
- `nx-005`: "UI Kit Figma dengan 60+ komponen dashboard dark mode, siap dipakai untuk prototype aplikasi."
- `nx-006`: "Kumpulan ikon glassmorphism berformat SVG, cocok untuk dashboard dan website futuristic."
- `nx-007`: "Template portfolio minimal berbasis HTML dan CSS, ringan dan mudah dimodifikasi."
- `nx-008`: "Bundle mockup futuristic untuk presentasi produk digital, layar laptop, dan perangkat mobile."

### 4.4 Format Harga

- Fungsi `formatRupiah(n)` → `"Rp" + n.toLocaleString("id-ID")`, contoh: `149000` → `Rp149.000`.
- Dipakai konsisten di kartu, detail, form pratinjau, dan pesan WhatsApp.
- Tidak boleh menampilkan `NaN`, `undefined`, atau simbol mata uang lain.

### 4.5 Spesifikasi Tautan WhatsApp

- **Konstanta:** `WA_NUMBER = "6280000000000"` (nomor demo fiktif; didefinisikan sekali di `src/products.js`, mudah diganti sebelum demo).
- **Pesan otomatis (template):**

```
Halo NEXORA, saya tertarik dengan *${nama}* (${formatRupiah(harga)}). Apakah stok masih tersedia?
```

- **URL akhir:** `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`
- Tombol membuka tab baru (`target="_blank" rel="noopener noreferrer"`).
- Tidak ada permintaan HTTP ke WhatsApp sebelum tombol diklik; tidak ada pembayaran.

---

## 5. Nonfunctional Requirements

| ID | Kategori | Requirement |
|---|---|---|
| N-01 | Teknologi | Vite + JavaScript Vanilla (ES Modules) + HTML5 + CSS3 + localStorage. Tanpa framework, tanpa backend, tanpa database online |
| N-02 | Struktur | Berkas aktual: `index.html`, `src/main.js` (router & event), `src/products.js` (data & helper murni), `src/store.js` (state, validasi, localStorage), `src/ui.js` (render & escape), `src/style.css` (design token), dan `public/assets/products/` |
| N-03 | Keamanan | **Tidak menyimpan API key, token, atau kredensial apa pun.** Tidak ada `.env` rahasia |
| N-04 | Keamanan | Data dari `localStorage` dan input pengguna wajib di-escape (`textContent` atau `escapeHtml`). Dilarang menyisipkan string pengguna langsung ke `innerHTML` |
| N-05 | Jaringan | Nol request eksternal saat aplikasi berjalan, kecuali navigasi ke `wa.me` setelah klik tombol. Tidak ada CDN untuk gambar maupun font |
| N-06 | Font | Font stack `Inter`/`Space Grotesk` dengan fallback `system-ui, -apple-system, Segoe UI, sans-serif`; tanpa `@font-face`, berkas woff2, atau Google Fonts CDN |
| N-07 | Gambar | 8 file SVG lokal di `public/assets/products/nx-001.svg` … `nx-008.svg`; tiap ilustrasi menggambarkan deskripsi produknya. Jika gagal dimuat, tampilkan fallback SVG inline buatan sendiri |
| N-08 | Performa | Render awal katalog 8 produk < 2 detik di browser desktop standar; ukuran bundle kecil; tanpa animasi berat |
| N-09 | Responsif | Layout nyaman di desktop (≥1024px), tablet (768–1023px), dan mobile (<768px). Grid kartu 4/3/2/1 kolom menyesuaikan; navigasi tidak overflow |
| N-10 | UI/UX | Tampilan terang netral: latar `#FFFFFF`, surface `#F4F6F5`, teks `#101116`; dua aksen mint `#10B981` dan teal `#14B8A6` dengan gradient `#5CE7A8 → #4ADABF`; glassmorphism; hover & transisi halus (150–250ms) |
| N-11 | Aksesibilitas | Semua kontrol bisa dipakai dengan keyboard, fokus terlihat, label form jelas, kontras teks memadai, tombol memiliki `aria-label` saat hanya berisi ikon |
| N-12 | Motion | Hormati `prefers-reduced-motion`: matikan animasi non-esensial |
| N-13 | Robustness | Tidak ada error uncaught di console saat alur normal, including saat data korup atau `localStorage` gagal ditulis (tampilkan pesan toast/teks ringan) |
| N-14 | Konsistensi | Satu sumber kebenaran untuk enum kategori, opsi sorting, dan format Rupiah; jangan duplikasi literal di banyak berkas |
| N-15 | Dokumentasi | `README.md` singkat berisi cara `npm install`, `npm run dev`, `npm run build`, dan catatan nomor WA demo |

---

## 6. Asumsi & Keputusan Desain

1. **Routing tanpa server:** detail produk memakai hash route `#/produk/:id`, dashboard `#/dashboard`, katalog `#/`. Ini menghindari kebutuhan rewrite URL di Vite preview/static hosting.
2. **Tanpa login:** peran pengelola hanya berupa halaman dashboard yang terbuka; bukan mekanisme keamanan.
3. **`createdAt` internal:** ditambahkan untuk sorting "terbaru" (lihat Bagian 3.2). Seed memakai waktu relatif menaik agar urutan deterministik.
4. **Nomor WA demo:** `6280000000000` bersifat placeholder dan harus diganti pengelola sebelum demonstrasi bila ingin menerima pesan nyata.
5. **Gambar:** implementasi memakai 8 SVG lokal buatan sendiri yang mengilustrasikan deskripsi tiap produk (poster Canva, landing page, e-book, before/after foto, dashboard Figma, ikon glass, portofolio, dan mockup perangkat), bukan URL produk asli, agar tidak melanggar batasan aset eksternal.
6. **Satu perangkat, satu tab:** konflik penulisan lintas tab tidak ditangani di MVP (lihat risiko R-03).
7. **Bahasa UI:** Bahasa Indonesia, menyesuaikan konteks pengguna.

---

## 7. Out-of-Scope

Berikut **sengaja tidak dibuat** dalam prototype satu hari ini:

- Backend, REST/GraphQL API, database online, atau layanan cloud.
- Sistem autentikasi/registrasi, session, atau "login palsu".
- Payment gateway, checkout, keranjang belanja, invoice, atau konfirmasi pembayaran otomatis.
- Proses transaksi nyata; WhatsApp hanya untuk inquiry manual.
- Upload/download file produk, pengelolaan lisensi, atau pengiriman produk otomatis.
- Multi-toko, multi-user, sinkronisasi antarperangkat, atau kolaborasi real-time.
- Ulasan, rating, wishlist, komentar, notifikasi, riwayat transaksi.
- Pencarian full-text lanjutan, fuzzy search, filter harga rentang, atau pagination.
- Internasionalisasi (multi-bahasa), dark/light theme switcher, PWA/service worker.
- Analitik, tracking, pixel, atau third-party script.
- API key, secret, environment variable berisi kredensial.
- Testing otomatis (unit/E2E), CI/CD, deployment produksi.
- Migration skema lintas versi selain fallback "kembali ke seed".

---

## 8. Risiko dan Mitigasi

| ID | Risiko | Dampak | Prob. | Mitigasi |
|---|---|---|---|---|
| R-01 | Timebox 1 hari terlalu padat | Fitur terpotong | Tinggi | Ikuti urutan iterasi Bagian 10; prioritaskan F-01…F-13 di atas polish visual; iterasi 6 jadi buffer |
| R-02 | Validasi stok menerima desimal/negatif | Data tidak konsisten | Sedang | Regex `/^\d+$/` + cek `Number.isInteger`; uji dengan `-1`, `1.5`, `0`, `12` |
| R-03 | `localStorage` korup / dihapus pengguna | Katalog hilang | Sedang | Parse dalam `try/catch`; fallback ke seed; validasi `version` |
| R-04 | localStorage penuh / mode private | Gagal simpan | Rendah | `try/catch` saat `setItem`, tampilkan pesan "Gagal menyimpan data lokal" |
| R-05 | XSS lewat `nama`/`deskripsi` yang memuat HTML | Eksekusi script | Sedang | Escape semua data dinamis; hindari `innerHTML` dengan input pengguna |
| R-06 | Nomor WA demo salah/ tidak aktif | Pesan terkirim ke nomor salah | Sedang | Satu konstanta `WA_NUMBER`, beri label "nomor demo" di UI/dokumentasi, validasi sebelum demo |
| R-07 | Gambar lokal missing saat build | Kartu tampak rusak | Sedang | Simpan aset di `public/assets/products/`; `onerror` → placeholder SVG inline |
| R-08 | Font tidak terpasang | Tampilan kurang futuristic | Rendah | Fallback system font; pastikan kontras & hierarchy tetap baik |
| R-09 | Dashboard terbuka untuk semua | Data bisa diubah siapa saja pada perangkat | Sedang | Terima sebagai batasan demo; documented di Bagian 2 & 7; reset tersedia |
| R-10 | Ambiguitas "produk terbaru" | Sorting tidak bisa diverifikasi | Sedang | Field `createdAt` internal + seed berurutan (Bagian 3.2 & 4.3) |
| R-11 | `encodeURIComponent` terlewat | Pesan WA terpotong | Rendah | Satu helper `buildWhatsAppUrl()`, dipakai semua tombol |
| R-12 | Layout mobile overflow | Sulit dipakai di ponsel | Sedang | Uji di viewport 375px; grid fleksibel; tabel dashboard di-scroll horizontal |

---

## 9. Acceptance Criteria (Dapat Diperiksa Manual)

> Semua kriteria di bawah dijalankan di browser tanpa backend. Persiapkan data awal dengan menekan **Reset** terlebih dahulu agar kondisi deterministik.

### 9.1 Katalog & Data Awal

- [x] **AC-01** Saat aplikasi dibuka pertama kali (localStorage kosong), katalog menampilkan **tepat 8 kartu** produk.
- [x] **AC-02** Nama produk yang tampil sesuai 8 baris di Bagian 4.3.
- [x] **AC-03** Setiap kartu menampilkan gambar lokal, nama, kategori, harga format `Rp...`, stok, dan badge unggulan untuk 4 produk yang ditandai.
- [x] **AC-04** Tidak ada permintaan jaringan ke domain eksternal pada tab Network saat halaman dimuat (kecuali dokumen lokal).

### 9.2 Pencarian, Filter, Sorting

- [x] **AC-05** Mengetik `aurora` pada kolom cari menampilkan **Aurora Landing Page** saja (case-insensitive).
- [x] **AC-06** Mengetik `lightroom` (kata kunci di deskripsi) menampilkan **Cinematic Lightroom Set**.
- [x] **AC-07** Mengetik `preset` (kata kunci di kategori) menampilkan **Cinematic Lightroom Set**.
- [x] **AC-08** Mengosongkan kolom cari mengembalikan 8 produk.
- [x] **AC-09** Memilih filter kategori `E-book` menampilkan **1 produk** (`Panduan Desain Typography`); filter `Website Template` menampilkan **2 produk**.
- [x] **AC-10** Filter `Semua` mengembalikan 8 produk.
- [x] **AC-11** Sorting `harga-asc`: produk pertama **Glassmorphism Icon Pack** (`Rp79.000`), terakhir **Orbit UI Kit Figma** (`Rp459.000`).
- [x] **AC-12** Sorting `harga-desc`: urutan pertama dan terakhir kebalikan dari AC-11.
- [x] **AC-13** Sorting `nama-asc`: pertama **Aurora Landing Page**; `nama-desc`: pertama **Panduan Desain Typography**.
- [x] **AC-14** Sorting `terbaru`: pertama **Futuristic Mockup Bundle**; setelah menambah produk baru, produk tersebut menjadi yang pertama.
- [x] **AC-15** Pencarian + filter + sorting dapat dikombinasikan dan hasilnya tetap konsisten.

### 9.3 Detail Produk & WhatsApp

- [x] **AC-16** Mengklik kartu membuka `#/produk/nx-001` dan menampilkan nama, kategori, harga, stok, deskripsi lengkap, gambar, dan status unggulan.
- [x] **AC-17** Tombol "Kembali" dari detail kembali ke katalog tanpa reload penuh.
- [x] **AC-18** Tombol WhatsApp pada `nx-001` membuka tab baru dengan URL diawali `https://wa.me/6280000000000?text=`.
- [x] **AC-19** Pesan pada URL tersebut, setelah di-decode, memuat **"Neon Grid Canva Kit"** dan **"Rp149.000"**.
- [x] **AC-20** Mengubah data produk lalu membuka detailnya membuat pesan WhatsApp ikut berubah sesuai nama & harga terbaru.

### 9.4 Dashboard CRUD & Validasi

- [x] **AC-21** Navigasi `#/dashboard` menampilkan tabel 8 produk dan ringkasan: **8 produk / 382 stok / 4 unggulan / 6 kategori**.
- [x] **AC-22** **Create:** mengisi form valid lalu submit menambah produk baru; jumlah produk menjadi 9 dan total stok bertambah sesuai input.
- [x] **AC-23** **Read:** tabel menampilkan seluruh field yang disyaratkan untuk tiap produk.
- [x] **AC-24** **Update:** mengubah harga/stok salah satu produk lalu menyimpan memperbarui tabel **dan** kartu di katalog.
- [x] **AC-25** **Delete:** menghapus satu produk menurunkan jumlah produk menjadi 8 (dari kondisi 9) dan stok berkurang sesuai produk terhapus.
- [x] **AC-26** Validasi menolak `harga = -1000` dengan pesan error, data tidak berubah.
- [x] **AC-27** Validasi menolak `stok = -5` **dan** `stok = 2.5` dengan pesan error; `stok = 0` diterima.
- [x] **AC-28** Validasi menolak nama kosong, kategori di luar enum, dan deskripsi kosong.
- [x] **AC-29** Form create tidak memperbolehkan `id` duplikat (id dibuat otomatis).

### 9.5 Persistensi & Reset

- [x] **AC-30** Setelah CRUD, menekan **Refresh/F5** menampilkan data hasil perubahan (tersimpan di localStorage).
- [x] **AC-31** Tombol **Reset** memunculkan konfirmasi; setelah dikonfirmasi, data kembali ke 8 produk awal dan ringkasan kembali **8 / 382 / 4 / 6**.
- [x] **AC-32** Membatalkan konfirmasi reset tidak mengubah data.

### 9.6 Tampilan & Kualitas

- [x] **AC-33** Tampilan desktop (1280px) dan mobile (375px) tidak ada elemen yang terpotong/overflow horizontal.
- [x] **AC-34** Latar netral terang dengan aksen mint/teal, efek glassmorphism, dan hover halus terlihat konsisten di katalog, detail, dan dashboard.
- [x] **AC-35** Navigasi keyboard (Tab/Enter) dapat mencapai kolom cari, filter, sorting, kartu, dan tombol aksi; fokus terlihat.
- [x] **AC-36** Console browser tidak menampilkan error saat menjalankan seluruh alur di atas.

---

## 10. Implementation Plan per Iterasi (Estimasi 8 Jam)

| Iterasi | Fokus | Estimasi | Output / Checkpoint |
|---|---|---:|---|
| **0 — Setup & Fondasi** | Inisialisasi Vite, struktur folder, `index.html`, variabel CSS (palet netral terang + mint/teal), font fallback, hash router skeleton | 30 mnt | `npm run dev` berjalan, halaman kosong bertema NEXORA tampil |
| **1 — Data & Storage** | 8 seed produk + deskripsi kata kunci, 8 SVG ilustratif lokal, `storage.load/save/reset`, skema `version`, helper `formatRupiah` | 45 mnt | AC-01…AC-04 lolos; ringkasan awal 8/382/4/6 muncul di console/UI |
| **2 — Katalog: Search/Filter/Sort** | State filter, fungsi pencarian, enum kategori, 5 opsi sorting, render grid kartu responsif | 120 mnt | AC-05…AC-15 lolos |
| **3 — Detail & WhatsApp** | Hash route `#/produk/:id`, halaman detail, `buildWhatsAppUrl()` dengan `encodeURIComponent`, fallback gambar | 45 mnt | AC-16…AC-20 lolos |
| **4 — Dashboard CRUD + Validasi** | Form create/edit, tabel read, delete dengan konfirmasi, modul validasi, ringkasan live, tombol reset | 120 mnt | AC-21…AC-29 lolos |
| **5 — Finishing UI/UX** | Glassmorphism, animasi hover/transisi, responsive pass 1280/768/375px, aksesibilitas & `prefers-reduced-motion`, toast error | 90 mnt | AC-33…AC-36 lolos |
| **6 — UAT Manual & Dokumentasi** | Jalankan seluruh AC, perbaiki bug, tulis `README.md`, finalisasi demo script | 30 mnt | Seluruh AC lolos, prototype siap didemonstrasikan |
| **TOTAL** | | **480 mnt (8 jam)** | Prototype NEXORA siap demo |

**Catatan penjadwalan:** Jika iterasi 2 atau 4 meleset, kurangi polish di iterasi 5—jangan memotong validasi, persistensi, atau reset karena ketiganya termasuk kriteria penerimaan.

---

## 11. Definition of Done (DoD)

Prototype NEXORA dinyatakan selesai jika **semua** kondisi berikut terpenuhi:

1. ✅ Seluruh fitur F-01…F-13 terimplementasi dan dapat ditunjukkan dalam satu alur demo.
2. ✅ Seluruh 36 Acceptance Criteria (AC-01…AC-36) dicentang setelah uji manual.
3. ✅ Data awal persis 8 produk dengan ringkasan 8 / 382 / 4 / 6 setelah reset.
4. ✅ Tidak ada baris kode yang menyimpan API key, token, atau kredensial.
5. ✅ Tidak ada backend, database online, payment gateway, login, atau request eksternal saat runtime.
6. ✅ Gambar bersumber lokal; font memakai stack sistem tanpa tautan CDN.
7. ✅ Pesan WhatsApp mengandung nama produk dan harga Rupiah yang benar dan ter-encode.
8. ✅ Validasi harga negatif serta stok negatif/desimal terbukti menolak input.
9. ✅ Data bertahan setelah refresh dan tombol reset terbukti mengembalikan kondisi awal.
10. ✅ Tampilan teruji minimal di viewport 1280px dan 375px dengan konsistensi netral terang + aksen mint/teal.
11. ✅ Console browser bersih dari error pada alur normal.
12. ✅ `README.md` berisi instruksi menjalankan (`npm install`, `npm run dev`, `npm run build`) dan catatan nomor WA demo.
13. ✅ Kode mengikuti struktur modular Bagian N-02 dan tidak menyisipkan input pengguna ke `innerHTML` tanpa escape.
14. ✅ Tombol reset selalu disertai konfirmasi sebelum menghapus data.

---

## 12. Catatan Penyerahan

Dokumen ini adalah spesifikasi yang telah **diselaraskan dengan implementasi akhir** (Vite + JavaScript Vanilla). Struktur berkas, palet warna, dan aset gambar pada dokumen ini mengikuti aplikasi yang sudah berjalan di `http://127.0.0.1:5173`. Perubahan scope selanjutnya dicatat sebagai revisi versi di tabel metadata.
