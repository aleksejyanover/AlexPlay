'use client';

// Крошечное клиентское хранилище для живого поиска (без внешних зависимостей).
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
