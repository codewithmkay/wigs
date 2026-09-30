import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { money } from '../../utils/money'
import { pad, calm } from '../../data/shopConfig'

export default function ShopCard({ p, i }) {
  const card = useRef(null)
  const inner = useRef(null)

  const move = (e) => {
    const r = card.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    card.current.style.setProperty('--mx', x + 'px')
    card.current.style.setProperty('--my', y + 'px')
    if (e.pointerType !== 'mouse' || calm()) return
    gsap.to(inner.current, {
      rotationY: (x / r.width - 0.5) * 12,
      rotationX: -(y / r.height - 0.5) * 12,
      transformPerspective: 900, duration: 0.4, ease: 'power2.out', overwrite: 'auto',
    })
  }
  const leave = () => gsap.to(inner.current, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' })

  return (
    <article className="scard" data-flip-id={p.id} ref={card} onPointerMove={move} onPointerLeave={leave}>
      <Link to={`/product/${p.id}`} className="s-in" ref={inner} style={{ '--a': p.tone[0], '--b': p.tone[1] }}
        aria-label={`${p.name}, ${money(p.price)}`}>
        <img className="s-img" src={p.image} alt="" loading="lazy" />
        <span className="s-shade" aria-hidden="true" />
        <span className="s-id">VLR-{pad(i + 1)}</span>
        <span className="s-len">{p.length}<small>in</small></span>
        <span className="s-brk" aria-hidden="true" />
        <span className="s-spec"><i>{p.lace}</i><i>Pre-plucked</i><i>Human hair</i></span>
        <span className="s-meta">
          <span><b>{p.name}</b><em>{p.texture} / {p.color}</em></span>
          <b className="s-price">{money(p.price)}</b>
        </span>
      </Link>
    </article>
  )
}