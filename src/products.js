/**
 * products.js — konstanta, data awal, dan helper murni produk.
 * Tidak mengakses DOM maupun localStorage.
 */

export const KATEGORI = [
  'Template Canva',
  'Website Template',
  'E-book',
  'Preset Foto',
  'UI Kit',
  'Digital Assets',
];

export const SORT_OPTIONS = [
  { value: 'terbaru', label: 'Produk Terbaru' },
  { value: 'harga-asc', label: 'Harga Termurah' },
  { value: 'harga-desc', label: 'Harga Termahal' },
  { value: 'nama-asc', label: 'Nama A–Z' },
  { value: 'nama-desc', label: 'Nama Z–A' },
];

export const WA_NUMBER = '6280000000000';

/** Label chip UI; value kategori tetap memakai nama enum dari SPEC.md. */
export function labelKategori(kategori) {
  return kategori === 'Preset Foto' ? 'Preset' : kategori;
}

export function formatRupiah(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Rp0';
  return `Rp${number.toLocaleString('id-ID')}`;
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  })[char]);
}

/**
 * Placeholder SVG lokal sebagai data URI — tidak ada request jaringan
 * dan tidak memerlukan folder aset tambahan.
 */
export function makePlaceholder(label, accent = '#A855F7') {
  const text = escapeXml(String(label).slice(0, 24));
  const grid = [
    ...Array.from({ length: 8 }, (_, i) => `<line x1="${(i + 1) * 100}" y1="0" x2="${(i + 1) * 100}" y2="450"/>`),
    ...Array.from({ length: 4 }, (_, i) => `<line x1="0" y1="${(i + 1) * 90}" x2="800" y2="${(i + 1) * 90}"/>`),
  ].join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0E1530"/><stop offset="1" stop-color="#141D3D"/></linearGradient></defs>
<rect width="800" height="450" fill="url(#g)"/>
<g stroke="${accent}" stroke-opacity=".16" stroke-width="1">${grid}</g>
<circle cx="680" cy="80" r="150" fill="${accent}" fill-opacity=".10"/>
<circle cx="120" cy="400" r="110" fill="#22D3EE" fill-opacity=".07"/>
<text x="48" y="238" font-family="Space Grotesk, sans-serif" font-size="46" font-weight="700" fill="#F5F7FF">${text}</text>
<text x="50" y="282" font-family="Inter, sans-serif" font-size="20" fill="#8B9AC4">NEXORA · DIGITAL ASSET</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SEED = [
  {
    id: 'nx-001',
    nama: 'Neon Grid Canva Kit',
    kategori: 'Template Canva',
    harga: 149000,
    stok: 42,
    deskripsi: 'Template Canva neon grid untuk poster, feed Instagram, dan banner digital. Warna futuristic ungu dan cyan, mudah diedit.',
    unggulan: true,
    warna: '#A855F7',
  },
  {
    id: 'nx-002',
    nama: 'Aurora Landing Page',
    kategori: 'Website Template',
    harga: 329000,
    stok: 18,
    deskripsi: 'Website template landing page satu halaman, responsif, cocok untuk portfolio dan product launch.',
    unggulan: true,
    warna: '#22D3EE',
  },
  {
    id: 'nx-003',
    nama: 'Panduan Desain Typography',
    kategori: 'E-book',
    harga: 99000,
    stok: 75,
    deskripsi: 'E-book panduan tipografi modern: hierarchy, pairing font, dan tips layout untuk desainer pemula.',
    unggulan: false,
    warna: '#C084FC',
  },
  {
    id: 'nx-004',
    nama: 'Cinematic Lightroom Set',
    kategori: 'Preset Foto',
    harga: 129000,
    stok: 60,
    deskripsi: 'Preset foto Lightroom bergaya cinematic dengan tone hangat dan kontras tinggi, cocok untuk foto urban.',
    unggulan: true,
    warna: '#FBBF24',
  },
  {
    id: 'nx-005',
    nama: 'Orbit UI Kit Figma',
    kategori: 'UI Kit',
    harga: 459000,
    stok: 12,
    deskripsi: 'UI Kit Figma dengan 60+ komponen dashboard dark mode, siap dipakai untuk prototype aplikasi.',
    unggulan: true,
    warna: '#A855F7',
  },
  {
    id: 'nx-006',
    nama: 'Glassmorphism Icon Pack',
    kategori: 'Digital Assets',
    harga: 79000,
    stok: 120,
    deskripsi: 'Kumpulan ikon glassmorphism berformat SVG, cocok untuk dashboard dan website futuristic.',
    unggulan: false,
    warna: '#22D3EE',
  },
  {
    id: 'nx-007',
    nama: 'Minimal Portfolio Canvas',
    kategori: 'Website Template',
    harga: 199000,
    stok: 30,
    deskripsi: 'Template portfolio minimal berbasis HTML dan CSS, ringan dan mudah dimodifikasi.',
    unggulan: false,
    warna: '#67E8F9',
  },
  {
    id: 'nx-008',
    nama: 'Futuristic Mockup Bundle',
    kategori: 'Digital Assets',
    harga: 259000,
    stok: 25,
    deskripsi: 'Bundle mockup futuristic untuk presentasi produk digital, layar laptop, dan perangkat mobile.',
    unggulan: false,
    warna: '#C084FC',
  },
];

/** Salinan baru 8 produk awal; createdAt menaik nx-001 → nx-008. */
export function createSeedProducts() {
  return SEED.map(({ warna, ...product }, index) => ({
    ...product,
    imageUrl: makePlaceholder(product.nama, warna),
    createdAt: `2026-01-0${index + 1}T09:00:00.000Z`,
  }));
}

export function generateId(existing = []) {
  let id;
  do {
    id = `nx-${Date.now().toString(36)}${Math.floor(100 + Math.random() * 900)}`;
  } while (existing.some((product) => product.id === id));
  return id;
}

export function buildProduct(input, existing = []) {
  const nama = String(input.nama).trim();
  return {
    id: generateId(existing),
    nama,
    kategori: input.kategori,
    harga: Number(input.harga),
    stok: Number(input.stok),
    deskripsi: String(input.deskripsi).trim(),
    imageUrl: String(input.imageUrl || '').trim() || makePlaceholder(nama),
    unggulan: Boolean(input.unggulan),
    createdAt: new Date().toISOString(),
  };
}
