'use client';

// Демо-оплата платного приложения: модальное окно с формой карты.
// Данные карт существуют только в полях формы (React-state) и не сохраняются
// никуда — в localStorage попадает только флаг покупки alexplay_paid_<id> = "1".

import { useEffect, useRef, useState } from 'react';
import Tile from './Tile';

const NOTE =
  'Демо-режим Alex Play: банковские списания не производятся, данные карт никуда не передаются и не сохраняются.';

// Проверка номера карты по алгоритму Луна.
const luhn = (num) => {
  const d = num.replace(/\D/g, '');
  if (d.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let n = +d[i];
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

export default function PayModal({ app, onClose, onPaid }) {
  const [num, setNum] = useState('');
  const [exp, setExp] = useState('');
  const [cvc, setCvc] = useState('');
  const [ccName, setCcName] = useState('');
  const [errs, setErrs] = useState({});
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false); // для fade-in анимации оверлея
  const timerRef = useRef(null);

  useEffect(() => {
    // Появление оверлея (анимация opacity из эталона).
    const raf = requestAnimationFrame(() => setReady(true));
    // Закрытие по Escape.
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onClose]);

  const clearErr = (k) => setErrs((s) => ({ ...s, [k]: false }));

  const onNumChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 16);
    setNum(v.replace(/(\d{4})(?=\d)/g, '$1 ').trim());
    clearErr('num');
  };

  const onExpChange = (e) => {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4);
    setExp(v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v);
    clearErr('exp');
  };

  const onCvcChange = (e) => {
    setCvc(e.target.value.replace(/\D/g, '').slice(0, 3));
    clearErr('cvc');
  };

  const onNameChange = (e) => {
    setCcName(e.target.value.replace(/[^a-zA-Z\s'-]/g, '').toUpperCase());
    clearErr('name');
  };

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!luhn(num)) next.num = true;
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) next.exp = true;
    if (!/^\d{3}$/.test(cvc)) next.cvc = true;
    if (!ccName.trim()) next.name = true;
    setErrs(next);
    if (Object.keys(next).length) return;

    setProcessing(true);
    timerRef.current = setTimeout(() => {
      // Сохраняется ТОЛЬКО флаг покупки; данные карт остаются в размонтированной форме.
      localStorage.setItem(`alexplay_paid_${app.id}`, '1');
      setProcessing(false);
      setDone(true);
      onPaid();
    }, 1400);
  }

  return (
    <div
      className={`modal-overlay${ready ? ' open' : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Оплата приложения"
    >
      <div className="modal">
        <div className="modal-hd">
          <Tile app={app} />
          <div>
            <div className="name">{app.name}</div>
            <div className="price">
              Цена: <b>{app.price}</b>
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        {done ? (
          <>
            <div className="pay-success">
              <div className="ok">✓</div>
              <h3>Покупка завершена</h3>
              <p>
                «{app.name}» добавлено в вашу библиотеку.
                <br />
                Теперь приложение можно открыть и скачать на любое устройство.
              </p>
            </div>
            <button
              type="button"
              className="pay-btn"
              style={{ marginTop: 20 }}
              onClick={onClose}
            >
              Открыть приложение
            </button>
            <div className="pay-note">{NOTE}</div>
          </>
        ) : (
          <>
            <div className="pay-secure">🔒 Безопасная оплата</div>
            <div className="pay-title">Данные карты</div>
            <form noValidate onSubmit={submit}>
              <div className="field">
                <label>Номер карты</label>
                <input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={num}
                  onChange={onNumChange}
                  className={errs.num ? 'err' : ''}
                />
                <div className={`field-err${errs.num ? ' show' : ''}`}>
                  Проверьте номер карты
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Срок действия</label>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="ММ/ГГ"
                    maxLength={5}
                    value={exp}
                    onChange={onExpChange}
                    className={errs.exp ? 'err' : ''}
                  />
                  <div className={`field-err${errs.exp ? ' show' : ''}`}>
                    Формат ММ/ГГ
                  </div>
                </div>
                <div className="field">
                  <label>CVC</label>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    maxLength={3}
                    value={cvc}
                    onChange={onCvcChange}
                    className={errs.cvc ? 'err' : ''}
                  />
                  <div className={`field-err${errs.cvc ? ' show' : ''}`}>
                    3 цифры
                  </div>
                </div>
              </div>
              <div className="field">
                <label>Имя на карте</label>
                <input
                  autoComplete="cc-name"
                  placeholder="IVAN IVANOV"
                  style={{ letterSpacing: '.04em' }}
                  value={ccName}
                  onChange={onNameChange}
                  className={errs.name ? 'err' : ''}
                />
              </div>
              <button
                className="pay-btn"
                type="submit"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <span className="spinner" /> Обработка платежа...
                  </>
                ) : (
                  `Оплатить ${app.price}`
                )}
              </button>
            </form>
            <div className="pay-note">{NOTE}</div>
          </>
        )}
      </div>
    </div>
  );
}
