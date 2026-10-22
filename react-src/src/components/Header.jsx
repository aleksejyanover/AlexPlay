import { useRoute } from '../router.js'

export default function Header({ query, onQueryChange }) {
  const route = useRoute()

  function submit(e) {
    e.preventDefault()
  }

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#/" className="logo">
          <span className="logo-tile">▶</span>
          <span className="logo-text">
            Alex <span className="logo-accent">Play</span>
          </span>
        </a>

        <form className="search" onSubmit={submit} role="search">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Поиск приложений и игр"
            aria-label="Поиск приложений"
          />
        </form>

        <nav className="nav">
          <a href="#/" className={route.name === 'home' ? 'active' : ''}>
            Главная
          </a>
          <a href="#/c/Игры" className={route.name === 'category' ? 'active' : ''}>
            Категории
          </a>
        </nav>
      </div>
    </header>
  )
}
