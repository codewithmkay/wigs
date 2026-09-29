import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { products } from '../data/products' // change if you moved it

gsap.registerPlugin(Flip)

const TEXTURES = ['All', 'Straight', 'Wavy', 'Curly']
const LENGTHS = [['all', 'Any length'], ['short', 'Short (up to 14")'], ['medium', 'Medium (15 to 22")'], ['long', 'Long (23"+)']]
const SORTS = [['featured', 'Featured'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['long', 'Length: longest first']]
const MAXP = Math.ceil(Math.max(...products.map((p) => p.price)) / 10) * 10
const inRange = (n, k) => (k === 'short' ? n <= 14 : k === 'medium' ? n > 14 && n <= 22 : k === 'long' ? n > 22 : true)
const pad = (n) => String(n).padStart(2, '0')
const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* text that decodes itself on load */
function useScramble(ref, text) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.textContent = text
    if (calm()) return
    const chars = '01<>/[]{}#*+'
    const o = { p: 0 }
    const tw = gsap.to(o, {
      p: 1, duration: 1.4, ease: 'none', delay: 0.4,
      onUpdate() {
        const n = Math.floor(o.p * text.length)
        el.textContent = text.slice(0, n) +
          [...text.slice(n)].map((c) => (c === ' ' ? ' ' : chars[(Math.random() * chars.length) | 0])).join('')
      },
      onComplete() { el.textContent = text },
    })
    return () => tw.kill()
  }, [text, ref])
}

function ShopCard({ p, i }) {
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
        aria-label={`${p.name}, $${p.price}`}>
        <span className="s-id">VLR-{pad(i + 1)}</span>
        <span className="s-len">{p.length}<small>in</small></span>
        <span className="s-brk" aria-hidden="true" />
        <span className="s-spec"><i>{p.lace}</i><i>Pre-plucked</i><i>Human hair</i></span>
        <span className="s-meta">
          <span><b>{p.name}</b><em>{p.texture} / {p.color}</em></span>
          <b className="s-price">${p.price}</b>
        </span>
      </Link>
    </article>
  )
}

