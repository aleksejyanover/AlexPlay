import { useEffect, useRef, useState } from 'react'

// Простейший hash-роутер:
// #/ , #/app/:id , #/c/:cat , #/search?q=... , #/about , #/developers , #/privacy , #/support
export function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [pathPart, queryPart] = raw.split('?')
  const segments = pathPart.split('/').filter(Boolean)
  const params = new URLSearchParams(queryPart || '')

  if (segments[0] === 'app' && segments[1]) {
    return { name: 'app', id: decodeURIComponent(segments[1]) }
  }
  if (segments[0] === 'c' && segments[1]) {
    return { name: 'category', cat: decodeURIComponent(segments[1]) }
  }
  if (segments[0] === 'search') {
    return { name: 'search', q: params.get('q') || '' }
  }
  if (segments[0] === 'about') return { name: 'about' }
  if (segments[0] === 'developers') return { name: 'developers' }
  if (segments[0] === 'privacy') return { name: 'privacy' }
  if (segments[0] === 'support') return { name: 'support' }
  return { name: 'home' }
}

export function useRoute() {
  const [route, setRoute] = useState(parseHash)
  const prevPath = useRef((window.location.hash.replace(/^#/, '') || '/').split('?')[0])

  useEffect(() => {
    const onChange = () => {
      const path = (window.location.hash.replace(/^#/, '') || '/').split('?')[0]
      if (path !== prevPath.current) {
        prevPath.current = path
        window.scrollTo({ top: 0 })
      }
      setRoute(parseHash())
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

// Замена текущей записи истории (без спама в истории при живом поиске)
export function navigate(hash) {
  if (window.location.hash !== hash) {
    window.location.replace(hash)
  }
}
