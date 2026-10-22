import APPS from './apps.json'

export { APPS }

export function fmtNum(n) {
  return n.toLocaleString('ru-RU')
}

export function stars(rating) {
  const full = Math.round(rating)
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}

export function categories() {
  return [...new Set(APPS.map((a) => a.category))]
}

export function catEmoji(cat) {
  const map = {
    Игры: '🎮',
    Инструменты: '🧰',
    Фото: '📸',
    Погода: '🌦️',
    Финансы: '💰',
    Образование: '📚',
    Здоровье: '💚',
    Музыка: '🎵',
    AI: '🤖',
  }
  return map[cat] || '📱'
}

export function catHref(cat) {
  return `#/c/${encodeURIComponent(cat)}`
}

export function searchHref(q) {
  return `#/search?q=${encodeURIComponent(q)}`
}
