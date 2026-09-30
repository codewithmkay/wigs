import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products } from '../../data/products'

gsap.registerPlugin(ScrollTrigger)

// how much page scroll the desktop row needs (1 = full width, lower = shorter/faster)
const PIN_SPEED = 0.75

export default function Showcase() {
  const root = useRef(null)
  const wrap = useRef(null)
  const track = useRef(null)
  const fill = useRef(null)
  const prev = useRef(null)
  const next = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    const section = root.current
    const setFill = (p) => { if (fill.current) fill.current.style.transform = `scaleX(${p})` }

    mm.add(
      {
        pin: '(min-width:801px) and (prefers-reduced-motion: no-preference)',
        native: '(max-width:800px), (prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        /* ---------- DESKTOP: pinned sideways scroll ---------- */
        if (ctx.conditions.pin) {
          section.classList.add('is-pin')
          const t = track.current
          const dist = () => Math.max(t.scrollWidth - window.innerWidth, 0)

          gsap.to(t, {
            x: () => -dist(),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => '+=' + dist() * PIN_SPEED,
              scrub: 0.6,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => setFill(self.progress),
            },
          })

          return () => {
            section.classList.remove('is-pin')
            setFill(0)
          }
        }

        /* ---------- PHONE / TABLET: native swipe slider ---------- */
        const w = wrap.current
        const update = () => {
          const max = w.scrollWidth - w.clientWidth
          const p = max > 0 ? w.scrollLeft / max : 0
          setFill(Math.min(Math.max(p, 0), 1))
          if (prev.current) prev.current.disabled = w.scrollLeft <= 4
          if (next.current) next.current.disabled = w.scrollLeft >= max - 4
        }
        const step = () => {
          const s = w.querySelector('.sc-slide')
          return s ? s.offsetWidth + parseFloat(getComputedStyle(track.current).columnGap || 16) : w.clientWidth * 0.8
        }
        const go = (dir) => () => w.scrollBy({ left: dir * step(), behavior: 'smooth' })
        const onPrev = go(-1)
        const onNext = go(1)

        w.addEventListener('scroll', update, { passive: true })
        prev.current?.addEventListener('click', onPrev)
        next.current?.addEventListener('click', onNext)
        window.addEventListener('resize', update)
        update()

        return () => {
          w.removeEventListener('scroll', update)
          prev.current?.removeEventListener('click', onPrev)
          next.current?.removeEventListener('click', onNext)
          window.removeEventListener('resize', update)
          setFill(0)
        }
      },
      root
    )

    return () => mm.revert()
  }, [])

  return (
    <section className="showcase" ref={root} aria-label="Wig lengths">
      <div className="sc-head">
        <div className="sc-top">
          <div className="sc-titles">
            <h2>Find your length</h2>
            <p className="muted sc-hint-d">Keep scrolling. Every style, one row.</p>
            <p className="muted sc-hint-m">Swipe through every style.</p>
          </div>

          <div className="sc-nav">
            <button ref={prev} type="button" aria-label="Previous wig">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button ref={next} type="button" aria-label="Next wig">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <div className="sc-bar" aria-hidden="true"><i className="sc-fill" ref={fill} /></div>
      </div>

      <div className="sc-wrap" ref={wrap}>
        <div className="sc-track" ref={track}>
          {products.map((p) => (
            <Link
              to="/shop"
              key={p.id}
              className="sc-slide"
              aria-label={`${p.name}, view in shop`}
              draggable="false"
              style={{ background: `linear-gradient(160deg, ${p.tone[0]}, ${p.tone[1]})` }}
            >
              <img className="sc-img" src={p.image} alt="" loading="lazy" draggable="false" />
              <span className="sc-shade" aria-hidden="true" />
              <span className="sc-len">{p.length}"</span>
              <div className="sc-info">
                <b>{p.name}</b>
                <div className="sc-tags">
                  {p.texture && <span>{p.texture}</span>}
                  {p.color && <span>{p.color}</span>}
                </div>
              </div>
            </Link>
          ))}

          <Link to="/shop" className="sc-slide sc-end" draggable="false">
            <b>See every wig</b>
            <span className="btn">Shop all</span>
          </Link>
        </div>
      </div>
    </section>
  )
}