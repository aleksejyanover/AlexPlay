# Alex Play

Магазин приложений в стиле Google Play — для **iPhone, Android, Mac и Windows**.
Сайт: https://aleksejyanover.github.io/AlexPlay/

## Структура репозитория

| Путь | Что это |
|---|---|
| `index.html` | Главная-переключатель между тремя версиями сайта |
| `html/` | Вариант 1: чистый HTML/CSS/JS |
| `react/` | Вариант 2: React (Vite), собранная версия (`react-src/` — исходники) |
| `next/` | Вариант 3: Next.js, static export (`next-src/` — исходники) |
| `shared/apps.json` | **Единый каталог приложений** — источник правды для всех трёх версий |
| `SPEC.md` | Дизайн-система и техническое задание |
| `scripts/` | Утилиты генерации (данные, информационные страницы) |

## Как добавить или изменить приложение

1. Отредактируй `shared/apps.json`:
   - `links: { ios, android, mac, windows }` — ссылки загрузки по платформам (пустая строка = кнопка «Скоро»);
   - `author: true` — пометить приложение как «Создано автором Alex Play».
2. Обнови копии данных:
   ```bash
   node scripts/update-data.js                       # перегенерация html/js/data.js
   cp shared/apps.json react-src/src/apps.json
   cp shared/apps.json next-src/data/apps.json
   ```
3. Пересобери нужную версию (`npm run build` в `react-src/` или `next-src/`) и закоммить.

## Публикация

GitHub Pages с ветки `main`, корень репозитория: https://aleksejyanover.github.io/AlexPlay/
