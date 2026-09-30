import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProductCard from './ProductCard'
import { products } from '../../data/products'

gsap.registerPlugin(ScrollTrigger)

export default function Products() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.pr-head > *', {
        y: 36, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.pr-head', start: 'top 88%', once: true },
      })

      gsap.set('.pc', { y: 60, opacity: 0 })
      ScrollTrigger.batch('.pc', {
        start: 'top 92%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' }),
      })
    }, root)

    return () => mm.revert()
  }, [])

  return (
    <section className="pr" ref={root} aria-labelledby="pr-title">
      <div className="pr-in">
        <div className="pr-head">
          <div className="pr-titles">
            <span className="pr-eye">Bestsellers</span>
            <h2 id="pr-title">Featured wigs</h2>
            <p className="muted">Hand-picked human hair units, ready to wear and install.</p>
          </div>
          <Link to="/shop" className="pr-all">
            Shop all
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
        </div>

        <div className="pr-grid">
          {products.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id ?? i} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}