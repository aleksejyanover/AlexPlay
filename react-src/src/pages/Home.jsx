import Tile from '../components/Tile.jsx'
import Section from '../components/Section.jsx'
import AppCard from '../components/AppCard.jsx'
import { APPS, categories, catEmoji, catHref, fmtNum } from '../utils.js'

function byDateDesc(a, b) {
  return new Date(b.added) - new Date(a.added)
}

/* Авторская секция: приложения, созданные автором Alex Play */
function AuthorBand() {
  const list = APPS.filter((a) => a.author)
  if (!list.length) return null
  return (
    <section className="author-band">
      <div className="author-band-hd">
        <span className="author-photo">▶</span>
        <div>
          <div className="t">Создано автором Alex Play</div>
          <div className="s">Собственные проекты автора магазина — уже здесь</div>
        </div>
        <span className="author-seal">✦ Создана автором Alex Play</span>
      </div>
      <div className="grid grid-cards">
        {list.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const hero = APPS.reduce((best, a) => (a.rating > best.rating ? a : best), APPS[0])
  const cats = categories()

  const popular = [...APPS].sort((a, b) => b.reviews - a.reviews).slice(0, 10)
  const fresh = [...APPS].sort(byDateDesc).slice(0, 10)
  const topRated = [...APPS].sort((a, b) => b.rating - a.rating).slice(0, 10)
  const games = APPS.filter((a) => a.category === 'Игры')
  const appsOnly = APPS.filter((a) => a.category !== 'Игры')

  return (
    <>
      {/* Hero-баннер */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{
            background: `linear-gradient(120deg, ${hero.grad[0]}55, ${hero.grad[1]}33)`,
          }}
        />
        <div className="hero-content">
          <Tile app={hero} size={120} />
          <div className="hero-text">
            <div className="hero-badge">🔥 Приложение недели</div>
            <h1 className="hero-title">{hero.name}</h1>
            <p className="hero-dev">{hero.dev}</p>
            <p className="hero-desc">{hero.desc}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={`#/app/${hero.id}`}>
                Подробнее
              </a>
              <span className="hero-meta">
                ⭐ {hero.rating.toFixed(1)} · {fmtNum(hero.reviews)} отзывов · {hero.price}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Авторская секция — сразу после hero */}
      <AuthorBand />

      {/* Чипы категорий */}
      <nav className="chips" aria-label="Категории">
        {cats.map((c) => (
          <a key={c} href={catHref(c)} className="chip">
            {catEmoji(c)} {c}
          </a>
        ))}
      </nav>

      {/* Карусель-подборка */}
      <section className="section">
        <div className="section-head">
          <h2>Сейчас в тренде</h2>
        </div>
        <div className="grid grid-cards">
          {topRated.slice(0, 5).map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      <Section title="Популярные" apps={popular} />
      <Section title="Платные" apps={APPS.filter((a) => a.price !== 'Бесплатно')} />
      <Section title="Новинки" apps={fresh} />
      <Section title="Топ по рейтингу" apps={topRated} />

      <section className="section">
        <div className="section-head">
          <h2>🎮 Игры</h2>
          <a href={catHref('Игры')} className="section-link">
            Все игры →
          </a>
        </div>
        <div className="grid grid-cards">
          {games.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>🧰 Приложения</h2>
        </div>
        <div className="grid grid-cards">
          {appsOnly.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>
    </>
  )
}
