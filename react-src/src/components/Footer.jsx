export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="logo-tile small">▶</span>
          <span>Alex Play</span>
        </div>
        <nav className="footer-links">
          <a href="#/about">О проекте</a>
          <a href="#/developers">Разработчикам</a>
          <a href="#/privacy">Политика конфиденциальности</a>
          <a href="#/support">Поддержка</a>
        </nav>
        <p className="footer-copy">© 2026 Alex Play. Приложения для iPhone и Android.</p>
      </div>
    </footer>
  )
}
