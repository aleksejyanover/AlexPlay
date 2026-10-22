// Градиентная «плитка»-иконка приложения (без внешних картинок).
export default function Tile({ app, size = 'sm' }) {
  const cls = size === 'lg' ? 'tile tile-lg' : 'tile tile-sm';
  return (
    <div
      className={cls}
      style={{
        background: `linear-gradient(135deg, ${app.grad[0]}, ${app.grad[1]})`,
      }}
      aria-hidden="true"
    >
      {app.emoji}
    </div>
  );
}
