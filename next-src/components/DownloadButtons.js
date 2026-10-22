'use client';

// Действия на странице приложения:
// 1) главная кнопка «🌐 Открыть в браузере» (links.web — сам проект в браузере), акцентная, во всю ширину;
// 2) ниже — сетка 2×2 платформенных кнопок (links.ios/android/mac/windows), контурные.
// Пустая ссылка → неактивная кнопка с пометкой «Скоро».
// Клик по любой активной кнопке фиксирует «первый запуск» (localStorage) и открывает форму отзыва.

import { useEffect } from 'react';

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

export default function DownloadButtons({ appId, links }) {
  const L = links || {};

  // Если запуск уже был отмечен (например, в другой вкладке) — обновим и текущую.
  useEffect(() => {
    if (appId && localStorage.getItem(`alexplay_launch_${appId}`)) {
      window.dispatchEvent(
        new CustomEvent('alexplay-launch', { detail: { id: appId } })
      );
    }
  }, [appId]);

  function markLaunch() {
    if (!appId) return;
    try {
      localStorage.setItem(`alexplay_launch_${appId}`, '1');
    } catch {
      /* приватный режим — просто оповестим без сохранения */
    }
    window.dispatchEvent(
      new CustomEvent('alexplay-launch', { detail: { id: appId } })
    );
  }

  return (
    <div>
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
