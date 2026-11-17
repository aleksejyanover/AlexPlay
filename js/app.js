/* ============ Alex Play — главная страница ============ */
(function () {
  const APPS = window.APPS || [];
  const CATS = ["Все", ...Array.from(new Set(APPS.map(a => a.category)))];
  const SPECIAL = { "Игры": a => a.category === "Игры", "Приложения": a => a.category !== "Игры" };

  const $ = s => document.querySelector(s);
  const content = $("#content");
  const qInput = $("#q");

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + " тыс." : String(n);

  function tile(a, size) {
    return `<span class="tile tile-${size}" style="background:linear-gradient(135deg,${a.grad[0]},${a.grad[1]})">${a.emoji}</span>`;
  }

  function stars(r) {
    return "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));
  }

  /* цена с учётом тарифа (VIP/Premium/админ) */
  function priceTag(a) {
    if (a.price === "Бесплатно") return `<span class="cat-tag">${esc(a.category)}</span>`;
    const p = AP.priceFor(a);
    if (p.free) return `<span class="price-tag free">🎁 даром</span>`;
    if (p.old) return `<span class="price-tag disc"><s>${esc(p.old)}</s>${esc(p.now)}</span>`;
    return `<span class="price-tag">${esc(a.price)}</span>`;
  }

  function card(a) {
    return `
      <a class="card" href="app.html?id=${encodeURIComponent(a.id)}">
        ${a.author ? `<span class="badge-author">✦ Alex Play</span>` : ""}
        <div class="card-top">
          ${tile(a, 64)}
          <div>
            <div class="card-name">${esc(a.name)}</div>
            <div class="card-dev">${esc(a.dev)}</div>
          </div>
        </div>
        <div class="card-foot">
          <span class="rating"><span class="star">★</span>${a.rating.toFixed(1)} <span class="cnt">(${fmt(a.reviews)})</span></span>
          ${priceTag(a)}
        </div>
      </a>`;
  }

  function section(title, apps, href) {
    if (!apps.length) return "";
    return `
      <section class="section">
        <div class="section-hd">
          <h2>${title}</h2>
          ${href ? `<a class="more" href="${href}">Смотреть все →</a>` : ""}
        </div>
        <div class="row-wrap"><div class="row">${apps.map(card).join("")}</div></div>
      </section>`;
  }

  function hero(a) {
    return `
      <section class="hero">
        <div>
          <span class="hero-badge">★ Приложение недели</span>
          <h1>${esc(a.name)}</h1>
          <p>${esc(a.desc)}</p>
          <div class="hero-meta">
            <a class="btn btn-primary" href="app.html?id=${encodeURIComponent(a.id)}">Открыть</a>
            <span class="rating"><span class="star">★</span>${a.rating.toFixed(1)} <span class="cnt">(${fmt(a.reviews)} отзывов)</span></span>
            <span class="cat-tag">${esc(a.category)} · ${esc(a.price)}</span>
          </div>
        </div>
        <div class="hero-art" style="background:linear-gradient(135deg,${a.grad[0]},${a.grad[1]})">${a.emoji}</div>
      </section>`;
  }

  function chipsHTML(active) {
    return CATS.map(c => {
      const on = c === active ? " on" : "";
      const href = c === "Все" ? "./" : `?cat=${encodeURIComponent(c)}`;
      return `<a class="chip${on}" href="${href}">${c}</a>`;
    }).join("");
  }

  function authorBand() {
    const list = APPS.filter(a => a.author);
    if (!list.length) return "";
    return `
      <section class="author-band">
        <div class="author-band-hd">
          <span class="author-photo">▶</span>
          <div>
            <div class="t">Создано автором Alex Play</div>
            <div class="s">Собственные проекты автора магазина — уже здесь</div>
          </div>
          <span class="author-seal">✦ Создана автором Alex Play</span>
        </div>
        <div class="grid">${list.map(card).join("")}</div>
      </section>`;
  }

  /* полоса-баннер: гостям/без подписки — предложение тарифов, участникам — статус */
  function promoStrip() {
    const t = AP.tier();
    if (t === "guest" || t === "free") {
      return `
        <a class="promo-strip" href="plans.html">
          <span class="ps-ico">⭐</span>
          <span class="ps-txt"><b>VIP-клуб Alex Play</b><br>
            <span class="ps-sub">Игры выходят первыми и со скидкой 40% · Premium — ещё больше привилегий</span></span>
          <span class="ps-go">Тарифы →</span>
        </a>`;
    }
    if (t === "admin") return `<div class="promo-strip member admin">🛡 <b>ALEX</b> — главный аккаунт: в магазине всё бесплатно, включены все привилегии Premium</div>`;
    if (t === "premium") return `<div class="promo-strip member premium">👑 <b>Premium активна</b> — скидка 40% на игры, 20% на приложения, игры и новинки первыми</div>`;
    if (t === "vip") return `<div class="promo-strip member vip">⭐ <b>VIP активна</b> — игры выходят первыми, скидка 40% на все игры</div>`;
    return "";
  }

  function renderHome() {
    const byReviews = [...APPS].sort((x, y) => y.reviews - x.reviews);
    const byNew = [...APPS].sort((x, y) => y.added.localeCompare(x.added));
    const byRating = [...APPS].sort((x, y) => y.rating - x.rating);
    const featured = byRating[0];
    const games = APPS.filter(a => a.category === "Игры");
    const apps = APPS.filter(a => a.category !== "Игры");
    const paid = APPS.filter(a => a.price !== "Бесплатно");

    /* порядок секций по тарифу: VIP/Premium — игры первыми; Premium — и новинки сразу после игр */
    const rows = [
      ["Популярные", byReviews.slice(0, 10), null],
      ["Платные", paid, null],
      ["Новинки", byNew.slice(0, 8), null],
      ["Топ по рейтингу", byRating.slice(0, 8), null],
      ["Игры", games, "?cat=Игры"],
      ["Приложения", apps.slice(0, 10), "?cat=Приложения"]
    ];
    const t = AP.tier();
    if (t === "vip" || t === "premium" || t === "admin") {
      const gi = rows.findIndex(r => r[0] === "Игры");
      rows.unshift(rows.splice(gi, 1)[0]);
      if (t === "premium" || t === "admin") {
        const ni = rows.findIndex(r => r[0] === "Новинки");
        rows.splice(1, 0, rows.splice(ni, 1)[0]);
      }
    }

    $("#chips").innerHTML = chipsHTML("Все");
    content.innerHTML =
      hero(featured) +
      promoStrip() +
      authorBand() +
      rows.map(r => section(r[0], r[1], r[2])).join("");
  }

  function renderCategory(cat) {
    const test = SPECIAL[cat] || (a => a.category === cat);
    const list = APPS.filter(test);
    $("#chips").innerHTML = chipsHTML(CATS.includes(cat) ? cat : null);
    content.innerHTML = `
      <section class="section" style="margin-top:26px">
        <div class="section-hd"><h2>${esc(cat)}</h2>
          <span class="cat-tag">${list.length} ${plural(list.length, "приложение", "приложения", "приложений")}</span>
        </div>
        ${list.length
          ? `<div class="grid">${list.map(card).join("")}</div>`
          : emptyHTML("Здесь пока пусто", "В этой категории ещё нет приложений.")}
      </section>`;
  }

  function renderSearch(q) {
    const ql = q.toLowerCase();
    const q3 = ql.length >= 3 ? ql.slice(0, 3) : ql;
    /* совпадение по подстроке или по началу слова (помогает со склонениями: «игра» → «игры») */
    const hit = str => {
      const words = str.toLowerCase().split(/[\s,;:—-]+/).filter(Boolean);
      return words.some(w => w.includes(ql) || w.startsWith(q3));
    };
    const list = APPS.filter(a =>
      hit(a.name) || hit(a.dev) || hit(a.category) || a.tags.some(hit)
    );
    $("#chips").innerHTML = chipsHTML(null);
    content.innerHTML = `
      <div class="results-hd">Результаты по запросу «${esc(q)}» —
        найдено ${list.length} ${plural(list.length, "приложение", "приложения", "приложений")}</div>
      <section class="section" style="margin-top:18px">
        ${list.length
          ? `<div class="grid">${list.map(card).join("")}</div>`
          : emptyHTML("Ничего не найдено", "Попробуйте другой запрос: название, разработчика или категорию.")}
      </section>`;
  }

  function emptyHTML(h, p) {
    return `<div class="empty"><div class="big">🔎</div><h3>${h}</h3><p>${p}</p></div>`;
  }

  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  function render() {
    const p = new URLSearchParams(location.search);
    const q = (p.get("q") || "").trim();
    const cat = p.get("cat") || "";
    qInput.value = q;

    document.querySelectorAll(".nav a, .mobile-nav a").forEach(a => a.classList.remove("on"));
    if (q) { renderSearch(q); document.getElementById("m-search")?.classList.add("on"); }
    else if (cat && cat !== "Все") {
      renderCategory(cat);
      const id = cat === "Игры" ? "nav-games" : cat === "Приложения" ? "nav-apps" : null;
      if (id) document.getElementById(id)?.classList.add("on");
      const mid = cat === "Игры" ? "m-games" : cat === "Приложения" ? "m-apps" : null;
      if (mid) document.getElementById(mid)?.classList.add("on");
    }
    else {
      renderHome();
      document.getElementById("nav-home").classList.add("on");
      document.getElementById("m-home")?.classList.add("on");
    }
  }

  /* живой поиск */
  let t;
  qInput.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const v = qInput.value.trim();
      const url = v ? `?q=${encodeURIComponent(v)}` : location.pathname.split("/").pop() || "./";
      history.replaceState(null, "", v ? url : "./");
      render();
    }, 180);
  });
  qInput.addEventListener("keydown", e => {
    if (e.key === "Enter") { clearTimeout(t); const v = qInput.value.trim(); history.replaceState(null, "", v ? `?q=${encodeURIComponent(v)}` : "./"); render(); }
    if (e.key === "Escape") { qInput.value = ""; history.replaceState(null, "", "./"); render(); }
  });

  /* смена аккаунта или тарифа — перерисовать каталог с новыми ценами */
  window.addEventListener("ap:auth", render);

  render();
})();
