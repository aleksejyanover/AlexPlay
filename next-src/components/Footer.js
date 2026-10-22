import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          © 2026 <strong>Alex Play</strong> — магазин приложений для iPhone и
          Android
        </div>
        <nav className="footer-links">
          <Link href="/about/">О проекте</Link>
          <Link href="/developers/">Разработчикам</Link>
          <Link href="/privacy/">Политика конфиденциальности</Link>
          <Link href="/support/">Поддержка</Link>
        </nav>
      </div>
    </footer>
  );
}
