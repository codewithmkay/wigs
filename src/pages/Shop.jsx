import { useLayoutEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
// import { products } from '../data/products'
import { products } from '../data/products'

import ProductCard from '../components/Home/ProductCard'

const TEXTURES = ['All', 'Straight', 'Wavy', 'Curly']
const LENGTHS = [
  ['all', 'Any length'],
  ['short', 'Short (up to 14")'],
  ['medium', 'Medium (15 to 22")'],
  ['long', 'Long (23"+)'],
]
const SORTS = [
  ['featured', 'Featured'],
  ['low', 'Price: low to high'],
  ['high', 'Price: high to low'],
  ['long', 'Length: longest first'],
]

const inRange = (len, key) =>
  key === 'short' ? len <= 14 : key === 'medium' ? len > 14 && len <= 22 : key === 'long' ? len > 22 : true

export default function Shop() {
  const root = useRef(null)
  const [params, setParams] = useSearchParams()

  const texture = params.get('texture') || 'All'
  const length = params.get('length') || 'all'
  const sort = params.get('sort') || 'featured'

  const setParam = (key, value, fallback) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    let out = products.filter(
      (p) => (texture === 'All' || p.texture === texture) && inRange(p.length, length)
    )
    if (sort === 'low') out = [...out].sort((a, b) => a.price - b.price)
    if (sort === 'high') out = [...out].sort((a, b) => b.price - a.price)
    if (sort === 'long') out = [...out].sort((a, b) => b.length - a.length)
    return out
  }, [texture, length, sort])

  const filtered = texture !== 'All' || length !== 'all' || sort !== 'featured'
  const listKey = list.map((p) => p.id).join('-')

  // page intro
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.shop-head > *', { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' })
      gsap.from('.shop-tools', { y: 20, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' })
    }, root)
    return () => mm.revert()
  }, [])

  // cards animate in whenever the result set changes
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.pcard',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' })
    }, root)
    return () => mm.revert()
  }, [listKey])

  return (
    <section className="shop" ref={root}>
      <div className="shop-head">
        <h1>Shop wigs</h1>
        <p className="muted">100% human hair, pre-plucked, ready to install.</p>
      </div>

      <div className="shop-tools">
        <div className="chips" role="group" aria-label="Filter by texture">
          {TEXTURES.map((t) => (
            <button key={t} className="chip" aria-pressed={texture === t} onClick={() => setParam('texture', t, 'All')}>
              {t}
            </button>
          ))}
        </div>

        <div className="tools-row">
          <label className="sr" htmlFor="f-length">Length</label>
          <select id="f-length" value={length} onChange={(e) => setParam('length', e.target.value, 'all')}>
            {LENGTHS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          <label className="sr" htmlFor="f-sort">Sort</label>
          <select id="f-sort" value={sort} onChange={(e) => setParam('sort', e.target.value, 'featured')}>
            {SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          {filtered && (
            <button className="clear" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
          )}
          <span className="count muted" aria-live="polite">
            {list.length} {list.length === 1 ? 'wig' : 'wigs'}
          </span>
        </div>
      </div>

      {list.length ? (
        <div className="pgrid">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="shop-empty">
          <h2>No wigs match those filters.</h2>
          <p className="muted">Try a different length or texture.</p>
          <button className="btn" onClick={() => setParams({}, { replace: true })}>Clear filters</button>
        </div>
      )}
    </section>
  )
}