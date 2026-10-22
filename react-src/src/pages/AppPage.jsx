import { useRef, useState } from 'react'
import Tile from '../components/Tile.jsx'
import AppCard from '../components/AppCard.jsx'
import CheckoutModal from '../components/CheckoutModal.jsx'
import { APPS, catEmoji, catHref, fmtNum, stars } from '../utils.js'

const REV_KEY = 'alexplay_reviews'

/* --- localStorage-хелперы (ключи как в эталоне html/js/detail.js) --- */
function readAllReviews() {
  try {
    return JSON.parse(localStorage.getItem(REV_KEY) || '{}')
  } catch {
    return {}
  }
}

function launchKey(appId) {
  return 'alexplay_launch_' + appId
}

function paidKey(appId) {
  return 'alexplay_paid_' + appId
}

function todayStr() {
  return new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

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
function DlBtn({ href, variant, icon, label, onLaunch }) {
  if (href) {
    return (
      <a
        className={`btn ${variant}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onLaunch}
      >
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

/* Блок действий (после покупки / бесплатное): «Открыть в браузере» + сетка 2×2.
   Клик по любой активной кнопке = «первый запуск» → открывает форму отзыва. */
function DlActions({ links, onLaunch, showPaidHint = false }) {
  return (
    <div className="dl-actions">
      {showPaidHint && <div className="buy-hint">✓ Покупка завершена — приложение доступно</div>}
      <DlBtn
        href={links.web}
        variant="btn-primary"
        icon="🌐"
        label="Открыть в браузере"
        onLaunch={onLaunch}
      />
      <div className="dl-grid">
        <DlBtn href={links.ios} variant="btn-ghost" label="Загрузить для iPhone" onLaunch={onLaunch} />
        <DlBtn
          href={links.android}
          variant="btn-ghost"
          icon="🤖"
          label="Скачать для Android"
          onLaunch={onLaunch}
        />
        <DlBtn href={links.mac} variant="btn-ghost" icon="🍎" label="Скачать для Mac" onLaunch={onLaunch} />
        <DlBtn
          href={links.windows}
          variant="btn-ghost"
          icon="🪟"
          label="Скачать для Windows"
          onLaunch={onLaunch}
        />
      </div>
      <div className="plat-label">Или скачайте на iPhone, Android, Mac и Windows</div>
    </div>
  )
}

/* Один отзыв (свой — с меткой и кнопками «Изменить»/«Удалить») */
function ReviewItem({ r, yours, onEdit, onDelete }) {
  const name = (r.name || 'Гость').trim() || 'Гость'
  const initial = name.charAt(0) || 'Г'
  return (
    <div className={`review${yours ? ' yours' : ''}`}>
      <div className="review-head">
        <span className="avatar">{initial}</span>
        <div>
          <div className="who">
            {name}
            {yours && <span className="yours-label">Ваш отзыв</span>}
          </div>
          <div className="when">{r.date}</div>
        </div>
        <span className="rv-stars">
          {'★'.repeat(r.stars) + '☆'.repeat(5 - r.stars)}
        </span>
      </div>
      <p>{r.text}</p>
      {yours && (
        <div className="rv-actions">
          <button onClick={onEdit}>Изменить</button>
          <button className="del" onClick={onDelete}>
            Удалить
          </button>
        </div>
      )}
    </div>
  )
}

/* Блок «Отзывы»: gate → форма → свой отзыв → отзывы из app.comments */
function Reviews({ app, launched }) {
  const [mine, setMine] = useState(() => readAllReviews()[app.id] || null)
  const [editing, setEditing] = useState(false)
  const [formStars, setFormStars] = useState(5)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const textRef = useRef(null)
  const formRef = useRef(null)
  const hasAnyLink = Object.values(app.links || {}).some(Boolean)

  function save(e) {
    e.preventDefault()
    const t = text.trim()
    if (!t) {
      textRef.current?.focus()
      return
    }
    const rec = { stars: formStars, text: t, name: name.trim() || 'Гость', date: todayStr() }
    const all = readAllReviews()
    all[app.id] = rec
    localStorage.setItem(REV_KEY, JSON.stringify(all))
    setMine(rec)
    setEditing(false)
  }

  function startEdit() {
    setEditing(true)
    setFormStars(mine.stars)
    setText(mine.text)
    setName(mine.name || '')
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    )
  }

  function remove() {
    const all = readAllReviews()
    delete all[app.id]
    localStorage.setItem(REV_KEY, JSON.stringify(all))
    setMine(null)
    setEditing(false)
    setFormStars(5)
    setText('')
    setName('')
  }

  return (
    <div className="reviews">
      {!launched && (
        <div className="review-gate">
          <span style={{ fontSize: 20 }}>🔒</span>
          <span>
            <b>Чтобы оставить отзыв, хотя бы раз откройте приложение.</b>
            <br />
            Нажмите «Открыть в браузере» или скачайте его — и форма отзыва станет доступной.
            {!hasAnyLink && (
              <>
                <br />
                У этого приложения пока нет активных ссылок — отзыв можно будет оставить после его
                запуска.
              </>
            )}
          </span>
        </div>
      )}

      {launched && (!mine || editing) && (
        <form className="review-form" onSubmit={save} ref={formRef}>
          <div className="lbl">{editing ? 'Изменить отзыв' : 'Ваша оценка'}</div>
          <div className="stars-input">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`s${i <= formStars ? ' on' : ''}`}
                onClick={() => setFormStars(i)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            ref={textRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Расскажите, как вам приложение..."
          />
          <div className="row">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя (необязательно)"
              style={{ maxWidth: 280 }}
            />
            <button className="btn btn-primary btn-sm" type="submit">
              {editing ? 'Сохранить' : 'Оставить отзыв'}
            </button>
            {editing && (
              <button className="btn btn-ghost btn-sm" type="button" onClick={() => setEditing(false)}>
                Отмена
              </button>
            )}
          </div>
        </form>
      )}

      {mine && <ReviewItem r={mine} yours onEdit={startEdit} onDelete={remove} />}

      {(app.comments || []).map((c, i) => (
        <ReviewItem key={i} r={c} />
      ))}
    </div>
  )
}

export default function AppPage({ app }) {
  const [launched, setLaunched] = useState(() => !!localStorage.getItem(launchKey(app.id)))

  /* демо-оплата: платное приложение разблокируется покупкой (alexplay_paid_<id>) */
  const isPaidApp = app.price !== 'Бесплатно'
  const [owned, setOwned] = useState(
    () => !isPaidApp || !!localStorage.getItem(paidKey(app.id)),
  )
  const [showPay, setShowPay] = useState(false)

  /* первый запуск приложения (клик по любой активной кнопке блока действий)
     открывает возможность отзывов — ставим alexplay_launch_<id> как в эталоне.
     Кнопка «Купить» запуском НЕ считается. */
  function handleLaunch() {
    localStorage.setItem(launchKey(app.id), '1')
    setLaunched(true)
  }

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
          {owned ? (
            <DlActions links={app.links || {}} onLaunch={handleLaunch} showPaidHint={isPaidApp} />
          ) : (
            <div className="dl-actions">
              <button className="btn btn-primary" onClick={() => setShowPay(true)}>
                💳 Купить за {app.price}
              </button>
              <div className="plat-label">
                После покупки откроются кнопки «Открыть в браузере» и загрузки на все платформы
              </div>
            </div>
          )}
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

          {/* Отзывы */}
          <section className="panel">
            <h2>Отзывы</h2>
            <Reviews app={app} launched={launched} />
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

      {/* Модалка демо-оплаты (данные карт — только в полях формы) */}
      {showPay && (
        <CheckoutModal app={app} onPaid={() => setOwned(true)} onClose={() => setShowPay(false)} />
      )}
    </>
  )
}
