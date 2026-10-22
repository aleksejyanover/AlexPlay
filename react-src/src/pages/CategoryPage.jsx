import AppCard from '../components/AppCard.jsx'
import { APPS, categories, catEmoji, catHref } from '../utils.js'

export default function CategoryPage({ cat }) {
  const apps = APPS.filter((a) => a.category === cat)

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">
          {catEmoji(cat)} {cat}
        </h1>
        <p className="muted">{apps.length} приложений</p>
      </div>

      <nav className="chips" aria-label="Категории">
        {categories().map((c) => (
          <a key={c} href={catHref(c)} className={`chip${c === cat ? ' chip-active' : ''}`}>
            {catEmoji(c)} {c}
          </a>
        ))}
      </nav>

      {apps.length ? (
        <div className="grid grid-cards">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="empty-emoji">🗂️</div>
          <h2>Категория «{cat}» пока пуста</h2>
          <p className="muted">Загляните позже — мы добавляем новые приложения каждый день.</p>
        </div>
      )}
    </>
  )
}
