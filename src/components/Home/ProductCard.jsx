import { Link } from 'react-router-dom'

export default function ProductCard({ product: p }) {
  return (
    <article className="pcard">
      <Link to={`/product/${p.id}`} className="pcard-art" aria-label={`View ${p.name}`}
        style={{ background: `linear-gradient(160deg, ${p.tone[0]}, ${p.tone[1]})` }}>
        <span className="pcard-len">{p.length}"</span>
      </Link>
      <div className="pcard-info">
        <div>
          <h3>{p.name}</h3>
          <p className="muted">{p.texture}, {p.color}</p>
        </div>
        <b>Ksh.{p.price}</b>
      </div>
    </article>
  )
}