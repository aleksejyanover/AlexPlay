import AppCard from './AppCard.jsx'

export default function Section({ title, apps }) {
  if (!apps.length) return null
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <div className="section-hint">→</div>
      </div>
      <div className="carousel">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  )
}
