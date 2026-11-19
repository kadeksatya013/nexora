# NEXORA — Katalog Produk Digital

Prototype marketplace katalog produk digital berbasis Vite + JavaScript vanilla. Berjalan sepenuhnya di browser tanpa backend, login, payment gateway, API key, atau CDN.

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan Vite (default `http://localhost:5173`).

Build dan preview produksi:

```bash
npm run build
npm run preview
```

Hasil build ada di folder `dist/`. Path aset memakai base relatif sehingga folder tersebut bisa ditempatkan di subfolder hosting statis.

## Catatan demo

- Data awal: 8 produk digital, 6 kategori, total stok 382, 4 unggulan.
- Semua perubahan tersimpan di `localStorage` dengan key `nexora.catalog.v1` (version `1`).
- Tombol **Reset Data** di `#/dashboard` mengembalikan data ke 8 produk awal setelah konfirmasi.
- Tombol WhatsApp memakai nomor demo fiktif `6280000000000`. Tidak ada pembayaran otomatis.
- Gambar produk adalah 8 SVG lokal di `public/assets/products/nx-001.svg` … `nx-008.svg`; fallback inline dibuat dari `src/products.js`.
- Katalog bisa difilter by kategori dan rentang harga; tekan `/` untuk langsung fokus ke kolom pencarian.
- Micro-interaksi (stagger kartu, zoom gambar, animasi toast/dialog) otomatis dimatikan jika sistem mengatur `prefers-reduced-motion: reduce`.

## Struktur utama

| Berkas | Peran |
|---|---|
| `index.html` | Shell aplikasi |
| `src/main.js` | Router hash, state filter, event handling |
| `src/products.js` | Konstanta, seed 8 produk, `formatRupiah`, ilustrasi SVG |
| `src/store.js` | State, validasi, dan persistensi `localStorage` |
| `src/ui.js` | Template/render seluruh tampilan |
| `src/style.css` | Design token dan seluruh gaya visual |

Dokumen pendukung: `SPEC.md`, `TASKS.md`, dan `UI-SPEC.md`.
