import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ALL_APPS,
  getApp,
  similarApps,
  formatReviews,
  pluralReviews,
} from '@/lib/apps';
import Tile from '@/components/Tile';
import Gallery from '@/components/Gallery';
import DownloadButtons from '@/components/DownloadButtons';
import AppCard from '@/components/AppCard';
import Reviews from '@/components/Reviews';

// Статическая генерация всех карточек приложений (output: 'export').
export function generateStaticParams() {
  return ALL_APPS.map((app) => ({ id: app.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) return { title: 'Alex Play' };
  return {
    title: `${app.name} — Alex Play`,
    description: app.desc,
  };
}

// Гистограмма отзывов: dist = %% отзывов 5..1 звёзд.
function Histogram({ dist }) {
  const stars = [5, 4, 3, 2, 1];
  return (
    <div className="histo" aria-label="Распределение отзывов по звёздам">
      {stars.map((s, i) => (
        <div className="histo-row" key={s}>
          <span>{s} ★</span>
          <span className="histo-bar">
            <span className="histo-fill" style={{ width: `${dist[i]}%` }} />
          </span>
          <span className="histo-pct">{dist[i]}%</span>
        </div>
      ))}
    </div>
  );
}

export default async function AppPage({ params }) {
  const { id } = await params;
  const app = getApp(id);
  if (!app) notFound();

  const similar = similarApps(app);

  return (
    <>
      <Link href="/" className="back-link">
        ← Назад в каталог
      </Link>

      {/* Шапка: плитка, название, рейтинг, кнопки */}
      <section className="app-head">
        <Tile app={app} size="lg" />
        <div className="app-head-body">
          <h1>
            {app.author && (
              <span
                className="badge-author"
                style={{ verticalAlign: 'middle', marginRight: 10 }}
              >
                ✦ Alex Play
              </span>
            )}
            {app.name}
          </h1>
          <p className="dev">{app.dev}</p>

          <div className="app-rating-row">
            <span className="app-rating-num">{app.rating.toFixed(1)}</span>
            <span className="stars" aria-label={`${app.rating} из 5`}>
              {'★'.repeat(Math.round(app.rating))}
              {'☆'.repeat(5 - Math.round(app.rating))}
            </span>
            <span className="reviews-count">
              {formatReviews(app.reviews)} {pluralReviews(app.reviews)}
            </span>
          </div>

          <DownloadButtons app={app} />

          <Histogram dist={app.dist} />
        </div>
      </section>

      {/* Блок «Создано автором Alex Play» */}
      {app.author && (
        <div className="author-note">
          <span className="author-photo">▶</span>
          <span>
            <b>Создано автором Alex Play</b> — авторский проект, созданный
            разработчиком магазина Alex Play.
          </span>
        </div>
      )}

      {/* Метаданные */}
      <div className="meta-grid">
        <div className="meta-item">
          <div className="k">Размер</div>
          <div className="v">{app.size}</div>
        </div>
        <div className="meta-item">
          <div className="k">Возраст</div>
          <div className="v">{app.age}</div>
        </div>
        <div className="meta-item">
          <div className="k">Версия</div>
          <div className="v">{app.version}</div>
        </div>
        <div className="meta-item">
          <div className="k">Обновлено</div>
          <div className="v">{app.updated}</div>
        </div>
        <div className="meta-item">
          <div className="k">Категория</div>
          <div className="v">{app.category}</div>
        </div>
        <div className="meta-item">
          <div className="k">Цена</div>
          <div className="v" style={{ color: 'var(--green)' }}>
            {app.price}
          </div>
        </div>
      </div>

      {/* Галерея скриншотов */}
      <section className="block">
        <h2>Скриншоты</h2>
        <Gallery shots={app.shots} emoji={app.emoji} />
      </section>

      {/* Описание + теги */}
      <section className="block desc">
        <h2>Описание</h2>
        <p>{app.desc}</p>
        <h2 style={{ marginTop: 18 }}>Что нового</h2>
        <p>
          Версия {app.version} — обновлено {app.updated}. Улучшена
          производительность и исправлены ошибки.
        </p>
        <div className="tags">
          {app.tags.map((t) => (
            <span className="tag" key={t}>
              #{t}
            </span>
          ))}
        </div>
      </section>

      {/* Отзывы: gate → форма (после первого запуска) → свой отзыв → отзывы из данных */}
      <Reviews app={app} />

      {/* Похожие приложения */}
      {similar.length > 0 && (
        <section className="block">
          <h2>Похожие приложения</h2>
          <div className="grid">
            {similar.map((s) => (
              <AppCard key={s.id} app={s} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
