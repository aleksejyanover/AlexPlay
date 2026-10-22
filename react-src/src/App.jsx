import { useCallback, useEffect, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import MobileNav from './components/MobileNav.jsx'
import Home from './pages/Home.jsx'
import AppPage from './pages/AppPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import DevelopersPage from './pages/DevelopersPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import { useRoute, navigate } from './router.js'
import { APPS } from './utils.js'

export default function App() {
  const route = useRoute()
  const [query, setQuery] = useState('')
  const typing = useRef(false)

  // Синхронизируем строку поиска с hash-роутом
  useEffect(() => {
    if (route.name === 'search') {
      if (!typing.current) setQuery(route.q)
    } else if (!typing.current) {
      setQuery('')
    }
    typing.current = false
  }, [route])

  const onQueryChange = useCallback((value) => {
    typing.current = true
    setQuery(value)
    const q = value.trim()
    if (q) {
      navigate(`#/search?q=${encodeURIComponent(q)}`)
    } else {
      // вернуться на главную, если стёрли поиск
      navigate('#/')
    }
  }, [])

  let page
  if (route.name === 'app') {
    const app = APPS.find((a) => a.id === route.id)
    page = app ? (
      <AppPage key={app.id} app={app} />
    ) : (
      <div className="empty">
        <div className="empty-emoji">❓</div>
        <h2>Приложение не найдено</h2>
        <p className="muted">
          Возможно, оно было удалено. <a href="#/">Вернуться на главную</a>.
        </p>
      </div>
    )
  } else if (route.name === 'category') {
    page = <CategoryPage key={route.cat} cat={route.cat} />
  } else if (route.name === 'search') {
    page = <SearchPage q={route.q} />
  } else if (route.name === 'about') {
    page = <AboutPage />
  } else if (route.name === 'developers') {
    page = <DevelopersPage />
  } else if (route.name === 'privacy') {
    page = <PrivacyPage />
  } else if (route.name === 'support') {
    page = <SupportPage />
  } else {
    page = <Home />
  }

  return (
    <div className="app-shell">
      <Header query={query} onQueryChange={onQueryChange} />
      <main className="container main">{page}</main>
      <Footer />
      <MobileNav />
    </div>
  )
}
