import { Link } from 'react-router-dom'
import { money } from '../../utils/money'

export default function ProductCard({ product: p }) {
  return (
    <article className="pcard">
      <Link to={`/product/${p.id}`} className="pcard-art" aria-label={`View ${p.name}`}
        style={{ '--a': p.tone[0], '--b': p.tone[1] }}>
        <img src={p.image} alt={`${p.name}, ${p.length} inch ${p.texture.toLowerCase()} wig`} loading="lazy" />
        <span className="pcard-len">{p.length}"</span>
      </Link>
      <div className="pcard-info">
        <div>
          <h3>{p.name}</h3>
          <p className="muted">{p.texture}, {p.color}</p>
        </div>
        <b>{money(p.price)}</b>
      </div>
    </article>
  )
}