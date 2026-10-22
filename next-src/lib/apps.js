// Единый каталог приложений (копия shared/apps.json) + хелперы.
import apps from '@/data/apps.json';

export const ALL_APPS = apps;

export const CATEGORIES = Array.from(new Set(apps.map((a) => a.category)));

export function getApp(id) {
  return apps.find((a) => a.id === id);
}

// Живой поиск по названию, разработчику и тегам.
export function searchApps(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.dev.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function formatReviews(n) {
  return n.toLocaleString('ru-RU');
}

export function pluralReviews(n) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return 'отзыв';
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return 'отзыва';
  return 'отзывов';
}

// Похожие приложения: общая категория или пересечение тегов.
export function similarApps(app, limit = 6) {
  const scored = ALL_APPS.filter((a) => a.id !== app.id).map((a) => {
    let score = 0;
    if (a.category === app.category) score += 2;
    score += a.tags.filter((t) => app.tags.includes(t)).length;
    score += Math.min(a.rating, 5) / 10;
    return { a, score };
  });
  scored.sort((x, y) => y.score - x.score);
  return scored.slice(0, limit).map((s) => s.a);
}
