import Link from 'next/link';
import Tile from './Tile';

// Карточка приложения: плитка-иконка, название, разработчик, рейтинг, категория.
export default function AppCard({ app }) {
  return (
    <Link href={`/app/${app.id}/`} className="card">
      {app.author && <span className="badge-author">✦ Alex Play</span>}
      <Tile app={app} />
      <div className="card-name">{app.name}</div>
      <div className="card-dev">{app.dev}</div>
      <div className="card-meta">
        <span className="card-rating">★ {app.rating.toFixed(1)}</span>
        {app.price !== 'Бесплатно' ? (
          <span className="price-tag">{app.price}</span>
        ) : (
          <span className="card-cat">{app.category}</span>
        )}
      </div>
    </Link>
  );
}
