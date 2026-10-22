import Link from 'next/link';

export const metadata = {
  title: 'Страница не найдена — Alex Play',
};

export default function NotFound() {
  return (
    <div className="notfound">
      <span className="notfound-emoji">🫥</span>
      <h1>404 — Страница не найдена</h1>
      <p>Такой страницы или приложения не существует.</p>
      <Link href="/" className="btn btn-primary">
        На главную
      </Link>
    </div>
  );
}
