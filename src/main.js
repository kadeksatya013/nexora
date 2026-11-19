/**
 * main.js — orchestrator: router, state filter, event delegation, dan inisialisasi.
 */

import './style.css';
import { KATEGORI, SORT_OPTIONS } from './products.js';
import {
  init,
  subscribe,
  getProducts,
  getProduct,
  getSummary,
  addProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
  validateProduct,
  getLastError,
  clearError,
} from './store.js';
import {
  FALLBACK_IMAGE,
  escapeHtml,
  renderNavbar,
  renderCatalog,
  renderDetail,
  renderDashboard,
  showToast,
} from './ui.js';

const app = document.querySelector('#main-content');
const header = document.querySelector('#app-header');

const state = {
  filters: { search: '', kategori: 'Semua', sort: SORT_OPTIONS[0].value },
  route: parseHash(),
};

function parseHash() {
  const path = (location.hash || '#/').replace(/^#\/?/, '');
  if (path.startsWith('produk/')) return { name: 'detail', id: decodeURIComponent(path.slice(7)) };
  if (path === 'dashboard') return { name: 'dashboard' };
  if (path === 'explore') return { name: 'explore' };
  if (path === 'categories') return { name: 'categories' };
  return { name: 'catalog' };
}

function getVisible() {
  const query = state.filters.search.trim().toLowerCase();
  const all = getProducts();
  const visible = all.filter((product) => {
    const haystack = `${product.nama} ${product.kategori} ${product.deskripsi}`.toLowerCase();
    const matchSearch = !query || haystack.includes(query);
    const matchCategory = state.filters.kategori === 'Semua' || product.kategori === state.filters.kategori;
    return matchSearch && matchCategory;
  });

  const { sort } = state.filters;
  if (sort === 'harga-asc') visible.sort((a, b) => a.harga - b.harga || a.id.localeCompare(b.id));
  if (sort === 'harga-desc') visible.sort((a, b) => b.harga - a.harga || a.id.localeCompare(b.id));
  if (sort === 'nama-asc') visible.sort((a, b) => a.nama.localeCompare(b.nama, 'id') || a.id.localeCompare(b.id));
  if (sort === 'nama-desc') visible.sort((a, b) => b.nama.localeCompare(a.nama, 'id') || a.id.localeCompare(b.id));
  if (sort === 'terbaru') {
    visible.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '') || String(b.id || '').localeCompare(String(a.id || '')));
  }

  return { visible, total: all.length };
}

function focusAnchor(selector) {
  const target = document.querySelector(selector);
  if (!target) return;
  target.focus();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function render() {
  state.route = parseHash();
  header.innerHTML = renderNavbar(state.route.name);
  const summary = getSummary();

  if (state.route.name === 'dashboard') {
    app.innerHTML = renderDashboard({ products: getProducts(), summary });
  } else if (state.route.name === 'detail') {
    app.innerHTML = renderDetail(getProduct(state.route.id));
  } else {
    const { visible, total } = getVisible();
    app.innerHTML = renderCatalog({ visible, total, filters: state.filters, summary });
    if (state.route.name === 'explore') focusAnchor('[data-kategori="Semua"]');
    if (state.route.name === 'categories') focusAnchor('[data-kategori="Template Canva"]');
  }
  document.title = state.route.name === 'detail'
    ? 'Detail Produk — NEXORA'
    : 'NEXORA — Katalog Produk Digital';
}

function reportStorageError() {
  const error = getLastError();
  if (!error) return;
  showToast(error, 'error');
  clearError();
}

function setDrawer(open) {
  const drawer = document.querySelector('#nav-drawer');
  const overlay = document.querySelector('#nav-overlay');
  const toggle = document.querySelector('#menu-toggle');
  if (!drawer || !overlay || !toggle) return;
  drawer.hidden = !open;
  overlay.hidden = !open;
  toggle.setAttribute('aria-expanded', String(open));
  if (open) drawer.querySelector('.drawer-links a')?.focus();
  else toggle.focus();
}

function confirmAction(title, message, confirmLabel) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'confirm-dialog';
    dialog.setAttribute('aria-labelledby', 'confirm-title');
    dialog.innerHTML = `<h2 id="confirm-title">${escapeHtml(title)}</h2><p>${escapeHtml(message)}</p>
      <div class="dialog-actions">
        <button type="button" class="btn btn-ghost" data-confirm="false" autofocus>Batal</button>
        <button type="button" class="btn btn-danger" data-confirm="true">${escapeHtml(confirmLabel)}</button>
      </div>`;
    document.body.append(dialog);
    dialog.addEventListener('close', () => { dialog.remove(); resolve(false); }, { once: true });
    dialog.addEventListener('click', (event) => {
      const button = event.target.closest?.('[data-confirm]');
      if (!button) return;
      resolve(button.dataset.confirm === 'true');
      dialog.close();
    });
    dialog.showModal();
  });
}

function setField(dialog, name, value) {
  const input = dialog.querySelector(`[name="${name}"]`);
  if (input) input.value = value ?? '';
}

function clearFormErrors(dialog) {
  if (!dialog) return;
  dialog.querySelectorAll('.field-error').forEach((node) => { node.textContent = ''; });
  dialog.querySelectorAll('[aria-invalid]').forEach((node) => node.removeAttribute('aria-invalid'));
  const general = dialog.querySelector('#form-error');
  if (general) { general.textContent = ''; general.hidden = true; }
}

