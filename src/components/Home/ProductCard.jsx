import { Link } from 'react-router-dom'

const money = (v) =>
  typeof v === 'number' ? `KSh ${v.toLocaleString('en-KE')}` : v

export default function ProductCard(props) {
  const p = props.product || props.p || props.item || props.data
  const index = props.index ?? 0

  if (!p) return null

  const name = p.name || p.title || 'Wig'
  const tone = Array.isArray(p.tone) ? p.tone : ['#2b2540', '#7c5cff']
  const image = p.image || p.img || p.photo

  return (
    <article className="pc">
      <Link to="/shop" className="pc-link" aria-label={`${name}, view in shop`}>
        <div className="pc-art" style={{ '--a': tone[0], '--b': tone[1] }}>
          {image && (
            <img className="pc-img" src={image} alt="" loading="lazy" decoding="async" draggable="false" />
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
          <div className="pc-row">
            <h3>{name}</h3>
            <b className="pc-price">{money(p.price)}</b>
          </div>
          <div className="pc-tags">
            {p.texture && <span>{p.texture}</span>}
            {p.color && <span>{p.color}</span>}
          </div>
        </div>
      </Link>
    </article>
  )
}