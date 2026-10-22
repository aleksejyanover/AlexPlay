// Кнопки загрузки по платформам (сетка 2×2): iPhone — акцентная, остальные — контурные.
// Данные — app.links { ios, android, mac, windows }. Пустая ссылка → неактивная кнопка «Скоро».
const PLATFORMS = [
  { key: 'ios', label: 'Загрузить для iPhone', icon: '', primary: true },
  { key: 'android', label: 'Скачать для Android', icon: '🤖' },
  { key: 'mac', label: 'Скачать для Mac', icon: '🍎' },
  { key: 'windows', label: 'Скачать для Windows', icon: '🪟' },
];

export default function DownloadButtons({ links }) {
  const L = links || {};
  return (
    <div>
      <div className="dl-grid">
        {PLATFORMS.map(({ key, label, icon, primary }) => {
          const cls = `btn ${primary ? 'btn-primary' : 'btn-outline'}`;
          const text = icon ? `${icon} ${label}` : label;
          return L[key] ? (
            <a
              key={key}
              href={L[key]}
              target="_blank"
              rel="noopener noreferrer"
              className={cls}
            >
              {text}
            </a>
          ) : (
            <button key={key} className={`${cls} btn-soon`} disabled>
              {text}
            </button>
          );
        })}
      </div>
      <div className="dl-note">Доступно на iPhone, Android, Mac и Windows</div>
    </div>
  );
}
