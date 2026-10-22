import Tile from '../components/Tile.jsx'
import AppCard from '../components/AppCard.jsx'
import { APPS, catEmoji, catHref, fmtNum, stars } from '../utils.js'

function Shot({ app, shot, index }) {
  return (
    <div
      className="shot"
      style={{ background: `linear-gradient(160deg, ${shot.grad[0]}, ${shot.grad[1]})` }}
    >
      <span className="shot-emoji">{index === 0 ? app.emoji : ['📊', '✨', '🗂️', '⭐'][index % 4]}</span>
      <span className="shot-title">{shot.title}</span>
    </div>
  )
}

/* Кнопка одной платформы: пустая ссылка → неактивная с пометкой «Скоро» */
function DlBtn({ href, variant, icon, label }) {
  if (href) {
    return (
      <a className={`btn ${variant}`} href={href} target="_blank" rel="noopener noreferrer">
        {icon && <span aria-hidden="true">{icon}</span>}
        {label}
      </a>
    )
  }
  return (
    <button className={`btn ${variant} btn-soon`} disabled title="Скоро">
      {icon && <span aria-hidden="true">{icon}</span>}
      {label} · Скоро
    </button>
  )
}

/* Сетка загрузки 2×2 из links: { ios, android, mac, windows } */
function DlGrid({ links }) {
  return (
    <>
      <div className="dl-grid">
        <DlBtn href={links.ios} variant="btn-primary" label="Загрузить для iPhone" />
        <DlBtn href={links.android} variant="btn-outline" icon="🤖" label="Скачать для Android" />
        <DlBtn href={links.mac} variant="btn-outline" icon="🍎" label="Скачать для Mac" />
        <DlBtn href={links.windows} variant="btn-outline" icon="🪟" label="Скачать для Windows" />
      </div>
      <div className="plat-label">Доступно на iPhone, Android, Mac и Windows</div>
    </>
  )
}

export default function AppPage({ app }) {
  const similar = APPS.filter(
    (a) => a.id !== app.id && (a.category === app.category || a.tags.some((t) => app.tags.includes(t))),
  ).slice(0, 6)

  return (
    <>
      <a href="#/" className="back-link">
        ← Назад
      </a>

      <section className="app-head">
        <Tile app={app} size={128} />
        <div className="app-head-info">
          <h1 className="app-title">
            {app.author && <span className="badge-author app-title-badge">✦ Alex Play</span>}
            {app.name}
          </h1>
          <p className="app-dev">{app.dev}</p>
          <a href={catHref(app.category)} className="app-cat-link">
            {catEmoji(app.category)} {app.category}
          </a>
          <p className="app-price">{app.price}</p>
          <DlGrid links={app.links || {}} />
        </div>
      </section>

      {/* Блок «Создано автором Alex Play» — под шапкой */}
      {app.author && (
        <div className="author-note">
          <span className="author-photo author-photo-sm">▶</span>
          <span>
            <b>Создано автором Alex Play</b> — авторский проект, созданный разработчиком магазина
            Alex Play.
          </span>
        </div>
      )}

      <div className="app-columns">
        <div className="app-main">
          {/* Гистограмма отзывов */}
          <section className="panel rating-panel">
            <h2>Рейтинг и отзывы</h2>
            <div className="rating-flex">
              <div className="rating-num">
                <div className="rating-big">{app.rating.toFixed(1)}</div>
                <div className="stars">{stars(app.rating)}</div>
                <div className="muted">{fmtNum(app.reviews)} отзывов</div>
              </div>
              <div className="hist">
                {app.dist.map((pct, i) => (
                  <div className="hist-row" key={i}>
                    <span className="hist-label">{5 - i} ★</span>
                    <div className="hist-track">
                      <div className="hist-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="hist-val">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Галерея скриншотов */}
          {app.shots?.length > 0 && (
            <section className="panel">
              <h2>Скриншоты</h2>
              <div className="shots">
                {app.shots.map((shot, i) => (
                  <Shot key={i} app={app} shot={shot} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Описание */}
          <section className="panel">
            <h2>Описание</h2>
            <p className="desc-text">{app.desc}</p>
            <div className="tags">
              {app.tags.map((t) => (
                <span key={t} className="tag">
                  #{t}
                </span>
              ))}
            </div>
          </section>

          {/* Что нового */}
          <section className="panel">
            <h2>Что нового</h2>
            <p className="desc-text">
              Версия {app.version} — обновлено {app.updated}. Улучшена производительность, исправлены
              незначительные ошибки.
            </p>
          </section>
        </div>

        {/* Метаданные */}
        <aside className="app-side">
          <section className="panel">
            <h2>Характеристики</h2>
            <ul className="meta-list">
              <li>
                <span>Размер</span>
                <b>{app.size}</b>
              </li>
              <li>
                <span>Возраст</span>
                <b>{app.age}</b>
              </li>
              <li>
                <span>Версия</span>
                <b>{app.version}</b>
              </li>
              <li>
                <span>Обновлено</span>
                <b>{app.updated}</b>
              </li>
              <li>
                <span>Категория</span>
                <b>
                  {catEmoji(app.category)} {app.category}
                </b>
              </li>
              <li>
                <span>Цена</span>
                <b className="green">{app.price}</b>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      {/* Похожие приложения */}
      {similar.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2>Похожие приложения</h2>
          </div>
          <div className="grid grid-cards">
            {similar.map((a) => (
              <AppCard key={a.id} app={a} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
