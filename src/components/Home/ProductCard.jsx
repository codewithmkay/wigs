import { Link } from 'react-router-dom'

const money = (v) =>
  typeof v === 'number' ? `KSh ${v.toLocaleString('en-KE')}` : v

export default function ProductCard({ product: p, index = 0 }) {
  const name = p.name || 'Wig'
  const tone = p.tone || ['#2b2540', '#7c5cff']
  const sub = [p.texture, p.color].filter(Boolean).join(' / ')

  return (
    <article className="pc">
      <Link to="/shop" className="pc-link" aria-label={`${name}, view in shop`}>
        <div className="pc-art" style={{ '--a': tone[0], '--b': tone[1] }}>
          {p.image && (
            <img className="pc-img" src={p.image} alt="" loading="lazy" decoding="async" draggable="false" />
          )}
          <span className="pc-shade" aria-hidden="true" />

          <span className="pc-no">{String(index + 1).padStart(2, '0')}</span>
          {p.length && <span className="pc-len">{p.length}"</span>}

          <span className="pc-view">
            View
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8" /></svg>
          </span>
        </div>

        <div className="pc-info">
          <div className="pc-txt">
            <h3>{name}</h3>
            {sub && <p className="muted">{sub}</p>}
          </div>
          <b className="pc-price">{money(p.price)}</b>
        </div>
      </Link>
    </article>
  )
}