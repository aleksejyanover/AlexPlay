import { useMemo } from 'react'
import AppCard from '../components/AppCard.jsx'
import { APPS } from '../utils.js'

function plural(n) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'приложение'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'приложения'
  return 'приложений'
}

export default function SearchPage({ q }) {
  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    return APPS.filter(
      (a) =>
        a.name.toLowerCase().includes(needle) ||
        a.dev.toLowerCase().includes(needle) ||
        a.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }, [q])

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">🔍 Поиск</h1>
        {q.trim() && (
          <p className="muted">
            Найдено {results.length} {plural(results.length)} по запросу «{q.trim()}»
          </p>
        )}
      </div>

      {q.trim() === '' ? (
        <div className="empty">
          <div className="empty-emoji">⌨️</div>
          <h2>Введите запрос</h2>
          <p className="muted">Ищите по названию, разработчику или тегам — например, «игра» или «фокус».</p>
        </div>
      ) : results.length ? (
        <div className="grid grid-cards">
          {results.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="empty-emoji">🙁</div>
          <h2>Ничего не найдено</h2>
          <p className="muted">Попробуйте изменить запрос или посмотрите категории на главной.</p>
        </div>
      )}
    </>
  )
}
