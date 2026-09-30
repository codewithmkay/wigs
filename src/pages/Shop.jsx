import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { products } from '../data/products'
import { money } from '../utils/money'
import ShopHeader from '../components/Shop/ShopHeader'
import ShopDock from '../components/Shop/ShopDock'
import ShopGrid from '../components/Shop/ShopGrid'
import { LENGTHS, MAXP, inRange, calm } from '../data/shopConfig'

gsap.registerPlugin(Flip)

export default function Shop() {
  const root = useRef(null)
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
    max < MAXP && ['max', `Up to ${money(max)}`, MAXP],
  ].filter(Boolean)

  // intro animation
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

  // filter / view change animation
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

  return (
    <section className="shop" ref={root}>
      <ShopHeader count={list.length} />
      <ShopDock
        q={q} texture={texture} length={length} sort={sort} max={max}
        view={view} active={active}
        setParam={setParam} changeView={changeView} clear={clear}
      />
      <ShopGrid list={list} view={view} onReset={clear} />
    </section>
  )
}