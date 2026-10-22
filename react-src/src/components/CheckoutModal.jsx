import { useEffect, useRef, useState } from 'react'
import Tile from './Tile.jsx'

const NOTE =
  'Демо-режим Alex Play: банковские списания не производятся, данные карт никуда не передаются и не сохраняются.'

/* Проверка номера карты алгоритмом Луна (как в эталоне html/js/detail.js) */
function luhn(num) {
  const d = num.replace(/\D/g, '')
  if (d.length < 13) return false
  let sum = 0
  let alt = false
  for (let i = d.length - 1; i >= 0; i--) {
    let n = +d[i]
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

/* Модалка демо-оплаты. Данные карт живут только в полях формы и уничтожаются
   при закрытии; в localStorage попадает только факт покупки — alexplay_paid_<id>. */
export default function CheckoutModal({ app, onPaid, onClose }) {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState('form') // 'form' | 'processing' | 'success'
  const [num, setNum] = useState('')
  const [exp, setExp] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState('')
  const [errs, setErrs] = useState({})
  const timer = useRef(null)
  const mounted = useRef(false)

  // плавное появление; закрытие по Escape (данные карт уходят вместе с формой)
  useEffect(() => {
    mounted.current = true
    const raf = requestAnimationFrame(() => setOpen(true))
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      mounted.current = false
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  function onNumChange(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 16)
    setNum(v.replace(/(\d{4})(?=\d)/g, '$1 ').trim())
    setErrs((s) => ({ ...s, num: false }))
  }

  function onExpChange(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 4)
    setExp(v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v)
    setErrs((s) => ({ ...s, exp: false }))
  }

  function onCvcChange(e) {
    setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))
    setErrs((s) => ({ ...s, cvc: false }))
  }

  function onNameChange(e) {
    setName(e.target.value.replace(/[^a-zA-Z\s'-]/g, '').toUpperCase())
    setErrs((s) => ({ ...s, name: false }))
  }

  function submit(e) {
    e.preventDefault()
    const next = {
      num: !luhn(num),
      exp: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp),
      cvc: !/^\d{3}$/.test(cvc),
      name: !name.trim(),
    }
    setErrs(next)
    if (next.num || next.exp || next.cvc || next.name) return

    setStage('processing')
    timer.current = setTimeout(() => {
      /* в localStorage — только факт покупки; данные карт существовали лишь в полях формы */
      localStorage.setItem('alexplay_paid_' + app.id, '1')
      onPaid()
      if (mounted.current) setStage('success')
    }, 1400)
  }

  const errCls = (k) => (errs[k] ? 'err' : '')
  const errBox = (k, text) => <div className={`field-err${errs[k] ? ' show' : ''}`}>{text}</div>

  return (
    <div
      className={`modal-overlay${open ? ' open' : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal">
        {stage !== 'success' ? (
          <>
            <div className="modal-hd">
              <Tile app={app} size={52} />
              <div>
                <div className="name">{app.name}</div>
                <div className="price">
                  Цена: <b>{app.price}</b>
                </div>
              </div>
              <button className="modal-close" onClick={onClose} aria-label="Закрыть">
                ✕
              </button>
            </div>

            <div className="pay-secure">🔒 Безопасная оплата</div>
            <div className="pay-title">Данные карты</div>

            <form onSubmit={submit} noValidate>
              <div className="field">
                <label>Номер карты</label>
                <input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  className={errCls('num')}
                  value={num}
                  onChange={onNumChange}
                />
                {errBox('num', 'Проверьте номер карты')}
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Срок действия</label>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="ММ/ГГ"
                    maxLength={5}
                    className={errCls('exp')}
                    value={exp}
                    onChange={onExpChange}
                  />
                  {errBox('exp', 'Формат ММ/ГГ')}
                </div>
                <div className="field">
                  <label>CVC</label>
                  <input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="•••"
                    maxLength={3}
                    className={errCls('cvc')}
                    value={cvc}
                    onChange={onCvcChange}
                  />
                  {errBox('cvc', '3 цифры')}
                </div>
              </div>

              <div className="field">
                <label>Имя на карте</label>
                <input
                  autoComplete="cc-name"
                  placeholder="IVAN IVANOV"
                  style={{ letterSpacing: '.04em' }}
                  className={errCls('name')}
                  value={name}
                  onChange={onNameChange}
                />
              </div>

              <button className="pay-btn" type="submit" disabled={stage === 'processing'}>
                {stage === 'processing' ? (
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
        ) : (
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
            <button className="pay-btn" style={{ marginTop: 20 }} onClick={onClose}>
              Открыть приложение
            </button>
            <div className="pay-note">{NOTE}</div>
          </>
        )}
      </div>
    </div>
  )
}
