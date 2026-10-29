'use client';

// Крошечное клиентское хранилище для живого поиска и категории (без внешних зависимостей).
let query = '';
const listeners = new Set();

export function getQuery() {
  return query;
}

export function setQuery(q) {
  if (q === query) return;
  query = q;
  listeners.forEach((l) => l());
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Выбранная категория главной (чипсы / мобильный навбар).
let cat = 'Все';
const catListeners = new Set();

export function getCat() {
  return cat;
}

export function setCat(c) {
  if (c === cat) return;
  cat = c;
  catListeners.forEach((l) => l());
}

export function subscribeCat(fn) {
  catListeners.add(fn);
  return () => catListeners.delete(fn);
}
