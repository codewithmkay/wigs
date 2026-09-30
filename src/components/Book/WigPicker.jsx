import { useRef, useState } from 'react'
import { products } from '../../data/products'
import { money } from '../../utils/money'
import { COLORS, DENSITIES, LACES, CAPS, LEN_MIN, LEN_MAX, defaults, unitPrice, lineKey } from './bookData'

export default function WigPicker({ onAdd }) {
  const [id, setId] = useState(products[0].id)
  const [o, setO] = useState(() => defaults(products[0]))
  const [added, setAdded] = useState(false)
  const timer = useRef(null)

  const p = products.find((x) => x.id === id)
  const unit = unitPrice(p, o)
  const hex = (COLORS.find((c) => c[0] === o.color) || [0, '#141216'])[1]

  const pick = (x) => { setId(x.id); setO(defaults(x)) }
  const set = (k, v) => setO((cur) => ({ ...cur, [k]: v }))

  const add = () => {
    onAdd({ key: lineKey(p, o), id: p.id, name: p.name, image: p.image, ...o, unit })
    setAdded(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setAdded(false), 1400)
  }

  return (
    <section className="bo-card" id="bo-pick" aria-labelledby="bo-h-pick">
      <header className="bo-cardhead">
        <span className="bo-step">01</span>
        <h2 id="bo-h-pick">Choose your wig</h2>
      </header>

      <div className="bo-thumbs" role="group" aria-label="Wigs">
        {products.map((x) => (
          <button key={x.id} className="bo-thumb" aria-pressed={x.id === id} onClick={() => pick(x)} aria-label={x.name}>
            <img src={x.image} alt="" loading="lazy" />
            <span>{x.name}</span>
          </button>
        ))}
      </div>

      <div className="bo-build">
        <figure className="bo-preview" style={{ '--a': p.tone[0], '--b': p.tone[1] }}>
          <img src={p.image} alt={p.name} />
          <figcaption>
            <span className="bo-dot" style={{ background: hex }} aria-hidden="true" />
            {o.color} · {o.length}" · {o.density}
          </figcaption>
        </figure>

        <div className="bo-opts">
          <div className="bo-name">
            <h3>{p.name}</h3>
            <p>{p.texture} texture · 100% human hair · pre-plucked</p>
          </div>

          <fieldset className="bo-set">
            <legend>Color <b>{o.color}</b></legend>
            <div className="bo-swatches">
              {COLORS.map(([n, h]) => (
                <button key={n} className="bo-sw" style={{ '--c': h }} aria-pressed={o.color === n}
                  aria-label={n} title={n} onClick={() => set('color', n)} />
              ))}
            </div>
          </fieldset>

          <fieldset className="bo-set">
            <legend>Length <b>{o.length}"</b></legend>
            <input className="bo-range" type="range" min={LEN_MIN} max={LEN_MAX} step="1" value={o.length}
              aria-label="Length in inches" onChange={(e) => set('length', Number(e.target.value))} />
            <div className="bo-scale"><span>{LEN_MIN}"</span><span>{LEN_MAX}"</span></div>
          </fieldset>

          <fieldset className="bo-set">
            <legend>Density</legend>
            <div className="bo-chips">
              {DENSITIES.map(([v, l]) => (
                <button key={v} className="bo-chip" aria-pressed={o.density === v} onClick={() => set('density', v)}>{v} <small>{l}</small></button>
              ))}
            </div>
          </fieldset>

          <fieldset className="bo-set">
            <legend>Lace</legend>
            <div className="bo-chips">
              {LACES.map(([v]) => (
                <button key={v} className="bo-chip" aria-pressed={o.lace === v} onClick={() => set('lace', v)}>{v}</button>
              ))}
            </div>
          </fieldset>

          <fieldset className="bo-set">
            <legend>Cap size</legend>
            <div className="bo-chips">
              {CAPS.map((v) => (
                <button key={v} className="bo-chip" aria-pressed={o.cap === v} onClick={() => set('cap', v)}>{v}</button>
              ))}
            </div>
          </fieldset>

          <div className="bo-buy">
            <div><small>Your price</small><b>{money(unit)}</b></div>
            <button className="bo-btn" onClick={add}>{added ? 'Added ✓' : 'Add to cart'}</button>
          </div>
        </div>
      </div>
    </section>
  )
}