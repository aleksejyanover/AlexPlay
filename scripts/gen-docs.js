/* Генерация информационных страниц Alex Play (html-вариант) */
const fs = require("fs");
const D = "/Users/alexey/alexplay/html/";

const shell = (title, body) => `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0B0F1A">
  <title>${title} — Alex Play</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%237C5CFF'/><text x='50' y='68' font-size='52' text-anchor='middle'>▶</text></svg>">
</head>
<body>
  <header class="hdr">
    <div class="wrap hdr-in">
      <a class="logo" href="index.html"><span class="logo-mark">▶</span><span><b>Alex</b> Play</span></a>
      <nav class="nav">
        <a href="index.html">Главная</a>
        <a href="index.html?cat=Игры">Игры</a>
        <a href="index.html?cat=Приложения">Приложения</a>
      </nav>
      <div class="search">
        <span class="ico">🔍</span>
        <input id="q" type="search" placeholder="Найти приложение или игру" autocomplete="off">
      </div>
    </div>
  </header>

  <main class="wrap doc">
${body}
  </main>

  <footer>
    <div class="wrap foot">
      <div>
        <a class="logo" href="index.html" style="margin-bottom:10px"><span class="logo-mark">▶</span><span><b>Alex</b> Play</span></a>
        <div class="copy">Приложения для iPhone и Android</div>
      </div>
      <div class="foot-links">
        <a href="about.html">О проекте</a>
        <a href="developers.html">Разработчикам</a>
        <a href="privacy.html">Политика конфиденциальности</a>
        <a href="support.html">Поддержка</a>
      </div>
      <div class="copy">© 2026 Alex Play</div>
    </div>
  </footer>

  <script>
    document.getElementById("q").addEventListener("keydown", function (e) {
      if (e.key === "Enter" && this.value.trim())
        location.href = "index.html?q=" + encodeURIComponent(this.value.trim());
    });
  </script>

  <nav class="mobile-nav">
    <a href="index.html"><span class="ico">🏠</span>Главная</a>
    <a href="index.html?cat=Игры"><span class="ico">🎮</span>Игры</a>
    <a href="index.html?cat=Приложения"><span class="ico">🧰</span>Приложения</a>
    <a href="index.html"><span class="ico">🔍</span>Поиск</a>
  </nav>
</body>
</html>
`;

const pages = {
  "about.html": ["О проекте", `
    <h1>О проекте</h1>
    <p class="lead">Alex Play — магазин приложений и игр для iPhone и Android с быстрым поиском, честными описаниями и удобным каталогом.</p>
    <h2>Что внутри</h2>
    <ul>
      <li>Каталог приложений и игр с поиском и категориями</li>
      <li>Скачивание на <b>iPhone, Android, Mac и Windows</b> — у каждого приложения страница со скриншотами, описанием, рейтингом и версией</li>
      <li>Раздел <b>«Создано автором Alex Play»</b> — авторские проекты создателя магазина</li>
      <li>Работает в браузере на любом устройстве, без установки</li>
    </ul>
    <h2>Платформы</h2>
    <p>Приложения из каталога доступны на iPhone (App Store), Android (APK), macOS и Windows. У некоторых приложений ссылки появляются позже — такие кнопки помечены «Скоро».</p>
    <p>Попробовать каталог: <a class="inline" href="index.html">вернуться на главную</a>.</p>`],

  "developers.html": ["Разработчикам", `
    <h1>Разработчикам</h1>
    <p class="lead">Хотите видеть своё приложение в Alex Play? Это просто.</p>
    <h2>Как добавить приложение</h2>
    <ul>
      <li>Пришлите ссылку на приложение (ссылка на App Store, APK-файл или сайт)</li>
      <li>Название, короткое описание (2–3 предложения) и категорию</li>
      <li>Скриншоты — 3–4 штуки (или мы подберём оформление сами)</li>
    </ul>
    <h2>Что важно знать</h2>
    <ul>
      <li>Приложение проверяется перед публикацией: работает ссылка, есть описание, нет вредоносного контента</li>
      <li>Публикация бесплатна</li>
      <li>Обновления версий и ссылок размещаются автоматически</li>
    </ul>
    <p>Заявки и вопросы — через <a class="inline" href="support.html">страницу поддержки</a>.</p>`],

  "privacy.html": ["Политика конфиденциальности", `
    <h1>Политика конфиденциальности</h1>
    <p class="lead">Последнее обновление: 22 октября 2026 г.</p>
    <h2>Какие данные мы собираем</h2>
    <p>Alex Play — статический каталог приложений. Мы <b>не собираем</b> персональные данные, не используем аккаунты и не храним платёжную информацию.</p>
    <h2>Поиск и аналитика</h2>
    <p>Поиск работает прямо в вашем браузере: запросы никуда не отправляются. Анонимная статистика посещений может собираться хостингом (GitHub Pages) в обезличенном виде.</p>
    <h2>Ссылки на сторонние ресурсы</h2>
    <p>Кнопки загрузки ведут на внешние сайты (App Store, сайты и файлы приложений). Их правила конфиденциальности определяются владельцами этих ресурсов.</p>
    <h2>Контакты</h2>
    <p>Вопросы о данных — через <a class="inline" href="support.html">поддержку</a>.</p>`],

  "support.html": ["Поддержка", `
    <h1>Поддержка</h1>
    <p class="lead">Мы на связи и помогаем с любыми вопросами по Alex Play.</p>
    <h2>С чем помогаем</h2>
    <ul>
      <li>Не скачивается или не открывается приложение</li>
      <li>Ошибка в описании или нерабочая ссылка</li>
      <li>Предложение по улучшению каталога</li>
    </ul>
    <h2>Как связаться</h2>
    <ul>
      <li>GitHub: <a class="inline" href="https://github.com/aleksejyanover/AlexPlay" target="_blank" rel="noopener noreferrer">github.com/aleksejyanover/AlexPlay</a> — Issues</li>
      <li>Владелец проекта: <b>aleksejyanover</b></li>
    </ul>
    <p>Обычно отвечаем в течение 1–2 дней.</p>`]
};

for (const [file, [title, body]] of Object.entries(pages)) {
  fs.writeFileSync(D + file, shell(title, body));
}
console.log("created:", Object.keys(pages).join(", "));