export default function Shop() {
  const root = useRef(null)
  const tagRef = useRef(null)
  const cntEl = useRef(null)
  const cnt = useRef({ v: products.length })
  const flipState = useRef(null)
  const [view, setView] = useState('grid')
  const [params, setParams] = useSearchParams()

  const q = params.get('q') || ''
  const texture = params.get('texture') || 'All'
  const length = params.get('length') || 'all'
  const sort = params.get('sort') || 'featured'
  const max = Number(params.get('max')) || MAXP

  const capture = () => { flipState.current = Flip.getState('.scard') }
  const setParam = (key, value, fallback) => {
    capture()
    const next = new URLSearchParams(params)
    if (!value || String(value) === String(fallback)) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }
  const clear = () => { capture(); setParams({}, { replace: true }) }
  const changeView = (v) => { capture(); setView(v) }

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    let out = products.filter((p) =>
      (texture === 'All' || p.texture === texture) &&
      inRange(p.length, length) && p.price <= max &&
      (!term || `${p.name} ${p.color} ${p.texture} ${p.lace}`.toLowerCase().includes(term)))
    if (sort === 'low') out = [...out].sort((a, b) => a.price - b.price)
    if (sort === 'high') out = [...out].sort((a, b) => b.price - a.price)
    if (sort === 'long') out = [...out].sort((a, b) => b.length - a.length)
    return out
  }, [q, texture, length, sort, max])

  const active = [
    q && ['q', `"${q}"`, ''],
    texture !== 'All' && ['texture', texture, 'All'],
    length !== 'all' && ['length', LENGTHS.find(([v]) => v === length)[1], 'all'],
    max < MAXP && ['max', `Up to $${max}`, MAXP],
  ].filter(Boolean)

  useScramble(tagRef, '100% human hair. Pre-plucked. Ready to wear.')

  // page intro
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.sh-title span', { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' })
      gsap.from('.sh-count', { opacity: 0, y: 20, duration: 0.8, delay: 0.5 })
      gsap.from('.dock', { y: 30, opacity: 0, duration: 0.9, delay: 0.5, ease: 'power3.out' })
      gsap.fromTo('.scard', { y: 60, opacity: 0, clipPath: 'inset(0 0 100% 0 round 24px)' },
        { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0 round 24px)', duration: 1, stagger: 0.08, delay: 0.7,
          ease: 'power3.out', clearProps: 'transform,opacity,clipPath' })
      gsap.to('.sh-aurora', { xPercent: 12, yPercent: -10, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, root)
    return () => mm.revert()
  }, [])

  // results glide into place when filters or view change
  const listKey = list.map((p) => p.id).join('-')
  useLayoutEffect(() => {
    const st = flipState.current
    if (!st) return
    flipState.current = null
    if (calm()) return
    Flip.from(st, {
      duration: 0.7, ease: 'power3.inOut', stagger: 0.025,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, delay: 0.15 }),
    })
  }, [listKey, view])

  // counter tween
  useEffect(() => {
    const t = gsap.to(cnt.current, {
      v: list.length, duration: 0.6, ease: 'power2.out',
      onUpdate: () => { if (cntEl.current) cntEl.current.textContent = pad(Math.round(cnt.current.v)) },
    })
    return () => t.kill()
  }, [list.length])

  return (
    <section className="shop" ref={root}>
      <header className="sh-head">
        <div className="sh-aurora" aria-hidden="true" />
        <div>
          <p className="sh-tag" ref={tagRef} aria-label="100% human hair. Pre-plucked. Ready to wear." />
          <h1 className="sh-title" aria-label="Shop wigs">
            <div className="hl"><span>Shop</span></div>
            <div className="hl"><span>wigs</span></div>
          </h1>
        </div>
        <div className="sh-count" aria-live="polite">
          <b ref={cntEl}>{pad(products.length)}</b>
          <span>of {pad(products.length)} wigs</span>
        </div>
      </header>

      <div className="dock">
        <div className="dock-row">
          <div className="dsearch">
            <label htmlFor="f-q" className="sr">Search wigs</label>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            <input id="f-q" type="search" placeholder="Search name, color, lace" value={q}
              onChange={(e) => setParam('q', e.target.value, '')} />
          </div>
          <div className="views" role="group" aria-label="View">
            <button aria-pressed={view === 'grid'} onClick={() => changeView('grid')} aria-label="Grid view">
              <svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" /><rect x="14" y="4" width="6" height="6" /><rect x="4" y="14" width="6" height="6" /><rect x="14" y="14" width="6" height="6" /></svg>
            </button>
            <button aria-pressed={view === 'big'} onClick={() => changeView('big')} aria-label="Large view">
              <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="7" /><rect x="4" y="14" width="16" height="6" /></svg>
            </button>
          </div>
        </div>

        <div className="dchips" role="group" aria-label="Filter by texture">
          {TEXTURES.map((t) => (
            <button key={t} className="dchip" aria-pressed={texture === t} onClick={() => setParam('texture', t, 'All')}>{t}</button>
          ))}
        </div>

        <div className="dock-row dock-sel">
          <label className="sr" htmlFor="f-length">Length</label>
          <select id="f-length" value={length} onChange={(e) => setParam('length', e.target.value, 'all')}>
            {LENGTHS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <label className="sr" htmlFor="f-sort">Sort</label>
          <select id="f-sort" value={sort} onChange={(e) => setParam('sort', e.target.value, 'featured')}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <label className="price" htmlFor="f-max">
            <span>Up to <b>${max}</b></span>
            <input id="f-max" type="range" min="100" max={MAXP} step="10" value={max}
              onChange={(e) => setParam('max', e.target.value, MAXP)} />
          </label>
        </div>

        {active.length > 0 && (
          <div className="dactive">
            {active.map(([key, label, fb]) => (
              <button key={key} className="dtag" onClick={() => setParam(key, '', fb)} aria-label={`Remove filter ${label}`}>
                {label} <span aria-hidden="true">&times;</span>
              </button>
            ))}
            <button className="dclear" onClick={clear}>Clear all</button>
          </div>
        )}
      </div>

      {list.length ? (
        <div className={'sgrid' + (view === 'big' ? ' big' : '')}>
          {list.map((p, i) => <ShopCard key={p.id} p={p} i={products.findIndex((x) => x.id === p.id)} />)}
        </div>
      ) : (
        <div className="sh-empty">
          <h2>Nothing in range.</h2>
          <p className="muted">No wigs match those filters. Loosen one and try again.</p>
          <button className="btn" onClick={clear}>Reset everything</button>
        </div>
      )}
    </section>
  )
}