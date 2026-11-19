/**
 * ui.js — template dan komponen tampilan.
 * Semua data dinamis di-escape sebelum masuk ke markup.
 */

import {
  KATEGORI,
  SORT_OPTIONS,
  WA_NUMBER,
  formatRupiah,
  labelKategori,
  makePlaceholder,
} from './products.js';

export const FALLBACK_IMAGE = makePlaceholder('NEXORA', '#22D3EE');

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]);
}

const wrap = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

const ICONS = {
  grid: wrap('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
  search: wrap('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  arrow: wrap('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  back: wrap('<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>'),
  star: wrap('<path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z"/>'),
  box: wrap('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>'),
  layers: wrap('<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>'),
  plus: wrap('<path d="M12 5v14"/><path d="M5 12h14"/>'),
  edit: wrap('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/>'),
  trash: wrap('<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>'),
  menu: wrap('<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>'),
  close: wrap('<path d="M6 6l12 12"/><path d="M18 6 6 18"/>'),
  check: wrap('<path d="m5 12 4 4L19 6"/>'),
  reset: wrap('<path d="M4 4v6h6"/><path d="M5.5 10a7 7 0 1 1 1 5"/>'),
  dot: wrap('<circle cx="12" cy="12" r="4" fill="currentColor" stroke="none"/>'),
  whatsapp: wrap('<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/><path d="M8.6 9.1c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.5c.1.3 0 .5-.2.7l-.4.4a7 7 0 0 0 1.9 1.6l.4-.4c.2-.2.4-.2.7-.1l1.5.8c.3.1.5.4.4.7-.2.8-1 1.5-1.9 1.4-2.4-.2-5.1-2.8-5.3-5.2-.1-1 .5-1.9 1.3-2.4Z"/>'),
};

export function icon(name) {
  return ICONS[name] ?? '';
}

export function buildWhatsAppUrl(product) {
  const pesan = `Halo NEXORA, saya tertarik dengan *${product.nama}* (${formatRupiah(product.harga)}). Apakah stok masih tersedia?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;
}

function stockInfo(stok) {
  if (stok === 0) return { tone: 'danger', label: 'Stok habis' };
  if (stok <= 5) return { tone: 'warning', label: `Stok: ${stok}` };
  return { tone: 'success', label: `Stok: ${stok}` };
}

export function renderNavbar(active) {
  const menus = [
    ['Home', '#/', 'home'],
    ['Explore', '#/explore', 'explore'],
    ['Categories', '#/categories', 'categories'],
    ['Dashboard', '#/dashboard', 'dashboard'],
  ];
  const current = active === 'detail' ? 'home' : active;
  const links = menus.map(([label, href, key]) => {
    const isActive = key === current;
    return `<a class="nav-link${isActive ? ' is-active' : ''}" href="${href}" ${isActive ? 'aria-current="page"' : ''} data-action="close-drawer">${label}</a>`;
  }).join('');

  return `<nav class="nav container" aria-label="Navigasi utama">
  <a class="brand" href="#/" data-action="close-drawer">${icon('grid')}<span>NEXORA</span></a>
  <div class="nav-links">${links}</div>
  <div class="nav-actions">
    <span class="badge badge-demo">DEMO</span>
    <a class="btn btn-primary btn-sm nav-add" href="#/dashboard">${icon('plus')} Tambah</a>
    <button class="icon-btn menu-toggle" id="menu-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="nav-drawer">${icon('menu')}</button>
  </div>
</nav>
<div class="nav-overlay" id="nav-overlay" hidden></div>
<aside class="nav-drawer" id="nav-drawer" aria-label="Menu navigasi" hidden>
  <div class="drawer-head"><span class="brand">${icon('grid')}<span>NEXORA</span></span><button class="icon-btn" type="button" id="drawer-close" aria-label="Tutup menu">${icon('close')}</button></div>
  <nav class="drawer-links" aria-label="Navigasi mobile">${links}</nav>
  <span class="badge badge-demo">DEMO · satu perangkat</span>
</aside>`;
}

function renderHero(filters, summary) {
  return `<section class="hero">
  <div class="container hero-panel">
    <div class="hero-copy">
      <span class="eyebrow">✦ KATALOG ASET DIGITAL · EDISI 2026</span>
      <h1 class="hero-title">Temukan Aset Digital untuk <span class="gradient-text">Karya</span> Berikutnya.</h1>
      <p class="hero-desc">8 produk digital pilihan — template, e-book, preset, dan UI kit — siap pakai dalam hitungan menit.</p>
      <div class="hero-actions">
        <div class="search">
          ${icon('search')}
          <label class="sr-only" for="search-input">Cari produk</label>
          <input id="search-input" type="search" placeholder='Cari nama atau kata kunci, mis. "UI Kit"...' value="${escapeHtml(filters.search)}" aria-controls="product-grid" autocomplete="off" />
          <button class="search-clear" type="button" data-action="clear-search" aria-label="Hapus pencarian" ${filters.search ? '' : 'hidden'}>${icon('close')}</button>
        </div>
        <a class="btn btn-primary" href="#/explore">Explore Products ${icon('arrow')}</a>
      </div>
      <p class="hero-meta">${summary.total} produk • ${summary.kategori} kategori • 100% lokal</p>
    </div>
    <div class="hero-art" aria-hidden="true"><span class="orb orb-purple"></span><span class="orb orb-cyan"></span><span class="hero-grid"></span></div>
  </div>
</section>`;
}

function renderControls(filters, total, shown) {
  const chips = ['Semua', ...KATEGORI].map((kategori) => {
    const active = filters.kategori === kategori;
    return `<button type="button" class="chip${active ? ' is-active' : ''}" data-kategori="${escapeHtml(kategori)}" aria-pressed="${active}">${active ? icon('check') : ''}${escapeHtml(labelKategori(kategori))}</button>`;
  }).join('');

  const options = SORT_OPTIONS.map((option) => `<option value="${option.value}"${filters.sort === option.value ? ' selected' : ''}>${option.label}</option>`).join('');
  const hasFilter = Boolean(filters.search) || filters.kategori !== 'Semua' || filters.sort !== 'terbaru';

  return `<div class="toolbar">
  <div class="chips" role="group" aria-label="Filter kategori produk">${chips}</div>
  <div class="toolbar-row">
    <label class="sort" for="sort-select">${icon('grid')}<span class="sr-only">Urutkan</span>
      <select id="sort-select" aria-label="Urutkan produk">${options}</select>
    </label>
    <p class="result-count" aria-live="polite">Menampilkan ${shown} dari ${total} produk</p>
    <button type="button" class="btn btn-ghost btn-sm" data-action="reset-filter" ${hasFilter ? '' : 'hidden'}>Reset filter</button>
  </div>
</div>`;
}

export function renderCard(product) {
  const stock = stockInfo(product.stok);
  return `<article class="card product-card">
  <div class="card-media">
    <img src="${escapeHtml(product.imageUrl)}" alt="Ilustrasi ${escapeHtml(product.nama)}" loading="lazy" />
    ${product.unggulan ? `<span class="badge badge-featured">${icon('star')} Unggulan</span>` : ''}
    <span class="badge badge-category">${escapeHtml(labelKategori(product.kategori))}</span>
  </div>
  <div class="card-body">
    <p class="card-category">${escapeHtml(product.kategori)}</p>
    <h3 class="card-title">${escapeHtml(product.nama)}</h3>
    <div class="card-meta">
      <span class="card-price">${formatRupiah(product.harga)}</span>
      <span class="stock stock-${stock.tone}">${icon('dot')} ${stock.label}</span>
    </div>
    <a class="btn btn-secondary btn-full" href="#/produk/${encodeURIComponent(product.id)}">View Details ${icon('arrow')}</a>
  </div>
</article>`;
}

function renderEmpty() {
  return `<div class="empty">
  ${icon('search')}
  <h3>Tidak ada produk yang cocok</h3>
  <p>Coba kata kunci lain atau reset filter kategori.</p>
  <button type="button" class="btn btn-secondary" data-action="reset-filter">Reset filter</button>
</div>`;
}

export function renderCatalog({ visible, total, filters, summary }) {
  const grid = visible.length
    ? `<div class="grid" id="product-grid">${visible.map(renderCard).join('')}</div>`
    : `<div id="product-grid">${renderEmpty()}</div>`;

  return `${renderHero(filters, summary)}
<section class="container section" id="katalog">
  <div class="section-head"><h2>Jelajahi Katalog</h2><p class="muted">Produk digital pilihan untuk kebutuhan kreatif Anda.</p></div>
  ${renderControls(filters, total, visible.length)}
  ${grid}
</section>`;
}

export function renderDetail(product) {
  if (!product) {
    return `<section class="container section empty-page">
  <div class="empty">${icon('box')}<h3>Produk tidak ditemukan</h3><p>Produk dengan ID tersebut tidak tersedia.</p><a class="btn btn-secondary" href="#/">Kembali ke katalog</a></div>
</section>`;
  }

  const stock = stockInfo(product.stok);
  const rows = [
    ['Kategori', product.kategori],
    ['Harga', formatRupiah(product.harga)],
    ['Stok', String(product.stok)],
    ['Status', product.unggulan ? 'Unggulan' : 'Reguler'],
    ['ID', product.id],
  ].map(([label, value]) => `<div class="info-row"><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');

  return `<section class="container section detail">
  <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/">Home</a><span>/</span><span>${escapeHtml(product.kategori)}</span><span>/</span><span aria-current="page">${escapeHtml(product.nama)}</span></nav>
  <a class="btn btn-ghost" href="#/">${icon('back')} Kembali ke katalog</a>
  <div class="detail-layout">
    <div class="detail-media">
      <img src="${escapeHtml(product.imageUrl)}" alt="Ilustrasi ${escapeHtml(product.nama)}" />
      ${product.unggulan ? `<span class="badge badge-featured">${icon('star')} Unggulan</span>` : ''}
    </div>
    <div class="detail-info">
      <span class="badge badge-category">${escapeHtml(product.kategori)}</span>
      <h1 class="detail-title">${escapeHtml(product.nama)}</h1>
      <div class="detail-meta"><span class="detail-price">${formatRupiah(product.harga)}</span><span class="stock stock-${stock.tone}">${icon('dot')} ${stock.label}</span></div>
      <h2 class="subhead">Deskripsi</h2>
      <p class="detail-desc">${escapeHtml(product.deskripsi)}</p>
      <h2 class="subhead">Informasi Produk</h2>
      <dl class="info-list">${rows}</dl>
      <a class="btn btn-whatsapp" href="${escapeHtml(buildWhatsAppUrl(product))}" target="_blank" rel="noopener noreferrer" aria-label="Pesan via WhatsApp tentang ${escapeHtml(product.nama)} ${formatRupiah(product.harga)}">${icon('whatsapp')} Pesan via WhatsApp</a>
      <p class="hint">Membuka WhatsApp. Tidak ada pembayaran otomatis.</p>
    </div>
  </div>
</section>`;
}

function renderStat(label, value, iconName, tone) {
  return `<article class="stat stat-${tone}"><span class="stat-icon">${icon(iconName)}</span><span class="stat-value">${value}</span><span class="stat-label">${label}</span></article>`;
}

function renderRow(product) {
  const stock = stockInfo(product.stok);
  return `<article class="row-card">
  <img src="${escapeHtml(product.imageUrl)}" alt="" />
  <div class="row-main"><strong>${escapeHtml(product.nama)}</strong><span class="muted">${escapeHtml(product.kategori)}${product.unggulan ? ' · ★ Unggulan' : ''}</span><span>${formatRupiah(product.harga)} · <span class="stock stock-${stock.tone}">${stock.label}</span></span></div>
  <div class="row-actions"><button type="button" class="icon-btn" data-action="edit" data-id="${escapeHtml(product.id)}" aria-label="Edit ${escapeHtml(product.nama)}">${icon('edit')}</button><button type="button" class="icon-btn icon-btn-danger" data-action="delete" data-id="${escapeHtml(product.id)}" aria-label="Hapus ${escapeHtml(product.nama)}">${icon('trash')}</button></div>
</article>`;
}

function renderForm() {
  return `<dialog class="form-dialog" id="product-dialog" aria-labelledby="dialog-title">
  <form id="product-form" novalidate>
    <div class="dialog-head"><h2 id="dialog-title">Tambah Produk</h2><button class="icon-btn" type="button" data-action="close-dialog" aria-label="Tutup form">${icon('close')}</button></div>
    <div class="form-grid">
      <div class="field field-wide" id="field-id" hidden><label for="f-id">ID</label><input id="f-id" name="id" type="text" readonly /></div>
      <div class="field field-wide"><label for="f-nama">Nama produk</label><input id="f-nama" name="nama" type="text" maxlength="80" required /><span class="field-error" data-error-for="nama"></span></div>
      <div class="field"><label for="f-kategori">Kategori</label><select id="f-kategori" name="kategori" required>${KATEGORI.map((k) => `<option value="${escapeHtml(k)}">${escapeHtml(labelKategori(k))}</option>`).join('')}</select><span class="field-error" data-error-for="kategori"></span></div>
      <div class="field"><label for="f-harga">Harga (Rp)</label><input id="f-harga" name="harga" type="number" min="0" step="0.01" required /><span class="field-error" data-error-for="harga"></span></div>
      <div class="field"><label for="f-stok">Stok</label><input id="f-stok" name="stok" type="text" inputmode="numeric" required /><span class="field-error" data-error-for="stok"></span></div>
      <div class="field"><label for="f-imageUrl">Gambar</label><input id="f-imageUrl" name="imageUrl" type="text" placeholder="assets/... (kosong = otomatis)" /><span class="field-error" data-error-for="imageUrl"></span></div>
      <div class="field field-wide"><label for="f-deskripsi">Deskripsi</label><textarea id="f-deskripsi" name="deskripsi" rows="3" maxlength="500" required></textarea><span class="field-error" data-error-for="deskripsi"></span></div>
      <label class="checkbox field-wide"><input name="unggulan" type="checkbox" /> Jadikan produk unggulan</label>
    </div>
    <p class="form-error" id="form-error" role="alert" hidden></p>
    <div class="dialog-actions"><button type="button" class="btn btn-ghost" data-action="close-dialog">Batal</button><button type="submit" class="btn btn-primary">Simpan</button></div>
  </form>
</dialog>`;
}

export function renderDashboard({ products, summary }) {
  return `<section class="container section dashboard">
  <div class="dashboard-head">
    <div><span class="badge badge-demo">DEMO</span><h1>Dashboard Pengelola</h1><p class="muted">Kelola katalog NEXORA — semua data tersimpan di perangkat ini.</p></div>
    <div class="dashboard-actions"><button type="button" class="btn btn-primary" data-action="open-form">${icon('plus')} Tambah Produk</button><button type="button" class="btn btn-ghost" data-action="reset-data">${icon('reset')} Reset Data</button></div>
  </div>
  <div class="stats">
    ${renderStat('Total Produk', summary.total, 'box', 'purple')}
    ${renderStat('Total Stok', summary.stok, 'layers', 'cyan')}
    ${renderStat('Produk Unggulan', summary.unggulan, 'star', 'warning')}
    ${renderStat('Jumlah Kategori', summary.kategori, 'grid', 'success')}
  </div>
  <div class="panel">
    <div class="panel-head"><h2>Daftar Produk</h2><span class="muted">${summary.total} produk tersimpan</span></div>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Gambar</th><th>Nama</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Unggulan</th><th>Aksi</th></tr></thead>
      <tbody>${products.map((product) => {
        const stock = stockInfo(product.stok);
        return `<tr><td><img src="${escapeHtml(product.imageUrl)}" alt="" /></td><td>${escapeHtml(product.nama)}</td><td>${escapeHtml(product.kategori)}</td><td>${formatRupiah(product.harga)}</td><td><span class="stock stock-${stock.tone}">${stock.label}</span></td><td>${product.unggulan ? icon('star') : '—'}</td><td><button type="button" class="icon-btn" data-action="edit" data-id="${escapeHtml(product.id)}" aria-label="Edit ${escapeHtml(product.nama)}">${icon('edit')}</button><button type="button" class="icon-btn icon-btn-danger" data-action="delete" data-id="${escapeHtml(product.id)}" aria-label="Hapus ${escapeHtml(product.nama)}">${icon('trash')}</button></td></tr>`;
      }).join('')}</tbody>
    </table></div>
    <div class="row-list">${products.map(renderRow).join('')}</div>
  </div>
  ${renderForm()}
</section>`;
}

export function showToast(message, tone = 'info') {
  const region = document.querySelector('#toast-region');
  if (!region) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${tone}`;
  toast.setAttribute('role', tone === 'error' ? 'alert' : 'status');
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), 4000);
}
