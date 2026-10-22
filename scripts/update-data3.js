/* Добавление популярных игр + платные мессенджеры */
const fs = require("fs");
const P = "/Users/alexey/alexplay/shared/apps.json";
const apps = JSON.parse(fs.readFileSync(P, "utf8"));

const web = u => ({ ios: u + "download", android: u + "download", mac: u + "download", windows: u + "download", web: u });

const GAMES = [
  {
    id: "roblox", name: "Roblox", dev: "Roblox Corporation", emoji: "🧱",
    grad: ["#FF6B6B", "#7C5CFF"], category: "Игры", rating: 4.5, reviews: 892000,
    size: "250 МБ", age: "12+", version: "2.671.1065", updated: "21 октября 2026 г.", price: "Бесплатно",
    desc: "Roblox — огромная платформа с миллионами пользовательских игр: паркур, ролевые миры, симуляторы и хорроры. Создавай свои миры или играй с друзьями на телефоне и компьютере.",
    shots: [{ title: "Миры", grad: ["#FF6B6B", "#7C5CFF"] }, { title: "Играй с друзьями", grad: ["#7C5CFF", "#00D2FF"] }, { title: "Своя игра", grad: ["#FF6B6B", "#FFD166"] }],
    links: web("https://www.roblox.com/"), dist: [72, 17, 6, 3, 2],
    tags: ["песочница", "онлайн", "ролевая", "с друзьями"], added: "2026-08-10"
  },
  {
    id: "minecraft", name: "Minecraft", dev: "Mojang Studios", emoji: "⛏️",
    grad: ["#6FBF3B", "#00D2FF"], category: "Игры", rating: 4.8, reviews: 1250000,
    size: "900 МБ", age: "6+", version: "1.22.0", updated: "10 октября 2026 г.", price: "699 ₽",
    desc: "Minecraft — легендарная игра о кубическом мире: стройте, добывайте ресурсы, исследуйте пещеры и выживайте в одиночку или с друзьями. Творческий режим и бесконечные миры.",
    shots: [{ title: "Стройство", grad: ["#6FBF3B", "#00D2FF"] }, { title: "Выживание", grad: ["#6FBF3B", "#FFD166"] }, { title: "Миры", grad: ["#00D2FF", "#7C5CFF"] }],
    links: web("https://www.minecraft.net/"), dist: [84, 11, 3, 1, 1],
    tags: ["крафт", "выживание", "песочница", "строительство"], added: "2026-07-15"
  },
  {
    id: "brawl-stars", name: "Brawl Stars", dev: "Supercell", emoji: "🎯",
    grad: ["#FFD166", "#FF7AC6"], category: "Игры", rating: 4.6, reviews: 456000,
    size: "310 МБ", age: "7+", version: "62.186", updated: "18 октября 2026 г.", price: "Бесплатно",
    desc: "Brawl Stars — командные бои 3 на 3 и режимы «Смертельная битва» и «Захват флажка». Десятки бойцов, карты и сезонные события. Матчи длятся всего пару минут.",
    shots: [{ title: "3 на 3", grad: ["#FFD166", "#FF7AC6"] }, { title: "Бойцы", grad: ["#FF7AC6", "#7C5CFF"] }, { title: "Сезоны", grad: ["#FFD166", "#00D2FF"] }],
    links: web("https://supercell.com/en/games/brawlstars/"), dist: [75, 15, 6, 2, 2],
    tags: ["аркада", "команда", "мульттиплеер", "для детей"], added: "2026-06-05"
  },
  {
    id: "candy-crush", name: "Candy Crush Saga", dev: "King", emoji: "🍬",
    grad: ["#FF7AC6", "#FFB86B"], category: "Игры", rating: 4.7, reviews: 987000,
    size: "180 МБ", age: "4+", version: "1.3000.3.0", updated: "16 октября 2026 г.", price: "Бесплатно",
    desc: "Candy Crush Saga — знаменитая головоломка с конфетами: соединяйте три и больше, проходите сотни уровней и соревнуйтесь с друзьями. Игра offline и без спешки.",
    shots: [{ title: "Уровни", grad: ["#FF7AC6", "#FFB86B"] }, { title: "Комбо", grad: ["#FFB86B", "#FFD166"] }, { title: "Бустеры", grad: ["#FF7AC6", "#7C5CFF"] }],
    links: web("https://candycrush.com/"), dist: [80, 13, 4, 2, 1],
    tags: ["головоломка", "три в ряд", "казуальная", "offline"], added: "2026-05-20"
  },
  {
    id: "pubg-mobile", name: "PUBG Mobile", dev: "Level Infinite", emoji: "🪖",
    grad: ["#FFB86B", "#5B8CFF"], category: "Игры", rating: 4.4, reviews: 734000,
    size: "1500 МБ", age: "12+", version: "3.9.0", updated: "14 октября 2026 г.", price: "Бесплатно",
    desc: "PUBG Mobile — королевская битва на 100 игроков: ищите оружие, держитесь в зоне и оставайтесь последним. Реалистичные карты, транспорт и рейтинговые сезоны.",
    shots: [{ title: "Прыжок", grad: ["#FFB86B", "#5B8CFF"] }, { title: "Бой", grad: ["#5B8CFF", "#FF6B6B"] }, { title: "Победа", grad: ["#FFD166", "#00E5A0"] }],
    links: web("https://www.pubg.com/"), dist: [69, 18, 7, 4, 2],
    tags: ["шутер", "королевская битва", "онлайн", "команда"], added: "2026-04-30"
  },
  {
    id: "among-us", name: "Among Us", dev: "Innersloth", emoji: "👾",
    grad: ["#FF6B6B", "#00D2FF"], category: "Игры", rating: 4.5, reviews: 321000,
    size: "85 МБ", age: "12+", version: "2026.10.22", updated: "9 октября 2026 г.", price: "149 ₽",
    desc: "Among Us — игра на доверие и предательство: экипаж выполняет задачи на корабле, пока среди них прячется предатель. Играйте с друзьями по сети на 10–15 игроков.",
    shots: [{ title: "Задачи", grad: ["#FF6B6B", "#00D2FF"] }, { title: "Совещание", grad: ["#00D2FF", "#7C5CFF"] }, { title: "Предатель", grad: ["#FF6B6B", "#7C5CFF"] }],
    links: web("https://www.innersloth.com/games/among-us/"), dist: [74, 16, 6, 3, 1],
    tags: ["детектив", "мульттиплеер", "party", "обман"], added: "2026-03-15"
  },
  {
    id: "genshin-impact", name: "Genshin Impact", dev: "HoYoverse", emoji: "⚔️",
    grad: ["#5B8CFF", "#00E5A0"], category: "Игры", rating: 4.7, reviews: 645000,
    size: "850 МБ", age: "12+", version: "6.2", updated: "13 октября 2026 г.", price: "Бесплатно",
    desc: "Genshin Impact — открытый мир Тейват с красивой анимационной графикой, стихийной боевой системой и десятками героев. Квесты, подземелья и исследование на телефоне и ПК.",
    shots: [{ title: "Тейват", grad: ["#5B8CFF", "#00E5A0"] }, { title: "Герои", grad: ["#7C5CFF", "#FF7AC6"] }, { title: "Бой", grad: ["#5B8CFF", "#FFB86B"] }],
    links: web("https://genshin.hoyoverse.com/"), dist: [78, 14, 5, 2, 1],
    tags: ["rpg", "открытый мир", "аниме", "приключения"], added: "2026-02-10"
  },
  {
    id: "clash-royale", name: "Clash Royale", dev: "Supercell", emoji: "👑",
    grad: ["#FFD166", "#5B8CFF"], category: "Игры", rating: 4.6, reviews: 512000,
    size: "340 МБ", age: "7+", version: "7.0.1", updated: "17 октября 2026 г.", price: "Бесплатно",
    desc: "Clash Royale — стратегия в реальном времени: собирайте колоду из карточек, сражайтесь за башни в трёх минутных боях и поднимайтесь в лигах. Кланы и сезонные награды.",
    shots: [{ title: "Бой", grad: ["#FFD166", "#5B8CFF"] }, { title: "Колода", grad: ["#5B8CFF", "#7C5CFF"] }, { title: "Лиги", grad: ["#FFD166", "#FF7AC6"] }],
    links: web("https://supercell.com/en/games/clashroyale/"), dist: [76, 15, 5, 2, 2],
    tags: ["стратегия", "карты", "мульттиплеер", "дуэли"], added: "2026-01-20"
  }
];

// платные мессенджеры автора
for (const a of apps) {
  if (a.id === "atrium") a.price = "990 ₽";
  if (a.id === "telefamily") a.price = "499 ₽";
}

const existing = new Set(apps.map(a => a.id));
const added = GAMES.filter(g => !existing.has(g.id));
const out = [...apps.filter(a => a.id !== "atrium" && a.id !== "telefamily"),
  ...apps.filter(a => a.id === "atrium" || a.id === "telefamily"),
  ...added];

fs.writeFileSync(P, JSON.stringify(out, null, 2) + "\n");
console.log("добавлено игр:", added.map(g => g.id).join(", ") || "нет", "| всего:", out.length);
