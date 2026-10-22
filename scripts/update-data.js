/* Обновление shared/apps.json: платформенные ссылки + приложения автора */
const fs = require("fs");
const P = "/Users/alexey/alexplay/shared/apps.json";
const apps = JSON.parse(fs.readFileSync(P, "utf8"));

// 1) старая схема appStore/apk -> links {ios, android, mac, windows}
for (const a of apps) {
  if (!a.links) {
    a.links = { ios: a.appStore || "", android: a.apk || "", mac: "", windows: "" };
    delete a.appStore;
    delete a.apk;
  }
}

// 2) приложения автора Alex Play
const U = {
  atrium: "https://aleksejyanover.github.io/atrium/",
  hotkeys: "https://aleksejyanover.github.io/hotkeys-trainer/",
  telefamily: "https://telefamily.telefamily.workers.dev",
  gta: "https://aleksejyanover.github.io/gta-alex/index.html",
  virus: "https://aleksejyanover.github.io/fake-virus-prank/",
  soundsmith: "http://localhost:8000/"
};
const all = u => ({ ios: u, android: u, mac: u, windows: u });

const author = [
  {
    id: "atrium", name: "Atrium — корпоративный мессенджер", dev: "Alex", emoji: "🏛️",
    grad: ["#FFB86B", "#FF7AC6"], category: "Бизнес", rating: 4.9, reviews: 1240,
    size: "Веб", age: "12+", version: "1.0", updated: "20 октября 2026 г.", price: "Бесплатно",
    desc: "Atrium — корпоративный мессенджер для организаций: каналы и личные сообщения, роли и договоры с подписью, звонки, история действий и кошелёк. Свой сервер, свои правила общения в команде.",
    shots: [
      { title: "Каналы", grad: ["#FFB86B", "#FF7AC6"] },
      { title: "Сообщения", grad: ["#FF7AC6", "#7C5CFF"] },
      { title: "Звонки", grad: ["#FFB86B", "#00D2FF"] },
      { title: "Договоры и кошелёк", grad: ["#7C5CFF", "#00D2FF"] }
    ],
    links: all(U.atrium), dist: [88, 8, 3, 1, 0],
    tags: ["мессенджер", "команда", "бизнес", "каналы"], added: "2026-10-19", author: true
  },
  {
    id: "telefamily", name: "TeleFamily — свой мессенджер", dev: "Alex", emoji: "💬",
    grad: ["#00D2FF", "#5B8CFF"], category: "Инструменты", rating: 4.8, reviews: 2130,
    size: "Веб", age: "4+", version: "1.0", updated: "20 октября 2026 г.", price: "Бесплатно",
    desc: "TeleFamily: сообщения, фото и видео, голосовые, кружки, звонки и видеозвонки, группы. Свой мессенджер со своим сервером — как Telegram, но полностью ваш.",
    shots: [
      { title: "Чаты", grad: ["#00D2FF", "#5B8CFF"] },
      { title: "Голосовые", grad: ["#5B8CFF", "#7C5CFF"] },
      { title: "Видеозвонки", grad: ["#00D2FF", "#00E5A0"] },
      { title: "Группы", grad: ["#7C5CFF", "#FF7AC6"] }
    ],
    links: all(U.telefamily), dist: [85, 10, 3, 1, 1],
    tags: ["мессенджер", "звонки", "чат", "свой сервер"], added: "2026-10-18", author: true
  },
  {
    id: "hotkeys-trainer", name: "Hotkeys Trainer", dev: "Alex", emoji: "⌨️",
    grad: ["#5B8CFF", "#00E5A0"], category: "Образование", rating: 4.9, reviews: 560,
    size: "Веб / Десктоп", age: "4+", version: "1.0", updated: "18 октября 2026 г.", price: "Бесплатно",
    desc: "Учебник, тренажёр и поиск горячих клавиш для macOS и Windows: 83 карточки, 4 режима тренажёра, прогресс и челленджи. Играй онлайн или скачай десктопное приложение.",
    shots: [
      { title: "83 карточки", grad: ["#5B8CFF", "#00E5A0"] },
      { title: "Тренажёр", grad: ["#00E5A0", "#FFD166"] },
      { title: "Челленджи", grad: ["#5B8CFF", "#7C5CFF"] }
    ],
    links: all(U.hotkeys), dist: [90, 7, 2, 0, 1],
    tags: ["горячие клавиши", "macos", "windows", "обучение"], added: "2026-10-17", author: true
  },
  {
    id: "gta-alex", name: "GTA Алекс — Все версии", dev: "Alex", emoji: "🚗",
    grad: ["#FFB86B", "#FF6B6B"], category: "Игры", rating: 4.7, reviews: 3400,
    size: "Веб", age: "12+", version: "1.0", updated: "15 октября 2026 г.", price: "Бесплатно",
    desc: "GTA Алекс — все версии легендарной игры в одном месте. Открывай классические части, проходи миссии и исследуй открытый мир прямо в браузере.",
    shots: [
      { title: "Все версии", grad: ["#FFB86B", "#FF6B6B"] },
      { title: "Геймплей", grad: ["#FF6B6B", "#7C5CFF"] },
      { title: "Открытый мир", grad: ["#FFB86B", "#7C5CFF"] }
    ],
    links: all(U.gta), dist: [76, 14, 6, 2, 2],
    tags: ["gta", "action", "приключения", "классика"], added: "2026-10-15", author: true
  },
  {
    id: "fake-virus-prank", name: "Средство восстановления системы", dev: "Alex", emoji: "🦠",
    grad: ["#FF6B6B", "#7C5CFF"], category: "Игры", rating: 4.5, reviews: 980,
    size: "Веб", age: "12+", version: "1.0", updated: "12 октября 2026 г.", price: "Бесплатно",
    desc: "Забавная шутка для друзей: реалистичный экран «восстановления системы» выглядит пугающе, но на самом деле ничего не ломает. Настрой сценарий и устраивай добрые пранки.",
    shots: [
      { title: "Запуск", grad: ["#FF6B6B", "#7C5CFF"] },
      { title: "Эффект", grad: ["#7C5CFF", "#00D2FF"] }
    ],
    links: all(U.virus), dist: [70, 16, 8, 4, 2],
    tags: ["пранк", "шутка", "развлечения"], added: "2026-10-12", author: true
  },
  {
    id: "soundsmith", name: "SoundSmith — создавай свою музыку", dev: "Alex", emoji: "🎹",
    grad: ["#7C5CFF", "#FF7AC6"], category: "Музыка", rating: 4.8, reviews: 720,
    size: "Веб", age: "4+", version: "1.0", updated: "22 октября 2026 г.", price: "Бесплатно",
    desc: "SoundSmith — бесплатный браузерный музыкальный конструктор: пианино, секвенсор мелодий, драм-машина и экспорт песни в WAV. Сочиняй музыку с любого устройства.",
    shots: [
      { title: "Пианино", grad: ["#7C5CFF", "#FF7AC6"] },
      { title: "Секвенсор", grad: ["#FF7AC6", "#FFB86B"] },
      { title: "Драм-машина", grad: ["#7C5CFF", "#00D2FF"] },
      { title: "Экспорт WAV", grad: ["#00D2FF", "#00E5A0"] }
    ],
    links: all(U.soundsmith), dist: [87, 9, 3, 1, 0],
    tags: ["музыка", "конструктор", "секвенсор", "творчество"], added: "2026-10-22", author: true
  }
];

// убираем дубли по id и ставим приложения автора первыми
const rest = apps.filter(a => !author.some(n => n.id === a.id));
const merged = [...author, ...rest];

fs.writeFileSync(P, JSON.stringify(merged, null, 2) + "\n");
fs.writeFileSync("/Users/alexey/alexplay/html/js/data.js",
  "/* Сгенерировано из shared/apps.json */\nwindow.APPS = " + JSON.stringify(merged, null, 2) + ";\n");
console.log("apps:", merged.length, "| автор:", merged.filter(a => a.author).length);
