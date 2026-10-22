export default function SupportPage() {
  return (
    <div className="doc">
      <h1>Поддержка</h1>
      <p className="lead">Мы на связи и помогаем с любыми вопросами по Alex Play.</p>
      <h2>С чем помогаем</h2>
      <ul>
        <li>Не скачивается или не открывается приложение</li>
        <li>Ошибка в описании или нерабочая ссылка</li>
        <li>Предложение по улучшению каталога</li>
      </ul>
      <h2>Как связаться</h2>
      <ul>
        <li>
          GitHub:{' '}
          <a
            className="inline"
            href="https://github.com/aleksejyanover/AlexPlay"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/aleksejyanover/AlexPlay
          </a>{' '}
          — Issues
        </li>
        <li>
          Владелец проекта: <b>aleksejyanover</b>
        </li>
      </ul>
      <p>Обычно отвечаем в течение 1–2 дней.</p>
    </div>
  )
}
