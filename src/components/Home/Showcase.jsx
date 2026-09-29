import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products } from '../../data/products'

gsap.registerPlugin(ScrollTrigger)

export default function Showcase() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const track = root.current.querySelector('.sc-track')
      const dist = () => Math.max(track.scrollWidth - window.innerWidth, 0)

      gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + dist(),
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set('.sc-fill', { scaleX: self.progress }),
        },
      })
    }, root)

    return () => mm.revert()
  }, [])

  return (
    <section className="showcase" ref={root}>
      <div className="sc-head">
        <h2>Find your length</h2>
        <p className="muted">Keep scrolling. Every style, one row.</p>
        <div className="sc-bar" aria-hidden="true"><i className="sc-fill" /></div>
      </div>

      <div className="sc-wrap">
        <div className="sc-track">
          {products.map((p) => (
            <Link
              to={`/product/${p.id}`}
              key={p.id}
              className="sc-slide"
              style={{ background: `linear-gradient(160deg, ${p.tone[0]}, ${p.tone[1]})` }}
            >
              <span className="sc-len">{p.length}"</span>
              <div>
                <b>{p.name}</b>
                <span>{p.texture} / {p.color}</span>
              </div>
            </Link>
          ))}

          <Link to="/shop" className="sc-slide sc-end">
            <b>See every wig</b>
            <span className="btn">Shop all</span>
          </Link>
        </div>
      </div>
    </section>
  )
}