// Секция-карусель с горизонтальной прокруткой.
export default function Section({ title, apps, AppCard }) {
  if (!apps.length) return null;
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <span className="section-count">{apps.length} прил.</span>
      </div>
      <div className="rail">
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </section>
  );
}
