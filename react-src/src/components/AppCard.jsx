import Tile from './Tile.jsx'
import { fmtNum } from '../utils.js'

export default function AppCard({ app, compact = false }) {
  return (
    <a href={`#/app/${app.id}`} className={`card${compact ? ' compact' : ''}`}>
      {app.author && <span className="badge-author">✦ Alex Play</span>}
      <Tile app={app} size={compact ? 56 : 64} />
      <div className="card-body">
        <div className="card-title">{app.name}</div>
        <div className="card-dev">{app.dev}</div>
        <div className="card-meta">
          <span className="rating">⭐ {app.rating.toFixed(1)}</span>
          <span className="dot">·</span>
          <span className="cat">{app.category}</span>
          {!compact && (
            <>
              <span className="dot">·</span>
              <span className="reviews">{fmtNum(app.reviews)}</span>
            </>
          )}
        </div>
      </div>
    </a>
  )
}
