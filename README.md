# Alex Play

Магазин приложений в стиле Google Play — для **iPhone, Android, Mac и Windows**.
Сайт: https://aleksejyanover.github.io/AlexPlay/

Единственная версия сайта — чистый HTML/CSS/JS (варианты React и Next.js были удалены по решению автора; они остались в истории git).

## Структура репозитория

| Путь | Что это |
|---|---|
| `index.html` | Главная страница магазина |
| `app.html` | Страница приложения (описание, скриншоты, отзывы, покупка) |
| `about.html`, `developers.html`, `privacy.html`, `support.html` | Информационные страницы |
| `css/`, `js/` | Стили и скрипты (`js/data.js` — каталог приложений) |
| `404.html` | Редирект старых адресов (`/html/…`, `/react/…`, `/next/…`) на корень |
| `shared/apps.json` | **Единый каталог приложений** — источник правды |
| `SPEC.md` | Дизайн-система и техническое задание |
| `scripts/` | Утилиты генерации (данные, информационные страницы) |

## Как добавить или изменить приложение

1. Отредактируй `shared/apps.json`:
   - `links: { ios, android, mac, windows, web }` — ссылки по платформам (пустая строка = кнопка «Скоро»);
   - `price` — цена для платных приложений (или «Бесплатно»);
   - `author: true` — пометить приложение как «Создано автором Alex Play».
2. Перегенерируй данные:
   ```bash
   node scripts/update-data.js    # перегенерация js/data.js из shared/apps.json
   ```
3. Закоммить и запушь — GitHub Pages опубликует автоматически.

## Публикация

GitHub Pages с ветки `main`, корень репозитория: https://aleksejyanover.github.io/AlexPlay/

Файл `.nojekyll` обязателен — иначе GitHub Pages (Jekyll) отфильтрует служебные пути.
