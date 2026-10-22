'use client';

// Отзывы: доступны только после первого запуска приложения (клик по любой кнопке
// открытия/скачивания ставит в localStorage флаг alexplay_launch_<id>).
// Собственный отзыв хранится в localStorage (alexplay_reviews), ниже — отзывы из данных.
// Гидратация безопасна: стартовый рендер — gate-состояние, localStorage читаем в useEffect.

import { useEffect, useRef, useState } from 'react';

const REV_KEY = 'alexplay_reviews';
const LAUNCH_EVENT = 'alexplay-launch';

const launchKey = (id) => `alexplay_launch_${id}`;

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(REV_KEY) || '{}');
  } catch {
    return {};
  }
}

const starsStr = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

const todayStr = () =>
  new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// Один отзыв: аватар-инициал, имя, дата, звёзды, текст (+ действия у своего).
function Review({ r, yours, onEdit, onDelete }) {
  const name = r.name || 'Гость';
  const initial = name.trim().charAt(0) || 'Г';
  return (
    <div className={`review${yours ? ' yours' : ''}`}>
      <div className="review-head">
        <span className="avatar">{initial}</span>
        <div>
          <div className="who">
            {name}
            {yours && <span className="yours-label"> Ваш отзыв</span>}
          </div>
          <div className="when">{r.date}</div>
        </div>
        <span className="rv-stars" aria-label={`${r.stars} из 5`}>
          {starsStr(r.stars)}
        </span>
      </div>
      <p>{r.text}</p>
      {yours && (
        <div className="rv-actions">
          <button type="button" onClick={onEdit}>
            Изменить
          </button>
          <button type="button" className="del" onClick={onDelete}>
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}

export default function Reviews({ app }) {
  // Стартовые значения — как на сервере (gate), затем синхронизируем с localStorage.
  const [launched, setLaunched] = useState(false);
  const [mine, setMine] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formStars, setFormStars] = useState(5);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    setLaunched(!!localStorage.getItem(launchKey(app.id)));
    setMine(readAll()[app.id] || null);
    // Клик по кнопке открытия/скачивания (где-то на странице) открывает форму.
    const onLaunch = (e) => {
      if (!e.detail || e.detail.id === app.id) setLaunched(true);
    };
    window.addEventListener(LAUNCH_EVENT, onLaunch);
    return () => window.removeEventListener(LAUNCH_EVENT, onLaunch);
  }, [app.id]);

  const hasAnyLink = Object.values(app.links || {}).some(Boolean);

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) {
      formRef.current?.querySelector('textarea')?.focus();
      return;
    }
    const r = {
      stars: formStars,
      text: text.trim(),
      name: name.trim() || 'Гость',
      date: todayStr(),
    };
    const all = readAll();
    all[app.id] = r;
    localStorage.setItem(REV_KEY, JSON.stringify(all));
    setMine(r);
    setEditing(false);
  }

  function startEdit() {
    setEditing(true);
    setFormStars(mine.stars);
    setText(mine.text);
    setName(mine.name === 'Гость' ? '' : mine.name || '');
    // Прокрутка к форме после рендера.
    requestAnimationFrame(() =>
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    );
  }

  function cancelEdit() {
    setEditing(false);
  }

  function del() {
    const all = readAll();
    delete all[app.id];
    localStorage.setItem(REV_KEY, JSON.stringify(all));
    setMine(null);
    setEditing(false);
    setFormStars(5);
    setText('');
    setName('');
  }

  const showForm = launched && (!mine || editing);

  return (
    <section className="block">
      <h2>Отзывы</h2>
      <div className="reviews">
        {!launched && (
          <div className="review-gate">
            <span style={{ fontSize: 20 }} aria-hidden="true">
              🔒
            </span>
            <span>
              <b>Чтобы оставить отзыв, хотя бы раз откройте приложение.</b>
              <br />
              Нажмите «Открыть в браузере» или скачайте его — и форма отзыва
              станет доступной.
              {!hasAnyLink && (
                <>
                  <br />
                  У этого приложения пока нет активных ссылок — отзыв можно
                  будет оставить после его запуска.
                </>
              )}
            </span>
          </div>
        )}

        {showForm && (
          <form className="review-form" ref={formRef} onSubmit={submit}>
            <div className="lbl">
              {editing ? 'Изменить отзыв' : 'Ваша оценка'}
            </div>
            <div className="stars-input" role="radiogroup" aria-label="Оценка">
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  role="radio"
                  aria-checked={formStars === i}
                  tabIndex={0}
                  className={`s${i <= formStars ? ' on' : ''}`}
                  onClick={() => setFormStars(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFormStars(i);
                    }
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Расскажите, как вам приложение..."
            />
            <div className="row">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя (необязательно)"
                style={{ maxWidth: 280 }}
              />
              <button className="btn btn-primary btn-sm" type="submit">
                {editing ? 'Сохранить' : 'Оставить отзыв'}
              </button>
              {editing && (
                <button
                  className="btn btn-ghost btn-sm"
                  type="button"
                  onClick={cancelEdit}
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        )}

        {mine && (
          <Review r={mine} yours onEdit={startEdit} onDelete={del} />
        )}

        {(app.comments || []).map((c, i) => (
          <Review key={i} r={c} />
        ))}
      </div>
    </section>
  );
}
