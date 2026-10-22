'use client';

// Действия на странице приложения:
// - платное и НЕ куплено → кнопка «💳 Купить за {price}» → демо-оплата (PayModal);
// - куплено (или бесплатное) → «🌐 Открыть в браузере» + сетка 4 платформ (все контурные).
// Пустая ссылка → неактивная кнопка с пометкой «Скоро».
// Клик по любой активной кнопке открытия/скачивания фиксирует «первый запуск»
// (localStorage alexplay_launch_<id>) и открывает форму отзыва; кнопка «Купить» его не ставит.
// Состояние покупки (alexplay_paid_<id>) читается в useEffect — гидратация не ломается.

import { useEffect, useState } from 'react';
import PayModal from './PayModal';

const PLATFORMS = [
  { key: 'ios', label: 'Загрузить для iPhone', icon: '' },
  { key: 'android', label: 'Скачать для Android', icon: '🤖' },
  { key: 'mac', label: 'Скачать для Mac', icon: '🍎' },
  { key: 'windows', label: 'Скачать для Windows', icon: '🪟' },
];

function ActionBtn({ href, className, icon, label, onLaunch }) {
  const text = icon ? `${icon} ${label}` : label;
  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={onLaunch}
    >
      {text}
    </a>
  ) : (
    <button className={`${className} btn-soon`} disabled>
      {text}
    </button>
  );
}

export default function DownloadButtons({ app }) {
  const L = app.links || {};
  const isPaidApp = app.price !== 'Бесплатно';

  // Стартовый рендер — «не куплено» (как на сервере), затем синхронизация.
  const [owned, setOwned] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(`alexplay_paid_${app.id}`)) setOwned(true);
    // Если запуск уже был отмечен (например, в другой вкладке) — обновим и текущую.
    if (localStorage.getItem(`alexplay_launch_${app.id}`)) {
      window.dispatchEvent(
        new CustomEvent('alexplay-launch', { detail: { id: app.id } })
      );
    }
  }, [app.id]);

  function markLaunch() {
    try {
      localStorage.setItem(`alexplay_launch_${app.id}`, '1');
    } catch {
      /* приватный режим — просто оповестим без сохранения */
    }
    window.dispatchEvent(
      new CustomEvent('alexplay-launch', { detail: { id: app.id } })
    );
  }

  // Платное приложение до покупки — только кнопка покупки.
  if (isPaidApp && !owned) {
    return (
      <div>
        <button
          className="btn btn-primary"
          onClick={() => setPayOpen(true)}
        >
          💳 Купить за {app.price}
        </button>
        <div className="plat-label">
          После покупки откроются кнопки «Открыть в браузере» и загрузки на все
          платформы
        </div>
        {payOpen && (
          <PayModal
            app={app}
            onClose={() => setPayOpen(false)}
            onPaid={() => setOwned(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      {isPaidApp && (
        <div
          className="buy-hint"
          style={{ color: 'var(--green)', fontWeight: 700 }}
        >
          ✓ Покупка завершена — приложение доступно
        </div>
      )}

      <ActionBtn
        href={L.web}
        className="btn btn-primary btn-block"
        icon="🌐"
        label="Открыть в браузере"
        onLaunch={markLaunch}
      />

      <div className="dl-grid">
        {PLATFORMS.map(({ key, label, icon }) => (
          <ActionBtn
            key={key}
            href={L[key]}
            className="btn btn-ghost"
            icon={icon}
            label={label}
            onLaunch={markLaunch}
          />
        ))}
      </div>
      <div className="dl-note">
        Или скачайте на iPhone, Android, Mac и Windows
      </div>
    </div>
  );
}
