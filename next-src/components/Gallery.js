'use client';

// Галерея скриншотов — горизонтальный скролл плиток 9:16 (CSS-градиенты + emoji).
export default function Gallery({ shots, emoji }) {
  return (
    <div className="shots" role="list" aria-label="Скриншоты">
      {shots.map((s, i) => (
        <div
          key={i}
          role="listitem"
          className="shot"
          style={{
            background: `linear-gradient(160deg, ${s.grad[0]}, ${s.grad[1]})`,
          }}
        >
          <span className="shot-emoji">{emoji}</span>
          <span className="shot-title">{s.title}</span>
        </div>
      ))}
    </div>
  );
}
