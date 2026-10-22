'use client';

import { useSyncExternalStore, useMemo, useEffect } from 'react';
import { subscribe, getQuery, setQuery } from '@/lib/search-store';
import {
  ALL_APPS,
  CATEGORIES,
  searchApps,
  formatReviews,
  pluralReviews,
} from '@/lib/apps';
import AppCard from '@/components/AppCard';
import Section from '@/components/Section';
import Tile from '@/components/Tile';
import { useState } from 'react';
import Link from 'next/link';

const SECTIONS = [
  {
    title: 'Популярные',
    list: [...ALL_APPS].sort((a, b) => b.reviews - a.reviews).slice(0, 8),
  },
  {
    title: 'Новинки',
    list: [...ALL_APPS].sort((a, b) => (a.added < b.added ? 1 : -1)).slice(0, 8),
  },
  {
    title: 'Топ по рейтингу',
    list: [...ALL_APPS]
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
      .slice(0, 8),
  },
  { title: 'Игры', list: ALL_APPS.filter((a) => a.category === 'Игры') },
  { title: 'Приложения', list: ALL_APPS.filter((a) => a.category !== 'Игры') },
];

const HERO = ALL_APPS.find((a) => a.id === 'zen-focus') || ALL_APPS[0];

const AUTHOR_APPS = ALL_APPS.filter((a) => a.author);

export default function HomePage() {
  const query = useSyncExternalStore(subscribe, getQuery, getQuery);
  const [cat, setCat] = useState('Все');

  // Поддержка прямых ссылок вида /?q=слово (и Enter из поиска на любых страницах).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setQuery(q);
  }, []);

  const filtering = query.trim() !== '' || cat !== 'Все';

  const results = useMemo(() => {
    let list = searchApps(ALL_APPS, query);
    if (cat !== 'Все') list = list.filter((a) => a.category === cat);
    return list;
  }, [query, cat]);

  return (
    <>
      {filtering ? (
        <>
          <div className="results-head">
            <h1>
              {cat !== 'Все' ? cat : 'Результаты поиска'}
              {query.trim() ? ` · «${query.trim()}»` : ''}
            </h1>
            <span className="section-count">
              Найдено {results.length}{' '}
              {results.length === 1
                ? 'приложение'
                : results.length >= 2 && results.length <= 4
                ? 'приложения'
                : 'приложений'}
            </span>
          </div>

          {results.length > 0 ? (
            <div className="grid">
              {results.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <span className="empty-emoji">🕵️</span>
              <h2>Ничего не найдено</h2>
              <p>
                Попробуйте изменить запрос или выбрать другую категорию.
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Hero-баннер с избранным приложением */}
          <section className="hero">
            <div className="hero-tile">
              <Tile app={HERO} size="lg" />
            </div>
            <div className="hero-body">
              <span className="hero-kicker">Приложение недели</span>
              <h1>{HERO.name}</h1>
              <p>{HERO.desc}</p>
              <div className="hero-actions">
                <Link href={`/app/${HERO.id}/`} className="btn btn-primary">
                  ★ {HERO.rating.toFixed(1)} ·{' '}
                  {formatReviews(HERO.reviews)} {pluralReviews(HERO.reviews)}
                </Link>
                <Link href="#sections" className="btn btn-outline">
                  Все приложения
                </Link>
              </div>
            </div>
          </section>

          {/* Авторская секция — проекты автора Alex Play */}
          {AUTHOR_APPS.length > 0 && (
            <section className="author-band">
              <div className="author-band-hd">
                <span className="author-photo">▶</span>
                <div>
                  <div className="t">Создано автором Alex Play</div>
                  <div className="s">
                    Собственные проекты автора магазина — уже здесь
                  </div>
                </div>
                <span className="author-seal">
                  ✦ Создана автором Alex Play
                </span>
              </div>
              <div className="grid">
                {AUTHOR_APPS.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </section>
          )}

          {/* Чипы категорий */}
          <div className="chips" role="tablist" aria-label="Категории">
            {['Все', ...CATEGORIES].map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={cat === c}
                className={`chip${cat === c ? ' active' : ''}`}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Выбранная категория → сетка */}
          {cat !== 'Все' ? (
            <section className="section">
              <div className="section-head">
                <h2>{cat}</h2>
                <span className="section-count">
                  Найдено {results.length} приложений
                </span>
              </div>
              {results.length > 0 ? (
                <div className="grid">
                  {results.map((app) => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <span className="empty-emoji">🗂️</span>
                  <h2>В категории пока пусто</h2>
                </div>
              )}
            </section>
          ) : (
            <div id="sections">
              {SECTIONS.map((s) => (
                <Section key={s.title} title={s.title} apps={s.list} AppCard={AppCard} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
