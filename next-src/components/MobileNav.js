'use client';

// Мобильная нижняя навигация (только телефон, ≤640px — см. CSS).
// Активный пункт — класс .on: Главная (без фильтров), Игры/Приложения (категория),
// Поиск (есть запрос). Клик по категории синхронизирует стор главной страницы.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import {
  getCat,
  setCat,
  subscribeCat,
  getQuery,
  subscribe,
} from '@/lib/search-store';

const HREF_GAMES = `/?cat=${encodeURIComponent('Игры')}`;
const HREF_APPS = `/?cat=${encodeURIComponent('Приложения')}`;

export default function MobileNav() {
  const pathname = usePathname();
  const cat = useSyncExternalStore(subscribeCat, getCat, getCat);
  const query = useSyncExternalStore(subscribe, getQuery, getQuery);

  const onHome = pathname === '/';
  const cls = (cond) => (cond ? 'on' : '');

  return (
    <nav className="mobile-nav" aria-label="Навигация">
      <Link
        href="/"
        className={cls(onHome && cat === 'Все' && !query)}
        onClick={() => setCat('Все')}
      >
        <span className="ico" aria-hidden="true">
          🏠
        </span>
        Главная
      </Link>
      <Link
        href={HREF_GAMES}
        className={cls(onHome && cat === 'Игры')}
        onClick={() => setCat('Игры')}
      >
        <span className="ico" aria-hidden="true">
          🎮
        </span>
        Игры
      </Link>
      <Link
        href={HREF_APPS}
        className={cls(onHome && cat === 'Приложения')}
        onClick={() => setCat('Приложения')}
      >
        <span className="ico" aria-hidden="true">
          🧰
        </span>
        Приложения
      </Link>
      <Link
        href="/"
        className={cls(onHome && !!query)}
        onClick={() => setCat('Все')}
      >
        <span className="ico" aria-hidden="true">
          🔍
        </span>
        Поиск
      </Link>
    </nav>
  );
}
