/**
 * store.js — state produk + persistensi localStorage.
 * Satu sumber kebenaran untuk katalog, detail, dan dashboard.
 */

import { KATEGORI, buildProduct, createSeedProducts } from './products.js';

export const STORAGE_KEY = 'nexora.catalog.v1';
const VERSION = 1;

let products = [];
let lastError = '';
const listeners = new Set();

function cloneSeed() {
  return createSeedProducts().map((product) => ({ ...product }));
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.version !== VERSION || !Array.isArray(parsed.products)) return null;
    return parsed.products;
  } catch {
    return null;
  }
}

function writeStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, products }));
    lastError = '';
    return true;
  } catch {
    lastError = 'Gagal menyimpan data lokal. Perubahan hanya berlaku di sesi ini.';
    return false;
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

function commit(next) {
  products = next;
  writeStorage();
  notify();
}

export function init() {
  const stored = readStorage();
  products = stored ?? cloneSeed();
  if (!stored) writeStorage();
  notify();
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getProducts() {
  return products.map((product) => ({ ...product }));
}

export function getProduct(id) {
  const found = products.find((product) => product.id === id);
  return found ? { ...found } : null;
}

export function getSummary() {
  return {
    total: products.length,
    stok: products.reduce((total, product) => total + product.stok, 0),
    unggulan: products.filter((product) => product.unggulan).length,
    kategori: new Set(products.map((product) => product.kategori)).size,
  };
}

export function getLastError() {
  return lastError;
}

export function clearError() {
  lastError = '';
}

export function validateProduct(input) {
  const errors = {};

  const nama = String(input.nama ?? '').trim();
  if (nama.length < 3 || nama.length > 80) errors.nama = 'Nama harus 3–80 karakter.';

  if (!KATEGORI.includes(input.kategori)) errors.kategori = 'Pilih kategori yang valid.';

  const harga = Number(input.harga);
  if (!Number.isFinite(harga) || harga < 0) {
    errors.harga = 'Harga harus angka lebih dari atau sama dengan 0.';
  } else if (Math.abs(harga * 100 - Math.round(harga * 100)) > 1e-9) {
    errors.harga = 'Harga maksimal 2 digit desimal.';
  }

  const stokRaw = String(input.stok ?? '').trim();
  if (!/^\d+$/.test(stokRaw) || !Number.isInteger(Number(stokRaw))) {
    errors.stok = 'Stok harus bilangan bulat lebih dari atau sama dengan 0.';
  }

  const deskripsi = String(input.deskripsi ?? '').trim();
  if (deskripsi.length < 10 || deskripsi.length > 500) {
    errors.deskripsi = 'Deskripsi harus 10–500 karakter.';
  }

  const imageUrl = String(input.imageUrl ?? '').trim();
  if (imageUrl && !/^(\.?\/?assets\/|data:image\/)/.test(imageUrl)) {
    errors.imageUrl = 'Gunakan path lokal (assets/...) atau data:image/...';
  }

  return errors;
}

export function addProduct(input) {
  const created = buildProduct(input, products);
  commit([created, ...products]);
  return created;
}

export function updateProduct(id, input) {
  let updated = null;
  const next = products.map((product) => {
    if (product.id !== id) return product;
    updated = {
      ...product,
      nama: String(input.nama).trim(),
      kategori: input.kategori,
      harga: Number(input.harga),
      stok: Number(input.stok),
      deskripsi: String(input.deskripsi).trim(),
      imageUrl: String(input.imageUrl || '').trim() || product.imageUrl,
      unggulan: Boolean(input.unggulan),
    };
    return updated;
  });
  if (!updated) return null;
  commit(next);
  return updated;
}

export function deleteProduct(id) {
  if (!products.some((product) => product.id === id)) return false;
  commit(products.filter((product) => product.id !== id));
  return true;
}

export function resetProducts() {
  commit(cloneSeed());
}
