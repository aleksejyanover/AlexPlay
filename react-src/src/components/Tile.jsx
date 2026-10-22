export default function Tile({ app, size = 64 }) {
  return (
    <div
      className="tile"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.5),
        background: `linear-gradient(135deg, ${app.grad[0]}, ${app.grad[1]})`,
      }}
      aria-hidden="true"
    >
      {app.emoji}
    </div>
  )
}
