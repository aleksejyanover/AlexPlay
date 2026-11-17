/* ============ Alex Play — демо-оплата (общий модуль для страниц приложения и тарифов) ============ */
window.APCheckout = (function () {
  const NOTE = "Демо-режим Alex Play: банковские списания не производятся, данные карт никуда не передаются и не сохраняются.";

  let modal = null;

  const luhn = num => {
    const d = num.replace(/\D/g, "");
    if (d.length < 13) return false;
    let sum = 0, alt = false;
    for (let i = d.length - 1; i >= 0; i--) {
      let n = +d[i];
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  };

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.id = "pay-modal";
    modal.addEventListener("mousedown", e => { if (e.target === modal) close(); });
    document.body.appendChild(modal);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && modal.classList.contains("open")) close();
    });
    return modal;
  }

  function close() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.innerHTML = "";
  }

  /**
   * Открыть окно демо-оплаты.
   * opts: { emoji, grad:[c1,c2], name, priceText, tileCls, badge, subLabel, successTitle, successText, onSuccess }
   */
  function open(opts) {
    const m = ensureModal();
    const grad = `linear-gradient(135deg,${opts.grad[0]},${opts.grad[1]})`;
    const badge = opts.badge ? `<span class="tier-badge ${opts.badge.cls}">${opts.badge.text}</span>` : "";

    m.innerHTML = `
      <div class="modal">
        <div class="modal-hd">
          <span class="tile tile-64" style="background:${grad}">${opts.emoji}</span>
          <div>
            <div class="name">${esc(opts.name)} ${badge}</div>
            <div class="price">${esc(opts.subLabel || "Цена")}: <b>${esc(opts.priceText)}</b></div>
          </div>
          <button class="modal-close" id="pay-close" aria-label="Закрыть">✕</button>
        </div>
        <div class="pay-secure">🔒 Безопасная оплата</div>
        <div class="pay-title">Данные карты</div>
        <form id="pay-form" novalidate>
          <div class="field">
            <label>Номер карты</label>
            <input id="cc-num" inputmode="numeric" autocomplete="cc-number" placeholder="0000 0000 0000 0000" maxlength="19">
            <div class="field-err" id="cc-num-err">Проверьте номер карты</div>
          </div>
          <div class="field-row">
            <div class="field">
              <label>Срок действия</label>
              <input id="cc-exp" inputmode="numeric" autocomplete="cc-exp" placeholder="ММ/ГГ" maxlength="5">
              <div class="field-err" id="cc-exp-err">Формат ММ/ГГ</div>
            </div>
            <div class="field">
              <label>CVC</label>
              <input id="cc-cvc" inputmode="numeric" autocomplete="cc-csc" placeholder="•••" maxlength="3">
              <div class="field-err" id="cc-cvc-err">3 цифры</div>
            </div>
          </div>
          <div class="field">
            <label>Имя на карте</label>
            <input id="cc-name" autocomplete="cc-name" placeholder="IVAN IVANOV" style="letter-spacing:.04em">
          </div>
          <button class="pay-btn" type="submit" id="pay-submit">Оплатить ${esc(opts.priceText)}</button>
        </form>
        <div class="pay-note">${NOTE}</div>
      </div>`;

    m.classList.add("open");
    bind(opts, grad);
  }

  function bind(opts, grad) {
    const m = modal;
    const showErr = k => m.querySelector("#" + k + "-err")?.classList.add("show");
    const hideErr = k => m.querySelector("#" + k + "-err")?.classList.remove("show");

    m.querySelector("#pay-close").addEventListener("click", close);

    const num = m.querySelector("#cc-num");
    const exp = m.querySelector("#cc-exp");
    const cvc = m.querySelector("#cc-cvc");
    const name = m.querySelector("#cc-name");

    num.addEventListener("input", () => {
      const v = num.value.replace(/\D/g, "").slice(0, 16);
      num.value = v.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      num.classList.remove("err"); hideErr("cc-num");
    });
    exp.addEventListener("input", () => {
      const v = exp.value.replace(/\D/g, "").slice(0, 4);
      exp.value = v.length > 2 ? v.slice(0, 2) + "/" + v.slice(2) : v;
      exp.classList.remove("err"); hideErr("cc-exp");
    });
    cvc.addEventListener("input", () => {
      cvc.value = cvc.value.replace(/\D/g, "").slice(0, 3);
      cvc.classList.remove("err"); hideErr("cc-cvc");
    });
    name.addEventListener("input", () => {
      name.value = name.value.replace(/[^a-zA-Z\s'-]/g, "").toUpperCase();
    });

    m.querySelector("#pay-form").addEventListener("submit", e => {
      e.preventDefault();
      let ok = true;
      if (!luhn(num.value)) { num.classList.add("err"); showErr("cc-num"); ok = false; }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp.value)) { exp.classList.add("err"); showErr("cc-exp"); ok = false; }
      if (!/^\d{3}$/.test(cvc.value)) { cvc.classList.add("err"); showErr("cc-cvc"); ok = false; }
      if (!name.value.trim()) { name.classList.add("err"); ok = false; }
      if (!ok) return;

      const btn = m.querySelector("#pay-submit");
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> Обработка платежа...`;
      setTimeout(() => {
        /* данные карты существуют только в полях формы и удаляются вместе с ней */
        if (opts.onSuccess) opts.onSuccess();
        m.innerHTML = `
          <div class="modal">
            <div class="pay-success">
              <div class="ok">✓</div>
              <h3>${esc(opts.successTitle || "Покупка завершена")}</h3>
              <p>${opts.successText || ""}</p>
            </div>
            <button class="pay-btn" id="pay-done" style="margin-top:20px">${esc(opts.doneLabel || "Открыть приложение")}</button>
            <div class="pay-note">${NOTE}</div>
          </div>`;
        m.querySelector("#pay-done").addEventListener("click", () => {
          close();
          if (opts.onDone) opts.onDone();
        });
      }, 1400);
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  return { open, close };
})();
