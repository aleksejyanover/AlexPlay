import { useRoute, navigate } from '../router.js'

/* Мобильная нижняя навигация (только телефон, ≤640px).
   Разметка — как в эталоне html/index.html: 🏠 Главная, 🎮 Игры, 🧰 Приложения, 🔍 Поиск. */
export default function MobileNav() {
  const route = useRoute()

  const onHome = route.name === 'home'
  const onGames = route.name === 'category' && route.cat === 'Игры'
  const onApps = route.name === 'category' && route.cat === 'Приложения'

  /* «Поиск» — на главную с фокусом в строке поиска */
  function onSearch(e) {
    e.preventDefault()
    navigate('#/')
    setTimeout(() => {
      const input = document.querySelector('.search input')
      input?.focus()
      input?.scrollIntoView({ block: 'nearest' })
    }, 60)
  }

  return (
    <nav className="mobile-nav">
      <a href="#/" className={onHome ? 'on' : ''}>
        <span className="ico">🏠</span>Главная
      </a>
      <a href="#/c/Игры" className={onGames ? 'on' : ''}>
        <span className="ico">🎮</span>Игры
      </a>
      <a href="#/c/Приложения" className={onApps ? 'on' : ''}>
        <span className="ico">🧰</span>Приложения
      </a>
      <a href="#/" onClick={onSearch}>
        <span className="ico">🔍</span>Поиск
      </a>
    </nav>
  )
}
