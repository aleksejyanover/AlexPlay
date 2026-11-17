/* ============ Alex Play — аккаунты, тарифы (VIP/Premium) и цены ============
   Всё хранится локально в браузере (localStorage), сервера нет — демо-режим. */
window.AP = (function () {
  const USERS_KEY = "alexplay_users";
  const SESSION_KEY = "alexplay_session";

  const PLANS = {
    vip: {
      id: "vip",
      name: "VIP",
      emoji: "⭐",
      price: 299,
      grad: ["#7C5CFF", "#00D2FF"],
      perks: [
        ["games-first", "Игры выходят первыми на главной"],
        ["disc-games", "Скидка 40% на все игры"],
        ["early", "Ранний доступ к играм (предзаказ)"]
      ]
    },
    premium: {
      id: "premium",
      name: "Premium",
      emoji: "👑",
      price: 499,
      grad: ["#FF9F0A", "#FF375F"],
      perks: [
        ["games-first", "Игры выходят первыми на главной"],
        ["disc-games", "Скидка 40% на все игры"],
        ["early", "Ранний доступ к играм (предзаказ)"],
        ["disc-apps", "Скидка 20% на приложения (не-игры)"],
        ["new-first", "Новинки показываются первыми"],
        ["badge", "👑 Эксклюзивный значок в отзывах"],
        ["support", "Приоритетная поддержка"]
      ]
    }
  };

  /* ---------- хранилище ---------- */
  function readUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "{}"); } catch (e) { return {}; }
  }
  function writeUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }

  function seed() {
    const users = readUsers();
    if (!users.ALEX) {
      users.ALEX = { pass: "6767", admin: true, tier: "admin" };
      writeUsers(users);
    } else if (!users.ALEX.admin) {
      users.ALEX = { pass: "6767", admin: true, tier: "admin" };
      writeUsers(users);
    }
  }

  const user = () => {
    const name = localStorage.getItem(SESSION_KEY);
    if (!name) return null;
    return readUsers()[name] ? name : null;
  };

  const findKey = name => {
    const users = readUsers();
    const low = String(name || "").toLowerCase();
    return Object.keys(users).find(k => k.toLowerCase() === low) || null;
  };

  /* ---------- тариф ---------- */
  function tier() {
    const name = user();
    if (!name) return "guest";
    const users = readUsers();
    const u = users[name];
    if (u.admin) return "admin";
    const t = u.tier || "free";
    if ((t === "vip" || t === "premium") && u.until && u.until < Date.now()) {
      u.tier = "free"; delete u.until; writeUsers(users); // подписка истекла
      return "free";
    }
    if (t === "vip" || t === "premium") return t;
    return "free";
  }

  const isMember = () => { const t = tier(); return t === "vip" || t === "premium" || t === "admin"; };
  const hasPerk = p => {
    const t = tier();
    if (t === "admin") return true;
    if (t === "premium") return true;
    if (t === "vip") return p === "games-first" || p === "disc-games" || p === "early";
    return false;
  };

  function untilDate() {
    const name = user();
    if (!name) return null;
    const u = readUsers()[name];
    return u.until || null;
  }

  /* ---------- цены с учётом тарифа ---------- */
  function priceFor(app) {
    const full = app.price;
    const t = tier();
    if (t === "admin") return { free: true, now: null, old: null, label: "даром" };
    if (full === "Бесплатно") return { free: false, now: null, old: null, label: full };
    const n = parseInt(full, 10);
    if (!n) return { free: false, now: null, old: null, label: full };
    const isGame = app.category === "Игры";
    if (isGame && (t === "vip" || t === "premium")) {
      return { free: false, now: Math.round(n * 0.6) + " ₽", old: full, label: Math.round(n * 0.6) + " ₽" };
    }
    if (!isGame && t === "premium") {
      return { free: false, now: Math.round(n * 0.8) + " ₽", old: full, label: Math.round(n * 0.8) + " ₽" };
    }
    return { free: false, now: null, old: null, label: full };
  }

  /* ---------- действия ---------- */
  function login(name, pass) {
    const key = findKey(name);
    if (!key) return { ok: false, err: "Аккаунт не найден" };
    const u = readUsers()[key];
    if (u.pass !== String(pass)) return { ok: false, err: "Неверный пароль" };
    localStorage.setItem(SESSION_KEY, key);
    fire();
    return { ok: true, name: key };
  }

  function register(name, pass) {
    const nm = String(name || "").trim();
    if (!/^[A-Za-zА-Яа-яЁё0-9_-]{3,20}$/.test(nm))
      return { ok: false, err: "Логин: 3–20 символов (буквы, цифры, _ и -)" };
    if (String(pass).length < 4) return { ok: false, err: "Пароль: минимум 4 символа" };
    if (findKey(nm)) return { ok: false, err: "Такой логин уже занят" };
    const users = readUsers();
    users[nm] = { pass: String(pass), tier: "free" };
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, nm);
    fire();
    return { ok: true, name: nm };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    fire();
  }

  function setTier(plan) {
    const name = user();
    if (!name) return false;
    const users = readUsers();
    const u = users[name];
    if (u.admin) return true;
    u.tier = plan;
    u.until = Date.now() + 30 * 24 * 60 * 60 * 1000; /* 30 дней */
    writeUsers(users);
    fire();
    return true;
  }

  const fire = () => window.dispatchEvent(new CustomEvent("ap:auth"));

  /* ---------- значок автора отзыва ---------- */
  function badgeByName(name) {
    if (!name) return null;
    const key = findKey(name);
    if (!key) return null;
    const users = readUsers();
    const u = users[key];
    if (u.admin) return { cls: "admin", text: "🛡 ALEX" };
    const t = (u.tier === "vip" || u.tier === "premium") &&
      (!u.until || u.until >= Date.now()) ? u.tier : null;
    if (t === "premium") return { cls: "premium", text: "👑 Premium" };
    if (t === "vip") return { cls: "vip", text: "⭐ VIP" };
    return null;
  }

  /* ================= UI: кнопка аккаунта, модалки ================= */
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function tierLabel(t) {
    return t === "admin" ? "Админ" : t === "premium" ? "Premium" : t === "vip" ? "VIP" : "Базовый";
  }
  function tierEmoji(t) {
    return t === "admin" ? "🛡" : t === "premium" ? "👑" : t === "vip" ? "⭐" : "👤";
  }

  /* кнопка в шапке */
  function renderHeaderBtn() {
    const hdr = $(".hdr-in");
    if (!hdr) return;
    let btn = document.getElementById("acct-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "acct-btn";
      btn.className = "acct-btn";
      hdr.appendChild(btn);
    }
    const name = user();
    const t = tier();
    if (!name) {
      btn.innerHTML = `<span class="ico">👤</span> Войти`;
      btn.title = "Войти или зарегистрироваться";
    } else {
      const chip = `<span class="acct-chip t-${t}">${tierLabel(t)}</span>`;
      btn.innerHTML = `<span class="ico">${tierEmoji(t)}</span> ${esc(name)} ${chip}`;
      btn.title = "Профиль";
    }
    btn.onclick = () => (name ? openProfile() : openAuth());
  }

  /* пункт «Профиль» в мобильной навигации */
  function renderMobileNav() {
    const mn = $(".mobile-nav");
    if (!mn || document.getElementById("m-acct")) return;
    const a = document.createElement("a");
    a.id = "m-acct";
    a.href = "#";
    a.innerHTML = `<span class="ico">👤</span>Профиль`;
    a.addEventListener("click", e => {
      e.preventDefault();
      user() ? openProfile() : openAuth();
    });
    mn.appendChild(a);
  }

  /* ---------- модалка входа/регистрации ---------- */
  function ensureOverlay(id) {
    let m = document.getElementById(id);
    if (!m) {
      m = document.createElement("div");
      m.className = "modal-overlay";
      m.id = id;
      m.addEventListener("mousedown", e => { if (e.target === m) m.classList.remove("open"), m.innerHTML = ""; });
      document.body.appendChild(m);
      document.addEventListener("keydown", e => {
        if (e.key === "Escape" && m.classList.contains("open")) { m.classList.remove("open"); m.innerHTML = ""; }
      });
    }
    return m;
  }

  let authMode = "login";
  let authAfter = null;

  function openAuth(mode, after) {
    authMode = mode || "login";
    authAfter = after || null;
    const m = ensureOverlay("auth-modal");
    m.innerHTML = authHTML();
    m.classList.add("open");
    bindAuth();
  }

  function authHTML() {
    const reg = authMode === "reg";
    return `
      <div class="modal auth-modal">
        <div class="modal-hd">
          <span class="tile tile-64" style="background:linear-gradient(135deg,#7C5CFF,#00D2FF)">👤</span>
          <div>
            <div class="name">Аккаунт Alex Play</div>
            <div class="price">${reg ? "Регистрация" : "Вход в аккаунт"}</div>
          </div>
          <button class="modal-close" id="auth-close" aria-label="Закрыть">✕</button>
        </div>
        <div class="auth-tabs">
          <button type="button" class="auth-tab${reg ? "" : " on"}" data-mode="login">Вход</button>
          <button type="button" class="auth-tab${reg ? " on" : ""}" data-mode="reg">Регистрация</button>
        </div>
        <form id="auth-form" novalidate>
          <div class="field">
            <label>Логин</label>
            <input id="au-login" autocomplete="username" placeholder="Ваш логин" value="">
            <div class="field-err" id="au-login-err"></div>
          </div>
          <div class="field">
            <label>Пароль</label>
            <input id="au-pass" type="password" autocomplete="${reg ? "new-password" : "current-password"}" placeholder="Пароль">
            <div class="field-err" id="au-pass-err"></div>
          </div>
          <button class="pay-btn" type="submit" id="auth-submit">${reg ? "Создать аккаунт" : "Войти"}</button>
        </form>
        <div class="pay-note">Демо-режим Alex Play: аккаунты хранятся только в вашем браузере и никуда не отправляются.</div>
      </div>`;
  }

  function bindAuth() {
    const m = document.getElementById("auth-modal");
    const close = () => { m.classList.remove("open"); m.innerHTML = ""; };
    m.querySelector("#auth-close").addEventListener("click", close);
    m.querySelectorAll(".auth-tab").forEach(b => b.addEventListener("click", () => openAuth(b.dataset.mode, authAfter)));

    const form = m.querySelector("#auth-form");
    const loginInput = m.querySelector("#au-login");
    const pass = m.querySelector("#au-pass");
    const errL = m.querySelector("#au-login-err");
    const errP = m.querySelector("#au-pass-err");
    const clr = () => { loginInput.classList.remove("err"); pass.classList.remove("err"); errL.classList.remove("show"); errP.classList.remove("show"); };
    loginInput.addEventListener("input", clr);
    pass.addEventListener("input", clr);

    form.addEventListener("submit", e => {
      e.preventDefault();
      clr();
      const res = authMode === "reg" ? register(loginInput.value, pass.value) : login(loginInput.value, pass.value);
      if (!res.ok) {
        const target = /парол/i.test(res.err) ? pass : loginInput;
        target.classList.add("err");
        const box = target === pass ? errP : errL;
        box.textContent = res.err;
        box.classList.add("show");
        return;
      }
      close();
      renderHeaderBtn();
      if (authAfter) { const f = authAfter; authAfter = null; f(); }
    });
    setTimeout(() => loginInput.focus(), 60);
  }

  /* ---------- модалка профиля ---------- */
  function openProfile() {
    const name = user();
    if (!name) return openAuth();
    const t = tier();
    const until = untilDate();
    const plan = PLANS[t];

    let status;
    if (t === "admin") status = `<b>🛡 Главный аккаунт</b> — всё в магазине бесплатно, все привилегии Premium включены.`;
    else if (t === "premium" || t === "vip") status = `Действует <b>до ${new Date(until).toLocaleDateString("ru-RU")}</b> (продление — на странице тарифов).`;
    else status = `Подписка не оформлена. <a class="inline" href="plans.html">Посмотреть тарифы →</a>`;

    const perks = t === "admin"
      ? PLANS.premium.perks.concat([["free", "Все приложения и игры — бесплатно"]])
      : plan ? plan.perks : [];

    const m = ensureOverlay("profile-modal");
    m.innerHTML = `
      <div class="modal auth-modal">
        <div class="modal-hd">
          <span class="tile tile-64" style="background:linear-gradient(135deg,${t === "premium" || t === "admin" ? "#FF9F0A,#FF375F" : t === "vip" ? "#7C5CFF,#00D2FF" : "#8A94AD,#4A5568"})">${tierEmoji(t)}</span>
          <div>
            <div class="name">${esc(name)} <span class="acct-chip t-${t}">${tierEmoji(t)} ${tierLabel(t)}</span></div>
            <div class="price">${status}</div>
          </div>
          <button class="modal-close" id="pf-close" aria-label="Закрыть">✕</button>
        </div>
        ${perks.length ? `<div class="pay-title">Ваши привилегии</div>
        <ul class="pf-perks">${perks.map(p => `<li><span class="ok-ico">✓</span>${esc(p[1])}</li>`).join("")}</ul>` : `
        <div class="pay-title">Что даёт подписка</div>
        <ul class="pf-perks muted">
          <li><span class="ok-ico">→</span>Скидка 40% на игры и игры первыми — VIP</li>
          <li><span class="ok-ico">→</span>Плюс скидка 20% на приложения, значок и приоритет — Premium</li>
        </ul>`}
        <div class="pf-actions">
          <a class="btn btn-primary" href="plans.html">⭐ Тарифы</a>
          <button class="btn btn-ghost" id="pf-logout">Выйти</button>
        </div>
        <div class="pay-note">Демо-режим: аккаунт и подписка хранятся только в этом браузере.</div>
      </div>`;
    m.classList.add("open");
    m.querySelector("#pf-close").addEventListener("click", () => { m.classList.remove("open"); m.innerHTML = ""; });
    m.querySelector("#pf-logout").addEventListener("click", () => {
      m.classList.remove("open"); m.innerHTML = "";
      logout();
      renderHeaderBtn();
    });
  }

  /* ---------- блок приоритетной поддержки на странице поддержки ---------- */
  function renderSupport() {
    const box = document.getElementById("support-priority");
    if (!box) return;
    const t = tier();
    if (t === "premium" || t === "admin") {
      box.hidden = false;
      box.innerHTML = `<b>👑 ${t === "admin" ? "Главный аккаунт ALEX" : "Premium-поддержка"}</b> — ваши обращения обрабатываются в приоритетном порядке (в демо-режиме статус отображается локально).`;
    }
  }

  /* ---------- инициализация ---------- */
  function init() {
    seed();
    renderHeaderBtn();
    renderMobileNav();
    renderSupport();
    window.addEventListener("ap:auth", () => { renderHeaderBtn(); renderSupport(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return {
    PLANS, user, tier, isMember, hasPerk, untilDate, priceFor,
    login, register, logout, setTier, badgeByName,
    openAuth, openProfile, tierLabel, tierEmoji, fire
  };
})();