function showFormErrors(dialog, errors) {
  Object.entries(errors).forEach(([field, message]) => {
    const target = dialog.querySelector(`[data-error-for="${field}"]`);
    if (target) target.textContent = message;
    const input = dialog.querySelector(`[name="${field}"]`);
    if (input) input.setAttribute('aria-invalid', 'true');
  });
  const general = dialog.querySelector('#form-error');
  if (general) { general.textContent = 'Periksa kembali field yang ditandai.'; general.hidden = false; }
}

function openForm(product) {
  const dialog = document.querySelector('#product-dialog');
  if (!dialog) return;
  dialog.dataset.id = product?.id ?? '';
  const title = dialog.querySelector('#dialog-title');
  if (title) title.textContent = product ? 'Edit Produk' : 'Tambah Produk';

  setField(dialog, 'nama', product?.nama ?? '');
  setField(dialog, 'kategori', product?.kategori ?? KATEGORI[0]);
  setField(dialog, 'harga', product?.harga ?? '');
  setField(dialog, 'stok', product?.stok ?? '');
  setField(dialog, 'deskripsi', product?.deskripsi ?? '');
  setField(dialog, 'imageUrl', product?.imageUrl ?? '');
  setField(dialog, 'id', product?.id ?? '');

  const idField = dialog.querySelector('#field-id');
  if (idField) idField.hidden = !product;
  const featured = dialog.querySelector('[name="unggulan"]');
  if (featured) featured.checked = Boolean(product?.unggulan);

  clearFormErrors(dialog);
  dialog.showModal();
}

document.addEventListener('click', (event) => {
  if (event.target.closest?.('#menu-toggle')) { setDrawer(true); return; }
  if (event.target.closest?.('#nav-overlay, #drawer-close')) { setDrawer(false); return; }
  if (event.target.closest?.('[data-action="close-drawer"]') && document.querySelector('#nav-drawer')?.hidden === false) {
    setDrawer(false);
  }

  const chip = event.target.closest?.('[data-kategori]');
  if (chip) {
    state.filters.kategori = chip.dataset.kategori;
    render();
    return;
  }

  const action = event.target.closest?.('[data-action]')?.dataset.action;
  if (!action) return;

  if (action === 'clear-search') {
    state.filters.search = '';
    render();
    document.querySelector('#search-input')?.focus();
  } else if (action === 'reset-filter') {
    state.filters = { search: '', kategori: 'Semua', sort: SORT_OPTIONS[0].value };
    render();
  } else if (action === 'open-form') {
    openForm(null);
  } else if (action === 'edit') {
    const product = getProduct(event.target.closest('[data-id]').dataset.id);
    if (product) openForm(product);
  } else if (action === 'delete') {
    const product = getProduct(event.target.closest('[data-id]').dataset.id);
    if (!product) return;
    confirmAction('Hapus produk', `Hapus produk "${product.nama}"? Tindakan ini tidak dapat dibatalkan.`, 'Hapus').then((ok) => {
      if (!ok) return;
      deleteProduct(product.id);
      showToast('Produk dihapus.', 'success');
      reportStorageError();
    });
  } else if (action === 'reset-data') {
    confirmAction('Reset data', 'Reset semua produk ke 8 data awal? Perubahan Anda akan hilang.', 'Reset').then((ok) => {
      if (!ok) return;
      resetProducts();
      showToast('Data dikembalikan ke 8 produk awal.', 'success');
      reportStorageError();
    });
  } else if (action === 'close-dialog') {
    event.target.closest('dialog')?.close();
  }
});

document.addEventListener('input', (event) => {
  if (event.target.id !== 'search-input') return;
  const caret = event.target.selectionStart;
  state.filters.search = event.target.value;
  render();
  const next = document.querySelector('#search-input');
  if (next) {
    next.focus();
    next.setSelectionRange(caret, caret);
  }
});

document.addEventListener('change', (event) => {
  if (event.target.id !== 'sort-select') return;
  state.filters.sort = event.target.value;
  render();
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.getAttribute('id') !== 'product-form') return;
  event.preventDefault();

  const dialog = form.closest('dialog');
  const data = new FormData(form);
  const input = {
    nama: data.get('nama'),
    kategori: data.get('kategori'),
    harga: data.get('harga'),
    stok: data.get('stok'),
    deskripsi: data.get('deskripsi'),
    imageUrl: data.get('imageUrl'),
    unggulan: data.has('unggulan'),
  };

  clearFormErrors(dialog);
  const errors = validateProduct(input);
  if (Object.keys(errors).length > 0) {
    showFormErrors(dialog, errors);
    showToast('Periksa kembali input Anda.', 'error');
    return;
  }

  const id = dialog?.dataset.id ?? '';
  dialog?.close();
  if (id) {
    updateProduct(id, input);
    showToast('Produk berhasil diperbarui.', 'success');
  } else {
    addProduct(input);
    showToast('Produk berhasil ditambahkan.', 'success');
  }
  reportStorageError();
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (document.querySelector('#nav-drawer')?.hidden === false) setDrawer(false);
});

document.addEventListener('error', (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.fallback) return;
  image.dataset.fallback = '1';
  image.src = FALLBACK_IMAGE;
}, true);

window.addEventListener('hashchange', render);

init();
subscribe(render);
render();
