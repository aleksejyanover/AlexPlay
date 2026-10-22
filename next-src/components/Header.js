'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { getQuery, setQuery, subscribe } from '@/lib/search-store';

export default function Header() {
  const query = useSyncExternalStore(subscribe, getQuery, getQuery);
  const router = useRouter();

  // Enter в поиске (в т.ч. на информационных страницах) → на главную с ?q=.
  function onSearchKeyDown(e) {
    if (e.key !== 'Enter') return;
    const q = e.currentTarget.value.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : '/');
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" className="logo" aria-label="Alex Play — на главную">
          <span className="logo-mark">▶</span>
          <span>
            Alex <span className="logo-grad">Play</span>
          </span>
        </Link>

        <div className="search">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onSearchKeyDown}
            placeholder="Поиск приложений…"
            aria-label="Поиск приложений"
          />
        </div>

        <nav className="header-nav">
          <Link href="/">Каталог</Link>
          <Link href="/#sections">Подборки</Link>
        </nav>
      </div>
    </header>
  );
}
