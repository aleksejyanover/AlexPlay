/* ============ Alex Play — страница приложения ============ */
(function () {
  const APPS = window.APPS || [];
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + " тыс." : String(n);
  const stars = r => "★★★★★".slice(0, Math.round(r)) + "☆☆☆☆☆".slice(0, 5 - Math.round(r));

  const id = new URLSearchParams(location.search).get("id");
  const app = APPS.find(a => a.id === id);
  const root = $("#detail");

  /* поиск в header всегда ведёт на главную */
  const q = $("#q");
  q.addEventListener("keydown", e => {
    if (e.key === "Enter" && q.value.trim()) location.href = `index.html?q=${encodeURIComponent(q.value.trim())}`;
  });

  if (!app) {
    root.innerHTML = `
      <div class="empty" style="margin-top:60px">
        <div class="big">🙈</div>
        <h3>Приложение не найдено</h3>
        <p>Возможно, оно было удалено.</p>
        <p style="margin-top:18px"><a class="btn btn-primary" href="index.html">На главную</a></p>
      </div>`;
    return;
  }

  document.title = `${app.name} — Alex Play`;

  const total = app.dist.reduce((s, x) => s + x, 0) || 1;
  const bars = app.dist.map((p, i) => {
    const starsN = 5 - i;
    const pct = Math.round((p / total) * 100);
    return `<div class="bar"><span>${starsN}</span>
      <span class="track"><span class="fill" style="width:${pct}%"></span></span>
      <span>${pct}%</span></div>`;
  }).join("");

  const dlBtn = (href, cls, icon, label) => href
    ? `<a class="btn ${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${icon} ${label}</a>`
    : `<button class="btn ${cls} btn-soon" disabled>${icon} ${label} · Скоро</button>`;

  const L = app.links || {};
  const openBtn = dlBtn(L.web, "btn-primary", "🌐", "Открыть в браузере");
  const dlGrid = `
    <div class="dl-grid">
      ${dlBtn(L.ios, "btn-ghost", "", "Загрузить для iPhone")}
      ${dlBtn(L.android, "btn-ghost", "🤖", "Скачать для Android")}
      ${dlBtn(L.mac, "btn-ghost", "🍎", "Скачать для Mac")}
      ${dlBtn(L.windows, "btn-ghost", "🪟", "Скачать для Windows")}
    </div>`;

  const authorNote = app.author ? `
    <div class="author-note" style="margin-top:20px">
      <span class="author-photo" style="width:46px;height:46px;border-radius:14px;font-size:20px">▶</span>
      <span><b>Создано автором Alex Play</b> — авторский проект, созданный разработчиком магазина Alex Play.</span>
    </div>` : "";

  const similar = APPS.filter(a => a.id !== app.id && a.category === app.category)
    .concat(APPS.filter(a => a.id !== app.id && a.category !== app.category))
    .slice(0, 6);

  root.innerHTML = `
    <a class="back" href="index.html">← Все приложения</a>

    <section class="detail-head">
      <span class="tile tile-128" style="background:linear-gradient(135deg,${app.grad[0]},${app.grad[1]})">${app.emoji}</span>
      <div class="info">
        <h1>${app.author ? `<span class="badge-author" style="vertical-align:middle;margin-right:10px">✦ Alex Play</span>` : ""}${esc(app.name)}</h1>
        <a class="dev" href="index.html?q=${encodeURIComponent(app.dev)}">${esc(app.dev)}</a>
        <div class="rate-block">
          <div class="rate-num">
            <div class="n">${app.rating.toFixed(1)}</div>
            <div class="s">${stars(app.rating)}</div>
            <div class="c">${fmt(app.reviews)} отзывов</div>
          </div>
          <div class="bars">${bars}</div>
        </div>
      </div>
      <div class="detail-actions">
        ${openBtn}
        ${dlGrid}
        <div class="plat-label">Или скачайте на iPhone, Android, Mac и Windows</div>
      </div>
    </section>
    ${authorNote}

    <div class="meta-grid">
      <div class="meta-item"><div class="k">Категория</div><div class="v">${esc(app.category)}</div></div>
      <div class="meta-item"><div class="k">Размер</div><div class="v">${esc(app.size)}</div></div>
      <div class="meta-item"><div class="k">Возраст</div><div class="v">${esc(app.age)}</div></div>
      <div class="meta-item"><div class="k">Версия</div><div class="v">${esc(app.version)}</div></div>
      <div class="meta-item"><div class="k">Обновлено</div><div class="v">${esc(app.updated)}</div></div>
      <div class="meta-item"><div class="k">Цена</div><div class="v">${esc(app.price)}</div></div>
    </div>

    <section class="block">
      <h2>Скриншоты</h2>
      <div class="shots">
        ${app.shots.map(s => `
          <div class="shot" style="background:linear-gradient(160deg,${s.grad[0]},${s.grad[1]})">
            <div class="em">${app.emoji}</div>
            <div class="cap">${esc(s.title)}</div>
          </div>`).join("")}
      </div>
    </section>

    <section class="block">
      <h2>О приложении</h2>
      <p class="desc">${esc(app.desc)}</p>
      <div class="tags">${app.tags.map(t => `<span class="tag">#${esc(t)}</span>`).join("")}</div>
    </section>

    <section class="block">
      <h2>Что нового</h2>
      <p class="desc">Версия ${esc(app.version)}: улучшена производительность, обновлён интерфейс и исправлены мелкие ошибки. Спасибо, что пользуетесь Alex Play!</p>
    </section>

    <section class="block">
      <h2>Отзывы</h2>
      <div class="reviews" id="reviews-body"></div>
    </section>

    <section class="block">
      <h2>Похожие приложения</h2>
      <div class="grid">
        ${similar.map(a => `
          <a class="card" href="app.html?id=${encodeURIComponent(a.id)}">
            ${a.author ? `<span class="badge-author">✦ Alex Play</span>` : ""}
            <div class="card-top">
              <span class="tile tile-64" style="background:linear-gradient(135deg,${a.grad[0]},${a.grad[1]})">${a.emoji}</span>
              <div>
                <div class="card-name">${esc(a.name)}</div>
                <div class="card-dev">${esc(a.dev)}</div>
              </div>
            </div>
            <div class="card-foot">
              <span class="rating"><span class="star">★</span>${a.rating.toFixed(1)} <span class="cnt">(${fmt(a.reviews)})</span></span>
              ${a.price !== "Бесплатно" ? `<span class="price-tag">${esc(a.price)}</span>` : `<span class="cat-tag">${esc(a.category)}</span>`}
            </div>
          </a>`).join("")}
      </div>
    </section>`;

  /* ---------- Отзывы: доступны только после первого запуска приложения ---------- */
  const LAUNCH_KEY = "alexplay_launch_" + app.id;
  const REV_KEY = "alexplay_reviews";
  const isLaunched = () => !!localStorage.getItem(LAUNCH_KEY);
  const readAll = () => { try { return JSON.parse(localStorage.getItem(REV_KEY) || "{}"); } catch (e) { return {}; } };
  const myReview = () => readAll()[app.id] || null;
  const saveMyReview = r => { const all = readAll(); all[app.id] = r; localStorage.setItem(REV_KEY, JSON.stringify(all)); };
  const delMyReview = () => { const all = readAll(); delete all[app.id]; localStorage.setItem(REV_KEY, JSON.stringify(all)); };
  const hasAnyLink = Object.values(app.links || {}).some(Boolean);

  let formStars = 5;
  let editing = false;
  const todayStr = () => new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  const starsStr = n => "★".repeat(n) + "☆".repeat(5 - n);

  function reviewHTML(r, yours) {
    return `
      <div class="review${yours ? " yours" : ""}">
        <div class="review-head">
          <span class="avatar">${esc((r.name || "Гость").trim().charAt(0) || "Г")}</span>
          <div>
            <div class="who">${esc(r.name || "Гость")}${yours ? ` <span class="yours-label">Ваш отзыв</span>` : ""}</div>
            <div class="when">${esc(r.date)}</div>
          </div>
          <span class="rv-stars">${starsStr(r.stars)}</span>
        </div>
        <p>${esc(r.text)}</p>
        ${yours ? `<div class="rv-actions">
          <button data-act="edit">Изменить</button>
          <button class="del" data-act="del">Удалить</button>
        </div>` : ""}
      </div>`;
  }

  function formHTML() {
    const m = myReview();
    return `
      <form class="review-form" id="rv-form">
        <div class="lbl">${editing ? "Изменить отзыв" : "Ваша оценка"}</div>
        <div class="stars-input" id="rv-stars">
          ${[1, 2, 3, 4, 5].map(i => `<span class="s${i <= formStars ? " on" : ""}" data-n="${i}">★</span>`).join("")}
        </div>
        <textarea id="rv-text" placeholder="Расскажите, как вам приложение...">${editing && m ? esc(m.text) : ""}</textarea>
        <div class="row">
          <input type="text" id="rv-name" placeholder="Ваше имя (необязательно)" value="${editing && m ? esc(m.name || "") : ""}" style="max-width:280px">
          <button class="btn btn-primary btn-sm" type="submit">${editing ? "Сохранить" : "Оставить отзыв"}</button>
          ${editing ? `<button class="btn btn-ghost btn-sm" type="button" id="rv-cancel">Отмена</button>` : ""}
        </div>
      </form>`;
  }

  function renderReviews() {
    const box = document.getElementById("reviews-body");
    if (!box) return;
    const mine = myReview();
    let html = "";

    if (!isLaunched()) {
      html += `
        <div class="review-gate">
          <span style="font-size:20px">🔒</span>
          <span><b>Чтобы оставить отзыв, хотя бы раз откройте приложение.</b><br>
          Нажмите «Открыть в браузере» или скачайте его — и форма отзыва станет доступной.
          ${!hasAnyLink ? "<br>У этого приложения пока нет активных ссылок — отзыв можно будет оставить после его запуска." : ""}</span>
        </div>`;
    } else if (!mine || editing) {
      html += formHTML();
    }
    if (mine) html += reviewHTML(mine, true);
    html += (app.comments || []).map(c => reviewHTML(c, false)).join("");

    box.innerHTML = html;
    bindReviews();
  }

  function bindReviews() {
    const stars = document.getElementById("rv-stars");
    if (stars) {
      stars.querySelectorAll(".s").forEach(s => s.addEventListener("click", () => {
        formStars = +s.dataset.n;
        stars.querySelectorAll(".s").forEach(x => x.classList.toggle("on", +x.dataset.n <= formStars));
      }));
    }
    const form = document.getElementById("rv-form");
    if (form) {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const text = document.getElementById("rv-text").value.trim();
        if (!text) { document.getElementById("rv-text").focus(); return; }
        saveMyReview({
          stars: formStars,
          text,
          name: document.getElementById("rv-name").value.trim() || "Гость",
          date: todayStr()
        });
        editing = false;
        renderReviews();
      });
      const cancel = document.getElementById("rv-cancel");
      if (cancel) cancel.addEventListener("click", () => { editing = false; renderReviews(); });
    }
    document.querySelectorAll(".rv-actions button").forEach(b => b.addEventListener("click", () => {
      if (b.dataset.act === "del") { delMyReview(); editing = false; formStars = 5; renderReviews(); }
      if (b.dataset.act === "edit") { editing = true; formStars = myReview().stars; renderReviews(); document.getElementById("rv-form")?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    }));
  }

  /* первый запуск приложения открывает возможность отзывов */
  document.querySelectorAll(".detail-actions a.btn").forEach(el => {
    el.addEventListener("click", () => {
      localStorage.setItem(LAUNCH_KEY, "1");
      renderReviews();
    });
  });

  renderReviews();
})();
