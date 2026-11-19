/**
 * products.js — konstanta, data awal, dan helper murni produk.
 * Tidak mengakses DOM maupun localStorage.
 *
 * Konten sesuai SPEC.md §4.3: 8 produk digital fiktif dalam 6 kategori.
 * Gambar awal adalah 8 file SVG lokal di public/assets/products/.
 * makePlaceholder() menghasilkan SVG inline buatan sendiri sebagai fallback;
 * tidak ada CDN, URL eksternal, atau permintaan jaringan saat runtime.
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

/** UI-SPEC §5.2: chip memakai label "Preset", nilai datanya tetap "Preset Foto". */
const ALIAS_KATEGORI = { 'Preset Foto': 'Preset' };

export function labelKategori(kategori) {
  return ALIAS_KATEGORI[kategori] ?? kategori;
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
 * Ilustrasi produk buatan sendiri (bukan salinan aset pihak ketiga).
 * Tiap deskripsi produk SPEC.md §4.3 divisualkan sebagai adegan UI yang
 * mudah dikenali; dipilih lewat field `glyph` pada SEED.
 */
const ART = {
  /* Template Canva — kanvas poster neon grid dengan pegangan edit. */
  grid: `
    <rect x="196" y="66" width="344" height="238" rx="14" fill="#ffffff" opacity=".7" transform="rotate(-7 368 185)"/>
    <rect x="212" y="56" width="344" height="238" rx="14" fill="#ffffff" opacity=".92" transform="rotate(-2 384 175)"/>
    <rect x="228" y="46" width="344" height="244" rx="14" fill="#ffffff" stroke="{accent}" stroke-width="3"/>
    <defs><clipPath id="poster"><rect x="228" y="46" width="344" height="244" rx="14"/></clipPath></defs>
    <g clip-path="url(#poster)" stroke="{accent}" stroke-opacity=".2" stroke-width="1">
      <path d="M271 46V290M314 46V290M357 46V290M400 46V290M443 46V290M486 46V290M529 46V290M228 87H572M228 128H572M228 169H572M228 210H572M228 251H572"/>
    </g>
    <rect x="262" y="80" width="276" height="176" rx="10" fill="none" stroke="{accent}" stroke-width="4"/>
    <text x="400" y="188" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="96" font-weight="700" fill="{accent}">Aa</text>
    <text x="400" y="224" text-anchor="middle" font-family="Inter, sans-serif" font-size="15" letter-spacing="4" fill="#0F766E">NEON GRID</text>
    <g fill="{accent}" stroke="#ffffff" stroke-width="2">
      <circle cx="228" cy="46" r="6"/><circle cx="572" cy="46" r="6"/><circle cx="228" cy="290" r="6"/><circle cx="572" cy="290" r="6"/>
    </g>
    <g><rect x="352" y="304" width="20" height="10" rx="3" fill="{accent}"/><rect x="380" y="304" width="20" height="10" rx="3" fill="#2DD4BF"/><rect x="408" y="304" width="20" height="10" rx="3" fill="#0F766E"/><rect x="436" y="304" width="20" height="10" rx="3" fill="#5CE7A8"/></g>`,

  /* Website template — jendela browser dengan hero aurora + pratinjau mobile. */
  layout: `
    <rect x="150" y="48" width="500" height="272" rx="16" fill="#ffffff" stroke="{accent}" stroke-width="3"/>
    <path d="M150 92H650" stroke="{accent}" stroke-opacity=".25" stroke-width="2"/>
    <g fill="{accent}" opacity=".55"><circle cx="176" cy="70" r="6"/><circle cx="198" cy="70" r="6"/><circle cx="220" cy="70" r="6"/></g>
    <rect x="242" y="62" width="180" height="16" rx="8" fill="#E6F4F0"/>
    <defs><clipPath id="win"><rect x="150" y="92" width="500" height="228"/></clipPath></defs>
    <g clip-path="url(#win)">
      <rect x="150" y="92" width="500" height="228" fill="#F5FCFA"/>
      <path d="M150 250 C260 170 330 286 440 206 S570 154 650 214 V320 H150Z" fill="{accent}" opacity=".2"/>
      <path d="M150 278 C250 214 350 314 460 236 S580 196 650 246 V320 H150Z" fill="#2DD4BF" opacity=".24"/>
    </g>
    <rect x="188" y="130" width="190" height="14" rx="7" fill="#0F766E" opacity=".8"/>
    <rect x="188" y="156" width="140" height="14" rx="7" fill="#0F766E" opacity=".45"/>
    <rect x="188" y="196" width="96" height="34" rx="17" fill="{accent}"/>
    <text x="236" y="218" text-anchor="middle" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#ffffff">Launch</text>
    <rect x="544" y="118" width="80" height="166" rx="14" fill="#ffffff" stroke="{accent}" stroke-width="3"/>
    <rect x="552" y="132" width="64" height="48" rx="6" fill="{accent}" opacity=".2"/>
    <path d="M554 194h60M554 210h44M554 226h56" stroke="#0F766E" stroke-opacity=".45" stroke-width="5" stroke-linecap="round"/>
    <rect x="566" y="264" width="36" height="12" rx="6" fill="{accent}"/>`,

  /* E-book — sampul tipografi dengan tumpukan halaman. */
  book: `
    <rect x="246" y="64" width="276" height="252" rx="12" fill="#ffffff" opacity=".7" stroke="{accent}" stroke-opacity=".4" stroke-width="2" transform="rotate(6 384 190)"/>
    <rect x="260" y="56" width="276" height="252" rx="12" fill="#ffffff" opacity=".92" stroke="{accent}" stroke-opacity=".5" stroke-width="2" transform="rotate(2 398 182)"/>
    <rect x="276" y="46" width="248" height="258" rx="12" fill="#ffffff" stroke="{accent}" stroke-width="3"/>
    <rect x="292" y="62" width="216" height="226" rx="8" fill="{accent}" fill-opacity=".08"/>
    <text x="400" y="190" text-anchor="middle" font-family="Georgia, serif" font-size="124" fill="{accent}">Aa</text>
    <text x="400" y="228" text-anchor="middle" font-family="Inter, sans-serif" font-size="16" letter-spacing="3" fill="#0F766E">TYPOGRAPHY</text>
    <path d="M324 246H476" stroke="{accent}" stroke-opacity=".45" stroke-width="2"/>
    <text x="400" y="270" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" fill="#64748B">PANDUAN DESAIN</text>
    <g stroke="#0F766E" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"><path d="M552 120h56M552 140h40M552 172h56M552 192h48M552 224h56M552 244h36"/></g>`,

  /* Preset foto — perbandingan before/after pada foto cinematic + slider. */
  camera: `
    <rect x="168" y="46" width="464" height="234" rx="14" fill="#ffffff" stroke="{accent}" stroke-width="3"/>
    <defs><clipPath id="photo"><rect x="180" y="58" width="440" height="210" rx="8"/></clipPath></defs>
    <g clip-path="url(#photo)">
      <rect x="180" y="58" width="440" height="210" fill="#FEF1DC"/>
      <circle cx="520" cy="126" r="36" fill="#F59E0B" opacity=".75"/>
      <path d="M180 196 L276 118 L356 182 L456 108 L620 204 V268 H180Z" fill="#0F766E" opacity=".5"/>
      <path d="M180 226 L300 162 L400 216 L508 150 L620 232 V268 H180Z" fill="#0F766E" opacity=".32"/>
      <rect x="180" y="58" width="220" height="210" fill="#0F172A" opacity=".26"/>
    </g>
    <path d="M400 58V268" stroke="#ffffff" stroke-width="3"/>
    <text x="292" y="86" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#ffffff">BEFORE</text>
    <text x="508" y="86" text-anchor="middle" font-family="Inter, sans-serif" font-size="13" font-weight="600" fill="#ffffff">AFTER</text>
    <rect x="228" y="294" width="344" height="36" rx="10" fill="#ffffff" stroke="{accent}" stroke-opacity=".45" stroke-width="2"/>
    <path d="M250 312H318M340 312H408M430 312H498" stroke="#CBD5D1" stroke-width="4" stroke-linecap="round"/>
    <circle cx="292" cy="312" r="8" fill="{accent}"/><circle cx="382" cy="312" r="8" fill="#2DD4BF"/><circle cx="472" cy="312" r="8" fill="#0F766E"/>`,

  /* UI Kit — dashboard dark mode dengan node seleksi ala Figma. */
  components: `
    <rect x="150" y="44" width="500" height="282" rx="16" fill="#101116" stroke="{accent}" stroke-width="3"/>
    <path d="M270 44V326" stroke="#2A2D33" stroke-width="2"/>
    <circle cx="178" cy="72" r="8" fill="{accent}"/>
    <g stroke="#64748B" stroke-width="6" stroke-linecap="round" opacity=".6"><path d="M166 108h48M166 136h36M166 164h48M166 192h30"/></g>
    <g fill="#1E2229" stroke="{accent}" stroke-opacity=".35" stroke-width="2">
      <rect x="294" y="68" width="118" height="58" rx="10"/><rect x="426" y="68" width="96" height="58" rx="10"/><rect x="536" y="68" width="98" height="58" rx="10"/>
    </g>
    <g fill="{accent}" opacity=".8"><circle cx="320" cy="90" r="6"/><circle cx="452" cy="90" r="6"/><circle cx="562" cy="90" r="6"/></g>
    <rect x="294" y="142" width="340" height="162" rx="10" fill="#1E2229" stroke="{accent}" stroke-opacity=".3" stroke-width="2"/>
    <g fill="{accent}" opacity=".75"><rect x="320" y="232" width="26" height="48" rx="4"/><rect x="362" y="204" width="26" height="76" rx="4"/><rect x="404" y="222" width="26" height="58" rx="4"/><rect x="446" y="184" width="26" height="96" rx="4"/><rect x="488" y="212" width="26" height="68" rx="4"/><rect x="530" y="196" width="26" height="84" rx="4"/></g>
    <g fill="none" stroke="#5CE7A8" stroke-width="2" stroke-dasharray="6 4"><rect x="284" y="58" width="148" height="78" rx="6"/></g>
    <g fill="#5CE7A8"><circle cx="284" cy="58" r="4"/><circle cx="432" cy="136" r="4"/></g>`,

  /* Icon pack — grid ikon kaca buram (glassmorphism). */
  icons: `
    <g fill="#ffffff" fill-opacity=".8" stroke="{accent}" stroke-opacity=".35" stroke-width="2">
      <rect x="200" y="52" width="110" height="80" rx="18"/><rect x="345" y="52" width="110" height="80" rx="18"/><rect x="490" y="52" width="110" height="80" rx="18"/>
      <rect x="200" y="146" width="110" height="80" rx="18"/><rect x="345" y="146" width="110" height="80" rx="18"/><rect x="490" y="146" width="110" height="80" rx="18"/>
      <rect x="200" y="240" width="110" height="80" rx="18"/><rect x="345" y="240" width="110" height="80" rx="18"/><rect x="490" y="240" width="110" height="80" rx="18"/>
    </g>
    <g fill="{accent}">
      <path d="M255 84c0-10-15-12-17 0-2 12 17 24 17 24s19-12 17-24c-2-12-17-10-17 0Z"/>
      <path d="m400 68 8 18 20 2-15 13 4 20-17-10-17 10 4-20-15-13 20-2 8-18Z"/>
      <path d="M545 100V88a12 12 0 0 1 24 0v12l6 8h-36l6-8Z"/><circle cx="557" cy="116" r="4"/>
      <circle cx="255" cy="186" r="14" fill="none" stroke="{accent}" stroke-width="5"/><path d="M255 164v-6M255 214v-6M233 186h-6M283 186h-6M239 170l-4-4M276 207l-4-4M271 170l4-4M234 207l4-4" stroke="{accent}" stroke-width="5" stroke-linecap="round"/>
      <rect x="386" y="172" width="30" height="25" rx="5"/><circle cx="401" cy="184" r="7" fill="#ffffff"/>
      <path d="M530 162h54v30h-30l-14 12v-12h-10V162Z"/>
      <path d="m260 246-12 20h14l-6 18 20-26h-14l8-12Z"/>
      <g><rect x="386" y="256" width="12" height="12" rx="3"/><rect x="402" y="256" width="12" height="12" rx="3"/><rect x="386" y="272" width="12" height="12" rx="3"/><rect x="402" y="272" width="12" height="12" rx="3"/></g>
    </g>
    <path d="m540 272 10 10 20-24" fill="none" stroke="{accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`,

  /* Portfolio minimal — halaman portofolio bersih dengan tiga proyek. */
  canvas: `
    <rect x="160" y="48" width="480" height="278" rx="14" fill="#ffffff" stroke="{accent}" stroke-width="3"/>
    <circle cx="192" cy="78" r="7" fill="{accent}"/>
    <rect x="210" y="74" width="58" height="8" rx="4" fill="#0F766E" opacity=".7"/>
    <g stroke="#CBD5D1" stroke-width="6" stroke-linecap="round"><path d="M512 78h48M572 78h40"/></g>
    <path d="M160 100H640" stroke="{accent}" stroke-opacity=".18" stroke-width="2"/>
    <text x="192" y="156" font-family="Space Grotesk, sans-serif" font-size="42" font-weight="700" fill="#101116">Portfolio</text>
    <rect x="192" y="174" width="230" height="8" rx="4" fill="#94A3B8" opacity=".55"/>
    <rect x="192" y="204" width="130" height="94" rx="8" fill="{accent}" fill-opacity=".13"/>
    <circle cx="257" cy="240" r="20" fill="none" stroke="{accent}" stroke-width="4"/>
    <path d="M208 282h98" stroke="{accent}" stroke-opacity=".5" stroke-width="4" stroke-linecap="round"/>
    <rect x="338" y="204" width="130" height="94" rx="8" fill="#2DD4BF" fill-opacity=".16"/>
    <path d="M356 272l30-34 24 24 20-18 22 28" fill="none" stroke="#0F766E" stroke-width="4" stroke-linejoin="round"/>
    <rect x="484" y="204" width="130" height="94" rx="8" fill="{accent}" fill-opacity=".08"/>
    <g stroke="{accent}" stroke-width="4"><rect x="506" y="224" width="40" height="40" rx="6"/><rect x="556" y="224" width="40" height="40" rx="6"/></g>`,

  /* Mockup bundle — laptop, tablet, dan ponsel dengan layar bercahaya. */
  mockup: `
    <defs><linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5CE7A8"/><stop offset="1" stop-color="#0F766E"/></linearGradient></defs>
    <rect x="496" y="58" width="128" height="160" rx="12" fill="#ffffff" stroke="{accent}" stroke-opacity=".5" stroke-width="2" transform="rotate(9 560 138)"/>
    <rect x="180" y="66" width="332" height="204" rx="12" fill="#101116" stroke="{accent}" stroke-width="3"/>
    <rect x="192" y="78" width="308" height="180" rx="6" fill="url(#screen)"/>
    <path d="M164 270h364l16 20H148Z" fill="#1E2229" stroke="{accent}" stroke-width="2"/>
    <path d="M356 270h16l4 8h-24Z" fill="#64748B" opacity=".6"/>
    <rect x="536" y="120" width="92" height="168" rx="16" fill="#101116" stroke="{accent}" stroke-width="3"/>
    <rect x="544" y="132" width="76" height="144" rx="8" fill="url(#screen)"/>
    <rect x="568" y="126" width="28" height="4" rx="2" fill="#64748B"/>
    <g fill="#ffffff" opacity=".55"><rect x="556" y="150" width="52" height="8" rx="4"/><rect x="556" y="166" width="36" height="6" rx="3"/><rect x="556" y="188" width="52" height="30" rx="6"/></g>`,
};

/**
 * SVG placeholder lokal sebagai data URI — dipakai saat gambar gagal dimuat
 * atau saat pengguna menambah produk tanpa mengisi field gambar.
 */
export function makePlaceholder(label, accent = '#10B981', glyph = 'grid') {
  const text = escapeXml(String(label).slice(0, 28));
  const art = (ART[glyph] ?? ART.grid).replaceAll('{accent}', accent);
  const grid = [
    ...Array.from({ length: 8 }, (_, i) => `<line x1="${(i + 1) * 100}" y1="0" x2="${(i + 1) * 100}" y2="450"/>`),
    ...Array.from({ length: 4 }, (_, i) => `<line x1="0" y1="${(i + 1) * 90}" x2="800" y2="${(i + 1) * 90}"/>`),
  ].join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7FAF9"/><stop offset="1" stop-color="#EEF4F2"/></linearGradient></defs>
<rect width="800" height="450" fill="url(#g)"/>
<g stroke="${accent}" stroke-opacity=".14" stroke-width="1">${grid}</g>
<g>${art}</g>
<text x="400" y="386" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="38" font-weight="700" fill="#0F172A">${text}</text>
<text x="400" y="420" text-anchor="middle" font-family="Inter, sans-serif" font-size="19" fill="#64748B">NEXORA · ASET DIGITAL</text>
</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** SPEC.md §4.3 — 8 produk awal; total stok 382, 4 unggulan, 6 kategori unik. */
const SEED = [
  {
    id: 'nx-001',
    nama: 'Neon Grid Canva Kit',
    kategori: 'Template Canva',
    harga: 149000,
    stok: 42,
    deskripsi: 'Template Canva neon grid untuk poster, feed Instagram, dan banner digital. Warna futuristic ungu dan cyan, mudah diedit.',
    unggulan: true,
    warna: '#10B981',
    glyph: 'grid',
  },
  {
    id: 'nx-002',
    nama: 'Aurora Landing Page',
    kategori: 'Website Template',
    harga: 329000,
    stok: 18,
    deskripsi: 'Website template landing page satu halaman, responsif, cocok untuk portfolio dan product launch.',
    unggulan: true,
    warna: '#14B8A6',
    glyph: 'layout',
  },
  {
    id: 'nx-003',
    nama: 'Panduan Desain Typography',
    kategori: 'E-book',
    harga: 99000,
    stok: 75,
    deskripsi: 'E-book panduan tipografi modern: hierarchy, pairing font, dan tips layout untuk desainer pemula.',
    unggulan: false,
    warna: '#0F766E',
    glyph: 'book',
  },
  {
    id: 'nx-004',
    nama: 'Cinematic Lightroom Set',
    kategori: 'Preset Foto',
    harga: 129000,
    stok: 60,
    deskripsi: 'Preset foto Lightroom bergaya cinematic dengan tone hangat dan kontras tinggi, cocok untuk foto urban.',
    unggulan: true,
    warna: '#2DD4BF',
    glyph: 'camera',
  },
  {
    id: 'nx-005',
    nama: 'Orbit UI Kit Figma',
    kategori: 'UI Kit',
    harga: 459000,
    stok: 12,
    deskripsi: 'UI Kit Figma dengan 60+ komponen dashboard dark mode, siap dipakai untuk prototype aplikasi.',
    unggulan: true,
    warna: '#059669',
    glyph: 'components',
  },
  {
    id: 'nx-006',
    nama: 'Glassmorphism Icon Pack',
    kategori: 'Digital Assets',
    harga: 79000,
    stok: 120,
    deskripsi: 'Kumpulan ikon glassmorphism berformat SVG, cocok untuk dashboard dan website futuristic.',
    unggulan: false,
    warna: '#14B8A6',
    glyph: 'icons',
  },
  {
    id: 'nx-007',
    nama: 'Minimal Portfolio Canvas',
    kategori: 'Website Template',
    harga: 199000,
    stok: 30,
    deskripsi: 'Template portfolio minimal berbasis HTML dan CSS, ringan dan mudah dimodifikasi.',
    unggulan: false,
    warna: '#0EA5A4',
    glyph: 'canvas',
  },
  {
    id: 'nx-008',
    nama: 'Futuristic Mockup Bundle',
    kategori: 'Digital Assets',
    harga: 259000,
    stok: 25,
    deskripsi: 'Bundle mockup futuristic untuk presentasi produk digital, layar laptop, dan perangkat mobile.',
    unggulan: false,
    warna: '#34D399',
    glyph: 'mockup',
  },
];

/** Salinan 8 produk awal; createdAt menaik nx-001 → nx-008. */
export function createSeedProducts() {
  return SEED.map(({ warna, glyph, ...product }, index) => ({
    ...product,
    imageUrl: `assets/products/${product.id}.svg`,
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
